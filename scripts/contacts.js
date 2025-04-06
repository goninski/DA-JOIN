let activeContactId = 0;

function initContacts() {
    getMainTemplates();
    renderContactList();
}

// let contactList = contacts.reduce(testovic(accum, element));

// function testovic(accum, element) {
//     let groupLetter = element.name[0];
//     if( !accum[groupLetter] ) {
//         accum[groupLetter] = { "groupLetter", "record": [element]};
//     }
// }

// console.log(contactList);

function getContactIndexFromID(contactId) {
    return contacts.findIndex(contact => contact.id == contactId);
}

function renderContactList() {
    contactListRef = document.getElementById('contactList');
    contactListRef.innerHTML = '';
    for (let index = 0; index < contacts.length; index++) {
        contactListRef.innerHTML += getContactListTemplate(contacts[index]);
    }
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

function deleteContact(contactId, event) {
    contacts.splice(getContactIndexFromID(contactId), 1);
    // console.log(contacts);
    saveContactData();
    reloadPage(event);
    alert('Contact deleted');
}
