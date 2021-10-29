/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

/* 
  Tag Name: data-selection-info

  STATES:
  - UNSELECTED
  - INCORRECT
*/

function getTagFromData(srcStruct, sourceName, details, STATE){
  return srcStruct.sourceType+':::'+srcStruct.sourceLevel+':::'+srcStruct.sourceCode+':::'+srcStruct.sourceCodeSNum+';;;'+sourceName+':::'+details+':::'+STATE;
}
function getDataFromTag(tagData){
  let parts = tagData.split(';;;');
  let srcStructParts = parts[0].split(':::');
  let otherDataParts = parts[1].split(':::');
  return {
    srcStruct: {
      sourceType: srcStructParts[0],
      sourceLevel: srcStructParts[1],
      sourceCode: srcStructParts[2],
      sourceCodeSNum: srcStructParts[3],
    },
    sourceName: otherDataParts[0],
    details: otherDataParts[1],
    STATE: otherDataParts[2],
  };
}



function selectorUpdated() {

  // Show blue circle indicator for all accords that require a selection //
  $('.accord-creation-container').each(function() {
    if($(this).find('.input.is-info').length !== 0 || $(this).find('.select.is-info').length !== 0 || $(this).find('.feat-selection.is-default').length !== 0){
        $(this).find('.accord-indicate-unselected-options').html('<span class="icon is-small has-text-info pl-3"><i class="fas fa-xs fa-circle"></i></span>');
    } else {
        $(this).find('.accord-indicate-unselected-options').html('');
    }
  });

  // Process all selections that haven't been selected
  $('.select').each(function() {
    let tagData = $(this).attr('data-selection-info');
    if(tagData != null && tagData != '') {
      let data = getDataFromTag(tagData);
      if($(this).hasClass('is-info')){
        addUnselectedData(data.srcStruct, JSON.stringify({
          sourceName: data.sourceName,
          details: data.details,
          STATE: data.STATE,
        }));
      } else {
        removeUnselectedData(data.srcStruct);
      }
    }
  });
  $('.feat-selection').each(function() {
    let tagData = $(this).attr('data-selection-info');
    if(tagData != null && tagData != ''){
      let data = getDataFromTag(tagData);
      if(data.STATE != ''){
        addUnselectedData(data.srcStruct, JSON.stringify({
          sourceName: data.sourceName,
          details: data.details,
          STATE: data.STATE,
        }));
      } else {
        removeUnselectedData(data.srcStruct);
      }
    }
  });
  
}

function addUnselectedData(srcStruct, unselectedData){
  let existingData = g_unselectedData.find(unselData => {
    return hasSameSrc(unselData, srcStruct) && unselData.value === unselectedData;
  });
  if(existingData == null){

    let newData = cloneObj(srcStruct);
    newData.value = unselectedData;
    g_unselectedData.push(newData);

    socket.emit("requestUnselectedDataChange",
        getCharIDFromURL(),
        srcStruct,
        unselectedData);

  }
}

function removeUnselectedData(srcStruct){
  let existingData = g_unselectedData.find(unselData => {
    return hasSameSrc(unselData, srcStruct);
  });
  if(existingData != null){

    let newDataArray = [];
    for(let unselData of g_unselectedData){
      if(!hasSameSrc(unselData, srcStruct)){
        newDataArray.push(unselData);
      }
    }
    g_unselectedData = newDataArray;

    socket.emit("requestUnselectedDataChange",
        getCharIDFromURL(),
        srcStruct,
        null);

  }
}