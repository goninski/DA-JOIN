const nameField = document.getElementById('sign-up-name');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('pwd');
const confirmPwdField = document.getElementById('confirm_pwd');

function addUser(event) {
  event.preventDefault();

  const nameInput = nameField.value.trim();
  const emailInput = emailField.value.trim();
  const passwordInput = passwordField.value.trim();
  const passwordRepeatInput = confirmPwdField.value.trim();

  if (!checkValidity()) return;

  resetErrorStyles();

  if (!checkInputfields(nameInput, emailInput, passwordInput, passwordRepeatInput)) return;

  if (!checkPasswords(passwordInput, passwordRepeatInput)) return;

  if (emailAlreadyExists(emailInput)) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const newUser = {
    name: nameInput,
    email: emailInput,
    password: passwordInput
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  showSignUpSuccessOverlay();
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

function emailAlreadyExists(emailInput) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find(user => user.email === emailInput)) {
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

function showSignUpSuccessOverlay() {
  const overlaySignUp = document.querySelector('.overlay-sign-up-successfully-background');
  setTimeout(() => {
    overlaySignUp.classList.remove('hide');
    overlaySignUp.classList.add('flex');

    setTimeout(() => {
      window.location.href = "login.html"; 
    }, 1000); 
  }, 800); 
}

function handleLogin() {
  const emailInputLogin = document.getElementById("email-login").value.trim();
  const passwordInputLogin = document.getElementById("pwd-login").value.trim();
  checkLogin(emailInputLogin, passwordInputLogin);
}

function checkLogin(emailInputLogin, passwordInputLogin) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(user => user.email === emailInputLogin && user.password === passwordInputLogin);

  if (user) {
    alert("Login erfolgreich!");
    window.location.href = "summary.html";
  } else {
    alert("E-Mail oder Passwort falsch.");
  }
}

function showSignUpSuccessOverlay() {
  const overlaySignUp = document.querySelector('.overlay-sign-up-successfully-background');
  setTimeout(() => {
    overlaySignUp.classList.remove('hide');
    overlaySignUp.classList.add('flex');

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  }, 800);
}

// window.onload = function () { console.log(usersDatabase); }

