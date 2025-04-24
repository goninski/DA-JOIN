let formMode = '';
let invalidFields = [];
let activeTaskId = 0;
let activeContactId = 0;
let assignedContacts = [];
let assignedSubtasks = [];
// let assignedCategory = 0;
let listboxElements = [];
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
    let fieldWrapper = getFieldWrapperFromId(element.id);
    if(fieldWrapper) {
        fieldWrapper.classList.remove('selection-expanded', 'invalid');
        let combox = fieldWrapper.querySelector('[role="combox"]');
        if(combox) {
            combox.removeAttribute('data-active-option');
        }
        let listbox = fieldWrapper.querySelector('[role="listbox"]');
        if(listbox) {
            listboxElements.push(listbox);
            closeDropdown(listbox);
        }
    }
};

function closeDropdown(listbox) {
    if(listbox.getAttribute("role") === 'listbox' ) {
        listbox.setAttribute('aria-expanded', 'false');
        let fieldWrapper = getFieldWrapperFromId(listbox.id);
        if(fieldWrapper) {
            fieldWrapper.classList.remove('select-expanded');
        }
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
    // console.log(element.id);
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
    let fieldWrapper = getFieldWrapperFromId(element.id);
    if(fieldWrapper){
        let isValidElement = validateElement(element);
        if(isValidElement) {
            fieldWrapper.classList.remove('invalid');
        } else {
            fieldWrapper.classList.add('invalid');
        }
    }
}

function resetInputValidation(event) {
    // event.stopPropagation();
    let fieldWrapper = getFieldWrapperFromEvent(event);
    if(fieldWrapper){
        fieldWrapper.classList.remove('invalid');
    }
}

function validateInputEvent(event) {
    event.stopPropagation();
    let element = event.currentTarget;
    setFieldValidity(element);
    setSubmitBtnState(element.form.id);
}

function validatePhoneInput(element) {
    // let element = document.getElementById(id);
    let inputValue = element.value;
    console.log(inputValue);
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


function toggleDropdown(event = null, listbox = null) {
    let fieldWrapper;
    if(event) {
        fieldWrapper = getFieldWrapperFromEvent(event);
        listbox = fieldWrapper.querySelector('[role="listbox"]');
        resetInputValidation(event);
    } else {
        fieldWrapper = getFieldWrapperFromId(listbox.id);
    }
    closeAllDropdowns(listboxElements, listbox);
    fieldWrapper.classList.toggle('select-expanded');
    let isExpanded = getBooleanFromString(listbox.getAttribute('aria-expanded'));
    isExpanded = !isExpanded;
    listbox.setAttribute('aria-expanded', isExpanded);
}


function selectDropdownOption(event, activeOption, optionValue = '') {
    event.stopPropagation();
    let listbox = getClosestParentElementFromEvent(event, '[role="listbox"]');
    let options = listbox.querySelectorAll('[role="option"]');
    options.forEach(option => {
        option.setAttribute('aria-selected', 'false');
    });
    let combox = document.getElementById(listbox.dataset.comboxId);
    combox.value = optionValue;
    combox.dataset.activeOption = activeOption;
    let option = event.currentTarget;
    option.setAttribute('aria-selected', 'true');
    toggleDropdown(null, listbox);
}

function selectDropdownTaskContact(event, contactId) {
    if(event.target.checked) {
        assignedContacts.push(contactId);
    } else {
        assignedContacts.splice(assignedContacts.indexOf(contactId), 1);
    };
    renderContactProfileBatches(assignedContacts);
}





function documentClickHandler(event) {
    event.stopPropagation();
    closeAllDropdowns(listboxElements);
}

function focusInHandler(event) {
    event.stopPropagation();
    // closeAllDropdowns(listboxElements);
    resetInputValidation(event);
}

function focusOutHandler(event) {
    event.stopPropagation();
    // let element = event.currentTarget;
    // let fieldWrapper = getFieldWrapperFromEvent(event);
}

function dropdownEventHandler(event) {
    event.stopPropagation();
    // console.log(event);
    let {key} = event;
    let keys = ['Enter','ArrowUp', 'ArrowDown', ' '];
    if(keys.includes(event.key)) {
        event.preventDefault();
        return toggleDropdown(event);
    }
    if( key === 'Escape' ) {
        return toggleDropdown(event);
    }
    if(event.type === "click") {
        return toggleDropdown(event);
    }
}






// function dropdownClickHandler(event) {
//     event.stopPropagation();
//     // resetInputValidation(event);

//     let fieldWrapper = getFieldWrapperFromEvent(event);
//     fieldWrapper.classList.toggle('select-expanded');
//     let listbox = fieldWrapper.querySelector('[role="listbox"]');
//     let isExpanded = getBooleanFromString(listbox.getAttribute('aria-expanded'));
//     if(!isExpanded) {
//         expandedListbox = listbox;
//     } else {
//         expandedListbox = null;
//     }
//     // isExpanded = !isExpanded;
//     listbox.setAttribute('aria-expanded', !isExpanded);
//     console.log(expandedListbox);
// }



// function validateSelectMultiple(id) {
//     closeSelectOptions(id);
//     let element = document.getElementById(id);
//     element.value = '';
//     validateInputEvent(id, true);
// }

// function setValidationStyle(element) {
//     getInvalidInputIds(element.form.id);
//     let fieldWrapper = getFieldWrapperFromId(element.id);
//     if(fieldWrapper){
//         if (! element.checkValidity()) {
//             fieldWrapper.classList.add('invalid');
//         } else {
//             fieldWrapper.classList.remove('invalid');
//         }
//     }
// }


// function setFieldToInvalid(element, visible = false) {
//     let fieldWrapper = getFieldWrapperFromId(element.id);
//     if(fieldWrapper){
//         invalidFields.push(element.id);
//         if(visible) {
//             fieldWrapper.classList.add('invalid');
//         }
//     }
// }


// function toggleSelectOptionsVisibility(event) {
//     console.log(event.key);
//     event.stopPropagation();
//     event.preventDefault();
//     let element = getFieldWrapperFromEvent(event);
//     element.classList.toggle('select-expanded');
//     resetInputValidation(event);
// }

// function validateInputEventOption(element, option) {
//     let validationParam = element.getAttribute('data-validation-param');
//     console.log(validationParam);
//     let item;
//     if(option == 'radio-name') {
//         item = document.getElementsByName(validationParam)[0];
//     } else if (option == 'custom-id') {
//         item = document.getElementById(validationParam);
//     } else {
//         item = element;
//     }
//     if(option == 'phone') {
//         validatePhoneInput(item);
//     }
//     setValidationStyle(item);
// }

// function selectCustomSelectOption(event, selectId, optionValue) {
//     event.stopPropagation();
//     selectInput = document.getElementById(selectId);
//     if(event.target.checked) {
//         selectInput.value = optionValue;
//         // validateCustomSelect(event, selectId);
//     }
//     //toggleSelectOptionsVisibility(event);
//     validateInputEvent(event, 'custom-id');
// }


// function setValidity(element) {
//     let fieldWrapper = getFieldWrapperFromId(element.id);
//     if(fieldWrapper) {
//         if(element.checkValidity()) {
//             fieldWrapper.classList.remove('invalid');
//         } else {
//             invalidFields.push(element.id)
//             fieldWrapper.classList.add('invalid');
//             // console.log('invalid) ' + element.id);
//         }
//     }
// }


// function validateCustomSelect(event, selectId) {
//     event.stopPropagation();
//     selectInput = document.getElementById(selectId);
//     console.log(selectInput.value.length);
//     // validateInputEvent(selectId, true);
//     if(selectInput.value.length <= 0) {
//         setInvalidStyles(selectInput, true);
//     } else {
//         resetValidationStyles(selectInput, true);
//     }
// }

// function validateSelectInput(event, radioId = 'inputCategoryId') {
//     event.stopPropagation();
//     let element = event.currentTarget;
//     let fieldWrapper = getFieldWrapperFromId(element.id);
//     console.log(invalidFields);
//     if(fieldWrapper){
//         if (! element.checkValidity()) {
//             fieldWrapper.classList.add('invalid');
//         } else {
//             fieldWrapper.classList.remove('invalid');
//         }
//         let formId = element.form.id;
//         getInvalidInputIds(formId);
//         return element.value;
//     }
// }


// function xvalidateInputEvent(id, parent = false) {
//     // let id = event.currentTarget.id;
//     let element = document.getElementById(id);
//     console.log(id);
//     console.log(invalidFields);
//     let index = invalidFields.findIndex(item => item == id);
//     if (! element.checkValidity() || (element.value = '' && element.required == true)) {
//         if(index < 0) {
//             invalidFields.push(id);
//         }
//         setInvalidStyles(element, parent);
//     } else {
//         if(index >= 0) {
//             invalidFields.splice(index, 1);
//         }
//         setValidStyles(element);
//         return element.value;
//     }
// }



// function closeSelectOptionsVisibility(event) {
//     event.stopPropagation();
//     let element = getFieldWrapperFromEvent(event);
//     element.classList.remove('select-expanded');
// }


// function closeAllSelectOptions(formId) {
//     for (let index = 0; index < invalidFields.length; index++) {
//         fieldId = invalidFields[index];
//         resetInputValidation(fieldId, true);
//     }
// }

// function resetInput(id) {
//     document.getElementById(id).value = '';
//     resetInputValidation(id)
// }

// function setInvalidStyles(element, parent) {
//     element.classList.add('invalid');
//     if(parent) {
//         if(element.parentNode.classList.contains('custom-select')) {
//             element.parentNode.parentNode.classList.add('invalid');
//         } else {
//             element.parentNode.classList.add('invalid');
//         };
//     }
//     setSubmitBtnState(element);
// }

// function resetValidationStyles(element, parent) {
//     element.classList.remove('invalid');
//     element.classList.remove('valid');
//     if(parent) {
//         if(element.parentNode.classList.contains('custom-select')) {
//             element.parentNode.parentNode.classList.remove('invalid');
//         } else {
//             element.parentNode.classList.remove('invalid');
//         };
//     }
//     setSubmitBtnState(element);
// }

// function setValidStyles(element) {
//     if(element.classList.contains('placeholder')) {
//         element.classList.add('valid');
//     }
//     setSubmitBtnState(element);
// }

// function closeSelectOptions(id) {
//     let element = document.getElementById(id);
//     element.parentElement.classList.remove('select-expanded');
// }
