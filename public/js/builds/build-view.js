/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openBuildView(buildID){
  window.history.pushState('builds', '', '/builds/?view_id='+buildID);// Update URL
  socket.emit('requestBuildContents', buildID);
  startSpinnerSubLoader();
}

socket.on("returnBuildContents", function(buildContents){

  if(buildContents == null){ console.error('Don\'t have access!'); }

  g_activeBuild = buildContents.build;

  console.log(buildContents);

  textProcess_warningOnUnknown = true;
  g_skillMap = objToMap(buildContents.sourceMaterial.skillObject);
  g_featMap = objToMap(buildContents.sourceMaterial.featsObject);
  g_itemMap = objToMap(buildContents.sourceMaterial.itemsObject);
  g_spellMap = objToMap(buildContents.sourceMaterial.spellsObject);
  g_allTags = buildContents.sourceMaterial.allTags;
  g_allLanguages = buildContents.sourceMaterial.allLanguages;
  g_allConditions = buildContents.sourceMaterial.allConditions;

  let displayContainerID = 'build-container-'+g_activeBuild.id;
  $('#tabContent').parent().append('<div id="'+displayContainerID+'" class="is-hidden"></div>');
  $('#tabContent').addClass('is-hidden');
  stopSpinnerSubLoader();

  $('#'+displayContainerID).load("/templates/builds/display-view-build.html");
  $.ajax({ type: "GET",
    url: "/templates/builds/display-view-build.html",
    success : function(text)
    {

      $('#build-back-btn').click(function() {
        $('#'+displayContainerID).remove();
        $('#tabContent').removeClass('is-hidden');
        if($('#tabContent').is(':empty')){ $('#browseTab').trigger("click"); }
      });
      $('.category-tabs li').click(function() {
        $('#'+displayContainerID).remove();
      });

      $('#build-name').html(g_activeBuild.name);
      $('#build-description').html(processText(g_activeBuild.description, false, false, 'MEDIUM', false));

      let contactInfoStr = (g_activeBuild.contactInfo != '') ? ', '+g_activeBuild.contactInfo : '';
      $('#build-contact-info').html('<span class="is-thin has-txt-partial-noted">–</span> '+g_activeBuild.authorName+' <span class="is-thin has-txt-partial-noted is-size-7">#'+g_activeBuild.userID+'</span>'+contactInfoStr);

      ///

      // Hide create character button if user isn't logged in
      if($('#builds-container').attr('data-user-id') == '') {
        $('#build-create-character-btn').addClass('is-hidden');
      }

      // Create Character Button //
      $('#build-create-character-btn').click(function() {
        //socket.emit('requestBundleChangeCollection', g_activeBuild.id, true);
      });

      ////

      if(buildContents.mainSelections.bAncestry != null){
        $('#build-ancestry').html(buildContents.mainSelections.bAncestry.name);
      } else {
        $('#build-ancestry').html('Any Ancestry');
      }

      if(buildContents.mainSelections.bHeritage != null || buildContents.mainSelections.bUniHeritage != null){
        if(buildContents.mainSelections.bUniHeritage != null){
          $('#build-heritage').html(buildContents.mainSelections.bUniHeritage.name);
        } else if(buildContents.mainSelections.bHeritage != null){
          $('#build-heritage').html(buildContents.mainSelections.bHeritage.name);
        }
      } else {
        $('#build-heritage').html('Any Heritage');
      }

      if(buildContents.mainSelections.bBackground != null){
        $('#build-background').html(buildContents.mainSelections.bBackground.name);
      } else {
        $('#build-background').html('Any Background');
      }

      if(buildContents.mainSelections.bClass != null){
        $('#build-class').html(buildContents.mainSelections.bClass.name);
      } else {
        $('#build-class').html('Any Class');
      }


      


      ////

      $('#'+displayContainerID).removeClass('is-hidden');
    }
  });
});