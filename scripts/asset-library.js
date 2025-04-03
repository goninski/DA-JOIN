function initAssetLibrary() {
    getMainTemplates();
    addIconsToAssetLibraryPage();
    getContactSelectOptions();
    getCategorySelectOptions();
}

function addIconsToAssetLibraryPage() {
    document.getElementById('labelPrioHigh').innerHTML = getIconTemplatePrioHigh();
    document.getElementById('labelPrioMedium').innerHTML = getIconTemplatePrioMedium();
    document.getElementById('labelPrioLow').innerHTML = getIconTemplatePrioLow();
    document.getElementById('btnCancel').innerHTML = getIconTemplateCancel('Clear');
    document.getElementById('btnCheck').innerHTML = getIconTemplateCheck('Create Task');
}