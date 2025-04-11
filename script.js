let invalidFields = [];
let requiredFields = [];

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