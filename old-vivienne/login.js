loggedInUserId = null;
localStorage.removeItem('pseudoAuthStatus');


window.onload = () => {
  handleLogoAnimation();
  showLoginContent();
};


function handleLogoAnimation() {
  const isMobile = window.innerWidth <= 500;

  if (isMobile) {
    animateMobileLogo();
  } else {
    animateDesktopLogo();
  }
}


function animateDesktopLogo() {
  const logo = document.getElementById("login_logo_desktop");

  if (!logo) return;

  setTimeout(() => {
    logo.classList.add("moved");
  }, 100);
}


function animateMobileLogo() {
  const logo = document.getElementById("login_logo_mobile");

  if (!logo) return;

  setTimeout(() => {
    logo.classList.add("moved");
  }, 100);

  setTimeout(() => {
    logo.src = "./assets/img/old/capa-2.png"; 
  }, 400);
}


function showLoginContent() {
  const loginContent = document.getElementById("login-main-content");

  if (!loginContent) return;

  setTimeout(() => {
    loginContent.classList.add("visible");
  }, 100);
}


async function handleLogin(event) {
  event.preventDefault();
  const emailInputLogin = document.getElementById("email-login").value.trim();
  const passwordInputLogin = document.getElementById("pwd-login").value.trim();
  const isValidUser = await checkLogin(emailInputLogin, passwordInputLogin);

  if (isValidUser) {
    window.location.href = "summary.html";
  } else {
    showFloatingMessage('error', 'Check your email and password. Please try again.');
  }
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


async function guestLogin(event) {
  await signIn();
}


async function signIn(userId = 'guest') {
  loggedInUserId = userId;
  await saveToLocalStorage('pseudoAuthStatus', loggedInUserId);
  setTimeout(function () { window.location.href = '/summary.html' }, 1500);
}

