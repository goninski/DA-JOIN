let currentPage = window.location.pathname;
let loggedInUserId = null;


/**
 * Checks authorization for current page
 */
async function checkAuth() {
    let urlUserId = await getUserFromURL();
    let isLoggedIn = await userIsLoggedIn(urlUserId);
    // console.log(urlUserId);
    // console.log(isLoggedIn);
    !isLoggedIn ? window.location.href = "/login.html" : null;
}


/**
 * Sets the logged in user id from url
 */
async function getUserFromURL() {
    let urlSearch = window.location.search;
    let urlParams = new URLSearchParams(urlSearch);
    let user = urlParams.get('user');
    // console.log(urlSearch);
    // console.log(urlParams);
    // console.log(user);
    loggedInUserId = hasLength(user) ? user.toString() : null;
    // console.log(loggedInUserId);
}


/**
 * Checks if user is logged in
 * 
 * @param {string} userId - user id (from auth)
 * @returns {boolean}
 */
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


/**
 * On page load terms pages
 */
function init() {
    getMainTemplates();
}


/**
 * Get html main templates (header, sidebar etc.)
 */
function getMainTemplates() {
    getHeader();
    getSidebar();
}


/**
 * Get html header
 */
function getHeader() {
    document.getElementById('header').innerHTML = getHeaderTemplate();
}


/**
 * Get html sidebar/mobile bottom bar
 */
function getSidebar() {
    let sidebarRef = document.getElementById('sidebar');
    sidebarRef.innerHTML = getSidebarTemplate();
    sidebarRef.classList.add('hide--ss-mob');

    let sidebarMobRef = document.getElementById('sidebarMob');
    sidebarMobRef.innerHTML = getSidebarMobTemplate();
    sidebarMobRef.classList.add('show--ss-mob');
}


/**
 * Sign in procedure (set login status, redirect to summary)
 */
async function signIn() {
    if(loggedInUserId == '') {return;}
    !loggedInUserId == 'guest' ? await updateContactProperty(loggedInUserId, 'loggedIn', true) : null;
    console.log(loggedInUserId);
    setTimeout(function() {window.location.href = "/summary.html?user=" + loggedInUserId;}, 1000);
    // checkAuth();
}


/**
 * Sign out procedure (update login status, redirect to login)
 */
async function signOut() {
    if(hasLength(loggedInUserId) && loggedInUserId != 'guest') {
        updateContactProperty(loggedInUserId, 'loggedIn', null);
    }
    loggedInUserId = null;
    window.location.href = "/login.html";
}


/**
 * Helper: checks if object exists and has length
 * 
 * @param {object} object - any object
 * @returns {boolean}
 */
function hasLength(object) {
    if(object && object.length > 0) {
        return true;
    }
}


/**
 * Helper: returns closest specific parent element from element
 * 
 * @param {element} element - dom element
 * @param {string} selector - css selector of the specific parent element
 */
function getClosestParentElementFromElement(element, selector = '') {
    return element.closest(selector);
}


/**
 * Helper: returns closest specific parent element from event
 * 
 * @param {event} event - inherit
 * @param {string} selector - css selector of the specific parent element
 */
function getClosestParentElementFromEvent(event, selector = '') {
    let element = event.currentTarget;
    if(element) {
        return element.closest(selector);
    }
    return;
}


/**
 * Helper: returns closest specific parent element from id
 * 
 * @param {string} id - current element id
 * @param {string} selector - css selector of the specific parent element
 */
function getClosestParentElementFromId(id, selector = '') {
    let element = document.getElementById(id);
    if(element) {
        return element.closest(selector);
    }
    return;
}


/**
 * Helper: returns category index of the categories object, from category id
 * 
 * @param {string} categoryId - category id
 */
async function getCategoryIndexFromId(categoryId) {
    return categories.findIndex(category => category.id == categoryId);
}


/**
 * Helper: returns contact index id of the contacts object, from contact
 * 
 * @param {string} contactId - contact id
 */
async function getContactIndexFromId(contactId) {
    return contacts.findIndex(contact => contact.id == contactId);
}


/**
 * Helper: returns task index of the tasks object, from task id
 * 
 * @param {string} taskId - task id
 */
async function getTaskIndexFromId(taskId) {
    return tasks.findIndex(task => task.id == taskId);
}


/**
 * Helper: sort the contacts objects array alphabetically
 * 
 * @param {array} contacts - contacts objects array
 */
async function sortContacts(contacts) {
    return await contacts.sort((a, b) => a.name.localeCompare(b.name));
}


/**
 * Helper: sort the category objects array alphabetically
 * 
 * @param {object} categories - categories objects array
 */
async function sortCategories(categories) {
    return await categories.sort((a, b) => a.id.localeCompare(b.id));
}


/**
 * Helper: sort the category object alphabetically
 * 
 * @param {object} categories - categories object
 */
function getBooleanFromString(booleanString) {
    if(booleanString == 'true') {
        return true;
    } else {
        return false;
    }
}


/**
 * Helper: returns the first word of a string
 * 
 * @param {string} string - string
 */
function getFirstWord(string, index = 0) {
    let array = string.split(" ");
    return array[index];
}


/**
 * Helper: returns the last word of a string
 * 
 * @param {string} string - string
 */
function getLastWord(string) {
    let array = string.split(" ");
    return array[array.length - 1];
}


/**
 * Helper: sets the first letter of string to upper case and returns the full string
 * 
 * @param {string} string - string
 */
function setFirstLetterUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}


/**
 * Helper: returns first letter of first and last word of a string, in upper case
 * 
 * @param {string} string - string
 */
function getInitialsOfFirstAndLastWord(string) {
    let firstWord = getFirstWord(string);
    let lastWord = getLastWord(string);
    return (firstWord[0] + lastWord[0]).toUpperCase();
}


/**
 * Helper: returns first letter of last word of a string, in upper case
 * 
 * @param {string} string - string
 */
function getInitialOfLastWord(string) {
    let lastWord = getLastWord(string);
    return lastWord[0].toUpperCase();
}


/**
 * Helper: returns the highest id of an object array
 * 
 * @param {array} objArray - array with objects (needs a property of id)
 */
async function getMaxIdFromObjArray(objArray) {
    return Math.max(...objArray.map(item => item.id));
}


/**
 * Helper: return a random hex color string
 * 
 * @param {string} format - color format (hex)
 */
function getRandomColor(format = 'hex') {
    let clr = Math.floor(Math.random()*16777215).toString(16);
    clr = '#' + clr;
    if(clr.length == 6) {
        clr = clr + '0';
    }
    return clr;
}


/**
 * Helper: return a random string in a specific length
 * 
 * @param {number} length - lenght of the string
 */
function getRandomString(length = 20) {
    let characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    let result = ' ';
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.trim();
}


/**
 * Helper: sets the value of a specific dom element with the current date (today)
 * 
 * @param {string} id - id of the specific element (in general a date input element)
 */
function setTodayAsDateValue(id) {
    document.getElementById(id).valueAsDate = new Date();
}


/**
 * Helper: converts a date to string for DB (YYYY-MM-DD)
 * 
 * @param {date} date - a date object
 */
function formatDateToStringDB(date) {
    let year = date.getFullYear();
    let month = ('0'+ (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let formattedDate = year + '-' + month + '-' + day;
    // console.log(formattedDate);
    return formattedDate;
}


/**
 * Helper: converts a DB date string (YYYY-MM-DD) to a full date string (Month Day, Year)
 * 
 * @param {string} dateStringDB  - date string (YYYY-MM-DD)
 */
function formatDateFromStringDBToFull(dateStringDB) {
    let timeStamp = Date.parse(dateStringDB);
    let date = new Date(timeStamp);
    let formattedDate = date.toLocaleString('en-US', { month: 'long', day: 'numeric' , year: 'numeric'});
    // console.log(formattedDate);
    return formattedDate;
}


/**
 * Helper: adds days to a date
 * 
 * @param {date} date - date object
 * @param {number} days - number of days to add
 * @returns {date}
 */
function addDaysToDate(date, days) {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}


/**
 * Helper: returns the current day segment (morning, afternoon, evening)
 */
function getDaySegment() {
  let currentDate = new Date();
  let hours = currentDate.getHours();
  let daySegment = 'afternoon';
  if(hours >=0 && hours < 12) {
    daySegment = 'morning';
  } else if(hours >= 18) {
    daySegment = 'evening';
  }
  return daySegment;
}


/**
 * Shows an alert with timeout
 * 
 * @param {string} msg - alert message
 * @param {number} timeout - timeout milliseconds
 */
async function showAlert(msg, timeout = 250) {
    setTimeout(function() { alert(msg) }, timeout);
}


/**
 * Shows a floating message with timeout
 * 
 * @param {string} template - code name for specific template (text, addedTask)
 * @param {string} msg - message content
 * @param {number} timeout - timeout milliseconds
 */
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


/**
 * Runs a slide in animation for specific element
 * 
 * @param {element} element - dom element
 * @param {number} timeout - timeout milliseconds
 */
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


/**
 * Runs a slide out animation for specific element
 * 
 * @param {element} element - dom element
 * @param {number} timeout - timeout milliseconds
 */
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


