/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function filterClassSearch(){

  let nameFilter = $('#filterNameInput').val();
  let sourceFilter = $('#filterSourceInput').val();


  let allClasses = new Set(g_allClasses);

  if(nameFilter != ''){
    console.log('Filtering by Name...');
    let parts = nameFilter.toUpperCase().split(' ');
    for(const cClass of allClasses){
      if(!textContainsWords(cClass.name, parts)){
        allClasses.delete(cClass);
      }
    }
  }

  if(sourceFilter != 'ANY'){
    console.log('Filtering by Source...');
    for(const cClass of allClasses){
      if(cClass.contentSrc !== sourceFilter){
        allClasses.delete(cClass);
      }
    }
  }

  displayClassResults(allClasses);
}

function displayClassResults(allClasses){
  $('#browsingList').html('');

  if(allClasses.size <= 0){
    $('#browsingList').html('<p class="has-text-centered is-italic">No results found!</p>');
    $('#searchResultCountContainer').html('<p class="is-italic has-text-grey">(0 results found)</p>');
    return;
  }

  let foundCount = 0;
  for(const cClass of allClasses){
    if(cClass.isArchived == 1) {continue;}
    foundCount++;

    let entryID = 'class-'+cClass.id;
    let name = cClass.name;
    let contentSrc = cClass.contentSrc;

    $('#browsingList').append('<div id="'+entryID+'" class="columns is-mobile border-bottom border-dark-lighter cursor-clickable"><div class="column is-8"><span class="is-size-5">'+name+'</span></div><div class="column is-4" style="position: relative;"><span class="is-pulled-right is-size-7 has-text-grey is-italic">'+getContentSourceTextName(contentSrc)+'</span></div></div>');

    $('#'+entryID).click(function(){
      new DisplayClass('tabContent', cClass.id, g_featMap);
      updateBrowseURL('id', cClass.id);
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