let formMode = '';
let invalidFields = [];
let activeTaskId = 0;
let activeContactId = 0;
let assignedContacts = [];
let assignedSubtasks = [];
// let assignedCategory = 0;
let listboxElements = [];
let currentSelectParts = {};
document.addEventListener('click', documentClickHandler);


function getFormElementsArray(formId) {
    let form = document.getElementById(formId);
    let elements = form.elements;
    let elementsArr = Array.from(elements);
    // console.log(elementsArr);
    return elementsArr;
}

function resetForm(formId) {
    document.getElementById(formId).reset();
    invalidFields = [];
    listboxElements = [];
    let formElements = getFormElementsArray(formId);
    formElements.forEach(function(element) {
        resetFormElements(element);
    });
    // console.log(listboxElements);
    getInvalidInputIds(formId);
}

function resetFormElements(element) {
    getCurrentSelectParts(element);
    if(currentSelectParts.fieldWrapper) {
        currentSelectParts.fieldWrapper.classList.remove('invalid');
    }
    if(currentSelectParts.combox) {
        currentSelectParts.combox.removeAttribute('data-option-id');
        currentSelectParts.combox.removeAttribute('data-active-index');
    }
    if(currentSelectParts.listbox) {
        listboxElements.push(currentSelectParts.listbox);
        closeDropdown(currentSelectParts.listbox);
    }
    addPlaceholderStyle(element);
};

function closeDropdown(listbox) {
    // console.log(Date.now());
    let fieldWrapper = getFieldWrapperFromElement(listbox);
    if(fieldWrapper) {
        listbox.setAttribute('aria-expanded', 'false');
        fieldWrapper.classList.remove('select-expanded');
    }
}

function closeAllDropdowns(listboxElements, currentListbox = null) {
    listboxElements.forEach(function(listbox) {
        if(listbox !== currentListbox) {
            closeDropdown(listbox);
        }
    });
}

function setInitialFormState(formId, firstElementId = '', editMode = 'add') {
    // resetAllInputAttributes(formId);
    // getInvalidInputIds(formId);
    if(firstElementId != '') {
        let firstElement = document.getElementById(firstElementId);
        firstElement.focus();
    }
}

function focusFirstElement(firstElementId = null) {
    if(firstElementId) {
        let firstElement = document.getElementById(firstElementId);
        firstElement.focus();
    }
}

function getInvalidInputIds(formId) {
    invalidFields = [];
    let formElements = getFormElementsArray(formId);
    formElements.forEach(function(element) {
        let isValidElement = validateElement(element);
        if(!isValidElement) {
            invalidFields.push(element.id);
        }
    });
    console.log(invalidFields);
    // setSubmitBtnState(formId);
}

function validateElement(element) {
    // console.log('f) validateElement');
    // console.log(element.id);
    if(element.hasAttribute('required')) {
        return (element.value.replaceAll(' ', '') != '');
    }
    if(! element.checkValidity() || ! checkCustomValidation(element)) {
        return false;
    }
    return true;
}

function checkCustomValidation(element) {
    if(! element.hasAttribute("data-custom-validation"))  {
        return true;
    }
    if(element.dataset.customValidation == 'required') {
        return (element.value.length > 0);
    }
    if(element.dataset.customValidation == 'phone') {
        if(! element.value.length) { return true; }
        validatePhoneInput(element);
        return (element.value.length >= 10);
    }
}

function setFieldValidity(element) {
    let isValidElement = validateElement(element);
    let fieldWrapper = getFieldWrapperFromId(element.id);
    if(fieldWrapper){
        if(isValidElement) {
            fieldWrapper.classList.remove('invalid');
        } else {
            fieldWrapper.classList.add('invalid');
        }
    }
    if(element.hasAttribute('data-placeholder-style')) {
        if(element.value == '') {
            element.dataset.placeholderStyle = 'true';
        } else {
            element.dataset.placeholderStyle = 'false';
        }
    }
}

function removePlaceholderStyle(event) {
    event.stopPropagation();
    let element = event.currentTarget;
    if(element.hasAttribute("data-placeholder-style")) {
        element.dataset.placeholderStyle = 'false';
    }
}

function addPlaceholderStyle(element) {
    if(element.value == '' && element.hasAttribute("data-placeholder-style")) {
        element.dataset.placeholderStyle = 'true';
    }
}

function resetInputValidation(event) {
    // event.stopPropagation();
    let fieldWrapper = getFieldWrapperFromEvent(event);
    if(fieldWrapper){
        fieldWrapper.classList.remove('invalid');
    }
}

function validateInput(element) {
    console.log('f) validateInput');
    console.log(element);
    setFieldValidity(element);
    setSubmitBtnState(element.form.id);
}

function validatePhoneInput(element) {
    // let element = document.getElementById(id);
    let inputValue = element.value;
    // console.log(inputValue);
    let formattedValue = inputValue;
    let rawValue = inputValue.replaceAll(' ', '');
    if(rawValue.length >= 10){
        if(! inputValue.startsWith("+")) {
            formattedValue = "+49 " + inputValue;
        }
    }
    element.value = formattedValue;
}

function setSubmitBtnState(formId) {
    getInvalidInputIds(formId);
    let submitBtnId = document.getElementById(formId).dataset.submitBtnId;
    let submitBtn = document.getElementById(submitBtnId);
    submitBtn.setAttribute('disabled', '');
    if(invalidFields.length > 0) {
        submitBtn.setAttribute('disabled', '');
    } else {
        submitBtn.removeAttribute('disabled');
    }
}

function getFormData(formId) {
    let form = document.getElementById(formId);
    let formData = new FormData(form);
    console.log(formData);
    return formData;
}

function getFormInputObj(event, formId) {
    if(event) {
        event.preventDefault();
    }
    let formData = getFormData(formId);
    let formInputObj = Object.fromEntries(formData);
    console.log(formInputObj);
    return formInputObj;
}



function documentClickHandler(event) {
    event.stopPropagation();
    closeAllDropdowns(listboxElements);
}

function focusInHandler(event) {
    event.stopPropagation();
    resetInputValidation(event);
}

function focusOutHandler(event) {
    event.stopPropagation();
    let element = event.currentTarget;
    console.log('f) validateInput');
    console.log(element);
    validateInput(element);
}

function dropdownEventHandler(event) {
    event.stopPropagation();
    // console.log('f) dropdownEventHandler');
    // console.log(event.currentTarget);
    // console.log(event);
    if(['Enter', ' '].includes(event.key)) {
        event.preventDefault();
        return toggleDropdown(event.currentTarget);
    }
    if( event.key === 'Escape' || event.type === "click" ) {
        return toggleDropdown(event.currentTarget);
    }
    if(['ArrowDown', 'ArrowUp'].includes(event.key)) {
        return dropdownOptionKeyHandler(event, false);
    }
}

function toggleDropdown(element) {
    getCurrentSelectParts(element);
    let listbox = currentSelectParts.listbox;
    closeAllDropdowns(listboxElements, listbox);
    currentSelectParts.fieldWrapper.classList.toggle('select-expanded');
    let isExpanded = getBooleanFromString(listbox.getAttribute('aria-expanded'));
    isExpanded = !isExpanded;
    listbox.setAttribute('aria-expanded', isExpanded);
}

function dropdownOptionClickHandler(event) {
    event.stopPropagation();
    console.log('f) dropdownOptionClickHandler');
    let option = event.currentTarget.closest('[role="option"]');
    console.log(option);
    if(option) {
        getCurrentSelectParts(option);
        let options = currentSelectParts.options;
        options.forEach(element => {
            element.setAttribute('aria-selected', 'false');
        });
        setDropdownOption(currentSelectParts.combox, option, null);
        let combox = currentSelectParts.combox;
        console.log(combox);
        toggleDropdown(currentSelectParts.listbox);
        validateInput(currentSelectParts.combox);
    }
}

function dropdownMultipleClickHandler(event) {
    event.stopPropagation();
    let option = event.currentTarget.closest('[role="option"]');
}

function dropdownOptionKeyHandler(event, loop = false) {
    getCurrentSelectParts(event.currentTarget);
    let combox = currentSelectParts.combox;
    let options = currentSelectParts.options;
    let activeIndex = combox.dataset.activeIndex;
    index = getSelectedDropdownIndex(event, activeIndex, options.length, loop);
    setDropdownOption(combox, options[index], options[activeIndex]);
}

function setDropdownOption(combox, option, activeOption = null) {
    combox.value = option.textContent;
    combox.setAttribute('data-option-id', option.dataset.optionId);
    combox.setAttribute('data-active-index', option.dataset.index);
    if(activeOption) {
        activeOption.setAttribute('aria-selected', 'false');
    }
    option.setAttribute('aria-selected', 'true');
}

function getSelectedDropdownIndex(event, index, length, loop = false) {
    if(!index) {
        index = -1;
    }
    if(event.key === 'ArrowDown' ) {
        index = getNextIndex(index, length, loop);
    } else if (event.key === 'ArrowUp' ) {
        index = getPreviousIndex(index, length, loop);
    }
    return index;
}

function getNextIndex(index, length, loop = false) {
    if(index < length - 1 ) {
        index++;
    } else {
        if(loop) {
            index = 0;
        }
    }
    return index;
}

function getPreviousIndex(index, length, loop = false) {
    if(index <= 0) {
        if(loop) {
            index = length - 1;
        }
    } else {
        index--;
    }
    return index;
}


function selectDropdownTaskContact(event, contactId) {
    if(event.target.checked) {
        assignedContacts.push(contactId);
    } else {
        assignedContacts.splice(assignedContacts.indexOf(contactId), 1);
    };
    renderContactProfileBatches(assignedContacts);
}

function getFieldWrapperFromElement(element) {
    return element.closest('.field-wrapper');
}

function getFieldWrapperFromEvent(event) {
    return getClosestParentElementFromEvent(event, '.field-wrapper');
}

function getFieldWrapperFromId(id) {
    return getClosestParentElementFromId(id, '.field-wrapper');
}

function getCurrentSelectParts(element) {
    currentSelectParts = {};
    let fieldWrapper = element.closest('.field-wrapper');
    if(fieldWrapper) {
        currentSelectParts.fieldWrapper = fieldWrapper;
        let combox = fieldWrapper.querySelector('[role="combox"]');
        if(combox) {
            currentSelectParts.combox = combox;
        }
        let listbox = fieldWrapper.querySelector('[role="listbox"]');
        if(listbox) {
            currentSelectParts.listbox = listbox;
            currentSelectParts.options = getCurrentSelectOptions(listbox);
        }
    }
    // console.log(currentSelectParts);
    return currentSelectParts;
}

function getCurrentSelectOptions(listbox, multiple = false) {
    let selectOptions = [];
    let options = listbox.querySelectorAll('[role="option"]');
    options.forEach(function(option) {
        selectOptions.push(option);
    });
    // console.log(selectOptions);
    return selectOptions;
}

function getCurrentSelectOptionValues(listbox, multiple = false) {
    let selectOptionValues = [];
    let options = listbox.querySelectorAll('[role="option"]');
    options.forEach(function(element) {
        let option = {};
        option.id = element.dataset.optionId;
        option.name = element.textContent;
        selectOptionValues.push(option);
    });
    console.log(selectOptionValues);
    return selectOptionValues;
}


