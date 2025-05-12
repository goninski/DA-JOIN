async function initBoards() {
    getMainTemplates();
    await getContacts()
    await checkAuth();
    await getTaskData()
    await setSearchBase();
    await renderBoards(tasks);
}

async function setSearchBase() {
  tasks.forEach(task => task.searchBase = (task.title + ' ' + task.description));
  // console.log(tasks);
}

async function renderBoards(renderTasks) {
  await renderTempTaskList(renderTasks);
  addTaskClickListeners();
}

function listenTaskSearchInput(event) {
  console.log('f) listenTaskSearchInput');
  let taskSearchInput = document.getElementById('taskSearchInput');
  let taskSearchBtn = document.getElementById('taskSearchBtn');
  let searchVal = taskSearchInput.value;
  console.log(searchVal);
  if(searchVal.length >= 2) {
    taskSearchBtn.tabIndex = 0;
    taskSearchBtn.classList.remove('not-clickable');
  } else {
    taskSearchBtn.tabIndex = -1;
    taskSearchBtn.classList.add('not-clickable');
  }
}

async function filterTasks(event) {
  event.preventDefault();
  console.log('f) filterTasks');
  let taskSearchInput = document.getElementById('taskSearchInput');
  let searchVal = taskSearchInput.value.toLowerCase();
  let renderTasks = tasks.filter(task => (task.searchBase).toLowerCase().includes(searchVal));
  // console.log(renderTasks);
  if(renderTasks.length <= 0) {
    await showFloatingMessage('text', 'no Tasks found !');
    taskSearchInput.value = '';
  }
  await renderBoards(renderTasks);
}

function addTaskClickListeners() {
  document.querySelectorAll('.clickable-task').forEach(task => {
    task.addEventListener('click', () => {
      const title = task.querySelector('.task-heading')?.textContent || "Kein Titel";
      const description = task.querySelector('.task-description')?.textContent || "Keine Beschreibung";
      const tasks = task.querySelector('.technical-task')?.textContent || "Keine Beschreibung";

      document.getElementById('overlay-tasks').textContent = tasks;
      document.getElementById('overlay-title').textContent = title;
      document.getElementById('overlay-description').textContent = description;
      document.getElementById('task-overlay').style.display = 'flex';
    });
  });
}


// da es 2 boards.js gab habe ich diesen Code von der anderen hierher kopiert /fg 4.5.25
document.querySelectorAll('.task-list').forEach(taskList => {
  new Sortable(taskList, {
    group: 'shared',
    animation: 150,
    ghostClass: 'ghost'
  });
});

document.querySelectorAll('.clickable-task').forEach(task => {
  task.addEventListener('click', () => {
    const title = task.querySelector('.task-heading')?.textContent || "Kein Titel";
    const description = task.querySelector('.task-description')?.textContent || "Keine Beschreibung";

    document.getElementById('overlay-title').textContent = title;
    document.getElementById('overlay-description').textContent = description;
    document.getElementById('task-overlay').style.display = 'flex';
  });
});

function closeOverlay() {
  document.getElementById('task-overlay').style.display = 'none';
}