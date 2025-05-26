loggedInUserId = null;
localStorage.removeItem('pseudoAuthStatus');

window.onload = () => {
  const login_logo = document.getElementById("login_logo");
  const login_content = document.getElementById("login-main-content");

  setTimeout(() => {
    login_logo.classList.add("moved");
  }, 100);

  setTimeout(() => {
    login_content.classList.add("visible");
  }, 100);
};

async function handleLogin(userId) {
  const emailInputLogin = document.getElementById("email-login").value.trim();
  const passwordInputLogin = document.getElementById("pwd-login").value.trim();
  const loginSuccessful = await checkLogin(emailInputLogin, passwordInputLogin);

  // add code to check and get the user id
  // .....

  if (loginSuccessful){
    await signIn(userId);
  }
}

async function checkLogin(emailInputLogin, passwordInputLogin) {
  const users = await getFromLocalStorage("users") || [];
  const user = users.find(user => user.email === emailInputLogin && user.password === passwordInputLogin);
  const emailField = document.getElementById("email-login");
  const passwordField = document.getElementById("pwd-login");

  const isUserValid = await checkuser(user, emailField, passwordField);

  return isUserValid;
}

async function checkuser(user, emailField, passwordField) {
  const errorMsg = document.getElementById('login-error-message');

  if (!user) {
    emailField.setCustomValidity("");
    passwordField.setCustomValidity("");

    document.getElementById('pwd-input-div').classList.add('input-error');
    document.getElementById('email-input-div').classList.add('input-error');
    errorMsg.classList.remove('hidden');
    return false;
  } else {
    emailField.setCustomValidity("");
    passwordField.setCustomValidity("");
    resetErrorStyles()
    return true;
  }
}
// function checkpasswordlength(passwordField) {
//   if (passwordInputLogin.length.length < 8) {
//     passwordField.setCustomValidity("Das Passwort muss mindestens 8 Zeichen lang sein.");
//     passwordField.reportValidity();
//     return false;
//   } else {
//     passwordField.setCustomValidity("");
//     return true;
//   }
// }

// function checkemailsign(emailField) {
//   if (!emailField.value.includes("@")) {
//     emailField.setCustomValidity("Bitte gib eine gültige E-Mail-Adresse mit @ ein.");
//     emailField.reportValidity();
//     return false; 
//   } else {
//     emailField.setCustomValidity(""); 
//     return true;
//   }
// }

/**
 * Sign in as guest
 * 
 * @param {event} event - onclick (guest log in button)
 */
async function guestLogin(event) {
  await signIn();
}


/**
 * Sign in procedure
 * 
 * @param {string} userId - id of the logged in user
 */
async function signIn(userId = 'guest') {
  loggedInUserId = userId;
  await saveToLocalStorage('pseudoAuthStatus', loggedInUserId);
  setTimeout(function () { window.location.href = '/summary.html' }, 1500);
}

