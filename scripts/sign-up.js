const nameField = document.getElementById('sign-up-name');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('pwd');
const confirmPwdField = document.getElementById('confirm_pwd');

async function addUser(event) {
  event.preventDefault();

  const nameInput = nameField.value.trim();
  const emailInput = emailField.value.trim();
  const passwordInput = passwordField.value.trim();
  const passwordRepeatInput = confirmPwdField.value.trim();

  if (!checkValidity()) return;

  resetErrorStyles();

  if (!checkInputfields(nameInput, emailInput, passwordInput, passwordRepeatInput)) return;

  if (!checkPasswords(passwordInput, passwordRepeatInput)) return;

  if (await emailAlreadyExists(emailInput)) return;

  //const users = await getFromLocalStorage("users") || [];

  const newUser = {
    name: nameInput,
    email: emailInput,
    password: passwordInput
  };

  // users.push(newUser);
  // await saveToLocalStorage("users", users);

  // showSignUpSuccessOverlay();

  await signUp(newUser);
}


/**
 * Sign up procedure
 * 
 * @param {object} newUser - new signed up user object
 */
async function signUp(newUser) {
  await createContact(newUser);
  await showFloatingMessage('text', 'You Signed Up successfully');
  redirectToLogin();
}


function checkValidity() {
  const form = document.getElementById("signup-form");
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}

function checkInputfields(name, email, password, passwordRepeat) {
  if (!name || !email || !password || !passwordRepeat) {
    alert('Bitte alle Felder ausfüllen.');
    return false;
  }
  return true;
}

function checkPasswords(password, passwordRepeat) {
  if (password !== passwordRepeat) {
    alert('Passwörter stimmen nicht überein!');
    document.getElementById('confirm-pwd-div-sign-up').classList.add('input-error');
    return false;
  }
  return true;
}

async function emailAlreadyExists(emailInput) {
  // const users = await getFromLocalStorage("users") || [];
  await getUserData();
  console.log(contacts);
  if (contacts.find(user => user.email === emailInput)) {
    alert("Diese E-Mail ist bereits registriert.");
    document.getElementById('email-div-sign-up').classList.add('input-error');
    clearFields();
    return true;
  }
  return false;
}

function resetErrorStyles() {
  document.getElementById('email-div-sign-up').classList.remove('input-error');
  document.getElementById('confirm-pwd-div-sign-up').classList.remove('input-error');
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
  } else {
    icon.classList.remove('eye-pic', 'eye-text-pic');
    icon.classList.add('pwd-pic');
    inputElement.type = 'password';
  }
}

function togglePasswordVisibility(inputId, iconElement) {
  const input = document.getElementById(inputId);

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

// window.onload = function () { console.log(usersDatabase); }

