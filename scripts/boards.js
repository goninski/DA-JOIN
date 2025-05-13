async function initBoards() {
    getMainTemplates();
    await getContacts()
    await checkAuth();
    await getTaskData()
    await renderBoards();
    console.log(tasks);
  }

async function renderBoards() {
  await renderTempTaskList();
  addTaskClickListeners();
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