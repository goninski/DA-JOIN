let currentFormattedDate = formatDateToStringDB(new Date());
let summary = {};


/**
 * On page load summary.html
 */
async function initSummary() {
    await getUserData();
    await checkAuth();
    getMainTemplates();
    await getTaskData();
    await setSummaryObj();
    renderSummaryNumbers();
}

/**
 * Updates the summary numbers in the summary page
 */
function renderSummaryNumbers() {
    // To-do
    document.querySelector('.to-do .number').textContent = summary.taskCountTodo || 0;
    // Done
    document.querySelector('.done .number').textContent = summary.taskCountDone || 0;
    // Urgent
    document.querySelector('.urgent-deadline .number').textContent = summary.taskCountUrgent || 0;
    // Upcoming Deadline
    document.querySelector('.deadline .date').textContent = summary.upcomingDeadline || '';
    // Tasks in Board
    document.querySelector('.tasks-in-board .number').textContent = summary.taskCountInBoard || 0;
    // Tasks in Progress
    document.querySelector('.tasks-in-progress .number').textContent = summary.taskCountInProgress || 0;
    // Awaiting Feedback
    document.querySelector('.awaiting-feedback .number').textContent = summary.taskCountAwaitFeedback || 0;
}

/**
 * Set the summary object- this object serves all dynamic data for the summary page
 */
async function setSummaryObj() {
  resetSummaryObj();
  summary.userName = loggedInUser ? loggedInUser.name : '';
  await setUpcomings();
  await setTaskCounts();
  setWelcomeMsg();
  console.log(summary);
}


/**
 * Set upcoming task values on summary object
 */
async function setUpcomings() {
  let futureTasks = tasks.filter(task => task.dueDate >= currentFormattedDate);
  if(hasLength(futureTasks)) {
    await futureTasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    let upcomingDeadline = futureTasks[0].dueDate;
    let upcomingTasks = futureTasks.filter(task => task.dueDate == upcomingDeadline);
    summary.taskCountUpcoming = hasLength(upcomingTasks) ? upcomingTasks.length : 0;
    summary.upcomingDeadline = hasLength(upcomingDeadline) ? formatDateFromStringDBToFull(upcomingDeadline) : 'no Upcoming Deadling';
    let upcomingUrgentTasks = upcomingTasks.filter(task => task.priority == 'high');
    summary.taskCountUpcomingUrgent = hasLength(upcomingUrgentTasks) ? upcomingUrgentTasks.length : 0;
  }
}


/**
 * Set various task counts on summary object
 */
async function setTaskCounts() {
  summary.taskCountInBoard = hasLength(tasks) ? tasks.length : 0;
  tasks.forEach(task => {
    task.status == 'todo' ? summary.taskCountTodo++ : null;
    task.status == 'inProgress' ? summary.taskCountInProgress++ : null;
    task.status == 'awaitFeedback' ? summary.taskCountAwaitFeedback++ : null;
    task.status == 'done' ? summary.taskCountDone++ : null;
    task.priority == 'high' ? summary.taskCountUrgent++ : null;
  });
}


/**
 * Set welcome message on summary object
 * 
 * @param {string} loggedInUserId - the id of the logged in user
 */
function setWelcomeMsg() {
  let daySegment = getDaySegment();
  let msgSuffix = summary.userName == '' ? '!' : ',';
  summary.welcomeMsg = 'Good ' + daySegment + msgSuffix;
}


/**
 * Reset the summary object
 */
async function resetSummaryObj() {
  summary = {};
  summary.taskCountUpcoming = 0
  summary.taskCountUpcomingUrgent = 0
  summary.taskCountInBoard = 0;
  summary.taskCountTodo = 0;
  summary.taskCountInProgress = 0;
  summary.taskCountAwaitFeedback = 0;
  summary.taskCountDone = 0;
  summary.taskCountUrgent = 0
  summary.upcomingDeadline = '';
} 

