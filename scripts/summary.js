let currentFormattedDate = formatDateToStringDB(new Date());
let summary = {};


/**
 * On page load summary.html
 */
async function initSummary() {
    getMainTemplates();
    setActiveMenuLinkStyles('IconSummary');
    await getUserData();
    await checkAuth();
    await getTaskData();
    await setSummaryObj();
}


/**
 * Set the summary object- this object serves all dynamic data for the summary page
 */
async function setSummaryObj() {
  resetSummaryObj();
  summary.userName = await getUserNameById(loggedInUserId);
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


/**
 * Helper: return user name by id
 * 
 * @param {string} loggedInUserId - the id of the logged in user
 */
async function getUserNameById(loggedInUserId) {
  let filteredArr = contacts.filter(contact => contact.id == loggedInUserId);
  return hasLength(filteredArr) ? filteredArr.name : '';
}
