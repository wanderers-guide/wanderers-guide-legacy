/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();
let isBuilderInit = false;

// 
let g_char_ancestryID = null;
let g_char_backgroundID = null;
let g_char_classID = null;
//

// Core Builder Data //
let g_abilMap = null;
let g_featMap = null;
let g_skillMap = null;
let g_itemMap = null;
let g_spellMap = null;
let g_allLanguages = null;
let g_allConditions = null;
let g_allTags = null;
// ~~~~~~~~~~~~~~~~~ //

$(function () {

  socket.emit("requestCharBuilderDetails", getCharIDFromURL());

});

socket.on("returnCharBuilderDetails", function(character, coreDataStruct, inChoiceStruct){
  isBuilderInit = true;

  // Core Builder Data //
  g_abilMap = objToMap(coreDataStruct.AbilObject);
  g_featMap = objToMap(coreDataStruct.FeatObject);
  g_skillMap = objToMap(coreDataStruct.SkillObject);
  g_itemMap = objToMap(coreDataStruct.ItemObject);
  g_spellMap = objToMap(coreDataStruct.SpellObject);
  g_allLanguages = coreDataStruct.AllLanguages;
  g_allConditions = coreDataStruct.AllConditions;
  g_allTags = coreDataStruct.AllTags;
  //
  g_char_ancestryID = character.ancestryID;
  g_char_backgroundID = character.backgroundID;
  g_char_classID = character.classID;
  //
  injectWSCChoiceStruct(inChoiceStruct);
  // ~~~~~~~~~~~~~~~~~ //

  goToBuilderPage($('#char-builder-container').attr('data-page-num'));

});

function goToBuilderPage(pageNum){
  startLoadingPage();
  $("#prevButton").off();
  $("#nextButton").off();
  $("#goToCharButton").off();
  $("#goToCharBigButton").off();
  switch(pageNum+''){
    case '1': window.location.href = '/profile/characters/builder/basics/?id='+getCharIDFromURL(); break;
    case '2': socket.emit("requestBuilderPageAncestry", getCharIDFromURL()); break;
    case '3': socket.emit("requestBuilderPageBackground", getCharIDFromURL()); break;
    case '4': socket.emit("requestBuilderPageClass", getCharIDFromURL()); break;
    case '5': socket.emit("requestBuilderPageFinalize", getCharIDFromURL()); break;
    default: break;
  }
}

function goToSheet(){
  // Hardcoded redirect
  window.location.href ='/profile/characters/'+getCharIDFromURL();
}

socket.on("returnBuilderPageAncestry", function(ancestryObject, uniHeritageArray){
  $('#char-builder-container').load("/templates/char_builder/display-builder-page-2.html");
  $.ajax({ type: "GET",
    url: "/templates/char_builder/display-builder-page-2.html",
    success : function(text)
    {
      $("#prevButton").click(function(){
        goToBuilderPage(1);
      });
      $("#nextButton").parent().removeClass('is-hidden');
      $("#nextButton").click(function(){
        goToBuilderPage(3);
      });
      $("#goToCharButton").parent().removeClass('is-hidden');
      $("#goToCharButton").click(function(){
        goToSheet();
      });
      $("#goToCharBigButton").parent().addClass('is-hidden');
      initBuilderSteps();

      window.history.pushState('builder', '', '/builder/?id='+getCharIDFromURL()+'&page=2');// Update URL
      loadAncestryPage(ancestryObject, uniHeritageArray);
    }
  });
});

socket.on("returnBuilderPageBackground", function(backgrounds){
  $('#char-builder-container').load("/templates/char_builder/display-builder-page-3.html");
  $.ajax({ type: "GET",
    url: "/templates/char_builder/display-builder-page-3.html",
    success : function(text)
    {
      $("#prevButton").click(function(){
        goToBuilderPage(2);
      });
      $("#nextButton").parent().removeClass('is-hidden');
      $("#nextButton").click(function(){
        goToBuilderPage(4);
      });
      $("#goToCharButton").parent().removeClass('is-hidden');
      $("#goToCharButton").click(function(){
        goToSheet();
      });
      $("#goToCharBigButton").parent().addClass('is-hidden');
      initBuilderSteps();

      window.history.pushState('builder', '', '/builder/?id='+getCharIDFromURL()+'&page=3');// Update URL
      loadBackgroundPage(backgrounds);
    }
  });
});

socket.on("returnBuilderPageClass", function(classObject){
  $('#char-builder-container').load("/templates/char_builder/display-builder-page-4.html");
  $.ajax({ type: "GET",
    url: "/templates/char_builder/display-builder-page-4.html",
    success : function(text)
    {
      $("#prevButton").click(function(){
        goToBuilderPage(3);
      });
      $("#nextButton").parent().removeClass('is-hidden');
      $("#nextButton").click(function(){
        goToBuilderPage(5);
      });
      $("#goToCharButton").parent().removeClass('is-hidden');
      $("#goToCharButton").click(function(){
        goToSheet();
      });
      $("#goToCharBigButton").parent().addClass('is-hidden');
      initBuilderSteps();

      window.history.pushState('builder', '', '/builder/?id='+getCharIDFromURL()+'&page=4');// Update URL
      loadClassPage(classObject);
    }
  });
});

socket.on("returnBuilderPageFinalize", function(character, cClass, ancestry){
  $('#char-builder-container').load("/templates/char_builder/display-builder-page-5.html");
  $.ajax({ type: "GET",
    url: "/templates/char_builder/display-builder-page-5.html",
    success : function(text)
    {
      $("#prevButton").click(function(){
        goToBuilderPage(4);
      });
      $("#nextButton").parent().addClass('is-hidden');
      $("#goToCharButton").parent().addClass('is-hidden');
      $("#goToCharBigButton").parent().removeClass('is-hidden');
      $('#goToCharBigButton').click(function(){
        if(!$(this).hasClass('has-text-danger')){
          goToSheet();
        }
      });
      initBuilderSteps();

      window.history.pushState('builder', '', '/builder/?id='+getCharIDFromURL()+'&page=5');// Update URL
      loadFinalizePage(character, cClass, ancestry);
    }
  });
});

function initBuilderSteps(){

  $('.builder-basics-page-btn').click(function(){
    goToBuilderPage(1);
  });
  $('.builder-ancestry-page-btn').click(function(){
    goToBuilderPage(2);
  });
  $('.builder-background-page-btn').click(function(){
    goToBuilderPage(3);
  });
  $('.builder-class-page-btn').click(function(){
    goToBuilderPage(4);
  });
  $('.builder-finalize-page-btn').click(function(){
    goToBuilderPage(5);
  });

}

function startLoadingPage() {
  // Turn on page loading
  $('.pageloader').removeClass("fadeout");
}
function finishLoadingPage() {
  // Turn off page loading
  $('.pageloader').addClass("fadeout");
}