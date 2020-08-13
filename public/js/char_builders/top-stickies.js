/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

// ~~~~~~~~~~~~~~ // General - Run On Load // ~~~~~~~~~~~~~~ //
$(function () {

  $('#leftQuickviewButton').click(function(event){
    event.stopImmediatePropagation();
    openLeftQuickView('skillsView', null);
  });

  $('#goToCharButton').click(function(){
    if(!$(this).hasClass('is-danger')){
      goToSheet();
    }
  });

});

function goToSheet(){
  // Hardcoded redirect
  let rBuilderURL = 'builder\/'+getCharIDFromURL()+'\/page\\d.?';
  let re = new RegExp(rBuilderURL,'');
  window.location.href = window.location.href.replace(re, getCharIDFromURL());
}