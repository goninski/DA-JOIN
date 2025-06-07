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

async function handleLogin(event) {
  event.preventDefault();
  const emailInputLogin = document.getElementById("email-login").value.trim();
  const passwordInputLogin = document.getElementById("pwd-login").value.trim();
  const isValidUser = await checkLogin(emailInputLogin, passwordInputLogin);

 if (isValidUser) {
    window.location.href = "summary.html";
  } else {
    showFloatingMessage('error', 'Check your email and password. Please try again.');  }
}

async function checkLogin(emailInputLogin, passwordInputLogin) {
   await getUserData();

  const user = contacts.find(user => user.email === emailInputLogin && user.password === passwordInputLogin);
  const emailField = document.getElementById("email-login");
  const passwordLoginField = document.getElementById("pwd-login");

  const isUserValid = await checkuser(user, emailField, passwordLoginField);

  if (isUserValid) {
    loggedInUserId = user.id;
    await signIn(user.id);
  }
  return isUserValid;
}

async function checkuser(user, emailField, passwordLoginField) {
  const errorMsg = document.getElementById('login-error-message');

  if (!user) {
    emailField.setCustomValidity("");
    passwordLoginField.setCustomValidity("");

    document.getElementById('pwd-input-div').classList.add('input-error');
    document.getElementById('email-input-div').classList.add('input-error');
    errorMsg.classList.remove('hidden');
    return false;
  } else {
    emailField.setCustomValidity("");
    passwordLoginField.setCustomValidity("");
    resetErrorStylesLogin()
    return true;
  }
}

function resetErrorStylesLogin() {
  document.getElementById('pwd-input-div').classList.remove('input-error');
  document.getElementById('email-input-div').classList.remove('input-error');
  document.getElementById('login-error-message').classList.add('hidden');
}

// function checkpasswordlength(passwordLoginField) {
//   if (passwordInputLogin.length.length < 8) {
//     passwordLoginField.setCustomValidity("Das Passwort muss mindestens 8 Zeichen lang sein.");
//     passwordLoginField.reportValidity();
//     return false;
//   } else {
//     passwordLoginField.setCustomValidity("");
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

