/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_activeEditBundle = null;

function openBundleEditor(homebrewBundle){
  g_activeEditBundle = homebrewBundle;
  socket.emit('requestBundleContents', homebrewBundle.id);
}

socket.on("returnBundleContents", function(classes, ancestries, archetypes, backgrounds, classFeatures, feats, heritages, uniheritages, items, spells){
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

      $('#createClassBtn').click(function() {
        window.location.href = '/homebrew/create/class/?id='+g_activeEditBundle.id;
      });

      if(classes.length > 0){
        $('#bundleContainerClasses').html('');
        for(const cClass of classes){
          let viewClassID = 'entry-view-class-'+cClass.id;
          let editClassID = 'entry-edit-class-'+cClass.id;
          let deleteClassID = 'entry-delete-class-'+cClass.id;
          $('#bundleContainerClasses').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+cClass.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewClassID+'" class="button is-rounded is-info">View</button><button id="'+editClassID+'" class="button is-success"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteClassID+'" class="button is-danger"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewClassID).click(function() {
            //new DisplayClass('tabContent', cClass.id, g_featMap);
          });
          $('#'+editClassID).click(function() {
            window.location.href = '/homebrew/edit/class/?id='+g_activeEditBundle.id+'&class_id='+cClass.id;
          });
          $('#'+deleteClassID).click(function() {
            socket.emit('requestHomebrewRemoveClass', g_activeEditBundle.id, cClass.id);
          });
        }
      }

      ///

      $('#createAncestryBtn').click(function() {
        window.location.href = '/homebrew/create/ancestry/?id='+g_activeEditBundle.id;
      });

      if(ancestries.length > 0){
        $('#bundleContainerAncestries').html('');
        for(const ancestry of ancestries){
          let viewAncestryID = 'entry-view-ancestry-'+ancestry.id;
          let editAncestryID = 'entry-edit-ancestry-'+ancestry.id;
          let deleteAncestryID = 'entry-delete-ancestry-'+ancestry.id;
          $('#bundleContainerAncestries').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+ancestry.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewAncestryID+'" class="button is-rounded is-info">View</button><button id="'+editAncestryID+'" class="button is-success"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteAncestryID+'" class="button is-danger"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewAncestryID).click(function() {
            //
          });
          $('#'+editAncestryID).click(function() {
            window.location.href = '/homebrew/edit/ancestry/?id='+g_activeEditBundle.id+'&ancestry_id='+ancestry.id;
          });
          $('#'+deleteAncestryID).click(function() {
            socket.emit('requestHomebrewRemoveAncestry', g_activeEditBundle.id, ancestry.id);
          });
        }
      }

      ///

      $('#createArchetypeBtn').click(function() {
        window.location.href = '/homebrew/create/archetype/?id='+g_activeEditBundle.id;
      });

      if(archetypes.length > 0){
        $('#bundleContainerArchetypes').html('');
        for(const archetype of archetypes){
          let viewArchetypeID = 'entry-view-archetype-'+archetype.id;
          let editArchetypeID = 'entry-edit-archetype-'+archetype.id;
          let deleteArchetypeID = 'entry-delete-archetype-'+archetype.id;
          $('#bundleContainerArchetypes').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+archetype.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewArchetypeID+'" class="button is-rounded is-info">View</button><button id="'+editArchetypeID+'" class="button is-success"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteArchetypeID+'" class="button is-danger"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewArchetypeID).click(function() {
            //
          });
          $('#'+editArchetypeID).click(function() {
            window.location.href = '/homebrew/edit/archetype/?id='+g_activeEditBundle.id+'&archetype_id='+archetype.id;
          });
          $('#'+deleteArchetypeID).click(function() {
            socket.emit('requestHomebrewRemoveArchetype', g_activeEditBundle.id, archetype.id);
          });
        }
      }

      ////

      $('#createBackgroundBtn').click(function() {
        window.location.href = '/homebrew/create/background/?id='+g_activeEditBundle.id;
      });

      if(backgrounds.length > 0){
        $('#bundleContainerBackgrounds').html('');
        for(const background of backgrounds){
          let viewBackgroundID = 'entry-view-background-'+background.id;
          let editBackgroundID = 'entry-edit-background-'+background.id;
          let deleteBackgroundID = 'entry-delete-background-'+background.id;
          $('#bundleContainerBackgrounds').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+background.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewBackgroundID+'" class="button is-rounded is-info">View</button><button id="'+editBackgroundID+'" class="button is-success"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteBackgroundID+'" class="button is-danger"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewBackgroundID).click(function() {
            //
          });
          $('#'+editBackgroundID).click(function() {
            window.location.href = '/homebrew/edit/background/?id='+g_activeEditBundle.id+'&background_id='+background.id;
          });
          $('#'+deleteBackgroundID).click(function() {
            socket.emit('requestHomebrewRemoveBackground', g_activeEditBundle.id, background.id);
          });
        }
      }

      ////

      $('#createClassFeatureBtn').click(function() {
        window.location.href = '/homebrew/create/class-feature/?id='+g_activeEditBundle.id;
      });

      if(classFeatures.length > 0){
        $('#bundleContainerClassFeatures').html('');
        for(const classFeature of classFeatures){
          let viewClassFeatureID = 'entry-view-class-feature-'+classFeature.id;
          let editClassFeatureID = 'entry-edit-class-feature-'+classFeature.id;
          let deleteClassFeatureID = 'entry-delete-class-feature-'+classFeature.id;
          $('#bundleContainerClassFeatures').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+classFeature.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewClassFeatureID+'" class="button is-rounded is-info">View</button><button id="'+editClassFeatureID+'" class="button is-success"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteClassFeatureID+'" class="button is-danger"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewClassFeatureID).click(function() {
            //
          });
          $('#'+editClassFeatureID).click(function() {
            window.location.href = '/homebrew/edit/class-feature/?id='+g_activeEditBundle.id+'&class_feature_id='+classFeature.id;
          });
          $('#'+deleteClassFeatureID).click(function() {
            socket.emit('requestHomebrewRemoveClassFeature', g_activeEditBundle.id, classFeature.id);
          });
        }
      }

      ////

      $('#createFeatBtn').click(function() {
        window.location.href = '/homebrew/create/feat-activity/?id='+g_activeEditBundle.id;
      });

      if(feats.length > 0){
        $('#bundleContainerFeats').html('');
        for(const feat of feats){
          let viewFeatID = 'entry-view-feat-activity-'+feat.id;
          let editFeatID = 'entry-edit-feat-activity-'+feat.id;
          let deleteFeatID = 'entry-delete-feat-activity-'+feat.id;
          $('#bundleContainerFeats').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+feat.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewFeatID+'" class="button is-rounded is-info">View</button><button id="'+editFeatID+'" class="button is-success"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteFeatID+'" class="button is-danger"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewFeatID).click(function() {
            //
          });
          $('#'+editFeatID).click(function() {
            window.location.href = '/homebrew/edit/feat-activity/?id='+g_activeEditBundle.id+'&feat_id='+feat.id;
          });
          $('#'+deleteFeatID).click(function() {
            socket.emit('requestHomebrewRemoveFeat', g_activeEditBundle.id, feat.id);
          });
        }
      }

      ////

      $('#createHeritageBtn').click(function() {
        window.location.href = '/homebrew/create/heritage/?id='+g_activeEditBundle.id;
      });

      if(heritages.length > 0){
        $('#bundleContainerHeritages').html('');
        for(const heritage of heritages){
          let viewHeritageID = 'entry-view-heritage-'+heritage.id;
          let editHeritageID = 'entry-edit-heritage-'+heritage.id;
          let deleteHeritageID = 'entry-delete-heritage-'+heritage.id;
          $('#bundleContainerHeritages').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+heritage.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewHeritageID+'" class="button is-rounded is-info">View</button><button id="'+editHeritageID+'" class="button is-success"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteHeritageID+'" class="button is-danger"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewHeritageID).click(function() {
            //
          });
          $('#'+editHeritageID).click(function() {
            window.location.href = '/homebrew/edit/heritage/?id='+g_activeEditBundle.id+'&heritage_id='+heritage.id;
          });
          $('#'+deleteHeritageID).click(function() {
            socket.emit('requestHomebrewRemoveHeritage', g_activeEditBundle.id, heritage.id);
          });
        }
      }

      ////

      $('#createUniHeritageBtn').click(function() {
        window.location.href = '/homebrew/create/uni-heritage/?id='+g_activeEditBundle.id;
      });

      if(uniheritages.length > 0){
        $('#bundleContainerUniHeritages').html('');
        for(const uniheritage of uniheritages){
          let viewUniHeritageID = 'entry-view-uni-heritage-'+uniheritage.id;
          let editUniHeritageID = 'entry-edit-uni-heritage-'+uniheritage.id;
          let deleteUniHeritageID = 'entry-delete-uni-heritage-'+uniheritage.id;
          $('#bundleContainerUniHeritages').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+uniheritage.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewUniHeritageID+'" class="button is-rounded is-info">View</button><button id="'+editUniHeritageID+'" class="button is-success"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteUniHeritageID+'" class="button is-danger"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewUniHeritageID).click(function() {
            //
          });
          $('#'+editUniHeritageID).click(function() {
            window.location.href = '/homebrew/edit/uni-heritage/?id='+g_activeEditBundle.id+'&uni_heritage_id='+uniheritage.id;
          });
          $('#'+deleteUniHeritageID).click(function() {
            socket.emit('requestHomebrewRemoveUniHeritage', g_activeEditBundle.id, uniheritage.id);
          });
        }
      }

      ////

      $('#createItemBtn').click(function() {
        window.location.href = '/homebrew/create/item/?id='+g_activeEditBundle.id;
      });

      if(items.length > 0){
        $('#bundleContainerItems').html('');
        for(const item of items){
          let viewItemID = 'entry-view-item-'+item.id;
          let editItemID = 'entry-edit-item-'+item.id;
          let deleteItemID = 'entry-delete-item-'+item.id;
          $('#bundleContainerItems').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+item.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewItemID+'" class="button is-rounded is-info">View</button><button id="'+editItemID+'" class="button is-success"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteItemID+'" class="button is-danger"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewItemID).click(function() {
            //
          });
          $('#'+editItemID).click(function() {
            window.location.href = '/homebrew/edit/item/?id='+g_activeEditBundle.id+'&item_id='+item.id;
          });
          $('#'+deleteItemID).click(function() {
            socket.emit('requestHomebrewRemoveItem', g_activeEditBundle.id, item.id);
          });
        }
      }

      ////

      $('#createSpellBtn').click(function() {
        window.location.href = '/homebrew/create/spell/?id='+g_activeEditBundle.id;
      });

      if(spells.length > 0){
        $('#bundleContainerSpells').html('');
        for(const spell of spells){
          let viewSpellID = 'entry-view-spell-'+spell.id;
          let editSpellID = 'entry-edit-spell-'+spell.id;
          let deleteSpellID = 'entry-delete-spell-'+spell.id;
          $('#bundleContainerSpells').append('<div class="columns is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+spell.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewSpellID+'" class="button is-rounded is-info">View</button><button id="'+editSpellID+'" class="button is-success"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteSpellID+'" class="button is-danger"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewSpellID).click(function() {
            //
          });
          $('#'+editSpellID).click(function() {
            window.location.href = '/homebrew/edit/spell/?id='+g_activeEditBundle.id+'&spell_id='+spell.id;
          });
          $('#'+deleteSpellID).click(function() {
            socket.emit('requestHomebrewRemoveSpell', g_activeEditBundle.id, spell.id);
          });
        }
      }

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

socket.on("returnHomebrewRemoveContent", function(){
  openBundleEditor(g_activeEditBundle);
});