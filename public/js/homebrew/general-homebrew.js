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

  if(editHomebrewID != null || viewHomebrewID != null) {
    if(editHomebrewID != null){
      socket.emit('requestHomebrewBundle', editHomebrewID);
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
