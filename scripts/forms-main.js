let formMode = '';
let invalidFields = [];
let listboxElements = [];
let currentFieldElements = {};
let emailIsUpdated = false;
document.addEventListener('click', documentEventHandlerForms);
document.addEventListener('keydown', documentEventHandlerForms);


/**
 * Document Event handler: close dropdowns on outslide click or ESC
 * 
 * @param {event} event - click, ESC (document)
 */
function documentEventHandlerForms(event) {
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
    validateInput(element);
}


/**
 * Event handler: procedure on element input
 * 
 * @param {event} event - oninput (inputs)
 */
function onInputHandler(event) {
    event.stopPropagation();
    let formId = event.currentTarget.form.id;
    setSubmitBtnState(formId);
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
 */
async function getInvalidInputIds(formId) {
    invalidFields = [];
    let formElements = getFormElementsArray(formId);
    formElements.forEach(function(element) {
        let isValidElement = validateElement(element);
        !isValidElement ? invalidFields.push(element.id) : null;
    });
}


/**
 * Checks if all form inputs are valid
 * 
 * @param {string} formId - id of the form element
 * @returns {boolean} - true if valid
 */
function formIsValid(formId) {
    getInvalidInputIds(formId);
    return !hasLength(invalidFields) ? true : false;
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
 * Set initial form state
 * 
 * @param {string} formId - id of the form element
 */
function setInitialFormState(formId) {
    let formElements = getFormElementsArray(formId);
    formElements.forEach((element) => setPlaceholderStyle(element));
    setSubmitBtnState(formId);
    setInitialFocus(formId, formElements);
}


/**
 * Reset form
 * 
 * @param {string} formId - id of the form element
 */
function resetForm(formId) {
    let form = document.getElementById(formId);
    form.reset();
    listboxElements = [];
    let formElements = getFormElementsArray(formId);
    formElements.forEach((element) => resetFormElements(element));
    getInvalidInputIds(formId);
    setInitialFocus(formId, formElements);
}


/**
 * Set initial focus/scroll view
 * 
 * @param {string} formId - id of the form element
 * @param {Elements} formElements - all form elements
 */
function setInitialFocus(formId, formElements = null) {
    formElements ? setTimeout(() => formElements[0].focus({preventScroll: true}), 125) : null;
    let topScrollWrapper = document.querySelector('.top-scroll-wrapper');
    topScrollWrapper ? topScrollWrapper.scrollTop = 0 : null;
    let topElement = document.getElementById(formId).querySelector('.top-element');
    topElement ? topElement.scrollIntoView() : null;
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
    setPlaceholderStyle(element);
    if(fieldWrapper){
        isValidElement ? fieldWrapper.classList.remove('invalid') : fieldWrapper.classList.add('invalid');
    }
}


/**
 * Set validity styles on all input elements (currently not in use)
 * 
 * @param {string} formId - id of the form
 */
function setFormFieldsValidity(formId) {
    if(formIsValid(formId)) {
        invalidFields.forEach((elementId) => {
            let element = document.getElementById(elementId);
            setFieldValidity(element);
        });
    }
}


/**
 * Validate input element
 * 
 * @param {element} element - input element
 * @param {number} ) - 1=full validation, other=required only
 * @returns {boolean}
 */
function validateElement(element) {
    if(element.hasAttribute('required')) {
        if(element.value.replaceAll(' ', '') == '') {
            return false;
        };
    }
    if(! element.checkValidity() || ! checkCustomValidation(element)) {
        return false;
    }
    if(element.hasAttribute('data-value-before-update')) {
        emailIsUpdated = (element.value != element.dataset.valueBeforeUpdate);
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
    if(rawValue.length >= 9){
        formattedValue = !inputValue.startsWith("+") ? "+49 " + inputValue : formattedValue;
    }
    element.value = formattedValue;
}


/**
 * Set custom placeholder styles and inital alerts
 * 
 * @param {element} element - input element
 */
function setPlaceholderStyle(element) {
    if(element.hasAttribute('data-placeholder-style')) {
        element.value.length > 0 ? element.dataset.placeholderStyle = 'false' : element.dataset.placeholderStyle = 'true';
    }
    setInitialAlert(element);
}


/**
 * Set initial alert
 * 
 * @param {element} element - input element
 */
function setInitialAlert(element, event = null) {
    if(event) {
        event.stopPropagation();
        element = event.currentTarget;
    }
    if(element.hasAttribute('data-initial-alert')) {
        let isValidElement = validateElement(element);
        getCurrentFieldElements(element);
        currentFieldElements.fieldWrapper.classList.add('initial');
        isValidElement ? currentFieldElements.fieldWrapper.classList.remove('initial') : null;
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
    fieldWrapper ? fieldWrapper.classList.remove('invalid', 'fail') : null;
    setPlaceholderStyle(event.currentTarget);
}


/**
 * Set the submit button state of a form
 * 
 * @param {string} formId - id of the form
 */
function setSubmitBtnState(formId) {
    let form = document.getElementById(formId);
    let submitBtn = form.querySelector('[type="submit"]');
    if(submitBtn) {
        submitBtn.setAttribute('disabled', '');
        formIsValid(formId) ? submitBtn.removeAttribute('disabled') : submitBtn.setAttribute('disabled', '');
    }
}


