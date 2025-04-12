function initBoardFg() {
    getMainTemplates();
    renderTaskListBoardFg()
}

function renderBoards() {
    window.location.href = "/board.html";
}

function renderTaskListBoardFg() {
    taskFormMode = 'boards-fg';
    let taskListRef = document.getElementById('taskListBoardFg');
    taskListRef.innerHTML = '';
    for (let index = 0; index < tasks.length; index++) {
        taskListRef.innerHTML += getTaskListBoardFgTemplate(tasks[index]);
    }
}

function getTaskListBoardFgTemplate(task) {
    return `
        <li class="flex-row gap justify-between align-center fw-bold">#${task.id} | ${task.title}
            <button class="" style="margin-left: auto; text-decoration: underline;" onclick="showTask(${task.id})">Show</button>
            <button class="" style="text-decoration: underline;" onclick="editTask(${task.id}, event)">Edit</button>
            <button class="" style="text-decoration: underline;" onclick="deleteTask(${task.id}, event)">Delete</button>
        </li>
    `
}
