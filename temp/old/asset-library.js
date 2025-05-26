function initAssetLibrary() {
    getMainTemplates();
    addIconsToAssetLibraryPage();
    getContactSelectOptions();
    getProfileBatches();
    getCategorySelectOptions();
}

function addIconsToAssetLibraryPage() {
    document.getElementById('labelPrioHigh').innerHTML = getIconTemplatePrioHigh();
    document.getElementById('labelPrioMedium').innerHTML = getIconTemplatePrioMedium();
    document.getElementById('labelPrioLow').innerHTML = getIconTemplatePrioLow();
    document.getElementById('btnReset').innerHTML = getIconTemplateCancel('Clear');
    document.getElementById('btnSubmit').innerHTML = getIconTemplateCheck('Create Task');
}