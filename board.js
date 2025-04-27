document.querySelectorAll('.task-list').forEach(taskList => {
    new Sortable(taskList, {
      group: 'shared', 
      animation: 150,
      ghostClass: 'ghost'
    });
  });