let requiredTaskFields = ['inputTitle', 'inputDueDate', 'inputCategory'];

function initAddTask() {
    getMainTemplates();
    addIconsToAddTaskPage();
    getContactSelectOptions();
    getProfileBatches();
    getCategorySelectOptions();
    setInitalFormStateAddTask();
    // addTestDataToAddTaskForm();
}

function addIconsToAddTaskPage() {
    document.getElementById('labelPrioHigh').innerHTML = getIconTemplatePrioHigh();
    document.getElementById('labelPrioMedium').innerHTML = getIconTemplatePrioMedium();
    document.getElementById('labelPrioLow').innerHTML = getIconTemplatePrioLow();
    document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Clear');
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create Task');
}

function addTestDataToAddTaskForm() {
    document.getElementById('inputTitle').value = 'Tasktitle autogen.';
    document.getElementById('inputDueDate').value = "2025-04-06";
    document.getElementById('inputCategory').value = 1;
    for (let index = 0; index < requiredTaskFields.length; index++) {
        element = document.getElementById(requiredTaskFields[index]);
        element.onfocusout = validateInput(requiredTaskFields[index]);
    }
    document.getElementById('inputDueDate').focus();
    // document.getElementById('btnSubmit').focus();
}

function resetFormAddTask(event) {
    resetForm(event, 'addTaskForm');
    setInitalFormStateAddTask();
}

function setInitalFormStateAddTask() {
    setInitalFormState(requiredTaskFields);
}

function createTask(event) {
    task = getAllInputs(event, 'addTaskForm');
    lastTaskId++;
    task.id = lastTaskId;
    task.categoryId = Number(task.categoryId)   ;
    // console.log(task);
    tasks.push(task);
    // console.log(tasks);
    saveTaskData();
}

function getContactSelectOptions(id = 'inputContacts') {
    let selectInput = document.getElementById(id);
    selectInput.innerHTML = '';
    for (let index = 0; index < contacts.length; index++) {
        selectInput.innerHTML += getContactSelectOptionTemplate(contacts[index]);
    }
}

function getProfileBatches(id = 'profileBatches') {
    let selectInput = document.getElementById(id);
    selectInput.innerHTML = '';
    for (let index = 0; index < contacts.length; index++) {
        selectInput.innerHTML += getProfileBatchTemplate(contacts[index]);
    }
}

function getCategorySelectOptions(id = 'inputCategory') {
    let selectInput = document.getElementById(id);
    selectInput.innerHTML = '';
    for (let index = 0; index < categories.length; index++) {
        selectInput.innerHTML += getCategorySelectOptionTemplate(categories[index]);
    }
}

