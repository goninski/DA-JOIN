function initAddTask() {
    getMainTemplates();
    addIconsToAddTaskPage();
    getContactSelectOptions();
    getProfileBatches();
    getCategorySelectOptions();
    getTaskDataLS();   
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
    let priority = getPriorityInput();
    return {"id": id, "title": title, "description": description, "priority": priority};
}

function getTitleInput() {
    let titleRef = document.getElementById('inputTitle');
    let title = titleRef.value;
    if(! title) {
        titleRef.parentNode.classList.add('show-required-msg');
        titleRef.focus();
    }
    return title;
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

