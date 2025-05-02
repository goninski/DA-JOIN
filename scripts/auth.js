const page = window.location.pathname;
const today = new Date();

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, set, update, ref } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOB2IDXOJe-1pBfiPCOzAZAVymnVMBiTs",
  authDomain: "da-join-449.firebaseapp.com",
  databaseURL: "https://da-join-449-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "da-join-449",
  storageBucket: "da-join-449.firebasestorage.app",
  messagingSenderId: "972751449711",
  appId: "1:972751449711:web:f8bc03c7e3056a61f1a79a"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// console.log(app);
// console.log(database);
// console.log(auth);

function signUp() {
    let username = document.getElementById('sign-up-name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('pwd').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            set(ref(database, 'users/' + user.uid), {
                id: user.uid,
                name: username,
                email: email,
                initials: getInitialsOfFirstAndLastWord(username),
                color: getRandomColor(),
                // firstLogin: today,
              })
            // console.log(contacts);
            // console.log(user);
            showFloatingMessage('text', 'You Signed Up successfully');
            setTimeout(function() { 
              window.location.href = "/summary.html";
          }, 1000);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
}

if(page == '/sign-up.html') {
  document.getElementById('signUpBtn').addEventListener('click', signUp);
}


function signIn() {
  let email = document.getElementById('email-login').value;
  let password = document.getElementById('pwd-login').value;

  console.log(app);
  console.log(database);

  signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          const user = userCredential.user;
          update(ref(database, 'users/' + user.uid), {
              lastLogin: today,
          })
          window.location.href = "/summary.html";
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
      });
}

function signInAsGuest() {
  signInAnonymously(auth)
      .then(() => {
          location.href = "/summary.html";
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
      });
}

if(page == '/login.html') {
  document.getElementById('signInBtn').addEventListener('click', signIn);
  document.getElementById('signInGuestBtn').addEventListener('click', signInAsGuest);
}

function logout() {
  signOut(auth)
      .then(() => {
          window.location.href = "/login.html";
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
      });
}


if(page != '/login.html' && page != '/sign-up.html') {
  checkAuth();
  // document.getElementById('logoutBtnTemp').addEventListener('click', logout);
  // document.getElementById('logoutBtn').addEventListener('click', logout);
  renderTemporaryLogoutButton();
}

function checkAuth() {
  const user = auth.currentUser;
  onAuthStateChanged(auth, (user) => {
    if(user) {
      // user is signed in
      const uid = user.uid;
    } else {
      window.location.href = "/login.html";
    }
  });
}

function renderTemporaryLogoutButton() {
  let btn = document.createElement("button");
  btn.innerHTML = 'Logout';
  btn.style = 'color: white; position: fixed; bottom: 0; width: 232px; height: 48px;';
  btn.addEventListener('click', logout)
  document.body.appendChild(btn);
};
  
