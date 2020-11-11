/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

  $('.category-tabs li a').click(function() {
    $('#browseTab').parent().removeClass("is-active");
    $('#userCollectionTab').parent().removeClass("is-active");
    $('#userContentTab').parent().removeClass("is-active");
    $(this).parent().addClass("is-active");
  });

  $('#browseTab').click(function() {
    openBundleBrowse();
  });

  $('#userCollectionTab').click(function() {
    openUserCollection();
  });

  $('#userContentTab').click(function() {
    openUserContent();
  });


  let editHomebrewID = $('#homebrew-container').attr('data-edit-homebrew-id');
  let viewHomebrewID = $('#homebrew-container').attr('data-view-homebrew-id');
  let homebrewTabName = $('#homebrew-container').attr('data-direct-to-tab').toUpperCase();

  if(editHomebrewID != '' || viewHomebrewID != '' || homebrewTabName != '') {
    if(editHomebrewID != ''){
      socket.emit('requestHomebrewBundle', editHomebrewID);
    } else if(viewHomebrewID != ''){
      //
    } else if(homebrewTabName != ''){
      switch(homebrewTabName) {
        case 'BROWSE': $('#browseTab').trigger("click"); break;
        case 'COLLECTION': $('#userCollectionTab').trigger("click"); break;
        case 'CONTENT': $('#userContentTab').trigger("click"); break;
        default: break;
      }
    }
  } else {
    $('#browseTab').trigger("click");
  }

});

socket.on("returnHomebrewBundle", function(homebrewBundle){
  if(homebrewBundle != null){
    $('#userContentTab').parent().addClass("is-active");
    openBundleEditor(homebrewBundle);
  }
});
