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
    assignedTaskContacts = [];
    assignedSubtasks = [];
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
    // renderContactSelectOptions(event);
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
        assignedTaskContacts = task.contactIds;
        assignedSubtasks = task.subtasks;
        // renderContactSelectOptions(event);
        renderContactProfileBatches(assignedTaskContacts);
        renderSubtasks();
    }
}

function tempAssignContactsToTask(event, contactId) {
    if(event.target.checked) {
        assignedTaskContacts.push(contactId);
    } else {
        assignedTaskContacts.splice(assignedTaskContacts.indexOf(contactId), 1);
    };
    renderContactProfileBatches(assignedTaskContacts);
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
    task = getAllInputs(event, 'addTaskForm');
    lastTaskId++;
    task.id = lastTaskId;
    task.categoryId = Number(task.categoryId)   ;
    task.contactIds = assignedTaskContacts;
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
    task = getAllInputs(event, 'editTaskForm');
    if(task.title.length <= 0) {
        return;
    }
    let index = getTaskIndexFromId(taskId);
    tasks[index].title = task.title;
    tasks[index].contactIds = assignedTaskContacts;
    tasks[index].subtasks = assignedSubtasks;
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
    assignedTaskContacts = [];
    assignedSubtasks = [];
    resetForm('addTaskForm');
    renderContactProfileBatches();    
    setInitalFormState(requiredTaskFields, 'inputTitle', 'add');
    event.preventDefault();
}

function closeTaskDialogue(event) {
    event.stopPropagation();
    if(taskFormMode == 'add' || taskFormMode == 'edit') {
        resetAddTaskForm(event);
    }
    document.getElementById('taskDialogue').style = 'display: none';
    renderBoards();
    taskFormMode = '';
}





// TEMP STUFF
function renderTempTaskList() {
    taskFormMode = '';
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
