let localStorageMode = false;
let fetchUrl = "https://da-join-449-default-rtdb.europe-west1.firebasedatabase.app/"
// let fetchUrl = "eigene URL"
let categories = [];
let contacts = [];
let tasks = [];
let dataArr = [];
let authUserId = null;


/**
 * Shorthand to get all data
 */
async function getAllData() {
    await getContacts();
    await getTasks();
    await getCategories();
}


/**
 * Get users (wrapper for getContacts, user/contacts are combined)
 */
async function getUserData() {
    await getContacts();
}


/**
 * Shorthand to get task data including categories
 */
async function getTaskData() {
    await getTasks();
    await getCategories();
}


/**
 * Get contacts from db/ls (and assign it to the 'contacts' object array)
 */
async function getContacts() {
    contacts = localStorageMode ? await getFromLocalStorage('contacts') : await fetchDataFromFirebase('users/');
    await sortContacts(contacts);
}


/**
 * Get Tasks from db/ls (and assign it to the 'tasks' object array)
 */
async function getTasks() {
    tasks = localStorageMode ? await getFromLocalStorage('tasks') : await fetchDataFromFirebase('tasks/');
}


/**
 * Get categories from db/ls (and assign it to the 'categories' object array)
 */
async function getCategories() {
    categories = localStorageMode ? await getFromLocalStorage('categories') : await fetchDataFromFirebase('categories/');
}


/**
 * Create a new contact (validate contact object, add to contacts array and save to db/ls)
 * 
 * @param {object} contact - a contact object
 */
async function createContact(contact) {
    await validateContactProperties(contact);
    contacts.push(contact);
    localStorageMode ? await saveContactsToLS() : await saveContactToDB(contact);
}


/**
 * Update existing contact (validate contact object and update db/ls)
 * 
 * @param {object} contact - a contact object
 */
async function updateContact(contact) {
    await validateContactProperties(contact);
    // await sortContacts(contacts);
    localStorageMode ? await saveContactsToLS() : await saveContactToDB(contact, 'update');
}


/**
 * Update (add or delete) a single contact property in db/ls
 * 
 * @param {string} contactId - id of the contact
 * @param {string} property - property name to update
 * @param {*} value - property value (null = delete property)
 */
async function updateContactProperty(contactId, property, value = null) {
    let index = await getContactIndexFromId(contactId);
    console.log(index);
    let contact = contacts[index];
    value === null ? delete contact[property] : contact[property] = value;
    console.log(contacts);
    localStorageMode ? await saveContactsToLS() : await saveContactToDB(contact, 'update');
}


/**
 * Validate a contact object
 * 
 * @param {object} contact - a contact object
 */
async function validateContactProperties(contact) {
    contact.id = hasLength(contact.id) ? contact.id : await getNewContactId();
    contact.initials = await getInitialsOfFirstAndLastWord(contact.name);
    !hasLength(contact.color) ? contact.color = getRandomColor() : null;
    !hasLength(contact.phone) ? delete contact.phone : null;
}


/**
 * Get a new contact id (by checking the current highest number)
 * 
 * @returns {string}
 */
async function getNewContactId() {
    let lastId = await getMaxIdFromObjArray(contacts);
    lastId++;
    return lastId.toString();
}


/**
 * Save a contact object to db
 * 
 * @param {object} contact - a contact object
 * @param {string} mode - mode (add, update) currently not is use
 */
async function saveContactToDB(contact, mode = 'add') {
    let contactId;
    if(hasLength(contact.id)) {
        contactId = contact.id;
    } else {
        return alert('Contact not saved due missing Id !');
    }
    await saveDataToFirebase('users/' + contactId, contact);
}


/**
 * Delete a contact from db/ls (and from contacts object array)
 * 
 * @param {string} contactId - id of the contact object
 */
async function deleteContact(contactId) {
    let index = getContactIndexFromId(contactId);
    index >= 0 ? contacts.splice(index, 1) : null;
    localStorageMode ? await saveContactsToLS() : await deleteFirebaseData('users/' + contactId);
    await removeDeletedContactsFromTasks(contactId);
}


/**
 * Remove deleted contacts from task assignment
 * 
 * @param {string} deletedContactId - id of the deleted contact
 */
async function removeDeletedContactsFromTasks(deletedContactId) {
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i]
        let index = task.contactIds.indexOf(deletedContactId)
        index >= 0 ? task.contactIds.splice(index, 1) : null;
        await updateTaskProperty(task.id, 'contacts');
    }
}




/**
 * Update a category object in db (or local storage)
 * 
 * @param {object} category - a category object
 */
async function updateCategory(category) {
    localStorageMode ? await saveCategoriesToLS() : await saveCategoryToDB(category);
    console.log(categories);
}


/**
 * Get a new category id (by checking the current highest number)
 * 
 * @returns {string}
 */
async function getNewCategoryId() {
    let lastId = await getMaxIdFromObjArray(categories);
    lastId++;
    return lastId.toString();
}


/**
 * Save a category object to db
 * 
 * @param {object} category - a category object
 */
async function saveCategoryToDB(category) {
    let categoryId;
    if(hasLength(category.id)) {
        categoryId = category.id;
    } else {
        return alert('Category not saved due missing Id !');
    }
    await saveDataToFirebase('categories/' + categoryId, category);
}



/**
 * Save a task object to db
 * 
 * @param {object} task - a task object
 * @param {string} mode - mode (add, update) currently not is use
 */
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


/**
 * Get a new task id (by checking the current highest number)
 * 
 * @returns {string}
 */
async function getNewTaskId() {
    let lastId = await getMaxIdFromObjArray(tasks);
    lastId++;
    return lastId.toString();
}


async function updateSubtaskStatus(taskId, subtaskIndex, value) {
    // console.log(taskInputs);
    let index = await getTaskIndexFromId(taskId);
    let task = tasks[index];
    task.subtasks[subtaskIndex].done = value;
    console.log(tasks);
    localStorageMode ? await saveTasksToLS() : await saveTaskToDB(task, 'update');
}





/**
 * Delete task from db/ls (and from tasks object array)
 * 
 * @param {string} taskId - id of the task object
 */
async function deleteTask(taskId) {
    let index = getTaskIndexFromId(taskId);
    index >= 0 ? tasks.splice(index, 1) : null;
    localStorageMode ? await saveTasksToLS() : await deleteFirebaseData('tasks/' + taskId);
}


/**
 * Delete category from db/ls (and from categories object array)
 * 
 * @param {string} categoryId - id of the category object
 */
async function deleteCategory(categoryId) {
    let index = getCategoryIndexFromId(categoryId);
    index >= 0 ? categories.splice(index, 1) : null;
    localStorageMode ? await saveCategoriesToLS() : await deleteFirebaseData('categories/' + categoryId);
    // await removeDeletedCategoryFromTasks(categoryId);
}


/**
 * Delete all data from db/ls
 */
async function deleteAllData() {
    localStorageMode ? await deleteDataFromLS() : await deleteFirebaseData('');

}






/**
 * Fetch data from firebase
 * 
 * @param {string} fetchPath - sub path (users, tasks, categories etc.)
 * @param {boolean} raw - true: return raw fetch object (no conversion to array)
 */
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


/**
 * Convert firebase fetch object to js object array
 * @param {object} fetchObj - raw fetch object
 * @returns {array}
 */
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


/**
 * Save/Update data to firebase
 * 
 * @param {string} fetchPath - sub path (users, tasks, categories etc.)
 * @param {array} dataArr - data array (???)
 * @param {string} postMethode - fetch methode (use PUT only)
 */
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


/**
 * Delete data from firebase
 * 
 * @param {string} fetchPath - sub path to delete (empty for all data)
 */
async function deleteFirebaseData(fetchPath="x") {
    let response = await fetch(fetchUrl + fetchPath + ".json",{
        method: "DELETE",
    });
    dataObj = await response.json();
}



/**
 * Wrapper: Save tasks (object array) to local storage
 */
async function saveTasksToLS() {
    saveToLocalStorage('tasks', tasks);
}


/**
 * Wrapper: Save categories (object array) to local storage
 */
async function saveCategoriesToLS() {
    saveToLocalStorage('categories', categories);
}


/**
 * Wrapper: Save contacts (object array) to local storage
 */
async function saveContactsToLS() {
    saveToLocalStorage('contacts', contacts);
}


/**
 * Get item data from local storage
 * @param {*} key - local storage key
 */
async function getFromLocalStorage(key){
    return await JSON.parse(localStorage.getItem(key));
}


/**
 * Save item data to local storage
 * @param {*} key - local storage key
 * @param {*} data - data
 */
async function saveToLocalStorage(key, data){
    localStorage.setItem(key, JSON.stringify(data));
}


/**
 * Clear local storage
 */
async function clearLocalStorage(){
    localStorage.clear();
}

