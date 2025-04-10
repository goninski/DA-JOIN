let activeContactId = 0;
let requiredContactFields = ['inputName', 'inputEmail'];

function initContacts() {
    getMainTemplates();
    renderContactList();
    addIconsToContactPage();
    // openAddContactDialogue();
}

function addIconsToContactPage() {
    document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Clear');
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

function renderContactDetail(contactId) {
    if(activeContactId > 0) {
        document.getElementById(activeContactId).classList.remove('active');
    }
    activeContactId = contactId;
    document.getElementById(contactId).classList.add('active');
    let contact = contacts[getContactIndexFromID(contactId)];
    document.getElementById('floatingContact').innerHTML = getContactDetailProfileBatchTemplate(contact);
    document.getElementById('contactInfo').innerHTML = getContactDetailInfoTemplate(contact);
}


function addNewContact() {
    let editMode = 'add';
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
    reloadPage(event);
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
    contact.initials = getInitialsOfFirstAndLastWord(contact.name);
    contact.color = getRandomColor();
    contacts.push(contact);
    // console.log(contact);
    saveContactData();
    alert('New contact added');
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
    alert('All changes saved');
}

function deleteContact(contactId, event) {
    contacts.splice(getContactIndexFromID(contactId), 1);
    // console.log(contacts);
    saveContactData();
    reloadPage(event);
    alert('Contact deleted');
}
