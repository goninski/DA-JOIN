let formMode = '';
let invalidFields = [];
let listboxElements = [];
let currentFieldElements = {};
document.addEventListener('click', documentEventHandler);
document.addEventListener('keydown', documentEventHandler);

function documentEventHandler(event) {
    console.log('f) documentEventHandler');
    if( event.key === 'Escape' || event.type === "click" ) {
        closeAllDropdowns(listboxElements);
        focusCurrentCombox(event.target);
        console.log('escape/click on document !');
        console.log(event.currentTarget);
        console.log(event.target);
    }
}

function focusInHandler(event) {
    event.stopPropagation();
    let element = event.currentTarget;
    getCurrentFieldElements(element);
    console.log('f) focusInHandler');
    // console.log(element);
    resetInputValidation(event);
}

function focusOutHandler(event) {
    event.stopPropagation();
    event.preventDefault();
    let element = event.currentTarget;
    console.log('f) focusOutHandler');
    // console.log(element);
    // closeAllDropdowns(listboxElements);
    validateInput(element);
    // currentFieldElements.listbox ? closeDropdown(currentFieldElements.listbox) : null;
}

function getFormElementsArray(formId) {
    let form = document.getElementById(formId);
    let elements = form.elements;
    let elementsArr = Array.from(elements);
    // console.log(elementsArr);
    return elementsArr;
}

async function resetForm(formId) {
    let form = document.getElementById(formId);
    form.reset();
    // invalidFields = [];
    listboxElements = [];
    let formElements = getFormElementsArray(formId);
    formElements.forEach(function(element) {
        resetFormElements(element);
    });
    // console.log(listboxElements);
    getInvalidInputIds(formId);
    formElements[0].focus();
}

function resetFormElements(element) {
    setPlaceholderStyle(element);
    getCurrentFieldElements(element);
    if(currentFieldElements.fieldWrapper) {
        currentFieldElements.fieldWrapper.classList.remove('invalid');
    }
    if(currentFieldElements.combox) {
        currentFieldElements.combox.removeAttribute('data-option-id');
        currentFieldElements.combox.removeAttribute('data-active-index');
    }
    if(currentFieldElements.listbox) {
        listboxElements.push(currentFieldElements.listbox);
        closeDropdown(currentFieldElements.listbox);
    }
};

async function checkEditFormState(formId) {
    let formElements = getFormElementsArray(formId);
    formElements.forEach(function(element) {
        setPlaceholderStyle(element);
    });
    setSubmitBtnState(formId);
    formElements[0].focus();
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
    // console.log(invalidFields);
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

function validateInput(element) {
    // console.log('f) validateInput');
    // console.log(element);
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


function setFieldValidity(element) {
    let isValidElement = validateElement(element);
    let fieldWrapper = getFieldWrapperFromId(element.id);
    if(fieldWrapper){
        isValidElement ? fieldWrapper.classList.remove('invalid') : fieldWrapper.classList.add('invalid');
    }
    setPlaceholderStyle(element);
}

function setPlaceholderStyle(element) {
    if(element.hasAttribute('data-placeholder-style')) {
        element.value == '' ? element.dataset.placeholderStyle = 'true' : element.dataset.placeholderStyle = 'false';
    }
}

function removePlaceholderStyle(event) {
    // event.stopPropagation();
    let element = event.currentTarget;
    element.hasAttribute('data-placeholder-style') ? element.dataset.placeholderStyle = 'false' : null;
}

function resetInputValidation(event) {
    let fieldWrapper = getFieldWrapperFromEvent(event);
    fieldWrapper ? fieldWrapper.classList.remove('invalid') : null;
}

function setSubmitBtnState(formId) {
    getInvalidInputIds(formId);
    let form = document.getElementById(formId);
    let submitBtn = form.querySelector('[type="submit"]');
    submitBtn.setAttribute('disabled', '');
    invalidFields.length > 0 ? submitBtn.setAttribute('disabled', '') : submitBtn.removeAttribute('disabled');
}

async function getFormData(formId) {
    let form = document.getElementById(formId);
    let formData = new FormData(form);
    console.log(formData);
    return formData;
}

async function getFormInputObj(formId) {
    // event ? event.preventDefault() : null;
    console.log(formId);
    let formData = await getFormData(formId);
    console.log(formData);
    let formInputObj = Object.fromEntries(formData);
    console.log(formInputObj);
    return formInputObj;
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









// SELECTION HANDLER (DROPDOWNS)

function dropdownEventHandler(event) {
    event.stopPropagation();
    console.log('f) dropdownEventHandler');
    // console.log(event.key);
    // console.log(event.type);
    // console.log(event.target);
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
    if(!event.currentTarget.hasAttribute('data-select-multiple')) {
        if(['ArrowDown', 'ArrowUp'].includes(event.key)) {
            return dropdownOptionKeyHandler(event, false);
        }
        if(['Tab'].includes(event.key)) {
            // return toggleDropdown(listbox);
        }
    }
}

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

function focusCurrentCombox(element) {
    getCurrentFieldElements(element);
    currentFieldElements.combox ? currentFieldElements.combox.focus() : null;
}

function dropdownOptionClickHandler(event) {
    event.stopPropagation();
    console.log('f) dropdownOptionClickHandler');
    let option = event.currentTarget.closest('[role="option"]');
    // console.log(option);
    if(option) {
        getCurrentFieldElements(option);         
        let options = currentFieldElements.options;
        options.forEach(element => {
            element.setAttribute('aria-selected', 'false');
        });
        setDropdownOption(currentFieldElements.combox, option, null);
        // let combox = currentFieldElements.combox;
        // console.log(combox);
        toggleDropdown(currentFieldElements.listbox);
        // validateInput(currentFieldElements.combox);
    }
}

async function dropdownOptionClickHandlerMultiple(event, contactId) {
    event.stopPropagation();
    console.log('f) dropdownOptionClickHandlerMultiple');
    let option = event.currentTarget.closest('[role="option"]');
    // console.log(option);
    if(option) {
        // let checkbox = option.querySelector('[type="checkbox"]');
        let checkbox = event.target;
        if(checkbox.checked) {
            assignedContacts.push(contactId);
        } else {
            assignedContacts.splice(assignedContacts.indexOf(contactId), 1);
        };
        await renderContactProfileBatches(assignedContacts);
        // toggleDropdown(currentFieldElements.listbox);
        // event.preventDefault();
    }
}

function dropdownOptionKeyHandler(event, loop = false) {
    getCurrentFieldElements(event.currentTarget);
    let combox = currentFieldElements.combox;
    let options = currentFieldElements.options;
    let activeIndex = combox.dataset.activeIndex;
    index = getSelectedDropdownIndex(event, activeIndex, options.length, loop);
    setDropdownOption(combox, options[index], options[activeIndex]);
}

// function dropdownOptionKeyHandlerMultiple(event, loop = false) {
// }

function setDropdownOption(combox, option, activeOption = null) {
    combox.value = option.textContent;
    combox.setAttribute('data-option-id', option.dataset.optionId);
    combox.setAttribute('data-active-index', option.dataset.index);
    activeOption ? activeOption.setAttribute('aria-selected', 'false') : null;
    option.setAttribute('aria-selected', 'true');
}

function getSelectedDropdownIndex(event, index, length, loop = false) {
    !index ? index = -1 : null;
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
        loop ? index = 0 : null;
    }
    return index;
}

function getPreviousIndex(index, length, loop = false) {
    if(index <= 0) {
        loop ? index = length - 1 : null;
    } else {
        index--;
    }
    return index;
}

function getCurrentFieldElements(element) {
    currentFieldElements = {};
    let fieldWrapper = element.closest('.field-wrapper');
    if(fieldWrapper) {
        currentFieldElements.fieldWrapper = fieldWrapper;
        let input = fieldWrapper.querySelector('input');
        if(input) {
            currentFieldElements.input = input;
        }
        let alert = fieldWrapper.querySelector('[role="alert"]');
        if(alert) {
            currentFieldElements.alert = alert;
        }
        let combox = fieldWrapper.querySelector('[role="combox"]');
        if(combox) {
            currentFieldElements.combox = combox;
        }
        let listbox = fieldWrapper.querySelector('[role="listbox"]');
        if(listbox) {
            currentFieldElements.listbox = listbox;
            currentFieldElements.options = getCurrentSelectOptions(listbox);
        }
    }
    // console.log(currentFieldElements);
    return currentFieldElements;
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

function openDropdown(listbox) {
    let fieldWrapper = getFieldWrapperFromElement(listbox);
    if(fieldWrapper) {
        listbox.setAttribute('aria-expanded', 'true');
        fieldWrapper.classList.add('select-expanded');
    }
}

function closeDropdown(listbox) {
    let fieldWrapper = getFieldWrapperFromElement(listbox);
    if(fieldWrapper) {
        listbox.setAttribute('aria-expanded', 'false');
        fieldWrapper.classList.remove('select-expanded');
    }
}

function closeAllDropdowns(listboxElements, currentListbox = null) {
    listboxElements.forEach(function(listbox) {
        listbox !== currentListbox ? closeDropdown(listbox) : null;
    });
}


