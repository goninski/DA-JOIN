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
    signIn();
    // window.location.href = "summary.html";
  } else {
    alert("E-Mail oder Passwort falsch.");
  }
}

// async function checkLogin(event) {
//     await getUserData(); // creates a 'contacts' object, use the function 'updateContact(contact)' to update a user if needed
//     console.log(contacts);
//     loggedInUserId = '1005'; //change to correct id
//     signIn();
// }

  
async function guestLogin(event) {
    loggedInUserId = 'guest';
    await signIn();
}


// usersDatabase soll hier die Datenbank mit den User Zugangsdaten symbolisieren - muss noch geändert werden
// function checkLogin(event) {
//     event.preventDefault();
//     console.log('Login function called');

//     const emailField = document.getElementById('email-login');
//     const passwordField = document.getElementById('pwd-login');

//     const emailInput = emailField.value.trim();
//     const passwordInput = passwordField.value.trim();

//     let userFound = null;

//     //for (let i = 0; i < usersDatabase.length; i++) {
//         //const user = usersDatabase[i];
//         if (user.email === emailInput && user.password === passwordInput) {
//             userFound = user;
//         }
    

//     if (userFound) {
//         alert('Login erfolgreich!');
//         window.location.href = 'summary.html';
//     } else {
//         alert('E-Mail oder Passwort ist falsch.');
//         emailField.classList.add('false_input');
//         passwordField.classList.add('false_input');
//     }
// }

