/**
 * Save contacts (object array) to local storage
 */
async function saveContactsToLS() {
    saveToLocalStorage('contacts', contacts);
}


/**
 * Save tasks (object array) to local storage
 */
async function saveTasksToLS() {
    saveToLocalStorage('tasks', tasks);
}


/**
 * Save categories (object array) to local storage
 */
async function saveCategoriesToLS() {
    saveToLocalStorage('categories', categories);
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
 * Validate a task object
 * 
 * @param {object} task - a task object
 */
async function validateTaskProperties(task) {
    delete task.searchBase;
    task.id = hasLength(task.id) ? task.id : await getNewTaskId();
    task.status = hasLength(task.status) ? task.status : 'todo';
    !hasLength(task.description) ? delete task.description : null;
    !hasLength(task.contacts) ? delete task.contacts : null;
    !hasLength(task.subtasks) ? delete task.subtasks : null;
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
 * Get a new task id (by checking the current highest number)
 * 
 * @returns {string}
 */
async function getNewTaskId() {
    let lastId = await getMaxIdFromObjArray(tasks);
    lastId++;
    return lastId.toString();
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
 * Helper: returns contact index id of the contacts object, from contact
 * 
 * @param {string} contactId - contact id
 */
async function getContactIndexFromId(contactId) {
    return contacts.findIndex(contact => contact.id == contactId);
}


/**
 * Helper: returns task index of the tasks object, from task id
 * 
 * @param {string} taskId - task id
 */
async function getTaskIndexFromId(taskId) {
    return tasks.findIndex(task => task.id == taskId);
}


/**
 * Helper: returns category index of the categories object, from category id
 * 
 * @param {string} categoryId - category id
 */
async function getCategoryIndexFromId(categoryId) {
    return categories.findIndex(category => category.id == categoryId);
}


/**
 * Helper: sort the contacts objects array alphabetically
 * 
 * @param {array} contacts - contacts objects array
 */
async function sortContacts(contacts) {
    return await contacts.sort((a, b) => a.name.localeCompare(b.name));
}


/**
 * Helper: sort the tasks objects array
 * 
 * @param {array} tasks - tasks objects array
 * @param {string} sortByProperty - property to sort by
 */
async function sortTasks(tasks, sortByProperty = 'dueDate') {
    return await tasks.sort((a, b) => a[sortByProperty].localeCompare(b[sortByProperty]));
}


/**
 * Helper: sort the category objects array alphabetically
 * 
 * @param {object} categories - categories objects array
 */
async function sortCategories(categories) {
    return await categories.sort((a, b) => a.id.localeCompare(b.id));
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
    let fetchEntries = Object.entries(fetchObj);
    fetchEntries.forEach(function(item) {
        dataArr.push(item[1]);
    });
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
 * Helper: return the first word of a string
 * 
 * @param {string} string - string
 */
function getFirstWord(string, index = 0) {
    let array = string.split(" ");
    return array[index];
}


/**
 * Helper: return the last word of a string
 * 
 * @param {string} string - string
 */
function getLastWord(string) {
    let array = string.split(" ");
    return array[array.length - 1];
}


/**
 * Helper: set the first letter of string to upper case and returns the full string
 * 
 * @param {string} string - string
 */
function setFirstLetterUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}


/**
 * Helper: return first letter of first and last word of a string, in upper case
 * 
 * @param {string} string - string
 */
function getInitialsOfFirstAndLastWord(string) {
    let firstWord = getFirstWord(string);
    let lastWord = getLastWord(string);
    return (firstWord[0] + lastWord[0]).toUpperCase();
}


/**
 * Helper: return first letter of last word of a string, in upper case
 * 
 * @param {string} string - string
 */
function getInitialOfLastWord(string) {
    let lastWord = getLastWord(string);
    return lastWord[0].toUpperCase();
}


/**
 * Helper: return the highest id of an object array
 * 
 * @param {array} objArray - array with objects (needs a property of id)
 */
async function getMaxIdFromObjArray(objArray) {
    return Math.max(...objArray.map(item => item.id));
}


/**
 * Helper: return a random hex color string
 * 
 * @param {string} format - color format (hex)
 */
function getRandomColor(format = 'hex') {
    let clr = Math.floor(Math.random()*16777215).toString(16);
    clr = '#' + clr;
    if(clr.length == 6) {
        clr = clr + '0';
    }
    return clr;
}