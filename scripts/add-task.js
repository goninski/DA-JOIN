function initAddTask() {
    getMainTemplates();
    addIconsToAddTaskPage();
}

function addIconsToAddTaskPage() {
    document.getElementById('labelPrioHigh').innerHTML = getIconTemplatePrioHigh();
    document.getElementById('labelPrioMedium').innerHTML = getIconTemplatePrioMedium();
    document.getElementById('labelPrioLow').innerHTML = getIconTemplatePrioLow();
    document.getElementById('btnCancel').innerHTML = getIconTemplateCancel('Clear');
    document.getElementById('btnCheck').innerHTML = getIconTemplateCheck('Create Task');
}

function tigCheckbox() {

    checkboxInputs = document.getElementById('user-1');
    if(checkboxInputs.checked) {
        checkboxInputs.src = "assets/icons/checkbox-checked.svg";
    }


}


