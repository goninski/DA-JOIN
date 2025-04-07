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



function openAddContactDialogue() {
    document.getElementById('addContactDialogue').style = '';
    document.body.style = 'overflow: hidden;';
}

function closeAddContactDialogue() {
    document.getElementById('addContactDialogue').style = 'display: none;';
    document.body.style = '';
}

function resetFormAddContact(event) {
    resetForm(event, 'addContactForm');
    setInitalFormStateAddContact();
}

function setInitalFormStateAddContact() {
    setInitalFormState(requiredContactFields);
}

function createContact(event) {
    lastContactId++;
    contact = getAllInputs(event, 'addContactForm');
    contact.id = lastContactId;
    contact.initials = getInitialsOfFirstAndLastWord(contact.name);
    contact.color = getRandomColor();
    contacts.push(contact);
    // console.log(contact);
    saveContactData();
}

function addDemoContact(event) {
    lastContactId++;
    contact = {};
    contact.id = lastContactId;
    contact.name = 'P' + contact.id + ' | Vorname Name';
    contact.email = 'mail@domain.com';
    contact.phone = '+49 111 222 33 44';
    contact.initials = 'P'+ contact.id;
    contact.color = getRandomColor();
    contacts.push(contact);
    // console.log(contact);
    saveContactData();
    reloadPage(event);
}

function deleteContact(contactId, event) {
    contacts.splice(getContactIndexFromID(contactId), 1);
    // console.log(contacts);
    saveContactData();
    reloadPage(event);
    alert('Contact deleted');
}
