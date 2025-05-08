let localStorageMode = false;
const fetchUrl = "https://da-join-449-default-rtdb.europe-west1.firebasedatabase.app/"
let categories = [];
let contacts = [];
let tasks = [];
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



// GET DATA

async function getAllData() {
    await getCategories();
    await getContacts();
    await getTasks();
}

async function getCategories() {
    categories = localStorageMode ? await getFromLocalStorage('categories') : await fetchDataFromFirebase('categories/');
}

async function getContacts() {
    contacts = localStorageMode ? await getFromLocalStorage('contacts') : await fetchDataFromFirebase('users/');
}

async function getUserData() {
    await getContacts();
}

async function getTasks() {
    tasks = localStorageMode ? await getFromLocalStorage('tasks') : await fetchDataFromFirebase('tasks/');
}



// SAVE DATA (CREATE/UPDATE)

// async function getNewCategoryId() {
//     let lastId = await getLastIdFromObjArray(categories);
//     lastId++;
//     return lastId.toString();
// }

async function getNewContactId() {
    let lastId = await getLastIdFromObjArray(contacts);
    lastId++;
    return lastId.toString();
}

async function getNewTaskId() {
    let lastId = await getLastIdFromObjArray(tasks);
    lastId++;
    return lastId.toString();
}

async function saveCategoryToDB(category) {
    let categoryId;
    if(hasLength(category.id)) {
        categoryId = category.id;
    } else {
        return alert('Category not saved due missing Id !');
    }
    await saveDataToFirebase('categories/' + categoryId, category);
}

async function updateCategory(category) {
    localStorageMode ? await saveCategoriesToLS() : await saveCategoryToDB(category);
    console.log(categories);
}

async function saveContactToDB(contact, mode = 'add') {
    let contactId;
    if(hasLength(contact.id)) {
        contactId = contact.id;
    } else {
        return alert('Contact not saved due missing Id !');
    }
    await saveDataToFirebase('users/' + contactId, contact);
}

async function createContact(contact) {
    localStorageMode ? await saveContactsToLS() : await saveContactToDB(contact);
    console.log(contacts);
}

async function updateContact(contactId) {
    let index = await getContactIndexFromId(contactId);
    let contact = contacts[index];
    localStorageMode ? await saveContactsToLS() : await saveContactToDB(contact, 'update');
    console.log(contacts);
}

async function saveTaskToDB(task, mode = 'add') {
    let taskId;
    if(hasLength(task.id)) {
        taskId = task.id;
        await saveDataToFirebase('tasks/' + taskId, task);
    } else {
        return alert('Task not saved due missing Id !');
    }
}

async function createTask(taskInputs = null) {
    let task = {};
    task.id =  await getNewTaskId();
    console.log(task);
    await setTaskProperties(task, taskInputs);
    console.log(task);
    tasks.push(task);
    localStorageMode ? await saveTasksToLS() : await saveTaskToDB(task);
    console.log(tasks);
}

async function updateTask(taskId, taskInputs = null) {
    // console.log(taskInputs);
    let index = await getTaskIndexFromId(taskId);
    let task = tasks[index];
    await setTaskProperties(task, taskInputs);
    console.log(tasks);
    localStorageMode ? await saveTasksToLS() : await saveTaskToDB(task, 'update');
}

async function setTaskProperties(task, taskInputs = null) {
    console.log(taskInputs);
    if(taskInputs) {
        task.title = taskInputs.title;
        task.description = taskInputs.description;
        task.dueDate = taskInputs.dueDate;
        task.priority = taskInputs.priority;
        task.categoryId = taskInputs.categoryId;
        task.status = hasLength(taskInputs.status) ? taskInputs.status : 'To do';
        hasLength(taskInputs.contactIds) ? task.contactIds = taskInputs.contactIds : delete task.contactIds;
        hasLength(taskInputs.subtasks) ? task.subtasks = taskInputs.subtasks : delete task.subtasks;
    }
    // await setTaskProgress(task);
    task.id = hasLength(task.id) ? task.id : await getNewContactId();
    task.status = hasLength(task.status) ? task.status : 'To do';
    await deleteEmptyProperties(task);
}

async function deleteEmptyProperties(task) {
    if(!hasLength(task.description)) {
        delete task.description;
    }
}

async function updateTaskProperty(taskId, property, value) {
    // console.log(taskInputs);
    let index = await getTaskIndexFromId(taskId);
    let task = tasks[index];
    task[property] = value;
    console.log(tasks);
    localStorageMode ? await saveTasksToLS() : await saveTaskToDB(task, 'update');
}

async function updateSubtaskStatus(taskId, subtaskIndex, value) {
    // console.log(taskInputs);
    let index = await getTaskIndexFromId(taskId);
    let task = tasks[index];
    task.subtasks[subtaskIndex].done = value;
    console.log(tasks);
    localStorageMode ? await saveTasksToLS() : await saveTaskToDB(task, 'update');
}


// DELETE DATA

async function deleteCategory(categoryId) {
    localStorageMode ? await saveCategoriesToLS() : await deleteFirebaseData('categories/' + categoryId);
}

async function deleteContact(contactId) {
    localStorageMode ? await saveContactsToLS() : await deleteFirebaseData('users/' + contactId);
}

async function deleteTask(taskId) {
    localStorageMode ? await saveTasksToLS() : await deleteFirebaseData('tasks/' + taskId);
}

async function deleteAllData() {
    localStorageMode ? await deleteDataFromLS() : await deleteFirebaseData('');

}




// SINGLE PROPERTY QUERIES/UPDATES

async function changeTaskStatus(event = null, taskId, statusNew, statusOld = null) {
    event ? event.stopPropagation() : null;
    await updateTaskProperty(taskId, 'status', statusNew);
    // renderBoard(statusNew);
    // statusOld ? renderBoard(statusOld) : null;
}

async function toggleSubtaskStatus(event = null, taskId, subtaskIndex) {
    event ? event.stopPropagation() : null;
    let index = await getTaskIndexFromId(taskId);
    let status = tasks[index].subtasks[subtaskIndex].done;
    await updateSubtaskStatus(taskId, subtaskIndex, !status);
}

async function getSubtaskProgress(task, type = 'progress') {
        if(!task.subtasks || task.subtasks.length <= 0) {
            return null;
        }
        let subtasksDone = 0;
        task.subtasks.forEach(function(subtask) {
            if(subtask.done) {
                subtasksDone++;
            }
        });
        let subtasksTotal = task.subtasks.length;
        if(type == 'count') {
            return (subtasksDone + '/' + subtasksTotal);
        } else {
            return (subtasksDone / subtasksTotal * 100);
        }
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
    // console.log(fetchEntries);
    fetchEntries.forEach(function(item) {
        dataArr.push(item[1]);
    });
    // console.log(dataArr);
    return dataArr;
};

async function saveDataToFirebase(fetchPath, dataArr, postMethode="PUT") {
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



// LOCAL STORAGE HANDLING

async function getFromLocalStorage(key){
    return await JSON.parse(localStorage.getItem(key));
}

async function saveToLocalStorage(key, data){
    localStorage.setItem(key, JSON.stringify(data));
}

async function clearLocalStorage(){
    localStorage.clear();
}

async function saveCategoriesToLS() {
    saveToLocalStorage('categories', categories);
}

async function saveContactsToLS() {
    saveToLocalStorage('contacts', contacts);
}

async function saveTasksToLS() {
    saveToLocalStorage('tasks', tasks);
}

async function deleteDataFromLS() {
    // localStorage.clear();
    localStorage.removeItem('categories');
    localStorage.removeItem('contacts');
    localStorage.removeItem('tasks');
}




// TEMP STUFF
async function renderTempTaskList() {
    formMode = '';
    let taskListRef = document.getElementById('tempTaskList');
    taskListRef.innerHTML = '';
    if(hasLength(tasks)) {
        for (let index = 0; index < tasks.length; index++) {
            taskListRef.innerHTML += await getTempTaskListTemplate(tasks[index]);
        }
    }
}

async function getTempTaskListTemplate(task) {
    return `
    <li class="flex-row gap justify-between align-center fw-bold">#${task.id} | ${task.title}
        <button class="" style="margin-left: auto; text-decoration: underline;" onclick="showTask(event, '${task.id}')">Show</button>
        <button class="" style="text-decoration: underline;" onclick="editTask(event, '${task.id}')">Edit</button>
        <button class="" style="text-decoration: underline;" onclick="deleteTask(event, '${task.id}')">Delete</button>
    </li>
    `
}

// let testObj;
// async function getDataFromDB() {
//     testObj = await fetchDataFromFirebase('', true);
//     console.log(testObj);
// }
