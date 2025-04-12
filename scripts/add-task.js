function initAddTask() {
    getMainTemplates();
    addTask();
}

// function addTestDataToAddTaskForm() {
//     document.getElementById('inputTitle').value = 'Tasktitle autogen.';
//     document.getElementById('inputDueDate').value = "2025-04-06";
//     document.getElementById('inputCategory').value = 1;
//     for (let index = 0; index < requiredTaskFields.length; index++) {
//         element = document.getElementById(requiredTaskFields[index]);
//         element.onfocusout = validateInput(requiredTaskFields[index]);
//     }
//     document.getElementById('inputDueDate').focus();
//     // document.getElementById('btnSubmit').focus();
// }


function addTask(source = 'addTask') {
    if(source == 'board') {
        openAddTaskFormBoard();
    } else {
        openAddTaskForm();
    }
}

function openAddTaskForm() {
    addIconsToAddTaskPage();
    getContactSelectOptions();
    getProfileBatches();
    getCategorySelectOptions();
    setInitalFormState(requiredTaskFields, 'inputTitle');
    // addTestDataToAddTaskForm();
}

function openAddTaskFormBoard() {
}


function addIconsToAddTaskPage() {
    document.getElementById('labelPrioHigh').innerHTML = getIconTemplatePrioHigh();
    document.getElementById('labelPrioMedium').innerHTML = getIconTemplatePrioMedium();
    document.getElementById('labelPrioLow').innerHTML = getIconTemplatePrioLow();
    document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Clear');
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create Task');
}

function resetFormAddTask(event) {
    // event.stopPropagation();
    resetForm('addTaskForm');
    setInitalFormState(requiredTaskFields, 'inputTitle', 'add');
    event.preventDefault();
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
    resetFormAddTask(event);
}

function getTaskIndexFromId(taskId) {
    return tasks.findIndex(task => task.id == taskId);
}





function showTask(taskId) {
    activeTaskId = taskId;
    taskFormMode = 'task-details';
    let taskDetailsDialogueRef = document.getElementById('taskDetailsDialogue');
    let taskDetailsWrapperRef = document.getElementById('taskDetailsWrapper');
    taskDetailsDialogueRef.style = '';
    let task = tasks[getTaskIndexFromId(taskId)];
    taskDetailsWrapperRef.innerHTML = getTaskDetailsWrapperTemplate(task);
}

function editTask(taskId) {
    activeTaskId = taskId;
    taskFormMode = 'task-edit';
    let taskEditDialogueRef = document.getElementById('taskEditDialogue');
    let taskEditWrapperRef = document.getElementById('taskEditWrapper');
    taskEditDialogueRef.style = '';
    let task = tasks[getTaskIndexFromId(taskId)];
    taskEditWrapperRef.innerHTML = getTaskEditWrapperTemplate(task);
}

function closeTaskDialogue(event, dialogueId) {
    event.stopPropagation();
    let taskDialogueRef = document.getElementById(dialogueId);
    taskDialogueRef.style = 'display: none;';
    renderBoards();
    taskFormMode = 'boards';
}

function deleteTask(taskId, event) {
    event.stopPropagation();
    tasks.splice(getTaskIndexFromId(taskId), 1);
    saveTaskData();
    activeTaskId = 0;
    showAlert('Task deleted');
    closeTaskDialogue(event, 'taskDetailsDialogue')
}
