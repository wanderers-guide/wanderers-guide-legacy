/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let activeModalCharID = -1;
let socket = io();

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    let characterCards = $('.character-card');
    for(const characterCard of characterCards){

        let characterID = $(characterCard).attr('name');
        let cardContent = $(characterCard).find('.card-content');
        let cardEdit = $(characterCard).find('.character-card-edit');
        let cardDelete = $(characterCard).find('.character-card-delete');
        let cardOptions = $(characterCard).find('.character-card-options');

        cardContent.mouseenter(function(){
            $(this).addClass('card-content-hover');
        });
        cardContent.mouseleave(function(){
            $(this).removeClass('card-content-hover');
        });
        cardContent.click(function() {
            window.location.href = '/profile/characters/'+characterID;
        });

        cardEdit.mouseenter(function(){
            $(this).addClass('card-footer-hover');
        });
        cardEdit.mouseleave(function(){
            $(this).removeClass('card-footer-hover');
        });
        cardEdit.click(function() {
            window.location.href = '/profile/characters/builder/basics/?id='+characterID;
        });

        cardDelete.mouseenter(function(){
            $(this).addClass('card-footer-hover');
        });
        cardDelete.mouseleave(function(){
            $(this).removeClass('card-footer-hover');
        });
        cardDelete.click(function() {
            $('.modal-char-delete').addClass('is-active');
            $('html').addClass('is-clipped');
            activeModalCharID = characterID;
        });

        cardOptions.mouseenter(function(){
          $(this).addClass('card-footer-hover');
        });
        cardOptions.mouseleave(function(){
          $(this).removeClass('card-footer-hover');
        });
        cardOptions.click(function() {
          $('.modal-char-options').addClass('is-active');
          $('html').addClass('is-clipped');
          activeModalCharID = characterID;
        });
        
    }

    $('.modal-card-close').click(function() {
      $('.modal').removeClass('is-active');
      $('html').removeClass('is-clipped');
      activeModalCharID = -1;
    });
    $('.modal-background').click(function() {
      $('.modal').removeClass('is-active');
      $('html').removeClass('is-clipped');
      activeModalCharID = -1;
    });

    $('#delete-confirmation-btn').click(function() {
      window.location.href = '/profile/characters/delete/'+activeModalCharID;
    });

    if($('#icon-character-import').length){ // If icon-character-import exists, AKA is advocate tier
      initCharacterImport();
      initCharacterExport();
    }

});

// ~~~~~ Character Import ~~~~~ //
function initCharacterImport(){
  const fileInput = document.querySelector('#input-character-import');
  fileInput.onchange = () => {
    if (fileInput.files.length > 0) {

      let file = fileInput.files[0];
      let fileReader = new FileReader();

      // Closure to capture the file information.
      fileReader.onload = (function(capturedFile) {
        return function(e) {
          if(capturedFile.name.endsWith('.guidechar')) {
            try {
              let charExportData = JSON.parse(e.target.result);
              socket.emit("requestCharImport", charExportData);
              $('.subpageloader').removeClass('is-hidden');
            } catch (err) {
              console.log(err);
              console.log('Failed to import "'+capturedFile.name+'"');
            }
          }
        };
      })(file);

      // Read in the image file as a data URL.
      fileReader.readAsText(file);
    }
  };
}

socket.on("returnCharImport", function(){
  // Hardcoded redirect
  window.location.href = '/profile/characters';
});


// ~~~~~ Character Export ~~~~~ //
function initCharacterExport() {

  $('#btn-export-character').click(function() {
    socket.emit("requestCharExport", activeModalCharID);
  });

}

socket.on("returnCharExport", function(charExportData){
  
  let charExportDataJSON = JSON.stringify(charExportData);
  let fileName = charExportData.character.name.replaceAll('[^a-zA-Z]', '').replaceAll(' ', '_');
  charExportDataFileDownload(fileName+'.guidechar', charExportDataJSON);
  $('.modal-card-close').trigger('click');

});

function charExportDataFileDownload(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}