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




function resetInput(event, id) {
    document.getElementById(id).reset()
    event.preventDefault();
}

function validateInput(id) {
    let element = document.getElementById(id);
    if (! element.checkValidity() || element.value == 0) {
        setRequiredClass(element);
        return false;
    }
    return element.value;
}

function resetInputValidation(id) {
    let element = document.getElementById(id);
    removeRequiredClass(element);
}

function setRequiredClass(element) {
    element.parentNode.classList.add('show-validation-msg');
}

function removeRequiredClass(element) {
    element.parentNode.classList.remove('show-validation-msg');
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


