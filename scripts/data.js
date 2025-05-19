let localStorageMode = false;
let fetchUrl = "https://da-join-449-default-rtdb.europe-west1.firebasedatabase.app/"
// let fetchUrl = "eigene URL"
let categories = [];
let contacts = [];
let tasks = [];
let dataArr = [];
let authUserId = null;


async function initData() {
    getMainTemplates();
    await getAllData();
    // await renderAllData();
}

async function renderAllData() {
    await renderTempTaskList();
}



// GET DATA

async function getAllData() {
    await getContacts();
    await getCategories();
    await getTasks();
}

async function getCategories() {
    categories = localStorageMode ? await getFromLocalStorage('categories') : await fetchDataFromFirebase('categories/');
}

async function getContacts() {
    contacts = localStorageMode ? await getFromLocalStorage('contacts') : await fetchDataFromFirebase('users/');
    await sortContacts(contacts);
}

async function getTasks() {
    tasks = localStorageMode ? await getFromLocalStorage('tasks') : await fetchDataFromFirebase('tasks/');
}

async function getUserData() {
    await getContacts();
}

async function getTaskData() {
    await getCategories();
    await getTasks();
}



// SAVE DATA (CREATE/UPDATE)

// async function getNewCategoryId() {
//     let lastId = await getMaxIdFromObjArray(categories);
//     lastId++;
//     return lastId.toString();
// }

async function getNewContactId() {
    let lastId = await getMaxIdFromObjArray(contacts);
    lastId++;
    return lastId.toString();
}

async function getNewTaskId() {
    let lastId = await getMaxIdFromObjArray(tasks);
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
    await validateContactProperties(contact);
    contacts.push(contact);
    localStorageMode ? await saveContactsToLS() : await saveContactToDB(contact);
}

async function updateContact(contact) {
    await validateContactProperties(contact);
    // await sortContacts(contacts);
    localStorageMode ? await saveContactsToLS() : await saveContactToDB(contact, 'update');
}

async function updateContactProperty(contactId, property, value = null) {
    let index = await getContactIndexFromId(contactId);
    console.log(index);
    let contact = contacts[index];
    value === null ? delete contact[property] : contact[property] = value;
    console.log(contacts);
    localStorageMode ? await saveContactsToLS() : await saveContactToDB(contact, 'update');
}

async function validateContactProperties(contact) {
    contact.id = hasLength(contact.id) ? contact.id : await getNewContactId();
    contact.initials = await getInitialsOfFirstAndLastWord(contact.name);
    !hasLength(contact.color) ? contact.color = getRandomColor() : null;
    !hasLength(contact.phone) ? delete contact.phone : null;
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

async function createTask(task) {
    await validateTaskProperties(task);
    tasks.push(task);
    console.log(currentTask);
    console.log(task);
    console.log(tasks);
    localStorageMode ? await saveTasksToLS() : await saveTaskToDB(task);
}

async function updateTask(task) {
    // console.log(taskInputs);
    await validateTaskProperties(task);
    console.log(currentTask);
    console.log(task);
    console.log(tasks);
    localStorageMode ? await saveTasksToLS() : await saveTaskToDB(task, 'update');
}

async function validateTaskProperties(task) {
    delete task.searchBase;
    task.id = hasLength(task.id) ? task.id : await getNewTaskId();
    task.status = hasLength(task.status) ? task.status : 'todo';
    !hasLength(task.description) ? delete task.description : null;
    !hasLength(task.contacts) ? delete task.contacts : null;
    !hasLength(task.subtasks) ? delete task.subtasks : null;
}

async function updateTaskProperty(taskId, property, value = null) {
    // console.log(taskInputs);
    let index = await getTaskIndexFromId(taskId);
    let task = tasks[index];
    value === null ? delete task[property] : task[property] = value;
    await updateTask(task);
    // console.log(tasks);
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
    let index = getCategoryIndexFromId(categoryId);
    index >= 0 ? categories.splice(index, 1) : null;
    localStorageMode ? await saveCategoriesToLS() : await deleteFirebaseData('categories/' + categoryId);
    // await removeDeletedCategoryFromTasks(categoryId);
}

async function deleteContact(contactId) {
    let index = getContactIndexFromId(contactId);
    index >= 0 ? contacts.splice(index, 1) : null;
    localStorageMode ? await saveContactsToLS() : await deleteFirebaseData('users/' + contactId);
    await removeDeletedContactsFromTasks(contactId);
}

async function deleteTask(taskId) {
    let index = getTaskIndexFromId(taskId);
    index >= 0 ? tasks.splice(index, 1) : null;
    localStorageMode ? await saveTasksToLS() : await deleteFirebaseData('tasks/' + taskId);
}

async function deleteAllData() {
    localStorageMode ? await deleteDataFromLS() : await deleteFirebaseData('');

}

async function removeDeletedContactsFromTasks(deletedContactId) {
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i]
        let index = task.contactIds.indexOf(deletedContactId)
        index >= 0 ? task.contactIds.splice(index, 1) : null;
        await updateTaskProperty(task.id, 'contacts');
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
async function renderTempTaskList(renderTasks = tasks) {
    formMode = '';
    let taskListRef = document.getElementById('tempTaskList');
    taskListRef.innerHTML = '';
    if(hasLength(renderTasks)) {
        for (let index = 0; index < renderTasks.length; index++) {
            taskListRef.innerHTML += await getTempTaskListTemplate(renderTasks[index]);
        }
    }
}

async function getTempTaskListTemplate(task) {
    return `
    <li class="flex-row gap justify-between align-center fw-bold">#${task.id} | ${task.title}
        <button class="" style="margin-left: auto; text-decoration: underline;" onclick="showTaskBtn(event, '${task.id}')">Show</button>
        <button class="" style="text-decoration: underline;" onclick="openEditTaskForm(event, '${task.id}')">Edit</button>
        <button class="" style="text-decoration: underline;" onclick="submitDeleteTask(event, '${task.id}')">Delete</button>
    </li>
    `
}

// let testObj;
// async function getDataFromDB() {
//     testObj = await fetchDataFromFirebase('', true);
//     console.log(testObj);
// }
