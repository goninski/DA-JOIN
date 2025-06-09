const nameField = document.getElementById('sign-up-name');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('pwd');
const confirmPwdField = document.getElementById('confirm_pwd');


async function signUpSubmitHandler(event) {
  event.preventDefault();
  const { nameInput, emailInput, passwordInput, passwordRepeatInput } = getSignUpInputs();
  if (!validateSignUpForm(passwordInput, passwordRepeatInput)) return;
  await processSignUp(nameInput, emailInput, passwordInput);
}


function getSignUpInputs() {
  return {
    nameInput: nameField.value.trim(),
    emailInput: emailField.value.trim(),
    passwordInput: passwordField.value.trim(),
    passwordRepeatInput: confirmPwdField.value.trim()
  };
}


function validateSignUpForm(password, passwordRepeat) {
  if (!checkValidity()) return false;
  resetErrorStyles();
  if (!checkPasswords(password, passwordRepeat)) return false;
  return true;
}


async function processSignUp(nameInput, emailInput, passwordInput) {
  try {
    await getUserData();
    let user = createUserObject(nameInput, emailInput, passwordInput);
    await createContact(user);
    loggedInUserId = user.id;
    await showFloatingMessage('text', 'You Signed Up successfully');
    loginRedirect();
  } catch (error) {
    handleSignUpError(error);
  }
}


function createUserObject(name, email, password) {
  return {
    id: getNewContactId(),
    name: name,
    email: email,
    password: password,
    title: "",
    loggedIn: true
  };
}


function handleSignUpError(error) {
  console.error("Sign-Up Fehler:", error);
  showFloatingMessage('error', 'Sign-Up unsuccessful');
}


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


function loginRedirect() {
    window.location.href = "login.html";
}


function toggleCheckboxBox(checkbox) {
    const box = checkbox.parentElement.getElementById('.terms-checkbox');
    if (checkbox.checked) {
        box.classList.add('hide-box');
    } else {
        box.classList.remove('hide-box');
    }
}