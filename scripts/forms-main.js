let submitBtnStateMode = 1; // 1=full validation, 2=required
let formMode = '';
let invalidFields = [];
let listboxElements = [];
let currentFieldElements = {};
document.addEventListener('click', documentEventHandlerForms);
document.addEventListener('keydown', documentEventHandlerForms);


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
 * Helper: return FormData
 * 
 * @param {string} formId - id of the form
 */
async function getFormData(formId) {
    let form = document.getElementById(formId);
    let formData = new FormData(form);
    return formData;
}


/**
 * Helper: return formInputs as object
 * 
 * @param {string} formId - id of the form
 */
async function getFormInputObj(formId) {
    let formData = await getFormData(formId);
    let formInputObj = Object.fromEntries(formData);
    return formInputObj;
}


/**
 * Return an array (invalidFields) containing all form element id's with an invalid input
 * 
 * @param {string} formId - id of the form element
 * @param {number} validationMode - 1=full validation, other=required only
 */
function getInvalidInputIds(formId, validationMode = 1) {
    invalidFields = [];
    let formElements = getFormElementsArray(formId);
    formElements.forEach(function(element) {
        let isValidElement = validateElement(element, validationMode);
        if(!isValidElement) {
            invalidFields.push(element.id);
        }
    });
}


/**
 * Document Event handler: close dropdowns on outslide click or ESC
 * 
 * @param {event} event - click, ESC (document)
 */
function documentEventHandlerForms(event) {
    console.log('f) documentEventHandlerForms');
    if( event.key === 'Escape' || event.type === "click" ) {
        closeAllDropdowns(listboxElements);
        focusCurrentCombox(event.target);
        return;
    }
    if( event.key === 'Enter') {
        event.preventDefault();
    }
}


/**
 * Event handler: procedure on element focus
 * 
 * @param {event} event - onfocus (inputs)
 */
function focusInHandler(event) {
    event.stopPropagation();
    let element = event.currentTarget;
    getCurrentFieldElements(element);
    resetInputValidation(event);
}


/**
 * Event handler: procedure on element focus out
 * 
 * @param {event} event - onfocusout (inputs)
 */
function focusOutHandler(event) {
    event.stopPropagation();
    event.preventDefault();
    let element = event.currentTarget;
    (element.dataset.type == 'password') ? togglePasswordVisibility(event) : null;
    submitBtnStateMode === 1 ? validateInput(element, submitBtnStateMode) : null;
}


/**
 * Helper: return an array with all form elements (inputs, selects, buttons)
 * 
 * @param {string} formId - id of the form element
 */
function getFormElementsArray(formId) {
    let form = document.getElementById(formId);
    let elements = form.elements;
    let elementsArr = Array.from(elements);
    return elementsArr;
}


/**
 * Set edit form state
 * 
 * @param {string} formId - id of the form element
 */
async function setInitialFormState(formId) {
    let form = document.getElementById(formId);
    let formElements = getFormElementsArray(formId);
    formElements.forEach(function(element) {
        setPlaceholderStyle(element);
    });
    let topElement = form.querySelector('.top-element');
    topElement ? topElement.scrollIntoView() : null;
    setTimeout(() => formElements[0].focus(), 200);
    setSubmitBtnState(formId);
}


/**
 * Set input validations for an input element
 * 
 * @param {element} element - input element
 */
function validateInput(element) {
    setFieldValidity(element);
    setSubmitBtnState(element.form.id);
}


/**
 * Set validity styles of an input element
 * 
 * @param {element} element - input element
 */
function setFieldValidity(element) {
    let isValidElement = validateElement(element);
    let fieldWrapper = getFieldWrapperFromId(element.id);
    if(fieldWrapper){
        isValidElement ? fieldWrapper.classList.remove('invalid') : fieldWrapper.classList.add('invalid');
    }
    setPlaceholderStyle(element);
}


/**
 * Validate input element
 * 
 * @param {element} element - input element
 * @param {number} validationMode - 1=full validation, other=required only
 * @returns {boolean}
 */
function validateElement(element, validationMode = 1) {
    if(element.hasAttribute('required')) {
        if(element.value.replaceAll(' ', '') == '') {
            return false;
        };
    }
    if(validationMode === 1) {
        if(! element.checkValidity() || ! checkCustomValidation(element)) {
            return false;
        }
    }
    return true;
}


/**
 * Validate custom validations of an input element, can be enhanced
 * 
 * @param {element} element - input element
 * @returns {boolean}
 */
function checkCustomValidation(element) {
    if(element.getAttribute("type") == 'tel') {
        if(element.value.length === 0) return true;
        validatePhoneInput(element);
        return (element.value.length >= 10);
    }
    if(! element.hasAttribute("data-validation-type"))  {
        return true;
    }
    if(element.dataset.validationType == 'required') {
        return (element.value.length > 0);
    }
    if(element.dataset.validationType == 'password-confirmation') {
        return validateConfirmPassword(element);
    }
}


/**
 * Validate and format phone input
 * 
 * @param {element} element - input element
 */
function validatePhoneInput(element) {
    let inputValue = element.value;
    let formattedValue = inputValue;
    let rawValue = inputValue.replaceAll(' ', '');
    if(rawValue.length >= 10){
        if(! inputValue.startsWith("+")) {
            formattedValue = "+49 " + inputValue;
        }
    }
    element.value = formattedValue;
}


/**
 * Set placeholder style for input without placeholder functionality if needed (e.g date)
 * 
 * @param {element} element - input element
 */
function setPlaceholderStyle(element) {
    if(element.hasAttribute('data-placeholder-style')) {
        element.value == '' ? element.dataset.placeholderStyle = 'true' : element.dataset.placeholderStyle = 'false';
    }
}


/**
 * Remove placeholder style for input without placeholder functionality if needed (e.g date)
 * 
 * @param {element} element - input element
 */
function removePlaceholderStyle(event) {
    event.stopPropagation();
    let element = event.currentTarget;
    element.hasAttribute('data-placeholder-style') ? element.dataset.placeholderStyle = 'false' : null;
}


/**
 * Reset validation style of the current element
 * 
 * @param {event} event - inherit
 */
function resetInputValidation(event) {
    let fieldWrapper = getFieldWrapperFromEvent(event);
    fieldWrapper ? fieldWrapper.classList.remove('invalid') : null;
}


/**
 * Set submit button state from event
 * 
 * @param {string} formId - id of the form
 */
function setSubmitBtnStateOnEvent(event) {
    event.stopPropagation();
    let formId = event.currentTarget.form.id;
    setSubmitBtnState(formId);
}


/**
 * Check and set all form inputs validity
 * 
 * @param {string} formId - id of the form
 * @returns {boolean} - true if no invalid fields (full validity check)
 */
function setFormFieldsValidity(formId) {
    console.log(submitBtnStateMode);
    if(submitBtnStateMode === 1) {
        return;
    }
    getInvalidInputIds(formId, 1);
    console.log(invalidFields);
    if(hasLength(invalidFields)) {
        invalidFields.forEach((elementId) => {
            let element = document.getElementById(elementId);
            setFieldValidity(element);
        });
    }
}


/**
 * Set the submit button state of a form
 * 
 * @param {string} formId - id of the form
 * @param {number} validationMode - 1=full validation, other=required only
 */
function setSubmitBtnState(formId, validationMode = 1) {
    validationMode = submitBtnStateMode ? submitBtnStateMode : validationMode;
    getInvalidInputIds(formId, validationMode);
    let form = document.getElementById(formId);
    let submitBtn = form.querySelector('[type="submit"]');
    submitBtn.setAttribute('disabled', '');
    invalidFields.length > 0 ? submitBtn.setAttribute('disabled', '') : submitBtn.removeAttribute('disabled');
}


/**
 * Reset form
 * 
 * @param {string} formId - id of the form element
 */
async function resetForm(formId) {
    let form = document.getElementById(formId);
    form.reset();
    listboxElements = [];
    let formElements = getFormElementsArray(formId);
    formElements.forEach(function(element) {
        resetFormElements(element);
    });
    getInvalidInputIds(formId);
    let topElement = form.querySelector('.top-element');
    topElement ? topElement.scrollIntoView() : null;
    setTimeout(() => formElements[0].focus(), 200);
}


/**
 * Reset a form element
 * 
 * @param {element} element - form element
 */
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
