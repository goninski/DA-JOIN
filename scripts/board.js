let boards = [
    {id: 'todo', label: 'To do'},
    {id: 'inProgress', label: 'In progress'},
    {id: 'awaitFeedback', label: 'Await Feedback'},
    {id: 'done', label: 'Done'},
];

let renderTasks = [];
let currentDragTaskId;
let dragScrollMouseIsDown = false;
let dragScrollStartX;
let dragScrollScrollLeft;


/**
 * On page load board.html
 */
async function initBoard() {
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


/**
 * Listen on search input and start actions based on input
 * 
 * @param {event} event - oninput event
 */
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


/**
 * set task title and description as search base
 */
async function setSearchBase() {
  renderTasks = tasks.forEach(task => task.searchBase = (task.title + ' ' + task.description));
  // console.log(tasks);
}


/**
 * Filter board tasks based on search input
 * 
 * @param {event} event - oninput event
 */
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


/**
 * Render tasks boards
 */
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


/**
 * Render board tasks
 * 
 * @param {object} renderTask - task object (of renderTasks)
 * @param {string} boardId - id of the current board
 * @param {element} boardTaskList - html element of the task list wrapper
 */
async function renderBoardTasks(renderTasks, boardId, boardTaskList) {
  let boardTasks = await renderTasks.filter(task => task.status == boardId);
  if(hasLength(boardTasks)) {
    for (let index = 0; index < boardTasks.length; index++) {
      let task = boardTasks[index];
      let catIndex = await getCategoryIndexFromId(task.categoryId);
      let category = categories[catIndex];
      let subtaskCount = await getSubtaskProgress(task, 'count');
      let subtaskProgressWidth = (128 * await getSubtaskProgress(task, 'progress') / 100) + 'px';
      boardTaskList.innerHTML += await getBoardTasksTemplate(task, category, subtaskCount, subtaskProgressWidth);
      await renderContactProfileBatches(task.contactIds, elementId = 'profileBatchesTaskBoard-' + task.id);
    }
  } else {
    boardTaskList.innerHTML = getBoardNoTaskTemplate();
  }
}


/**
 * Event handler: add task to current board, on button
 * 
 * @param {event} event - click
 * @param {string} boardId - id of the current board
 */
function addBoardTask(event, boardId) {
  openAddTaskForm(event, 'board', boardId);
}


/**
 * Event handler: task drag start, on board task
 * 
 * @param {event} event - ondragstart
 * @param {string} taskId - current task id
 */
function taskDrag(event, taskId) {
  currentDragTaskId = taskId;
  console.log(currentDragTaskId);
  console.log(renderTasks);
}


/**
 * Event handler: allow task drop, on board tasklist
 * 
 * @param {event} event - ondragover
 */
function allowDrop(event) {
  event.preventDefault();
}


/**
 * Event handler: task drop, on board tasklist
 * 
 * @param {event} event - ondrop
 * @param {string} boardId - id of the target board
 */
async function taskDrop(event, boardId) {
  console.log(renderTasks);
  let index = await tasks.findIndex(task => task.id == currentDragTaskId);
  // let index = await getTaskIndexFromId(currentDragElement);
  console.log(index);
  tasks[index].status = boardId;
  await updateTaskProperty(currentDragTaskId, 'status', boardId);
  console.log(tasks);
  await renderBoards();
}


/**
 * Event handler: calls horizontal drag scroll for task board (screen < 1440px) 
 * 
 * @param {event} event - onmousedown, onmouseup, onmouseleave, onmousemove
 */
function horizontalBoardDragScroll(event) {
  event.stopPropagation();
  if(window.matchMedia("(min-width: 1440px)").matches) {
    return;
  }
  return horizontalDragScroll(event, '.board-task-list');
}


/**
 * Event handler: general horizontal drag scroll
 * unstable !!  based on: https://codepen.io/toddwebdev/pen/yExKoj
 * 
 * @param {event} event - onmousedown, onmouseup, onmouseleave, onmousemove
 * @param {string} wrapperSelector - css selector of the drag scroll element
 */
function horizontalDragScroll(event, wrapperSelector) {
  event.stopPropagation();
  let dragScrollWrapper = getClosestParentElementFromEvent(event, wrapperSelector);
  let type = event.type;
  switch(type) {
    case 'mousedown':
      dragScrollMouseIsDown = true;
      dragScrollWrapper.classList.add('active');
      dragScrollStartX = event.pageX - dragScrollWrapper.offsetLeft;
      dragScrollScrollLeft = dragScrollWrapper.dragScrollScrollLeft;
      break;
    case 'mouseleave':
      dragScrollMouseIsDown = false;
      dragScrollWrapper.classList.remove('active');
      break;
    case 'mouseup':
      dragScrollMouseIsDown = false;
      dragScrollWrapper.classList.remove('active');
      break;
    case 'mousemove':
      if(!dragScrollMouseIsDown) return;
      event.preventDefault();
      const x = event.pageX - dragScrollWrapper.offsetLeft;
      const walk = (x - dragScrollStartX) * 3; //scroll-fast
      dragScrollWrapper.dragScrollScrollLeft = dragScrollScrollLeft - walk;
      // console.log(walk);
      break;
  }
}

