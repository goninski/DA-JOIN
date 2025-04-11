function initContacts() {
    getMainTemplates();
    renderContactList();
}

function getContactIndexFromID(contactId) {
    return contacts.findIndex(contact => contact.id == contactId);
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
    contacts.sort((a, b) => a.name.localeCompare(b.name));
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
    let contact = contacts[getContactIndexFromID(contactId)];
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
    setInitalFormState(requiredContactFields, 'inputName', contactsFormMode);
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
    setInitalFormState(requiredContactFields, 'inputName', 'add');
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
    let contact = contacts[getContactIndexFromID(contactId)];
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
    let contact = getAllInputs(event, 'contactsForm');
    console.log(contact);
    if(contact.name.length <= 0) {
        return;
    }
    activeContactId = contactId;
    contact.id = contactId;
    contact.initials = getInitialsOfFirstAndLastWord(contact.name);
    contact.color = getRandomColor();
    contacts.push(contact);
    // console.log(contact);
    saveContactData();
    showAlert('New contact added');
}

function saveContact(contactId, event) {
    let contact = getAllInputs(event, 'contactsForm');
    if(contact.name.length <= 0) {
        return;
    }
    let index = getContactIndexFromID(contactId);
    contacts[index].name = contact.name;
    contacts[index].email = contact.email;
    contacts[index].phone = contact.phone;
    contacts[index].initials = getInitialsOfFirstAndLastWord(contact.name);
    // console.log(contacts[index]);
    saveContactData();
    closeContactsFormDialogue(event);
    showAlert('All changes saved');
}

function deleteContact(contactId, event) {
    contacts.splice(getContactIndexFromID(contactId), 1);
    // console.log(contacts);
    saveContactData();
    activeContactId = 0;
    closeContactsFormDialogue(event);
    // reloadPage(event);
    showAlert('Contact deleted');
}

