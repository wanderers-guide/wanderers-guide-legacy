/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openBundleView(homebrewBundle){
  g_activeBundle = homebrewBundle;
  window.history.pushState('homebrew', '', '/homebrew/?view_id='+g_activeBundle.id);// Update URL
  socket.emit('requestBundleContents', 'VIEW', homebrewBundle.id);
}

socket.on("returnBundleContents", function(REQUEST_TYPE, userHasBundle, allTags, classes, ancestries, archetypes, backgrounds, classFeatures, feats, heritages, uniheritages, items, spells){
  if(REQUEST_TYPE !== 'VIEW') {return;}

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


  let displayContainerID = 'bundle-container-'+g_activeBundle.id;
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
        if($('#tabContent').is(':empty')){ $('#browseTab').trigger("click"); }
      });
      $('.category-tabs li').click(function() {
        $('#'+displayContainerID).remove();
      });

      $('#bundleName').html(g_activeBundle.name);
      $('#bundleDescription').html(g_activeBundle.description);
      $('#bundleContactInfo').html(g_activeBundle.contactInfo);

      ///

      if(userHasBundle){
        $('#bundleCollectionRemoveBtn').removeClass('is-hidden');
      } else {
        $('#bundleCollectionAddBtn').removeClass('is-hidden');
      }

      $('#bundleCollectionAddBtn').click(function() {
        socket.emit('requestBundleChangeCollection', g_activeBundle.id, true);
        $('#bundleCollectionAddBtn').addClass('is-hidden');
        $('#bundleCollectionRemoveBtn').removeClass('is-hidden');
      });

      $('#bundleCollectionRemoveBtn').click(function() {
        new ConfirmMessage('Remove from Collection', 'Are you sure you want to remove this bundle from your collection? Any content your characters are using from the bundle will be removed.', 'Remove', 'modal-remove-view-collection-bundle-'+g_activeBundle.id, 'modal-remove-view-collection-bundle-btn-'+g_activeBundle.id);
        $('#modal-remove-view-collection-bundle-btn-'+g_activeBundle.id).click(function() {
          socket.emit('requestBundleChangeCollection', g_activeBundle.id, false);
          $('#bundleCollectionRemoveBtn').addClass('is-hidden');
          $('#bundleCollectionAddBtn').removeClass('is-hidden');
        });
      });

      ///

      if(classes.length > 0){
        $('#bundleSectionClasses').removeClass('is-hidden');
        $('#bundleContainerClasses').html('');
        for(const cClass of classes){
          let viewClassID = 'entry-view-class-'+cClass.id;
          $('#bundleContainerClasses').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+cClass.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewClassID+'" class="button is-info is-outlined">View</button></div></div></div>');
          $('#'+viewClassID).click(function() {
            new DisplayClass(displayContainerID, cClass.id, featMap, g_activeBundle.id);
          });
        }
      }

      ///

      if(ancestries.length > 0){
        $('#bundleSectionAncestries').removeClass('is-hidden');
        $('#bundleContainerAncestries').html('');
        for(const ancestry of ancestries){
          let viewAncestryID = 'entry-view-ancestry-'+ancestry.id;
          $('#bundleContainerAncestries').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+ancestry.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewAncestryID+'" class="button is-info is-outlined">View</button></div></div></div>');
          $('#'+viewAncestryID).click(function() {
            new DisplayAncestry(displayContainerID, ancestry.id, featMap, g_activeBundle.id);
          });
        }
      }

      ///

      if(archetypes.length > 0){
        $('#bundleSectionArchetypes').removeClass('is-hidden');
        $('#bundleContainerArchetypes').html('');
        for(const archetype of archetypes){
          let viewArchetypeID = 'entry-view-archetype-'+archetype.id;
          $('#bundleContainerArchetypes').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+archetype.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewArchetypeID+'" class="button is-info is-outlined">View</button></div></div></div>');
          $('#'+viewArchetypeID).click(function() {
            new DisplayArchetype(displayContainerID, archetype.id, featMap, g_activeBundle.id);
          });
        }
      }

      ////

      if(backgrounds.length > 0){
        $('#bundleSectionBackgrounds').removeClass('is-hidden');
        $('#bundleContainerBackgrounds').html('');
        for(const background of backgrounds){
          let viewBackgroundID = 'entry-view-background-'+background.id;
          $('#bundleContainerBackgrounds').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+background.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewBackgroundID+'" class="button is-info is-outlined">View</button></div></div></div>');
          $('#'+viewBackgroundID).click(function() {
            new DisplayBackground(displayContainerID, background.id, g_activeBundle.id);
          });
        }
      }

      ////

      if(classFeatures.length > 0){
        $('#bundleSectionClassFeatures').removeClass('is-hidden');
        $('#bundleContainerClassFeatures').html('');
        for(const classFeature of classFeatures){
          if(classFeature.indivClassName == null || classFeature.selectOptionFor != null) {continue;}

          let viewClassFeatureID = 'entry-view-class-feature-'+classFeature.id;
          $('#bundleContainerClassFeatures').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+classFeature.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewClassFeatureID+'" class="button is-info is-outlined">View</button></div></div></div>');
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
        }
      }

      ////

      if(feats.length > 0){
        $('#bundleSectionFeats').removeClass('is-hidden');
        $('#bundleContainerFeats').html('');
        for(const feat of feats){
          if(feat.genericType == null) {continue;}

          let viewFeatID = 'entry-view-feat-activity-'+feat.id;
          $('#bundleContainerFeats').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+feat.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewFeatID+'" class="button is-info is-outlined">View</button></div></div></div>');
          $('#'+viewFeatID).click(function() {
            let featStruct = featMap.get(feat.id+'');
            openQuickView('featView', {
              Feat : featStruct.Feat,
              Tags : featStruct.Tags
            });
          });
        }
      }

      ////

      if(heritages.length > 0){
        $('#bundleSectionHeritages').removeClass('is-hidden');
        $('#bundleContainerHeritages').html('');
        for(const heritage of heritages){
          if(heritage.indivAncestryName == null) {continue;}

          let viewHeritageID = 'entry-view-heritage-'+heritage.id;
          $('#bundleContainerHeritages').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+heritage.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewHeritageID+'" class="button is-info is-outlined">View</button></div></div></div>');
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
        }
      }

      ////

      if(uniheritages.length > 0){
        $('#bundleSectionUniHeritages').removeClass('is-hidden');
        $('#bundleContainerUniHeritages').html('');
        for(const uniheritage of uniheritages){
          let viewUniHeritageID = 'entry-view-uni-heritage-'+uniheritage.id;
          $('#bundleContainerUniHeritages').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+uniheritage.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewUniHeritageID+'" class="button is-info is-outlined">View</button></div></div></div>');
          $('#'+viewUniHeritageID).click(function() {
            new DisplayUniHeritage(displayContainerID, uniheritage.id, featMap, g_activeBundle.id);
          });
        }
      }

      ////

      if(items.length > 0){
        $('#bundleSectionItems').removeClass('is-hidden');
        $('#bundleContainerItems').html('');
        for(const item of items){
          let viewItemID = 'entry-view-item-'+item.id;
          $('#bundleContainerItems').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+item.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewItemID+'" class="button is-info is-outlined">View</button></div></div></div>');
          $('#'+viewItemID).click(function() {
            let itemStruct = itemMap.get(item.id+'');
            openQuickView('itemView', {
              ItemDataStruct : itemStruct
            });
          });
        }
      }

      ////

      if(spells.length > 0){
        $('#bundleSectionSpells').removeClass('is-hidden');
        $('#bundleContainerSpells').html('');
        for(const spell of spells){
          let viewSpellID = 'entry-view-spell-'+spell.id;
          $('#bundleContainerSpells').append('<div class="columns is-mobile is-marginless mt-1 sub-section-box"><div class="column"><p class="is-size-5">'+spell.name+'</p></div><div class="column"><div class="is-pulled-right buttons are-small"><button id="'+viewSpellID+'" class="button is-info is-outlined">View</button></div></div></div>');
          $('#'+viewSpellID).click(function() {
            let spellStruct = spellMap.get(spell.id+'');
            openQuickView('spellView', {
              SpellDataStruct: spellStruct,
            });
          });
        }
      }

      $('#'+displayContainerID).removeClass('is-hidden');
    }
  });
});