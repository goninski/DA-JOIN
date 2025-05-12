let currentDate = formatDateToYYYYMMDD(new Date());
let taskSummary = {};

async function initSummary() {
    getMainTemplates();
    await getUserData();
    await checkAuth();
    await getTaskData();
    await setTaskSummaryObj();
}

async function setTaskSummaryObj() {
  taskSummary = {};
  taskSummary.inBoard = tasks.length;
  taskSummary.todo = await getTaskCountByStatus('To do');
  taskSummary.inProgress = await getTaskCountByStatus('in Progress');
  taskSummary.awaitFeedback = await getTaskCountByStatus('Await Feedback');
  taskSummary.done = await getTaskCountByStatus('Done');
  taskSummary.urgent = await getTaskCountByPriority('high');
  console.log(taskSummary);
}

// async function sortTasksByDueDate(tasks) {
//   return await tasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
// }

// async function filterUpcomingTasks(tasks) {
//   return await tasks.filter(task => task.dueDate >= currentDate);
// }

async function getTaskCountByStatus(status) {
  let filteredTasks = tasks.filter(task => task.status == status);
  return hasLength(filteredTasks) ? filteredTasks.length : 0;
}

async function getTaskCountByPriority(priority) {
  let filteredTasks = tasks.filter(task => task.priority == priority);
  return hasLength(filteredTasks) ? filteredTasks.length : 0;
}


