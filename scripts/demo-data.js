let categoriesDefault = [
    {
        "id": "101",
        "name": "Technical Task"
    },
    {
        "id": "102",
        "name": "User Story"
    },
];

let contactsDemo = [
    {
        "id": "1001",
        "name": "Roger Federer",
        "email": "roger@federer.ch",
        "phone": "+41 99 888 77 66",
    },
    {
        "id": "1002",
        "name": "Novak Djokovic",
        "email": "novak@djokovic.rs",
        "phone": "+381 99 888 77 66",
    },
    {
        "id": "1003",
        "name": "Rafael Nadal",
        "email": "rafael@nadal.es",
        "phone": "+34 111 222 333",
    },
    {
        "id": "1004",
        "name": "Carlos Alcaraz",
        "email": "carlos@alcaraz.es",
        "phone": "+34 555 666 777",
    },
    {
        "id": "1005",
        "name": "Boris Becker",
        "email": "boris@becker.de",
        "phone": "+49 999 888 777",
    },
    {
        "id": "1011",
        "name": "François Gonin",
        "email": "francois@gonin.ch",
        "phone": "+41 99 888 77 66",
    },
    {
        "id": "1012",
        "name": "Nico Hässler",
        "email": "nico@haessler.de",
        "phone": "+49 999 888 777",
    },
    {
        "id": "1013",
        "name": "Julian Kraske",
        "email": "julian@kraske.de",
        "phone": "+49 777 888 999",
    },
    {
        "id": "1014",
        "name": "Vivienne Wündisch",
        "email": "vivienne@wuendisch.de",
        "phone": "+49 111 222 333",
    },
    {
        "id": "1015",
        "name": "Developer Akademie",
        "email": "info@developerakademie.com",
    },
];

let tasksDemo = [
    {
        "id": "10001",
        "title": "Title Task 1...",
        "description": "Description Task 1...",
        "dueDate": "2025-04-01",
        "priority": "high",
        "categoryId": '101',
        "contactIds": ['1001', '1002', '1003'],
        "subtasks": [
            {"title": "Subtask 1.1","done": true},
            {"title": "Subtask 1.2","done": false},
        ],
        "status": "To do",
    },
    {
        "id": "10002",
        "title": "Title Task 2...",
        "description": "Description Task 2...",
        "dueDate": "2025-03-31",
        "priority": "medium",
        "categoryId": '102',
        "contactIds": ['1004', '1006'],
        "subtasks": [
            {"title": "Subtask 2.1","done": true},
            {"title": "Subtask 2.2","done": false},
        ],
        "status": "In progress",
    },
    {
        "id": "10003",
        "title": "Title Task 3...",
        "description": "Description Task 3...",
        "dueDate": '2025-05-05',
        "priority": "low",
        "categoryId": '102',
        "contactIds": ['1005', '1009'],
        "subtasks": [
            {"title": "Subtask 3.1","done": true},
        ],
        "status": "Await Feedback",
    },
    {
        "id": "10004",
        "title": "Title Task 4...",
        "description": "Description Task 4...",
        "priority": "low",
        "categoryId": '102',
        "contactIds": ['1007', '1008'],
        // "subtasks": [
        //     {"title": "Subtask 3.1","done": true},
        // ],
        "status": "Done",
    },
];


async function resetToDemoData() {
    if(! window.confirm('All data will be reset to default demo data! OK?')) { return; }
    await deleteAllData();
    categories = categoriesDefault;
    contacts = contactsDemo;
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    tasks = tasksDemo;
    contacts.forEach(function(contact) {
        if(! contact.initials) {
            contact.initials = getInitialsOfFirstAndLastWord(contact.name);
        }
        if(! contact.color) {
            contact.color = getRandomColor();
        }
    });
    await saveAllData()
    await showAlert('Data Reset successfull. Please reload the page !', 1000);
    // location.reload()
    // window.location.href = "/board.html";
    // setTimeout(function() { 
    //     window.location.href = "/board.html";
    //   }, 1000);
}

async function saveAllData() {
    await saveAllCategories();
    await saveAllContacts();
    await saveAllTasks();
}

async function saveAllCategories() {
    console.log(categories);
    categories.forEach(function(category) {
        updateCategory(category);
    });
}

async function saveAllContacts() {
    console.log(contacts);
    contacts.forEach(function(contact) {
        updateContact(contact.id);
    });
}

async function saveAllTasks() {
    console.log(tasks);
    tasks.forEach(function(task) {
        updateTask(task.id);
    });
}
