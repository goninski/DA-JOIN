let currentPage = window.location.pathname;
let loggedInUserId = null;

async function checkAuth() {
    let urlUserId = await getUserFromURL();
    let isLoggedIn = await userIsLoggedIn(urlUserId);
    // console.log(urlUserId);
    // console.log(isLoggedIn);
    !isLoggedIn ? window.location.href = "/login.html" : null;
}

async function getUserFromURL() {
    let urlSearch = window.location.search;
    let urlParams = new URLSearchParams(urlSearch);
    let user = urlParams.get('user');
    // console.log(urlSearch);
    // console.log(urlParams);
    // console.log(user);
    loggedInUserId = hasLength(user) ? user.toString() : null;
    console.log(loggedInUserId);
}

async function userIsLoggedIn(userId) {
    return true; // temporary true for all
    if(userId == 'guest') {
        return true;
    }
    let index = contacts.findIndex(user => user.id == userId && user.loggedIn == true);
    // console.log(index);
    if(index >= 0) {
        return true;
    } else {
        return false;        
    }
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

async function signUp() {
    window.location.href = "/login.html";
    // await signIn()
}

async function signIn() {
    if(loggedInUserId == '') {return;}
    !loggedInUserId == 'guest' ? await updateContactProperty(loggedInUserId, 'loggedIn', true) : null;
    console.log(loggedInUserId);
    setTimeout(function() {window.location.href = "/summary.html?user=" + loggedInUserId;}, 1000);
    // checkAuth();
}

async function signOut() {
    if(hasLength(loggedInUserId) && loggedInUserId != 'guest') {
        updateContactProperty(loggedInUserId, 'loggedIn', null);
    }
    loggedInUserId = null;
    window.location.href = "/login.html";
}




// HELPER FUNCTIONS

function hasLength(object) {
    if(object && object.length > 0) {
        return true;
    }
}

function getClosestParentElementFromElement(element, selector = '') {
    return element.closest(selector);
}

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

async function getCategoryIndexFromId(categoryId) {
    return categories.findIndex(category => category.id == categoryId);
}

async function getContactIndexFromId(contactId) {
    return contacts.findIndex(contact => contact.id == contactId);
}

async function getTaskIndexFromId(taskId) {
    return tasks.findIndex(task => task.id == taskId);
}


async function sortContacts(contacts) {
    return await contacts.sort((a, b) => a.name.localeCompare(b.name));
}

async function sortCategories(categories) {
    return await categories.sort((a, b) => a.id.localeCompare(b.id));
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

async function getLastIdFromObjArray(objArray) {
    return Math.max(...objArray.map(item => item.id));
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

function formatDateToYYYYMMDD(date) {
    let year = date.getFullYear();
    let month = ('0'+ (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let formattedDate = year + '-' + month + '-' + day;
    // console.log(formattedDate);
    return formattedDate;
}

function addDaysToDate(date, days) {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

async function showAlert(msg, duration = 250) {
    setTimeout(function() { alert(msg) }, duration);
}

async function showFloatingMessage(template, msg = '', timeout = 1500) {
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
}, timeout);
}


async function runSlideInAnimation(element, timeout = 0) {
    element.classList.remove('slide-out');
    element.classList.add('slide-in');
    if(timeout > 0) {
        setTimeout(function() {
            element.style = '';
            // element.classList.remove('slide-out');
        }, timeout);
    } else {
        element.style = '';
    }
}

async function runSlideOutAnimation(element, timeout = 0) {
    element.classList.remove('slide-in');
    element.classList.add('slide-out');
    if(timeout > 0) {
        setTimeout(function() {
            element.style = 'display: none';
            // element.classList.remove('slide-out');
        }, timeout);
    } else {
        element.style = 'display: none';
    }
}


