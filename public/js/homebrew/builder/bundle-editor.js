/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openBundleEditor(homebrewBundle){
  g_activeBundle = homebrewBundle;
  window.history.pushState('homebrew', '', '/homebrew/?edit_id='+g_activeBundle.id);// Update URL
  socket.emit('requestBundleContents', 'EDIT', homebrewBundle.id);
}

socket.on("returnBundleContents", function(REQUEST_TYPE, userHasBundle, allTags, classes, ancestries, archetypes, backgrounds, classFeatures, feats, heritages, uniheritages, items, spells){
  if(REQUEST_TYPE !== 'EDIT') {return;}

  let featMap = new Map();
  for(let feat of feats){
    let tags = [];
    // Find tags by id
    for(let featTag of feat.featTags){
      let tag = allTags.find(tag => {
        return tag.id === featTag.tagID;
      });
      if(tag != null) {tags.push(tag);}
    }
    // Find tag for genTypeName
    if(feat.genTypeName != null){
      let tag = allTags.find(tag => {
        if(tag.isArchived == 0){ return tag.name === feat.genTypeName; } else { return false; }
      });
      if(tag != null) {tags.push(tag);}
    }
    featMap.set(feat.id+'', {Feat : feat, Tags : tags});
  }

  let itemMap = new Map();
  for(let item of items){
    let tags = [];
    // Find tags by id
    for(let itemTag of item.taggedItems){
      let tag = allTags.find(tag => {
        return tag.id === itemTag.tagID;
      });
      if(tag != null) {tags.push({Tag: tag});}
    }
    itemMap.set(item.id+'', {Item : item, TagArray : tags});
  }

  let spellMap = new Map();
  for(let spell of spells){
    let tags = [];
    // Find tags by id
    for(let spellTag of spell.taggedSpells){
      let tag = allTags.find(tag => {
        return tag.id === spellTag.tagID;
      });
      if(tag != null) {tags.push(tag);}
    }
    spellMap.set(spell.id+'', {Spell : spell, Tags : tags});
  }


  $('#tabContent').html('');
  $('#tabContent').load("/templates/homebrew/display-edit-bundle.html");
  $.ajax({ type: "GET",
    url: "/templates/homebrew/display-edit-bundle.html",
    success : function(text)
    {
      initNewContentTemplating();

      $('#bundleName').html(g_activeBundle.name);
      $('#bundleDescription').val(g_activeBundle.description);
      $('#bundleContactInfo').val(g_activeBundle.contactInfo);

      $("#bundleDescription").blur(function(){
        if(g_activeBundle.description != $(this).val()) {
          $('#bundleDescription').parent().addClass("is-loading");
          socket.emit("requestBundleUpdate",
               g_activeBundle.id,
              {
                Description: $(this).val()
              }
          );
        }
      });

      $("#bundleContactInfo").blur(function(){
        if(g_activeBundle.contactInfo != $(this).val()) {
          $('#bundleContactInfo').parent().addClass("is-loading");
          socket.emit("requestBundleUpdate",
              g_activeBundle.id,
              {
                ContactInfo: $(this).val()
              }
          );
        }
      });

      $('#bundleRenameBtn').click(function() {
        $('#bundleName').html('<div class="pt-2"><input id="bundleRenameInput" class="input is-medium" style="max-width: 340px;" maxlength="40" value="'+g_activeBundle.name+'" autocomplete="off"></div>');
        $('#bundleRenameBtn').addClass('is-hidden');
        $('#bundleRenameInput').focus();

        $('#bundleRenameInput').blur(function(){
          let newName = $('#bundleRenameInput').val();
          if(newName == null || newName == '') {return;}
          $(this).unbind();
          $('#bundleName').html(newName);
          $('#bundleRenameBtn').removeClass('is-hidden');
          socket.emit("requestBundleUpdate",
            g_activeBundle.id,
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

      ///

      $('#bundlePublishBtn').click(function() {
        $('#publish-modal').addClass('is-active');
        $('html').addClass('is-clipped');
      });

      $('#publish-modal-background,#publish-modal-close').click(function() {
        $('#publish-modal').removeClass('is-active');
        $('html').removeClass('is-clipped');
      });
      $('#publish-modal-btn').click(function() {
        socket.emit("requestBundlePublish", g_activeBundle.id);
        $('#publish-modal').removeClass('is-active');
        $('html').removeClass('is-clipped');
      });

      ///

      $('#createClassBtn').click(function() {
        createNewBundleContent('CLASS');
      });

      if(classes.length > 0){
        $('#bundleContainerClasses').html('');
        for(const cClass of classes){
          let viewClassID = 'entry-view-class-'+cClass.id;
          let editClassID = 'entry-edit-class-'+cClass.id;
          let deleteClassID = 'entry-delete-class-'+cClass.id;
          $('#bundleContainerClasses').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+cClass.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewClassID+'" class="button is-info is-outlined">View</button><button id="'+editClassID+'" class="button is-success is-outlined"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteClassID+'" class="button is-danger is-outlined"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewClassID).click(function() {
            new DisplayClass('tabContent', cClass.id, featMap, g_activeBundle.id);
          });
          $('#'+editClassID).click(function() {
            window.location.href = '/homebrew/edit/class/?id='+g_activeBundle.id+'&content_id='+cClass.id;
          });
          $('#'+deleteClassID).click(function() {
            new ConfirmMessage('Delete “'+cClass.name+'”', '<p class="has-text-centered">Are you sure you want to delete this class?</p>', 'Delete', 'modal-delete-content-class-'+cClass.id, 'modal-delete-content-class-btn-'+cClass.id);
            $('#modal-delete-content-class-btn-'+cClass.id).click(function() {
              socket.emit('requestHomebrewRemoveClass', g_activeBundle.id, cClass.id);
            });
          });
        }
      }

      ///

      $('#createAncestryBtn').click(function() {
        createNewBundleContent('ANCESTRY');
      });

      if(ancestries.length > 0){
        $('#bundleContainerAncestries').html('');
        for(const ancestry of ancestries){
          let viewAncestryID = 'entry-view-ancestry-'+ancestry.id;
          let editAncestryID = 'entry-edit-ancestry-'+ancestry.id;
          let deleteAncestryID = 'entry-delete-ancestry-'+ancestry.id;
          $('#bundleContainerAncestries').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+ancestry.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewAncestryID+'" class="button is-info is-outlined">View</button><button id="'+editAncestryID+'" class="button is-success is-outlined"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteAncestryID+'" class="button is-danger is-outlined"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewAncestryID).click(function() {
            new DisplayAncestry('tabContent', ancestry.id, featMap, g_activeBundle.id);
          });
          $('#'+editAncestryID).click(function() {
            window.location.href = '/homebrew/edit/ancestry/?id='+g_activeBundle.id+'&content_id='+ancestry.id;
          });
          $('#'+deleteAncestryID).click(function() {
            new ConfirmMessage('Delete “'+ancestry.name+'”', '<p class="has-text-centered">Are you sure you want to delete this ancestry?</p>', 'Delete', 'modal-delete-content-ancestry-'+ancestry.id, 'modal-delete-content-ancestry-btn-'+ancestry.id);
            $('#modal-delete-content-ancestry-btn-'+ancestry.id).click(function() {
              socket.emit('requestHomebrewRemoveAncestry', g_activeBundle.id, ancestry.id);
            });
          });
        }
      }

      ///

      $('#createArchetypeBtn').click(function() {
        createNewBundleContent('ARCHETYPE');
      });

      if(archetypes.length > 0){
        $('#bundleContainerArchetypes').html('');
        for(const archetype of archetypes){
          let viewArchetypeID = 'entry-view-archetype-'+archetype.id;
          let editArchetypeID = 'entry-edit-archetype-'+archetype.id;
          let deleteArchetypeID = 'entry-delete-archetype-'+archetype.id;
          $('#bundleContainerArchetypes').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+archetype.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewArchetypeID+'" class="button is-info is-outlined">View</button><button id="'+editArchetypeID+'" class="button is-success is-outlined"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteArchetypeID+'" class="button is-danger is-outlined"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewArchetypeID).click(function() {
            new DisplayArchetype('tabContent', archetype.id, featMap, g_activeBundle.id);
          });
          $('#'+editArchetypeID).click(function() {
            window.location.href = '/homebrew/edit/archetype/?id='+g_activeBundle.id+'&content_id='+archetype.id;
          });
          $('#'+deleteArchetypeID).click(function() {
            new ConfirmMessage('Delete “'+archetype.name+'”', '<p class="has-text-centered">Are you sure you want to delete this archetype?</p>', 'Delete', 'modal-delete-content-archetype-'+archetype.id, 'modal-delete-content-archetype-btn-'+archetype.id);
            $('#modal-delete-content-archetype-btn-'+archetype.id).click(function() {
              socket.emit('requestHomebrewRemoveArchetype', g_activeBundle.id, archetype.id);
            });
          });
        }
      }

      ////

      $('#createBackgroundBtn').click(function() {
        createNewBundleContent('BACKGROUND');
      });

      if(backgrounds.length > 0){
        $('#bundleContainerBackgrounds').html('');
        for(const background of backgrounds){
          let viewBackgroundID = 'entry-view-background-'+background.id;
          let editBackgroundID = 'entry-edit-background-'+background.id;
          let deleteBackgroundID = 'entry-delete-background-'+background.id;
          $('#bundleContainerBackgrounds').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+background.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewBackgroundID+'" class="button is-info is-outlined">View</button><button id="'+editBackgroundID+'" class="button is-success is-outlined"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteBackgroundID+'" class="button is-danger is-outlined"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewBackgroundID).click(function() {
            new DisplayBackground('tabContent', background.id, g_activeBundle.id);
          });
          $('#'+editBackgroundID).click(function() {
            window.location.href = '/homebrew/edit/background/?id='+g_activeBundle.id+'&content_id='+background.id;
          });
          $('#'+deleteBackgroundID).click(function() {
            new ConfirmMessage('Delete “'+background.name+'”', '<p class="has-text-centered">Are you sure you want to delete this background?</p>', 'Delete', 'modal-delete-content-background-'+background.id, 'modal-delete-content-background-btn-'+background.id);
            $('#modal-delete-content-background-btn-'+background.id).click(function() {
              socket.emit('requestHomebrewRemoveBackground', g_activeBundle.id, background.id);
            });
          });
        }
      }

      ////

      $('#createClassFeatureBtn').click(function() {
        createNewBundleContent('CLASS-FEATURE');
      });

      if(classFeatures.length > 0){
        $('#bundleContainerClassFeatures').html('');
        for(const classFeature of classFeatures){
          if(classFeature.indivClassName == null || classFeature.selectOptionFor != null) {continue;}

          let viewClassFeatureID = 'entry-view-class-feature-'+classFeature.id;
          let editClassFeatureID = 'entry-edit-class-feature-'+classFeature.id;
          let deleteClassFeatureID = 'entry-delete-class-feature-'+classFeature.id;
          $('#bundleContainerClassFeatures').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+classFeature.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewClassFeatureID+'" class="button is-info is-outlined">View</button><button id="'+editClassFeatureID+'" class="button is-success is-outlined"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteClassFeatureID+'" class="button is-danger is-outlined"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewClassFeatureID).click(function() {
            let classText = (classFeature.indivClassName != null) ? '~ Class:: '+classFeature.indivClassName+'\n' : '';
            let classAbilText = (classFeature.indivClassAbilName != null) ? '~ Option For:: '+classFeature.indivClassAbilName+'\n' : '';
            let description = classText+classAbilText+'----\n'+classFeature.description;
            openQuickView('abilityView', {
              Ability : {
                name: classFeature.name,
                description: description,
                level: classFeature.level,
                contentSrc: classFeature.contentSrc,
                homebrewID: classFeature.homebrewID,
              }
            });
          });
          $('#'+editClassFeatureID).click(function() {
            window.location.href = '/homebrew/edit/class-feature/?id='+g_activeBundle.id+'&content_id='+classFeature.id;
          });
          $('#'+deleteClassFeatureID).click(function() {
            new ConfirmMessage('Delete “'+classFeature.name+'”', '<p class="has-text-centered">Are you sure you want to delete this class feature?</p>', 'Delete', 'modal-delete-content-class-feature-'+classFeature.id, 'modal-delete-content-class-feature-btn-'+classFeature.id);
            $('#modal-delete-content-class-feature-btn-'+classFeature.id).click(function() {
              socket.emit('requestHomebrewRemoveClassFeature', g_activeBundle.id, classFeature.id);
            });
          });
        }
      }

      ////

      $('#createFeatBtn').click(function() {
        createNewBundleContent('FEAT-ACTIVITY');
      });

      if(feats.length > 0){
        $('#bundleContainerFeats').html('');
        for(const feat of feats){
          if(feat.genericType == null) {continue;}

          let viewFeatID = 'entry-view-feat-activity-'+feat.id;
          let editFeatID = 'entry-edit-feat-activity-'+feat.id;
          let deleteFeatID = 'entry-delete-feat-activity-'+feat.id;
          $('#bundleContainerFeats').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+feat.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewFeatID+'" class="button is-info is-outlined">View</button><button id="'+editFeatID+'" class="button is-success is-outlined"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteFeatID+'" class="button is-danger is-outlined"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewFeatID).click(function() {
            let featStruct = featMap.get(feat.id+'');
            openQuickView('featView', {
              Feat : featStruct.Feat,
              Tags : featStruct.Tags
            });
          });
          $('#'+editFeatID).click(function() {
            window.location.href = '/homebrew/edit/feat-activity/?id='+g_activeBundle.id+'&content_id='+feat.id;
          });
          $('#'+deleteFeatID).click(function() {
            new ConfirmMessage('Delete “'+feat.name+'”', '<p class="has-text-centered">Are you sure you want to delete this feat / activity?</p>', 'Delete', 'modal-delete-content-feat-'+feat.id, 'modal-delete-content-feat-btn-'+feat.id);
            $('#modal-delete-content-feat-btn-'+feat.id).click(function() {
              socket.emit('requestHomebrewRemoveFeat', g_activeBundle.id, feat.id);
            });
          });
        }
      }

      ////

      $('#createHeritageBtn').click(function() {
        createNewBundleContent('HERITAGE');
      });

      if(heritages.length > 0){
        $('#bundleContainerHeritages').html('');
        for(const heritage of heritages){
          if(heritage.indivAncestryName == null) {continue;}

          let viewHeritageID = 'entry-view-heritage-'+heritage.id;
          let editHeritageID = 'entry-edit-heritage-'+heritage.id;
          let deleteHeritageID = 'entry-delete-heritage-'+heritage.id;
          $('#bundleContainerHeritages').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+heritage.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewHeritageID+'" class="button is-info is-outlined">View</button><button id="'+editHeritageID+'" class="button is-success is-outlined"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteHeritageID+'" class="button is-danger is-outlined"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewHeritageID).click(function() {
            let ancestryText = (heritage.indivAncestryName != null) ? '~ Ancestry:: '+heritage.indivAncestryName+'\n' : '';
            let rarityText = (heritage.rarity != null) ? '~ Rarity:: '+capitalizeWord(heritage.rarity)+'\n' : '';
            let description = ancestryText+rarityText+'----\n'+heritage.description;
            openQuickView('abilityView', {
              Ability : {
                name: heritage.name,
                description: description,
                level: 0,
                contentSrc: heritage.contentSrc,
                homebrewID: heritage.homebrewID,
              }
            });
          });
          $('#'+editHeritageID).click(function() {
            window.location.href = '/homebrew/edit/heritage/?id='+g_activeBundle.id+'&content_id='+heritage.id;
          });
          $('#'+deleteHeritageID).click(function() {
            new ConfirmMessage('Delete “'+heritage.name+'”', '<p class="has-text-centered">Are you sure you want to delete this heritage?</p>', 'Delete', 'modal-delete-content-heritage-'+heritage.id, 'modal-delete-content-heritage-btn-'+heritage.id);
            $('#modal-delete-content-heritage-btn-'+heritage.id).click(function() {
              socket.emit('requestHomebrewRemoveHeritage', g_activeBundle.id, heritage.id);
            });
          });
        }
      }

      ////

      $('#createUniHeritageBtn').click(function() {
        createNewBundleContent('UNI-HERITAGE');
      });

      if(uniheritages.length > 0){
        $('#bundleContainerUniHeritages').html('');
        for(const uniheritage of uniheritages){
          let viewUniHeritageID = 'entry-view-uni-heritage-'+uniheritage.id;
          let editUniHeritageID = 'entry-edit-uni-heritage-'+uniheritage.id;
          let deleteUniHeritageID = 'entry-delete-uni-heritage-'+uniheritage.id;
          $('#bundleContainerUniHeritages').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+uniheritage.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewUniHeritageID+'" class="button is-info is-outlined">View</button><button id="'+editUniHeritageID+'" class="button is-success is-outlined"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteUniHeritageID+'" class="button is-danger is-outlined"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewUniHeritageID).click(function() {
            new DisplayUniHeritage('tabContent', uniheritage.id, featMap, g_activeBundle.id);
          });
          $('#'+editUniHeritageID).click(function() {
            window.location.href = '/homebrew/edit/uni-heritage/?id='+g_activeBundle.id+'&content_id='+uniheritage.id;
          });
          $('#'+deleteUniHeritageID).click(function() {
            new ConfirmMessage('Delete “'+uniheritage.name+'”', '<p class="has-text-centered">Are you sure you want to delete this versatile heritage?</p>', 'Delete', 'modal-delete-content-uni-heritage-'+uniheritage.id, 'modal-delete-content-uni-heritage-btn-'+uniheritage.id);
            $('#modal-delete-content-uni-heritage-btn-'+uniheritage.id).click(function() {
              socket.emit('requestHomebrewRemoveUniHeritage', g_activeBundle.id, uniheritage.id);
            });
          });
        }
      }

      ////

      $('#createItemBtn').click(function() {
        createNewBundleContent('ITEM');
      });

      if(items.length > 0){
        $('#bundleContainerItems').html('');
        for(const item of items){
          let viewItemID = 'entry-view-item-'+item.id;
          let editItemID = 'entry-edit-item-'+item.id;
          let deleteItemID = 'entry-delete-item-'+item.id;
          $('#bundleContainerItems').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+item.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewItemID+'" class="button is-info is-outlined">View</button><button id="'+editItemID+'" class="button is-success is-outlined"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteItemID+'" class="button is-danger is-outlined"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewItemID).click(function() {
            let itemStruct = itemMap.get(item.id+'');
            openQuickView('itemView', {
              ItemDataStruct : itemStruct
            });
          });
          $('#'+editItemID).click(function() {
            window.location.href = '/homebrew/edit/item/?id='+g_activeBundle.id+'&content_id='+item.id;
          });
          $('#'+deleteItemID).click(function() {
            new ConfirmMessage('Delete “'+item.name+'”', '<p class="has-text-centered">Are you sure you want to delete this item?</p>', 'Delete', 'modal-delete-content-item-'+item.id, 'modal-delete-content-item-btn-'+item.id);
            $('#modal-delete-content-item-btn-'+item.id).click(function() {
              socket.emit('requestHomebrewRemoveItem', g_activeBundle.id, item.id);
            });
          });
        }
      }

      ////

      $('#createSpellBtn').click(function() {
        createNewBundleContent('SPELL');
      });

      if(spells.length > 0){
        $('#bundleContainerSpells').html('');
        for(const spell of spells){
          let viewSpellID = 'entry-view-spell-'+spell.id;
          let editSpellID = 'entry-edit-spell-'+spell.id;
          let deleteSpellID = 'entry-delete-spell-'+spell.id;
          $('#bundleContainerSpells').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+spell.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewSpellID+'" class="button is-info is-outlined">View</button><button id="'+editSpellID+'" class="button is-success is-outlined"><span>Edit</span><span class="icon is-small"><i class="far fa-edit"></i></span></button><button id="'+deleteSpellID+'" class="button is-danger is-outlined"><span>Delete</span><span class="icon is-small"><i class="fas fa-times"></i></span></button></div></div></div>');
          $('#'+viewSpellID).click(function() {
            let spellStruct = spellMap.get(spell.id+'');
            openQuickView('spellView', {
              SpellDataStruct: spellStruct,
            });
          });
          $('#'+editSpellID).click(function() {
            window.location.href = '/homebrew/edit/spell/?id='+g_activeBundle.id+'&content_id='+spell.id;
          });
          $('#'+deleteSpellID).click(function() {
            new ConfirmMessage('Delete “'+spell.name+'”', '<p class="has-text-centered">Are you sure you want to delete this spell?</p>', 'Delete', 'modal-delete-content-spell-'+spell.id, 'modal-delete-content-spell-btn-'+spell.id);
            $('#modal-delete-content-spell-btn-'+spell.id).click(function() {
              socket.emit('requestHomebrewRemoveSpell', g_activeBundle.id, spell.id);
            });
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
    g_activeBundle = homebrewBundle;
    $('#bundleName').html(g_activeBundle.name);
    $('#bundleRenameBtn').removeClass('is-hidden');
    $('#bundleDescription').parent().removeClass("is-loading");
    $('#bundleDescription').val(g_activeBundle.description);
    $('#bundleContactInfo').parent().removeClass("is-loading");
    $('#bundleContactInfo').val(g_activeBundle.contactInfo);
  }
});

socket.on("returnHomebrewRemoveContent", function(){
  openBundleEditor(g_activeBundle);
});

socket.on("returnBundlePublish", function(isPublished){
  openUserContent();
});