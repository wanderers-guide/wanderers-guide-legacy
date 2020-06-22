
// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    let quickviews = bulmaQuickview.attach();

    $('#character-sheet-section').click(function(){
        if($('#quickviewDefault').hasClass('quickview-auto-close-protection')){
            $('#quickviewDefault').removeClass('quickview-auto-close-protection');
        } else {
            closeQuickView();
        }
    });

    $('#main-top').click(function(){
        if($('#quickviewDefault').hasClass('quickview-auto-close-protection')){
            $('#quickviewDefault').removeClass('quickview-auto-close-protection');
        } else {
            closeQuickView();
        }
    });

    // So clicking the manage spells modal will auto-close the quickview
    $('#manageSpellsModalDefault').click(function(){
        if($('#quickviewDefault').hasClass('quickview-auto-close-protection')){
            $('#quickviewDefault').removeClass('quickview-auto-close-protection');
        } else {
            closeQuickView();
        }
    });

});

let g_QViewLastType = null;
let g_QViewLastData = null;

function openQuickView(type, data) {

    $('#quickViewTitle').html('');
    $('#quickViewTitleRight').html('');
    $('#quickViewContent').html('');
    $('#quickViewContent').scrollTop(0);

    $('#quickViewTitleClose').html('<a id="quickViewClose" class="delete"></a>');
    $('#quickViewClose').click(function(){
        closeQuickView();
    });

    if(data._prevBackData == null){
        $('#quickviewDefault').addClass('quickview-auto-close-protection');
        $('#quickviewDefault').addClass('is-active');
    }
    g_QViewLastType = type;
    g_QViewLastData = data;

    if(type == 'addSpellView'){
        openAddSpellQuickview(data);
    } else if(type == 'spellView'){
        openSpellQuickview(data);
    } else if(type == 'skillView'){
        openSkillQuickview(data);
    } else if(type == 'abilityScoreView'){
        openAbilityScoreQuickview(data);
    } else if(type == 'heroPointsView'){
        openHeroPointsQuickview(data);
    } else if(type == 'languageView'){
        openLanguageQuickview(data);
    } else if(type == 'featView'){
        openFeatQuickview(data);
    } else if(type == 'savingThrowView'){
        openSavingThrowQuickview(data);
    } else if(type == 'perceptionView'){
        openPerceptionQuickview(data);
    } else if(type == 'speedView'){
        openSpeedQuickview(data);
    } else if(type == 'invItemView'){
        openInvItemQuickview(data);
    } else if(type == 'customizeItem'){
        openCustomizeItemQuickview(data);
    } else if(type == 'addItemView'){
        openAddItemQuickview(data);
    } else if(type == 'itemView'){
        openItemQuickview(data);
    } else if(type == 'abilityView'){
        openAbilityQuickview(data);
    } else if(type == 'resistView'){
        openResistancesQuickview(data);
    } else if(type == 'otherProfsView'){
        openOtherProfsQuickview(data);
    } else if(type == 'customizeProfView'){
        openCustomizeProfQuickview(data);
    } else if(type == 'addProfView'){
        openAddProfQuickview(data);
    } else if(type == 'tagView'){
        openTagQuickview(data);
    } else if(type == 'classDCView'){
        openClassDCQuickview(data);
    } else if(type == 'conditionView'){
        openConditionQuickview(data);
    }

}

function closeQuickView() {
    $('#quickviewDefault').removeClass('is-active');
    g_QViewLastData = null;
}



function addBackFunctionality(quickViewData){

    if(quickViewData._prevBackData != null){
        $('#quickViewTitleClose').html('<span id="quickViewBack" class="icon has-text-light cursor-clickable" style="font-size:0.8em;"><i class="fas fa-arrow-left"></i></i></span>');
        $('#quickViewBack').click(function(){
            openQuickView(quickViewData._prevBackData.Type, quickViewData._prevBackData.Data);
        });
    }

}