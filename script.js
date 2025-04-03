function init() {
    getMainTemplates();
    getAllDataLS();   
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

function setRequiredClass(element) {
    element.parentNode.classList.add('show-required-msg');
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


