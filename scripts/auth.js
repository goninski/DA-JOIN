import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

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
let signUpBtn = document.getElementById('signUpBtn');
signUpBtn.addEventListener('click', signUp);


function signUp() {
// function signUp(username, email, password) {
  let username = document.getElementById('sign-up-name').value;
  let email = document.getElementById('email').value;
  let password = document.getElementById('pwd').value;

  createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          const user = userCredential.user;

          lastContactId++;
          set(ref(usersDatabase, 'users/' + user.uid), {
            id: lastContactId,
            name: username,
            email, email
          })
        
          // addSignedUpContact(user, username, email);
          // showSignUpSuccessOverlay();
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
      });
}

// function addSignedUpContact(user, username, email) {
//   let contact = {};
//   lastContactId++;
//   contact.id = lastContactId;
//   contact.name = username;
//   contact.email = email;
//   contact.initials = getInitialsOfFirstAndLastWord(username);
//   contact.color = getRandomColor();
//   contacts.push(contact);
//   sortContacts(contacts);
//   saveContactData();

//   set(ref(usersDatabase, 'users/' + user.uid), {
//     id: lastContactId,
//     name: username,
//     email, email
//   })
// }

function addSignedUpContact(user, username, email) {
  lastContactId++;
  set(ref(usersDatabase, 'users/' + user.uid), {
    id: lastContactId,
    name: username,
    email, email
  })
}