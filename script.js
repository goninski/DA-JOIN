
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





// HELPER FUNCTIONS


function reloadPage(event) {
    event.preventDefault();
    location.href = location.pathname;
}

// function getInputValue(formId, property) {
//     let form = document.getElementById(formId);
//     let formData = new FormData(form);
//     let value = formData.get(property);
//     console.log(value);
//     return value;
// }

function getClosestParentElementFromEvent(event, selector = '') {
    let element = event.currentTarget;
    if(element) {
        return element.closest(selector);
    }
    return;
}

function getClosestParentElementFromId(id, selector = '') {
    let element = document.getElementById(id);
    if(element) {
        return element.closest(selector);
    }
    return;
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

function sortCategories(categories) {
    return categories.sort((a, b) => a.id.localeCompare(b.id));
}

function getBooleanFromString(booleanString) {
    if(booleanString == 'true') {
        return true;
    } else {
        return false;
    }
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



