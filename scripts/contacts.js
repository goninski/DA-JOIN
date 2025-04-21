function initContacts() {
    getMainTemplates();
    renderContactList();
}

function renderContactList() {
    contactListRef = document.getElementById('contactList');
    contactListRef.innerHTML = '';
    let contactsGrouped = groupContacts(contacts);
    for (let index = 0; index < contactsGrouped.length; index++) {
        let contactGroupObj = contactsGrouped[index];
        // console.log(contactGroupObj);
        let groupName = contactGroupObj[0];
        let contactGroup = contactGroupObj[1];
        contactListRef.innerHTML += getContactListTemplate(groupName);
        renderContactGroupItems(contactGroup, groupName);
    }
}

function renderContactGroupItems(contactGroup, groupName) {
    let contactListGroupRef = document.getElementById('contactListGroup-' + groupName);
    contactListGroupRef.innerHTML = '';
    for (let index = 0; index < contactGroup.length; index++) {
        let contact = contactGroup[index];
        // console.log(contact);
        contactListGroupRef.innerHTML += getContactListGroupTemplate(contact);
    }
}

function groupContacts(contacts) {
    sortContacts(contacts);
    let contactsGroupedObj = Map.groupBy(contacts, contact => contact.name[0]);
    // console.log(contactsGroupedObj);
    let contactsGrouped = Array.from(contactsGroupedObj);
    // console.log(contactsGrouped);
    return contactsGrouped;
}

function showContactDetail(contactId) {
    // console.log(activeContactId);
    if(activeContactId > 0 && activeContactId != contactId){
        document.getElementById('listContactId-' + activeContactId).classList.remove('active');
    }
    if(contactId == 0) {
        return closeContactDetail(contactId);
    }
    document.getElementById('contactsMainWrapper').classList.add('show-contact-detail');
    document.getElementById('listContactId-' + contactId).classList.add('active');
    document.getElementById('btnCloseContactDetails').addEventListener('click', function(event) {
        event.stopPropagation();
        closeContactDetail();
    });
    activeContactId = contactId;
    // console.log(activeContactId);
    let contact = contacts[getContactIndexFromId(contactId)];
    document.getElementById('floatingContact').innerHTML = getContactDetailProfileBatchTemplate(contact);
    document.getElementById('contactInfo').innerHTML = getContactDetailInfoTemplate(contact);
}

function closeContactDetail(contactId) {
    document.getElementById('contactsMainWrapper').classList.remove('show-contact-detail');
    document.getElementById('floatingContact').innerHTML = '';
    document.getElementById('contactInfo').innerHTML = '';
    if(contactId > 0) {
        document.getElementById('listContactId-' + contactId).classList.remove('active');
    }
}


function addNewContact() {
    contactsFormMode = 'add';
    activeContactId = 0;
    openContactsForm(contactsFormMode);
}

function editContact(contactId) {
    contactsFormMode = 'edit';
    activeContactId = contactId;
    openContactsForm(contactsFormMode, activeContactId);
}

function openContactsForm(contactsFormMode, contactId = 0) {
    document.getElementById('addContactDialogue').style = '';
    document.body.style = 'overflow: hidden;';
    setInitialFormState('contactsForm', 'inputName', contactsFormMode);
    if(contactsFormMode == 'add'){
        setAddContactValues();
    } else {
        setEditContactValues(contactId);
    }
}

function closeContactsFormDialogue(event) {
    event.stopPropagation();
    resetContactsForm(event);
    document.getElementById('addContactDialogue').style = 'display: none;';
    // document.body.style = '';
    contactsFormMode = '';
    renderContactList();
    showContactDetail(activeContactId);
    // reloadPage(event);
}

function resetContactsForm(event) {
    event.stopPropagation();
    resetForm('contactsForm');
    setInitialFormState('contactsForm', 'inputName', 'add');
    event.preventDefault();
}

function setAddContactValues() {
    document.getElementById('dialogueProfileBatch').innerHTML = '<img src="/assets/icons/profile-placeholder.svg" alt="profile-placeholder">';
    document.getElementById('dialogueTeaser').style = '';
    document.getElementById('dialogueTitle').innerHTML = 'Add Contact';
    document.getElementById('submitBtnWrapper').innerHTML = getAddContactSubmitButtonsTemplate();
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create contact');
    document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Clear');
}

function setEditContactValues(contactId) {
    document.getElementById('dialogueTeaser').style = 'display: none;';
    document.getElementById('dialogueTitle').innerHTML = 'Edit Contact';
    let contact = contacts[getContactIndexFromId(contactId)];
    document.getElementById('dialogueProfileBatch').innerHTML = contact.initials;
    document.getElementById('dialogueProfileBatch').style = '--profile-color: violet;';
    document.getElementById('inputName').value = contact.name;
    document.getElementById('inputEmail').value = contact.email;
    document.getElementById('inputPhone').value = contact.phone;
    document.getElementById('submitBtnWrapper').innerHTML = getEditContactSubmitButtonsTemplate(contactId);
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Save');
}

function submitContactsForm(event, contactId) {
    event.stopPropagation();
    if(contactsFormMode == 'edit') {
        saveContact(contactId, event);
    } else {
        lastContactId++;
        contactId = lastContactId;
        createContact(contactId, event);
    }
}

function createContact(contactId, event) {
    let formInputs = getFormInputObj(event, 'contactsForm');
    console.log(formInputs);
    if(formInputs.name.length <= 0) {
        return;
    }
    activeContactId = contactId;
    let contact = {};
    contact.id = contactId;
    contact.name = formInputs.name;
    contact.email = formInputs.email;
    contact.phone = formInputs.phone;
    contact.initials = getInitialsOfFirstAndLastWord(formInputs.name);
    contact.color = getRandomColor();
    contacts.push(contact);
    sortContacts(contacts);
    // console.log(contact);
    saveContactData();
    showFloatingMessage('text', 'Contact successfully created');
    setTimeout(function() { 
        closeContactsFormDialogue(event);
    }, 1000);
}

function saveContact(contactId, event) {
    let formInputs = getFormInputObj(event, 'contactsForm');
    if(formInputs.name.length <= 0) {
        return;
    }
    let index = getContactIndexFromId(contactId);
    let contact = {};
    contacts[index].name = formInputs.name;
    contacts[index].email = formInputs.email;
    contacts[index].phone = formInputs.phone;
    contacts[index].initials = getInitialsOfFirstAndLastWord(formInputs.name);
    sortContacts(contacts);
    // console.log(contacts[index]);
    saveContactData();
    showFloatingMessage('text', 'Contact successfully edited');
    setTimeout(function() { 
        closeContactsFormDialogue(event);
    }, 1000);
}

function deleteContact(contactId, event) {
    contacts.splice(getContactIndexFromId(contactId), 1);
    // console.log(contacts);
    saveContactData();
    activeContactId = 0;
    // reloadPage(event);
    showFloatingMessage('text', 'Contact deleted');
    setTimeout(function() { 
        closeContactsFormDialogue(event);
    }, 1000);
}

