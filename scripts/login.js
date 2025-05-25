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

async function handleLogin() {
  const emailInputLogin = document.getElementById("email-login").value.trim();
  const passwordInputLogin = document.getElementById("pwd-login").value.trim();
  checkLogin(emailInputLogin, passwordInputLogin);

  // add code to check and get the user id
  // .....

  await signIn(userId);
}

async function checkLogin(emailInputLogin, passwordInputLogin) {
  const users = await getFromLocalStorage("users") || [];
  const user = users.find(user => user.email === emailInputLogin && user.password === passwordInputLogin);

  if (user) {
    alert("Login erfolgreich!");
    window.location.href = "summary.html";
  } else {
    alert("E-Mail oder Passwort falsch.");
  }
}


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
    setTimeout(function() {window.location.href = '/summary.html'}, 1500);
}

