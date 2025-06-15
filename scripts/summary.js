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
    updateSummaryValues();
    setSummaryWidgetProps();
    showSummaryWelcomeScreen()
}


/**
 * Show welcome screen (<= 1259px)
 */
function showSummaryWelcomeScreen() {
    const greetingScreen = document.getElementById('greetingScreen');
    let mql = window.matchMedia("(max-width: 1259px)");
    if(mql.matches) {
      greetingScreen.classList.remove('hide');
      setTimeout(() => greetingScreen.classList.add('active'), 1000);
      setTimeout(() => {
        greetingScreen.classList.add('hide')
        greetingScreen.classList.remove('active')
      } , 2000);
    }
    setTimeout(() => showFreshDataSetMessage(), 1750);
}


/**
 * Show Message if fresh dummy data is loaded
 */
function showFreshDataSetMessage() {
    let params = new URLSearchParams(document.location.search);
    let fresh = params.get("fresh");
    fresh ? showFloatingMessage('text', 'A fresh set of dummy data is loaded.') : null;
}


/**
 * Updates the summary numbers in the summary page
 */
function updateSummaryValues() {
    updateUserWelcome();
    document.querySelector('.to-do .number').textContent = summary.taskCountTodo || 0;
    document.querySelector('.done .number').textContent = summary.taskCountDone || 0;
    document.querySelector('.upcomings .number').textContent = summary.taskCountUrgent || 0;
    document.querySelector('.deadline .date').textContent = summary.upcomingDeadline || '';
    document.querySelector('.tasks-in-board .number').textContent = summary.taskCountInBoard || 0;
    document.querySelector('.tasks-in-progress .number').textContent = summary.taskCountInProgress || 0;
    document.querySelector('.awaiting-feedback .number').textContent = summary.taskCountAwaitFeedback || 0;
}


/**
 * Updates the welcome message and username on the summary page
 */
function updateUserWelcome() {
    const greetingElements = document.querySelectorAll('.greeting-message');
    const usernameElements = document.querySelectorAll('.greeting-username');
    greetingElements.forEach(element => {
      element.textContent = summary.welcomeMsg;
    })
    usernameElements.forEach(element => {
      element.textContent = summary.userName;
    })
}


/**
 * Add widget properties (click listenersto widgets to open board.html
 */
function setSummaryWidgetProps() {
  let elements = document.querySelectorAll('.widget');
  elements.forEach(element => {
    element.title = 'Open Task Boards'
    element.addEventListener('click', () => {
        window.location.href = '/board.html';
    });
  });
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
}


/**
 * Set upcoming task values on summary object
 */
async function setUpcomings() {
  let futureTasks = tasks ? tasks.filter(task => task.dueDate >= currentFormattedDate) : [];
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
  if(tasks) {
    tasks.forEach(task => {
      task.status == 'todo' ? summary.taskCountTodo++ : null;
      task.status == 'inProgress' ? summary.taskCountInProgress++ : null;
      task.status == 'awaitFeedback' ? summary.taskCountAwaitFeedback++ : null;
      task.status == 'done' ? summary.taskCountDone++ : null;
      task.priority == 'high' ? summary.taskCountUrgent++ : null;
    });
  }
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
 * Helper: return current day segment (morning, afternoon, evening)
 */
function getDaySegment() {
  let currentDate = new Date();
  let hours = currentDate.getHours();
  let daySegment = 'afternoon';
  if(hours >=0 && hours < 12) {
    daySegment = 'morning';
  } else if(hours >= 18) {
    daySegment = 'evening';
  }
  return daySegment;
}

