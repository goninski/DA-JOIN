let currentTask = {};
// let activeTaskId = '';
let taskContacts = [];
let assignedContacts = [];
let assignedSubtasks = [];


async function initAddTask() {
    getMainTemplates();
    await getAllData();
    await addTask(event, 'add-task-page');
}

function openAddTaskPage() {
    window.location.href = "/add-task.html";
}

async function addTask(event = null, source = 'board') {
    event ? event.stopPropagation() : null;
    formMode = 'add';
    currentTask = {};
    // activeTaskId = '';
    await showTaskDialogue('addTaskFormWrapper', source);
    await renderTaskForm('addTaskFieldGroups');
    if( source == 'add-task-page') {
        return;
    } else {
        document.getElementById('taskDialogue').classList.add('add-task');
        // document.getElementById('taskDialogue').classList.add('form-scrollable');
    }
}

async function showTask(event, taskId) {
    event ? event.stopPropagation() : null;
    formMode = 'show';
    // taskId == '' ? taskId = activeTaskId : null;
    // console.log(tasks);
    let index = await getTaskIndexFromId(taskId);
    currentTask = tasks[index];
    console.log(currentTask);
    await showTaskDialogue('taskDetailsWrapper');
    document.getElementById('taskDetailsWrapper').innerHTML = getTaskDetailsWrapperTemplate(currentTask);
    document.getElementById('taskDialogue').classList.add('show-task');
}

async function editTask(event, taskId) {
    event.stopPropagation();
    formMode = 'edit';
    // taskId == '' ? taskId = activeTaskId : activeTaskId = taskId;
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
        document.getElementById('taskDialogue').classList.remove('show-task');
        document.getElementById('taskDialogue').classList.remove('add-task');
        document.getElementById('taskDialogue').classList.remove('edit-task');
        // document.getElementById('taskDialogue').classList.remove('form-scrollable');
        document.getElementById('taskDialogue').style = '';
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
    console.log('createTask');
    event.stopPropagation();
    let taskInputs = getFormInputObj(event, 'addTaskForm');
    await setTaskProperties(currentTask, taskInputs);
    await createTask(currentTask);
    // resetAddTaskForm(event);
    await showFloatingMessage('addedTask');
    setTimeout(function() {location.href = "/board.html";}, 1500);
}

async function submitUpdateTask(event) {
    event.stopPropagation();
    let taskInputs = getFormInputObj(event, 'editTaskForm');
    await setTaskProperties(currentTask, taskInputs);
    await updateTask(currentTask);
    await showFloatingMessage('text', 'Task successfully edited');
    setTimeout(function() {closeTaskDialogue(event)}, 1000);
}

async function setTaskProperties(currentTask, taskInputs ) {
    if(hasLength(taskInputs.title)) {
        currentTask.title = taskInputs.title;
        currentTask.description = taskInputs.description;
        currentTask.dueDate = taskInputs.dueDate;
        currentTask.priority = taskInputs.priority;
        currentTask.categoryId = document.getElementById('categorySelect').dataset.optionId;
        currentTask.contactIds = assignedContacts;
        currentTask.subtasks = assignedSubtasks;
    }
    console.log(currentTask);
    console.log(tasks);
}

async function submitDeleteTask(event, taskId) {
    event.stopPropagation();
    let index = getTaskIndexFromId(taskId);
    await deleteTask(taskId);
    index >= 0 ? tasks.splice(index, 1) : null;
    currentTask = {};
    await showFloatingMessage('text', 'Task deleted');
    // console.log(currentPage);
    currentPage == '/board.html' ? await renderBoards() : null; // does not work !?
    setTimeout(function() {closeTaskDialogue(event)}, 1000);
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

function closeTaskDialogue(event) {
    event.stopPropagation();
    (formMode == 'add' || formMode == 'edit') ? resetAddTaskForm(event) : null;
    document.getElementById('taskDialogue').style = 'display: none';
    renderBoards();
    formMode = '';
}












// async function renderSubtasks(wrapperId = 'assignedSubtasks') {
//     let element = document.getElementById(wrapperId);
//     element.innerHTML = '';
//     if(assignedSubtasks && assignedSubtasks.length > 0) {
//         for (let index = 0; index < assignedSubtasks.length; index++) {
//             element.innerHTML += getSubtasksTemplate(assignedSubtasks[index], index, activeTaskId);
//         }
//         for (let index = 0; index < assignedSubtasks.length; index++) {
//             let listItem = document.getElementById('subtask-i-' + index);
//             listItem.readOnly = true;
//             let wrapper = listItem.parentElement;
//             wrapper.classList.remove('edit-mode');
//         }
//     }
//     // console.log(assignedSubtasks);
// }





// // SUBTASK HANDLING

// function subtaskEventAllowed(event) {
//     return (['Enter', ' '].includes(event.key) || event.type === 'click');
// }

// function getCurrentSubtaskInputFromEvent(event) {
//     let wrapper = getClosestParentElementFromEvent(event, '.input-wrapper-subtask');
//     console.log(wrapper);
//     return wrapper.querySelector('input');
// }

// function getCurrentSubtaskInputWrapper(element) {
//     return getClosestParentElementFromElement(element, '.input-wrapper-subtask')
// }

// function getCurrentInputWrapper(element) {
//     return getClosestParentElementFromElement(element, '.input-wrapper')
// }

// function validateSubtaskInput(input) {
//     return (input.value.length > 0 && input.value.length <= 128);
// }

// function onInputAddSubtask(event) {
//     event.stopPropagation();
//     let input = event.currentTarget;
//     if(validateSubtaskInput(input)) {
//         document.getElementById('subtaskInputButtonAdd').classList.add('hide');
//         document.getElementById('subtaskInputButtons').classList.remove('hide');
//     } else {
//         document.getElementById('subtaskInputButtonAdd').classList.remove('hide');
//         document.getElementById('subtaskInputButtons').classList.add('hide');
//     }
// }

// function onInputUpdateSubtask(event) {
//     event.stopPropagation();
//     console.log(event.currentTarget);
//     console.log(event.target);
//     let input = event.currentTarget;
//     let wrapper = getCurrentSubtaskInputWrapper(input);
//     let updateBtn = wrapper.querySelector('.update-subtask-button');
//     console.log(updateBtn);
//     if(validateSubtaskInput(input)) {
//         wrapper.classList.remove('invalid');
//         updateBtn.tabIndex = 0;
//     } else {
//         wrapper.classList.add('invalid');
//         updateBtn.tabIndex = 1;
//     }
// }

// function addSubtaskEventHandlerPseudo(event) {
//     event.stopPropagation();
//     subtaskEventAllowed ? event.preventDefault() : null;
// }

// function addSubtaskInputEventHandler(event) {
//     event.stopPropagation();
//     let input = event.currentTarget;
//     if(['Enter'].includes(event.key)) {
//         event.preventDefault();
//         validateSubtaskInput(input) ? addSubtask(input) : null;
//     };
// }

// function addSubtaskEventHandler(event) {
//     event.stopPropagation();
//     if(subtaskEventAllowed) {
//         event.preventDefault();
//         getCurrentFieldElements(event.target);
//         let input = currentFieldElements.input;
//         // console.log(currentFieldElements);
//         addSubtask(input);
//     }
// }

// async function addSubtask(element) {
//     console.log(element.value);
//     let subtask = {};
//     subtask.title = element.value;
//     subtask.done = false;
//     console.log(subtask);
//     !assignedSubtasks ? assignedSubtasks = [] : null;
//     console.log(assignedSubtasks);
//     assignedSubtasks.push(subtask)
//     await renderSubtasks();
//     clearSubtaskInput(element);
// }

// function clearSubtaskEventHandler(event) {
//     event.stopPropagation();
//     // console.log('f) clearSubtaskEventHandler');
//     if(subtaskEventAllowed) {
//         event.preventDefault();
//         getCurrentFieldElements(event.target);
//         clearSubtaskInput(currentFieldElements.input);
//     }
// }

// function clearSubtaskInput(element) {
//     element.value = '';
//     document.getElementById('subtaskInputButtonAdd').classList.remove('hide');
//     document.getElementById('subtaskInputButtons').classList.add('hide');
//     element.focus();
// }

// function editSubtaskEventHandler(event) {
//     event.stopPropagation();
//     // console.log('f) editSubtaskEventHandler');
//     if(subtaskEventAllowed) {
//         event.preventDefault();
//         let input = getCurrentSubtaskInputFromEvent(event);
//         let wrapper = getCurrentSubtaskInputWrapper(input);
//         wrapper.classList.add('edit');
//         wrapper.classList.remove('read-only');
//         input.readOnly = false;
//         input.focus();
//     }
// }

// function updateSubtaskEventHandler(event, index) {
//     event.stopPropagation();
//     // console.log('f) updateSubtaskEventHandler');
//     if(subtaskEventAllowed) {
//         event.preventDefault();
//         let input = getCurrentSubtaskInputFromEvent(event);
//         let wrapper = getCurrentSubtaskInputWrapper(input);
//         assignedSubtasks[index].title = input.value;
//         // console.log(assignedSubtasks);
//         wrapper.classList.remove('edit');
//         wrapper.classList.add('read-only');
//         input.readOnly = true;
//         renderSubtasks();
//     }
// }

// function deleteSubtaskEventHandler(event, index) {
//     event.stopPropagation();
//     // console.log('f) deleteSubtaskEventHandler');
//     if(subtaskEventAllowed) {
//         event.preventDefault();
//         deleteSubtask(index);
//     }
// }

// function deleteSubtask(index) {
//     assignedSubtasks.splice(index, 1);
//     console.log(assignedSubtasks);
//     renderSubtasks();
// }



