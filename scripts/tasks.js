let currentTask = {};
let taskContacts = [];
let assignedContacts = [];
let assignedSubtasks = [];
let taskStatus = 'todo';


/**
 * On page load add-task.html
 */
async function initAddTask() {
    getMainTemplates();
    await getContacts();
    await checkAuth();
    await getTaskData();
    await openAddTaskForm(event, 'add-task-page');
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
    taskStatus = source == 'board' ? boardId : 'todo';
    await showTaskDialogue('addTaskFormWrapper', source);
    await renderTaskForm('addTaskFieldGroups');
    if( source == 'add-task-page') {
        return;
    } else {
        document.getElementById('taskDialogue').classList.add('add-task');
        // document.getElementById('taskDialogue').classList.add('form-scrollable');
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
    let index = await getTaskIndexFromId(taskId);
    currentTask = tasks[index];
    console.log(currentTask);
    await showTaskDialogue('editTaskFormWrapper');
    await renderTaskForm('editTaskFieldGroups', currentTask);
    document.getElementById('taskDialogue').classList.add('edit-task');
    // document.getElementById('taskDialogue').classList.add('form-scrollable');
    // setEditTaskValues(task);
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
        dialogue.classList.remove('show-task');
        dialogue.classList.remove('add-task');
        dialogue.classList.remove('edit-task');
        // dialogue.classList.remove('form-scrollable');
        await runSlideInAnimation(dialogue);
        // dialogue.classList.remove('slide-out');
        // dialogue.classList.add('slide-in');
        // dialogue.style = '';
    }
}


/**
 * Render task form
 * 
 * @param {string} fieldsWrapperId - id of the fields wrapper element
 * @param {object} currentTask - current task (if edit mode)
 */
async function renderTaskForm(fieldsWrapperId, currentTask = null) {
    // console.log(task);
    assignedContacts = [];
    assignedSubtasks = [];
    let formId;
    document.getElementById(fieldsWrapperId).innerHTML = getTaskFormFieldsTemplate(currentTask);
    document.getElementById('iconPrioHigh').innerHTML = getIconTemplatePrioHigh();
    document.getElementById('iconPrioMedium').innerHTML = getIconTemplatePrioMedium();
    document.getElementById('iconPrioLow').innerHTML = getIconTemplatePrioLow();
    if(formMode == 'add') {
        document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Clear');
        document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create Task');
        await renderContactSelectOptions();
        formId = 'addTaskForm';
    } else {
        document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Ok');
        formId = 'editTaskForm';
    }
    await resetForm(formId);
    // console.log(contacts);
    await renderCategorySelectOptions(event);
    await setEditTaskValues(currentTask, formId);
    await checkEditFormState(formId);
}


/**
 * Set edit task form values
 * 
 * @param {object} currentTask - current task (if edit mode)
 * @param {string} formId - id of the form (currently not in use)
 */
async function setEditTaskValues(currentTask, formId) {
    if(formMode == 'edit') {
        document.getElementById('inputTitle').value = currentTask.title;
        currentTask.description ? document.getElementById('inputDescription').value = currentTask.description : '';
        document.getElementById('inputDueDate').value = currentTask.dueDate;
        if(currentTask.priority) {
            let priority =  setFirstLetterUpperCase(currentTask.priority);
            document.getElementById('inputPrio' + priority).checked = true;
        }
        assignedContacts = currentTask.contactIds ? currentTask.contactIds.slice() : [];
        await renderContactSelectOptions();
        await renderContactProfileBatches(assignedContacts);
        if(currentTask.categoryId) {
            let index = await getCategoryIndexFromId(currentTask.categoryId);
            let categoryName = categories[index].name;
            document.getElementById('categorySelect').value = categoryName;
            document.getElementById('categorySelect').dataset.optionId = currentTask.categoryId;
            document.getElementById('categorySelect').classList.remove("clickable");
            document.getElementById('categorySelect').setAttribute("disabled", '');
            document.getElementById('categoryOptionId-' + currentTask.categoryId).setAttribute('aria-selected', 'true');
        }
        assignedSubtasks = currentTask.subtasks ? currentTask.subtasks.slice() : [];
        renderSubtasks(assignedSubtasks);
    }
}


/**
 * Event handler: filter contact select options on task form
 * 
 * @param {event} event - oninput (input)
 */
async function filterTaskContactOptions(event) {
    event.stopPropagation()
    let searchVal = document.getElementById('selectContacts').value;
    searchVal = searchVal.toLowerCase();
    console.log(searchVal);
    await renderContactSelectOptions('taskContactsListbox', searchVal);
}


/**
 * Render contact select options on task form
 * 
 * @param {string} listboxId - id of the listbox for render
 * @param {string} searchVal - search value (filter)
 */
async function renderContactSelectOptions(listboxId = 'taskContactsListbox', searchVal = '') {
    let listbox = document.getElementById(listboxId);
    let combox = document.getElementById('selectContacts');
    listbox.innerHTML = '';
    // console.log(contacts);
    taskContacts = contacts;
    // taskContacts = await Object.create(contacts);
    // taskContacts = await sortContacts(taskContacts);
    // console.log(contacts);
    // console.log(taskContacts);
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
    // console.log(taskContacts);
    for (let index = 0; index < taskContacts.length; index++) {
        listbox.innerHTML += getContactSelectOptionTemplate(taskContacts[index], index);
        if(assignedContacts && assignedContacts.length > 0) {
            let isChecked = assignedContacts.includes(taskContacts[index].id);
            setTimeout(function() {
                document.getElementById('checkboxAssignedContact-' + taskContacts[index].id).checked = isChecked;
            }, 1);
        }
    }
}


/**
 * Render assigned contact profile batches on task form
 * 
 * @param {array} contactIds - array of assigned contact id's
 * @param {string} elementId - id of the render wrapper
 */
async function renderContactProfileBatches(contactIds = [], elementId = 'profileBatches') {
    let element = document.getElementById(elementId);
    element.innerHTML = '';
    for (let index = 0; index < contactIds.length; index++) {
        let contactIndex = await getContactIndexFromId(contactIds[index]);
        if(contactIndex >= 0) {
            element.innerHTML += getContactProfileBatchTemplate(contacts[contactIndex]);
        }
    }
}


/**
 * Render category select options on task form
 * 
 * @param {event} event - currently not in use
 * @param {string} wrapperId - id of the render wrapper
 */
async function renderCategorySelectOptions(event = null, wrapperId = 'taskCategoriesSelectOptionsWrapper') {
    event ? event.stopPropagation() : null;
    let optionsWrapper = document.getElementById(wrapperId);
    optionsWrapper.innerHTML = '';
    categories = await sortCategories(categories);
    // let assignedCategory = 0;
    for (let index = 0; index < categories.length; index++) {
        optionsWrapper.innerHTML += getCategorySelectOptionTemplate(categories[index], index);
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
    let formInputs = await getFormInputObj('addTaskForm');
    await setTaskProperties(currentTask, formInputs);
    await createTask(currentTask);
    // resetAddTaskForm(event);
    await showFloatingMessage('addedTask');
    setTimeout(function() {location.href = "/board.html";}, 1500);
}


/**
 * Event handler: submit update task
 * 
 * @param {event} event - onsubmit (form)
 */
async function submitUpdateTask(event) {
    event.stopPropagation();
    event.preventDefault();
    let formInputs = await getFormInputObj('editTaskForm');
    await setTaskProperties(currentTask, formInputs);
    await updateTask(currentTask);
    await showFloatingMessage('text', 'Task successfully edited');
    setTimeout(function() {closeTaskDialogue(event)}, 500);
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
        console.log(assignedSubtasks);
        currentTask.subtasks = assignedSubtasks;
        console.log(currentTask.subtasks);
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
    // let index = getTaskIndexFromId(taskId);
    // index >= 0 ? tasks.splice(index, 1) : null;
    currentTask = {};
    await showFloatingMessage('text', 'Task deleted');
    // console.log(currentPage);
    currentPage == '/board.html' ? await renderBoards() : null; // does not work !?
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
    // setInitialFormState(formId, 'inputTitle', 'add');
    await renderContactSelectOptions();    
    await renderContactProfileBatches();    
    await renderCategorySelectOptions();    
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
    let dialogue = document.getElementById('taskDialogue');
    await runSlideOutAnimation(dialogue, 200);
    console.log(renderTasks);
    await renderBoards(renderTasks);
}


/**
 * Event handler: change task status > currently not use !
 * 
 * @param {event} event - inherit
 * @param {string} taskId - id of the selected task
 * @param {string} statusNew - id of the new status (target board)
 * @param {string} statusOld - id of old status (source board), optional, currently not in use
 */
async function changeTaskStatus(event = null, taskId, statusNew, statusOld = null) {
    event ? event.stopPropagation() : null;
    await updateTaskProperty(taskId, 'status', statusNew);
    // renderBoard(statusNew);
    // statusOld ? renderBoard(statusOld) : null;
}


