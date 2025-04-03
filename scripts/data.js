// *** TEST DATA
let categories = [];
let contacts = [];
let tasks = [];

categories = [
    {
        "id": 1,
        "name": "Technical Task"
    },
    {
        "id": 2,
        "name": "User Story"
    }
];

contacts = [
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
        "name": "Julian Kraske",
        "email": "",
        "phone": "",
        "initials": "JK",
        "color": "pink"
    },
    {
        "id": 3,
        "name": "Nico Hässler",
        "email": "",
        "phone": "",
        "initials": "NH",
        "color": "orange"
    },
    {
        "id": 4,
        "name": "Vivienne Wündisch",
        "email": "",
        "phone": "",
        "initials": "VW",
        "color": "lightblue"
    }

];

tasks = [
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



