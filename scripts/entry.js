currentContact = {};
loggedInUserId = null;
localStorage.removeItem('pseudoAuthStatus');
// submitBtnStateMode = 2; // 1=full validation, 2=required


/**
 * on page load login.html
 */
async function initLogin() {
    await runLogoEntryAnimation();
    await fadeInOnEntry();
    await setInitialFormState('loginForm');
}


/**
 * on page load sign-up.html
 */
async function initSignUp() {
    await setInitialFormState('signUpForm');
}


/**
 * Run Logo entry animation
 */
async function runLogoEntryAnimation() {
    let logo = document.getElementById('logoMain');
    logo.classList.add('animated');
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
 * Event handler: password input (show/hide visibility button)
 * 
 * @param {event} event - oninput (password input)
 */
function passwordInputHandler(event) {
    event.stopPropagation();
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
    setSubmitBtnStateOnEvent(event);
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
    setFormFieldsValidity('loginForm');
    if(!hasLength(invalidFields)) {
        let formInputs = await getFormInputObj('loginForm');
        if(isGuest) {
            loggedInUserId = 'guest';
            return await successfullLogin(formInputs);
        }
        await checkIfUserAndPasswordIsCorrect(formInputs.email, formInputs.password) ? await successfullLogin(formInputs) : await loginFail();
    }
}


/**
 * Successfull login procedure
 * 
 * @param {object} formInputs - form input object
 */
async function successfullLogin(formInputs) {
    await saveToLocalStorage('pseudoAuthStatus', loggedInUserId);
    let floatingMsg = 'You Signed Up successfully';
    if(formInputs.loadFreshDataSet && formInputs.loadFreshDataSet == 'on') {
        await resetData();
        floatingMsg = 'You Signed Up successfully and fresh set of dummy data is loaded';
    }
    await showFloatingMessage('text', floatingMsg);
    setTimeout(() => window.location.href = '/summary.html', 2000);
}


/**
 * Login fail procedure (notification if user does not exist or password is wrong)
 */
async function loginFail() {
      await showFloatingMessage('text', 'Check your email and password. <br>Please try again.', 2000, 'alert');
      setInitialFormState('loginForm');
}


/**
 * Event handler: submit sign up form
 * 
 * @param {event} event - click (signup form submit)
 */
async function submitSignUpFormHandler(event) {
    event.stopPropagation();
    event.preventDefault();
    setFormFieldsValidity('signUpForm');
    if(!hasLength(invalidFields)) {
        let formInputs = await getFormInputObj('signUpForm');
        await checkIfUserExists(formInputs.email) ? await signUpFail() : await successfullSignUp(formInputs);
    }
}


/**
 * Successfull sign up procedure (create user and redirect to login page)
 */
async function successfullSignUp(formInputs) {
      await setContactPropertiesOnSignUp(currentContact, formInputs);
      await createContact(currentContact);
      await showFloatingMessage('text', 'You Signed Up successfully');
      redirectToLogin();
}


/**
 * Sign up fail procedure (notification if user already exists and redirect to login page)
 */
async function signUpFail() {
      await showFloatingMessage('text', 'Your Email Address already exists. Please sign in.', 2000, 'alert');
      redirectToLogin();
}


/**
 * Helper: return true if user (email address) exists
 * 
 * @param {string} email - email address from signup form
 */
async function checkIfUserExists(email) {
    await getUserData();
    let user = contacts.find(contact => contact.email == email);
    return user ? true : false;
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