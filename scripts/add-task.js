function initAddTask() {
    getMainTemplates();
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
    document.getElementById('btnCheck').innerHTML = getIconTemplateCheck('Create Task');
}


//setDemoData();
function createTask() {
    let task = setTaskObject();
    tasks.push(task);
    console.log(tasks);
    saveTaskDataLS();
}

function setTaskObject() {
    lastTaskId++;
    let id = lastTaskId;
    let title = getTitleInput();
    let description = document.getElementById('inputDescription').value;
    let dueDate = getDueDateInput();
    let priority = getPriorityInput();
    let category = getCategoryInput();
    return {"id": id, "title": title, "description": description, "dueDate": dueDate, "priority": priority, "category": category};
}

function getTitleInput() {
    let titleRef = document.getElementById('inputTitle');
    let title = titleRef.value;
    if(! title) {
        setRequiredClass(titleRef);
        titleRef.focus();
    }
    return title;
}

function onFocusOutDueDateInput() {
    let dueDateRef = document.getElementById('inputDueDate').value;
}

function getDueDateInput() {
    let dueDateRef = document.getElementById('inputDueDate');
    let dueDate = dueDateRef.value;
    if(! dueDate) {
        setRequiredClass(dueDateRef);
    }
    return dueDate;
}

function getPriorityInput() {
    let inputs = ['High', 'Medium', 'Low'];
    for (let index = 0; index < inputs.length; index++) {
        let input = document.getElementById('inputPrio' + inputs[index]);
        if(input.checked) {
            return input.value;
        }
        return '';
    }
}

function getCategoryInput() {
    let categoryRef = document.getElementById('inputCategory');
    let category = categoryRef.value;
    if(! category) {
        setRequiredClass(categoryRef);
    }
    return category;
}

