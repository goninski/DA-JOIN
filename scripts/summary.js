let currentFormattedDate = formatDateToStringDB(new Date());
let summary = {};

async function initSummary() {
    getMainTemplates();
    await getUserData();
    await checkAuth();
    await getTaskData();
    await setSummaryObj();
    console.log(summary);
}

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

async function setSummaryObj() {
  resetSummaryObj();
  summary.userName = await getUserNameById(loggedInUserId);
  await setUpcomings();
  await setTaskCounts();
  setWelcomeMsg();
  // console.log(summary);
}

async function setUpcomings() {
  let futureTasks = tasks.filter(task => task.dueDate >= currentFormattedDate);
  if(hasLength(futureTasks)) {
    await futureTasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    let upcomingDeadline = futureTasks[0].dueDate;
    let upcomingTasks = futureTasks.filter(task => task.dueDate == upcomingDeadline);
    summary.taskCountUpcoming = hasLength(upcomingTasks) ? upcomingTasks.length : 0;
    summary.upcomingDeadline = hasLength(upcomingDeadline) ? formatDateToFromStringDBToFull(upcomingDeadline) : 'no Upcoming Deadling';
    let upcomingUrgentTasks = upcomingTasks.filter(task => task.priority == 'high');
    summary.taskCountUpcomingUrgent = hasLength(upcomingUrgentTasks) ? upcomingUrgentTasks.length : 0;
  }
}

async function setTaskCounts() {
  summary.taskCountinBoard = hasLength(tasks) ? tasks.length : 0;
  tasks.forEach(task => {
    task.status == 'todo' ? summary.taskCountTodo++ : null;
    task.status == 'inProgress' ? summary.taskCountInProgress++ : null;
    task.status == 'awaitFeedback' ? summary.taskCountAwaitFeedback++ : null;
    task.status == 'done' ? summary.taskCountDone++ : null;
    task.priority == 'high' ? summary.taskCountUrgent++ : null;
  });
}

async function getUserNameById(loggedInUserId) {
  let filteredArr = contacts.filter(contact => contact.id == loggedInUserId);
  return hasLength(filteredArr) ? filteredArr.name : 'Dear Guest';
}

function setWelcomeMsg() {
  let currentDate = new Date();
  let hours = currentDate.getHours();
  let daySegment = 'afternoon';
  if(hours >=0 && hours < 12) {
    daySegment = 'morning';
  } else if(hours >= 18) {
    daySegment = 'evening';
  }
  summary.welcomeMsg = 'Good ' + daySegment + ', ';
}

