let boards = [
    {id: 'todo', label: 'To do'},
    {id: 'inProgress', label: 'In progress'},
    {id: 'awaitFeedback', label: 'Await Feedback'},
    {id: 'done', label: 'Done'},
];
let renderTasks = [];
// let boardTasks = [];
let currentDragTaskId;

async function initBoards() {
    getMainTemplates();
    await getContacts()
    await checkAuth();
    await getTaskData()
    renderTasks = tasks;
    await setSearchBase();
    await renderBoards();
    //await renderTempTaskList(tasks);
    // addTaskClickListeners();
}

async function listenTaskSearchInput(event) {
  // console.log('f) listenTaskSearchInput');
  let taskSearchInput = document.getElementById('taskSearchInput');
  let taskSearchBtn = document.getElementById('taskSearchBtn');
  let searchVal = taskSearchInput.value.toLowerCase();
  console.log(searchVal);
  if(searchVal.length > 0) {
    taskSearchBtn.tabIndex = 0;
    taskSearchBtn.classList.remove('not-clickable');
    await filterTasks(event);
  } else {
    taskSearchBtn.tabIndex = -1;
    taskSearchBtn.classList.add('not-clickable');
    await renderBoards();
  }
}

// async function validateSearchInput(searchVal) {
//   return (searchVal >= 2);
// }

async function setSearchBase() {
  renderTasks = tasks.forEach(task => task.searchBase = (task.title + ' ' + task.description));
  // console.log(tasks);
}

async function filterTasks(event) {
  event.preventDefault();
  console.log('f) filterTasks');
  let taskSearchInput = document.getElementById('taskSearchInput');
  let searchVal = taskSearchInput.value.toLowerCase();
  let filteredTasks = tasks.filter(task => (task.searchBase).toLowerCase().includes(searchVal));
  if(hasLength(filteredTasks)) {
    renderTasks = filteredTasks;
  } else {
    await showFloatingMessage('text', 'no Tasks found !', 1500);
    setTimeout(() => {taskSearchInput.value = ''}, 1500)
    renderTasks = tasks;    
  }
  await renderBoards();
}

async function renderBoards() {
  let boardsWrapper = document.getElementById('boardsWrapper');
  boardsWrapper.innerHTML = '';
  for (let index = 0; index < boards.length; index++) {
    let board = boards[index];
    boardsWrapper.innerHTML += getBoardTemplate(board);
    let boardTaskList = document.getElementById('boardTaskList-' + board.id);
    boardTaskList.innerHTML = '';
    hasLength(renderTasks) ? await renderBoardTasks(renderTasks, board.id, boardTaskList) : await renderBoardTasks(tasks, board.id, boardTaskList);
  }
}

async function renderBoardTasks(renderTasks, boardId, boardTaskList) {
  let boardTasks = await renderTasks.filter(task => task.status == boardId);
  if(hasLength(boardTasks)) {
    for (let index = 0; index < boardTasks.length; index++) {
      let task = boardTasks[index];
      let catIndex = await getCategoryIndexFromId(task.categoryId);
      let category = categories[catIndex];
      // task.subtaskCount = await getSubtaskProgress(task, 'count');
      // task.subtaskProgress = await getSubtaskProgress(task, 'progress');
      boardTaskList.innerHTML += await getBoardTasksTemplate(task, category);
      await renderContactProfileBatches(task.contactIds, elementId = 'profileBatchesTaskBoard-' + task.id);
    }
  } else {
    boardTaskList.innerHTML = getBoardNoTaskTemplate();
  }
}

function addBoardTask(event, boardId) {
  openAddTaskForm(event, 'board', boardId);
}

function allowDrop(event) {
  event.preventDefault();
}

function taskDrag(event, taskId) {
  currentDragTaskId = taskId;
  console.log(currentDragTaskId);
  console.log(renderTasks);
}

async function taskDrop(event, boardId) {
  console.log(renderTasks);
  let index = await tasks.findIndex(task => task.id == currentDragTaskId);
  // let index = await getTaskIndexFromId(currentDragElement);
  console.log(index);
  tasks[index].status = boardId;
  await updateTaskProperty(currentDragTaskId, 'status', boardId);
  console.log(tasks);
  await renderBoards(tasks);
}


document.querySelectorAll('.task-list').forEach(taskList => {
  new Sortable(taskList, {
    group: 'shared',
    animation: 150,
    ghostClass: 'ghost'
  });
});


// document.querySelectorAll('.clickable-task').forEach(task => {
//   task.addEventListener('click', () => {
//     const title = task.querySelector('.task-heading')?.textContent || "Kein Titel";
//     const description = task.querySelector('.task-description')?.textContent || "Keine Beschreibung";

    document.getElementById('overlay-title').textContent = title;
    document.getElementById('overlay-description').textContent = description;
    document.getElementById('task-overlay').style.display = 'flex';
//   });
// });


// function closeOverlay() {
//   document.getElementById('task-overlay').style.display = 'none';
// }