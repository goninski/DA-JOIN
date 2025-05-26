const page = window.location.pathname;
const today = new Date();

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, child, get, set, update, remove } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// console.log(app);
// console.log(database);
// console.log(auth);


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
      // if(page == '/login.html' || page == '/sign-up.html') {
      //   window.location.href = "/summary.html";
      // }
      // renderTemporaryLogoutButton();
    } else {
      window.location.href = "/login.html";
    }
  });
}

function signUp() {
    let username = document.getElementById('sign-up-name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('pwd').value;

    if(! checkSignUpFormValidity()) {
      return;
    };

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

  if(! checkSignInFormValidity()) {
    return;
  };

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

function renderTemporaryLogoutButton() {
  let btn = document.createElement("button");
  btn.innerHTML = 'Logout';
  btn.style = 'color: white; position: fixed; bottom: 0; width: 232px; height: 48px;';
  btn.addEventListener('click', logout)
  document.body.appendChild(btn);
};





function getChildsArrayFromFirebase(table) {
  const dbRef = ref(database);
  // console.log(dbRef);
  get(child(dbRef, table + '/'))
  .then((snapshot) => {
    if(snapshot.exists()) {
      // console.log(snapshot);
      let dataArr = snapshotToArray(snapshot);
      console.log(dataArr);
      // return setContacts(dataArr);
      return dataArr;
    } else {
      alert('no data found !');
    }
  })
  .catch((error) => {
    alert(error.message);
    console.log(error.message);
    console.log(error.code);
  });
}

function snapshotToArray(snapshot) {
  let dataArr = [];
  snapshot.forEach(function(child) {
      let item = child.val();
      item.key = child.key;
      dataArr.push(item);
  });
  // console.log(dataArr);
  return dataArr;
};



//getContactsFromFirebase();
function getContactsFromFirebase() {
  let dataArr = getChildsArrayFromFirebase('users');
  console.log(dataArr);
  // return dataArr;
  // setContacts(dataArr);
}



function createContactDB(event, contactId) {
  event.stopPropagation();
  event.preventDefault();
  createContactOnFirebase(contact);
}

function createContactOnFirebase(contact) {
  set(ref(database, 'users/' + contact.id), {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    initials: contact.initials,
    color: contact.color,
    // initials: getInitialsOfFirstAndLastWord(contact.name),
    // color: getRandomColor(),
    // lastLogin: today,
  })
}

function deleteContactDB(event, contactId) {
  event.stopPropagation();
  event.preventDefault();
  deleteContactFromFirebase(contactId);
}

function deleteContactFromFirebase(contactId) {
  remove(ref(database, 'users/' + contactId))
  .then(() => {
    activeContactId = '';
    contacts.splice(getContactIndexFromId(contactId), 1);
    removeDeletedContactsFromTasks(contactId);
    showFloatingMessage('text', 'Contact deleted');
    setTimeout(function() { 
        closeContactsFormDialogue(event);
    }, 1000);
  })
  .catch((error) => {
    alert(error.message);
    console.log(error.code);
  });
}



// if(page == '/contacts.html') {
//   document.getElementById('btnDelete').addEventListener('click', function(event) {
//     deleteContactDB(event, contactId);
//   });
//   if(formMode == 'edit') {
//     document.getElementById('dialogueBtnDelete').addEventListener('click', function(event) {
//       deleteContactDB(event, contactId);
//     });
//   }
// }



//importDemoContacts();
function importDemoContacts() {
  deleteDataRefFromFirebase('users');
  contactsDemo.forEach(contact => {
    createContactOnFirebase(contact);
  });
}

//deleteDataRefFromFirebase('users')
function deleteDataRefFromFirebase(dataRef) {
  remove(ref(database, dataRef))
  .then(() => {
    showFloatingMessage('text', 'DataRef "' + dataRef + '" deleted');
  })
  .catch((error) => {
    alert(error.message);
    console.log(error.code);
  });
}
