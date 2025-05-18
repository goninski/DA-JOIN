let currentContact = {};
let lastListContactId = '';

async function initContacts() {
    getMainTemplates();
    await getContacts();
    await checkAuth();
    // await sortContacts(contacts);
    await renderContactList();
}


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

async function renderContactGroupItems(contactGroup, groupName) {
    let contactListGroupRef = document.getElementById('contactListGroup-' + groupName);
    contactListGroupRef.innerHTML = '';
    for (let index = 0; index < contactGroup.length; index++) {
        let contact = contactGroup[index];
        // console.log(contact);
        contactListGroupRef.innerHTML += getContactListGroupTemplate(contact);
    }
}

async function groupContacts(contacts) {
    await sortContacts(contacts);
    let contactsGroupedObj = await Map.groupBy(contacts, contact => contact.name[0].toUpperCase());
    // console.log(contactsGroupedObj);
    let contactsGrouped = Array.from(contactsGroupedObj);
    // console.log(contactsGrouped);
    return contactsGrouped;
}

async function showContactDetail(event, contactId) {
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
        closeContactDetail();
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

function closeContactDetail(contactId) {
    document.getElementById('contactPageInner').classList.remove('show-contact-detail');
    document.getElementById('floatingContact').innerHTML = '';
    document.getElementById('contactInfo').innerHTML = '';
    if(contactId != '') {
        document.getElementById('listContactId-' + contactId).classList.remove('active');
    }
}

async function openAddNewContactForm(event) {
    event.stopPropagation();
    formMode = 'add';
    currentContact = {};
    await openContactsForm(formMode);

}

async function openEditContactForm(event, contactId) {
    event.stopPropagation();
    formMode = 'edit';
    // lastListContactId = contactId;
    await openContactsForm(formMode, currentContact.id);
}

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
        await checkEditFormState('contactsForm');
    }
}

function resetContactsForm(event) {
    event.stopPropagation();
    event.preventDefault();
    currentContact = {};
    resetForm('contactsForm');
}

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


async function setAddContactValues() {
    document.getElementById('dialogueProfileBatch').innerHTML = '<img src="/assets/icons/profile-placeholder.svg" alt="profile-placeholder">';
    document.getElementById('dialogueTeaser').style = '';
    document.getElementById('dialogueTitle').innerHTML = 'Add Contact';
    document.getElementById('submitBtnWrapper').innerHTML = getAddContactSubmitButtonsTemplate();
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create contact');
    document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Cancel');
}

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

async function submitContactsForm(event) {
    event.stopPropagation();
    event.preventDefault();
    formMode == 'edit' ? await submitUpdateContact(event) : await submitCreateContact(event);
}

async function submitCreateContact(event) {
    event.stopPropagation();
    let formInputs = await getFormInputObj('contactsForm');
    await setContactProperties(currentContact, formInputs);
    await createContact(currentContact);
    // resetAddContactForm(event);
    await showFloatingMessage('text', 'Contact successfully created');
    setTimeout(function() {closeContactsFormDialogue(event);}, 1000);
}

async function submitUpdateContact(event) {
    event.stopPropagation();
    let formInputs = await getFormInputObj('contactsForm');
    await setContactProperties(currentContact, formInputs);
    await updateContact(currentContact);
    await showFloatingMessage('text', 'Contact successfully edited');
    setTimeout(function() {closeContactsFormDialogue(event)}, 1000);
}

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

async function submitDeleteContact(event, contactId) {
    event.stopPropagation();
    event.preventDefault();
    await deleteContact(contactId);
    currentContact = {};
    await showFloatingMessage('text', 'Contact deleted');
    setTimeout(function() {closeContactsFormDialogue(event);}, 1000);
    location.reload();
}

