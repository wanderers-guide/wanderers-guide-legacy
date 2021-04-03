/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    let quickviews = bulmaQuickview.attach();

    $('#center-body').click(function(){
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


    // Press Esc key to close
    $(document).on('keyup',function(e){
      if(e.which == 27){
        
        if($('#quickviewDefault').hasClass('is-active')){
          closeQuickView();
        } else if($('#quickviewLeftDefault').hasClass('is-active')){
          $('#quickviewLeftDefault').removeClass('is-active');
        } else {
          $('.modal').removeClass('is-active');
          $('html').removeClass('is-clipped');
        }

      }
    });

});

let g_QViewLastType = null;
let g_QViewLastData = null;

function openQuickView(type, data, noProtection=false) {

    $('#quickViewTitle').html('');
    $('#quickViewTitleRight').html('');
    $('#quickViewContent').html('');
    $('#quickViewContent').scrollTop(0);

    $('#quickViewTitleClose').html('<a id="quickViewClose" class="delete"></a>');
    $('#quickViewClose').click(function(){
        closeQuickView();
    });

    if(!noProtection) {
        $('#quickviewDefault').addClass('quickview-auto-close-protection');
    }
    $('#quickviewDefault').addClass('is-active');

    g_QViewLastType = type;
    g_QViewLastData = data;

    if(type == 'addSpellView'){
        openAddSpellQuickview(data);
    } else if(type == 'spellView'){
        openSpellQuickview(data);
    } else if(type == 'spellEmptyView'){
        openSpellEmptyQuickview(data);
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
    } else if(type == 'resistListView'){
        openResistancesListQuickview(data);
    } else if(type == 'otherProfsView'){
        openOtherProfsQuickview(data);
    } else if(type == 'customizeProfView'){
        openCustomizeProfQuickview(data);
    } else if(type == 'addProfView'){
        openAddProfQuickview(data);
    } else if(type == 'addLoreView'){
        openAddLoreQuickview(data);
    } else if(type == 'addLangView'){
        openAddLangQuickview(data);
    } else if(type == 'addSpellSlotView'){
        openAddSpellSlotQuickview(data);
    } else if(type == 'addResistView'){
        openAddResistQuickview(data);
    } else if(type == 'addWeakView'){
        openAddWeakQuickview(data);
    } else if(type == 'addUnarmedAttackView'){
        openAddUnarmedAttackQuickview(data);
    } else if(type == 'tagView'){
        openTagQuickview(data);
    } else if(type == 'classDCView'){
        openClassDCQuickview(data);
    } else if(type == 'conditionView'){
        openConditionQuickview(data);
    } else if(type == 'acView'){
        openACQuickview(data);
    } else if(type == 'charInfoView'){
        openCharInfoQuickview(data);
    } else if(type == 'animalCompanionView'){
        openAnimalCompQuickview(data);
    } else if(type == 'familiarView'){
      openFamiliarQuickview(data);
    }

}

function closeQuickView() {
  $('#quickviewDefault').removeClass('is-active');
  g_QViewLastData = null;
}

function addQuickViewProtection(){
  $('#quickviewDefault').addClass('quickview-auto-close-protection');
}

function refreshQuickView() {
  if($('#quickviewDefault').hasClass('is-active')) {
    openQuickView(g_QViewLastType, g_QViewLastData, true);
  }
}


function addBackFunctionality(quickViewData){

  if(quickViewData._prevBackData != null && quickViewData._prevBackData.Data != null){
    $('#quickViewTitleClose').html('<span id="quickViewBack" class="icon has-text-light cursor-clickable" style="font-size:0.8em;"><i class="fas fa-arrow-left"></i></i></span>');
    $('#quickViewBack').click(function(){
      openQuickView(quickViewData._prevBackData.Type, quickViewData._prevBackData.Data, true);
    });
  }

}

function addContentSource(contentID, contentSrc, homebrewID){
  if(contentSrc == null && homebrewID == null) {return;}
  if(contentID == null) {return;}

  let sourceTextName, sourceLink;
  if(homebrewID == null) {
    sourceTextName = getContentSourceTextName(contentSrc);
    sourceLink = getContentSourceLink(contentSrc);
    if(sourceTextName == null) { sourceTextName = capitalizeWords(contentSrc); }
    if(sourceLink == null) { sourceLink = ''; }
  } else {
    sourceTextName = 'Bundle #'+homebrewID;
    sourceLink = '/homebrew/?view_id='+homebrewID;
  }

  let contentIDStr = (contentID == null) ? '' : '<span class="is-size-7 has-text-grey-dark is-italic">, #'+contentID+'</span>';

  $('#quickViewContent').parent().css('position','relative');
  $('#quickViewContent').append('<div style="position: fixed; bottom: 5px; right: 12px;"><a class="is-size-7 has-text-grey is-italic" href="'+sourceLink+'" target="_blank">'+sourceTextName+'</a>'+contentIDStr+'</div>');

}