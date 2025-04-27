function initAddTask() {
    getMainTemplates();
    addTask(event, 'add-task-page');
}

function openAddTaskPage() {
    window.location.href = "/add-task.html";
}

function addTask(event, source = 'board') {
    event.stopPropagation();
    formMode = 'add';
    activeTaskId = 0;
    showTaskDialogue('addTaskFormWrapper', source);
    renderTaskForm('addTaskFieldGroups');
    if( source == 'add-task-page') {
        return;
    } else {
        document.getElementById('taskDialogue').classList.add('add-task');
        document.getElementById('taskDialogue').classList.add('form-scrollable');
    }
}

function showTask(event, taskId = 0) {
    formMode = 'show';
    if(taskId == 0) {
        taskId = activeTaskId;
    }
    // console.log(tasks);
    let task = tasks[getTaskIndexFromId(taskId)];
    showTaskDialogue('taskDetailsWrapper');
    document.getElementById('taskDetailsWrapper').innerHTML = getTaskDetailsWrapperTemplate(task);
    document.getElementById('taskDialogue').classList.add('show-task');
}

function editTask(event, taskId = 0) {
    event.stopPropagation();
    formMode = 'edit';
    if(taskId == 0) {
        taskId = activeTaskId;
    } else {
        activeTaskId = taskId;
    }
    let task = tasks[getTaskIndexFromId(taskId)];
    showTaskDialogue('editTaskFormWrapper');
    renderTaskForm('editTaskFieldGroups', task);
    document.getElementById('taskDialogue').classList.add('edit-task');
    document.getElementById('taskDialogue').classList.add('form-scrollable');
    // setEditTaskValues(task);
}

function showTaskDialogue(elementId, source = 'board') {
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
        document.getElementById('taskDialogue').classList.remove('form-scrollable');
        document.getElementById('taskDialogue').style = '';
    }
}

function renderTaskForm(fieldsWrapperId, task = null) {
    console.log(task);
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
        renderContactSelectOptions();
        formId = 'addTaskForm';
    } else {
        document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Ok');
        formId = 'editTaskForm';
    }
    resetForm(formId);
    renderCategorySelectOptions(event);
    setEditTaskValues(task, formId);
    checkEditFormState(formId);
}

function setEditTaskValues(task, formId) {
    if(formMode == 'edit') {
        document.getElementById('inputTitle').value = task.title;
        document.getElementById('inputDescription').value = task.description;
        document.getElementById('inputDueDate').value = task.dueDate;
        if(task.priority) {
            let priority =  setFirstLetterUpperCase(task.priority);
            document.getElementById('inputPrio' + priority).checked = true;
        }
        assignedContacts = task.contactIds;
        renderContactSelectOptions();
        renderContactProfileBatches(assignedContacts);
        if(task.categoryId) {
            let categoryName = categories[getCategoryIndexFromId(task.categoryId)].name;
            document.getElementById('categorySelect').value = categoryName;
            document.getElementById('categorySelect').dataset.optionId = task.categoryId;
            document.getElementById('categoryOptionId-' + task.categoryId).setAttribute('aria-selected', 'true');
        }
        assignedSubtasks = task.subtasks;
        // renderSubtasks();
    }
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

function addSubtask(event) {
    console.log('addSubtask');
    event.stopPropagation();
    let element = getInputElement(event);
    assignedSubtasks.push(element.value);
    renderSubtasks();
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






function createTask(event) {
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
    task.contactIds = assignedContacts;
    task.categoryId = document.getElementById('categorySelect').dataset.activeOption;
    // task.categoryId = Number(taskInputs.categorySelectId);
    task.subtasks = assignedSubtasks;
    tasks.push(task);
    saveTaskData();
    console.log(tasks);
    // resetAddTaskForm(event);
    showFloatingMessage('addedTask');
    setTimeout(function() { 
        location.href = "/board.html";
    }, 1500);
}

function saveTask(event) {
    event.stopPropagation();
    taskId = activeTaskId;
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
    tasks[index].contactIds = assignedContacts;
    tasks[index].categoryId = document.getElementById('categorySelect').dataset.activeOption;
    tasks[index].subtasks = assignedSubtasks;
    console.log(tasks);
    saveTaskData();
    showFloatingMessage('text', 'Task successfully edited');
    setTimeout(function() { 
        closeTaskDialogue(event)
    }, 1000);
}

function deleteTask(event, taskId = 0) {
    event.stopPropagation();
    if(taskId == 0) {
        taskId = activeTaskId;
    }
    console.log(taskId);
    let index = getTaskIndexFromId(taskId);
    if(index >= 0) {
        tasks.splice(index, 1);
        saveTaskData();
    }
    activeTaskId = 0;
    showFloatingMessage('text', 'Task deleted');
    setTimeout(function() { 
        closeTaskDialogue(event)
    }, 1000);
}

function resetAddTaskForm(event) {
    event.stopPropagation();
    let formId = 'addTaskForm';
    assignedContacts = [];
    assignedSubtasks = [];
    resetForm(formId);
    // setInitialFormState(formId, 'inputTitle', 'add');
    renderContactSelectOptions();    
    renderContactProfileBatches();    
    renderCategorySelectOptions();    
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







function filterTaskContactOptions(event) {
    event.stopPropagation()
    let searchVal = document.getElementById('selectContacts').value;
    console.log(searchVal);
    renderContactSelectOptions('taskContactsListbox', searchVal);
}

function renderContactSelectOptions(listboxId = 'taskContactsListbox', searchVal = '') {
    let listbox = document.getElementById(listboxId);
    let combox = document.getElementById('selectContacts');
    listbox.innerHTML = '';
    taskContacts = Object.create(contacts);
    taskContacts = sortContacts(taskContacts);
    if(searchVal === ' ') {
        combox.value = '';
        toggleDropdown(listbox);        
    } else if(searchVal.length == 1) {
        closeDropdown(listbox);
        return;
    }
    if(searchVal && searchVal.length >= 2) {
        openDropdown(listbox);
        taskContacts = taskContacts.filter(contact => contact.name.toLowerCase().includes(searchVal));
    }
    // console.log(taskContacts);
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

function renderContactProfileBatches(contactIds = [], elementId = 'profileBatches') {
    let element = document.getElementById(elementId);
    element.innerHTML = '';
    for (let index = 0; index < contactIds.length; index++) {
        contactIndex = getContactIndexFromId(contactIds[index]);
        if(contactIndex >= 0) {
            element.innerHTML += getContactProfileBatchTemplate(contacts[contactIndex]);
        }
    }
}

function renderCategorySelectOptions(event = null, wrapperId = 'taskCategoriesSelectOptionsWrapper') {
    if(event) {event.stopPropagation();}
    let optionsWrapper = document.getElementById(wrapperId);
    optionsWrapper.innerHTML = '';
    categories = sortCategories(categories);
    let assignedCategory = 0;
    for (let index = 0; index < categories.length; index++) {
        optionsWrapper.innerHTML += getCategorySelectOptionTemplate(categories[index], index);
    }
}

function renderSubtasks(wrapperId = 'assignedSubtasks') {
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



// TEMP STUFF
function renderTempTaskList() {
    formMode = '';
    let taskListRef = document.getElementById('tempTaskList');
    taskListRef.innerHTML = '';
    for (let index = 0; index < tasks.length; index++) {
        taskListRef.innerHTML += getTempTaskListTemplate(tasks[index]);
    }
}

function getTempTaskListTemplate(task) {
    return `
    <li class="flex-row gap justify-between align-center fw-bold">#${task.id} | ${task.title}
        <button class="" style="margin-left: auto; text-decoration: underline;" onclick="showTask(event, ${task.id})">Show</button>
        <button class="" style="text-decoration: underline;" onclick="editTask(event, ${task.id})">Edit</button>
        <button class="" style="text-decoration: underline;" onclick="deleteTask(event, ${task.id})">Delete</button>
    </li>
    `
}
