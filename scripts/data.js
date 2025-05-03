const fetchUrl = "https://da-join-449-default-rtdb.europe-west1.firebasedatabase.app/"
let localStorageMode = true;
let categories = [];
let categoriesDefault = [];
let contacts = [];
let tasks = [];
let contactsDemo = [];
let tasksDemo = [];
let lastId = '';
let lastCategoryId = '';
let lastContactId = '';
let lastTaskId = '';
let dataArr = [];

function getLastIdFromObjArray(objArray) {
    return Math.max(...objArray.map(item => item.id));
}

categoriesDefault = [
    {
        "id": "101",
        "name": "Technical Task"
    },
    {
        "id": "102",
        "name": "User Story"
    },
];
categories = categoriesDefault;
lastCategoryId = getLastIdFromObjArray(categories);
// lastCategoryId = Math.max(...categories.map(category => category.id));

contactsDemo = [
    {
        "id": "1001",
        "name": "Roger Federer",
        "email": "roger@federer.ch",
        "phone": "+41 99 888 77 66",
    },
    {
        "id": "1002",
        "name": "Novak Djokovic",
        "email": "novak@djokovic.rs",
        "phone": "+381 99 888 77 66",
    },
    {
        "id": "1003",
        "name": "Rafael Nadal",
        "email": "rafael@nadal.es",
        "phone": "+34 111 222 333",
    },
    {
        "id": "1004",
        "name": "Carlos Alcaraz",
        "email": "carlos@alcaraz.es",
        "phone": "+34 555 666 777",
    },
    {
        "id": "1005",
        "name": "Boris Becker",
        "email": "boris@becker.de",
        "phone": "+49 999 888 777",
    },
    {
        "id": "1011",
        "name": "François Gonin",
        "email": "francois@gonin.ch",
        "phone": "+41 99 888 77 66",
    },
    {
        "id": "1012",
        "name": "Nico Hässler",
        "email": "nico@haessler.de",
        "phone": "+49 999 888 777",
    },
    {
        "id": "1013",
        "name": "Julian Kraske",
        "email": "julian@kraske.de",
        "phone": "+49 777 888 999",
    },
    {
        "id": "1014",
        "name": "Vivienne Wündisch",
        "email": "vivienne@wuendisch.de",
        "phone": "+49 111 222 333",
    },
    {
        "id": "1015",
        "name": "Developer Akademie",
        "email": "info@developerakademie.com",
    },
];

tasksDemo = [
    {
        "id": "10001",
        "title": "Title Task 1...",
        "description": "Description Task 1...",
        "dueDate": "2025-04-01",
        "priority": "high",
        "contactIds": ['1001', '1002', '1003'],
        "categoryId": '101',
        "subtasks": ["Subtask 1"]
        // "subtasks": [
        //     {"title": "Subtask 1","status": 1},
        //     {"title": "Subtask 2","status": 0},
        // ]
    },
    {
        "id": "10002",
        "title": "Title Task 2...",
        "description": "Description Task 2...",
        "dueDate": "2025-03-31",
        "priority": "medium",
        "contactIds": ['1004', '1006'],
        "categoryId": '102',
        "subtasks": ["Subtask 1","Subtask 2"]
    },
    {
        "id": "10003",
        "title": "Title Task 3...",
        "description": "Description Task 3...",
        "dueDate": 0,
        "priority": "low",
        "contactIds": ['1005', '1009'],
        // "categoryId": '102',
        "subtasks": ["Subtask 1","Subtask 2","Subtask 3"]
    },
];




// GET & SAVE DATA

// getAllData();
async function getAllData() {
    if(localStorageMode) {
        await getAllDataFromLS();
    } else {
        await getAllDataFromDB();
    }
    if(! contacts || ! tasks) {
        setDemoData();
    }
}

async function setDemoData() {
    categories = categoriesDefault;
    contacts = contactsDemo;
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    tasks = tasksDemo;
    lastCategoryId = getLastIdFromObjArray(categories);
    lastContactId = getLastIdFromObjArray(contacts);
    lastTaskId = getLastIdFromObjArray(tasks);
    contacts.forEach(function(contact) {
        if(! contact.initials) {
            contact.initials = getInitialsOfFirstAndLastWord(contact.name);
        }
        if(! contact.color) {
            contact.color = getRandomColor();
        }
    });
    if(localStorageMode) {
        await clearLocalStorage();
        await saveCategoriesToLS();
        await saveContactsToLS();
        await saveTasksToLS();
    } else {
        await deleteAllDataFromDB();
        await saveAllCategoriesToDB();
        await saveAllContactsToDB();
        await saveAllTasksToDB();
    }
    location.reload()
}



// DATA HANDLING FIREBASE

// function test() {
//     let contact = contacts[0];
//     console.log(contact);
//     contact.initials = 'RFF';
//     console.log(contact);
//     saveContactToDB(contact);
// }

async function fetchDataFromFirebase(fetchPath = '', raw = false) {
    let response = await fetch(fetchUrl + fetchPath + '.json');
    let fetchObj = await response.json();
    if(fetchObj) {
        if(raw) {
            return fetchObj;
        }
        return firebaseObjToArray(fetchObj);
    }
}

async function firebaseObjToArray(fetchObj) {
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
    // console.log(key);
}


async function deleteFirebaseData(fetchPath="x") {
    let response = await fetch(fetchUrl + fetchPath + ".json",{
        method: "DELETE",
    });
    dataObj = await response.json();
}

async function getAllDataFromDB() {
    await getCategoriesFromDB();
    await getContactsFromDB();
    await getTasksFromDB();
}

async function getCategoriesFromDB() {
    categories = await fetchDataFromFirebase('categories/');
    lastCategoryId = await getLastIdFromDB('categories');
    // let x = await fetchDataFromFirebase('categories/');
    // let y = await getLastIdFromDB('categories');
    // console.log(x);
    // console.log(y);
}

async function getContactsFromDB() {
    // contacts = await fetchDataFromFirebase('users/');
    // lastContactId = await getLastIdFromDB('users');
    let x = await fetchDataFromFirebase('users/');
    let y = await getLastIdFromDB('users');
    console.log(x);
    console.log(y);
}

async function getTasksFromDB() {
    // tasks = await fetchDataFromFirebase('tasks/');
    // lastTaskId = await getLastIdFromDB('tasks');
    let x = await fetchDataFromFirebase('tasks/');
    let y = await getLastIdFromDB('tasks');
    console.log(x);
    console.log(y);
}

async function getLastIdFromDB(type) {
    let lastId = await fetchDataFromFirebase('lastId/' +  type, true);
    console.log(lastId);
    return lastId;
}

async function saveCategoryToDB(category) {
    let categoryId = category.id;
    saveDataToFirebase('categories/' + categoryId, category);
    saveLastIdToDB('categories', lastCategoryId)
}

async function saveContactToDB(contact, mode = 'add') {
    let contactId = contact.id;
    saveDataToFirebase('users/' + contactId, contact);
    if(mode == 'add') {
        saveLastIdToDB('users', lastContactId)
    }
}

async function saveTaskToDB(task, mode = 'add') {
    let taskId = task.id;
    saveDataToFirebase('tasks/' + taskId, task);
    if(mode == 'add') {
        saveLastIdToDB('tasks', lastTaskId)
    }
}

async function saveLastIdToDB(type, lastId) {
    saveDataToFirebase('lastId/' + type, lastId);
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
    categories.forEach(function(category) {
        saveCategoryToDB(category);
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

function getAllDataFromLS() {
    getCategoriesFromLS();
    getContactsFromLS();
    getTasksFromLS();
}

function saveAllDataToLS() {
    saveCategoriesToLS();
    saveContactsToLS();
    saveTasksToLS();
}

function getCategoriesFromLS() {
    categories = getFromLocalStorage('categories');
    lastCategoryId = getFromLocalStorage('lastCategoryId');
}

function getContactsFromLS() {
    contacts = getFromLocalStorage('contacts');
    lastContactId = getFromLocalStorage('lastContactId');
}

function getTasksFromLS() {
    tasks = getFromLocalStorage('tasks');
    lastTaskId = getFromLocalStorage('lastTaskId');
}

function saveCategoriesToLS() {
    if(localStorageMode) {
        saveToLocalStorage('categories', categories);
        saveToLocalStorage('lastCategoryId', lastCategoryId);
    }
}

function saveContactsToLS() {
    if(localStorageMode) {
        saveToLocalStorage('contacts', contacts);
        saveToLocalStorage('lastContactId', lastContactId);
    }
}

function saveTasksToLS() {
    if(localStorageMode) {
        saveToLocalStorage('tasks', tasks);
        saveToLocalStorage('lastTaskId', lastTaskId);
    }
}

