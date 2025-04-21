let taskFormMode = '';
let contactsFormMode = '';
let invalidFields = [];
// let requiredFields = [];
// let requiredContactFields = ['inputName', 'inputEmail'];
// let requiredTaskFields = ['inputTitle', 'inputDueDate', 'categorySelect'];
let activeTaskId = 0;
let activeContactId = 0;
let assignedTaskContacts = [];
let assignedSubtasks = [];

function init() {
    getMainTemplates();
}

function getMainTemplates() {
    getHeader();
    getSidemenu();
}

function getHeader() {
    document.getElementById('header').innerHTML = getHeaderTemplate();
}

function getSidemenu() {
    let sideMenuRef = document.getElementById('sideMenu');
    sideMenuRef.innerHTML = getSideMenuTemplate();
    sideMenuRef.classList.add('hide--ss-mob');

    let sideMenuMobRef = document.getElementById('sideMenuMob');
    sideMenuMobRef.innerHTML = getSideMenuMobTemplate();
    sideMenuMobRef.classList.add('show--ss-mob');
}




// FORM VALIDATIONS

function getFormElementsArray(formId) {
    let form = document.getElementById(formId);
    let elements = form.elements;
    let elementsArr = Array.from(elements);
    // console.log(elementsArr);
    return elementsArr;
}

function resetForm(formId) {
    document.getElementById(formId).reset();
}

function resetAllInputValidations(formId) {
    invalidFields = [];
    elementsArr = getFormElementsArray(formId);
    elementsArr.forEach(function(e) {
        let fieldWrapper = getFieldWrapperFromId(e.id);
        if(fieldWrapper) {
            fieldWrapper.classList.remove('invalid');
            fieldWrapper.classList.remove('open-select');
        }
    });
}

function setInitialFormState(formId, firstElementId = '', editMode = 'add') {
    // if(editMode == 'add') {
    //     invalidFields = Array.from(requiredFields);
    // }
    resetAllInputValidations(formId);
    getInvalidInputs(formId);
    if(firstElementId != '') {
        let firstElement = document.getElementById(firstElementId);
        firstElement.focus();
    }
}

// function checkFormValidity(formId) {
//     invalidFields = [];
//     elementsArr = getFormElementsArray(formId);
//     elementsArr.forEach(getInvalidInputs);
//     console.log(invalidFields);
// }

function getInvalidInputs(formId) {
    invalidFields = [];
    elementsArr = getFormElementsArray(formId);
    elementsArr.forEach(function(e) {
        let fieldWrapper = getFieldWrapperFromId(e.id);
        if(fieldWrapper) {
            if(! e.checkValidity()) {
                invalidFields.push(e.id)
            }
        }
    });
    console.log(invalidFields);
    console.log(formId);
    setSubmitBtnState(formId);
}

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

function clearInputValidation(event) {
    event.stopPropagation();
    let fieldWrapper = getFieldWrapperFromEvent(event);
    if(fieldWrapper){
        fieldWrapper.classList.remove('invalid');
    }
}

function validateInput(event, option = '') {
    event.stopPropagation();
    let element = event.currentTarget;
    // console.log(element);
    if(option == '') {
        setValidationStyle(element);
        return element.value;
    }
    validateInputOption(element, option);
}

function validateInputOption(element, option) {
    let validationParam = element.getAttribute('data-validation-param');
    console.log(validationParam);
    let item;
    if(option == 'radio-name') {
        item = document.getElementsByName(validationParam)[0];
    } else if (option == 'custom-id') {
        item = document.getElementById(validationParam);
    } else {
        item = element;
    }
    if(option == 'phone') {
        validatePhoneInput(item);
    }
    setValidationStyle(item);
}

function selectCustomSelectOption(event, selectId, optionValue) {
    event.stopPropagation();
    selectInput = document.getElementById(selectId);
    if(event.target.checked) {
        selectInput.value = optionValue;
        // validateCustomSelect(event, selectId);
    }
    toggleSelectOptionsVisibility(event);
    validateInput(event, 'custom-id');  
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

function setValidationStyle(element) {
    getInvalidInputs(element.form.id);
    let fieldWrapper = getFieldWrapperFromId(element.id);
    if(fieldWrapper){
        if (! element.checkValidity()) {
            fieldWrapper.classList.add('invalid');
        } else {
            fieldWrapper.classList.remove('invalid');
        }
    }
}

// function validateCustomSelect(event, selectId) {
//     event.stopPropagation();
//     selectInput = document.getElementById(selectId);
//     console.log(selectInput.value.length);
//     // validateInput(selectId, true);
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
//         getInvalidInputs(formId);
//         return element.value;
//     }
// }


// function xvalidateInput(id, parent = false) {
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


function validateSelectMultiple(id) {
    closeSelectOptions(id);
    let element = document.getElementById(id);
    element.value = '';
    validateInput(id, true);
}

// function closeAllSelectOptions(formId) {
//     for (let index = 0; index < invalidFields.length; index++) {
//         fieldId = invalidFields[index];
//         clearInputValidation(fieldId, true);
//     }
// }

// function resetInput(id) {
//     document.getElementById(id).value = '';
//     clearInputValidation(id)
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
//     element.parentElement.classList.remove('select-open');
// }

function setSubmitBtnState(formId) {
    let submitBtnId = document.getElementById(formId).dataset.submitBtnId;
    let submitBtn = document.getElementById(submitBtnId);
    submitBtn.setAttribute('disabled', '');
    if(invalidFields.length > 0) {
        submitBtn.setAttribute('disabled', '');
    } else {
        submitBtn.removeAttribute('disabled');
    }
    // console.log(invalidFields);
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


function toggleSelectOptionsVisibility(event) {
    event.stopPropagation();
    let element = getFieldWrapperFromEvent(event);
    element.classList.toggle('select-open');
    clearInputValidation(event);
}

// function closeSelectOptionsVisibility(event) {
//     event.stopPropagation();
//     let element = getFieldWrapperFromEvent(event);
//     element.classList.remove('select-open');
// }





// HELPER FUNCTIONS


function reloadPage(event) {
    event.preventDefault();
    location.href = location.pathname;
}

// function getInputValue(formId, property) {
//     let form = document.getElementById(formId);
//     let formData = new FormData(form);
//     let value = formData.get(property);
//     console.log(value);
//     return value;
// }

function getClosestParentElementFromEvent(event, selector = '') {
    let element = event.currentTarget;
    if(element) {
        return element.closest(selector);
    }
    return;
}

function getClosestParentElementFromId(id, selector = '') {
    let element = document.getElementById(id);
    if(element) {
        return element.closest(selector);
    }
    return;
}

function getFieldWrapperFromEvent(event) {
    return getClosestParentElementFromEvent(event, '.field-wrapper');
}

function getFieldWrapperFromId(id) {
    return getClosestParentElementFromId(id, '.field-wrapper');
}


function getTaskIndexFromId(taskId) {
    return tasks.findIndex(task => task.id == taskId);
}

function getContactIndexFromId(contactId) {
    return contacts.findIndex(contact => contact.id == contactId);
}

function getCategoryIndexFromId(categoryId) {
    return categories.findIndex(category => category.id == categoryId);
}


function sortContacts(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

function sortCategories(categories) {
    return categories.sort((a, b) => a.id.localeCompare(b.id));
}

function setTodayAsDateValue(id) {
    document.getElementById(id).valueAsDate = new Date();
}

function getNWord(string, index = 0) {
    let array = string.split(" ");
    return array[index];
}

function getLastWord(string) {
    let array = string.split(" ");
    return array[array.length - 1];
}

function setFirstLetterUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function getInitialsOfFirstAndLastWord(string) {
    let firstWord = getNWord(string);
    let lastWord = getLastWord(string);
    return (firstWord[0] + lastWord[0]).toUpperCase();
}

function getInitialOfLastWord(string) {
    let lastWord = getLastWord(string);
    return lastWord[0].toUpperCase();
}

function getRandomColor(format = 'hex') {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function showAlert(msg, duration = 250) {
    setTimeout(function() { alert(msg) }, duration);
}

function showFloatingMessage(template, msg = '') {
    let element = document.getElementById("floatingMsg");
    if(template == 'addedTask') {
        element.innerHTML = getFloatingMessageTaskAddedTemplate();
    } else {
        element.innerHTML = getFloatingMessageTextTemplate(msg);
    }
    element.classList.remove('hide');
    setTimeout(function() { 
        element.classList.add('hide');
        element.innerHTML = '';
}, 1500);
}



