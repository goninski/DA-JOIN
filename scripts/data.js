const fetchUrl = "https://da-join-449-default-rtdb.europe-west1.firebasedatabase.app/"
let localStorageMode = false;
let categories = [];
let contacts = [];
let tasks = [];
// let lastId = '';
// let lastCategoryId = '';
// let lastContactId = '';
// let lastTaskId = '';
let dataArr = [];
let authUserId = null;

async function initData() {
    getMainTemplates();
    await getAllData();
    await renderAllData();
}

async function renderAllData() {
    await renderTempTaskList();
}



// FIREBASE DATA HANDLING

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
    // console.log(fetchObj);
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



// DATA HANDLING WRAPPER FUNCTIONS

async function getAllData() {
    if(localStorageMode) {
        await getAllDataFromLS();
        // if(! contacts || ! tasks) {
        //     resetToDemoData();
        // }
    } else {
        await getAllDataFromDB();
    }
}

async function getUserData() {
    if(localStorageMode) {
        await getContactsFromLS();
        // if(! contacts) {
        //     resetToDemoData();
        // }
    } else {
        await getContactsFromDB();
    }
}

async function getCategoriesFromDB() {
    categories = await fetchDataFromFirebase('categories/');
}

async function getContactsFromDB() {
    contacts = await fetchDataFromFirebase('users/');
}

async function getTasksFromDB() {
    tasks = await fetchDataFromFirebase('tasks/');
}

async function saveCategoryToDB(category) {
    let categoryId
    if(category.id && category.id > 0) {
        categoryId = category.id;
    } else {
        return alert('Category not saved due missing Id !');
    }
    await saveDataToFirebase('categories/' + categoryId, category);
    // await saveLastIdToDB('categories', lastCategoryId)
}

async function deleteCategoryFromDB(categoryId) {
    await deleteFirebaseData('categories/' + categoryId);
}

async function saveContactToDB(contact, mode = 'add') {
    let contactId
    if(contact.id && contact.id > 0) {
        contactId = contact.id;
    } else {
        return alert('Contact not saved due missing Id !');
    }
    await saveDataToFirebase('users/' + contactId, contact);
}

async function createContact(contact) {
    await saveContactToDB(contact);
}

async function updateContact(contact) {
    await saveContactToDB(contact, 'update');
}

async function deleteContactFromDB(contactId) {
    await deleteFirebaseData('users/' + contactId);
}

async function getNextContactId() {
    let lastId = await getLastIdFromObjArray(contacts);
    return lastId + 1;
}



async function saveTaskToDB(task, mode = 'add') {
    let taskId;
    if(task.id && task.id > 0) {
        taskId = task.id;
    } else {
        return alert('Task not saved due missing Id !');
    }
    await saveDataToFirebase('tasks/' + taskId, task);
}

async function createTaskDB(task) {
    await saveTaskToDB(task);
}

async function updateTaskDB(task) {
    await saveTaskToDB(task, 'update');
}

async function deleteTaskFromDB(taskId) {
    await deleteFirebaseData('tasks/' + taskId);
 }

async function getNextTaskId() {
    let lastId = await getLastIdFromObjArray(tasks);
    return lastId + 1;
}







// DATA HANDLING LOCAL STORAGE > TEMPORARY

async function getFromLocalStorage(key){
    return await JSON.parse(localStorage.getItem(key));
}

async function saveToLocalStorage(key, data){
    localStorage.setItem(key, JSON.stringify(data));
}

async function clearLocalStorage(){
    localStorage.clear();
}

async function getAllDataFromLS() {
    getCategoriesFromLS();
    getContactsFromLS();
    getTasksFromLS();
}

async function saveAllDataToLS() {
    saveCategoriesToLS();
    saveContactsToLS();
    saveTasksToLS();
}

async function getCategoriesFromLS() {
    categories = await getFromLocalStorage('categories');
}

async function getContactsFromLS() {
    contacts = await getFromLocalStorage('contacts');
}

async function getTasksFromLS() {
    tasks = await getFromLocalStorage('tasks');
}

async function saveCategoriesToLS() {
    if(localStorageMode) {
        saveToLocalStorage('categories', categories);
    }
}

async function saveContactsToLS() {
    if(localStorageMode) {
        saveToLocalStorage('contacts', contacts);
    }
}

async function saveTasksToLS() {
    if(localStorageMode) {
        saveToLocalStorage('tasks', tasks);
    }
}

