let currentTask = {};
let taskContacts = [];
let assignedContacts = [];
let assignedSubtasks = [];

async function initAddTask() {
    getMainTemplates();
    await getContacts();
    await checkAuth();
    await getTaskData();
    await openAddTaskForm(event, 'add-task-page');
}

function openAddTaskPage() {
    window.location.href = "/add-task.html";
}

async function openAddTaskForm(event = null, source = 'board') {
    event ? event.stopPropagation() : null;
    formMode = 'add';
    currentTask = {};
    await showTaskDialogue('addTaskFormWrapper', source);
    await renderTaskForm('addTaskFieldGroups');
    if( source == 'add-task-page') {
        return;
    } else {
        document.getElementById('taskDialogue').classList.add('add-task');
        // document.getElementById('taskDialogue').classList.add('form-scrollable');
    }
}

async function showTaskBtn(event, taskId) {
    event ? event.stopPropagation() : null;
    formMode = 'show';
    let index = await getTaskIndexFromId(taskId);
    currentTask = tasks[index];
    console.log(currentTask);
    await showTaskDialogue('taskDetailsWrapper');
    document.getElementById('taskDetailsWrapper').innerHTML = getTaskDetailsWrapperTemplate(currentTask);
    document.getElementById('taskDialogue').classList.add('show-task');
}

async function openEditTaskForm(event, taskId) {
    event.stopPropagation();
    formMode = 'edit';
    let index = await getTaskIndexFromId(taskId);
    currentTask = tasks[index];
    console.log(currentTask);
    await showTaskDialogue('editTaskFormWrapper');
    await renderTaskForm('editTaskFieldGroups', currentTask);
    document.getElementById('taskDialogue').classList.add('edit-task');
    // document.getElementById('taskDialogue').classList.add('form-scrollable');
    // setEditTaskValues(task);
}

async function showTaskDialogue(elementId, source = 'board') {
    if(source == 'board') {
        document.getElementById('addTaskFieldGroups').innerHTML = '';
        document.getElementById('editTaskFieldGroups').innerHTML = '';
        document.getElementById('taskDetailsWrapper').style = 'display: none;';
        document.getElementById('addTaskFormWrapper').style = 'display: none;';
        document.getElementById('editTaskFormWrapper').style = 'display: none;';
        document.getElementById(elementId).style = '';
        let dialogue = document.getElementById('taskDialogue');
        dialogue.classList.remove('show-task');
        dialogue.classList.remove('add-task');
        dialogue.classList.remove('edit-task');
        // dialogue.classList.remove('form-scrollable');
        await runSlideInAnimation(dialogue);
        // dialogue.classList.remove('slide-out');
        // dialogue.classList.add('slide-in');
        // dialogue.style = '';
    }
}

async function renderTaskForm(fieldsWrapperId, currentTask = null) {
    // console.log(task);
    assignedContacts = [];
    assignedSubtasks = [];
    let formId;
    document.getElementById(fieldsWrapperId).innerHTML = getTaskFormFieldsTemplate(currentTask);
    document.getElementById('iconPrioHigh').innerHTML = getIconTemplatePrioHigh();
    document.getElementById('iconPrioMedium').innerHTML = getIconTemplatePrioMedium();
    document.getElementById('iconPrioLow').innerHTML = getIconTemplatePrioLow();
    if(formMode == 'add') {
        document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Clear');
        document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create Task');
        await renderContactSelectOptions();
        formId = 'addTaskForm';
    } else {
        document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Ok');
        formId = 'editTaskForm';
    }
    await resetForm(formId);
    // console.log(contacts);
    await renderCategorySelectOptions(event);
    await setEditTaskValues(currentTask, formId);
    await checkEditFormState(formId);
}

async function setEditTaskValues(currentTask, formId) {
    if(formMode == 'edit') {
        document.getElementById('inputTitle').value = currentTask.title;
        currentTask.description ? document.getElementById('inputDescription').value = currentTask.description : '';
        document.getElementById('inputDueDate').value = currentTask.dueDate;
        if(currentTask.priority) {
            let priority =  setFirstLetterUpperCase(currentTask.priority);
            document.getElementById('inputPrio' + priority).checked = true;
        }
        assignedContacts = currentTask.contactIds ? currentTask.contactIds : [];
        await renderContactSelectOptions();
        await renderContactProfileBatches(assignedContacts);
        if(currentTask.categoryId) {
            let index = await getCategoryIndexFromId(currentTask.categoryId);
            let categoryName = categories[index].name;
            document.getElementById('categorySelect').value = categoryName;
            document.getElementById('categorySelect').dataset.optionId = currentTask.categoryId;
            document.getElementById('categorySelect').classList.remove("clickable");
            document.getElementById('categorySelect').setAttribute("disabled", '');
            document.getElementById('categoryOptionId-' + currentTask.categoryId).setAttribute('aria-selected', 'true');
        }
        assignedSubtasks = currentTask.subtasks ? currentTask.subtasks : [];
        renderSubtasks(assignedSubtasks);
    }
}

async function filterTaskContactOptions(event) {
    event.stopPropagation()
    let searchVal = document.getElementById('selectContacts').value;
    console.log(searchVal);
    await renderContactSelectOptions('taskContactsListbox', searchVal);
}

async function renderContactSelectOptions(listboxId = 'taskContactsListbox', searchVal = '') {
    let listbox = document.getElementById(listboxId);
    let combox = document.getElementById('selectContacts');
    listbox.innerHTML = '';
    // console.log(contacts);
    taskContacts = await Object.create(contacts);
    taskContacts = await sortContacts(taskContacts);
    // console.log(contacts);
    // console.log(taskContacts);
    if(searchVal === ' ') {
        combox.value = '';
        toggleDropdown(listbox);        
    } else if(searchVal.length === 1) {
        closeDropdown(listbox);
        return;
    }
    if(searchVal && searchVal.length >= 2) {
        openDropdown(listbox);
        taskContacts = await taskContacts.filter(contact => contact.name.toLowerCase().includes(searchVal));
    }
    // console.log(taskContacts);
    for (let index = 0; index < taskContacts.length; index++) {
        listbox.innerHTML += getContactSelectOptionTemplate(taskContacts[index], index);
        if(assignedContacts && assignedContacts.length > 0) {
            let isChecked = assignedContacts.includes(taskContacts[index].id);
            setTimeout(function() {
                document.getElementById('checkboxAssignedContact-' + taskContacts[index].id).checked = isChecked;
            }, 1);
        }
    }
}

async function renderContactProfileBatches(contactIds = [], elementId = 'profileBatches') {
    let element = document.getElementById(elementId);
    element.innerHTML = '';
    for (let index = 0; index < contactIds.length; index++) {
        let contactIndex = await getContactIndexFromId(contactIds[index]);
        if(contactIndex >= 0) {
            element.innerHTML += getContactProfileBatchTemplate(contacts[contactIndex]);
        }
    }
}

async function renderCategorySelectOptions(event = null, wrapperId = 'taskCategoriesSelectOptionsWrapper') {
    if(event) {event.stopPropagation();}
    let optionsWrapper = document.getElementById(wrapperId);
    optionsWrapper.innerHTML = '';
    categories = await sortCategories(categories);
    // let assignedCategory = 0;
    for (let index = 0; index < categories.length; index++) {
        optionsWrapper.innerHTML += getCategorySelectOptionTemplate(categories[index], index);
    }
}

async function submitCreateTask(event) {
    event.stopPropagation();
    event.preventDefault();
    let formInputs = await getFormInputObj('addTaskForm');
    await setTaskProperties(currentTask, formInputs);
    await createTask(currentTask);
    // resetAddTaskForm(event);
    await showFloatingMessage('addedTask');
    setTimeout(function() {location.href = "/board.html";}, 1500);
}

async function submitUpdateTask(event) {
    event.stopPropagation();
    event.preventDefault();
    let formInputs = await getFormInputObj('editTaskForm');
    await setTaskProperties(currentTask, formInputs);
    await updateTask(currentTask);
    await showFloatingMessage('text', 'Task successfully edited');
    setTimeout(function() {closeTaskDialogue(event)}, 500);
}

async function setTaskProperties(currentTask, formInputs ) {
    if(hasLength(formInputs.title)) {
        currentTask.title = formInputs.title;
        currentTask.description = formInputs.description;
        currentTask.dueDate = formInputs.dueDate;
        currentTask.priority = formInputs.priority;
        currentTask.categoryId = document.getElementById('categorySelect').dataset.optionId;
        currentTask.contactIds = assignedContacts;
        currentTask.subtasks = assignedSubtasks;
    } else {
        console.log('error: no form inputs !');
    }
}

async function submitDeleteTask(event, taskId) {
    event.stopPropagation();
    await deleteTask(taskId);
    // let index = getTaskIndexFromId(taskId);
    // index >= 0 ? tasks.splice(index, 1) : null;
    currentTask = {};
    await showFloatingMessage('text', 'Task deleted');
    // console.log(currentPage);
    currentPage == '/board.html' ? await renderBoards() : null; // does not work !?
    setTimeout(function() {closeTaskDialogue(event)}, 500);
}

async function resetAddTaskForm(event) {
    event.stopPropagation();
    let formId = 'addTaskForm';
    currentTask = {};
    assignedContacts = [];
    assignedSubtasks = [];
    resetForm(formId);
    // setInitialFormState(formId, 'inputTitle', 'add');
    await renderContactSelectOptions();    
    await renderContactProfileBatches();    
    await renderCategorySelectOptions();    
    event.preventDefault();
}

async function closeTaskDialogue(event) {
    event.stopPropagation();
    (formMode == 'add' || formMode == 'edit') ? resetAddTaskForm(event) : null;
    formMode = '';
    let dialogue = document.getElementById('taskDialogue');
    await runSlideOutAnimation(dialogue, 200);
    await renderBoards();
}


