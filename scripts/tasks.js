let currentTask = {};
let taskContacts = [];
let assignedContacts = [];
let assignedSubtasks = [];
let taskStatus = 'todo';


/**
 * On page load add-task.html
 */
async function initAddTask() {
    await getContacts();
    await checkAuth();
    getMainTemplates();
    await getTaskData();
    await openAddTaskForm(null, 'add-task-page');
}


/**
 * Redirect to add-task page
 */
function openAddTaskPage() {
    window.location.href = "/add-task.html";
}


/**
 * Event handler: open add task form
 * 
 * @param {event} event - onclick (button) / inherit
 * @param {string} source - source from where the form was opened (add-task-page, board)
 * @param {string} boardId - id of the board from which the form was opened
 */
async function openAddTaskForm(event = null, source = 'board', boardId = 'todo') {
    event ? event.stopPropagation() : null;
    formMode = 'add';
    currentTask = {};
    taskStatus = (source == 'board') ? boardId : 'todo';
    await showTaskDialogue('addTaskFormWrapper', source);
    await renderTaskForm('addTaskFieldGroups');
    if(source == 'add-task-page') {
        return;
    } else {
        document.getElementById('taskDialogue').classList.add('add-task');
    }
}


/**
 * Event handler: open edit task form in dialogue
 * 
 * @param {event} event - onclick (button)
 * @param {string} taskId - id of the clicked task
 */
async function openEditTaskForm(event, taskId) {
    event.stopPropagation();
    formMode = 'edit';
    currentTask = await getTaskById(taskId);
    await showTaskDialogue('editTaskFormWrapper');
    await renderTaskForm('editTaskFieldGroups', currentTask);
    document.getElementById('taskDialogue').classList.add('edit-task');
}


/**
 * Helper: open task dialogue (board)
 * 
 * @param {string} elementId - id of the inner dialogue wrapper
 * @param {string} source - source from where the dialoge was opened (add-task-page, board)
 */
async function showTaskDialogue(elementId, source = 'board') {
    if(source == 'board') {
        document.getElementById('addTaskFieldGroups').innerHTML = '';
        document.getElementById('editTaskFieldGroups').innerHTML = '';
        document.getElementById('taskDetailsWrapper').style = 'display: none;';
        document.getElementById('addTaskFormWrapper').style = 'display: none;';
        document.getElementById('editTaskFormWrapper').style = 'display: none;';
        document.getElementById(elementId).style = '';
        let dialogue = document.getElementById('taskDialogue');
        dialogue.classList.remove('show-task', 'add-task', 'edit-task');
        dialogue.setAttribute('aria-hidden', 'false');
    }
}


/**
 * Render task form
 * 
 * @param {string} fieldsWrapperId - id of the fields wrapper element
 * @param {object} currentTask - current task (if edit mode)
 */
async function renderTaskForm(fieldsWrapperId, currentTask = null) {
    assignedContacts = [];
    assignedSubtasks = [];
    document.getElementById(fieldsWrapperId).innerHTML = getTaskFormFieldsTemplate(currentTask);
    document.getElementById('iconPrioHigh').innerHTML = getIconTemplatePrioHigh();
    document.getElementById('iconPrioMedium').innerHTML = getIconTemplatePrioMedium();
    document.getElementById('iconPrioLow').innerHTML = getIconTemplatePrioLow();
    let formId;
    if(formMode == 'add') {
        formId = 'addTaskForm';
        await renderAddTaskFormProps(formId);
    } else {
        formId = 'editTaskForm';
        await renderEditTaskFormProps(currentTask, formId);        
    }
    await setInitialFormState(formId);
}


/**
 * Render add-task form properties
 */
async function renderAddTaskFormProps(formId) {
    document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Clear');
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create Task');
    await renderTaskFormContactListbox();
    await renderTaskFormCategoryListbox();
    await resetForm(formId);
}


/**
 * Render edit-task form properties
 * 
 * @param {object} currentTask - current task
 */
async function renderEditTaskFormProps(currentTask, formId) {
    await resetForm(formId);
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Ok');
    document.getElementById('inputTitle').value = currentTask.title;
    currentTask.description ? document.getElementById('inputDescription').value = currentTask.description : '';
    document.getElementById('inputDueDate').value = currentTask.dueDate;
    if(currentTask.priority) {
        let priority =  setFirstLetterUpperCase(currentTask.priority);
        document.getElementById('inputPrio' + priority).checked = true;
    }
    assignedContacts = currentTask.contactIds ? currentTask.contactIds.slice() : [];
    await renderTaskFormContactListbox();
    await renderTaskFormContactBatches(assignedContacts);
    await renderEditTaskFormCategories(currentTask);
    assignedSubtasks = currentTask.subtasks ? currentTask.subtasks.slice() : [];
    await renderTaskFormSubtasks(assignedSubtasks);
}


/**
 * Event handler: filter contact select options on task form
 * 
 * @param {event} event - oninput (input)
 */
async function listenTaskFormContactsListboxSearch(event) {
    event.stopPropagation()
    let searchVal = document.getElementById('selectContacts').value;
    searchVal = searchVal.toLowerCase();
    await renderTaskFormContactListbox(searchVal);
}


/**
 * Filter contacts listbox on task form/s &  handle dropdown states
 * 
 * @param {string} searchVal - search value (filter)
 * @param {element} listbox - listbox element
 */
async function filterTaskFormContactsListbox(searchVal = '', listbox) {
    let combox = document.getElementById('selectContacts');
    listbox.innerHTML = '';
    taskContacts = contacts;
    if(searchVal === ' ') {
        combox.value = '';
        toggleDropdown(listbox);        
    } else if(searchVal.length === 1) {
        closeDropdown(listbox);
        return;
    }
    if(searchVal && searchVal.length >= 2) {
        openDropdown(listbox);
        taskContacts = await taskContacts.filter(contact => contact.name.toLowerCase().includes(searchVal));
    }
    return taskContacts;
}


/**
 * Render contacts listbox on task form/s
 * 
 * @param {string} searchVal - search value (filter)
 */
async function renderTaskFormContactListbox(searchVal = '') {
    let listbox = document.getElementById('taskContactsListbox');
    taskContacts = await filterTaskFormContactsListbox(searchVal, listbox);
    if(hasLength(taskContacts)) {
        for (let index = 0; index < taskContacts.length; index++) {
            listbox.innerHTML += getContactListboxOptionTemplate(taskContacts[index], index);
            if(assignedContacts && assignedContacts.length > 0) {
                let isChecked = assignedContacts.includes(taskContacts[index].id);
                setTimeout(function() {
                    document.getElementById('checkboxAssignedContact-' + taskContacts[index].id).checked = isChecked;
                }, 1);
            }
        }
    }
}


/**
 * Render assigned contact profile batches on task form/s
 * 
 * @param {array} contactIds - array of assigned contact id's
 * @param {string} elementId - id of the render wrapper
 */
async function renderTaskFormContactBatches(contactIds = [], elementId = 'profileBatches') {
    let element = document.getElementById(elementId);
    element.innerHTML = '';
    for (let index = 0; index < contactIds.length; index++) {
        let contact = await getContactById(contactIds[index]);
        contact ? element.innerHTML += getContactProfileBatchTemplate(contact) : null;
    }
}


/**
 * Render category select listbox on task form/s
 * 
 * @param {event} event - currently not in use
 * @param {string} wrapperId - id of the render wrapper
 */
async function renderTaskFormCategoryListbox(event = null, wrapperId = 'taskCategoryListbox') {
    event ? event.stopPropagation() : null;
    let optionsWrapper = document.getElementById(wrapperId);
    optionsWrapper.innerHTML = '';
    categories = await sortCategories(categories);
    for (let index = 0; index < categories.length; index++) {
        optionsWrapper.innerHTML += getCategoryListboxOptionTemplate(categories[index], index);
    }
}


/**
 * Render edit task form categories
 * 
 * @param {object} currentTask - current task (if edit mode)
 */
async function renderEditTaskFormCategories(currentTask) {
    if(currentTask.categoryId) {
        let category = getCategoryById(currentTask.categoryId)
        let categoryName = category ? category.Name : null;
        document.getElementById('categorySelect').value = categoryName;
        document.getElementById('categorySelect').dataset.optionId = currentTask.categoryId;
        document.getElementById('categorySelect').classList.remove("clickable");
        document.getElementById('categorySelect').setAttribute("disabled", '');
        //document.getElementById('categoryOptionId-' + currentTask.categoryId).setAttribute('aria-selected', 'true');
    }
}


/**
 * Event handler: submit create task
 * 
 * @param {event} event - onsubmit (form)
 */
async function submitCreateTask(event) {
    event.stopPropagation();
    event.preventDefault();
    if(formIsValid('addTaskForm')) {
        let formInputs = await getFormInputObj('addTaskForm');
        await setTaskProperties(currentTask, formInputs);
        await createTask(currentTask);
        await showFloatingMessage('addedTask');
        setTimeout(function() {location.href = "/board.html";}, 1500);
    }
}


/**
 * Event handler: submit update task
 * 
 * @param {event} event - onsubmit (form)
 */
async function submitUpdateTask(event) {
    event.stopPropagation();
    event.preventDefault();
    if(formIsValid('editTaskForm')) {
        let formInputs = await getFormInputObj('editTaskForm');
        await setTaskProperties(currentTask, formInputs);
        await updateTask(currentTask);
        let showConfMsg = 1;
        showConfMsg ? await showFloatingMessage('text', 'Task successfully edited') : null;
        await showTaskDetail(event, currentTask.id, false);
    }
}


/**
 * Helper: set task properties
 * 
 * @param {object} currentTask - current task object
 * @param {object} formInputs - current form inputs object
 */
async function setTaskProperties(currentTask, formInputs ) {
    if(hasLength(formInputs.title)) {
        currentTask.title = formInputs.title;
        currentTask.description = formInputs.description;
        currentTask.dueDate = formInputs.dueDate;
        currentTask.priority = formInputs.priority;
        currentTask.categoryId = document.getElementById('categorySelect').dataset.optionId;
        currentTask.contactIds = assignedContacts;
        currentTask.subtasks = assignedSubtasks;
        !hasLength(currentTask.status) ? currentTask.status = taskStatus : null;
    } else {
        console.log('error: no form inputs !');
    }
}


/**
 * Event handler: submit delete task
 * 
 * @param {event} event - onclick (button)
 * @param {string} taskId - id of the current task
 */
async function submitDeleteTask(event, taskId) {
    event.stopPropagation();
    await deleteTask(taskId);
    currentTask = {};
    await showFloatingMessage('text', 'Task deleted');
    setTimeout(function() {closeTaskDialogue(event)}, 500);
}


/**
 * Event handler: reset add task form
 * 
 * @param {event} event - onclick (button)
 */
async function resetAddTaskForm(event) {
    event.stopPropagation();
    let formId = 'addTaskForm';
    currentTask = {};
    assignedContacts = [];
    assignedSubtasks = [];
    resetForm(formId);
    await renderTaskFormContactListbox();    
    await renderTaskFormContactBatches();    
    await renderTaskFormCategoryListbox();    
    await renderTaskFormSubtasks(assignedSubtasks);
    event.preventDefault();
}


/**
 * Event handler: close task dialogue
 * 
 * @param {event} event - onclick (button)
 */
async function closeTaskDialogue(event) {
    event.stopPropagation();
    event.preventDefault();
    (formMode == 'add' || formMode == 'edit') ? resetAddTaskForm(event) : null;
    formMode = '';
    await renderBoards();
    let dialogue = document.getElementById('taskDialogue');
    dialogue.setAttribute('aria-hidden', 'true');
}