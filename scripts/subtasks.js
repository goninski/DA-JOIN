/**
 * Render subtasks on edit task form
 * 
 * @param {array} assignedSubtasks - array of subtask objects
 * @param {string} wrapperId - id of the render wrapper
 */
async function renderTaskFormSubtasks(assignedSubtasks, wrapperId = 'assignedSubtasks') {
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
            (index === assignedSubtasks.length - 1) ? listItem.scrollIntoView() : null;
        }
    }
}


/**
 * Helper: validate allowed event keys/types
 * 
 * @param {event} event - inherit
 * @returns {boolean} 
 */
function subtaskEventAllowed(event) {
    return (['Enter', ' '].includes(event.key) || event.type === 'click');
}


/**
 * Helper: return current subtask input element
 * 
 * @param {event} event - inherit
 */
function getCurrentSubtaskInputFromEvent(event) {
    let wrapper = getClosestParentElementFromEvent(event, '.input-wrapper-subtask');
    return wrapper.querySelector('input');
}


/**
 * Helper: return current subtask input wrapper element
 * 
 * @param {element} element - current element
 */
function getCurrentSubtaskInputWrapper(element) {
    return getClosestParentElementFromElement(element, '.input-wrapper-subtask')
}


/**
 * Helper: return current input wrapper element
 * 
 * @param {element} element - current element
 */
function getCurrentInputWrapper(element) {
    return getClosestParentElementFromElement(element, '.input-wrapper')
}


/**
 * Helper: validate subtask input
 * 
 * @param {element} input - input element
 * @returns {boolean}
 */
function validateSubtaskInput(input) {
    return (input.value.length > 0 && input.value.length <= 128);
}


/**
 * Event handler: set states of add-new-subtask-buttons based on input
 * 
 * @param {event} event - oninput (input)
 */
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


/**
 * Event handler: add new subtask via ENTER key
 * 
 * @param {event} event - onkeydown (input)
 */
function addSubtaskInputEventHandler(event) {
    event.stopPropagation();
    let input = event.currentTarget;
    if(['Enter'].includes(event.key)) {
        event.preventDefault();
        validateSubtaskInput(input) ? addSubtask(input) : null;
    };
}


/**
 * Event handler: add new subtask via button
 * 
 * @param {event} event - onclick (check icon button)
 */
function addSubtaskEventHandler(event) {
    event.stopPropagation();
    if(subtaskEventAllowed) {
        event.preventDefault();
        getCurrentFieldElements(event.target);
        let input = currentFieldElements.input;
        addSubtask(input);
    }
}

/**
 * Event handler: focus add new subtas input
 * 
 * @param {event} event - onclick (plus icon button)
 */
function addSubtaskEventHandlerFocus(event) {
    event.preventDefault();
    event.stopPropagation();
    element = document.getElementById('inputSubtasks');
    element.focus();
}


/**
 * Add subtask and update subtask list
 * 
 * @param {element} element - input element
 */
async function addSubtask(element) {
    // console.log(element.value);
    let subtask = {};
    subtask.title = element.value;
    subtask.done = false;
    !assignedSubtasks ? assignedSubtasks = [] : null;
    assignedSubtasks.push(subtask)
    await renderTaskFormSubtasks(assignedSubtasks);
    clearSubtaskInput(element);
}


/**
 * Event handler: clear subtask input
 * 
 * @param {event} event - onclick (x icon button)
 */
function clearSubtaskEventHandler(event) {
    event.stopPropagation();
    if(subtaskEventAllowed) {
        event.preventDefault();
        getCurrentFieldElements(event.target);
        clearSubtaskInput(currentFieldElements.input);
    }
}


/**
 * Clear subtask input
 * 
 * @param {element} element - input element
 */
function clearSubtaskInput(element) {
    element.value = '';
    document.getElementById('subtaskInputButtonAdd').classList.remove('hide');
    document.getElementById('subtaskInputButtons').classList.add('hide');
    element.focus();
}


/**
 * Event handler: set states of subtask input, based on input
 * 
 * @param {event} event - oninput (input)
 */
function onInputUpdateSubtask(event) {
    event.stopPropagation();
    let input = event.currentTarget;
    let wrapper = getCurrentSubtaskInputWrapper(input);
    let updateBtn = wrapper.querySelector('.update-subtask-button');
    if(validateSubtaskInput(input)) {
        wrapper.classList.remove('invalid');
        updateBtn.tabIndex = 0;
    } else {
        wrapper.classList.add('invalid');
        updateBtn.tabIndex = 1;
    }
}


/**
 * Event handler: set subtask input to edit mode
 * 
 * @param {event} event - double click (input), click (edit button)
 */
function editSubtaskEventHandler(event) {
    event.stopPropagation();
    if(subtaskEventAllowed) {
        event.preventDefault();
        let input = getCurrentSubtaskInputFromEvent(event);
        let wrapper = getCurrentSubtaskInputWrapper(input);
        wrapper.classList.add('edit');
        wrapper.classList.remove('read-only');
        input.readOnly = false;
        input.focus();
        let valLength = input.value.length;
        input.setSelectionRange(valLength, valLength);
    }
}


/**
 * Event handler: update subtask input
 * 
 * @param {event} event - oninput (input), onclick (save button)
 * @param {number} index - current index of the subtask list
 */
function updateSubtaskEventHandler(event, index) {
    event.stopPropagation();
    if(subtaskEventAllowed) {
        event.preventDefault();
        let input = getCurrentSubtaskInputFromEvent(event);
        let wrapper = getCurrentSubtaskInputWrapper(input);
        assignedSubtasks[index].title = input.value;
        wrapper.classList.remove('edit');
        wrapper.classList.add('read-only');
        input.readOnly = true;
        renderTaskFormSubtasks(assignedSubtasks);
    }
}


/**
 * Event handler: delete subtask
 * 
 * @param {event} event - onclick (delete button)
 * @param {number} index - current subtask index of the list
 */
function deleteSubtaskEventHandler(event, index) {
    event.stopPropagation();
    if(subtaskEventAllowed) {
        event.preventDefault();
        deleteSubtask(index);
    }
}


/**
 * Delete Subtask
 * 
 * @param {number} index - current index of the subtask list
 */
function deleteSubtask(index) {
    assignedSubtasks.splice(index, 1);
    renderTaskFormSubtasks(assignedSubtasks);
}


/**
 * Event handler: toggle subtask status (done true/false)
 * 
 * @param {event} event - onclick (subtask checkbox on task detail view of board dialog)
 * @param {string} taskId - id of the current task
 * @param {number} subtaskIndex - index of the selected subtask in the list
 */
async function toggleSubtaskStatus(event, taskId, subtaskIndex) {
    event.stopPropagation();
    let task = await getTaskById(taskId);
    if(task) {
        if(hasLength(task.subtasks)) {
            let status = task.subtasks[subtaskIndex].done;
            await updateSubtaskStatus(taskId, subtaskIndex, !status);
            await renderTaskDetailsSubtasks(task);
        }
    }
}


/**
 * Helper: return some subtask progress information for the task view
 * 
 * @param {object} task - a task object
 * @param {string} type - return type (count, progress)
 * @returns {string}
 */
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