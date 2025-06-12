let currentPage = window.location.pathname;
let loggedInUserId = null;
let loggedInUser = null;
document.addEventListener('click', documentEventHandler);


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
}


/**
 * Sign out procedure (remove auth status and redirect to login)
 */
function signOut(event) {
    event.stopPropagation();
    redirectToLogin();
}


/**
 * Redirect to login page
 * 
 * @param {number} timeout - timeout milliseconds
 */
function redirectToLogin(event = null, timeout = 1500) {
    event ? event.stopPropagation() : null;
    loggedInUserId = null;
    localStorage.removeItem('pseudoAuthStatus');
    setTimeout(function() {window.location.href = '/login.html'}, timeout);
}


/**
 * Get html main templates (header, sideNavBar etc.)
 */
function getMainTemplates() {
    getHeader();
    getNavBar();
    setNavLinkProps();
    getOrientationOverlay();
}


/**
 * Get html header
 */
function getHeader() {
    document.getElementById('header').innerHTML = getHeaderTemplate();
}


/**
 * Get html sideNavBar/mobile bottom bar
 */
function getNavBar() {
    let sideNavBar = document.getElementById('sideNavBar');
    sideNavBar.innerHTML = getNavBarTemplate();
    sideNavBar.classList.add('hide--ss-mob');

    let footerNavBar = document.getElementById('footerNavBar');
    footerNavBar.innerHTML = getNavBarTemplate();
    footerNavBar.classList.add('show--ss-mob');
}


/**
 * Set dynamic nav properties (user batch, active url styles/icons)
 */
function setNavLinkProps() {
    let headerNavToggle = document.getElementById('headerNavTrigger');
    headerNavToggle.innerText = loggedInUser ? loggedInUser.initials : 'G';
    let navLinks = document.querySelectorAll('nav .nav-links a');
    navLinks.forEach(link => {
        if(link.href === window.location.href) {
            link.classList.add('active');
            let iconElement = link.querySelector('img');
            iconElement ? iconElement.src = iconElement.src.replace('.svg', '-active.svg') : null;
        }
    });
}


/**
 * Toggle header navigation
 * 
 * @param {event} event - click (header nav button)
 */
function toggleHeaderNav(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('headerNavDropdown').classList.toggle('is-open');
}


/**
 * Get html orientation overlay
 */
function getOrientationOverlay() {
    let element = document.getElementById('orientationOverlay');
    if(element) {
        element.textContent = 'Please turn device or window to portrait orientation !';
        element.addEventListener('click', event => {event.stopPropagation();})
    }
}


/**
 * Document Event handler: close various dialogues
 * 
 * @param {event} event - click (document)
 */
function documentEventHandler(event) {
    if( event.type === "click" ) {
        let elementIds = ['headerNavDropdown', 'contactOptionsMenu'];
        elementIds.forEach(elementId => {
            let element = document.getElementById(elementId);
            element ? element.classList.remove('is-open') : null;
        });
    }
}


/**
 * Close all open elements of certain selector (multiple use)
 * 
 * @param {string} selector - query-all selector 
 */
function closeOpenElements(selector) {
    let elements = document.querySelectorAll(selector);
    if(elements) {
        elements.forEach(element => {
            if(element.classList.contains('is-open')) {
                element.classList.remove('is-open');
            };
        });
    }
}

/**
 * Event Handler: close current element (multiple use)
 * 
 * @param {event} event - various
 */
function closeElementByCurrentTarget(event) {
    event.stopPropagation();
    let element = event.currentTarget;
    element ? element.classList.remove('is-open') : null;
}


/**
 * Helper: check if object exists and has length
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
 * Helper: close parent wrapper
 * 
 * @param {event} event - inherit
 * @param {string} selector - selector of the wrapper to close
 */
function closeParentWrapper(event, selector = '.close-on-event') {
    let wrapper = getClosestParentElementFromEvent(event, selector);
    wrapper ? wrapper.classList.remove('is-open') : null;
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
 * Helper: return closest specific parent element from element
 * 
 * @param {element} element - dom element
 * @param {string} selector - css selector of the specific parent element
 */
function getClosestParentElementFromElement(element, selector = '') {
    return element.closest(selector);
}


/**
 * Helper: return closest specific parent element from event
 * 
 * @param {event} event - inherit
 * @param {string} selector - css selector of the specific parent element
 */
function getClosestParentElementFromEvent(event, selector = '') {
    let element = event.currentTarget;
    if(element) {return element.closest(selector);}
}


/**
 * Helper: return closest specific parent element from id
 * 
 * @param {string} id - current element id
 * @param {string} selector - css selector of the specific parent element
 */
function getClosestParentElementFromId(id, selector = '') {
    let element = document.getElementById(id);
    if(element) {return element.closest(selector);}
}


/**
 * Helper: return boolean from string true/false
 * 
 * @param {string} booleanString - string ('true'/'false')
 */
function getBooleanFromString(booleanString) {
    return (booleanString == 'true') ? true : false;
}


/**
 * Helper: convert a date to string for DB (YYYY-MM-DD)
 * 
 * @param {date} date - a date object
 */
function formatDateToStringDB(date) {
    let year = date.getFullYear();
    let month = ('0'+ (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let formattedDate = year + '-' + month + '-' + day;
    return formattedDate;
}


/**
 * Helper: convert a DB date string (YYYY-MM-DD) to a full date string (Month Day, Year)
 * 
 * @param {string} dateStringDB  - date string (YYYY-MM-DD)
 */
function formatDateFromStringDBToFull(dateStringDB) {
    let timeStamp = Date.parse(dateStringDB);
    let date = new Date(timeStamp);
    let formattedDate = date.toLocaleString('en-US', { month: 'long', day: 'numeric' , year: 'numeric'});
    return formattedDate;
}


/**
 * Helper: add days to a date
 * 
 * @param {date} date - date object
 * @param {number} days - number of days to add
 * @returns {date}
 */
function addDaysToDate(date, days) {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}


/**
 * Helper: toggle icon color on hover (only for svg sources on img element)
 * 
 * @param {event} event - current event
 * @param {string} hoverColor - file suffix for the hover svg file
 */
function toggleIconColorOnHover(event, hoverColor = 'blue') {
    event.stopPropagation();
    let iconElement = event.currentTarget.querySelector('img');
    if(!iconElement) return;
    let hoverFileSuffix = '-' + hoverColor + '.svg';
    let iconSource = iconElement.src;
    if(event.type == 'mouseover') {
        return (!iconSource.endsWith(hoverFileSuffix)) ? iconElement.src = iconElement.src.replace('.svg', hoverFileSuffix) : null;
    }
    if(event.type == 'mouseleave') {
        return (iconSource.endsWith(hoverFileSuffix)) ? iconElement.src = iconElement.src.replace(hoverFileSuffix, '.svg') : null;
    }
}


/**
 * Helper: show floating message with timeout
 * 
 * @param {string} template - code name for specific template (text, addedTask)
 * @param {string} msg - message content
 * @param {number} timeout - timeout milliseconds (-1 = default)
 * @param {string} optClass - optional class (showing-default, alert)
 */
async function showFloatingMessage(template, msg = '', timeout = -1, optClass = 'showing-default') {
    let element = document.getElementById("floatingMsg");
    element.innerHTML = '';
    if(element) {
        timeout === -1 ? timeout = 3000 : null;
        element.classList.remove('showing-default', 'showing-top', optClass);
        element.innerHTML = (template == 'addedTask') ? getFloatingMessageTaskAddedTemplate() : getFloatingMessageTextTemplate(msg);
        element.classList.add('button', 'btn-icon', 'btn-primary', 'animate', optClass);
        setTimeout(() => element.classList.remove('animate', optClass), timeout);
    }
}


/**
 * Helper: add and remove body class with timer (helper for animation styles)
 * 
 * @param {string} className - class to add
 * @param {number} timemoutAdd - timeout (ms) to add the class (-9 = do not add)
 * @param {number} timemoutRemove - timeout (ms) to remove the class (-9 = do not remove)
 */
async function addBodyClass(className, timeoutAdd = 0, timeoutRemove = -9) {
    document.body.classList.remove(className);
    timeoutAdd >= 0 ? setTimeout(() => document.body.classList.add(className), timeoutAdd) : null;
    timeoutRemove >= 0 ? removeBodyClass(className, timeoutRemove) : null;
}


/**
 * Helper: remove body class with timer
 * 
 * @param {string} className - class to add
 * @param {number} timemoutRemove - timeout (ms) to remove the class (-1 = default)
 */
async function removeBodyClass(className, timeout = -1) {
    timeout === -1 ? timeout = 1500 : null;
    document.body.classList.remove(className);
    setTimeout(() => document.body.classList.remove(className), timeout);
}


/**
 * Helper: run a slide in animation for specific element
 * 
 * @param {element} element - dom element
 * @param {number} timeout - timeout milliseconds
 */
async function runSlideInAnimation(element, timeout = 0) {
    element.classList.remove('slide-out');
    element.classList.add('slide-in');
    setTimeout(() => element.style = '', timeout);
}


/**
 * Helper: Run a slide out animation for specific element
 * 
 * @param {element} element - dom element
 * @param {number} timeout - timeout milliseconds
 */
async function runSlideOutAnimation(element, timeout = 175) {
    element.classList.remove('slide-in');
    element.classList.add('slide-out');
    setTimeout(() => element.style = 'display: none', timeout);
}

