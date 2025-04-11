let activeContactId = 0;
let requiredContactFields = ['inputName', 'inputEmail'];

function initContacts() {
    getMainTemplates();
    renderContactList();
    addAssetPartsToContactPage();
    // openAddContactDialogue();
}

function addAssetPartsToContactPage() {
    document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Clear');
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create Contact');
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create Contact');
}

function getContactIndexFromID(contactId) {
    return contacts.findIndex(contact => contact.id == contactId);
}

function renderContactList() {
    contactListRef = document.getElementById('contactList');
    contactListRef.innerHTML = '';
    let contactsSorted = sortContacts(contacts);
    for (let index = 0; index < contactsSorted.length; index++) {
        contactListRef.innerHTML += getContactListTemplate(contactsSorted[index]);
    }
}

function sortContacts(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

function showContactDetail(contactId) {
    console.log(activeContactId);
    if(activeContactId > 0 && activeContactId != contactId){
        document.getElementById('listContactId-' + activeContactId).classList.remove('active');
    }
    if(contactId == 0) {
        closeContactDetail(contactId);
        return;
    }
    activeContactId = contactId;
    console.log(activeContactId);
    document.getElementById('contactsMainWrapper').classList.add('show-contact-detail');
    document.getElementById('listContactId-' + contactId).classList.add('active');
    document.getElementById('btnCloseContactDetails').addEventListener('click', function(event) {
        event.stopPropagation();
        closeContactDetail();
    });
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
    let editMode = 'add';
    activeContactId = 0;
    openAddContactForm(editMode);
}

function editContact(contactId) {
    let editMode = 'edit';
    openAddContactForm(editMode, contactId);
}

function openAddContactForm(editMode, contactId = 0) {
    document.getElementById('addContactDialogue').style = '';
    document.body.style = 'overflow: hidden;';
    setInitalFormState(requiredContactFields, 'inputName', editMode);
    if(editMode == 'add'){
        setAddContactValues();
    } else {
        setEditContactValues(contactId);
    }
}

function closeAddContactDialogue(event) {
    event.stopPropagation();
    document.getElementById('addContactDialogue').style = 'display: none;';
    document.body.style = '';
    renderContactList();
    showContactDetail(activeContactId);
    // reloadPage(event);
}

function resetFormAddContact(event) {
    event.stopPropagation();
    resetForm('addContactForm');
    setInitalFormState(requiredContactFields, 'inputName', 'add');
    event.preventDefault();
}

function setAddContactValues() {
    document.getElementById('dialogueProfileBatch').innerHTML = '<img src="/assets/icons/profile-placeholder.svg" alt="profile-placeholder">';
    document.getElementById('dialogueTeaser').style = '';
    document.getElementById('dialogueTitle').innerHTML = 'Add Contact';
    document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Clear');
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create Contact');
    addEventsToAddContactForm();
}

function setEditContactValues(contactId) {
    document.getElementById('dialogueTeaser').style = 'display: none;';
    document.getElementById('dialogueTitle').innerHTML = 'Edit Contact';
    document.getElementById('btnReset').innerHTML = 'Delete';
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Save');
    let contact = contacts[getContactIndexFromID(contactId)];
    document.getElementById('dialogueProfileBatch').innerHTML = contact.initials;
    document.getElementById('dialogueProfileBatch').style = '--profile-color: violet;';
    document.getElementById('inputName').value = contact.name;
    document.getElementById('inputEmail').value = contact.email;
    document.getElementById('inputPhone').value = contact.phone;
    addEventsToEditContactForm(contactId);
}

function addEventsToAddContactForm() {
    document.getElementById('btnReset').addEventListener('click', function(event) {
        // event.preventDefault();
        event.stopPropagation();
        resetFormAddContact(event);
    });
    document.getElementById('addContactForm').addEventListener('submit', function (event) {
        event.stopPropagation();
        createContact(event)
    });
}

function addEventsToEditContactForm(contactId) {
    contactId = contactId;
    document.getElementById('btnReset').addEventListener('click', function(event, contactId) {
        event.stopPropagation();
        deleteContact(contactId, event);
    });
    document.getElementById('addContactForm').addEventListener('submit', function(event) {
        event.stopPropagation();
        saveContact(contactId, event)
    });
}

function createContact(event) {
    let contact = getAllInputs(event, 'addContactForm');
    console.log(contact);
    if(contact.name.length <= 0) {
        return;
    }
    lastContactId++;
    contact.id = lastContactId;
    activeContactId = lastContactId;
    contact.initials = getInitialsOfFirstAndLastWord(contact.name);
    contact.color = getRandomColor();
    contacts.push(contact);
    // console.log(contact);
    saveContactData();
    showAlert('New contact added');
}

function saveContact(contactId, event) {
    let contact = getAllInputs(event, 'addContactForm');
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
    closeAddContactDialogue(event);
    showAlert('All changes saved');
}

function deleteContact(contactId, event) {
    contacts.splice(getContactIndexFromID(contactId), 1);
    // console.log(contacts);
    saveContactData();
    activeContactId = 0;
    closeAddContactDialogue(event);
    // reloadPage(event);
    showAlert('Contact deleted');
}

