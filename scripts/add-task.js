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

function validateAddTaskForm() {
    lastTaskId++;
    let id = lastTaskId;
    let title = validateTitleInput();
    let description = document.getElementById('inputDescription').value;
    let dueDate = validateDueDateInput();
    let priority = validatePriorityInput();
    let category = validateCategoryInput();
    return {"id": id, "title": title, "description": description, "dueDate": dueDate, "priority": priority, "category": category};
}


function validateTitleInput() {
    let titleRef = document.getElementById('inputTitle');
    let title = titleRef.value;
    if(! title) {
        showValidationMsg(titleRef);
        titleRef.focus();
    }
    return title;
}




function onFocusOutDueDateInput() {
    let dueDateRef = document.getElementById('inputDueDate').value;
}

function validateDueDateInput() {
    let dueDateRef = document.getElementById('inputDueDate');
    let dueDate = dueDateRef.value;
    if(! dueDate) {
        setRequiredClass(dueDateRef);
    }
    return dueDate;
}

function validatePriorityInput() {
    let inputs = ['High', 'Medium', 'Low'];
    for (let index = 0; index < inputs.length; index++) {
        let input = document.getElementById('inputPrio' + inputs[index]);
        if(input.checked) {
            return input.value;
        }
        return '';
    }
}

function validateCategoryInput() {
    let categoryRef = document.getElementById('inputCategory');
    let category = categoryRef.value;
    if(! category) {
        setRequiredClass(categoryRef);
    }
    return category;
}

