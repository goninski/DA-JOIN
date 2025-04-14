let taskFormMode = '';
let contactsFormMode = '';
let invalidFields = [];
let requiredFields = [];
let requiredContactFields = ['inputName', 'inputEmail'];
let requiredTaskFields = ['inputTitle', 'inputDueDate', 'inputCategory'];
let activeTaskId = 0;
let activeContactId = 0;
let assignedTaskContacts = [];
let assignedSubtasks = [];

function init() {
    getMainTemplates();
}

function getMainTemplates() {
    getHeader();
    getSidemenu();
}

function getHeader() {
    document.getElementById('header').innerHTML = getHeaderTemplate();
}

function getSidemenu() {
    let sideMenuRef = document.getElementById('sideMenu');
    sideMenuRef.innerHTML = getSideMenuTemplate();
    sideMenuRef.classList.add('hide--ss-mob');

    let sideMenuMobRef = document.getElementById('sideMenuMob');
    sideMenuMobRef.innerHTML = getSideMenuMobTemplate();
    sideMenuMobRef.classList.add('show--ss-mob');
}




// GENERAL INPUT VALIDATIONS

function setInitalFormState(requiredFields, firstElementId, editMode = 'add') {
    requiredFields = requiredFields;
    invalidFields = [];
    if(editMode == 'add') {
        invalidFields = Array.from(requiredFields);
    }
    resetAllInputValidations();
    let element = document.getElementById(firstElementId);
    element.focus();
    setSubmitBtnState(element);
}

function reloadPage(event) {
    event.preventDefault();
    location.href = location.pathname;
}

function resetForm(formId) {
    document.getElementById(formId).reset();
}

function validateInput(id, parent = false) {
    // let id = event.currentTarget.id;
    let element = document.getElementById(id);
    let index = invalidFields.findIndex(item => item == id);
    if (! element.checkValidity()) {
        if(index < 0) {
            invalidFields.push(id);
        }
        setInvalidStyles(element, parent);
    } else {
        if(index >= 0) {
            invalidFields.splice(index, 1);
        }
        setValidStyles(element);
        return element.value;
    }
}

function validatePhoneInput(id, parent = false) {
    validateInput(id, parent);
    let element = document.getElementById(id);
    let inputValue = element.value;
    let formattedValue = inputValue;
    let rawValue = inputValue.replaceAll(' ', '');
    if(rawValue.length >= 10){
        if(! inputValue.startsWith("+")) {
            formattedValue = "+49 " + inputValue;
        }
    }
    element.value = formattedValue;
}

function resetAllInputValidations() {
    for (let index = 0; index < invalidFields.length; index++) {
        fieldId = invalidFields[index];
        resetInputValidation(fieldId, true);
    }
}


function resetInput(id) {
    document.getElementById(id).value = '';
    resetInputValidation(id)
}

function resetInputValidation(id, parent = false) {
    let element = document.getElementById(id);
    resetValidationStyles(element, parent);
}

function setInvalidStyles(element, parent) {
    element.classList.add('invalid');
    if(parent) {
        element.parentNode.classList.add('invalid');
    }
    setSubmitBtnState(element);
}

function resetValidationStyles(element, parent) {
    element.classList.remove('invalid');
    element.classList.remove('valid');
    if(parent) {
        element.parentNode.classList.remove('invalid');
    }
    setSubmitBtnState(element);
}

function setValidStyles(element) {
    if(element.classList.contains('placeholder')) {
        element.classList.add('valid');
    }
    setSubmitBtnState(element);
}

function setSubmitBtnState(element) {
    let submitBtnId = element.form.dataset.submitBtnId;
    let submitBtn = document.getElementById(submitBtnId);
    submitBtn.setAttribute('disabled', '');
    if(invalidFields.length > 0) {
        submitBtn.setAttribute('disabled', '');
    } else {
        submitBtn.removeAttribute('disabled');
    }
    // console.log(invalidFields);
}

function getAllInputs(event, formId) {
    let form = document.getElementById(formId);
    event.preventDefault();
    let formData = new FormData(form);
    console.log(formData);
    formInputObj = Object.fromEntries(formData);
    console.log(formInputObj);
    return formInputObj;
}




// GENERAL REENDER FUNCTIONS

function renderContactProfileBatches(contactIds = [], elementId = 'profileBatches') {
    let element = document.getElementById(elementId);
    element.innerHTML = '';
    for (let index = 0; index < contactIds.length; index++) {
        contactIndex = getContactIndexFromId(contactIds[index]);
        if(contactIndex >= 0) {
            element.innerHTML += getContactProfileBatchTemplate(contacts[contactIndex]);
        }
    }
}

function renderContactSelectOptions(event, wrapperId = 'taskContactsSelectOptionsWrapper') {
    let element = event.currentTarget.parentElement;
    if(element.classList.contains('input-icon-wrapper')) {
        element = element.parentElement;
    };
    // console.log(element);
    element.classList.toggle('open');
    contacts = sortContacts(contacts);
    let optionsWrapper = document.getElementById(wrapperId);
    optionsWrapper.innerHTML = '';
    for (let index = 0; index < contacts.length; index++) {
        optionsWrapper.innerHTML += getContactSelectOptionTemplate(contacts[index]);
        if(assignedTaskContacts.length > 0) {
            let isChecked = assignedTaskContacts.includes(contacts[index].id);
            setTimeout(function() {
                document.getElementById('checkboxAssignedContact-' + contacts[index].id).checked = isChecked;
            }, 1);
        }
    }
}

function renderCategorySelectOptions(id = 'inputCategory') {
    let selectInput = document.getElementById(id);
    selectInput.innerHTML = '';
    for (let index = 0; index < categories.length; index++) {
        selectInput.innerHTML += getCategorySelectOptionTemplate(categories[index]);
    }
}

function renderSubtasks(wrapperId = 'assignedSubtasks') {
    let element = document.getElementById(wrapperId);
    element.innerHTML = '';
    for (let index = 0; index < assignedSubtasks.length; index++) {
        element.innerHTML += getSubtasksTemplate(assignedSubtasks[index], index, activeTaskId);
    }
    for (let index = 0; index < assignedSubtasks.length; index++) {
        let listItem = document.getElementById('subtask-i-' + index);
        listItem.readOnly = true;
        let wrapper = listItem.parentElement;
        wrapper.classList.remove('edit-mode');
    }
    console.log(assignedSubtasks);
}




// HELPER FUNCTIONS


function getClosestParentElement(event, selector='') {
    let element = event.currentTarget;
    return element.closest(selector);
}

function getInputWrapperElement(event, selector='.input-wrapper') {
    return getClosestParentElement(event, selector);
}

function getInputElement(event, selector='.input-wrapper') {
    let wrapper = getInputWrapperElement(event, selector);
    let element = wrapper.firstElementChild;
    return element;
}

function getTaskIndexFromId(taskId) {
    return tasks.findIndex(task => task.id == taskId);
}

function getContactIndexFromId(contactId) {
    return contacts.findIndex(contact => contact.id == contactId);
}

function getCategoryIndexFromId(categoryId) {
    return categories.findIndex(category => category.id == categoryId);
}


function sortContacts(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

function setTodayAsDateValue(id) {
    document.getElementById(id).valueAsDate = new Date();
}

function getNWord(string, index = 0) {
    let array = string.split(" ");
    return array[index];
}

function getLastWord(string) {
    let array = string.split(" ");
    return array[array.length - 1];
}

function setFirstLetterUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function getInitialsOfFirstAndLastWord(string) {
    let firstWord = getNWord(string);
    let lastWord = getLastWord(string);
    return (firstWord[0] + lastWord[0]).toUpperCase();
}

function getInitialOfLastWord(string) {
    let lastWord = getLastWord(string);
    return lastWord[0].toUpperCase();
}

function getRandomColor(format = 'hex') {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function showAlert(msg, duration = 250) {
    setTimeout(function() { alert(msg) }, duration);
}

function showFloatingMessage(template, msg = '') {
    let element = document.getElementById("floatingMsg");
    if(template == 'addedTask') {
        element.innerHTML = getFloatingMessageTaskAddedTemplate();
    } else {
        element.innerHTML = getFloatingMessageTextTemplate(msg);
    }
    element.classList.remove('hide');
    setTimeout(function() { 
        element.classList.add('hide');
        element.innerHTML = '';
}, 1500);
}



