const nameField = document.getElementById('sign-up-name');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('pwd');
const confirmPwdField = document.getElementById('confirm_pwd');

async function signUpSubmitHandler(event) {
  event.preventDefault();
  const nameInput = nameField.value.trim();
  const emailInput = emailField.value.trim();
  const passwordInput = passwordField.value.trim();
  const passwordRepeatInput = confirmPwdField.value.trim();

  if (!checkValidity()) return;
  resetErrorStyles();
  if (!checkPasswords(passwordInput, passwordRepeatInput)) return;

  try {
    // 1. Create user with Firebase Auth
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(emailInput, passwordInput);
    const user = userCredential.user;

    // 2. Save user info in Realtime Database
    await fetch(`${fetchUrl}users/${user.uid}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        name: nameInput,
        email: emailInput,
        createdAt: new Date().toISOString()
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    await showFloatingMessage('text', 'You Signed Up successfully');
    loginRedirect();
  } catch (error) {
    showFloatingMessage('error', error.message);
  }
}

/**
 * Sign up procedure
 * 
 * @param {object} newUser - new signed up user object
 */
async function signUp(newUser) {
  try {
    await createContact(newUser);
    await showFloatingMessage('text', 'You Signed Up successfully');
    loginRedirect();
  } catch (error) {
    console.error("Fehler beim Sign-Up:", error);
    showFloatingMessage('error', 'Sign-Up fehlgeschlagen');
  }
}

function checkValidity() {
  const form = document.getElementById("signup-form");
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}

function checkPasswords(password, passwordRepeat) {
  const errorMsgSignUp = document.getElementById('sign-up-error-message');

  if (password !== passwordRepeat) {
    confirmPwdField.setCustomValidity("");
    passwordField.setCustomValidity("");

    document.getElementById('confirm-pwd-div-sign-up').classList.add('input-error');
    errorMsgSignUp.classList.remove('hidden');
    return false;
  } else {
    confirmPwdField.setCustomValidity("");
    passwordField.setCustomValidity("");
    resetErrorStyles()
    return true;
  }
}

// async function emailAlreadyExists(emailInput) {
//   // const users = await getFromLocalStorage("users") || [];
//   await getUserData();
//   console.log(contacts);
//   if (contacts.find(user => user.email === emailInput)) {
//     alert("Diese E-Mail ist bereits registriert.");
//     document.getElementById('email-div-sign-up').classList.add('input-error');
//     clearFields();
//     return true;
//   }
//   return false;
// }

function resetErrorStyles() {
  document.getElementById('email-div-sign-up').classList.remove('input-error');
  document.getElementById('confirm-pwd-div-sign-up').classList.remove('input-error');
  document.getElementById('sign-up-error-message').classList.add('hidden');
}

function clearFields() {
  nameField.value = '';
  emailField.value = '';
  passwordField.value = '';
  confirmPwdField.value = '';
}

// function showSignUpSuccessOverlay() {
//   const overlaySignUp = document.querySelector('.overlay-sign-up-successfully-background');
//   setTimeout(() => {
//     overlaySignUp.classList.remove('hide');
//     overlaySignUp.classList.add('flex');

//     setTimeout(() => {
//       window.location.href = "login.html";
//     }, 1000);
//   }, 800);
// }

function onPasswordInput(inputElement) {
  const wrapper = inputElement.parentElement;
  const icon = wrapper.querySelector('.pwd-icon');

  if (!icon) return;
  if (inputElement.value.trim().length > 0) {
    icon.classList.remove('pwd-pic');
    icon.classList.add('eye-pic');
    icon.style.pointerEvents = 'auto';
  } else {
    icon.classList.remove('eye-pic', 'eye-text-pic');
    icon.classList.add('pwd-pic');
    inputElement.type = 'password';
    icon.style.pointerEvents = 'none';
  }
}

function togglePasswordVisibility(inputId, iconElement) {
  const input = document.getElementById(inputId);

  if (input.value.trim().length === 0) return;
  if (input.type === 'password') {
    input.type = 'text';
    iconElement.classList.remove('eye-pic');
    iconElement.classList.add('eye-text-pic');
  } else {
    input.type = 'password';
    iconElement.classList.remove('eye-text-pic');
    iconElement.classList.add('eye-pic');
  }
}

/**
 * Redirects the user to the login page after successful sign up
 */
function loginRedirect() {
    window.location.href = "login.html";
}

// window.onload = function () { console.log(usersDatabase); }
