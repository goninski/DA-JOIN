window.onload = () => {
    const login_logo = document.getElementById("login_logo");
    const login_content = document.getElementById("login-main-content");
  
    // Nach 2 Sekunden: Logo verschieben
    setTimeout(() => {
        login_logo.classList.add("moved");
    }, 100);
  
    // Nach 3 Sekunden: Content einblenden
    setTimeout(() => {
        login_content.classList.add("visible");
    }, 100);
  };
  