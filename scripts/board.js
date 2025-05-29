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
    await getContacts()
    await checkAuth();
    getMainTemplates();
    await getTaskData()
    renderTasks = tasks;
    await setSearchBase();
    await renderBoards();
    //await renderTempTaskList(tasks);
    // addTaskClickListeners();
}


/**
 * Event handler: listen to search input and start actions
 * 
 * @param {event} event - oninput (search input)
 */
async function listenTaskSearchInput(event) {
  // console.log('f) listenTaskSearchInput');
  let taskSearchInput = document.getElementById('inputTaskSearch');
  let taskSearchBtn = document.getElementById('taskSearchBtn');
  let searchVal = taskSearchInput.value.toLowerCase();
  console.log(searchVal);
  if(searchVal.length > 0) {
    taskSearchBtn.tabIndex = 0;
    taskSearchBtn.classList.remove('not-clickable');
    // await filterTasks(event);
  } else {
    taskSearchBtn.tabIndex = -1;
    taskSearchBtn.classList.add('not-clickable');
    // await renderBoards();
  }
    await filterTasks(event);
}


/**
 * Filter board tasks based on search input
 * 
 * @param {event} event - inherit
 */
async function filterTasks(event) {
  event.preventDefault();
  console.log('f) filterTasks');
  let taskSearchInput = document.getElementById('inputTaskSearch');
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
 * Helper: set task title and description as search content base
 */
async function setSearchBase() {
  renderTasks = tasks.forEach(task => task.searchBase = (task.title + ' ' + task.description));
  // console.log(tasks);
}


/**
 * Render task boards
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
      // let catIndex = await getCategoryIndexFromId(task.categoryId);
      // let category = categories[catIndex];
      let category = await getCategoryById(task.categoryId);
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
 * Event handler: open task details in dialogue
 * 
 * @param {event} event - onclick (board task)
 * @param {string} taskId - id of the clicked task
 */
async function showTaskDetail(event, taskId) {
    event.stopPropagation();
    formMode = 'show';
    let task = await getTaskById(taskId);
    let category = await getCategoryById(task.categoryId);
    await showTaskDialogue('taskDetailsWrapper');
    document.getElementById('taskDetailsWrapper').innerHTML = getTaskDetailsTemplate(task, category);
    document.getElementById('taskDialogue').classList.add('show-task');
    await renderTaskDetailsAssignedContacts(task);
    await renderTaskDetailsSubtasks(task);
}


/**
 * Render assigned contacts on task detail
 * 
 * @param {object} task - current task
 */
async function renderTaskDetailsAssignedContacts(task) {
    let contactIds = task.contactIds;
    let wrapper = document.getElementById('taskDetailsAssignedContactsWrapper');
    wrapper.innerHTML = '';    
    if(hasLength(contactIds)) {
      for (let index = 0; index < contactIds.length; index++) {
        let contact = await getContactById(contactIds[index]);
        wrapper.innerHTML += getTaskDetailsAssignedContactTemplate(contact);
      }
    }
}


/**
 * Render subtasks on task detail
 * 
 * @param {object} task - current task
 */
async function renderTaskDetailsSubtasks(task) {
    let subtasks = task.subtasks;
    let wrapper = document.getElementById('taskDetailsSubtaskWrapper');
    wrapper.innerHTML = '';    
    if(hasLength(subtasks)) {
      for (let subtaskIndex = 0; subtaskIndex < subtasks.length; subtaskIndex++) {
        let subtask = subtasks[subtaskIndex];
        wrapper.innerHTML += getTaskDetailsSubtaskTemplate(task, subtask, subtaskIndex);
      }
    }
}


/**
 * Event handler: add task to current board
 * 
 * @param {event} event - onclick (button)
 * @param {string} boardId - id of the current board
 */
function addBoardTask(event, boardId) {
  openAddTaskForm(event, 'board', boardId);
}


/**
 * Event handler: on drag start, board task
 * 
 * @param {event} event - ondragstart (board task)
 * @param {string} taskId - current task id
 */
function onDragStartTask(event, taskId) {
  event.stopPropagation();
  currentDragTaskId = taskId;
  console.log(currentDragTaskId);
  console.log(renderTasks);
  // element = event.currentTarget;
  // element.classList.add('dragging');
}


/**
 * Event handler: on drag end
 * 
 * @param {event} event - ondragend (board task)
 */
function onDragEnd(event) {
  event.stopPropagation();
  element = event.currentTarget;
  element.classList.remove('dragging');
}


/**
 * Event handler: on drag over
 * 
 * @param {event} event - ondragover (board tasklist)
 */
function onDragOver(event) {
  event.preventDefault();
  element = event.currentTarget;
  element.classList.add('dropzone');
}


/**
 * Event handler: on drag leave
 * 
 * @param {event} event - ondragleave (board tasklist)
 */
function onDragLeave(event) {
  // event.preventDefault();
  element = event.currentTarget;
  element.classList.remove('dropzone');
}


/**
 * Event handler: task drop
 * 
 * @param {event} event - ondrop (board tasklist)
 * @param {string} boardId - id of the target board
 */
async function taskDrop(event, boardId) {
  element = event.currentTarget;
  element.classList.remove('dropzone');
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
 * Event handler: activate horizontal drag scroll on screen < 1440px
 * 
 * @param {event} event - onmousedown, onmouseup, onmouseleave, onmousemove (all on board tasklist)
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
 * ??? unstable !!  based on: https://codepen.io/toddwebdev/pen/yExKoj
 * 
 * @param {event} event - inherit
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

