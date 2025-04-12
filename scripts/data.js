// *** TEST DATA
let categories = [];
let contacts = [];
let tasks = [];

let lastCategoryId = 0;
let lastContactId = 0;
let lastTaskId = 0;


let categoriesDemo = [
    {
        "id": "0",
        "name": "Select Task Category"
    },
    {
        "id": "1",
        "name": "Technical Task"
    },
    {
        "id": "2",
        "name": "User Story"
    }
];
categories = categoriesDemo;
lastCategoryId = categories.length - 1;

let contactsDemo = [
    {
        "id": 1,
        "name": "François Gonin",
        "email": "mail@goninski.dev",
        "phone": "+41 78 888 77 66",
        "initials": "FG",
        "color": "violet"
    },
    {
        "id": 2,
        "name": "Nico Hässler",
        "email": "",
        "phone": "",
        "initials": "NH",
        "color": "orange"
    },
    {
        "id": 3,
        "name": "Julian Kraske",
        "email": "",
        "phone": "",
        "initials": "JK",
        "color": "pink"
    },
    {
        "id": 4,
        "name": "Vivienne Wündisch",
        "email": "",
        "phone": "",
        "initials": "VW",
        "color": "lightblue"
    },
    {
        "id": 5,
        "name": "Viva Müller",
        "email": "mail@domain.com",
        "phone": "",
        "initials": "WM",
        "color": "#806000"
    },

];


let tasksDemo = [
    {
        "id": 1,
        "title": "Title Task 1...",
        "description": "Description Task 1...",
        "dueDate": 0,
        "priority": "high",
        "contactIds": [1, 2, 3],
        "categoryId": 0,
        "subtasks": [
            {   
                "title": "Subtask 1",
                "status": 1
            },
            {   
                "title": "Subtask 2",
                "status": 0,
            }
        ]
    },
    {
        "id": 2,
        "title": "Title Task 2...",
        "description": "Description Task 2...",
        "dueDate": 0,
        "priority": "medium",
        "contactIds": [2, 3],
        "categoryId": 1,
        "subtasks": [
            {   
                "title": "Subtask 1",
                "status": 1
            },
            {   
                "title": "Subtask 2",
                "status": 0,
            }
        ]
    },
    {
        "id": 3,
        "title": "Title Task 3...",
        "description": "Description Task 3...",
        "dueDate": 0,
        "priority": "low",
        "contactIds": [3, 1],
        "categoryId": 0,
        "subtasks": [
            {   
                "title": "Subtask 1",
                "status": 1
            },
            {   
                "title": "Subtask 2",
                "status": 0,
            }
        ]
    },
];



// GET & SAVE DATA

getAllData();
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
    categories = categoriesDemo;
    contacts = contactsDemo;
    tasks = tasksDemo;
    lastCategoryId = categories.length - 1;
    lastContactId = contacts.length;
    lastTaskId = tasks.length;
    saveCategoryData();
    saveContactData();
    saveTaskData();
    reloadPage(event);
}


// TEMPORARY LOCAL STORAGE HANDLING

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
