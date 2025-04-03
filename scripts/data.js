// *** TEST DATA
let categories = [];
let contacts = [];
let tasks = [];

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
        "initials": "FG",
        "color": "violet"
    },
    {
        "id": 1,
        "name": "Julian Kraske",
        "email": "",
        "phone": "",
        "initials": "JK",
        "color": "pink"
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
        "name": "Vivienne Wündisch",
        "email": "",
        "phone": "",
        "initials": "VW",
        "color": "lightblue"
    }

];

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



