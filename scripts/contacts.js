let activeContactId = '';

async function initContacts() {
    getMainTemplates();
    await getUserData();
    // console.log(contacts);
    // if(!contacts) {
    //     contacts = [];
    //     console.log('error: contacts undefined !');
    // }
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
    // console.log(activeContactId);
    // console.log(contactId);
    if(activeContactId != '' && activeContactId != contactId){
        document.getElementById('listContactId-' + activeContactId).classList.remove('active');
        // console.log('condition A');
        }
    if(contactId == '') {
        // console.log('condition B');
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
    // console.log(contactId);
    // console.log(contacts);
    let index = await getContactIndexFromId(contactId);
    // console.log(index);
    let contact = contacts[index];
    // console.log(contact);
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


async function addNewContact(event) {
    event.stopPropagation();
    formMode = 'add';
    activeContactId = '';
    await openContactsForm(formMode);

}

async function editContact(event, contactId) {
    event.stopPropagation();
    formMode = 'edit';
    activeContactId = contactId;
    await openContactsForm(formMode, activeContactId);
}

async function openContactsForm(formMode, contactId = '') {
    await resetForm('contactsForm');
    document.getElementById('addContactDialogue').style = '';
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
    resetForm('contactsForm');
}

async function closeContactsFormDialogue(event) {
    event.stopPropagation();
    resetForm('contactsForm');
    document.getElementById('addContactDialogue').style = 'display: none;';
    document.getElementById('addNewContactBtnFloating').style = '';
    // document.body.style = '';
    formMode = '';
    await renderContactList();
    await showContactDetail(event, activeContactId);
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

async function submitContactsForm(event, contactId) {
    event.stopPropagation();
    if(formMode == 'edit') {
        await submitUpdateContact(event, contactId);
    } else {
        contactId = await getNewContactId();
        // contactId = getRandomString();
        await submitCreateContact(event, contactId);
    }
}

async function submitCreateContact(event, contactId) {
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
    await sortContacts(contacts);
    await createContact(contact);
    await showFloatingMessage('text', 'Contact successfully created');
    setTimeout(function() { 
        closeContactsFormDialogue(event);
    }, 1000);
}

async function submitUpdateContact(event, contactId) {
    event.stopPropagation();
    let formInputs = getFormInputObj(event, 'contactsForm');
    if(formInputs.name.length <= 0) {
        return;
    }
    let index = await getContactIndexFromId(contactId);
    contacts[index].name = formInputs.name;
    contacts[index].email = formInputs.email;
    contacts[index].phone = formInputs.phone;
    contacts[index].initials = getInitialsOfFirstAndLastWord(formInputs.name);
    await sortContacts(contacts);
    let contact = contacts[index];
    // console.log(contact);
    await updateContact(contact);
    await showFloatingMessage('text', 'Contact successfully edited');
    setTimeout(function() { 
        closeContactsFormDialogue(event);
    }, 1000);
}

async function submitDeleteContact(event, contactId) {
    event.stopPropagation();
    event.preventDefault();
    await deleteContact(contactId);
    let index = await getContactIndexFromId(contactId);
    contacts.splice(index, 1);
    activeContactId = '';
    await removeDeletedContactsFromTasks(contactId);
    await showFloatingMessage('text', 'Contact deleted');
    setTimeout(function() { 
        closeContactsFormDialogue(event);
    }, 1000);
    // reloadPage(event);
}


async function removeDeletedContactsFromTasks(deletedContactId) {
    for (let i = 0; i < tasks.length; i++) {
        task = tasks[i]
        // let contactIds = tasks[i].contactIds;
        let index = task.contactIds.indexOf(deletedContactId)
        if(index >= 0) {
            task.contactIds.splice(index, 1);
        }
        await saveTaskToDB(task, 'edit');
        saveTasksToLS();
    }

}

