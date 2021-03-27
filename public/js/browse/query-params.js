/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let is_queryBrowseInit = false;

function queryBrowseContent(){

  //let contentFilter = $('#tabContent').attr('data-content-filter');
  let contentSection = $('#tabContent').attr('data-content-section');
  let contentID = $('#tabContent').attr('data-content-id');

  if(contentSection != ''){

    openTab(contentSection);

    contentID = parseInt(contentID);
    if(!isNaN(contentID)){

      switch(contentSection){
        case 'ancestry':
          new DisplayAncestry('tabContent', contentID, g_featMap);
          break;
        case 'archetype':
          new DisplayArchetype('tabContent', contentID, g_featMap);
          break;
        case 'background':
          new DisplayBackground('tabContent', contentID);
          break;
        case 'class':
          new DisplayClass('tabContent', contentID, g_featMap);
          break;
        case 'feat':
          let featStruct = g_featMap.get(contentID+'');
          openQuickView('featView', {
            Feat : featStruct.Feat,
            Tags : featStruct.Tags
          }, true);
          break;
        case 'item':
          let itemStruct = g_itemMap.get(contentID+'');
          openQuickView('itemView', {
            ItemDataStruct : itemStruct
          }, true);
          break;
        case 'spell':
          let spellStruct = g_spellMap.get(contentID+'');
          openQuickView('spellView', {
            SpellDataStruct: spellStruct,
          }, true);
        break;
        case 'v-heritage':
          new DisplayUniHeritage('tabContent', contentID, g_featMap);
          break;
        default: break;
      }

    }

  }

  /*
  if(contentFilter != ''){

    let filterParts = contentFilter.split('.');
    for(const filterPart of filterParts) {

      let filterPartEntry = filterPart.split('~');
      const filterPartKey = filterPartEntry[0];
      const filterPartValue = filterPartEntry[1];

      $('#filter'+filterPartKey+'Input').val(filterPartValue);

    }

    
    let filterArray = getFilterArrayFromURL();
    for(let filterStruct of filterArray){
      $('#filter'+filterStruct.k+'Input').val(filterStruct.v);
    }
    

    // Triggers all blur events, updating highlights
    $('.input').blur();
    $('.select select').blur();

    filterSearch();
  }
  */

  is_queryBrowseInit = true;
}

function updateBrowseURL(paramKey, paramValue, override=false){
  if(!is_queryBrowseInit && !override) { return; }

  const urlParams = new URLSearchParams(location.search);
  if(paramValue == null){
    urlParams.delete(paramKey);
  } else {
    urlParams.set(paramKey, paramValue);
  }
  window.history.pushState('browse', '', 'browse?'+urlParams.toString());
}

/*
function getFilterArrayFromURL(){
  try{
    const urlParams = new URLSearchParams(location.search);
    let filterArray = JSON.parse(decodeURIComponent(urlParams.get('filter')));
    //console.log('Filtering via query <'+filterArray.length+'>...');
    filterArray.length;
    return filterArray;
  } catch (err) {
    return [];
  }
}

function setFilterArrayToURL(filterArray){
  const urlParams = new URLSearchParams(location.search);
  urlParams.set('filter', encodeURIComponent(JSON.stringify(filterArray)));
  window.history.pushState('browse', '', 'browse?'+urlParams.toString());
}

function addToBrowseURL(paramKey, paramAddedValue, subKeyName=null){

  let foundKey = false;
  let filterArray = getFilterArrayFromURL();
  for(let filterStruct of filterArray){
    if(filterStruct.k == subKeyName){
      filterStruct.v = paramAddedValue;
      foundKey = true;
    }
  }

  if(!foundKey){
    filterArray.push({ k: subKeyName, v: paramAddedValue });
  }

  setFilterArrayToURL(filterArray);

}

function removeFromBrowseURL(paramKey, subKeyName=null){

  let newFilterArray = [];
  let filterArray = getFilterArrayFromURL();
  for(let filterStruct of filterArray){
    if(filterStruct.k != subKeyName){
      newFilterArray.push(filterStruct);
    }
  }

  setFilterArrayToURL(newFilterArray);

}
*/


function addToBrowseURL(paramKey, paramAddedValue, subKeyName=null){
  /*
  if(!is_queryBrowseInit) { return; }

  const urlParams = new URLSearchParams(location.search);
  let paramCurrentValue = urlParams.get(paramKey);
  if(paramCurrentValue == null || paramCurrentValue == ''){
    if(subKeyName != null){
      urlParams.set(paramKey, subKeyName+'~'+paramAddedValue+'.');
    } else {
      urlParams.set(paramKey, paramAddedValue);
    }
  } else {
    if(subKeyName != null){
      if(paramCurrentValue.includes(subKeyName+'~')){
        let regex = new RegExp(subKeyName+'~(.+?)(\.|$)','g');
        paramCurrentValue = paramCurrentValue.replace(regex, '');
      }
      //paramCurrentValue = paramCurrentValue.replace(/\.$/, '');
      if(paramCurrentValue == ''){
        urlParams.set(paramKey, subKeyName+'~'+paramAddedValue+'.');
      } else {
        urlParams.set(paramKey, paramCurrentValue+subKeyName+'~'+paramAddedValue+'.');
      }
    } else {
      urlParams.set(paramKey, paramCurrentValue+paramAddedValue+'.');
    }
  }
  window.history.pushState('browse', '', 'browse?'+urlParams.toString());
  */
}

function removeFromBrowseURL(paramKey, subKeyName=null){
  /*
  if(!is_queryBrowseInit) { return; }

  const urlParams = new URLSearchParams(location.search);
  let paramCurrentValue = urlParams.get(paramKey);
  if(paramCurrentValue != null && paramCurrentValue != ''){
    if(subKeyName != null){
      let regex = new RegExp(subKeyName+'~(.+?)(\.|$)','g');
      paramCurrentValue = paramCurrentValue.replace(regex, '');
      urlParams.set(paramKey, paramCurrentValue);
    } else {
      urlParams.delete(paramKey);
    }
  } else {
    urlParams.delete(paramKey);
  }
  window.history.pushState('browse', '', 'browse?'+urlParams.toString());
  */
}
