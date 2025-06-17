let boards = [
  { id: 'todo', label: 'To do' },
  { id: 'inProgress', label: 'In progress' },
  { id: 'awaitFeedback', label: 'Await Feedback' },
  { id: 'done', label: 'Done' },
];


let renderTasks = [];
let currentDragTaskId;
document.addEventListener('click', documentEventHandlerBoard);
document.addEventListener('keydown', documentEventHandlerBoard);


/**
 * On page load board.html
 */
async function initBoard() {
  await getContacts()
  await checkAuth();
  getMainTemplates();
  await getTaskData()
  renderTasks = tasks;
  await renderBoards();
}


/**
 * Document Event handler: close popups on outslide click or ESC
 * @param {Event} event - click or keydown event (ESC)
 */
function documentEventHandlerBoard(event) {
  if (event.key === 'Escape' || event.type === "click") {
    closeOpenElements('.task-options-menu');
  }
}


/**
 * Event handler: listen to search input and start actions
 * @param {Event} event - oninput (search input)
 */
async function listenTaskSearchInput(event) {
  let taskSearchInput = document.getElementById('inputTaskSearch');
  let taskSearchBtn = document.getElementById('taskSearchBtn');
  let searchVal = taskSearchInput.value.toLowerCase();
  if (searchVal.length > 0) {
    taskSearchBtn.tabIndex = 0;
    taskSearchBtn.classList.remove('not-clickable');
  } else {
    taskSearchBtn.tabIndex = -1;
    taskSearchBtn.classList.add('not-clickable');
  }
  await filterTasks(event);
}


/**
 * Filter board tasks based on search input
 * @param {Event} event - input event
 */
async function filterTasks(event) {
  event.preventDefault();
  let taskSearchInput = document.getElementById('inputTaskSearch');
  let searchVal = taskSearchInput.value.toLowerCase();
  renderTasks = await tasks.forEach(task => task.searchBase = (task.title + ' ' + task.description));
  let filteredTasks = await tasks.filter(task => (task.searchBase).toLowerCase().includes(searchVal));
  if (hasLength(filteredTasks)) {
    renderTasks = filteredTasks;
  } else {
    await showFloatingMessage('text', 'no Tasks found !', 1500, 'showing-top');
    setTimeout(() => { taskSearchInput.value = '' }, 1500)
    renderTasks = tasks;
  }
  await renderBoards();
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
 * @param {Array<Object>} renderTasks - Array of task objects
 * @param {string} boardId - id of the current board
 * @param {HTMLElement} boardTaskList - html element of the task list wrapper
 */
async function renderBoardTasks(renderTasks, boardId, boardTaskList) {
  let boardTasks = await renderTasks.filter(task => task.status == boardId);
  if (hasLength(boardTasks)) {
    for (let index = 0; index < boardTasks.length; index++) {
      let task = boardTasks[index];
      let category = await getCategoryById(task.categoryId);
      let subtaskCount = await getSubtaskProgress(task, 'count');
      let subtaskProgressWidth = (128 * await getSubtaskProgress(task, 'progress') / 100) + 'px';
      boardTaskList.innerHTML += await getBoardTasksTemplate(task, category, subtaskCount, subtaskProgressWidth);
      await renderTaskFormContactBatches(task.contactIds, elementId = 'profileBatchesTaskBoard-' + task.id, 6);
    }
  } else {
    boardTaskList.innerHTML = getBoardNoTaskTemplate();
  }
}


/**
 * Event handler: open task details in dialogue
 * @param {Event} event - onclick (board task)
 * @param {string} taskId - id of the clicked task
 * @param {boolean} [animated=true] - show dialogue with animation true/false
 */
async function showTaskDetail(event, taskId, animated = true) {
  event.stopPropagation();
  formMode = 'show';
  let task = await getTaskById(taskId);
  let category = await getCategoryById(task.categoryId);
  await showTaskDialogue('taskDetailsWrapper', 'board', animated);
  document.getElementById('taskDetailsWrapper').innerHTML = getTaskDetailsTemplate(task, category);
  document.getElementById('taskDialogue').classList.add('show-task');
  await renderTaskDetailsAssignedContacts(task);
  await renderTaskDetailsSubtasks(task);
}


/**
 * Render assigned contacts on task detail
 * @param {Object} task - current task
 */
async function renderTaskDetailsAssignedContacts(task) {
  let contactIds = task.contactIds;
  let wrapper = document.getElementById('taskDetailsAssignedContactsWrapper');
  wrapper.innerHTML = '';
  if(hasLength(contactIds)) {
    for (let index = 0; index < contactIds.length; index++) {
      let contact = await getContactById(contactIds[index]);
      contact ? wrapper.innerHTML += getTaskDetailsAssignedContactTemplate(contact) : null;
    }
  }
}


/**
 * Render subtasks on task detail
 * @param {Object} task - current task
 */
async function renderTaskDetailsSubtasks(task) {
  let subtasks = task.subtasks;
  let wrapper = document.getElementById('taskDetailsSubtaskWrapper');
  wrapper.innerHTML = '';
  if (hasLength(subtasks)) {
    for (let subtaskIndex = 0; subtaskIndex < subtasks.length; subtaskIndex++) {
      let subtask = subtasks[subtaskIndex];
      wrapper.innerHTML += getTaskDetailsSubtaskTemplate(task, subtask, subtaskIndex);
    }
  }
}


/**
 * Render task options menu (change status/move to board)
 * @param {Event} event - click (three dot menu button)
 * @param {string} taskId - id of the current task
 * @param {string} currentStatus - current status of the current task
 */
async function renderTaskOptionsMenu(event, taskId, currentStatus) {
  event.stopPropagation();
  event.preventDefault();
  closeOpenElements('.task-options-menu');
  let wrapper = document.getElementById('taskOptionsMenu-' + taskId);
  let statusIndex = boards.findIndex((item) => item.id == currentStatus);
  wrapper.innerHTML = getMoveToBoardMenuTemplate(taskId, currentStatus, statusIndex);
  wrapper.classList.add('is-open');
}


/**
 * Event handler: add task to current board
 * @param {Event} event - onclick (button)
 * @param {string} boardId - id of the current board
 */
function addBoardTask(event, boardId) {
  openAddTaskForm(event, 'board', boardId);
}


/**
 * Event handler: on drag start, board task
 * @param {DragEvent} event - ondragstart (board task)
 * @param {string} taskId - current task id
 */
function onDragStartTask(event, taskId) {
  event.stopPropagation();
  currentDragTaskId = taskId;
  element = event.currentTarget;
  element.classList.add('dragging');
}


/**
 * Event handler: on drag end
 * @param {DragEvent} event - ondragend (board task)
 */
function onDragEnd(event) {
  event.stopPropagation();
  element = event.currentTarget;
  element.classList.remove('dragging');
}


/**
 * Event handler: on drag over
 * @param {DragEvent} event - ondragover (board tasklist)
 */
function onDragOver(event) {
  event.preventDefault();
  element = event.currentTarget;
  element.classList.add('dropzone');
}


/**
 * Event handler: on drag leave
 * @param {DragEvent} event - ondragleave (board tasklist)
 */
function onDragLeave(event) {
  element = event.currentTarget;
  element.classList.remove('dropzone');
}


/**
 * Event handler: task drop
 * @param {DragEvent} event - ondrop (board tasklist)
 * @param {string} boardId - id of the target board
 */
async function taskDrop(event, boardId) {
  element = event.currentTarget;
  element.classList.remove('dropzone');
  await changeBoardTaskStatus(event, currentDragTaskId, boardId)
}


/**
 * Event handler: change task status (move to board)
 * @param {Event} event - inherit, click (move to board menu buttons)
 * @param {string} taskId - id of the selected task
 * @param {string} statusNew - id of the new status (target board)
 * @param {string} [msg=''] - confirmation message
 */
async function changeBoardTaskStatus(event, taskId, statusNew, msg = '') {
  event.stopPropagation();
  event.preventDefault();
  let task = await getTaskById(taskId);
  task.status = statusNew;
  let board = boards.find(board => board.id == statusNew);
  await updateTaskProperty(taskId, 'status', statusNew);
  await renderBoards();
  if (msg != '') {
    await showFloatingMessage('text', 'Task succesfully moved to ' + board.label + ' Board');
    closeParentWrapper(event);
  }
}


