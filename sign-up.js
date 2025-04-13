function showSignUpSuccessOverlay() {
    const overlaySignUp = document.querySelector('.overlay-sign-up-successfully');
      setTimeout(() => {
        overlaySignUp.classList.remove('hide');
        overlaySignUp.classList.add('flex');
  
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000); 
    }, 800);
  }
  