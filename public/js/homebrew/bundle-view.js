/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_activeViewBundle = null;

function openBundleView(homebrewBundle){
  g_activeViewBundle = homebrewBundle;
  socket.emit('requestBundleContents', 'VIEW', homebrewBundle.id);
}

socket.on("returnBundleContents", function(REQUEST_TYPE, userHasBundle, classes, ancestries, archetypes, backgrounds, classFeatures, feats, heritages, uniheritages, items, spells){
  if(REQUEST_TYPE !== 'VIEW') {return;}

  let displayContainerID = 'bundle-container-'+g_activeViewBundle.id;
  $('#tabContent').parent().append('<div id="'+displayContainerID+'" class="is-hidden"></div>');
  $('#tabContent').addClass('is-hidden');

  $('#'+displayContainerID).load("/templates/homebrew/display-view-bundle.html");
  $.ajax({ type: "GET",
    url: "/templates/homebrew/display-view-bundle.html",
    success : function(text)
    {

      $('#bundle-back-btn').click(function() {
        $('#'+displayContainerID).remove();
        $('#tabContent').removeClass('is-hidden');
      });
      $('.category-tabs li').click(function() {
        $('#'+displayContainerID).remove();
      });

      $('#bundleName').html(g_activeViewBundle.name);
      $('#bundleDescription').html(g_activeViewBundle.description);
      $('#bundleContactInfo').html(g_activeViewBundle.contactInfo);

      ///

      if(userHasBundle){
        $('#bundleCollectionRemoveBtn').removeClass('is-hidden');
      } else {
        $('#bundleCollectionAddBtn').removeClass('is-hidden');
      }

      $('#bundleCollectionAddBtn').click(function() {
        socket.emit('requestBundleChangeCollection', g_activeViewBundle.id, true);
        $('#bundleCollectionAddBtn').addClass('is-hidden');
        $('#bundleCollectionRemoveBtn').removeClass('is-hidden');
      });

      $('#bundleCollectionRemoveBtn').click(function() {
        socket.emit('requestBundleChangeCollection', g_activeViewBundle.id, false);
        $('#bundleCollectionRemoveBtn').addClass('is-hidden');
        $('#bundleCollectionAddBtn').removeClass('is-hidden');
      });

      ///

      if(classes.length > 0){
        $('#bundleSectionClasses').removeClass('is-hidden');
        $('#bundleContainerClasses').html('');
        for(const cClass of classes){
          let viewClassID = 'entry-view-class-'+cClass.id;
          $('#bundleContainerClasses').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+cClass.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewClassID+'" class="button is-rounded is-info">View</button></div></div></div>');
          $('#'+viewClassID).click(function() {
            //
          });
        }
      }

      ///

      if(ancestries.length > 0){
        $('#bundleSectionAncestries').removeClass('is-hidden');
        $('#bundleContainerAncestries').html('');
        for(const ancestry of ancestries){
          let viewAncestryID = 'entry-view-ancestry-'+ancestry.id;
          $('#bundleContainerAncestries').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+ancestry.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewAncestryID+'" class="button is-rounded is-info">View</button></div></div></div>');
          $('#'+viewAncestryID).click(function() {
            //
          });
        }
      }

      ///

      if(archetypes.length > 0){
        $('#bundleSectionArchetypes').removeClass('is-hidden');
        $('#bundleContainerArchetypes').html('');
        for(const archetype of archetypes){
          let viewArchetypeID = 'entry-view-archetype-'+archetype.id;
          $('#bundleContainerArchetypes').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+archetype.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewArchetypeID+'" class="button is-rounded is-info">View</button></div></div></div>');
          $('#'+viewArchetypeID).click(function() {
            //
          });
        }
      }

      ////

      if(backgrounds.length > 0){
        $('#bundleSectionBackgrounds').removeClass('is-hidden');
        $('#bundleContainerBackgrounds').html('');
        for(const background of backgrounds){
          let viewBackgroundID = 'entry-view-background-'+background.id;
          $('#bundleContainerBackgrounds').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+background.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewBackgroundID+'" class="button is-rounded is-info">View</button></div></div></div>');
          $('#'+viewBackgroundID).click(function() {
            //
          });
        }
      }

      ////

      if(classFeatures.length > 0){
        $('#bundleSectionClassFeatures').removeClass('is-hidden');
        $('#bundleContainerClassFeatures').html('');
        for(const classFeature of classFeatures){
          let viewClassFeatureID = 'entry-view-class-feature-'+classFeature.id;
          $('#bundleContainerClassFeatures').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+classFeature.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewClassFeatureID+'" class="button is-rounded is-info">View</button></div></div></div>');
          $('#'+viewClassFeatureID).click(function() {
            //
          });
        }
      }

      ////

      if(feats.length > 0){
        $('#bundleSectionFeats').removeClass('is-hidden');
        $('#bundleContainerFeats').html('');
        for(const feat of feats){
          let viewFeatID = 'entry-view-feat-activity-'+feat.id;
          $('#bundleContainerFeats').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+feat.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewFeatID+'" class="button is-rounded is-info">View</button></div></div></div>');
          $('#'+viewFeatID).click(function() {
            //
          });
        }
      }

      ////

      if(heritages.length > 0){
        $('#bundleSectionHeritages').removeClass('is-hidden');
        $('#bundleContainerHeritages').html('');
        for(const heritage of heritages){
          let viewHeritageID = 'entry-view-heritage-'+heritage.id;
          $('#bundleContainerHeritages').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+heritage.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewHeritageID+'" class="button is-rounded is-info">View</button></div></div></div>');
          $('#'+viewHeritageID).click(function() {
            //
          });
        }
      }

      ////

      if(uniheritages.length > 0){
        $('#bundleSectionUniHeritages').removeClass('is-hidden');
        $('#bundleContainerUniHeritages').html('');
        for(const uniheritage of uniheritages){
          let viewUniHeritageID = 'entry-view-uni-heritage-'+uniheritage.id;
          $('#bundleContainerUniHeritages').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+uniheritage.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewUniHeritageID+'" class="button is-rounded is-info">View</button></div></div></div>');
          $('#'+viewUniHeritageID).click(function() {
            //
          });
        }
      }

      ////

      if(items.length > 0){
        $('#bundleSectionItems').removeClass('is-hidden');
        $('#bundleContainerItems').html('');
        for(const item of items){
          let viewItemID = 'entry-view-item-'+item.id;
          $('#bundleContainerItems').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+item.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewItemID+'" class="button is-rounded is-info">View</button></div></div></div>');
          $('#'+viewItemID).click(function() {
            //
          });
        }
      }

      ////

      if(spells.length > 0){
        $('#bundleSectionSpells').removeClass('is-hidden');
        $('#bundleContainerSpells').html('');
        for(const spell of spells){
          let viewSpellID = 'entry-view-spell-'+spell.id;
          $('#bundleContainerSpells').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+spell.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewSpellID+'" class="button is-rounded is-info">View</button></div></div></div>');
          $('#'+viewSpellID).click(function() {
            //
          });
        }
      }

      $('#'+displayContainerID).removeClass('is-hidden');
    }
  });
});