let categoriesDefault = [
    {
        "id": "101",
        "name": "Technical Task",
        "color": "#1FD7C1"
    },
    {
        "id": "102",
        "name": "User Story",
        "color": "#0038FF"
    },
];

let contactsDummy = [
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
        "password": "88888888"
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

const tasksDummy = [
  {
    "id": "10001",
    "title": "Fix login page bug",
    "description": "Users are unable to login when using Safari browser. Investigate and fix the issue.",
    "categoryId": "101",
    "priority": "high",
    "contactIds": ["1003", "1008", "1010"],
    "status": "inProgress",
    "dueDate": "past-2",
    "subtasks": [
      { "title": "Reproduce the bug in Safari", "done": true },
      { "title": "Debug authentication flow", "done": true },
      { "title": "Implement fix for cross-browser compatibility", "done": false }
    ]
  },
  {
    "id": "10002",
    "title": "Implement dark mode",
    "description": "Add a dark mode option to the application settings.",
    "categoryId": "102",
    "priority": "medium",
    "contactIds": ["1005", "1001"],
    "status": "todo",
    "dueDate": "future-5",
    "subtasks": [
      { "title": "Design dark theme color palette", "done": false },
      { "title": "Create theme switching component", "done": false }
    ]
  },
  {
    "id": "10003",
    "title": "Optimize database queries",
    "description": "Review and optimize slow database queries.",
    "categoryId": "101",
    "priority": "high",
    "contactIds": ["1002", "1007", "1009", "1004"],
    "status": "done",
    "dueDate": "past-1",
    "subtasks": [
      { "title": "Identify slowest queries via profiling", "done": true },
      { "title": "Rewrite queries with proper indexing", "done": true }
    ]
  },
  {
    "id": "10004",
    "title": "Add password reset feature",
    "description": "Users should be able to reset their password via email.",
    "categoryId": "102",
    "priority": "medium",
    "contactIds": ["1006"],
    "status": "awaitFeedback",
    "dueDate": "today",
    "subtasks": [
      { "title": "Design email template", "done": true },
      { "title": "Implement token generation logic", "done": false }
    ]
  },
  {
    "id": "10005",
    "title": "Update API documentation",
    "description": "Document all new endpoints added in the last release.",
    "categoryId": "101",
    "priority": "low",
    "contactIds": ["1001", "1003", "1005"],
    "status": "todo",
    "dueDate": "future-14",
    "subtasks": []
  },
  {
    "id": "10006",
    "title": "Improve mobile responsiveness",
    "description": "Enhance the UI for mobile devices.",
    "categoryId": "102",
    "priority": "high",
    "contactIds": ["1004", "1009"],
    "status": "inProgress",
    "dueDate": "future-3",
    "subtasks": [
      { "title": "Audit current breakpoints", "done": true },
      { "title": "Fix navbar collapsing issues", "done": false }
    ]
  },
  {
    "id": "10007",
    "title": "Fix memory leak in dashboard",
    "description": "The dashboard component is causing memory leaks.",
    "categoryId": "101",
    "priority": "high",
    "contactIds": ["1002", "1006", "1010"],
    "status": "done",
    "dueDate": "past-7",
    "subtasks": [
      { "title": "Profile memory usage with Chrome DevTools", "done": true },
      { "title": "Clean up useEffect hooks", "done": true }
    ]
  },
  {
    "id": "10008",
    "title": "Create user profile page",
    "description": "Design and implement a user profile page.",
    "categoryId": "102",
    "priority": "medium",
    "contactIds": ["1007", "1008"],
    "status": "awaitFeedback",
    "dueDate": "future-10",
    "subtasks": [
      { "title": "Design profile layout", "done": true },
      { "title": "Build avatar upload component", "done": false }
    ]
  },
  {
    "id": "10009",
    "title": "Migrate to latest React version",
    "description": "Update the project to use React 18.",
    "categoryId": "101",
    "priority": "medium",
    "contactIds": ["1003", "1005", "1009"],
    "status": "inProgress",
    "dueDate": "future-7",
    "subtasks": [
      { "title": "Update package.json dependencies", "done": true },
      { "title": "Test for breaking changes", "done": false }
    ]
  },
  {
    "id": "10010",
    "title": "Add search functionality",
    "description": "Implement a global search feature.",
    "categoryId": "102",
    "priority": "high",
    "contactIds": ["1001", "1004", "1007", "1010"],
    "status": "todo",
    "dueDate": "future-21",
    "subtasks": [
      { "title": "Design search bar UI", "done": false },
      { "title": "Implement API endpoint for search", "done": false }
    ]
  }
];


/**
 * On page load data.html
 */
async function initData() {
    getMainTemplates();
    // await getAllData();
    // await renderAllData();
}


/**
 * Delete all data and load a the fresh set of dummy data
 */
async function resetData() {
    // if(! window.confirm('All data will be reset to default dummy data! OK?')) { return; }
    await deleteAllData();
    categories = categoriesDefault;
    contacts = contactsDummy;
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    tasks = tasksDummy;
    contacts.forEach(function(contact) {
        validateContactProperties(contact);
    });
    tasks.forEach(function(task) {
        convertRelationalDueDatesToDateStringDB(task);
    });
    await saveAllData()
    // await showFloatingMessage('text', 'Dummy Data Reset successfull !');
    // setTimeout(() => {window.location.href = "/board.html";}, 1500);
    // setTimeout(() => {window.location.href = "/summary.html";}, 1500);
}


/**
 * Save all data 
 */
async function saveAllData() {
    await saveAllCategories();
    await saveAllContacts();
    await saveAllTasks();
}


/**
 * Save all categories 
 */
async function saveAllCategories() {
    console.log(categories);
    categories.forEach(function(category) {
        updateCategory(category);
    });
}


/**
 * Save all contacts
 */
async function saveAllContacts() {
    console.log(contacts);
    contacts.forEach(function(contact) {
        updateContact(contact);
    });
}


/**
 * Save all Tasks
 */
async function saveAllTasks() {
    console.log(tasks);
    tasks.forEach(function(task) {
        updateTask(task);
    });
}


/**
 * Delete all data from local storage
 */
async function deleteDataFromLS() {
    // localStorage.clear();
    localStorage.removeItem('categories');
    localStorage.removeItem('contacts');
    localStorage.removeItem('tasks');
}


/**
 * Helper: convert relational dummy due dates (today, past, future etc.) to real dates (string for DB)
 * 
 * @param {object} task - a task object
 * @returns {string}
 */
function convertRelationalDueDatesToDateStringDB(task) {
    let dateType = task.dueDate.split('-')[0];
    if(!isNaN(dateType)) {
        return;
    }
    let currentDate = new Date();
    let days = task.dueDate.split('-')[1];
    if(dateType == 'today') {
        days = 0;
    } else if(dateType == 'past') {
        days = days * -1;
    }
    task.dueDate = formatDateToStringDB(addDaysToDate(currentDate, days));
}

