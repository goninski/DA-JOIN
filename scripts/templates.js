function getHeaderTemplate() {
    return `
        <div class="ct-container flex-row gap justify-between align-center flex-wrap--ss-mob py">
            <p class="header-title">Kanban Project Management Tool</p>
            <a id="help-icon" href="help.html">
                <img class="help-icon" src="./assets/icons/Property 1=help.svg"></img>
            </a>
            <img
        </div>
    `
}

function getSideMenuTemplate() {
    return `
        <div class="sidebar-logo">
             <a href="summary.html" style="text-decoration: none; border: none;">
                 <img src="./assets/img/Capa 1.png" alt="join logo">
             </a>
        </div>
        <div class="sidebar-buttons">
            <a class="nav-button" href="summary.html">
                <img src="./assets/icons/Property 1=Summary.svg">Summary
            </a>
            <a class="nav-button" href="add-task.html">
                <img src="./assets/icons/Property 1=Add task.svg">Add Task
            </a>
            <a class="nav-button" href="board.html">
                <img src="./assets/icons/Property 1=Board.svg">Board
            </a>
            <a class="nav-button" href="contacts.html">
                <img src="./assets/icons/Property 1=Contacts.svg">Contacts
            </a>
        </div>
        <div class="sidebar-footer">
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="legal-notice.html">Legal notice</a>
            <div class="flex-col gap-05 mt-10"> 
                <a href="temp-assets-library.html" style="color: #ccc;">Asset Library</a>
                <button onclick="setDemoData()" style="text-align: left; color: #ccc";>Testdata Reset</button>
            </div>
        </div>
    `
}

function getSideMenuMobTemplate() {
    return `
        <a href="./">Home</a>
    `
}





function getContactListTemplate(contact) {
    let letter = ' ' + ' ' + '&ensp;' + getInitialOfLastWord(contact.name);
    return `
        <h3 class="contact-letter flex-row align-center">${letter}</h3>
        <li id="${contact.id}" class="contact-item flex-row align-center" onclick="renderContactDetail(${contact.id})">
            <div class="profile-batch" style="--profile-color: ${contact.color};">${contact.initials}</div>
            <div class="contact-details flex-col">
                <div class="name">${contact.name}</div>
                <div class="email">${contact.email}</div>
            </div>
        </li>
    `
}

function getContactDetailProfileBatchTemplate(contact) {
    return `
        <div class="profile-batch profile-batch-large" style="--profile-color: ${contact.color};">${contact.initials}</div>
        <div class="profile-title flex-col">
            <h2 class="">${contact.name}</h2>                        
            <div class="edit-buttons flex-row align-center">
                <button onclick="editContact(${contact.id})"><img src="assets/icons/edit.svg" alt="edit-icon">Edit</button>
                <button onclick="deleteContact(${contact.id}, event)"><img src="assets/icons/delete.svg" alt="delete-icon">Delete</button>
            </div>
        </div>
    `
}

function getContactDetailInfoTemplate(contact) {
    return `
        <h3 class="flex-col justifiy-center">Contact Information</h3>                        
        <div class="contact-property flex-col">
            <div class="fw-bold" >Email</div>
            <div>${contact.email}</div>
        </div>
        <div class="contact-property flex-col">
            <div class="fw-bold">Phone</div>
            <div>${contact.phone}</div>
        </div>
    `
}

// function getAddContactSubmitButtonsTemplate() {
//     return `
//         <button id="btnReset" class="button btn-cancel btn-icon btn-secondary" onclick="resetFormAddContact(event)"></button>
//         <button type="submit" id="btnSubmit" class="button btn-check btn-icon btn-primary" disabled></button>
//     `
// }

// function getEditContactSubmitButtonsTemplate() {
//     return `
//         <button id="btnReset" class="button btn-cancel btn-icon btn-secondary" onclick="resetFormAddContact(event)"></button>
//         <button type="submit" id="btnSubmit" class="button btn-check btn-icon btn-primary" disabled></button>
//     `
// }



function getContactSelectOptionTemplate(contact) {
    return `
        <li>
            <div class="profile-batch" style="--profile-color: ${contact.color};">${contact.initials}</div>
            <label for="${contact.id}">${contact.name}</label>
            <div class="input-icon-wrapper custom-checkbox">
                <button>
                    <input type="checkbox" class="custom" id="${contact.id}" name="${contact.id}" value="${contact.id}">
                    <img src="assets/icons/checkbox-checked.svg" alt="checkbox-checked" class="icon-checkbox">
                </button>
            </div>
        </li>
    `
}

function getProfileBatchTemplate(contact) {
    return `
        <li class="profile-batch" style="--profile-color: ${contact.color};">${contact.initials}</li>
    `
}

function getCategorySelectOptionTemplate(category) {
    return `
        <option value="${category.id}">${category.name}</option>
    `
}






function getIconTemplateClose(text = "") {
    return `
        ${text}
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.24959 6.99984L11.4926 12.2428M1.00659 12.2428L6.24959 6.99984L1.00659 12.2428ZM11.4926 1.75684L6.24859 6.99984L11.4926 1.75684ZM6.24859 6.99984L1.00659 1.75684L6.24859 6.99984Z" stroke="var(--icon-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `
}

function getIconTemplateCancel(text = "") {
    return `
        ${text}
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.24959 6.99984L11.4926 12.2428M1.00659 12.2428L6.24959 6.99984L1.00659 12.2428ZM11.4926 1.75684L6.24859 6.99984L11.4926 1.75684ZM6.24859 6.99984L1.00659 1.75684L6.24859 6.99984Z" stroke="var(--icon-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `
}

function getIconTemplateCheck(text = "") {
    return `
        ${text}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.61905 9.15L14.0941 0.675C14.2941 0.475 14.5316 0.375 14.8066 0.375C15.0816 0.375 15.3191 0.475 15.5191 0.675C15.7191 0.875 15.8191 1.1125 15.8191 1.3875C15.8191 1.6625 15.7191 1.9 15.5191 2.1L6.31905 11.3C6.11905 11.5 5.88572 11.6 5.61905 11.6C5.35239 11.6 5.11905 11.5 4.91905 11.3L0.619055 7C0.419055 6.8 0.323221 6.5625 0.331555 6.2875C0.339888 6.0125 0.444055 5.775 0.644055 5.575C0.844055 5.375 1.08155 5.275 1.35655 5.275C1.63155 5.275 1.86905 5.375 2.06905 5.575L5.61905 9.15Z" fill="var(--icon-color)"/>
        </svg>
    `
}

function getIconTemplatePrioHigh(text = "Urgent") {
    return `
        ${text}
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z" fill="var(--icon-color)"/>
        <path d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z" fill="var(--icon-color)"/>
        </svg>
    `
}

function getIconTemplatePrioMedium(text = "Medium") {
    return `
        ${text}
        <svg width="21" height="8" viewBox="0 0 21 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.1526 7.72528H1.34443C1.05378 7.72528 0.775033 7.60898 0.569514 7.40197C0.363995 7.19495 0.248535 6.91419 0.248535 6.62143C0.248535 6.32867 0.363995 6.0479 0.569514 5.84089C0.775033 5.63388 1.05378 5.51758 1.34443 5.51758H19.1526C19.4433 5.51758 19.722 5.63388 19.9276 5.84089C20.1331 6.0479 20.2485 6.32867 20.2485 6.62143C20.2485 6.91419 20.1331 7.19495 19.9276 7.40197C19.722 7.60898 19.4433 7.72528 19.1526 7.72528Z" fill="var(--icon-color)"/>
        <path d="M19.1526 2.48211H1.34443C1.05378 2.48211 0.775033 2.36581 0.569514 2.1588C0.363995 1.95179 0.248535 1.67102 0.248535 1.37826C0.248535 1.0855 0.363995 0.804736 0.569514 0.597724C0.775033 0.390712 1.05378 0.274414 1.34443 0.274414L19.1526 0.274414C19.4433 0.274414 19.722 0.390712 19.9276 0.597724C20.1331 0.804736 20.2485 1.0855 20.2485 1.37826C20.2485 1.67102 20.1331 1.95179 19.9276 2.1588C19.722 2.36581 19.4433 2.48211 19.1526 2.48211Z" fill="var(--icon-color)"/>
        </svg>
    `
}

function getIconTemplatePrioLow(text = "Low") {
    return `
        ${text}
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z" fill="var(--icon-color)"/>
        <path d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z" fill="var(--icon-color)"/>
        </svg>
    `
}