let currentContact = {};
let lastListContactId = '';

/**
 * on page load contacts.html
 */
async function initContacts() {
    await getContacts();
    await checkAuth();
    getMainTemplates();
    await renderContactList();
}


/**
 * Render the contact list, alphabetically, grouped by first letter of names
 */
async function renderContactList() {
    if(contacts){
        contactListRef = document.getElementById('contactList');
        contactListRef.innerHTML = '';
        let contactsGrouped = await groupContacts(contacts);
        for (let index = 0; index < contactsGrouped.length; index++) {
            let contactGroupObj = contactsGrouped[index];
            let groupName = contactGroupObj[0];
            let contactGroup = contactGroupObj[1];
            contactListRef.innerHTML += getContactListTemplate(groupName);
            await renderContactGroupItems(contactGroup, groupName);
        }
    }
}


/**
 * Render contact group items within the contact list (subfunction of renderContactList)
 * 
 * @param {object} contactGroup - contactGroup object (of contactsGrouped)
 * @param {string} groupName - name of the group (first letter of name)
 */
async function renderContactGroupItems(contactGroup, groupName) {
    let contactListGroupRef = document.getElementById('contactListGroup-' + groupName);
    contactListGroupRef.innerHTML = '';
    for (let index = 0; index < contactGroup.length; index++) {
        let contact = contactGroup[index];
        contactListGroupRef.innerHTML += getContactListGroupTemplate(contact);
    }
}


/**
 * Helper: returns a alphabetically grouped (by first letter of name) and sorted object for the contact list
 * 
 * @param {object} contacts - the global contacts object
 */
async function groupContacts(contacts) {
    await sortContacts(contacts);
    let contactsGroupedObj = await Map.groupBy(contacts, contact => contact.name[0].toUpperCase());
    let contactsGrouped = Array.from(contactsGroupedObj);
    return contactsGrouped;
}


/**
 * Event handler: show contact details from selected contact in list
 * 
 * @param {event} event - onclick (contact in contact list)
 * @param {string} contactId - id of the current contact
 */
async function showContactDetail(event, contactId) {
    event.stopPropagation();
    if(lastListContactId != '' && lastListContactId != contactId){
        document.getElementById('listContactId-' + lastListContactId).classList.remove('active');
    }
    if(contactId == '') {
        return closeContactDetail(contactId);
    }
    await setContactDetailProps(event, contactId);
}


/**
 * Set contact detail properties (for the contact detail view)
 * 
 * @param {event} event - inherit 
 * @param {string} contactId - id of the current contact
 */
async function setContactDetailProps(event, contactId) {
    if(contacts) {
    document.getElementById('contactPageInner').classList.add('show-contact-detail');
    document.getElementById('listContactId-' + contactId).classList.add('active');
    document.getElementById('btnCloseContactDetails').addEventListener('click', function(event) {
        event.stopPropagation();
        closeContactDetail(contactId);
    });
    lastListContactId = contactId;
    currentContact = await getContactById(contactId);
    document.getElementById('floatingContact').innerHTML = getContactDetailProfileBatchTemplate(currentContact);
    document.getElementById('contactInfo').innerHTML = getContactDetailInfoTemplate(currentContact);
    document.getElementById('contactOptionsMenu').innerHTML = getContactOptionButtons(currentContact);
    }
}


/**
 * Event handler: open contact options menu (mobile view only) 
 * 
 * @param {event} event - click (contact options menu button)
 */
function openContactOptionsMenu(event) {
    event.stopPropagation();
    event.preventDefault();
    document.getElementById('contactOptionsMenu').classList.add('is-open');
}


/**
 * Close current contact details (only for screen < 1180px)
 * 
 * @param {string} contactId - id of the current contact
 */
function closeContactDetail(contactId) {
    document.getElementById('contactPageInner').classList.remove('show-contact-detail');
    document.getElementById('floatingContact').innerHTML = '';
    document.getElementById('contactInfo').innerHTML = '';
    if(contactId != '') {
        document.getElementById('listContactId-' + contactId).classList.remove('active');
    }
}


/**
 * Event handler: open add new contact form
 * 
 * @param {event} event - onclick (add new contact button/s)
 */
async function openAddNewContactForm(event) {
    event.stopPropagation();
    event.preventDefault();
    formMode = 'add';
    currentContact = {};
    await openContactsFormDialogue(formMode);

}


/**
 * Event handler: edit current contact
 * 
 * @param {event} event - onclick (edit button)
 * @param {string} contactId - id of the current contact (currently no in use due global variable)
 */
async function openEditContactForm(event, contactId) {
    event.preventDefault();
    event.stopPropagation();
    formMode = 'edit';
    await openContactsFormDialogue(formMode, currentContact.id);
}


/**
 * Opens the dialogue to add/edit a contact
 * 
 * @param {string} formMode - form mode (add, edit)
 * @param {string} contactId - id of the current contact (empty for new contact)
 */
async function openContactsFormDialogue(formMode, contactId = '') {
    resetForm('contactsForm');
    let dialogue = document.getElementById('addContactDialogue');
    dialogue.classList.add('dialogue-open');
    dialogue.classList.remove('dialogue-closed');
    document.getElementById('addNewContactBtnFloating').style = 'display: none;';
    formMode == 'add' ? await setAddContactValues() : await setEditContactValues(contactId);
    setInitialFormState('contactsForm');
}


/**
 * Event handler: reset contacts form
 * 
 * @param {event} event - onclick (cancel button)
 */
function resetContactsForm(event) {
    event.stopPropagation();
    event.preventDefault();
    currentContact = {};
    resetForm('contactsForm');
}


/**
 * Event handler: close add/edit contacts form dialogue
 * 
 * @param {event} event - click (close button)
 */
async function closeContactsFormDialogue(event) {
    event.stopPropagation();
    resetForm('contactsForm');
    formMode = '';
    document.getElementById('addNewContactBtnFloating').style = '';
    let dialogue = document.getElementById('addContactDialogue');
    dialogue.classList.remove('dialogue-open');
    dialogue.classList.add('dialogue-closed');
    await renderContactList();
    await showContactDetail(event, lastListContactId);
}


/**
 * Set specific values for add contact mode
 */
async function setAddContactValues() {
    document.getElementById('dialogueProfileBatch').innerHTML = '<img src="/assets/icons/profile-placeholder.svg" alt="profile-placeholder">';
    document.getElementById('dialogueProfileBatch').style = 'border: none;';
    document.getElementById('dialogueTeaser').style = '';
    document.getElementById('dialogueTitle').innerHTML = 'Add Contact';
    document.getElementById('submitBtnWrapper').innerHTML = getAddContactSubmitButtonsTemplate();
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create contact');
    document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Cancel');
}


/**
 * Set specific values for edit contact mode
 * 
 * @param {string} contactId - id of the current contact
 */
async function setEditContactValues(contactId) {
    document.getElementById('dialogueTeaser').style = 'display: none;';
    document.getElementById('dialogueTitle').innerHTML = 'Edit Contact';
    currentContact = await getContactById(contactId);
    document.getElementById('dialogueProfileBatch').innerHTML = currentContact.initials;
    document.getElementById('dialogueProfileBatch').style = '--profile-color: '+ currentContact.color;
    document.getElementById('inputName').value = currentContact.name;
    document.getElementById('inputEmail').value = currentContact.email;
    document.getElementById('inputEmail').dataset.valueBeforeUpdate = currentContact.email;
    currentContact.phone ? document.getElementById('inputPhone').value = currentContact.phone : '';
    document.getElementById('submitBtnWrapper').innerHTML = getEditContactSubmitButtonsTemplate(contactId);
    let showDeleteBtn = 0;
    showDeleteBtn ? document.getElementById('dialogueBtnDelete').innerHTML = getIconTemplateCancel('Cancel') : null;
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Save');
}


/**
 * Event handler: calls submit create or save contact on contacts form
 * 
 * @param {event} event - onsubmit (contacts form)
 */
async function submitContactsForm(event) {
    event.stopPropagation();
    event.preventDefault();
    if(formIsValid('contactsForm')) {
        let formInputs = await getFormInputObj('contactsForm');
        let emailUpdateIsValid = await emailUpdateValidation(formInputs.email);
        if(!emailUpdateIsValid) {
            return;
        }
        emailIsUpdated = false;         
        await setContactProperties(currentContact, formInputs);
        formMode == 'edit' ? await submitUpdateContact(event, currentContact) : await submitCreateContact(event, currentContact);
    }
}


/**
 * Email Update Validation
 * 
 * @param {string} email - updated email address
 * @returns {boolean} - true if email update is valid (new address not existing)
 */
async function emailUpdateValidation(email) {
    if(emailIsUpdated && formMode == 'edit') {
        let isInvalid = await isExistingContact(email);
        if(isInvalid) {
            await showFloatingMessage('text', 'This email address already exists !', -1, 'alert');
            return false;
        }
    }
    return true;
}


/**
 * Create contact from contacts form
 * 
 * @param {event} event - inherit (submit contact form)
 */
async function submitCreateContact(event, currentContact) {
    await createContact(currentContact);
    lastListContactId = currentContact.id;
    await showFloatingMessage('text', 'Contact successfully created');
    // setTimeout(function() {closeContactsFormDialogue(event);}, 1000);
    await closeContactsFormDialogue(event);
}


/**
 * Update contact from contacts form
 * 
 * @param {event} event - inherit (submit contact form)
 */
async function submitUpdateContact(event, currentContact) {
    await updateContact(currentContact);
    await showFloatingMessage('text', 'Contact successfully edited');
    // setTimeout(function() {closeContactsFormDialogue(event)}, 1000);
    await closeContactsFormDialogue(event);
}


/**
 * Helper: sets contact properties of the created/edited contact object
 * 
 * @param {object} currentContact - current contact object
 * @param {object} formInputs - current form inputs object
 */
async function setContactProperties(currentContact, formInputs ) {
    console.log(currentContact.email);
    console.log(formInputs.email);
    if(hasLength(formInputs.email)) {
        currentContact.name = formInputs.name;
        console.log(contacts);
        currentContact.email = formInputs.email;
        console.log(contacts);
        currentContact.phone = formInputs.phone;
        console.log(contacts);
    }
}


/**
 * Event handler: delete contact
 * 
 * @param {event} event - onclick (delete button)
 * @param {string} contactId - id of the current contact
 */
async function submitDeleteContact(event, contactId) {
    event.stopPropagation();
    event.preventDefault();
    if(loggedInUserId != 'guest' && loggedInUserId == currentContact.id) {
       return await showFloatingMessage('text', 'Deletion of the logged in user not possible.', -1, 'alert');
    };
    await deleteContact(contactId);
    currentContact = {};
    lastListContactId = ''
    await showFloatingMessage('text', 'Contact deleted');
    setTimeout(() => closeContactsFormDialogue(event), 1000);
}