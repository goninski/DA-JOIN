// *** TEST DATA
let tasks = [];
let contacts = [];
let categories = [];

tasks = [
    {
        "id": 0,
        "title": "Title ...",
        "description": "Description...",
        "dueDate": 0,
        "priority": "low",
        "assignedTo": [0, 1, 2],
        "category": "Technical Task",
        "subtasks": []
    }
];

categories = [
    {
        "id": 0,
        "name": "Technical Task"
    },
    {
        "id": 0,
        "name": "User Story"
    }
];

contacts = [
    {
        "id": 0,
        "name": "François Gonin",
        "email": "mail@goninski.dev",
        "phone": "+41 78 888 77 66",
    },
    {
        "id": 1,
        "name": "Julian Kraske",
        "email": "",
        "phone": "",
    },
    {
        "id": 2,
        "name": "Nico Hässler",
        "email": "",
        "phone": "",
    },
    {
        "id": 3,
        "name": "Vivienne Wündisch",
        "email": "",
        "phone": "",
    }

];






function init() {
    getMainTemplates();
}

function getMainTemplates() {
    getHeader();
    getSidemenu();
}

function getHeader() {
    document.getElementById('header').innerHTML = getHeaderTemplate();
}

function getSidemenu() {
    let sideMenuRef = document.getElementById('sideMenu');
    sideMenuRef.innerHTML = getSideMenuTemplate();
    sideMenuRef.classList.add('hide--ss-mob');

    let sideMenuMobRef = document.getElementById('sideMenuMob');
    sideMenuMobRef.innerHTML = getSideMenuMobTemplate();
    sideMenuMobRef.classList.add('show--ss-mob');
}

function resetInput(event, id) {
    document.getElementById(id).reset()
    event.preventDefault();
}

function getCategorySelectOptions(id = 'inputCategory') {
    let selectInput = document.getElementById(id);
    selectInput.innerHTML = '';
    for (let index = 0; index < categories.length; index++) {
        selectInput.innerHTML += getCategorySelectOptionTemplate(categories[index]);
    }
}

