/**
 * Return html of a single board (status board on board page)
 * 
 * @param {object} board - a board object (of boards)
 */
function getBoardTemplate(board) {
    let addTaskBtn = getIconTemplatePlus();
    return `
        <div class="board" id="board-${board.id}">
            <div class="board-title-bar">
                <h3 class="board-title">${board.label}</h3>
                <button class="add-task-button-board" title="add new Task" onclick="addBoardTask(event, 'todo')">
                    ${addTaskBtn}
                </button>
            </div>
            <div id="boardTaskList-${board.id}" class="board-task-list" ondragover="onDragOver(event)" ondragleave="onDragLeave(event)" ondrop="taskDrop(event, '${board.id}')">
            </div>
        </div>
`
}


/**
 * Return html of the no-task drop zone (for boards with no tasks assigned)
 */
function getBoardNoTaskTemplate() {
    return `
        <div class="board-no-task">No tasks To Do</div>
`
}


/**
 * Return html of a single task of a status board
 * 
 * @param {object} task - a task object (of tasks)
 * @param {object} category - the category object (of categories) for the current task
 * @param {string} subtaskCount - number of subtasks and subtasks done for the current task
 * @param {string} subtaskProressWidth - the px-width for the subtask progress bar style (done subtasks)
 */
async function getBoardTasksTemplate(task, category, subtaskCount, subtaskProgressWidth) {
    let hideDescription = task.description == null ? 'hide': null;
    // let hideBatches = task.contactIds == null ? 'hide': null;
    let hideSubtask = subtaskCount == null ? 'hide': null;
    return `
        <div class="board-task clickable-task" onclick="showTaskDetail(event, '${task.id}')" draggable="true" ondragstart="onDragStartTask(event, '${task.id}')" ondragend="onDragEnd(event)">
            <div class="task-options-menu-wrapper flex-col">
                <button class="task-options-menu-button hide-focus" title="Move Task" onclick="renderTaskOptionsMenu(event,'${task.id}', '${task.status}')"><img src="./assets/icons/swap-status.svg" alt="swap-icon"></button>
                <div id="taskOptionsMenu-${task.id}" class="task-options-menu close-on-event flex-col not-clickable" onclick="event.stopPropagation()" xonmouseleave="closeElementByCurrentTarget(event)"></div>
            </div>
            <div class="board-task-category" style="background-color: ${category.color};">${category.name}</div>
            <div class="board-task-title">${task.title}</div>
            <div class="board-task-description ${hideDescription}">${task.description}</div>
            <div class="board-subtask-info flex-row justify-between align-center ${hideSubtask}">
                <div class="board-task-progress-bar">
                    <div class="board-task-progress-done" style="width: ${subtaskProgressWidth}"></div>
                </div>
                <div class="board-subtask-count">${subtaskCount} Subtasks</div>
            </div>
            <div class="board-task-user flex-row align-center"> 
                <ul id="profileBatchesTaskBoard-${task.id}" class="profile-batches task-board hide-if-empty"></ul>
                <img src="./assets/icons/prio-${task.priority}.svg" class="board-task-priority ml-auto">
            </div>
        </div>
    `
}


/**
 * Return html of board task option menu (change task status / move to board)
 * 
 * @param {string} taskId - id of the current task
 * @param {string} currentStatus - current status of the current task
 * @param {number} statusIndex - current status index
 */
function getMoveToBoardMenuTemplate(taskId, currentStatus, statusIndex) {
    let hideTodo = (statusIndex == 0) ? 'hide' : '';
    let hideInProgress = (statusIndex == 1) ? 'hide' : '';
    let hideAwaitFeedback = (statusIndex == 2) ? 'hide' : '';
    let hideDone = (statusIndex == 3) ? 'hide' : '';
    let arrowInProgress = (statusIndex < 1) ? 'downward' : 'upward';
    let arrowAwaitFeedback = (statusIndex < 2) ? 'downward' : 'upward';
        // <button class="close-task-options-menu" onclick="closeParentWrapper(event)" title="close menu">
        //     <img src="assets/icons/close-white.svg" alt="close-icon" class="close-icon light">
        // </button>
    return `
        <strong>Move to</strong>
        <ul class"ul-reset">  
            <li class="${hideTodo}"><button onclick="changeBoardTaskStatus(event, '${taskId}', '${boards[0].id}')"><img src="./assets/icons/arrow-upward.svg">${boards[0].label}</button></li>
            <li class="${hideInProgress}"><button onclick="changeBoardTaskStatus(event, '${taskId}', '${boards[1].id}')"><img src="./assets/icons/arrow-${arrowInProgress}.svg">${boards[1].label}</button></li>
            <li class="${hideAwaitFeedback}"><button onclick="changeBoardTaskStatus(event, '${taskId}', '${boards[2].id}')"><img src="./assets/icons/arrow-${arrowAwaitFeedback}.svg">${boards[2].label}</button></li>
            <li class="${hideDone}"><button onclick="changeBoardTaskStatus(event, '${taskId}', '${boards[3].id}')"><img src="./assets/icons/arrow-downward.svg">${boards[3].label}</button></li>
        </ul>  `
}


/**
 * Return html of the task details (within status board dialogue)
 * 
 * @param {object} task - a task object (of tasks)
 * @param {object} category - the category object (of categories) for the current task
 */
function getTaskDetailsTemplate(task, category) {
  let hideDescription = task.description == null ? 'hide': null;
  let hideContacts = !hasLength(task.contactIds) ? 'hide': null;
  let hideSubtasks = !hasLength(task.subtasks) ? 'hide': null;
  let dueDate = new Date(task.dueDate).toLocaleDateString('en-GB'); 
  let priority = setFirstLetterUpperCase(task.priority);
  return `
    <div class="task-details-wrapper flex-col">
        <div class="board-task-category" style="background-color: ${category.color};">${category.name}</div>
        <h3 class="board-task-title">${task.title}</h3>  
        <div class="board-task-description ${hideDescription}">${task.description}</div>
        <div class="board-task-meta flex align-center">
            <label>Due Date:</label>
            <div>${dueDate}</div>
        </div>
        <div class="board-task-meta board-task-priority flex">
            <label>Priority:</label>
            <div class="flex align-center">${priority}
                <img src="./assets/icons/prio-${task.priority}.svg" alt="${task.priority}-icon">
            </div>
        </div>
        <div class="board-task-meta board-task-assigned-to flex-col ${hideContacts}">
            <label>Assigned To:</label>
            <ul id="taskDetailsAssignedContactsWrapper" class="profile-batches task-board-detail-view hide-if-empty flex-col"></ul>
        </div>
        <div class="board-task-meta board-task-subtasks flex-col ${hideSubtasks}">
            <label>Subtasks</label>
            <ul id="taskDetailsSubtaskWrapper" class="task-board-detail-view hide-if-empty flex-col"></ul>
        </div>
    </div>
             
    <div class="option-buttons flex-row align-center justify-end mt-auto">
        <button onclick="openEditTaskForm(event, '${task.id}')" onmouseover="toggleIconColorOnHover(event)" onmouseleave="toggleIconColorOnHover(event)" class="option-button-edit">
            <img src="assets/icons/edit.svg" alt="edit-icon">Edit
        </button>
        <button onclick="submitDeleteTask(event, '${task.id}')" onmouseover="toggleIconColorOnHover(event)" onmouseleave="toggleIconColorOnHover(event)" class="option-button-delete">
            <img src="assets/icons/delete.svg" alt="delete-icon">Delete
        </button>
    </div>
  `;
}


/**
 * Return html of a assigned contacts for task details (within status board dialogue)
 * 
 * @param {object} contact - a contact object (of assigned contacts)
 */
function getTaskDetailsAssignedContactTemplate(contact) {
  return `
    <li class="flex-row gap align-center">
        <div class="profile-batch label-icon" style="--profile-color: ${contact.color};">${contact.initials}</div>
        ${contact.name}
    </li>
  `;
}


/**
 * Return html of a subtask for task details (within status board dialogue)
 * 
 * @param {object} task - current task object
 * @param {object} subtask - a subtask object (of the current task)
 * @param {number} subtaskIndex - index of the current subtask
 */
function getTaskDetailsSubtaskTemplate(task, subtask, subtaskIndex) {
  return `
    <li class="subtask-item flex-row align-center">
        <input type="checkbox" ${subtask.done ? 'checked' : ''} class="custom custom-checkbox clickable hide-focus" onclick="toggleSubtaskStatus(event, ${task.id}, ${subtaskIndex})">
        <img src="assets/icons/checkbox-checked.svg" alt="checkbox-checked" class="icon-checkbox-checked custom-checkbox-checked">
        <label>${subtask.title}</label>
    </li>
  `;
}


/**
 * Return html of the add/edit task forms (form inner content)
 * 
 * @param {object} task - a task object (of tasks) > currently not in use
 */
function getTaskFormFieldsTemplate(task) {
    let priorityFieldGroup = getPriorityFormFieldTemplate();
    let assignedContactsFieldGroup = getAssignedContactsFormFieldTemplate();
    let categoryFieldGroup = getCategoryFormFieldTemplate();
    let subtaskFieldGroup = getSubtaskFormFieldTemplate();

    return `
        <div class="field-group flex-col flex-grow">

            <div class="field-wrapper has-alert top-element">
                <label for="title" class="required top-element">Title</label>
                <input type="text" id="inputTitle" name="title" placeholder="Enter a title" required maxlength="128" onfocus="focusInHandler(event)" onfocusout="focusOutHandler(event)">
                <div role="alert" class="validation-alert">This field is required</div>
            </div>
            <div class="field-wrapper has-alert">
                <label for="description">Description</label>
                <textarea id="inputDescription" name="description" placeholder="Enter a description"></textarea>
            </div>
            <div class="field-wrapper has-alert">
                <label for="dueDate" class="required">Due date</label>
                <input type="date" id="inputDueDate" name="dueDate" required min="2000-01-01" max="2099-12-31" step="1" onfocus="focusInHandler(event)" onfocusout="focusOutHandler(event)" onkeyup="removePlaceholderStyle(event)" data-placeholder-style="true">
                <div role="alert" class="validation-alert">Please enter a valid date</div>
            </div>
        </div>

        <div class="field-group-divider"></div>

        <div class="field-group flex-col flex-grow gap">
            ${priorityFieldGroup}
            ${assignedContactsFieldGroup}
            ${categoryFieldGroup}
            ${subtaskFieldGroup}
        </div>       `
}


/**
 * Return html of the priority form field group (task form/s)
 */
function getPriorityFormFieldTemplate() {
    return `
        <div class="field-wrapper">
            <label for="priority">Priority</label>
            <div class="priority-input-wrapper flex-row justify-between align-center">
                <label for="inputPrioHigh" id="labelPrioHigh" class="prio-high button btn-icon btn-radio hide-child-input" value="high"><input type="radio" id="inputPrioHigh" name="priority" value="high" class="focus-strong"><span>Urgent</span><div id="iconPrioHigh" class="icon-wrapper"></div></label>

                <label for="inputPrioMedium" id="labelPrioMedium" class="prio-medium button btn-icon btn-radio hide-child-input" value="medium"><input type="radio" id="inputPrioMedium" name="priority" value="medium" checked class="focus-strong"><span>Medium</span><div id="iconPrioMedium" class="icon-wrapper"></div></label>

                <label for="inputPrioLow" id="labelPrioLow" class="prio-low button btn-icon btn-radio hide-child-input" value="low"><input type="radio" id="inputPrioLow" name="priority" value="low" class="focus-strong"><span>Low</span><div id="iconPrioLow" class="icon-wrapper"></div></label>
            </div>
        </div>
    `
}


/**
 * Return html of the assigned contacts form field group (task form/s)
 */
function getAssignedContactsFormFieldTemplate() {
    return `
        <div class="field-wrapper">
            <label for="selectContacts">Assigned to</label>
            <div class="select custom-select multiple select-contacts">
                <div class="input-wrapper custom-select">
                    <input type="text" role="combox" id="selectContacts" name="selectContacts" class="clickable" placeholder="Select contacts to assign" data-select-multiple="true" oninput="listenTaskFormContactsListboxSearch(event)" onfocusout="focusOutHandler(event)" onclick="dropdownEventHandler(event)">
                    <div class="input-icon-wrapper custom-select multiple">
                        <button onclick="event.preventDefault(), dropdownEventHandler(event)"><img src="/assets/icons/arrow-drop-down.svg" class="icon icon-dropdown"></button>
                    </div>
                </div>
                <ol  role="listbox" id="taskContactsListbox" class="select-options-wrapper multiple end"></ol>
            </div>
            <ul id="profileBatches" class="profile-batches hide-if-empty" style="margin-top: 12px;"></ul>
        </div>
    `
}


/**
 * Return html of the multiple select datalist for the assigned contacts form field (task form/s)
 * 
 * @param {object} contact - a contact object (of contacts)
 * @param {number} index - the listing index of the current contact
 */
function getContactListboxOptionTemplate(contact, index) {
    return `
    <li class="select-option" role="option" data-index="${index}" onclick="event.stopPropagation()">
        <label for="checkboxAssignedContact-${contact.id}" class="hide-focus" onkeydown="event.stopPropagation()">${contact.name}
            <div class="profile-batch label-icon" style="--profile-color: ${contact.color};">${contact.initials}</div>
            <div class="input-icon-wrapper custom-checkbox-wrapper">
                <input type="checkbox" class="custom-checkbox checkbox-end clickable" id="checkboxAssignedContact-${contact.id}" name="checkboxAssignedContact-${contact.id}" value="${contact.id}"  onchange="dropdownOptionClickHandlerMultiple(event, '${contact.id}')">
                <img src="assets/icons/checkbox-checked-white.svg" alt="checkbox-checked" class="icon-checkbox-checked custom-checkbox-checked">
            </div>
        </label>
    </li>
    `
}


/**
 * Return html of the category form field group (task form/s)
 */
function getCategoryFormFieldTemplate() {
    return `
        <div class="field-wrapper has-alert hide-on-edit-mode">
            <label for="categorySelect" class="required">Category</label>
            <div class="select custom-select">
                <div class="input-wrapper custom-select">
                    <input type="text" id="categorySelect" name="categorySelect" role="combox" placeholder="Select task category" class="clickable" data-validation-type="required" data-active-index="-1" readonly onfocus="focusInHandler(event)" onfocusout="focusOutHandler(event)" onclick="dropdownEventHandler(event)" onkeydown="dropdownEventHandler(event)"   >
                    <div class="input-icon-wrapper custom-select">
                        <button onclick="event.preventDefault(), dropdownEventHandler(event)">
                            <img src="/assets/icons/arrow-drop-down.svg" class="icon icon-dropdown">
                        </button>
                    </div>
                </div>
                <ol id="taskCategoryListbox" class="select-options-wrapper" role="listbox" xdata-combox-id="categorySelect"></ol>
            </div>
            <div role="alert" class="validation-alert">This field is required</div>
        </div>
    `
}


/**
 * Return html of the select datalist for the category form field group (task form/s)
 * 
 * @param {object} category - a category object (of categories)
 * @param {number} index - the listing index of the current category
 */
function getCategoryListboxOptionTemplate(category, index) {
    return `
    <li id="categoryOptionId-${category.id}" class="select-option" role="option" onclick="dropdownOptionClickHandler(event)" aria-selected="false" data-index="${index}" data-option-id="${category.id}">${category.name}
    </li>
    `
}


/**
 * Return html of the subtask form field group (task form/s)
 */
function getSubtaskFormFieldTemplate() {
    return `
        <div class="field-wrapper subtask-wrapper">
            <label for="subtasks">Subtasks</label>
            <div class="input-wrapper input-wrapper-subtasks">
                <!--<input type="text" id="inputSubtasks" name="subtasks" placeholder="Add new subtask"> -->
                <input type="text" id="inputSubtasks" name="subtasks" placeholder="Add new subtask" maxlength="128" onfocus="focusInHandler(event)" oninput="onInputAddSubtask(event)" onkeydown="addSubtaskInputEventHandler(event)">
                <div id="subtaskInputButtonAdd" class="input-icon-wrapper">
                    <button onclick="addSubtaskEventHandlerFocus(event)"><img src="/assets/icons/add.svg" class="icon-add"></button>
                </div>
                <div id="subtaskInputButtons" class="input-icon-wrapper hide">
                    <button onclick="clearSubtaskEventHandler(event)"><img src="/assets/icons/cancel.svg" class="icon-cancel"></button>
                    <div class="divider"></div>
                    <button onclick="addSubtaskEventHandler(event)"><img src="/assets/icons/check.svg" class="icon-check"></button>
                </div>
            </div>
            <ul id="assignedSubtasks" class="subtask-listing"></ul>
        </div>
    `
}


/**
 * Return html of the subtask listing for the subtask form field group (task form/s)
 * 
 * @param {object} subtask - current subtask object
 * @param {number} index - listing index of the current subtask
 * @param {string} taskId - current task id > currently not in use
 */
function getSubtasksTemplate(subtask, index, taskId) {
    return `
    <li class="input-wrapper input-wrapper-subtask read-only">
        <div class="list-bullet">&#x2022</div>
        <input type="text" id="subtask-i-${index}" class="subtask-input clickable" value="${subtask.title}" xonmouseover="subtaskOnHover(event, 1)" xonmouseleave="subtaskOnHover(event, 0)" oninput="onInputUpdateSubtask(event)" ondblclick="editSubtaskEventHandler(event)">
        <div class="input-icon-wrapper read-only">
            <button onclick="editSubtaskEventHandler(event)"><img src="/assets/icons/edit.svg" class="icon-edit"></button><div class="divider"></div>
            <button onclick="deleteSubtaskEventHandler(event, ${index})"><img src="/assets/icons/delete.svg" class="icon-delete"></button>
        </div>
        <div class="input-icon-wrapper edit">
            <button class="delete-subtask-button" onclick="deleteSubtaskEventHandler(event, ${index})"><img src="/assets/icons/delete.svg" class="icon-delete"></button>
            <div class="divider"></div>
            <button class="update-subtask-button" onclick="updateSubtaskEventHandler(event, ${index})"><img src="/assets/icons/check.svg" class="icon-check"></button>
        </div>
    </li>
    `
}



