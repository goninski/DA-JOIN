let invalidFields = [];

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

function setInitalFormState(requiredFields) {
    invalidFields = requiredFields;
    let element = document.getElementById(invalidFields[0]);
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
    if (! element.checkValidity() || element.value == 0) {
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

function formatPhoneInput(id) {
    let element = document.getElementById(id);
    let inputValue = element.value;
    let formattedValue = inputValue;
    // let rawValue = inputValue.replaceAll(' ', '');
    // let containsSpaces = inputValue.length > rawValue.length;
    if(! inputValue.startsWith("+")) {
        formattedValue = "+49 " + inputValue;
    }
    element.value = formattedValue;
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

