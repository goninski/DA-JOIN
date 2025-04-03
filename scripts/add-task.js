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
    lastTaskId++;
    let id = lastTaskId;
    let title = document.getElementById('inputTitle').value;
    let description = document.getElementById('inputDescription').value;

    let task = {"id": id, "title": title};
    tasks.push(task);
    console.log(tasks);
    saveTaskDataLS();

}
