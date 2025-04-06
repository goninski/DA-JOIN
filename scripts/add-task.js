let addTaskValidationErrors = 0;
let taskDraft = {};

function initAddTask() {
    getMainTemplates();
    setRequiredFieldsArrayAddTask();
    addIconsToAddTaskPage();
    getContactSelectOptions();
    getProfileBatches();
    getCategorySelectOptions();
}

function addIconsToAddTaskPage() {
    document.getElementById('labelPrioHigh').innerHTML = getIconTemplatePrioHigh();
    document.getElementById('labelPrioMedium').innerHTML = getIconTemplatePrioMedium();
    document.getElementById('labelPrioLow').innerHTML = getIconTemplatePrioLow();
    document.getElementById('btnCancel').innerHTML = getIconTemplateCancel('Clear');
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create Task');
}

function setRequiredFieldsArrayAddTask() {
    invalidFields = ['inputTitle', 'inputDueDate', 'inputCategory'];
    let element = document.getElementById(invalidFields[0]);
    setSubmitBtnState(element);
}

function createTask() {
    validateAddTaskForm();
    let task = setTaskObject();
    tasks.push(task);
    console.log(tasks);
    saveTaskDataLS();
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

