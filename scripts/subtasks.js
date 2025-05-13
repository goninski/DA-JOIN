
async function renderSubtasks(assignedSubtasks, wrapperId = 'assignedSubtasks') {
    let element = document.getElementById(wrapperId);
    element.innerHTML = '';
    if(hasLength(assignedSubtasks)) {
        for (let index = 0; index < assignedSubtasks.length; index++) {
            element.innerHTML += getSubtasksTemplate(assignedSubtasks[index], index, currentTask.id);
        }
        for (let index = 0; index < assignedSubtasks.length; index++) {
            let listItem = document.getElementById('subtask-i-' + index);
            listItem.readOnly = true;
            let wrapper = listItem.parentElement;
            wrapper.classList.remove('edit-mode');
        }
    }
}

function subtaskEventAllowed(event) {
    return (['Enter', ' '].includes(event.key) || event.type === 'click');
}

function getCurrentSubtaskInputFromEvent(event) {
    let wrapper = getClosestParentElementFromEvent(event, '.input-wrapper-subtask');
    // console.log(wrapper);
    return wrapper.querySelector('input');
}

function getCurrentSubtaskInputWrapper(element) {
    return getClosestParentElementFromElement(element, '.input-wrapper-subtask')
}

function getCurrentInputWrapper(element) {
    return getClosestParentElementFromElement(element, '.input-wrapper')
}

function validateSubtaskInput(input) {
    return (input.value.length > 0 && input.value.length <= 128);
}

function onInputAddSubtask(event) {
    event.stopPropagation();
    let input = event.currentTarget;
    if(validateSubtaskInput(input)) {
        document.getElementById('subtaskInputButtonAdd').classList.add('hide');
        document.getElementById('subtaskInputButtons').classList.remove('hide');
    } else {
        document.getElementById('subtaskInputButtonAdd').classList.remove('hide');
        document.getElementById('subtaskInputButtons').classList.add('hide');
    }
}

function onInputUpdateSubtask(event) {
    event.stopPropagation();
    // console.log(event.currentTarget);
    // console.log(event.target);
    let input = event.currentTarget;
    let wrapper = getCurrentSubtaskInputWrapper(input);
    let updateBtn = wrapper.querySelector('.update-subtask-button');
    // console.log(updateBtn);
    if(validateSubtaskInput(input)) {
        wrapper.classList.remove('invalid');
        updateBtn.tabIndex = 0;
    } else {
        wrapper.classList.add('invalid');
        updateBtn.tabIndex = 1;
    }
}

function addSubtaskEventHandlerPseudo(event) {
    event.stopPropagation();
    subtaskEventAllowed ? event.preventDefault() : null;
}

function addSubtaskInputEventHandler(event) {
    event.stopPropagation();
    let input = event.currentTarget;
    if(['Enter'].includes(event.key)) {
        event.preventDefault();
        validateSubtaskInput(input) ? addSubtask(input) : null;
    };
}

function addSubtaskEventHandler(event) {
    event.stopPropagation();
    if(subtaskEventAllowed) {
        event.preventDefault();
        getCurrentFieldElements(event.target);
        let input = currentFieldElements.input;
        // console.log(currentFieldElements);
        addSubtask(input);
    }
}

async function addSubtask(element) {
    // console.log(element.value);
    let subtask = {};
    subtask.title = element.value;
    subtask.done = false;
    // console.log(subtask);
    !assignedSubtasks ? assignedSubtasks = [] : null;
    // console.log(assignedSubtasks);
    assignedSubtasks.push(subtask)
    await renderSubtasks(assignedSubtasks);
    clearSubtaskInput(element);
}

function clearSubtaskEventHandler(event) {
    event.stopPropagation();
    // console.log('f) clearSubtaskEventHandler');
    if(subtaskEventAllowed) {
        event.preventDefault();
        getCurrentFieldElements(event.target);
        clearSubtaskInput(currentFieldElements.input);
    }
}

function clearSubtaskInput(element) {
    element.value = '';
    document.getElementById('subtaskInputButtonAdd').classList.remove('hide');
    document.getElementById('subtaskInputButtons').classList.add('hide');
    element.focus();
}

function editSubtaskEventHandler(event) {
    event.stopPropagation();
    // console.log('f) editSubtaskEventHandler');
    if(subtaskEventAllowed) {
        event.preventDefault();
        let input = getCurrentSubtaskInputFromEvent(event);
        let wrapper = getCurrentSubtaskInputWrapper(input);
        wrapper.classList.add('edit');
        wrapper.classList.remove('read-only');
        input.readOnly = false;
        input.focus();
    }
}

function updateSubtaskEventHandler(event, index) {
    event.stopPropagation();
    // console.log('f) updateSubtaskEventHandler');
    if(subtaskEventAllowed) {
        event.preventDefault();
        let input = getCurrentSubtaskInputFromEvent(event);
        let wrapper = getCurrentSubtaskInputWrapper(input);
        assignedSubtasks[index].title = input.value;
        // console.log(assignedSubtasks);
        wrapper.classList.remove('edit');
        wrapper.classList.add('read-only');
        input.readOnly = true;
        renderSubtasks(assignedSubtasks);
    }
}

function deleteSubtaskEventHandler(event, index) {
    event.stopPropagation();
    // console.log('f) deleteSubtaskEventHandler');
    if(subtaskEventAllowed) {
        event.preventDefault();
        deleteSubtask(index);
    }
}

function deleteSubtask(index) {
    assignedSubtasks.splice(index, 1);
    // console.log(assignedSubtasks);
    renderSubtasks(assignedSubtasks);
}

async function changeTaskStatus(event = null, taskId, statusNew, statusOld = null) {
    event ? event.stopPropagation() : null;
    await updateTaskProperty(taskId, 'status', statusNew);
    // renderBoard(statusNew);
    // statusOld ? renderBoard(statusOld) : null;
}

async function toggleSubtaskStatus(event = null, taskId, subtaskIndex) {
    event ? event.stopPropagation() : null;
    let index = await getTaskIndexFromId(taskId);
    let status = tasks[index].subtasks[subtaskIndex].done;
    await updateSubtaskStatus(taskId, subtaskIndex, !status);
}

async function getSubtaskProgress(task, type = 'progress') {
        if(!task.subtasks || task.subtasks.length <= 0) {
            return null;
        }
        let subtasksDone = 0;
        task.subtasks.forEach(function(subtask) {
            if(subtask.done) {
                subtasksDone++;
            }
        });
        let subtasksTotal = task.subtasks.length;
        if(type == 'count') {
            return (subtasksDone + '/' + subtasksTotal);
        } else {
            return Math.round(subtasksDone / subtasksTotal * 100);
        }
}