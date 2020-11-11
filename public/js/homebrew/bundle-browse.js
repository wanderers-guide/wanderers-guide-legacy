/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openBundleBrowse(){
  socket.emit('requestPublishedHomebrewBundles');
}

socket.on("returnPublishedHomebrewBundles", function(homebrewBundles){

  homebrewBundles = homebrewBundles.sort(
    function(a, b) {
      let aRating = a.userHomebrewBundles.length;
      let bRating = b.userHomebrewBundles.length;
      if (aRating === bRating) {
        // Name is only important when ratings are the same
        return a.name > b.name ? 1 : -1;
      }
      return bRating - aRating;
    }
  );

  $('#tabContent').html('');
  $('#tabContent').addClass('is-hidden');
  $('#tabContent').load("/templates/homebrew/display-browse.html");
  $.ajax({ type: "GET",
    url: "/templates/homebrew/display-browse.html",
    success : function(text)
    {

      $("#filterNameInput").blur(function(){
        if($('#filterNameInput').val() != ''){
          $('#filterNameInput').addClass('is-info');
        } else {
          $('#filterNameInput').removeClass('is-info');
        }
      });
      $("#filterDescInput").blur(function(){
        if($('#filterDescInput').val() != ''){
          $('#filterDescInput').addClass('is-info');
        } else {
          $('#filterDescInput').removeClass('is-info');
        }
      });
      $("#filterRatingInput").blur(function(){
        if($('#filterRatingInput').val() != ''){
          $('#filterRatingInput').addClass('is-info');
        } else {
          $('#filterRatingInput').removeClass('is-info');
        }
      });
      $("#filterKeyRequiredInput").blur(function(){
        if($('#filterKeyRequiredInput').val() != 'ANY'){
          $('#filterKeyRequiredInput').parent().addClass('is-info');
        } else {
          $('#filterKeyRequiredInput').parent().removeClass('is-info');
        }
      });

      // Search Filtering //
      $('#updateFilterButton').click(function(){
        filterBundleSearch(homebrewBundles);
      });
      $(document).on('keypress',function(e) {
        if(e.which == 13) {
          filterBundleSearch(homebrewBundles);
        }
      });
      filterBundleSearch(homebrewBundles);

      $('#tabContent').removeClass('is-hidden');

    }
  });
});

function filterBundleSearch(homebrewBundles){

  let nameFilter = $('#filterNameInput').val();
  let descFilter = $('#filterDescInput').val();
  let ratingRelationFilter = $('#filterRatingRelationInput').val();
  let ratingFilter = $('#filterRatingInput').val();
  let keyRequiredFilter = $('#filterKeyRequiredInput').val();

  homebrewBundles = new Set(homebrewBundles);

  if(nameFilter != ''){
    console.log('Filtering by Name...');
    let parts = nameFilter.toUpperCase().split(' ');
    for(const homebrewBundle of homebrewBundles){
      if(!textContainsWords(homebrewBundle.name, parts)){
        homebrewBundles.delete(homebrewBundle);
      }
    }
  }

  if(descFilter != ''){
    console.log('Filtering by Description...');
    let parts = descFilter.toUpperCase().split(' ');
    for(const homebrewBundle of homebrewBundles){
      if(!textContainsWords(homebrewBundle.description, parts)){
        homebrewBundles.delete(homebrewBundle);
      }
    }
  }

  if(ratingFilter != ''){
    console.log('Filtering by Rating...');
    let rating = parseInt(ratingFilter);
    for(const homebrewBundle of homebrewBundles){
      let bundleRating = homebrewBundle.userHomebrewBundles.length;
      switch(ratingRelationFilter) {
        case 'EQUAL': if(bundleRating === rating) {} else {homebrewBundles.delete(homebrewBundle);} break;
        case 'LESS': if(bundleRating < rating) {} else {homebrewBundles.delete(homebrewBundle);} break;
        case 'GREATER': if(bundleRating > rating) {} else {homebrewBundles.delete(homebrewBundle);} break;
        case 'LESS-EQUAL': if(bundleRating <= rating) {} else {homebrewBundles.delete(homebrewBundle);} break;
        case 'GREATER-EQUAL': if(bundleRating >= rating) {} else {homebrewBundles.delete(homebrewBundle);} break;
        case 'NOT-EQUAL': if(bundleRating !== rating) {} else {homebrewBundles.delete(homebrewBundle);} break;
        default: break;
      }
    }
  }

  if(keyRequiredFilter != 'ANY'){
    console.log('Filtering by Key Required...');
    for(const homebrewBundle of homebrewBundles){
      // TO-DO
    }
  }

  displayBundleResults(homebrewBundles);
}

function displayBundleResults(homebrewBundles){
  $('#browsingList').html('');

  if(homebrewBundles.size <= 0){
    $('#browsingList').html('<p class="has-text-centered is-italic">No results found!</p>');
    return;
  }

  for(let homebrewBundle of homebrewBundles){
    let entryID = 'bundle-entry-'+homebrewBundle.id;
    let rating = homebrewBundle.userHomebrewBundles.length;
    let ratingColor = '';

    if(rating > 0){
      ratingColor = 'has-text-success';
    } else if (rating < 0) {
      ratingColor = 'has-text-danger';
    } else {
      ratingColor = 'has-text-warning';
    }

    $('#browsingList').append('<div id="'+entryID+'" class="columns is-mobile border-bottom border-dark-lighter cursor-clickable"><div class="column is-8"><span class="is-size-5">'+homebrewBundle.name+'</span></div><div class="column is-4" style="position: relative;"><span class="is-size-6 pr-2 '+ratingColor+'" style="position: absolute; top: 1px; right: 0px;">'+rating+'</span></div></div>');

    $('#'+entryID).click(function(){
      openBundleView(homebrewBundle);
    });

    $('#'+entryID).mouseenter(function(){
      $(this).addClass('has-background-grey-darker');
    });
    $('#'+entryID).mouseleave(function(){
      $(this).removeClass('has-background-grey-darker');
    });

  }

}