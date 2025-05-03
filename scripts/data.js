let localStorageMode = false;
let categories = [];
let categoriesDefault = [];
let contacts = [];
let tasks = [];
let lastCategoryId = 0;
// let lastContactId = 0;
let lastTaskId = 0;
let contactsDemo = [];
let tasksDemo = [];
let contactsDemoOld = [];
let lastId = 0;
let dataArr = [];
const fetchUrl = "https://da-join-449-default-rtdb.europe-west1.firebasedatabase.app/"

categoriesDefault = [
    {
        "id": "1",
        "name": "Technical Task"
    },
    {
        "id": "2",
        "name": "User Story"
    },
];
categories = categoriesDefault;
lastCategoryId = categories.length - 1;

contactsDemo = [
    {
        "id": "101",
        "name": "Roger Federer",
        "email": "roger@federer.ch",
        "phone": "+41 99 888 77 66",
        "initials": "RF",
        "color": "orange"
    },
    {
        "id": "102",
        "name": "Novak Djokovic",
        "email": "novak@djokovic.rs",
        "phone": "+381 99 888 77 66",
        "initials": "ND",
        "color": "pink"
    },
    {
        "id": "103",
        "name": "Rafael Nadal",
        "email": "rafael@nadal.es",
        "phone": "+34 111 222 333",
        "initials": "RN",
        "color": "violet"
    },
    {
        "id": "104",
        "name": "Carlos Alcaraz",
        "email": "carlos@alcaraz.es",
        "phone": "+34 555 666 777",
        "initials": "CA",
        "color": "violet"
    },
    {
        "id": "105",
        "name": "Boris Becker",
        "email": "boris@becker.de",
        "phone": "+49 999 888 777",
        "initials": "BB",
        "color": "violet"
    },
];

contactsDemoOld = [
    {
        "id": "1",
        "name": "François Gonin",
        "email": "mail@goninski.dev",
        "phone": "+41 78 888 77 66",
        "initials": "FG",
        "color": "violet"
    },
    {
        "id": "2",
        "name": "Nico Hässler",
        "email": "nico@email.com",
        "phone": "",
        "initials": "NH",
        "color": "orange"
    },
    {
        "id": "3",
        "name": "Julian Kraske",
        "email": "julian@email.com",
        "phone": "",
        "initials": "JK",
        "color": "pink"
    },
    {
        "id": "4",
        "name": "Vivienne Wündisch",
        "email": "vivienne@email.com",
        "phone": "",
        "initials": "VW",
        "color": "lightblue"
    },
    {
        "id": "5",
        "name": "Viva Müller",
        "email": "viva@email.com",
        "phone": "",
        "initials": "WM",
        "color": "#806000"
    },
    {
        "id": "6",
        "name": "Nadine Müller",
        "email": "nadine@email.com",
        "phone": "",
        "initials": "NM",
        "color": "green"
    },
];

tasksDemo = [
    {
        "id": "1",
        "title": "Title Task 1...",
        "description": "Description Task 1...",
        "dueDate": "2025-04-01",
        "priority": "high",
        "contactIds": [1, 2, 3],
        "categoryId": 1,
        "subtasks": ["Subtask 1"]
        // "subtasks": [
        //     {"title": "Subtask 1","status": 1},
        //     {"title": "Subtask 2","status": 0},
        // ]
    },
    {
        "id": "2",
        "title": "Title Task 2...",
        "description": "Description Task 2...",
        "dueDate": "2025-03-31",
        "priority": "medium",
        "contactIds": [2, 3],
        "categoryId": 2,
        "subtasks": ["Subtask 1","Subtask 2"]
    },
    {
        "id": "3",
        "title": "Title Task 3...",
        "description": "Description Task 3...",
        "dueDate": 0,
        "priority": "low",
        "contactIds": [3, 1],
        "categoryId": 0,
        "subtasks": ["Subtask 1","Subtask 2","Subtask 3"]
    },
];




// GET & SAVE DATA

// getAllData();
async function getAllData() {
    localStorageMode = true;
    getCategoryData(localStorageMode);
    getContactData(localStorageMode);
    getTaskData(localStorageMode);
    if(! contacts || ! tasks) {
        setDemoData(localStorageMode);
    }
}

function setDemoData(localStorageMode = false) {
    deleteAllData();
    categories = categoriesDefault;
    contacts = contactsDemo;
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    tasks = tasksDemo;
    lastCategoryId = categories.length - 1;
    lastTaskId = tasks.length;
    saveCategoryData(localStorageMode);
    saveContactData(localStorageMode);
    saveTaskData(localStorageMode);
    location.href = location.pathname;
}

function getCategoryData() {
    if(localStorageMode) {
        lastId = getFromLocalStorage('lastCategoryId');
        dataArr = getFromLocalStorage('categories');
    } else {
        dataArr = getCategoriesFromDB();
    }
    setCategories(dataArr, lastId);
}

function setCategories(dataArr, lastId) {
    categories = dataArr;
    lastCategoryId = lastId;
    console.log(categories);
}

function getContactData() {
    if(localStorageMode) {
        dataArr = getFromLocalStorage('contacts');
    } else {
        dataArr = getContactsFromDB();
    }
    setContacts(dataArr);
}

function setContacts(dataArr) {
    contacts = dataArr;
    console.log(contacts);
}

function getTaskData() {
    if(localStorageMode) {
        dataArr = getFromLocalStorage('tasks');
        lastId = getFromLocalStorage('lastTaskId');
    } else {
        dataArr = getTasksFromDB();
    }
    setTasks(dataArr, lastId);
}

function setTasks(dataArr, lastId) {
    tasks = dataArr;
    lastTaskId = lastId;
    console.log(tasks);
}

function saveCategoryData() {
    if(localStorageMode) {
        saveCategoriesToLS();
    } else {
        saveCategoriesToDB();
    }
}

function saveContactData() {
    if(localStorageMode) {
        saveContactsToLS();
    } else {
        saveContactsToDB();
    }
}

function saveTaskData() {
    if(localStorageMode) {
        saveTasksToLS();
    } else {
        saveTasksToDB();
    }
}

function deleteAllData(localStorageMode = false) {
    if(localStorageMode) {
        clearLocalStorage();
    } else {
        deleteAllDataFromDB();
    }
}




// DATA HANDLING FIREBASE

async function fetchDataFromFirebase(fetchPath = '') {
    let response = await fetch(fetchUrl + fetchPath + '.json');
    let fetchObj = await response.json();
    if(fetchObj) {
        return firebaseObjToArray(fetchObj);
    }
}

function firebaseObjToArray(fetchObj) {
    dataArr = [];
    console.log(fetchObj);
    let fetchEntries = Object.entries(fetchObj);
    console.log(fetchEntries);
    fetchEntries.forEach(function(item) {
        dataArr.push(item[1]);
    });
    // console.log(dataArr);
    return dataArr;
};

async function saveDataToFirebase(fetchPath, dataArr, postMethode="PUT") {
    let str = JSON.stringify(dataArr);
    console.log(str);
    let response = await fetch(fetchUrl + fetchPath + '.json', {
        method: postMethode,
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataArr),
    });
    let key = await response.json();
    console.log(key);
}


async function deleteFirebaseData(fetchPath="x") {
    let response = await fetch(fetchUrl + fetchPath + ".json",{
        method: "DELETE",
    });
    dataObj = await response.json();
}

async function getCategoriesFromDB() {
    dataArr = await fetchDataFromFirebase('categories/');
    console.log(dataArr);
}

async function getContactsFromDB() {
    dataArr = await fetchDataFromFirebase('users/');
    console.log(dataArr);
}

async function getTasksFromDB() {
    dataArr = await fetchDataFromFirebase('tasks/');
    console.log(dataArr);
}

async function saveCategoryToDB(category) {
    // console.log(category);
    saveDataToFirebase('categories/' + category.Id, category);
}

async function saveContactToDB(contact) {
    // console.log(contact);
    saveDataToFirebase('users/' + contact.Id, contact);
}

async function saveTaskToDB(task) {
    // console.log(task);
    saveDataToFirebase('tasks/' + task.Id, task);
}

async function deleteCategoryFromDB(categoryId) {
    deleteFirebaseData('categories/' + categoryId);
}

async function deleteContactFromDB(contactId) {
    deleteFirebaseData('users/' + contactId);
}

async function deleteTaskFromDB(taskId) {
    deleteFirebaseData('tasks/' + taskId);
}



async function saveAllDataToDB() {
    await getAllData();
    await deleteAllDataFromDB();
    await saveAllCategoriesToDB();
    await saveAllContactsToDB();
    await saveAllTasksToDB();
}

async function saveAllCategoriesToDB() {
    console.log(categories);
    categories.forEach(function(item) {
        saveCategoryToDB(item);
    });
}

async function saveAllContactsToDB() {
    contacts.forEach(function(item) {
        saveContactToDB(item);
    });
}

async function saveAllTasksToDB() {
    tasks.forEach(function(item) {
        saveTaskToDB(item);
    });
}

async function deleteAllDataFromDB(fetchPath="") {
    deleteFirebaseData(fetchPath);
}




// DATA HANDLING LOCAL STORAGE > TEMPORARY

function getFromLocalStorage(key){
    return JSON.parse(localStorage.getItem(key));
}

function saveToLocalStorage(key, data){
    localStorage.setItem(key, JSON.stringify(data));
}

function clearLocalStorage(){
    localStorage.clear();
}

// function getCategoriesFromLS() {
//     categories = getFromLocalStorage('categories');
//     lastCategoryId = getFromLocalStorage('lastCategoryId');
// }

// function getContactsFromLS() {
//     // contacts = getFromLocalStorage('contacts');
//     // lastContactId = getFromLocalStorage('lastContactId');
//     return getFromLocalStorage('contacts');
// }

// function getTasksFromLS() {
//     tasks = getFromLocalStorage('tasks');
//     lastTaskId = getFromLocalStorage('lastTaskId');
// }

function saveCategoriesToLS() {
    saveToLocalStorage('categories', categories);
    saveToLocalStorage('lastCategoryId', lastCategoryId);
}

function saveContactsToLS() {
    saveToLocalStorage('contacts', contacts);
    // saveToLocalStorage('lastContactId', lastContactId);
}

function saveTasksToLS() {
    saveToLocalStorage('tasks', tasks);
    saveToLocalStorage('lastTaskId', lastTaskId);
}

