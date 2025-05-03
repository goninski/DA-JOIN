let activeContactId = '';

function initContacts() {
    getMainTemplates();
    getAllData();
    console.log(contacts);
    if(!contacts) {
        contacts = [];
        console.log('error: contacts undefined !');
    }
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
    let contactsGroupedObj = Map.groupBy(contacts, contact => contact.name[0].toUpperCase());
    // console.log(contactsGroupedObj);
    let contactsGrouped = Array.from(contactsGroupedObj);
    // console.log(contactsGrouped);
    return contactsGrouped;
}

function showContactDetail(event, contactId) {
    event.stopPropagation();
    // console.log(activeContactId);
    if(activeContactId != '' && activeContactId != contactId){
        document.getElementById('listContactId-' + activeContactId).classList.remove('active');
    }
    if(contactId == '') {
        return closeContactDetail(contactId);
    }
    document.getElementById('contactPageInner').classList.add('show-contact-detail');
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
    document.getElementById('contactPageInner').classList.remove('show-contact-detail');
    document.getElementById('floatingContact').innerHTML = '';
    document.getElementById('contactInfo').innerHTML = '';
    if(contactId != '') {
        document.getElementById('listContactId-' + contactId).classList.remove('active');
    }
}


function addNewContact(event) {
    event.stopPropagation();
    formMode = 'add';
    activeContactId = '';
    openContactsForm(formMode);

}

function editContact(event, contactId) {
    event.stopPropagation();
    formMode = 'edit';
    activeContactId = contactId;
    openContactsForm(formMode, activeContactId);
}

function openContactsForm(formMode, contactId = '') {
    resetForm('contactsForm');
    document.getElementById('addContactDialogue').style = '';
    document.getElementById('addNewContactBtnFloating').style = 'display: none;';
    document.body.style = 'overflow: hidden;';
    if(formMode == 'add'){
        setAddContactValues();
    } else {
        setEditContactValues(contactId);
        checkEditFormState('contactsForm');
    }
}

function resetContactsForm(event) {
    event.stopPropagation();
    resetForm('contactsForm');
}

function closeContactsFormDialogue(event) {
    event.stopPropagation();
    resetForm('contactsForm');
    document.getElementById('addContactDialogue').style = 'display: none;';
    document.getElementById('addNewContactBtnFloating').style = '';
    // document.body.style = '';
    formMode = '';
    renderContactList();
    showContactDetail(event, activeContactId);
    // reloadPage(event);
}

function setAddContactValues() {
    document.getElementById('dialogueProfileBatch').innerHTML = '<img src="/assets/icons/profile-placeholder.svg" alt="profile-placeholder">';
    document.getElementById('dialogueTeaser').style = '';
    document.getElementById('dialogueTitle').innerHTML = 'Add Contact';
    document.getElementById('submitBtnWrapper').innerHTML = getAddContactSubmitButtonsTemplate();
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create contact');
    document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Cancel');
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
    document.getElementById('dialogueBtnDelete').innerHTML = getIconTemplateCancel('Cancel');
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Save');
}

function submitContactsForm(event, contactId) {
    event.stopPropagation();
    if(formMode == 'edit') {
        saveContact(event, contactId);
    } else {
        // lastContactId++;
        // contactId = lastContactId;
        contactId = getRandomString();
        createContact(event, contactId);
    }
}

function createContact(event, contactId) {
    event.stopPropagation();
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
    createContactOnFirebase(contact);
    showFloatingMessage('text', 'Contact successfully created');
    setTimeout(function() { 
        closeContactsFormDialogue(event);
    }, 1000);
}

function saveContact(event, contactId) {
    event.stopPropagation();
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

function deleteContact(event, contactId) {
    event.stopPropagation();
    event.preventDefault();
    // deleteContactFromDB(contactId);
    activeContactId = '';
    contacts.splice(getContactIndexFromId(contactId), 1);
    removeDeletedContactsFromTasks(contactId);
    // console.log(contacts);
    saveContactData();
    // reloadPage(event);
    showFloatingMessage('text', 'Contact deleted');
    setTimeout(function() { 
        closeContactsFormDialogue(event);
    }, 1000);
}

function removeDeletedContactsFromTasks(deletedContactId) {
    for (let i = 0; i < tasks.length; i++) {
        let contactIds = tasks[i].contactIds;
        let index = contactIds.indexOf(deletedContactId)
        if(index >= 0) {
            contactIds.splice(index, 1);
        }
    }
}

