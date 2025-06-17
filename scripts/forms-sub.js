/**
 * Helper: set and return an object 'currentFieldElements' with all relevant elements within a field wrapper
 * (e.g. wrapper, input, alert, combox, listbox)
 * 
 * @param {element} element - a dom element within a field wrapper
 */
function getCurrentFieldElements(element) {
    currentFieldElements = {};
    let fieldWrapper = element.closest('.field-wrapper');
    if(fieldWrapper) {
        currentFieldElements.fieldWrapper = fieldWrapper;
        let input = fieldWrapper.querySelector('input');
        input ? currentFieldElements.input = input : null;
        let alert = fieldWrapper.querySelector('[role="alert"]');
        alert ? currentFieldElements.alert = alert : null;
        let combox = fieldWrapper.querySelector('[role="combox"]');
        combox ? currentFieldElements.combox = combox : null;
        let listbox = fieldWrapper.querySelector('[role="listbox"]');
        if(listbox) {
            currentFieldElements.listbox = listbox;
            currentFieldElements.options = getCurrentSelectOptions(listbox);
        }
    }
    return currentFieldElements;
}


/**
 * Helper: return field wrapper element from element
 * 
 * @param {element} element - current element
 */
function getFieldWrapperFromElement(element) {
    return element.closest('.field-wrapper');
}


/**
 * Helper: return field wrapper element from event
 * 
 * @param {event} event - inherit
 */
function getFieldWrapperFromEvent(event) {
    return getClosestParentElementFromEvent(event, '.field-wrapper');
}


/**
 * Helper: return field wrapper element from id
 * 
 * @param {string} id - id of the current element
 */
function getFieldWrapperFromId(id) {
    return getClosestParentElementFromId(id, '.field-wrapper');
}


/**
 * Event handler: dropdown (custom select)
 * 
 * @param {event} event - onclick (combox), onkeydown (combox single select)
 */
function dropdownEventHandler(event) {
    event.stopPropagation();
    getCurrentFieldElements(event.target);
    listbox = currentFieldElements.listbox;
    if(['Enter', ' '].includes(event.key)) {
        event.preventDefault();
        return toggleDropdown(listbox);
    }
    if( event.type === 'click') {
        return toggleDropdown(listbox);
    }
    if( event.key === 'Escape') {
        return closeDropdown(listbox);
    }
    return dropdownArrowUpDownHandler(event);
}


/**
 * Custom dropdown arrow up/down handler
 * 
 * @param {event} event - inherit
 */
function dropdownArrowUpDownHandler(event) {
    if(!event.currentTarget.hasAttribute('data-select-multiple')) {
        if(['ArrowDown', 'ArrowUp'].includes(event.key)) {
            return dropdownOptionKeyHandler(event, false);
        }
    }
}


/**
 * Event handler: dropdown single option (custom select single)
 * 
 * @param {event} event - onclick (select option)
 */
function dropdownOptionClickHandler(event) {
    event.stopPropagation();
    let option = event.currentTarget.closest('[role="option"]');
    if(option) {
        getCurrentFieldElements(option);         
        let options = currentFieldElements.options;
        options.forEach(element => {
            element.setAttribute('aria-selected', 'false');
        });
        setDropdownOption(currentFieldElements.combox, option, null);
        toggleDropdown(currentFieldElements.listbox);
    }
}


/**
 * Event handler: dropdown multiple option (custom multiple select (for assigned contacts))
 * 
 * @param {event} event - onchange (on checkbox input)
 * @param {string} contactId - contact id of the selected contact option
 */
async function dropdownOptionClickHandlerMultiple(event, contactId) {
    event.stopPropagation();
    let option = event.currentTarget.closest('[role="option"]');
    if(option) {
        let checkbox = event.target;
        if(checkbox.checked) {
            assignedContacts.push(contactId);
        } else {
            assignedContacts.splice(assignedContacts.indexOf(contactId), 1);
        };
        await renderTaskFormContactBatches(assignedContacts);
    }
}


/**
 * Set dropdown options (custom single select)
 * 
 * @param {element} combox - combox dom element
 * @param {element} option - option dom element
 * @param {element} activeOption - active option dom element 
 */
function setDropdownOption(combox, option, activeOption = null) {
    combox.value = option.textContent;
    combox.setAttribute('data-option-id', option.dataset.optionId);
    combox.setAttribute('data-active-index', option.dataset.index);
    activeOption ? activeOption.setAttribute('aria-selected', 'false') : null;
    option.setAttribute('aria-selected', 'true');
}


/**
 * Helper: return an array with all option elements of a listbox (custom select)
 * 
 * @param {element} listbox - listbox element
 * @param {boolean} multiple - is multiple select (currently not in use)
 */
function getCurrentSelectOptions(listbox, multiple = false) {
    let selectOptions = [];
    let options = listbox.querySelectorAll('[role="option"]');
    options.forEach(function(option) {
        selectOptions.push(option);
    });
    return selectOptions;
}


/**
 * Helper: return an array with all option values of a listbox (custom select)
 * 
 * @param {element} listbox - listbox element
 * @param {boolean} multiple - is multiple select (currently not in use)
 */
function getCurrentSelectOptionValues(listbox, multiple = false) {
    let selectOptionValues = [];
    let options = listbox.querySelectorAll('[role="option"]');
    options.forEach(function(element) {
        let option = {};
        option.id = element.dataset.optionId;
        option.name = element.textContent;
        selectOptionValues.push(option);
    });
    return selectOptionValues;
}


/**
 * Toggle dropdown (custom select) of current element
 * 
 * @param {element} element - current element
 */
function toggleDropdown(element) {                      
    getCurrentFieldElements(element);
    let listbox = currentFieldElements.listbox;
    closeAllDropdowns(listboxElements, listbox);
    currentFieldElements.fieldWrapper.classList.toggle('select-expanded');
    let isExpanded = getBooleanFromString(listbox.getAttribute('aria-expanded'));
    isExpanded = !isExpanded;
    listbox.setAttribute('aria-expanded', isExpanded);
    !isExpanded ? validateInput(currentFieldElements.combox) : null;
}


/**
 * Helper: open dropdown (custom select)
 * 
 * @param {element} listbox - current listbox element
 */
function openDropdown(listbox) {
    let fieldWrapper = getFieldWrapperFromElement(listbox);
    if(fieldWrapper) {
        listbox.setAttribute('aria-expanded', 'true');
        fieldWrapper.classList.add('select-expanded');
    }
}


/**
 * Helper: close a dropdown (custom select)
 * 
 * @param {element} listbox - current listbox element
 */
function closeDropdown(listbox) {
    let fieldWrapper = getFieldWrapperFromElement(listbox);
    if(fieldWrapper) {
        listbox.setAttribute('aria-expanded', 'false');
        fieldWrapper.classList.remove('select-expanded');
    }
}


/**
 * Helper: close all dropdowns (custom select) except the current (???)
 * 
 * @param {element} listboxElements - array of all listbox elements
 * @param {element} currentListbox - the current listbox, optional
 */
function closeAllDropdowns(listboxElements, currentListbox = null) {
    listboxElements.forEach(function(listbox) {
        listbox !== currentListbox ? closeDropdown(listbox) : null;
    });
}


/**
 * Focus dropdown (custom select) from current element
 * 
 * @param {element} element - current element
 */
function focusCurrentCombox(element) {
    getCurrentFieldElements(element);
    currentFieldElements.combox ? currentFieldElements.combox.focus() : null;
}


/**
 * Helper: arrow down/up navigation of custom single select
 * 
 * @param {event} event - inherit (from dropdownEventHandler)
 * @param {boolean} loop - loop the index
 */
function dropdownOptionKeyHandler(event, loop = false) {
    getCurrentFieldElements(event.currentTarget);
    let combox = currentFieldElements.combox;
    let options = currentFieldElements.options;
    let activeIndex = combox.dataset.activeIndex;
    index = getSelectedDropdownIndex(event, activeIndex, options.length, loop);
    setDropdownOption(combox, options[index], options[activeIndex]);
}


/**
 * Helper: return selected dropdown index
 * 
 * @param {event} event - inherit
 * @param {number} index - current option index
 * @param {number} length - total number of options
 * @param {boolean} loop - loop the index
 */
function getSelectedDropdownIndex(event, index, length, loop = false) {
    !index ? index = -1 : null;
    if(event.key === 'ArrowDown' ) {
        index = getNextIndex(index, length, loop);
    } else if (event.key === 'ArrowUp' ) {
        index = getPreviousIndex(index, length, loop);
    }
    return index;
}


/**
 * Helper: return next dropdown index
 */
function getNextIndex(index, length, loop = false) {
    if(index < length - 1 ) {
        index++;
    } else {
        loop ? index = 0 : null;
    }
    return index;
}


/**
 * Helper: return previous dropdown index
 */
function getPreviousIndex(index, length, loop = false) {
    if(index <= 0) {
        loop ? index = length - 1 : null;
    } else {
        index--;
    }
    return index;
}
