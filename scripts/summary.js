let currentFormattedDate = formatDateToYYYYMMDD(new Date());
let taskSummary = {};

async function initSummary() {
    getMainTemplates();
    await getUserData();
    await checkAuth();
    await getTaskData();
    await setTaskSummaryObj();
}

async function resetTaskSummaryObj() {
  taskSummary = {};
  taskSummary.upcoming = 0
  taskSummary.upcomingDeadline = '';
  taskSummary.upcomingUrgent = 0
  taskSummary.inBoard = 0;
  taskSummary.todo = 0;
  taskSummary.inProgress = 0;
  taskSummary.awaitFeedback = 0;
  taskSummary.done = 0;
  // taskSummary.priorityHigh = 0
}

async function setTaskSummaryObj() {
  resetTaskSummaryObj();
  taskSummary.userName = await getUserNameById(loggedInUserId);
  await setUpcomings();
  await setTaskCounts();
  setDaySegment();
  console.log(taskSummary);
}

async function setUpcomings() {
  let futureTasks = tasks.filter(task => task.dueDate >= currentFormattedDate);
  if(hasLength(futureTasks)) {
    let sortedTasks = futureTasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    let upcomingDeadline = sortedTasks[0].dueDate;
    let upcomingTasks = futureTasks.filter(task => task.dueDate == upcomingDeadline);
    hasLength(upcomingTasks) ? taskSummary.upcoming = upcomingTasks.length : null;
    taskSummary.upcomingDeadline = upcomingDeadline;
    let upcomingUrgentTasks = upcomingTasks.filter(task => task.priority == 'high');
    hasLength(upcomingUrgentTasks) ? taskSummary.upcomingUrgent = upcomingUrgentTasks.length : null;
  }
}

async function setTaskCounts() {
  taskSummary.inBoard = hasLength(tasks) ? tasks.length : 0;
  tasks.forEach(task => {
    task.status == 'To do' ? taskSummary.todo++ : null;
    task.status == 'in Progress' ? taskSummary.inProgress++ : null;
    task.status == 'Await Feedback' ? taskSummary.awaitFeedback++ : null;
    task.status == 'Done' ? taskSummary.done++ : null;
    // task.priority == 'high' ? taskSummary.priorityHigh++ : null;
  });
}

async function getUserNameById(loggedInUserId) {
  let filteredArr = contacts.filter(contact => contact.id == loggedInUserId);
  return hasLength(filteredArr) ? filteredArr.name : 'Dear Guest';
}

function setDaySegment() {
  let currentDate = new Date();
  let hours = currentDate.getHours();
  let daySegment = 'Good afternoon';
  if(hours >=0 && hours < 12) {
    daySegment = 'Good morning';
  } else if(hours >= 18) {
    daySegment = 'Good evening';
  }
  taskSummary.daySegment = daySegment;
}

