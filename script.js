let currentPage = window.location.pathname;
let loggedInUserId = null;
let loggedInUser = {};


/**
 * Checks authorization (redirect to login if unauthorized, if page not public)
 * 
 * @param {boolean} isPublic - public page true/false (e.g. terms pages)
 */
async function checkAuth(isPublic = false) {
    loggedInUserId = await getFromLocalStorage('pseudoAuthStatus');
    if(loggedInUserId == 'guest') return;
    document.body.classList.add('logged-out');
    if(loggedInUserId === null) {
        if(!isPublic) return redirectToLogin();
    } else {
        loggedInUser = await getContactById(loggedInUserId);
        // console.log(loggedInUser);
        if(!loggedInUser) {
            if(!isPublic) return redirectToLogin();
            return;
        }
        document.body.classList.remove('logged-out');
    }
}


/**
 * On page load terms pages
 */
async function initTermsPages(linkIdSuffix = '') {
    await getUserData();
    await checkAuth(true);
    getMainTemplates();
    !linkIdSuffix == '' ? setNavLinkProps(linkIdSuffix, false): null;
}


/**
 * Sign out procedure (remove auth status and redirect to login)
 */
function signOut() {
    redirectToLogin();
}


/**
 * Redirect to login page
 */
function redirectToLogin() {
    // loggedInUserId = null;
    // localStorage.removeItem('pseudoAuthStatus');
    setTimeout(function() {window.location.href = '/login.html'}, 1500);
}


/**
 * Get html main templates (header, sideNavBar etc.)
 */
function getMainTemplates() {
    getHeader();
    getNavBar();
    getOrientationOverlay();
}


/**
 * Get html header
 */
function getHeader() {
    document.getElementById('header').innerHTML = getHeaderTemplate();
}


/**
 * toggle header navigation
 */
function toggleHeaderNav() {
    document.getElementById('headerNav').classList.toggle('hide');
}


/**
 * Get html sideNavBar/mobile bottom bar
 */
function getNavBar() {
    let sideNavBar = document.getElementById('sideNavBar');
    sideNavBar.innerHTML = getNavBarTemplate();
    sideNavBar.classList.add('hide--ss-mob');

    let footerNavBar = document.getElementById('footerNavBar');
    footerNavBar.innerHTML = getNavBarTemplate('Mob');
    footerNavBar.classList.add('show--ss-mob');
}


/**
 * Set active menu link properties (active class, white icon, user initials)
 * 
 * @param {string} linkIdSuffix - suffix (last word) of id from menuLink..
 * @param {boolean} isIcon - true if icon element of the link
 */
function setNavLinkProps(linkIdSuffix = '', isIcon = true) {
    let headerNavToggle = document.getElementById('headerNavTrigger');
    let linkSideBar = document.getElementById('navLink' + linkIdSuffix);
    let linkFooterBar = document.getElementById('navLink' + linkIdSuffix + 'Mob');
    headerNavToggle.innerText = loggedInUser ? loggedInUser.initials : 'G';
    linkSideBar.classList.add('active');
    linkFooterBar.classList.add('active');
    if(isIcon) {
        linkSideBar.src = linkSideBar.src.replace('.svg', '-active.svg');
        linkFooterBar.src = linkFooterBar.src.replace('.svg', '-active.svg');
    }
}


/**
 * Get html orientation overlay
 */
function getOrientationOverlay() {
    let element = document.getElementById('orientationOverlay');
    element.textContent = 'Please turn device or window to portrait orientation !'
    element.addEventListener('click', event => {event.stopPropagation();})
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
 * Helper: sort and return array alphabetically
 * 
 * @param {array} array - data array
 * @param {string} sortByProperty - property to sort by
 */
async function sortArray(array, sortByProperty = 'id') {
    return await array.sort((a, b) => a[sortByProperty].localeCompare(b[sortByProperty]));
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
 * Helper: return boolean from string true/false
 * 
 * @param {string} booleanString - string ('true'/'false')
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
