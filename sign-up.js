let usersDatabase = [
  { name: 'Max', email: 'max@example.com', password: '12345678' }
];

function addUser() {
  console.log(usersDatabase); 

  const nameInput = document.getElementById('sign-up-name').value.trim();
  const emailInput = document.getElementById('email').value.trim();
  const passwordInput = document.getElementById('pwd').value.trim();
  const passwordRepeatInput = document.getElementById('confirm_pwd').value.trim();

  if (passwordInput !== passwordRepeatInput) {
    alert('Passwörter stimmen nicht überein!');
    return;
  }

  if (!nameInput || !emailInput || !passwordInput || !passwordRepeatInput) {
    alert('Bitte alle Felder ausfüllen.');
    return;
  }

  const newUser = {
    name: nameInput,
    email: emailInput,
    password: passwordInput
  };

  usersDatabase.push(newUser);

  showSignUpSuccessOverlay();
  
  console.log(usersDatabase); 
}

function showSignUpSuccessOverlay() {
  const overlaySignUp = document.querySelector('.overlay-sign-up-successfully-background');
    setTimeout(() => {
      overlaySignUp.classList.remove('hide');
      overlaySignUp.classList.add('flex');

    setTimeout(() => {
      location.href = "/summary.html";
    }, 1000); 
  }, 800);
}

window.onload = function() {console.log(usersDatabase);}

