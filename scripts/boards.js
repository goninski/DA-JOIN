async function initBoards() {
    getMainTemplates();
    await getAllData();
    console.log(tasks);
    await renderBoards();
}

async function renderBoards() {
    await renderTempTaskList();
}

// da es 2 boards.js gab habe ich diesen Code von der anderen hierher kopiert /fg 4.5.25
document.querySelectorAll('.task-list').forEach(taskList => {
    new Sortable(taskList, {
      group: 'shared', 
      animation: 150,
      ghostClass: 'ghost'
    });
  });