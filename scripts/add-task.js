function initAddTask() {
    getMainTemplates();
    addTask(event, 'add-task-page');
}

function openAddTaskPage() {
    window.location.href = "/add-task.html";
}

function addTask(event, source = 'board') {
    event.stopPropagation();
    taskFormMode = 'add';
    activeTaskId = 0;
    showTaskDialogue('addTaskFormWrapper', source);
    renderTaskForm('addTaskFieldGroups');
    if( source == 'add-task-page') {
    } else {
        document.getElementById('taskDialogue').classList.add('add-task');
        document.getElementById('taskDialogue').classList.add('form-scrollable');
    }
}

function showTask(event, taskId = 0) {
    taskFormMode = 'show';
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
    taskFormMode = 'edit';
    if(taskId == 0) {
        taskId = activeTaskId;
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
    tempAssignedContacts = [];
    document.getElementById(fieldsWrapperId).innerHTML = getTaskFormFieldsTemplate(task);
    document.getElementById('labelPrioHigh').innerHTML = getIconTemplatePrioHigh();
    document.getElementById('labelPrioMedium').innerHTML = getIconTemplatePrioMedium();
    document.getElementById('labelPrioLow').innerHTML = getIconTemplatePrioLow();
    if(taskFormMode == 'add') {
        document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Clear');
        document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create Task');
    } else {
        document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Ok');
    }
    renderContactSelectOptions();
    renderContactProfileBatches();
    renderCategorySelectOptions();
    setEditTaskValues(task);
    setInitalFormState(requiredTaskFields, 'inputTitle', taskFormMode);
}

function setEditTaskValues(task) {
    if(taskFormMode == 'edit') {
        document.getElementById('inputTitle').value = task.title;
        document.getElementById('inputDescription').value = task.description;
        document.getElementById('inputDueDate').value = task.dueDate;
        if(task.priority) {
            let priority =  setFirstLetterUpperCase(task.priority);
            document.getElementById('inputPrio' + priority).checked = true;
        }
        document.getElementById('inputCategory').value = task.categoryId;
        tempAssignedContacts = task.contactIds;
        renderContactSelectOptions();
        renderContactProfileBatches(tempAssignedContacts);
    }
}


function saveAssignedContactIds(event, contactId) {
    if(event.target.checked) {
        tempAssignedContacts.push(contactId);
    } else {
        tempAssignedContacts.splice(tempAssignedContacts.indexOf(contactId), 1);
    };
    // console.log(tempAssignedContacts);
    renderContactProfileBatches(tempAssignedContacts);
}

function createTask(event) {
    task = getAllInputs(event, 'addTaskForm');
    lastTaskId++;
    task.id = lastTaskId;
    task.categoryId = Number(task.categoryId)   ;
    task.contactIds = tempAssignedContacts;
    tasks.push(task);
    saveTaskData();
    alert('new task created');
    console.log(tasks);
    resetAddTaskForm(event);
}


function saveTask(event) {
    taskId = activeTaskId;
    task = getAllInputs(event, 'editTaskForm');
    if(task.title.length <= 0) {
        return;
    }
    let index = getTaskIndexFromId(taskId);
    tasks[index].title = task.title;
    tasks[index].contactIds = tempAssignedContacts;
    console.log(tasks);
    saveTaskData();
    closeTaskDialogue(event)
    showAlert('All changes saved');
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
    showAlert('Task deleted');
    closeTaskDialogue(event)
}

function resetAddTaskForm(event) {
    event.stopPropagation();
    tempAssignedContacts = [];
    resetForm('addTaskForm');
    setInitalFormState(requiredTaskFields, 'inputTitle', 'add');
    event.preventDefault();
}

function closeTaskDialogue(event) {
    event.stopPropagation();
    resetAddTaskForm(event);
    document.getElementById('taskDialogue').style = 'display: none';
    renderBoards();
    taskFormMode = '';
}
