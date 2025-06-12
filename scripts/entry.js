currentContact = {};
loggedInUserId = null;
localStorage.removeItem('pseudoAuthStatus');


/**
 * on page load login.html
 */
async function initLogin() {
    await removeBodyClass('before-animation', 125);
    await addBodyClass('animated', 1750);
    setInitialFormState('loginForm');
    getOrientationOverlay();
}


/**
 * on page load sign-up.html
 */
async function initSignUp() {
    setInitialFormState('signUpForm');
    getOrientationOverlay();
}


/**
 * Event handler: password input (show/hide visibility button)
 * 
 * @param {event} event - oninput (password input)
 */
function passwordInputHandler(event) {
    event.stopPropagation();
    setSubmitBtnStateOnEvent(event);
    getCurrentFieldElements(event.currentTarget);
    let inputValue = currentFieldElements.input.value;
    let pwIconElement = currentFieldElements.fieldWrapper.querySelector('[alt="password-icon"]');
    let visibilityButton = currentFieldElements.fieldWrapper.querySelector('button');
    if(inputValue.length > 0) {
        pwIconElement.classList.add('hide');
        visibilityButton.classList.remove('hide');
    } else {
        pwIconElement.classList.remove('hide');
        visibilityButton.classList.add('hide');
    }
}


/**
 * Event handler: password input (show/hide visibility button)
 * 
 * @param {event} event - oninput (password input)
 */
function hidePasswordInput(element) {
    getCurrentFieldElements(element);
    let pwIconElement = currentFieldElements.fieldWrapper.querySelector('[alt="password-icon"]');
    let visibilityButton = currentFieldElements.fieldWrapper.querySelector('button');
    if(inputValue.length > 0) {
        pwIconElement.classList.add('hide');
        visibilityButton.classList.remove('hide');
    } else {
        pwIconElement.classList.remove('hide');
        visibilityButton.classList.add('hide');
    }
}


/**
 * Event handler: toggle password visibility (hidden/visible)
 * 
 * @param {event} event - onclick (password visibility icon) / onfocusout
 */
function togglePasswordVisibility(event) {
    event.stopPropagation();
    event.preventDefault();
    getCurrentFieldElements(event.currentTarget);
    let inputElement = currentFieldElements.input;
    let iconElement = currentFieldElements.fieldWrapper.querySelector('button').querySelector('img');
    if(inputElement.type === 'text' || event.type == 'focusout') {
        inputElement.type = 'password';
        iconElement.src = iconElement.src.replace('visible', 'hidden');
        iconElement.alt = iconElement.alt.replace('visible', 'hidden');
    } else {
        inputElement.type = 'text';
        iconElement.src = iconElement.src.replace('hidden', 'visible');
        iconElement.alt = iconElement.alt.replace('hidden', 'visible');
    }
}


/**
 * Validate password confirmation
 * 
 * @param {element} element - input element (call form global focusOutHandler)
 */
function validateConfirmPassword(element) {
    let pwConfirm = element.value;
    let form = element.form;
    let pwInputElement = form.querySelector('[data-type="password"]');
    if(pwInputElement) {
      let pw = pwInputElement.value;
      return (pwConfirm === pw);
    }
}


/**
 * Sign in as guest
 * 
 * @param {event} event - onclick (guest log in button)
 */
async function loginAsGuest(event) {
    event.preventDefault();
    await submitLoginFormHandler(event, true);
}


/**
 * Event handler: submit login form handler
 * 
 * @param {event} event - click (login form submit)
 * @param {boolean} isGuest - is guest login true/false
 */
async function submitLoginFormHandler(event, isGuest = false) {
    event.stopPropagation();
    event.preventDefault();
    let formInputs = await getFormInputObj('loginForm');
    if(isGuest) {
        loggedInUserId = 'guest';
        return await loginSuccessfull(formInputs);
    }
    if(formIsValid('loginForm')) {
        await checkIfUserAndPasswordIsCorrect(formInputs.email, formInputs.password) ? await loginSuccessfull(formInputs) : await loginFail();
    }
}


/**
 * Successfull login procedure
 * 
 * @param {object} formInputs - form input object
 */
async function loginSuccessfull(formInputs) {
    await saveToLocalStorage('pseudoAuthStatus', loggedInUserId);
    let floatingMsg = 'You logged in successfully';
    let timeout = 2000;
    if(formInputs.loadFreshDataSet && formInputs.loadFreshDataSet == 'on') {
        await resetData();
        floatingMsg = 'You logged in successfully <br>and a fresh set of dummy data is loaded';
        timeout = 2500;
    }
    await showFloatingMessage('text', floatingMsg);
    setTimeout(() => window.location.href = '/summary.html', timeout);
}


/**
 * Login fail procedure (notification if user does not exist or password is wrong)
 */
async function loginFail() {
    let element = document.getElementById('loginFailAlert');
    let fieldWrapper = getFieldWrapperFromElement(element);
    fieldWrapper ? fieldWrapper.classList.add('fail') : null;
}


/**
 * Event handler: submit sign up form
 * 
 * @param {event} event - click (signup form submit)
 */
async function submitSignUpFormHandler(event) {
    event.stopPropagation();
    event.preventDefault();
    if(formIsValid('signUpForm')) {
        let formInputs = await getFormInputObj('signUpForm');
        await isExistingContact(formInputs.email) ? await signUpFail() : await signUpSuccessfull(formInputs);
    }
}


/**
 * Successfull sign up procedure (create user and redirect to login page)
 */
async function signUpSuccessfull(formInputs) {
      await setContactPropertiesOnSignUp(currentContact, formInputs);
      await createContact(currentContact);
      await showFloatingMessage('text', 'You Signed Up successfully');
      redirectToLogin();
}


/**
 * Sign up fail procedure (notification if user already exists and redirect to login page)
 */
async function signUpFail() {
      await showFloatingMessage('text', 'Your Email Address already exists. <br>Please sign in.', 2000, 'alert');
      redirectToLogin();
}


/**
 * Helper: set loggedInUserId and return true if user exists and password is correct
 * 
 * @param {string} email - email address and password from login form
 */
async function checkIfUserAndPasswordIsCorrect(email, password) {
    await getUserData();
    let user = contacts.find(contact => contact.email == email);
    if(!user) {
        return false;
    }
    if(user.password === password) {
        loggedInUserId = user.id;
        return true;
    }
}


/**
 * Helper: set contact (user) properties for the signed up user
 * 
 * @param {object} currentContact - current contact object
 * @param {object} formInputs - current form inputs object
 */
async function setContactPropertiesOnSignUp(currentContact, formInputs ) {
    if(hasLength(formInputs.name)) {
        currentContact.name = formInputs.name;
        currentContact.email = formInputs.email;
        currentContact.password = formInputs.password;
    } else {
        console.log('error: no form inputs !');
    }
}