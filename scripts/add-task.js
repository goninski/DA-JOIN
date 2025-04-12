function initAddTask() {
    getMainTemplates();
    addTask(event, 'init');
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
    if( source == 'init') {
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
    document.getElementById(fieldsWrapperId).innerHTML = getTaskFieldsWrapperTemplate(task);
    document.getElementById('labelPrioHigh').innerHTML = getIconTemplatePrioHigh();
    document.getElementById('labelPrioMedium').innerHTML = getIconTemplatePrioMedium();
    document.getElementById('labelPrioLow').innerHTML = getIconTemplatePrioLow();
    if(taskFormMode == 'add') {
        document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Clear');
        document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create Task');
    } else {
        document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Ok');
    }
    getContactSelectOptions();
    getProfileBatches();
    getCategorySelectOptions();
    setInitalFormState(requiredTaskFields, 'inputTitle');
}

function createTask(event) {
    task = getAllInputs(event, 'addTaskForm');
    lastTaskId++;
    task.id = lastTaskId;
    task.categoryId = Number(task.categoryId)   ;
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
    resetForm('addTaskForm');
    setInitalFormState(requiredTaskFields, 'inputTitle', 'add');
    event.preventDefault();
}

function closeTaskDialogue(event) {
    event.stopPropagation();
    document.getElementById('taskDialogue').style = 'display: none';
    renderBoards();
    taskFormMode = '';
}

function getTaskIndexFromId(taskId) {
    return tasks.findIndex(task => task.id == taskId);
}

