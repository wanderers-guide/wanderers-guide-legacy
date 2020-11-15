/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

let g_profileName = null;

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

  g_profileName= $('#profileName').attr('data-profile-name');

  $('#profileNameBtn').click(function() {
    $('#profileName').html('<div class="pt-2"><input id="profileNameInput" class="input is-medium" style="max-width: 340px;" maxlength="40" value="'+g_profileName+'" spellcheck="false" autocomplete="off"></div>');
    $('#profileNameBtn').addClass('is-hidden');
    $('#profileNameInput').focus();
  
    $('#profileNameInput').blur(function(){
      let newName = $('#profileNameInput').val();
      if(newName == null || newName == '') {return;}
      $(this).unbind();
      $('#profileName').html(newName);
      $('#profileNameBtn').removeClass('is-hidden');
      socket.emit("requestProfileNameChange", newName);
    });
  
  });

});

socket.on("returnProfileNameChange", function(newName){
  g_profileName = newName;
});