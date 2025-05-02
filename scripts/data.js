// *** TEST DATA
let categories = [];
let categoriesDefault = [];
let contacts = [];
let tasks = [];
let contactsDemo = [];
let tasksDemo = [];
let contactsDemoOld = [];
let lastCategoryId = 0;
// let lastContactId = 0;
let lastTaskId = 0;

categoriesDefault = [
    {
        "id": "1",
        "name": "Technical Task"
    },
    {
        "id": "2",
        "name": "User Story"
    },
    // {
    //     "id": "3",
    //     "name": "Cat 3"
    // },
    // {
    //     "id": "4",
    //     "name": "Cat 4"
    // }
];
categories = categoriesDefault;
lastCategoryId = categories.length - 1;

contactsDemo = [
    {
        "id": "101",
        "name": "Boris Becker",
        "email": "boris@becker.de",
        "phone": "+49 999 888 777",
        "initials": "BB",
        "color": "violet"
    },
    {
        "id": "102",
        "name": "Roger Federer",
        "email": "roger@federer.ch",
        "phone": "+41 99 888 77 66",
        "initials": "RF",
        "color": "orange"
    },
    {
        "id": "103",
        "name": "Novak Djokovic",
        "email": "novak@djokovic.rs",
        "phone": "+381 99 888 77 66",
        "initials": "ND",
        "color": "pink"
    },
];

contactsDemoOld = [
    {
        "id": "1",
        "name": "François Gonin",
        "email": "mail@goninski.dev",
        "phone": "+41 78 888 77 66",
        "initials": "FG",
        "color": "violet"
    },
    {
        "id": "2",
        "name": "Nico Hässler",
        "email": "nico@email.com",
        "phone": "",
        "initials": "NH",
        "color": "orange"
    },
    {
        "id": "3",
        "name": "Julian Kraske",
        "email": "julian@email.com",
        "phone": "",
        "initials": "JK",
        "color": "pink"
    },
    {
        "id": "4",
        "name": "Vivienne Wündisch",
        "email": "vivienne@email.com",
        "phone": "",
        "initials": "VW",
        "color": "lightblue"
    },
    {
        "id": "5",
        "name": "Viva Müller",
        "email": "viva@email.com",
        "phone": "",
        "initials": "WM",
        "color": "#806000"
    },
    {
        "id": "6",
        "name": "Nadine Müller",
        "email": "nadine@email.com",
        "phone": "",
        "initials": "NM",
        "color": "green"
    },
];

tasksDemo = [
    {
        "id": "1",
        "title": "Title Task 1...",
        "description": "Description Task 1...",
        "dueDate": "2025-04-01",
        "priority": "high",
        "contactIds": [1, 2, 3],
        "categoryId": 1,
        "subtasks": ["Subtask 1"]
        // "subtasks": [
        //     {"title": "Subtask 1","status": 1},
        //     {"title": "Subtask 2","status": 0},
        // ]
    },
    {
        "id": "2",
        "title": "Title Task 2...",
        "description": "Description Task 2...",
        "dueDate": "2025-03-31",
        "priority": "medium",
        "contactIds": [2, 3],
        "categoryId": 2,
        "subtasks": ["Subtask 1","Subtask 2"]
    },
    {
        "id": "3",
        "title": "Title Task 3...",
        "description": "Description Task 3...",
        "dueDate": 0,
        "priority": "low",
        "contactIds": [3, 1],
        "categoryId": 0,
        "subtasks": ["Subtask 1","Subtask 2","Subtask 3"]
    },
];




// GET & SAVE DATA

// getAllData();
function getAllData() {
    getCategoryData();
    getContactData();
    getTaskData();
    if(! contacts || ! tasks) {
        setDemoData();
    }
}

function getCategoryData() {
    getCategoryDataLS();
}

function getContactData() {
    getContactDataLS();
}

function getTaskData() {
    getTaskDataLS();
}

function saveCategoryData() {
    saveCategoryDataLS();
}
function saveContactData() {
    saveContactDataLS();
}

function saveTaskData() {
    saveTaskDataLS();
}

function setDemoData() {
    clearLocalStorage();
    categories = categoriesDefault;
    contacts = contactsDemo;
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    tasks = tasksDemo;
    console.log(categories);
    lastCategoryId = categories.length - 1;
    // lastContactId = contacts.length;
    lastTaskId = tasks.length;
    saveCategoryData();
    saveContactData();
    saveTaskData();
    location.href = location.pathname;
}



// DATA HANDLING FIREBASE


function saveContactDataDB(contact) {
  set(ref(database, 'users/' + contact.id), {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    initials: contact.initials,
    color: contact.color,
  })
}





// DATA HANDLING LOCAL STORAGE > TEMPORARY

function getCategoryDataLS() {
    categories = getFromLocalStorage('categories');
    lastCategoryId = getFromLocalStorage('lastCategoryId');
}

function getContactDataLS() {
    contacts = getFromLocalStorage('contacts');
    lastContactId = getFromLocalStorage('lastContactId');
}

function getTaskDataLS() {
    tasks = getFromLocalStorage('tasks');
    lastTaskId = getFromLocalStorage('lastTaskId');
}


function saveCategoryDataLS() {
    saveToLocalStorage('categories', categories);
    saveToLocalStorage('lastCategoryId', lastCategoryId);
}

function saveContactDataLS() {
    saveToLocalStorage('contacts', contacts);
    saveToLocalStorage('lastContactId', lastContactId);
}

function saveTaskDataLS() {
    saveToLocalStorage('tasks', tasks);
    saveToLocalStorage('lastTaskId', lastTaskId);
}

function saveToLocalStorage(key, data){
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key){
    return JSON.parse(localStorage.getItem(key));
}

function clearLocalStorage(){
    localStorage.clear();
}
