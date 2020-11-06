/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_homebrewBundles = null;
function openUserContent(){
  socket.emit('requestHomebrewBundles');
}

socket.on("returnHomebrewBundles", function(homebrewBundles){
  g_homebrewBundles = homebrewBundles;
  $('#tabContent').html('');
  $('#tabContent').load("/templates/homebrew/display-user-content.html");
  $.ajax({ type: "GET",
    url: "/templates/homebrew/display-user-content.html",
    success : function(text)
    {

      $('#createBundleBtn').click(function() {
        socket.emit('requestBundleCreate');
      });

      let foundPublished = false;
      let foundInProgess = false;
      for (const homebrewBundle of homebrewBundles) {
        if(homebrewBundle.isPublished == 1){
          foundPublished = true;

          let bundleViewID = 'bundle-'+homebrewBundle.id+'-view';
          let bundleUpdateID = 'bundle-'+homebrewBundle.id+'-update';
          let bundleDeleteID = 'bundle-'+homebrewBundle.id+'-delete';

          $('#bundlesPublishedContainer').append('<div class="columns border-bottom border-dark-lighter"><div class="column is-6 text-center"><span class="is-size-5">'+homebrewBundle.name+'</span></div><div class="column is-6"><div class="buttons are-small is-centered"><button id="'+bundleViewID+'" class="button is-success">View</button><button id="'+bundleUpdateID+'" class="button is-link">Update</button><button id="'+bundleDeleteID+'" class="button is-danger">Delete</button></div></div></div>');

          $('#'+bundleViewID).click(function() {
            
          });

          $('#'+bundleUpdateID).click(function() {
            
          });

          $('#'+bundleDeleteID).click(function() {
            
          });

        } else {
          foundInProgess = true;

          let bundleEditID = 'bundle-'+homebrewBundle.id+'-edit';
          let bundleDeleteID = 'bundle-'+homebrewBundle.id+'-delete';

          $('#bundlesInProgessContainer').append('<div class="columns border-bottom border-dark-lighter"><div class="column is-6 text-center"><span class="is-size-5">'+homebrewBundle.name+'</span></div><div class="column is-6"><div class="buttons are-small is-centered"><button id="'+bundleEditID+'" class="button is-info">Edit</button><button id="'+bundleDeleteID+'" class="button is-danger">Delete</button></div></div></div>');

          $('#'+bundleEditID).click(function() {
            openBundleEditor(homebrewBundle);
          });

          $('#'+bundleDeleteID).click(function() {
            socket.emit('requestBundleDelete', homebrewBundle.id);
          });

        }
      }
      
      if(!foundPublished){
        $('#bundlesPublishedContainer').html('<p class="has-text-centered has-text-grey is-italic">None</p>');
      }
      if(!foundInProgess){
        $('#bundlesInProgessContainer').html('<p class="has-text-centered has-text-grey is-italic">None</p>');
      }

    }
  });
});

socket.on("returnBundleDelete", function(){
  openUserContent();
});