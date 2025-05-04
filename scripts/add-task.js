let taskContacts = {};
let activeTaskId = '';
let assignedContacts = [];
let assignedSubtasks = [];


async function initAddTask() {
    getMainTemplates();
    await getAllData();
    await addTask(event, 'add-task-page');
}

function openAddTaskPage() {
    window.location.href = "/add-task.html";
}

async function addTask(event = null, source = 'board') {
    if(event) {
        event.stopPropagation();
    }
    formMode = 'add';
    activeTaskId = '';
    await showTaskDialogue('addTaskFormWrapper', source);
    await renderTaskForm('addTaskFieldGroups');
    if( source == 'add-task-page') {
        return;
    } else {
        document.getElementById('taskDialogue').classList.add('add-task');
        // document.getElementById('taskDialogue').classList.add('form-scrollable');
    }
}

async function showTask(event, taskId = '') {
    formMode = 'show';
    if(taskId == '') {
        taskId = activeTaskId;
    }
    // console.log(tasks);
    let index = await getTaskIndexFromId(taskId);
    let task = tasks[index];
    await showTaskDialogue('taskDetailsWrapper');
    document.getElementById('taskDetailsWrapper').innerHTML = getTaskDetailsWrapperTemplate(task);
    document.getElementById('taskDialogue').classList.add('show-task');
}

async function editTask(event, taskId = '') {
    event.stopPropagation();
    formMode = 'edit';
    if(taskId == '') {
        taskId = activeTaskId;
    } else {
        activeTaskId = taskId;
    }
    let index = await getTaskIndexFromId(taskId);
    let task = tasks[index];
    await showTaskDialogue('editTaskFormWrapper');
    await renderTaskForm('editTaskFieldGroups', task);
    document.getElementById('taskDialogue').classList.add('edit-task');
    // document.getElementById('taskDialogue').classList.add('form-scrollable');
    // setEditTaskValues(task);
}

async function showTaskDialogue(elementId, source = 'board') {
    if(source == 'board') {
        document.getElementById('addTaskFieldGroups').innerHTML = '';
        document.getElementById('editTaskFieldGroups').innerHTML = '';
        document.getElementById('taskDetailsWrapper').style = 'display: none;';
        document.getElementById('addTaskFormWrapper').style = 'display: none;';
        document.getElementById('editTaskFormWrapper').style = 'display: none;';
        document.getElementById(elementId).style = '';
        document.getElementById('taskDialogue').classList.remove('show-task');
        document.getElementById('taskDialogue').classList.remove('add-task');
        document.getElementById('taskDialogue').classList.remove('edit-task');
        // document.getElementById('taskDialogue').classList.remove('form-scrollable');
        document.getElementById('taskDialogue').style = '';
    }
}

async function renderTaskForm(fieldsWrapperId, task = null) {
    // console.log(task);
    assignedContacts = [];
    assignedSubtasks = [];
    let formId;
    document.getElementById(fieldsWrapperId).innerHTML = getTaskFormFieldsTemplate(task);
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
    console.log(contacts);
    await renderCategorySelectOptions(event);
    await setEditTaskValues(task, formId);
    await checkEditFormState(formId);
}

async function setEditTaskValues(task, formId) {
    if(formMode == 'edit') {
        document.getElementById('inputTitle').value = task.title;
        document.getElementById('inputDescription').value = task.description;
        document.getElementById('inputDueDate').value = task.dueDate;
        if(task.priority) {
            let priority =  setFirstLetterUpperCase(task.priority);
            document.getElementById('inputPrio' + priority).checked = true;
        }
        assignedContacts = task.contactIds;
        await renderContactSelectOptions();
        await renderContactProfileBatches(assignedContacts);
        if(task.categoryId) {
            let index = await getCategoryIndexFromId(task.categoryId);
            let categoryName = categories[index].name;
            document.getElementById('categorySelect').value = categoryName;
            document.getElementById('categorySelect').dataset.optionId = task.categoryId;
            // document.getElementById('categoryOptionId-' + task.categoryId).setAttribute('aria-selected', 'true');
            document.getElementById('categorySelect').classList.remove("clickable");
            document.getElementById('categorySelect').setAttribute("disabled", '');
        }
        assignedSubtasks = task.subtasks;
        // renderSubtasks();
    }
}


async function filterTaskContactOptions(event) {
    event.stopPropagation()
    let searchVal = document.getElementById('selectContacts').value;
    console.log(searchVal);
    await renderContactSelectOptions('taskContactsListbox', searchVal);
}

async function renderContactSelectOptions(listboxId = 'taskContactsListbox', searchVal = '') {
    let listbox = document.getElementById(listboxId);
    let combox = document.getElementById('selectContacts');
    listbox.innerHTML = '';
    console.log(contacts);
    taskContacts = await Object.create(contacts);
    taskContacts = await sortContacts(taskContacts);
    console.log(contacts);
    console.log(taskContacts);
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
    console.log(taskContacts);
    for (let index = 0; index < taskContacts.length; index++) {
        listbox.innerHTML += getContactSelectOptionTemplate(taskContacts[index], index);
        if(assignedContacts.length > 0) {
            let isChecked = assignedContacts.includes(taskContacts[index].id);
            setTimeout(function() {
                document.getElementById('checkboxAssignedContact-' + taskContacts[index].id).checked = isChecked;
            }, 1);
        }
    }
}

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

async function renderCategorySelectOptions(event = null, wrapperId = 'taskCategoriesSelectOptionsWrapper') {
    if(event) {event.stopPropagation();}
    let optionsWrapper = document.getElementById(wrapperId);
    optionsWrapper.innerHTML = '';
    categories = await sortCategories(categories);
    // let assignedCategory = 0;
    for (let index = 0; index < categories.length; index++) {
        optionsWrapper.innerHTML += getCategorySelectOptionTemplate(categories[index], index);
    }
}

async function renderSubtasks(wrapperId = 'assignedSubtasks') {
    let element = document.getElementById(wrapperId);
    element.innerHTML = '';
    for (let index = 0; index < assignedSubtasks.length; index++) {
        element.innerHTML += getSubtasksTemplate(assignedSubtasks[index], index, activeTaskId);
    }
    for (let index = 0; index < assignedSubtasks.length; index++) {
        let listItem = document.getElementById('subtask-i-' + index);
        listItem.readOnly = true;
        let wrapper = listItem.parentElement;
        wrapper.classList.remove('edit-mode');
    }
    console.log(assignedSubtasks);
}





function validateSubtaskInput(event, id='inputSubtasks') {
    // event.stopPropagation();
    let subtask = event.currentTarget.value;
    // let subtask = document.getElementById(id).value;
    if(subtask.length <= 0 || subtask.length > 128) {
        document.getElementById('subtaskInputButtonAdd').classList.remove('hide');
        document.getElementById('subtaskInputButtons').classList.add('hide');
    } else {
        document.getElementById('subtaskInputButtonAdd').classList.add('hide');
        document.getElementById('subtaskInputButtons').classList.remove('hide');
    }
}

function addSubtaskPseudo(event) {
    event.stopPropagation();
}

async function addSubtask(event) {
    console.log('addSubtask');
    event.stopPropagation();
    let element = getInputElement(event);
    assignedSubtasks.push(element.value);
    await renderSubtasks();
    resetSubtaskInput(event, element);
}

function editSubtask(event) {
    event.stopPropagation();
    let wrapper = getInputWrapperElement(event);
    let element = getInputElement(event);
    wrapper.classList.add('edit-mode');
    element.readOnly = false;
}

function saveSubtask(event, index) {
    event.stopPropagation();
    let element = getInputElement(event);
    assignedSubtasks[index] = element.value;
    renderSubtasks();
}

function deleteSubtask(event, index) {
    event.stopPropagation();
    assignedSubtasks.splice(index, 1);
    renderSubtasks();
}

function resetSubtaskInput(event, element) {
    console.log('resetSubtaskInput');
    event.stopPropagation();
    event.preventDefault;
    element.value = '';
    document.getElementById('subtaskInputButtonAdd').classList.remove('hide');
    document.getElementById('subtaskInputButtons').classList.add('hide');
    // element.focus();
    // resetInputValidation(id);

}



async function createTask(event) {
    console.log('createTask');
    event.stopPropagation();
    let taskInputs = getFormInputObj(event, 'addTaskForm');
    console.log(taskInputs);
    lastTaskId++;
    let task = {};
    task.id = lastTaskId;
    task.title = taskInputs.title;
    task.description = taskInputs.description;
    task.dueDate = taskInputs.dueDate;
    task.priority = taskInputs.priority;
    task.contactIds = assignedContacts;
    task.categoryId = document.getElementById('categorySelect').dataset.optionId;
    // task.categoryId = Number(taskInputs.categorySelectId);
    task.subtasks = assignedSubtasks;
    tasks.push(task);
    await createTaskDB(task);
    saveTasksToLS();
    console.log(tasks);
    // resetAddTaskForm(event);
    showFloatingMessage('addedTask');
    setTimeout(function() { 
        location.href = "/board.html";
    }, 1500);
}

async function saveTask(event) {
    event.stopPropagation();
    console.log(event.currentTarget);
    console.log(event.target);
    let taskId = activeTaskId;
    // console.log(taskId);
    taskInputs = getFormInputObj(event, 'editTaskForm');
    if(taskInputs.title.length <= 0) {
        return;
    }
    let index = getTaskIndexFromId(taskId);
    // console.log(index);
    tasks[index].title = taskInputs.title;
    tasks[index].description = taskInputs.description;
    tasks[index].dueDate = taskInputs.dueDate;
    tasks[index].priority = taskInputs.priority;
    tasks[index].contactIds = assignedContacts;
    tasks[index].categoryId = document.getElementById('categorySelect').dataset.optionId;
    tasks[index].subtasks = assignedSubtasks;
    console.log(tasks);
    let task = tasks[index];
    await updateTaskDB(task);
    saveTasksToLS();
    showFloatingMessage('text', 'Task successfully edited');
    setTimeout(function() { 
        closeTaskDialogue(event)
    }, 1000);
}

async function deleteTask(event, taskId = '') {
    event.stopPropagation();
    if(taskId == '') {
        taskId = activeTaskId;
    }
    console.log(taskId);
    let index = getTaskIndexFromId(taskId);
    if(index >= 0) {
        tasks.splice(index, 1);
    }
    activeTaskId = '';
    saveTasksToLS();
    await deleteTaskFromDB(taskId);
    await showFloatingMessage('text', 'Task deleted');
    // console.log(currentPage);
    if(currentPage == '/board.html') {
        await renderBoards(); // does not work !?
    }
    setTimeout(function() { 
        closeTaskDialogue(event)
    }, 1000);
}

async function resetAddTaskForm(event) {
    event.stopPropagation();
    let formId = 'addTaskForm';
    assignedContacts = [];
    assignedSubtasks = [];
    resetForm(formId);
    // setInitialFormState(formId, 'inputTitle', 'add');
    await renderContactSelectOptions();    
    await renderContactProfileBatches();    
    await renderCategorySelectOptions();    
    event.preventDefault();
}

function closeTaskDialogue(event) {
    event.stopPropagation();
    if(formMode == 'add' || formMode == 'edit') {
        resetAddTaskForm(event);
    }
    document.getElementById('taskDialogue').style = 'display: none';
    renderBoards();
    formMode = '';
}





// TEMP STUFF
async function renderTempTaskList() {
    formMode = '';
    let taskListRef = document.getElementById('tempTaskList');
    taskListRef.innerHTML = '';
    for (let index = 0; index < tasks.length; index++) {
        taskListRef.innerHTML += await getTempTaskListTemplate(tasks[index]);
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
