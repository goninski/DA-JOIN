let localStorageMode = false;
let fetchUrl = "https://da-join-449-default-rtdb.europe-west1.firebasedatabase.app/"
let categories = [];
let contacts = [];
let tasks = [];
let dataArr = [];
let authUserId = null;


/**
 * Get all data from db/ls (create object arrays of contacts, tasks, categories)
 */
async function getAllData() {
    await getContacts();
    await getTasks();
    await getCategories();
}


/**
 * Get users from db/ls (create object arrays of contacts (user/contacts are combined))
 */
async function getUserData() {
    await getContacts();
}


/**
 * Get task data from db/ls (create object arrays of tasks, categories)
 */
async function getTaskData() {
    await getTasks();
    await getCategories();
}


/**
 * Get contacts from db/ls (and create 'contacts' object array)
 */
async function getContacts() {
    contacts = localStorageMode ? await getFromLocalStorage('contacts') : await fetchDataFromFirebase('users/');
    await sortContacts(contacts);
}


/**
 * Get Tasks from db/ls (and create 'tasks' object array)
 */
async function getTasks() {
    tasks = localStorageMode ? await getFromLocalStorage('tasks') : await fetchDataFromFirebase('tasks/');
    await sortTasks(tasks, 'dueDate');
}


/**
 * Get categories from db/ls (and create 'categories' object array)
 */
async function getCategories() {
    categories = localStorageMode ? await getFromLocalStorage('categories') : await fetchDataFromFirebase('categories/');
}


/**
 * Helper: return a task object by id
 * 
 * @param {string} taskId - task id
 */
async function getTaskById(taskId) {
    return tasks ? tasks.find(task => task.id == taskId) : null;
}


/**
 * Helper: return a contact object by id
 * 
 * @param {string} contactId - contact id
 */
async function getContactById(contactId) {
    return contacts ? contacts.find(contact => contact.id == contactId) : null;
}


/**
 * Helper: return a category object by id
 * 
 * @param {string} categoryId - category id
 */
async function getCategoryById(categoryId) {
    return categories ? categories.find(category => category.id == categoryId) : null;
}


/**
 * Helper: check if user (email address) already exists
 * 
 * @param {string} email - email address
 * @returns {boolean} - true if user already exists
 */
async function isExistingContact(email) {
    await getUserData();
    if(contacts) {
        let user = await contacts.find(contact => contact.email == email);
        return user ? true : false;
    }
    return false;
}


/**
 * Create a new contact on db/ls (incl. validate contact object and add to contacts object array)
 * 
 * @param {object} contact - a contact object
 */
async function createContact(contact) {
    await sanitizeContactProperties(contact);
    !contacts ? contacts = [] : null;
    contacts.push(contact);
    localStorageMode ? await saveContactsToLS() : await saveContactToDB(contact);
}


/**
 * Create a new task on db/ls (incl. validate task object and add to tasks object array)
 * 
 * @param {object} task - a task object
 */
async function createTask(task) {
    await sanitizeTaskProperties(task);
    !tasks ? tasks = [] : null;
    tasks.push(task);
    localStorageMode ? await saveTasksToLS() : await saveTaskToDB(task);
}


/**
 * Update existing contact on db/ls (incl. validate contact object)
 * 
 * @param {object} contact - a contact object
 */
async function updateContact(contact) {
    await sanitizeContactProperties(contact);
    if(contacts) {
        let index = await getContactIndexFromId(contact.id);
        contacts[index] = contact;
    };
    localStorageMode ? await saveContactsToLS() : await saveContactToDB(contact, 'update');
}


/**
 * Update existing task on db/ls (incl. validate task object)
 * 
 * @param {object} task - a task object
 */
async function updateTask(task) {
    await sanitizeTaskProperties(task);
    if(tasks) {
        let index = await getTaskIndexFromId(task.id);
        tasks[index] = task;
    };
    localStorageMode ? await saveTasksToLS() : await saveTaskToDB(task, 'update');
}


/**
 * Update a category object in db/ls
 * 
 * @param {object} category - a category object
 */
async function updateCategory(category) {
    localStorageMode ? await saveCategoriesToLS() : await saveCategoryToDB(category);
}


/**
 * Update, add or delete a single contact property in db/ls
 * 
 * @param {string} contactId - id of the contact object
 * @param {string} property - property name to update
 * @param {*} value - property value (null = delete property)
 */
async function updateContactProperty(contactId, property, value = null) {
    let contact = await getContactById(contactId);
    if(contact) {
        value === null ? delete contact[property] : contact[property] = value;
        localStorageMode ? await saveContactsToLS() : await saveContactToDB(contact, 'update');
    }
}


/**
 * Update, add or delete a single task property in db/ls
 * 
 * @param {string} taskId - id of the task object
 * @param {string} property - property name to update
 * @param {*} value - property value (null = delete property)
 */
async function updateTaskProperty(taskId, property, value = null) {
    let task = await getTaskById(taskId);
    if(task) {
        value === null ? delete task[property] : task[property] = value;
        await updateTask(task);
        localStorageMode ? await saveTasksToLS() : await saveTaskToDB(task, 'update');
    }
}


/**
 * Update subtask state (done true/false)
 * 
 * @param {string} taskId - id of the task object
 * @param {number} subtaskIndex - index of the subtask
 * @param {boolean} value - done = true/false
 */
async function updateSubtaskStatus(taskId, subtaskIndex, value) {
    let task = await getTaskById(taskId);
    if(task){
        task.subtasks[subtaskIndex].done = value;
        localStorageMode ? await saveTasksToLS() : await saveTaskToDB(task, 'update');
    }
}


/**
 * Delete a contact from db/ls (and from contacts object array)
 * 
 * @param {string} contactId - id of the contact object
 */
async function deleteContact(contactId) {
    let index = await getContactIndexFromId(contactId);
    index >= 0 ? contacts.splice(index, 1) : null;
    localStorageMode ? await saveContactsToLS() : await deleteFirebaseData('users/' + contactId);
    await removeDeletedContactsFromTasks(contactId);
}


/**
 * Delete a task from db/ls (and from tasks object array)
 * 
 * @param {string} taskId - id of the task object
 */
async function deleteTask(taskId) {
    let index = await getTaskIndexFromId(taskId);
    index >= 0 ? tasks.splice(index, 1) : null;
    localStorageMode ? await saveTasksToLS() : await deleteFirebaseData('tasks/' + taskId);
}


/**
 * Delete a category from db/ls (and from categories object array)
 * 
 * @param {string} categoryId - id of the category object
 */
async function deleteCategory(categoryId) {
    let index = await getCategoryIndexFromId(categoryId);
    index >= 0 ? categories.splice(index, 1) : null;
    localStorageMode ? await saveCategoriesToLS() : await deleteFirebaseData('categories/' + categoryId);
}


/**
 * Delete all data from db/ls
 */
async function deleteAllData() {
    localStorageMode ? await deleteDataFromLS() : await deleteFirebaseData('');

}

