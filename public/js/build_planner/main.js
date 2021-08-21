/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

$(function () {

  // Assemble accords
  $('.accord-container').each(function() {
    let accordHeader = $(this).find('.accord-header');
    $(accordHeader).click(function() {
      let accordBody = $(this).parent().find('.accord-body');
      let accordChevron = $(this).parent().find('.accord-chevron');
      if($(accordBody).hasClass("is-hidden")) {
        $(accordBody).removeClass('is-hidden');
        $(accordChevron).removeClass('fa-chevron-down');
        $(accordChevron).addClass('fa-chevron-up');
      } else {
        $(accordBody).addClass('is-hidden');
        $(accordChevron).removeClass('fa-chevron-up');
        $(accordChevron).addClass('fa-chevron-down');
      }
    });
    $(accordHeader).mouseenter(function(){
      $(accordHeader).addClass('accord-hover');
    });
    $(accordHeader).mouseleave(function(){
      $(accordHeader).removeClass('accord-hover');
    });
  });

  $('.accord-like-button').each(function() {
    $(this).mouseenter(function(){
      $(this).addClass('accord-hover');
    });
    $(this).mouseleave(function(){
      $(this).removeClass('accord-hover');
    });
  });

  populateAccord('resist-weaks-body', ['Cold', 'Warm', 'Orange']);
  populateAccord('saves-body', ['Fortitude', 'Reflex', 'Will']);
  populateAccord('skills-body', ['Athletics', 'Dancing', 'Hugging']);
  populateAccord('attacks-body', ['Rapier', 'Sword', 'Unarmed Attacks']);
  populateAccord('defenses-body', ['Light Armor', 'Medium Armor', 'Unarmored Defense']);
  populateAccord('spellcasting-body', ['Primal Spellcasting', 'Primal DCs', 'Another one']);
  populateAccord('languages-body', ['Common', 'Gnomish', 'Gobo']);

     
});



function populateAccord(accordBodyID, optionsList){

  let content = $('#'+accordBodyID);
  content.html('');


  for(let i = 0; i < optionsList.length; i++){
    let optionEntryID = `${accordBodyID}-entry-${i}`;
    let option = optionsList[i];

    const skillHTML = `
      <div id="${optionEntryID}" class="columns is-mobile is-marginless p-1 border-bottom border-dark-lighter cursor-clickable">
        <div class="column is-8 is-paddingless"><p class="pl-2">${option}</p></div>
        <div class="column is-2 is-paddingless"><p class="has-text-centered">+34</p></div>
        <div class="column is-2 is-paddingless"><p class="has-text-centered is-italic has-text-grey">E</p></div>
      </div>
    `;
    content.append(skillHTML);

    $('#'+optionEntryID).mouseenter(function(){
      $('#'+optionEntryID).addClass('entry-hover');
    });
    $('#'+optionEntryID).mouseleave(function(){
      $('#'+optionEntryID).removeClass('entry-hover');
    });
    $('#'+optionEntryID).click(function() {
      
    });

  }

}