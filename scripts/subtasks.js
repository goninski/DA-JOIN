/**
 * Render subtasks on edit task form
 * 
 * @param {array} assignedSubtasks - array of subtask objects
 * @param {string} wrapperId - id of the render wrapper
 */
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


/**
 * Helper: checks allowed event keys/types 
 * 
 * @param {event} event - sub
 * @returns {boolean} 
 */
function subtaskEventAllowed(event) {
    return (['Enter', ' '].includes(event.key) || event.type === 'click');
}


/**
 * Helper: get current subtask input element, subtask buttons
 * 
 * @param {event} event - sub
 */
function getCurrentSubtaskInputFromEvent(event) {
    let wrapper = getClosestParentElementFromEvent(event, '.input-wrapper-subtask');
    // console.log(wrapper);
    return wrapper.querySelector('input');
}


/**
 * Helper: get current subtask input wrapper element
 * 
 * @param {element} element - current dom element
 */
function getCurrentSubtaskInputWrapper(element) {
    return getClosestParentElementFromElement(element, '.input-wrapper-subtask')
}


/**
 * Helper: get current input wrapper element
 * 
 * @param {element} element - current dom element
 */
function getCurrentInputWrapper(element) {
    return getClosestParentElementFromElement(element, '.input-wrapper')
}


/**
 * Helper: validate subtask input
 * 
 * @param {element} input - input dom element
 * @returns {boolean}
 */
function validateSubtaskInput(input) {
    return (input.value.length > 0 && input.value.length <= 128);
}


/**
 * Event handler: set states of add new subtask buttons based on input
 * 
 * @param {event} event - oninput
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
 * Event handler: add new subtask, via key on input
 * 
 * @param {event} event - onkeydown
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
 * Event handler: add new subtask, via button
 * 
 * @param {event} event - onclick
 */
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

/**
 * Event handler: pseudo add task icon
 * ??? is this button for decoration only?  
 * ??? why is the event not prevented
 * 
 * @param {event} event - onclick
 */
function addSubtaskEventHandlerPseudo(event) {
    event.preventDefault();
    event.stopPropagation();
    // subtaskEventAllowed ? event.preventDefault() : null;
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
    // console.log(subtask);
    !assignedSubtasks ? assignedSubtasks = [] : null;
    // console.log(assignedSubtasks);
    assignedSubtasks.push(subtask)
    await renderSubtasks(assignedSubtasks);
    clearSubtaskInput(element);
}


/**
 * Event handler: clear subtask input, clear button
 * 
 * @param {event} event - onclick
 */
function clearSubtaskEventHandler(event) {
    event.stopPropagation();
    // console.log('f) clearSubtaskEventHandler');
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
 * Event handler: set states of subtask input based on input
 * 
 * @param {event} event - oninput
 */
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


/**
 * Event handler: set subtask input to edit mode
 * 
 * @param {event} event - onclick (edit button)
 */
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


/**
 * Event handler: set subtask input to edit mode
 * 
 * @param {event} event - oninput (input), onclick (save button)
 * @param {number} index - current subtask index of the list
 */
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


/**
 * Event handler: delete subtask
 * 
 * @param {event} event - onclick (delete button)
 * @param {number} index - current subtask index of the list
 */
function deleteSubtaskEventHandler(event, index) {
    event.stopPropagation();
    // console.log('f) deleteSubtaskEventHandler');
    if(subtaskEventAllowed) {
        event.preventDefault();
        deleteSubtask(index);
    }
}


/**
 * Delete Subtask
 * 
 * @param {number} index - current subtask index of the list
 */
function deleteSubtask(index) {
    assignedSubtasks.splice(index, 1);
    // console.log(assignedSubtasks);
    renderSubtasks(assignedSubtasks);
}


/**
 * Change task status - currently not in use (???)
 * 
 * @param {event} event - optional, currently not in use
 * @param {string} taskId - id of the selected task
 * @param {string} statusNew - id of the new status (target board)
 * @param {string} statusOld - id of old status (source board), optional, currently not in use
 */
async function changeTaskStatus(event = null, taskId, statusNew, statusOld = null) {
    event ? event.stopPropagation() : null;
    await updateTaskProperty(taskId, 'status', statusNew);
    // renderBoard(statusNew);
    // statusOld ? renderBoard(statusOld) : null;
}


/**
 * Event handler: toggle subtask status (done true/false)
 * 
 * @param {event} event - click (not implemented yet)
 * @param {string} taskId - id of the current task
 * @param {number} subtaskIndex - index of the selected subtask in the list
 */
async function toggleSubtaskStatus(event = null, taskId, subtaskIndex) {
    event ? event.stopPropagation() : null;
    let index = await getTaskIndexFromId(taskId);
    let status = tasks[index].subtasks[subtaskIndex].done;
    await updateSubtaskStatus(taskId, subtaskIndex, !status);
}


/**
 * Helper: returns some subtask progress information for the task view
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