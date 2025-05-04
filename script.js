let currentPage = window.location.pathname;

function init() {
    getMainTemplates();
}

function initSummary() {
    getMainTemplates();
    getAllData();
}

function getMainTemplates() {
    getHeader();
    getSidebar();
}

function getHeader() {
    document.getElementById('header').innerHTML = getHeaderTemplate();
}

function getSidebar() {
    let sidebarRef = document.getElementById('sidebar');
    sidebarRef.innerHTML = getSidebarTemplate();
    sidebarRef.classList.add('hide--ss-mob');

    let sidebarMobRef = document.getElementById('sidebarMob');
    sidebarMobRef.innerHTML = getSidebarMobTemplate();
    sidebarMobRef.classList.add('show--ss-mob');
}

function signIn() {
    setTimeout(function() { 
        window.location.href = "/summary.html";
      }, 1000);
}

function signOut() {
    window.location.href = "/login.html";
}




// HELPER FUNCTIONS


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

async function getTaskIndexFromId(taskId) {
    return tasks.findIndex(task => task.id == taskId);
}

async function getContactIndexFromId(contactId) {
    return contacts.findIndex(contact => contact.id == contactId);
}

async function getCategoryIndexFromId(categoryId) {
    return categories.findIndex(category => category.id == categoryId);
}


async function sortContacts(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

async function sortCategories(categories) {
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

function getFirstWord(string, index = 0) {
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
    let firstWord = getFirstWord(string);
    let lastWord = getLastWord(string);
    return (firstWord[0] + lastWord[0]).toUpperCase();
}

function getInitialOfLastWord(string) {
    let lastWord = getLastWord(string);
    return lastWord[0].toUpperCase();
}

function getRandomColor(format = 'hex') {
    let clr = Math.floor(Math.random()*16777215).toString(16);
    clr = '#' + clr;
    if(clr.length == 6) {
        clr = clr + '0';
    }
    return clr;
}

function getRandomString(length = 20) {
    let characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    let result = ' ';
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.trim();
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




// console.log(currentPage);
if(currentPage != '/login.html' && currentPage != '/logout.html') {
    // renderTemporaryButtons();
}

function renderTemporaryButtons() {
    let btn = document.createElement("button");
    btn.innerHTML = 'Logout';
    btn.style = 'color: white; position: fixed; bottom: 0; width: 232px; height: 48px;';
    btn.addEventListener('click', signOut)
    document.body.appendChild(btn);
  };
  

