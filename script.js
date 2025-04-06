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

function resetInput(event, id) {
    document.getElementById(id).reset()
    event.preventDefault();
}

function validateInput(id, parent = false) {
    let element = document.getElementById(id);
    if (! element.checkValidity() || element.value == 0) {
        if(! invalidFields.includes(id)) {
            invalidFields.push(id);
        }
        setInvalidStyles(element, parent);
    } else {
        setValidStyles(element);
        return element.value;
    }
}

function resetInputValidation(id, parent = false) {
    let element = document.getElementById(id);
    let index = invalidFields.findIndex(item => item == id);
    if(index >= 0) {
        invalidFields.splice(index, 1);
    }
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




// TEMPLATE CALLS FOR TASK INPUTS
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


