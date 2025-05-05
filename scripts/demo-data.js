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
        "contactIds": ['1001', '1002', '1003'],
        "categoryId": '101',
        "subtasks": [
            {"title": "Subtask 1.1","done": true},
            {"title": "Subtask 1.2","done": false},
        ],
        "done": "To do",
    },
    {
        "id": "10002",
        "title": "Title Task 2...",
        "description": "Description Task 2...",
        "dueDate": "2025-03-31",
        "priority": "medium",
        "contactIds": ['1004', '1006'],
        "categoryId": '102',
        "subtasks": [
            {"title": "Subtask 2.1","done": true},
            {"title": "Subtask 2.2","done": false},
        ],
        "done": "In progress",
    },
    {
        "id": "10003",
        "title": "Title Task 3...",
        "description": "Description Task 3...",
        "dueDate": '2025-05-05',
        "priority": "low",
        "contactIds": ['1005', '1009'],
        "categoryId": '102',
        "subtasks": [
            {"title": "Subtask 3.1","done": true},
        ],
        "done": "Await Feedback",
    },
    {
        "id": "10004",
        "title": "Title Task 4...",
        "description": "Description Task 4...",
        "priority": "low",
        "contactIds": ['1007', '1008'],
        "categoryId": '102',
        // "subtasks": [
        //     {"title": "Subtask 3.1","done": true},
        // ],
        "done": "Done",
    },
];


async function resetToDemoData() {
    if(! window.confirm('All data will be reset to default demo data! OK?')) { return; }
    categories = categoriesDefault;
    contacts = contactsDemo;
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    tasks = tasksDemo;
    // lastCategoryId = await getLastIdFromObjArray(categories);
    // lastContactId = await getLastIdFromObjArray(contacts);
    // lastTaskId = await getLastIdFromObjArray(tasks);
    contacts.forEach(function(contact) {
        if(! contact.initials) {
            contact.initials = getInitialsOfFirstAndLastWord(contact.name);
        }
        if(! contact.color) {
            contact.color = getRandomColor();
        }
    });
    if(localStorageMode) {
        await clearLocalStorage();
        await saveCategoriesToLS();
        await saveContactsToLS();
        await saveTasksToLS();
    } else {
        await clearLocalStorage();
        await deleteAllDataFromDB();
        await saveAllCategoriesToDB();
        await saveAllContactsToDB();
        await saveAllTasksToDB();
        // await saveLastIdToDB('users', lastContactId)
        // await saveLastIdToDB('categories', lastCategoryId)
        // await saveLastIdToDB('tasks', lastTaskId)
        }
    showAlert('Data Reset successfull. Please reload the page !', 1000);
    // location.reload()
}



async function deleteAllDataFromDB(fetchPath="") {
    await deleteFirebaseData(fetchPath);
}

async function saveAllDataToDB() {
    await getAllData();
    await deleteAllDataFromDB();
    await saveAllCategoriesToDB();
    await saveAllContactsToDB();
    await saveAllTasksToDB();
}

async function saveAllCategoriesToDB() {
    categories.forEach(function(category) {
        saveCategoryToDB(category);
    });
}

async function saveAllContactsToDB() {
    contacts.forEach(function(contact) {
        let contactId = contact.id;
        saveDataToFirebase('users/' + contactId, contact);
    });
}

async function saveAllTasksToDB() {
    tasks.forEach(function(item) {
        saveTaskToDB(item);
    });
}
