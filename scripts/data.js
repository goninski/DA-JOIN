const fetchUrl = "https://da-join-449-default-rtdb.europe-west1.firebasedatabase.app/"
let localStorageMode = false;
let categories = [];
let contacts = [];
let tasks = [];
let lastId = '';
let lastCategoryId = '';
let lastContactId = '';
let lastTaskId = '';
let dataArr = [];

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
    lastCategoryId = await getLastIdFromDB('categories');
    // let x = await fetchDataFromFirebase('categories/');
    // let y = await getLastIdFromDB('categories');
    // console.log(x);
    // console.log(y);
}

async function getContactsFromDB() {
    contacts = await fetchDataFromFirebase('users/');
    lastContactId = await getLastIdFromDB('users');
    // let x = await fetchDataFromFirebase('users/');
    // let y = await getLastIdFromDB('users');
    // console.log(x);
    // console.log(y);
}

async function getTasksFromDB() {
    tasks = await fetchDataFromFirebase('tasks/');
    lastTaskId = await getLastIdFromDB('tasks');
    // let x = await fetchDataFromFirebase('tasks/');
    // let y = await getLastIdFromDB('tasks');
    // console.log(x);
    // console.log(y);
}

async function getLastIdFromDB(type) {
    let lastId = await fetchDataFromFirebase('lastId/' +  type, true);
    // console.log(lastId);
    return lastId;
}

async function saveCategoryToDB(category) {
    let categoryId = category.id;
    await saveDataToFirebase('categories/' + categoryId, category);
    await saveLastIdToDB('categories', lastCategoryId)
}

async function saveContactToDB(contact, mode = 'add') {
    let contactId
    if(contact.id && contact.id > 0) {
        contactId = contact.id;
        // console.log('i) has contactId');
    } else {
        if(mode == 'add' && lastContactId > 0) {
            // lastContactId = await getLastIdFromDB('users');
            lastContactId++;
            contactId = lastContactId;
            // console.log('i) new contactId');
            await saveLastIdToDB('users', contactId)
        } else {
            return alert('Contact is not saved due missing Id !');
        }
    }
    await saveDataToFirebase('users/' + contactId, contact);
}

async function createContact(contact) {
    await saveContactToDB(contact);
}

async function updateContact(contact) {
    await saveContactToDB(contact, 'update');
}

async function saveTaskToDB(task, mode = 'add') {
    let taskId = task.id;
    await saveDataToFirebase('tasks/' + taskId, task);
    if(mode == 'add') {
        await saveLastIdToDB('tasks', lastTaskId)
    }
}

async function createTaskDB(task) {
    await saveTaskToDB(task);
}

async function updateTaskDB(task) {
    await saveTaskToDB(task, 'update');
}

async function deleteCategoryFromDB(categoryId) {
    await deleteFirebaseData('categories/' + categoryId);
}

async function deleteContactFromDB(contactId) {
    await deleteFirebaseData('users/' + contactId);
}

async function deleteTaskFromDB(taskId) {
   await deleteFirebaseData('tasks/' + taskId);
}

async function saveLastIdToDB(type, lastId) {
    await saveDataToFirebase('lastId/' + type, lastId);
}

async function getLastIdFromObjArray(objArray) {
    return Math.max(...objArray.map(item => item.id));
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
    lastCategoryId = await getFromLocalStorage('lastCategoryId');
}

async function getContactsFromLS() {
    contacts = await getFromLocalStorage('contacts');
    lastContactId = await getFromLocalStorage('lastContactId');
}

async function getTasksFromLS() {
    tasks = await getFromLocalStorage('tasks');
    lastTaskId = await getFromLocalStorage('lastTaskId');
}

async function saveCategoriesToLS() {
    if(localStorageMode) {
        saveToLocalStorage('categories', categories);
        saveToLocalStorage('lastCategoryId', lastCategoryId);
    }
}

async function saveContactsToLS() {
    if(localStorageMode) {
        saveToLocalStorage('contacts', contacts);
        saveToLocalStorage('lastContactId', lastContactId);
    }
}

async function saveTasksToLS() {
    if(localStorageMode) {
        saveToLocalStorage('tasks', tasks);
        saveToLocalStorage('lastTaskId', lastTaskId);
    }
}

