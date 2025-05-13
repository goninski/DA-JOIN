let boards = ['todo', 'inProgress', 'awaitFeedback', 'done'];
let renderTasks = {};
let taskBoards = {};
let currentDragTaskId;

async function initBoards() {
    getMainTemplates();
    await getContacts()
    await checkAuth();
    await getTaskData()
    await setSearchBase();
    await renderBoards(tasks);
    //await renderTempTaskList(tasks);
    // addTaskClickListeners();
}

async function setSearchBase() {
  tasks.forEach(task => task.searchBase = (task.title + ' ' + task.description));
  // console.log(tasks);
}

async function validateSearchInput(searchVal) {
  return (searchVal >= 2);
}

async function filterTasks(event) {
  event.preventDefault();
  console.log('f) filterTasks');
  let taskSearchInput = document.getElementById('taskSearchInput');
  let searchVal = taskSearchInput.value.toLowerCase();
  renderTasks = tasks.filter(task => (task.searchBase).toLowerCase().includes(searchVal));
  // console.log(renderTasks);
  if(renderTasks.length <= 0) {
    await showFloatingMessage('text', 'no Tasks found !');
    taskSearchInput.value = '';
  }
  await renderBoards(renderTasks);
}

async function renderBoards(renderTasks) {
  let boardsWrapper = document.getElementById('boardsWrapper');
  boardsWrapper.innerHTML = '';
  for (let index = 0; index < boards.length; index++) {
    let board = boards[index];
    boardsWrapper.innerHTML += getBoardTemplate(board);
    let boardTaskList = document.getElementById('boardTaskList-' + board);
    let boardTaskCount = 0; // add number of tasks
    boardTaskList.innerHTML = boardTaskCount <= 0 ? '' : getBoardNoTaskTemplate();
    hasLength(renderTasks) ? await renderBoardTasks(renderTasks, board, boardTaskList) : await renderBoardTasks(tasks, board, boardTaskList);
  }
  console.log(renderTasks);
}

async function renderBoardTasks(renderTasks, board, boardTaskList) {
  boardTasks = await renderTasks.filter(task => task.status == board);
  for (let index = 0; index < boardTasks.length; index++) {
    let task = boardTasks[index];
    let catIndex = await getCategoryIndexFromId(task.categoryId);
    let category = categories[catIndex];
    task.subtaskCount = await getSubtaskProgress(task, 'count');
    task.subtaskProgress = await getSubtaskProgress(task, 'progress');
    boardTaskList.innerHTML += getBoardTasksTemplate(task, category);
    await renderContactProfileBatches(task.contactIds, elementId = 'profileBatchesTaskBoard-' + task.id);
  }
}

async function listenTaskSearchInput(event) {
  // console.log('f) listenTaskSearchInput');
  let taskSearchInput = document.getElementById('taskSearchInput');
  let taskSearchBtn = document.getElementById('taskSearchBtn');
  let searchVal = taskSearchInput.value.toLowerCase();
  console.log(searchVal);
  if(validateSearchInput(searchVal)) {
    taskSearchBtn.tabIndex = 0;
    taskSearchBtn.classList.remove('not-clickable');
    await filterTasks(event);
  } else {
    taskSearchBtn.tabIndex = -1;
    taskSearchBtn.classList.add('not-clickable');
  }
}

function addBoardTask(event, board) {
  openAddTaskForm(event, 'board', board);
}

function allowDrop(event) {
  event.preventDefault();
}

function taskDrag(event, taskId) {
  currentDragTaskId = taskId;
  console.log(currentDragTaskId);
  console.log(renderTasks);
}

async function taskDrop(event, board) {
  console.log(renderTasks);
  let index = await tasks.findIndex(task => task.id == currentDragTaskId);
  // let index = await getTaskIndexFromId(currentDragElement);
  console.log(index);
  tasks[index].status = board;
  await updateTaskProperty(currentDragTaskId, 'status', board);
  console.log(tasks);
  await renderBoards(tasks);
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