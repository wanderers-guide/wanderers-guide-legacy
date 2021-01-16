/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function filterUniHeritageSearch(){

  let nameFilter = $('#filterNameInput').val();
  let sourceFilter = $('#filterSourceInput').val();


  let allUniHeritages = new Set(g_allUniHeritages);

  if(nameFilter != ''){
    console.log('Filtering by Name...');
    let parts = nameFilter.toUpperCase().split(' ');
    for(const uniHeritage of allUniHeritages){
      if(!textContainsWords(uniHeritage.name, parts)){
        allUniHeritages.delete(uniHeritage);
      }
    }
  }

  if(sourceFilter != 'ANY'){
    console.log('Filtering by Source...');
    for(const uniHeritage of allUniHeritages){
      if(uniHeritage.contentSrc !== sourceFilter){
        allUniHeritages.delete(uniHeritage);
      }
    }
  }

  displayUniHeritageResults(allUniHeritages);
}

function displayUniHeritageResults(allUniHeritages){
  $('#browsingList').html('');

  if(allUniHeritages.size <= 0){
    $('#browsingList').html('<p class="has-text-centered is-italic">No results found!</p>');
    $('#searchResultCountContainer').html('<p class="is-italic has-text-grey">(0 results found)</p>');
    return;
  }

  let foundCount = 0;
  for(const uniHeritage of allUniHeritages){
    if(uniHeritage.isArchived == 1) {continue;}
    foundCount++;

    let entryID = 'uni-heritage-'+uniHeritage.id;
    let name = uniHeritage.name;
    let rarity = uniHeritage.rarity;

    $('#browsingList').append('<div id="'+entryID+'" class="columns is-mobile border-bottom border-dark-lighter cursor-clickable"><div class="column is-8"><span class="is-size-5">'+name+'</span></div><div class="column is-4" style="position: relative;">'+convertRarityToHTML(rarity, true)+'</div></div>');

    $('#'+entryID).click(function(){
      new DisplayUniHeritage('tabContent', uniHeritage.id, g_featMap);
    });

    $('#'+entryID).mouseenter(function(){
      $(this).addClass('has-background-grey-darker');
    });
    $('#'+entryID).mouseleave(function(){
      $(this).removeClass('has-background-grey-darker');
    });

  }
  $('#searchResultCountContainer').html('<p class="is-italic has-text-grey">('+foundCount+' results found)</p>');
  $('#browsingList').scrollTop();
}