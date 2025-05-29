let currentContact = {};
let lastListContactId = '';


/**
 * on page load contacts.html
 */
async function initContacts() {
    getMainTemplates();
    setActiveNavLinkStyles('IconContacts');
    await getContacts();
    await checkAuth();
    // await sortContacts(contacts);
    await renderContactList();
}


/**
 * Render the contact list, alphabetically, grouped by first letter of names
 */
async function renderContactList() {
    contactListRef = document.getElementById('contactList');
    contactListRef.innerHTML = '';
    let contactsGrouped = await groupContacts(contacts);
    for (let index = 0; index < contactsGrouped.length; index++) {
        let contactGroupObj = contactsGrouped[index];
        // console.log(contactGroupObj);
        let groupName = contactGroupObj[0];
        let contactGroup = contactGroupObj[1];
        contactListRef.innerHTML += getContactListTemplate(groupName);
        await renderContactGroupItems(contactGroup, groupName);
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
        // console.log(contact);
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
    // console.log(contactsGroupedObj);
    let contactsGrouped = Array.from(contactsGroupedObj);
    // console.log(contactsGrouped);
    return contactsGrouped;
}


/**
 * Event handler: show contact details from selected contact in list
 * 
 * @param {event} event - onclick (contact in contact list)
 * @param {string} contactId - id of the current contact
 */
async function showContactDetail(event, contactId) {
    console.log(contactId);
    // return;
    event.stopPropagation();
    if(lastListContactId != '' && lastListContactId != contactId){
        document.getElementById('listContactId-' + lastListContactId).classList.remove('active');
        // console.log('condition A');
    }
    if(contactId == '') {
        return closeContactDetail(contactId);
    }
    document.getElementById('contactPageInner').classList.add('show-contact-detail');
    document.getElementById('listContactId-' + contactId).classList.add('active');
    document.getElementById('btnCloseContactDetails').addEventListener('click', function(event) {
        event.stopPropagation();
        closeContactDetail(contactId);
    });
    lastListContactId = contactId;
    // console.log(lastListContactId);
    // console.log(contactId);
    // console.log(contacts);
    // console.log(index);
    let index = await getContactIndexFromId(contactId);
    currentContact = contacts[index];
    // console.log(contact);
    document.getElementById('floatingContact').innerHTML = getContactDetailProfileBatchTemplate(currentContact);
    document.getElementById('contactInfo').innerHTML = getContactDetailInfoTemplate(currentContact);
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
    formMode = 'add';
    currentContact = {};
    await openContactsForm(formMode);

}


/**
 * Event handler: edit current contact
 * 
 * @param {event} event - onclick (edit button)
 * @param {string} contactId - id of the current contact (currently no in use due global variable)
 */
async function openEditContactForm(event, contactId) {
    event.stopPropagation();
    formMode = 'edit';
    // lastListContactId = contactId;
    await openContactsForm(formMode, currentContact.id);
}


/**
 * Opens the dialogue to add/edit a contact
 * 
 * @param {string} formMode - form mode (add, edit)
 * @param {string} contactId - id of the current contact (empty for new contact)
 */
async function openContactsForm(formMode, contactId = '') {
    await resetForm('contactsForm');
    let dialogue = document.getElementById('addContactDialogue');
    await runSlideInAnimation(dialogue);
    document.getElementById('addNewContactBtnFloating').style = 'display: none;';
    document.body.style = 'overflow: hidden;';
    if(formMode == 'add'){
        await setAddContactValues();
    } else {
        await setEditContactValues(contactId);
    }
    await setInitialFormState('contactsForm');
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
    let dialogue = document.getElementById('addContactDialogue');
    document.getElementById('addNewContactBtnFloating').style = '';
    // document.body.style = '';
    await runSlideOutAnimation(dialogue, 200);
    await renderContactList();
    await showContactDetail(event, lastListContactId);
    // reloadPage(event);
}


/**
 * Set specific values for add contact mode
 */
async function setAddContactValues() {
    document.getElementById('dialogueProfileBatch').innerHTML = '<img src="/assets/icons/profile-placeholder.svg" alt="profile-placeholder">';
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
    let index = await getContactIndexFromId(contactId);
    let contact = contacts[index];
    document.getElementById('dialogueProfileBatch').innerHTML = contact.initials;
    document.getElementById('dialogueProfileBatch').style = '--profile-color: violet;';
    document.getElementById('inputName').value = contact.name;
    document.getElementById('inputEmail').value = contact.email;
    contact.phone ? document.getElementById('inputPhone').value = contact.phone : '';
    document.getElementById('submitBtnWrapper').innerHTML = getEditContactSubmitButtonsTemplate(contactId);
    // document.getElementById('dialogueBtnDelete').innerHTML = getIconTemplateCancel('Cancel');
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
    formMode == 'edit' ? await submitUpdateContact(event) : await submitCreateContact(event);
}


/**
 * Create contact from contacts form
 * 
 * @param {event} event - inherit (submit contact form)
 */
async function submitCreateContact(event) {
    event.stopPropagation();
    let formInputs = await getFormInputObj('contactsForm');
    await setContactProperties(currentContact, formInputs);
    await createContact(currentContact);
    lastListContactId = currentContact.id;
    // resetAddContactForm(event);
    await showFloatingMessage('text', 'Contact successfully created');
    setTimeout(function() {closeContactsFormDialogue(event);}, 1000);
}


/**
 * Update contact from contacts form
 * 
 * @param {event} event - inherit (submit contact form)
 */
async function submitUpdateContact(event) {
    event.stopPropagation();
    let formInputs = await getFormInputObj('contactsForm');
    await setContactProperties(currentContact, formInputs);
    await updateContact(currentContact);
    await showFloatingMessage('text', 'Contact successfully edited');
    setTimeout(function() {closeContactsFormDialogue(event)}, 1000);
}


/**
 * Helper: sets contact properties of the created/edited contact object
 * 
 * @param {object} currentContact - current contact object
 * @param {object} formInputs - current form inputs object
 */
async function setContactProperties(currentContact, formInputs ) {
    if(hasLength(formInputs.name)) {
        currentContact.name = formInputs.name;
        currentContact.email = formInputs.email;
        currentContact.phone = formInputs.phone;
    } else {
        console.log('error: no form inputs !');
    }
    console.log(currentContact);
    console.log(contacts);
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
    await deleteContact(contactId);
    currentContact = {};
    await showFloatingMessage('text', 'Contact deleted');
    setTimeout(function() {closeContactsFormDialogue(event);}, 1000);
    location.reload();
}

