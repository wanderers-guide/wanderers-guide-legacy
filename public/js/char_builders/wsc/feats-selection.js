/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_featSelectionMap = new Map();

function giveFeatSelection(locationID, srcStruct, selectionName, featsArray){

  let featSelectionLocID = "featSelect-"+locationID+"-"+srcStruct.sourceCodeSNum;
  $('#'+locationID).append('<div id="'+featSelectionLocID+'"></div>');
  generateFeatSelection(featSelectionLocID, srcStruct, selectionName, featsArray);

}

function generateFeatSelection(contentLocID, srcStruct, selectionName, featsArray){
  g_featSelectionMap.set(contentLocID, {
    SrcStruct: srcStruct,
    SelectionName: selectionName,
    FeatsArray: featsArray
  });

  // Find selectedFeat //
  let featData = wscChoiceStruct.FeatArray.find(featData => {
    return hasSameSrc(featData, srcStruct);
  });
  let selectedFeat = null;
  if(featData != null && featData.value != null){
      selectedFeat = g_featMap.get(featData.value.id+"");
  }
  // ~~~~~~~~~~~~~~~~~ //

  let openFeatDetailsClass = "openFeat-"+contentLocID;
  let openFeatListClass = "openList-"+contentLocID;

  let featListSectionClass = "featListSection-"+contentLocID;
  let featDropdownIconClass = "featDropdownIcon-"+contentLocID;

  let featCodeSectionID = "featCode-"+contentLocID;

  let featSelectButtonClass = "featSelectBtn-"+contentLocID;
  let featRemoveButtonClass = "featRemoveBtn-"+contentLocID;

  if(selectedFeat == null) {
    $('#'+contentLocID).html('<div class="mb-3"><div data-contentLoc-id="'+contentLocID+'" class="feat-selection is-default cursor-clickable columns is-mobile mb-0 p-0"><div class="column is-2 is-paddingless '+openFeatListClass+' py-2"></div><div class="column is-8 is-paddingless '+openFeatListClass+' py-2"><span class="">'+selectionName+'</span></div><div class="column is-2 is-paddingless '+openFeatListClass+' py-2"><span class="icon feat-selection-dropdown"><i class="fas fa-chevron-down '+featDropdownIconClass+'"></i></span></div></div><div class="'+featListSectionClass+' is-hidden"></div><div id="'+featCodeSectionID+'" class="py-2"></div></div>');
  } else {
    let featNameHTML = '<span class="">'+selectedFeat.Feat.name+'</span>';
    if(selectedFeat.Feat.isArchived === 1){ featNameHTML += '<span class="has-text-grey-kinda-light is-size-6-5"> - Archived</span>'; }
    let featLevelHTML = '';
    if(selectedFeat.Feat.level > 0){ featLevelHTML = '<sup class="is-size-7 has-text-grey is-italic"> Lvl '+selectedFeat.Feat.level+'</sup>'; }
    $('#'+contentLocID).html('<div class="mb-3"><div data-contentLoc-id="'+contentLocID+'" class="feat-selection cursor-clickable columns is-mobile mb-0 p-0"><div class="column is-1 is-paddingless '+openFeatDetailsClass+' py-2"></div><div class="column is-10 is-paddingless '+openFeatDetailsClass+' py-2">'+featNameHTML+''+featLevelHTML+'</div><div class="column is-1 is-paddingless '+openFeatListClass+' py-2" style="border-left: 1px solid hsl(0, 0%, 13%);"><span class="icon feat-selection-dropdown"><i class="fas fa-chevron-down '+featDropdownIconClass+'"></i></span></div></div><div class="'+featListSectionClass+' is-hidden"></div><div id="'+featCodeSectionID+'" class="py-2"></div></div>');
  }

  let featListHTML = '';
  for(let featData of featsArray){
    if(featListHTML != ''){ // If not first entry, put a divider
      featListHTML += '<hr class="hr-feat-selection m-0"></hr>';
    }
    if(featData.NewLevel != null){
      if(featData.NewLevel > 0){
        featListHTML += '<div class="feat-selection-level"><span class="">Level '+featData.NewLevel+'</span></div>';
      }
    } else {

      let featNameHTML = '<span class="">'+featData.Feat.name+'</span><span class="featPrereqIcon"></span>';

      if(featData.Feat.isArchived === 1){
        if(selectedFeat != null && selectedFeat.Feat.id == featData.Feat.id){
          featNameHTML += '<span class="has-text-grey-kinda-light is-size-6-5"> - Archived</span>';
        } else {
          continue;
        }
      }

      let rightInfoHTML = '';
      if(featData.Feat.skillID != null){
        rightInfoHTML = '<span class="has-text-grey-kinda-light is-size-7 is-pulled-right">'+getSkillNameAbbrev(getSkillIDToName(featData.Feat.skillID))+'</span>';
      }

      let hasFeat = (featData.Feat.canSelectMultiple == 0 && hasDuplicateFeat(wscChoiceStruct.FeatArray, featData.Feat.id));

      if(selectedFeat != null && selectedFeat.Feat.id == featData.Feat.id){
        featListHTML += '<div class="cursor-clickable feat-selection-list-entry is-prev-selected columns is-mobile m-0 p-0" data-feat-id="'+featData.Feat.id+'"><div class="column is-2 is-paddingless py-2 feat-selection-list-entry-view"></div><div class="column is-7 is-paddingless py-2 feat-selection-list-entry-view">'+featNameHTML+'</div><div class="column is-1 is-paddingless py-2 feat-selection-list-entry-view">'+rightInfoHTML+'</div><div class="column is-2 is-paddingless py-2 feat-selection-list-entry-choose"><button class="button is-very-small is-danger is-outlined is-rounded '+featRemoveButtonClass+'" data-feat-id="'+featData.Feat.id+'">Remove</button></div></div>';
      } else if(hasFeat) {
        featListHTML += '<div class="cursor-clickable feat-selection-list-entry is-prev-selected columns is-mobile m-0 p-0" data-feat-id="'+featData.Feat.id+'"><div class="column is-2 is-paddingless py-2 feat-selection-list-entry-view"></div><div class="column is-7 is-paddingless py-2 feat-selection-list-entry-view">'+featNameHTML+'</div><div class="column is-1 is-paddingless py-2 feat-selection-list-entry-view">'+rightInfoHTML+'</div><div class="column is-2 is-paddingless py-2"></div></div>';
      } else {
        featListHTML += '<div class="cursor-clickable feat-selection-list-entry columns is-mobile m-0 p-0" data-feat-id="'+featData.Feat.id+'"><div class="column is-2 is-paddingless py-2 feat-selection-list-entry-view"></div><div class="column is-7 is-paddingless py-2 feat-selection-list-entry-view">'+featNameHTML+'</div><div class="column is-1 is-paddingless py-2 feat-selection-list-entry-view">'+rightInfoHTML+'</div><div class="column is-2 is-paddingless py-2 feat-selection-list-entry-choose"><button class="button is-very-small is-info is-outlined is-rounded '+featSelectButtonClass+'" data-feat-id="'+featData.Feat.id+'">Select</button></div></div>';
      }

    }
  }
  $('.'+featListSectionClass).html('<div class="feat-selection-list use-feat-selection-scrollbar">'+featListHTML+'</div>');


  if(selectedFeat != null) {
    $('.'+openFeatDetailsClass).click(function(event) {
      openQuickView('featView', {
        Feat : selectedFeat.Feat,
        Tags : selectedFeat.Tags,
        _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
      });
    });

    $('.'+openFeatDetailsClass).mouseenter(function(){
      $('.'+openFeatDetailsClass).addClass('feat-selection-is-hovered');
    });
    $('.'+openFeatDetailsClass).mouseleave(function(){
      $('.'+openFeatDetailsClass).removeClass('feat-selection-is-hovered');
    });
  
    $('.'+openFeatListClass).mouseenter(function(){
      $(this).addClass('feat-selection-is-hovered');
    });
    $('.'+openFeatListClass).mouseleave(function(){
      $(this).removeClass('feat-selection-is-hovered');
    });
  }

  $('.'+openFeatListClass).click(function() {
    if($('.'+featListSectionClass).hasClass('is-hidden')){
      $('.'+featDropdownIconClass).removeClass('fa-chevron-down');
      $('.'+featDropdownIconClass).addClass('fa-chevron-up');
      populatePrereqIcons(featListSectionClass);
      $('.'+featListSectionClass).removeClass('is-hidden');
    } else {
      $('.'+featDropdownIconClass).removeClass('fa-chevron-up');
      $('.'+featDropdownIconClass).addClass('fa-chevron-down');
      $('.'+featListSectionClass).addClass('is-hidden');
    }
  });

  $('.'+featSelectButtonClass).click(function() {
    $(this).addClass('is-loading');
    let featID = $(this).attr('data-feat-id');
    let feat = g_featMap.get(featID);
    featsUpdateWSCChoiceStruct(srcStruct, feat.Feat);
    socket.emit("requestFeatChange",
        getCharIDFromURL(),
        {srcStruct, feat, featID, codeLocationID : featCodeSectionID });
  });

  $('.'+featRemoveButtonClass).click(function() {
    $(this).addClass('is-loading');
    featsUpdateWSCChoiceStruct(srcStruct, null);
    socket.emit("requestFeatChange",
        getCharIDFromURL(),
        {srcStruct, feat : null, featID : null, codeLocationID : featCodeSectionID });
  });

  updateFeatSelectionEntryEvents();

  if(selectedFeat != null){
    processCode(
        selectedFeat.Feat.code,
        srcStruct,
        featCodeSectionID);
  }

}

socket.on("returnFeatChange", function(featChangePacket){

  selectorUpdated();
  // Updating feat selections will run code for all feats (including this one)
  updateAllFeatSelections();


  // If dedication is switched, reload all class abilities //
  //if(featChangePacket.autoPageLoad != null && !featChangePacket.autoPageLoad){}

  // Get number of character archetypes
  let charArchetypesArray = [];
  for(let featChoice of wscChoiceStruct.FeatArray){
    if(featChoice.value != null) {
      let feat = g_featMap.get(featChoice.value.id+"");
      if(feat != null){
        let dedicationTag = feat.Tags.find(featTag => {
          return featTag.name === 'Dedication';
        });
        if(dedicationTag != null){
          charArchetypesArray.push(featChoice.value.id);
        }
      }
    }
  }

  // Get number of current archetype tabs
  let maxArchetypesLength = 0;
  $('.classFeatTabs').each(function() {
    let archetypesTabClass = $(this).attr('data-arch-tab-class');
    let archLength = $('.'+archetypesTabClass).length;
    if (archLength > maxArchetypesLength) {
      maxArchetypesLength = archLength;
    }
  });

  // Changed feat has Dedication tag
  let featDedicationTag = null;
  if(featChangePacket.feat != null){
    featDedicationTag = featChangePacket.feat.Tags.find(featTag => {
      return featTag.name === 'Dedication';
    });
  }

  // If they aren't the same amount, reload class abilities
  if(maxArchetypesLength != charArchetypesArray.length || featDedicationTag != null) {
    if(temp_classAbilities != null){
      processCode_ClassAbilities(temp_classAbilities);
    }
  }

});


function updateAllFeatSelections(){

  $(".feat-selection").each(function(){

    let contentLocID = $(this).attr('data-contentLoc-id');
    let featData = g_featSelectionMap.get(contentLocID);
    if(featData != null){
      generateFeatSelection(contentLocID,
        featData.SrcStruct,
        featData.SelectionName,
        featData.FeatsArray);
    }

  });

}

function featsUpdateWSCChoiceStruct(srcStruct, feat){

  let foundFeatData = false;
  for(let featData of wscChoiceStruct.FeatArray){
      if(hasSameSrc(featData, srcStruct)){
          foundFeatData = true;
          featData.value = feat;
          break;
      }
  }

  if(!foundFeatData){
      let featData = srcStruct;
      featData.value = feat;
      wscChoiceStruct.FeatArray.push(featData);
  }

}

function updateFeatSelectionEntryEvents(){

  // Feat Selection Entry Events //
  $('.feat-selection-list-entry').unbind();
  $('.feat-selection-list-entry').mouseenter(function(){
    $(this).addClass('is-selected');
  });
  $('.feat-selection-list-entry').mouseleave(function(){
    $(this).removeClass('is-selected');
  });

  $('.feat-selection-list-entry-view').unbind();
  $('.feat-selection-list-entry-view').click(function(){
    let featID = $(this).parent().attr('data-feat-id');
    let feat = g_featMap.get(featID);
    openQuickView('featView', {
      Feat : feat.Feat,
      Tags : feat.Tags,
      _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
    });
  });

}

function populatePrereqIcons(featListSectionClass){
  if(wscChoiceStruct.Character.optionAutoDetectPreReqs !== 1) { return; }

  $('.'+featListSectionClass+' .feat-selection-list .feat-selection-list-entry').each(function(){
    let feat = g_featMap.get($(this).attr('data-feat-id'));
    let preReqResult = meetsPrereqs(feat.Feat);

    let preReqIconHTML = '';
    if(preReqResult == 'TRUE'){
      preReqIconHTML = ' '+preReqGetIconTrue();
    } else if(preReqResult == 'FALSE'){
      preReqIconHTML = ' '+preReqGetIconFalse();
    } else if(preReqResult == 'UNKNOWN'){
      preReqIconHTML = ' '+preReqGetIconUnknown();
    }
    $(this).find(".featPrereqIcon").html(preReqIconHTML);

  });

}