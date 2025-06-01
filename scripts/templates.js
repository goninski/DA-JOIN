/**
 * Return html of the global header
 */
function getHeaderTemplate() {
    return `
        <div class="ct-container flex-row justify-between align-center">
            <div class="logo-link">
                <img src="./assets/img/logo-dark.svg" alt="join-logo" class="logo logo-small">
            </div>
            <p class="header-title">Kanban Project Management&nbsp;Tool</p>
            <a class="help-link" href="help.html"><img class="help-icon" src="./assets/icons/help.svg" alt="help-icon"></a>
            <nav class="header-nav flex-col pos-relative">
                <button id="headerNavTrigger" onclick="toggleHeaderNav(event)" class="profile-batch">G</button>
                <div id="headerNavDropdown" class="nav-links" onclick="event.stopPropagation()">
                    <a class="help-link-mobile" href="/help.html">Help</a>
                    <a href="/legal-notice.html">Legal Notice</a>
                    <a href="/privacy-policy.html">Privacy Policy</a>
                    <a href="/data-handling.html">Data Handling</a>
                    <a href="#" onclick="signOut(event)">Log out</a>
                </div> 
            </nav>
        </div>
    `
}


/**
 * Return html of the global navbar (sidbar / footerbar
 * 
 * @param {string} locationIdSuffix - 'mob' for mobile navbar
 */
function getNavBarTemplate() {
    return `
        <div href="/summary.html" class="nav-link-logo">
            <img src="./assets/img/logo-light.svg" alt="join-logo" class="logo logo-large">
        </div>
        <nav class="flex flex-grow"> 
            <div class="nav-links nav-links-main flex flex-grow">
                <a class="nav-link-login" href="/login.html" style>
                    <img src="./assets/icons/menu-login.svg">Log In
                </a>
                <a class="nav-link-app" href="/summary.html">
                    <img src="./assets/icons/menu-summary.svg">Summary
                </a>
                <a class="nav-link-app" href="/add-task.html">
                    <img src="./assets/icons/menu-add-task.svg">Add Task
                </a>
                <a class="nav-link-app" href="/board.html">
                    <img src="./assets/icons/menu-board.svg">Board
                </a>
                <a class="nav-link-app" href="/contacts.html">
                    <img src="./assets/icons/menu-contacts.svg">Contacts
                </a>
            </div>
            <div class="nav-links nav-links-terms flex">
                <a href="/privacy-policy.html">Privacy Policy</a>
                <a href="/legal-notice.html">Legal notice</a>
            </div>
        </nav>
    `
}


/**
 * Return html of a single status board
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
            <div id="boardTaskList-${board.id}" class="board-task-list" ondragover="onDragOver(event)" ondragleave="onDragLeave(event)" ondrop="taskDrop(event, '${board.id}')" onmousedown="horizontalBoardDragScroll(event)" onmouseup="horizontalBoardDragScroll(event)" onmouseleave="horizontalBoardDragScroll(event)" onmousemove="horizontalBoardDragScroll(event)">
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
 * Returns html of the add and edit task forms (form inner content)
 * 
 * @param {object} task - a task object (of tasks) > currently not in use
 */
function getTaskFormFieldsTemplate(task) {
    return `
    <div class="field-group flex-col flex-grow">

        <div class="field-wrapper has-alert">
            <label for="title" class="required">Title</label>
            <input type="text" id="inputTitle" name="title" placeholder="Enter a title" required maxlength="128" onfocus="focusInHandler(event)" onfocusout="focusOutHandler(event)">
            <div role="alert" class="validation-alert">This field is required</div>
        </div>
        <div class="field-wrapper has-alert">
            <label for="description">Description</label>
            <textarea id="inputDescription" name="description" placeholder="Enter a description"></textarea>
        </div>
        <div class="field-wrapper has-alert">
            <label for="dueDate" class="required">Due date</label>
            <input type="date" id="inputDueDate" name="dueDate" required min="2000-01-01" max="2099-12-31"  onfocus="focusInHandler(event), setTodayAsDateValue(event)" onfocusout="focusOutHandler(event)" onkeyup="removePlaceholderStyle(event)" data-placeholder-style="true">
            <div role="alert" class="validation-alert">Please enter a valid date</div>
        </div>
    </div>

    <div class="field-group-divider"></div>

    <div class="field-group flex-col flex-grow gap">

        <div class="field-wrapper">
            <label for="priority">Priority</label>
            <div class="priority-input-wrapper flex-row justify-between align-center">
                <label for="inputPrioHigh" id="labelPrioHigh" class="prio-high button btn-icon btn-radio hide-child-input" value="high"><input type="radio" id="inputPrioHigh" name="priority" value="high" class="focus-strong">Urgent<div id="iconPrioHigh" class="icon-wrapper"></div></label>

                <label for="inputPrioMedium" id="labelPrioMedium" class="prio-medium button btn-icon btn-radio hide-child-input" value="medium"><input type="radio" id="inputPrioMedium" name="priority" value="medium" checked class="focus-strong">Medium<div id="iconPrioMedium" class="icon-wrapper"></div></label>

                <label for="inputPrioLow" id="labelPrioLow" class="prio-low button btn-icon btn-radio hide-child-input" value="low"><input type="radio" id="inputPrioLow" name="priority" value="low" class="focus-strong">Low<div id="iconPrioLow" class="icon-wrapper"></div></label>
            </div>
        </div>

        <div class="field-wrapper">
            <label for="selectContacts">Assigned to</label>
            <div class="select custom-select multiple select-contacts">
                <div class="input-wrapper custom-select">
                    <input type="text" role="combox" id="selectContacts" name="selectContacts" class="clickable" placeholder="Select contacts to assign" data-select-multiple="true" oninput="filterTaskContactOptions(event)" onfocusout="focusOutHandler(event)" onclick="dropdownEventHandler(event)">
                    <div class="input-icon-wrapper custom-select multiple">
                        <button onclick="event.preventDefault(), dropdownEventHandler(event)"><img src="/assets/icons/arrow-drop-down.svg" class="icon icon-dropdown"></button>
                    </div>
                </div>
                <ol  role="listbox" id="taskContactsListbox" class="select-options-wrapper multiple right"></ol>
            </div>
            <ul id="profileBatches" class="profile-batches hide-if-empty" style="margin-top: 12px;"></ul>
        </div>

        <div class="field-wrapper has-alert hide-on-edit-mode">
            <label for="categorySelect" class="required">Category</label>
            <div class="select custom-select">
                <div class="input-wrapper custom-select">
                    <input type="text" id="categorySelect" name="categorySelect" role="combox" placeholder="Select task category" class="clickable" data-custom-validation="required" data-active-index="-1" readonly onfocus="focusInHandler(event)" onfocusout="focusOutHandler(event)" onclick="dropdownEventHandler(event)" onkeydown="dropdownEventHandler(event)"   >
                    <div class="input-icon-wrapper custom-select">
                        <div class="icon-wrapper flex">
                            <img src="/assets/icons/arrow-drop-down.svg" class="icon icon-dropdown">
                        </div>
                    </div>
                </div>
                <ol id="taskCategoriesSelectOptionsWrapper" class="select-options-wrapper" role="listbox" xdata-combox-id="categorySelect"></ol>
            </div>
            <div role="alert" class="validation-alert">This field is required</div>
        </div>

        <div class="field-wrapper subtask-wrapper">
            <label for="subtasks">Subtasks</label>
            <div class="input-wrapper input-wrapper-subtasks">
                <!--<input type="text" id="inputSubtasks" name="subtasks" placeholder="Add new subtask"> -->
                <input type="text" id="inputSubtasks" name="subtasks" placeholder="Add new subtask" maxlength="128" onfocus="focusInHandler(event)" oninput="onInputAddSubtask(event)" onkeydown="addSubtaskInputEventHandler(event)">
                <div id="subtaskInputButtonAdd" class="input-icon-wrapper">
                    <button class="xnot-clickable" tabindex="-1" onclick="addSubtaskEventHandlerPseudo(event)"><img src="/assets/icons/add.svg" class="icon-add"></button>
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
 * Return html of the multiple select datalist for the user/contact assignment in the task forms
 * 
 * @param {object} contact - a contact object (of contacts)
 * @param {number} index - the listing index of the current contact
 */
function getContactSelectOptionTemplate(contact, index) {
    return `
    <li class="select-option" role="option" data-index="${index}" onclick="event.stopPropagation()">
        <label for="checkboxAssignedContact-${contact.id}" class="hide-focus" onkeydown="event.stopPropagation()">${contact.name}
            <div class="profile-batch label-icon" style="--profile-color: ${contact.color};">${contact.initials}</div>
            <div class="input-icon-wrapper custom-checkbox">
                <input type="checkbox" class="custom custom-checkbox checkbox-end clickable" id="checkboxAssignedContact-${contact.id}" name="checkboxAssignedContact-${contact.id}" value="${contact.id}"  onchange="dropdownOptionClickHandlerMultiple(event, '${contact.id}')">
                <div class="checkbox-checked-wrapper">
                    <img src="assets/icons/checkbox-checked-white.svg" alt="checkbox-checked" class="icon-checkbox-checked">
                </div>
            </div>
        </label>
    </li>
    `
}


/**
 * Return html of the select datalist for the category assigment in the task forms
 * 
 * @param {object} category - a category object (of categories)
 * @param {number} index - the listing index of the current category
 */
function getCategorySelectOptionTemplate(category, index) {
    return `
    <li id="categoryOptionId-${category.id}" class="select-option" role="option" onclick="dropdownOptionClickHandler(event)" aria-selected="false" data-index="${index}" data-option-id="${category.id}">${category.name}
    </li>
    `
}


/**
 * Return html of the listed subtasks in the task forms
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


/**
 * Return html of the cancel and submit button in the add contact form
 */
function getAddContactSubmitButtonsTemplate() {
    return `
        <button id="btnReset" class="button btn-cancel btn-icon btn-secondary" onclick="resetContactsForm(event)">Cancel</button>
        <button type="submit" id="btnSubmit" class="button btn-check btn-icon btn-primary" disabled>Create Contact</button>
    `
}


/**
 * Return html of the delete and submit button in the edit contact form
 * 
 * @param {string} contactId - contact id of the contact to edit
 */
function getEditContactSubmitButtonsTemplate(contactId) {
    return `
        <button id="dialogueBtnDelete" class="button btn-delete btn-icon btn-secondary" onclick="submitDeleteContact(event, '${contactId}')">Delete</button>
        <button type="submit" id="btnSubmit" class="button btn-check btn-icon btn-primary" disabled>Save</button>
    `
}


/**
 * Return html of the contact list on the contact page
 * 
 * @param {string} groupName - group name (first name letter) of a contact group (grouped by first name letter)
 */
function getContactListTemplate(groupName) {
    return `
        <h3 class="contact-letter flex-row align-center"> &ensp;${groupName}</h3>
        <ol id="contactListGroup-${groupName}"></ol>
    `
}


/**
 * Return html of a single contact in the contact list
 * 
 * @param {object} contact - contact object (of contacts)
 */
function getContactListGroupTemplate(contact) {
    return `
        <li id="listContactId-${contact.id}" class="contact-item flex-row align-center" onclick="showContactDetail(event, '${contact.id}')">
            <div class="profile-batch" style="--profile-color: ${contact.color};">${contact.initials}</div>
            <div class="contact-details flex-col">
                <div class="name">${contact.name}</div>
                <div class="email">${contact.email}</div>
            </div>
        </li>
    `
}


/**
 * Return html of the contact name and profile batch (within the detail view of a selected contact via contact list)
 * 
 * @param {object} contact - current contact object
 */
function getContactDetailProfileBatchTemplate(contact) {
    let optionButtons = getContactOptionButtons(contact);
    return `
        <div class="profile-batch profile-batch-large" style="--profile-color: ${contact.color};">${contact.initials}</div>
        <div class="profile-title flex-col">
            <h2 class="">${contact.name}</h2>                        
            <div class="option-buttons flex-row align-center">
                ${optionButtons}
            </div>
        </div>
    `
}


                // <button onclick="openEditContactForm(event, '${contact.id}')" onmouseover="toggleIconColorOnHover(event)" onmouseleave="toggleIconColorOnHover(event)" class="option-button-edit">
                //     <img src="assets/icons/edit.svg" alt="edit-icon">Edit
                // </button>
                // <button onclick="submitDeleteContact(event, '${contact.id}')" onmouseover="toggleIconColorOnHover(event)" onmouseleave="toggleIconColorOnHover(event)" class="option-button-delete">
                //     <img src="assets/icons/delete.svg" alt="delete-icon">Delete
                // </button>



/**
 * Return html of the contact option buttons (within detail view of a selected contact)
 * 
 * @param {object} contact - current contact object
 */
function getContactOptionButtons(contact) {
    return `
        <button onclick="openEditContactForm(event, '${contact.id}')" onmouseover="toggleIconColorOnHover(event)" onmouseleave="toggleIconColorOnHover(event)" class="option-button-edit" title="Edit current contact">
            <img src="assets/icons/edit.svg" alt="edit-icon">Edit
        </button>
        <button onclick="submitDeleteContact(event, '${contact.id}')" onmouseover="toggleIconColorOnHover(event)" onmouseleave="toggleIconColorOnHover(event)" class="option-button-delete" title="Delete current contact">
            <img src="assets/icons/delete.svg" alt="delete-icon">Delete
        </button>
    `
}


/**
 * Return html of further contact informations (within the detail view of a selected contact via contact list)
 * 
 * @param {object} contact - current contact object
 */
function getContactDetailInfoTemplate(contact) {
    let hidePhone = hasLength(contact.phone) ? '' : 'hide';
    return `
        <h3 class="fs-lg fw-regular flex-col justifiy-center">Contact Information</h3>                        
        <div class="contact-property flex-col">
            <div class="label" >Email</div>
            <a href="mailto:${contact.email}" class="email">${contact.email}</a>
        </div>
        <div class="contact-property flex-col ${hidePhone}">
            <div class="label">Phone</div>
            <div class="phone">${contact.phone}</div>
        </div>
    `
}


/**
 * Return html of a single contact profile batch (for multiple usage)
 * 
 * @param {object} contact - current contact object
 */
function getContactProfileBatchTemplate(contact) {
    return `
        <li class="profile-batch" style="--profile-color: ${contact.color};">${contact.initials}</li>
    `
}


/**
 * Return html of a floating text confirmation popup (for multiple usage)
 * 
 * @param {string} msg - message
 */
function getFloatingMessageTextTemplate(msg) {
    return `${msg}`
}


/**
 * Return html of the floating added task confirmation popup
 */
function getFloatingMessageTaskAddedTemplate() {
    return `
    Task added to board
    <img src="assets/icons/board-white.svg" alt="board-icon" class="icon-board">
    `
}


/**
 * Return html of a svg plus icon (for multiple usage, mainly for buttons)
 * (the color contains a css variable for flexible styling)
 * 
 * @param {string} label - optional label before the icon
 */
function getIconTemplatePlus(label = "") {
    return `
        ${label}
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.6665" y="1.5" width="22" height="22" rx="7" stroke="var(--icon-color)" stroke-width="2"/>
        <path d="M12.6665 8.5V16.5" stroke="var(--icon-color)" stroke-width="2" stroke-linecap="round"/>
        <path d="M16.6665 12.5754L8.6665 12.5754" stroke="var(--icon-color)" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `
}


/**
 * Return html of a svg close icon (for multiple usage, mainly for buttons)
 * (the color contains a css variable for flexible styling)
 * 
 * @param {string} label - optional label before the icon
 */
function getIconTemplateClose(label = "") {
    return `
        ${label}
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.24959 6.99984L11.4926 12.2428M1.00659 12.2428L6.24959 6.99984L1.00659 12.2428ZM11.4926 1.75684L6.24859 6.99984L11.4926 1.75684ZM6.24859 6.99984L1.00659 1.75684L6.24859 6.99984Z" stroke="var(--icon-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `
}


/**
 * Return html of a svg cancel icon (for multiple usage, mainly for buttons)
 * (the color contains a css variable for flexible styling)
 * 
 * @param {string} label - optional label before the icon
 */
function getIconTemplateCancel(label = "") {
    return `
        ${label}
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.24959 6.99984L11.4926 12.2428M1.00659 12.2428L6.24959 6.99984L1.00659 12.2428ZM11.4926 1.75684L6.24859 6.99984L11.4926 1.75684ZM6.24859 6.99984L1.00659 1.75684L6.24859 6.99984Z" stroke="var(--icon-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `
}


/**
 * Return html of a svg check icon (for multiple usage, mainly for buttons)
 * (the color contains a css variable for flexible styling)
 * 
 * @param {string} label - optional label before the icon
 */
function getIconTemplateCheck(label = "") {
    return `
        ${label}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.61905 9.15L14.0941 0.675C14.2941 0.475 14.5316 0.375 14.8066 0.375C15.0816 0.375 15.3191 0.475 15.5191 0.675C15.7191 0.875 15.8191 1.1125 15.8191 1.3875C15.8191 1.6625 15.7191 1.9 15.5191 2.1L6.31905 11.3C6.11905 11.5 5.88572 11.6 5.61905 11.6C5.35239 11.6 5.11905 11.5 4.91905 11.3L0.619055 7C0.419055 6.8 0.323221 6.5625 0.331555 6.2875C0.339888 6.0125 0.444055 5.775 0.644055 5.575C0.844055 5.375 1.08155 5.275 1.35655 5.275C1.63155 5.275 1.86905 5.375 2.06905 5.575L5.61905 9.15Z" fill="var(--icon-color)"/>
        </svg>
    `
}


/**
 * Return html of a svg high priority icon (for multiple usage, mainly for buttons)
 * (the color contains a css variable for flexible styling)
 * 
 * @param {string} label - optional label before the icon
 */
function getIconTemplatePrioHigh(label = "") {
    return `
        ${label}
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z" fill="var(--icon-color)"/>
        <path d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z" fill="var(--icon-color)"/>
        </svg>
    `
}


/**
 * Return html of a svg medium priority icon (for multiple usage, mainly for buttons)
 * (the color contains a css variable for flexible styling)
 * 
 * @param {string} label - optional label before the icon
 */
function getIconTemplatePrioMedium(label = "") {
    return `
        ${label}
        <svg width="21" height="8" viewBox="0 0 21 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.1526 7.72528H1.34443C1.05378 7.72528 0.775033 7.60898 0.569514 7.40197C0.363995 7.19495 0.248535 6.91419 0.248535 6.62143C0.248535 6.32867 0.363995 6.0479 0.569514 5.84089C0.775033 5.63388 1.05378 5.51758 1.34443 5.51758H19.1526C19.4433 5.51758 19.722 5.63388 19.9276 5.84089C20.1331 6.0479 20.2485 6.32867 20.2485 6.62143C20.2485 6.91419 20.1331 7.19495 19.9276 7.40197C19.722 7.60898 19.4433 7.72528 19.1526 7.72528Z" fill="var(--icon-color)"/>
        <path d="M19.1526 2.48211H1.34443C1.05378 2.48211 0.775033 2.36581 0.569514 2.1588C0.363995 1.95179 0.248535 1.67102 0.248535 1.37826C0.248535 1.0855 0.363995 0.804736 0.569514 0.597724C0.775033 0.390712 1.05378 0.274414 1.34443 0.274414L19.1526 0.274414C19.4433 0.274414 19.722 0.390712 19.9276 0.597724C20.1331 0.804736 20.2485 1.0855 20.2485 1.37826C20.2485 1.67102 20.1331 1.95179 19.9276 2.1588C19.722 2.36581 19.4433 2.48211 19.1526 2.48211Z" fill="var(--icon-color)"/>
        </svg>
    `
}


/**
 * Return html of a svg low priority icon (for multiple usage, mainly for buttons)
 * (the color contains a css variable for flexible styling)
 * 
 * @param {string} label - optional label before the icon
 */
function getIconTemplatePrioLow(label = "") {
    return `
        ${label}
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z" fill="var(--icon-color)"/>
        <path d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z" fill="var(--icon-color)"/>
        </svg>
    `
}