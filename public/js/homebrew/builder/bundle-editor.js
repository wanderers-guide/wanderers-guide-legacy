/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_activeEditBundle = null;

function openBundleEditor(homebrewBundle){
  g_activeEditBundle = homebrewBundle;
  socket.emit('requestBundleContents', homebrewBundle.id);
}

socket.on("returnBundleContents", function(classes){
  $('#tabContent').html('');
  $('#tabContent').load("/templates/homebrew/display-edit-bundle.html");
  $.ajax({ type: "GET",
    url: "/templates/homebrew/display-edit-bundle.html",
    success : function(text)
    {

      $('#bundleName').html(g_activeEditBundle.name);
      $('#bundleDescription').val(g_activeEditBundle.description);
      $('#bundleContactInfo').val(g_activeEditBundle.contactInfo);

      $("#bundleDescription").blur(function(){
        if(g_activeEditBundle.description != $(this).val()) {
          $('#bundleDescription').parent().addClass("is-loading");
          socket.emit("requestBundleUpdate",
               g_activeEditBundle.id,
              {
                Description: $(this).val()
              }
          );
        }
      });

      $("#bundleContactInfo").blur(function(){
        if(g_activeEditBundle.contactInfo != $(this).val()) {
          $('#bundleContactInfo').parent().addClass("is-loading");
          socket.emit("requestBundleUpdate",
              g_activeEditBundle.id,
              {
                ContactInfo: $(this).val()
              }
          );
        }
      });

      $('#bundleRenameBtn').click(function() {
        $('#bundleName').html('<div class="pt-2"><input id="bundleRenameInput" class="input is-medium" style="max-width: 340px;" maxlength="40" value="'+g_activeEditBundle.name+'"></div>');
        $('#bundleRenameBtn').addClass('is-hidden');

        $('#bundleRenameInput').blur(function(){
          $(this).unbind();
          let newName = $('#bundleRenameInput').val();
          $('#bundleName').html(newName);
          $('#bundleRenameBtn').removeClass('is-hidden');
          socket.emit("requestBundleUpdate",
            g_activeEditBundle.id,
            {
              Name: newName,
            }
          );
        });

      });

      ///

      $('#backToUserContentBtn').click(function() {
        openUserContent();
      });

      $('#bundlePublishBtn').click(function() {
        
      });

      ///

      if(classes.length > 0){
        $('#bundleContainerClasses').html('');
        for(const cClass of classes){
          $('#bundleContainerClasses').append('<p>'+cClass.name+'</p>');
        }
      }

      $('#createClassBtn').click(function() {
        window.location.href = '/homebrew/create/class/?id='+g_activeEditBundle.id;
      });



    }
  });
});

socket.on("returnBundleCreate", function(homebrewBundle){
  if(homebrewBundle != null) {
    openBundleEditor(homebrewBundle);
  }
});

socket.on("returnBundleUpdate", function(homebrewBundle){
  if(homebrewBundle != null) {
    g_activeEditBundle = homebrewBundle;
    $('#bundleName').html(g_activeEditBundle.name);
    $('#bundleRenameBtn').removeClass('is-hidden');
    $('#bundleDescription').parent().removeClass("is-loading");
    $('#bundleDescription').val(g_activeEditBundle.description);
    $('#bundleContactInfo').parent().removeClass("is-loading");
    $('#bundleContactInfo').val(g_activeEditBundle.contactInfo);
  }
});