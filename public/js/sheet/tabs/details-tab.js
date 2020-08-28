/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openDetailsTab(data){

    $('#tabContent').append('<div class="tabs is-centered is-marginless"><ul class="details-tabs"><li><a id="detailsTabFeats">Feats</a></li><li><a id="detailsTabAbilities">Abilities</a></li><li class="is-hidden"><a id="detailsTabCompanions">Companions</a></li><li><a id="detailsTabDescription">Description</a></li></ul></div>');

    $('#tabContent').append('<div id="detailsTabContent"></div>');

    $('#detailsTabFeats').click(function(){
        changeDetailsTab('detailsTabFeats', data);
    });

    $('#detailsTabAbilities').click(function(){
        changeDetailsTab('detailsTabAbilities', data);
    });

    $('#detailsTabDescription').click(function(){
        changeDetailsTab('detailsTabDescription', data);
    });

    $('#detailsTabCompanions').click(function(){
        changeDetailsTab('detailsTabCompanions', data);
    });

    if(gState_displayCompanionTab){
        $('#detailsTabCompanions').parent().removeClass('is-hidden');
    }

    $('#'+g_selectedDetailsSubTabID).click();

}

// Details Tabs //
function changeDetailsTab(type, data){
    if(!g_selectedSubTabLock) {g_selectedSubTabID = type;}
    g_selectedDetailsSubTabID = type;

    $('#detailsTabContent').html('');

    $('#detailsTabFeats').parent().removeClass("is-active");
    $('#detailsTabAbilities').parent().removeClass("is-active");
    $('#detailsTabDescription').parent().removeClass("is-active");
    $('#detailsTabCompanions').parent().removeClass("is-active");

    $('#'+type).parent().addClass("is-active");

    switch(type) {
        case 'detailsTabFeats': displayFeatsSection(data); break;
        case 'detailsTabAbilities': displayAbilitiesSection(data); break;
        case 'detailsTabDescription': displayDescriptionSection(data); break;
        case 'detailsTabCompanions': displayCompanionsSection(); break;
        default: break;
    }

}


function displayFeatsSection(data) {

    $('#detailsTabContent').append('<div class="columns is-mobile is-marginless"><div class="column is-10"><p class="control has-icons-left"><input id="featsSearch" class="input" type="text" placeholder="Search Feats"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div><div class="column"><div class="select"><select id="featsFilterByType"><option value="All">All</option><option value="Class">Class</option><option value="Ancestry">Ancestry</option><option value="Other">Other</option></select></div></div></div><div id="featsContent" class="use-custom-scrollbar" style="height: 520px; max-height: 520px; overflow-y: auto;"></div>');

    $('#featsFilterByType').val(g_selectedDetailsOptionValue);
    displayFeatContent(data);

}

function displayFeatContent(data){

    $('#featsFilterByType').off('change');
    $('#featsSearch').off('change');

    $('#featsContent').html('');

    let featsFilterByType = $('#featsFilterByType');
    if(featsFilterByType.val() == "All"){
        featsFilterByType.parent().removeClass('is-info');
    } else {
        featsFilterByType.parent().addClass('is-info');
    }
    featsFilterByType.blur();

    let featsSearch = $('#featsSearch');
    let featsSearchValue = (featsSearch.val() === "") ? null : featsSearch.val();
    if(featsSearchValue == null){
        featsSearch.removeClass('is-info');
    } else {
        featsSearch.addClass('is-info');
    }

    $('#featsFilterByType').change(function(){
        g_selectedDetailsOptionValue = $(this).val();
        displayFeatContent(data);
    });

    $('#featsSearch').change(function(){
        displayFeatContent(data);
    });

    let selectedFeatFilter = $('#featsFilterByType').val();
    if(selectedFeatFilter === "All"){
        displayClassFeats(data, featsSearchValue);
        displayAncestryFeats(data, featsSearchValue);
        displayOtherFeats(data, featsSearchValue);
    } else if(selectedFeatFilter === "Class"){
        displayClassFeats(data, featsSearchValue);
    } else if(selectedFeatFilter === "Ancestry"){
        displayAncestryFeats(data, featsSearchValue);
    } else if(selectedFeatFilter === "Other"){
        displayOtherFeats(data, featsSearchValue);
    }

}

function displayClassFeats(data, featsSearchValue){
    $('#featsContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">Class</p>');
    $('#featsContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');
    featDisplayByType(data, [data.ClassDetails.Class.name], featsSearchValue);
}

function displayAncestryFeats(data, featsSearchValue){
    $('#featsContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">Ancestry</p>');
    $('#featsContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');
    let charTagsArray = [];
    for(let dataTag of data.AncestryTagsArray){
        charTagsArray.push(dataTag.value);
    }
    featDisplayByType(data, charTagsArray, featsSearchValue);
}

function displayOtherFeats(data, featsSearchValue){
    $('#featsContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">Other</p>');
    $('#featsContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');
    featDisplayByType(data, null, featsSearchValue);
}

function featDisplayByType(data, sortingTagNameArray, featsSearchValue){

    let featCount = 0;
    for(const feat of data.FeatChoiceArray){
        if(feat.value == null) { continue; }
        let featData = data.FeatMap.get(feat.value.id+"");
        if(featData == null) { continue; }
        let featTags = featData.Tags;
        if(sortingTagNameArray == null){
            // Is Other, display if feat is NOT ancestry or class
            let sortingTagNameArray = [];
            for(let dataTag of data.AncestryTagsArray){
                sortingTagNameArray.push(dataTag.value);
            }
            sortingTagNameArray.push(data.ClassDetails.Class.name);
            let tag = featTags.find(tag => {
                return sortingTagNameArray.includes(tag.name);
            });
            if(tag == null){
                filterFeatsThroughSearch(feat, featTags, featCount, featsSearchValue);
            }
        } else {
            let tag = featTags.find(tag => {
                return sortingTagNameArray.includes(tag.name);
            });
            if(tag != null){
                filterFeatsThroughSearch(feat, featTags, featCount, featsSearchValue);
            }
        }
        featCount++;
    }

}

function filterFeatsThroughSearch(featData, featTags, featCount, featsSearchValue){

    let willDisplay = false;
    if(featsSearchValue != null){
        let featName = featData.value.name.toLowerCase();
        if(!featName.includes(featsSearchValue)){
            willDisplay = false;
        } else {
            willDisplay = true;
        }
    } else {
        willDisplay = true;
    }

    if(willDisplay) {
        displayFeat(featData, featTags, featCount);
    }

}

function displayFeat(featData, featTags, featCount){

    let feat = featData.value;
    let featID = 'featDetailsEntry'+feat.id+"C"+featCount;

    let featNameInnerHTML = '';
    if(feat.level > 9){
        featNameInnerHTML += '<span class="is-size-7 has-text-grey">'+feat.level+' - </span>';
    } else if(feat.level > 0){
        featNameInnerHTML += '<span class="is-size-7 has-text-grey pl-2">'+feat.level+' - </span>';
    } else {
        featNameInnerHTML += '<span class="is-size-7 has-text-grey pl-4 ml-2"></span>';
    }

    featNameInnerHTML += '<span>'+feat.name+'</span>';

    switch(feat.actions) {
        case 'FREE_ACTION': featNameInnerHTML += '<span class="px-2 pf-icon">[free-action]</span>'; break;
        case 'REACTION': featNameInnerHTML += '<span class="px-2 pf-icon">[reaction]</span>'; break;
        case 'ACTION': featNameInnerHTML += '<span class="px-2 pf-icon">[one-action]</span>'; break;
        case 'TWO_ACTIONS': featNameInnerHTML += '<span class="px-2 pf-icon">[two-actions]</span>'; break;
        case 'THREE_ACTIONS': featNameInnerHTML += '<span class="px-2 pf-icon">[three-actions]</span>'; break;
        default: break;
    }

    if(feat.isArchived === 1){
        featNameInnerHTML += '<em class="pl-1">(archived)</em>';
    }

    let featTagsInnerHTML = '<div class="buttons is-marginless is-right">';
    switch(feat.rarity) {
        case 'UNCOMMON': featTagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-very-small is-uncommon">Uncommon</button>';
            break;
        case 'RARE': featTagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-very-small is-rare">Rare</button>';
            break;
        case 'UNIQUE': featTagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-very-small is-unique">Unique</button>';
            break;
        default: break;
    }

    if(feat.skillID != null){
        let skill = null;
        for(const [skillName, skillData] of g_skillMap.entries()){
            if(skillData.Skill.id == feat.skillID) {
                skill = skillData.Skill;
                break;
            }
        }
        featTagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-very-small is-info">'+skill.name+'</button>';
    }

    for(const tag of featTags){
        if(feat.level == -1 && tag.name == 'General'){ continue; }
        featTagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-very-small is-info">'+tag.name+'</button>';
    }
    featTagsInnerHTML += '</div>';

    $('#featsContent').append('<div id="'+featID+'" class="columns is-mobile border-bottom border-dark-lighter cursor-clickable is-marginless mx-2"><div class="column is-paddingless pl-3"><p class="text-left pt-1">'+featNameInnerHTML+'</p></div><div class="column is-paddingless"><p class="">'+featTagsInnerHTML+'</p></div></div>');
    
    $('#'+featID).click(function(){
        openQuickView('featView', {
            Feat : feat,
            Tags : featTags,
            SrcStruct : featData,
        });
    });

    $('#'+featID).mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $('#'+featID).mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });

}





function displayAbilitiesSection(data) {

    $('#detailsTabContent').append('<div class="columns is-mobile is-marginless"><div class="column is-10"><p class="control has-icons-left"><input id="abilitiesSearch" class="input" type="text" placeholder="Search Abilities"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div><div class="column"><div class="select"><select id="abilitiesFilterByType"><option value="All">All</option><option value="Class">Class</option><option value="Ancestry">Ancestry</option><option value="Other">Other</option></select></div></div></div><div id="abilitiesContent" class="use-custom-scrollbar" style="height: 520px; max-height: 520px; overflow-y: auto;"></div>');

    $('#abilitiesFilterByType').val(g_selectedDetailsOptionValue);
    displayAbilitiesContent(data);

}

function displayAbilitiesContent(data){

    $('#abilitiesFilterByType').off('change');
    $('#abilitiesSearch').off('change');

    $('#abilitiesContent').html('');

    let abilitiesFilterByType = $('#abilitiesFilterByType');
    if(abilitiesFilterByType.val() == "All"){
        abilitiesFilterByType.parent().removeClass('is-info');
    } else {
        abilitiesFilterByType.parent().addClass('is-info');
    }
    abilitiesFilterByType.blur();

    let abilitiesSearch = $('#abilitiesSearch');
    let abilitiesSearchValue = (abilitiesSearch.val() === "") ? null : abilitiesSearch.val();
    if(abilitiesSearchValue == null){
        abilitiesSearch.removeClass('is-info');
    } else {
        abilitiesSearch.addClass('is-info');
    }

    $('#abilitiesFilterByType').change(function(){
        g_selectedDetailsOptionValue = $(this).val();
        displayAbilitiesContent(data);
    });

    $('#abilitiesSearch').change(function(){
        displayAbilitiesContent(data);
    });

    let selectedAbilityFilter = $('#abilitiesFilterByType').val();
    if(selectedAbilityFilter === "All"){
        displayClassAbilities(data, abilitiesSearchValue);
        displayAncestryAbilities(data, abilitiesSearchValue);
        displayOtherAbilities(data, abilitiesSearchValue);
    } else if(selectedAbilityFilter === "Class"){
        displayClassAbilities(data, abilitiesSearchValue);
    } else if(selectedAbilityFilter === "Ancestry"){
        displayAncestryAbilities(data, abilitiesSearchValue);
    } else if(selectedAbilityFilter === "Other"){
        displayOtherAbilities(data, abilitiesSearchValue);
    }

}

function displayClassAbilities(data, abilitiesSearchValue){
    $('#abilitiesContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">Class</p>');
    $('#abilitiesContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');

    let abilCount = 0;
    for(let classAbil of data.ClassDetails.Abilities){
        if(classAbil.displayInSheet === 0 || classAbil.selectType == 'SELECT_OPTION' || classAbil.level > g_character.level){ continue; }
        filterAbilitiesThroughSearch(classAbil, 'Class'+abilCount, abilitiesSearchValue);
        abilCount++;
    }

}

function displayAncestryAbilities(data, abilitiesSearchValue){
    $('#abilitiesContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">Ancestry</p>');
    $('#abilitiesContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');
    
    let abilCount = 0;
    for(let phyFeat of data.PhyFeats){
        if(phyFeat.sourceType != 'ancestry'){ continue; }
        if(phyFeat.value == null) { continue; }
        let phyFeatAbil = {
            name: phyFeat.value.name,
            description: phyFeat.value.description,
            level: 1,
        };
        filterAbilitiesThroughSearch(phyFeatAbil, 'AncestryPhyFeat'+abilCount, abilitiesSearchValue);
        abilCount++;
    }

}

function displayOtherAbilities(data, abilitiesSearchValue){
    $('#abilitiesContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">Other</p>');
    $('#abilitiesContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');
    
    // TODO: Display other ability content here?

}

function filterAbilitiesThroughSearch(ability, abilIdentifier, abilitiesSearchValue){

    let willDisplay = false;
    if(abilitiesSearchValue != null){
        let abilityName = ability.name.toLowerCase();
        if(!abilityName.includes(abilitiesSearchValue)){
            willDisplay = false;
        } else {
            willDisplay = true;
        }
    } else {
        willDisplay = true;
    }

    if(willDisplay) {
        displayAbility(ability, abilIdentifier);
    }

}

function displayAbility(ability, abilIdentifier){

    let abilityID = 'abilityDetailsEntry'+abilIdentifier;

    let abilityNameInnerHTML = '<span>'+ability.name+'</span>';
    let abilityLevelInnerHTML = '<span>Level '+ability.level+'</span>';

    $('#abilitiesContent').append('<div id="'+abilityID+'" class="columns is-mobile border-bottom border-dark-lighter cursor-clickable is-marginless mx-2"><div class="column is-paddingless pl-3"><p class="text-left pt-1">'+abilityNameInnerHTML+'</p></div><div class="column is-paddingless"><p class="pt-1">'+abilityLevelInnerHTML+'</p></div></div>');
    
    $('#'+abilityID).click(function(){
        openQuickView('abilityView', {
            Ability : ability
        });
    });

    $('#'+abilityID).mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $('#'+abilityID).mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });

}




function displayDescriptionSection(data){
    $('#detailsTabContent').append('<div id="descriptionContent" class="use-custom-scrollbar" style="height: 570px; max-height: 570px; overflow-y: auto;"></div>');

    $('#descriptionContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5 pt-2">Background - '+data.Background.name+'</p>');
    $('#descriptionContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');

    $('#descriptionContent').append('<div class="mx-3">'+processText(data.Background.description, true, true, 'SMALL')+'</div>');

    // Add Text Statements
    processAddText(data.Background.code, 'descriptionContent');

    // Note Field Statements
    let srcStructBackground = { // Hardcoded - same srcStruct as in char-builder-3.js
        sourceType: 'background',
        sourceLevel: 1,
        sourceCode: 'background',
        sourceCodeSNum: 'a',
    };
    displayNotesField($('#descriptionContent'), srcStructBackground, 2);

    if(data.Heritage != null){

        $('#descriptionContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5 pt-2">Heritage - '+data.Heritage.name+' </p>');
        $('#descriptionContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');
    
        $('#descriptionContent').append('<div class="mx-3">'+processText(data.Heritage.description, true, true, 'SMALL')+'</div>');

        // Add Text Statements
        processAddText(data.Heritage.code, 'descriptionContent');
    
        // Note Field Statements
        let srcStructHeritage = { // Hardcoded - same srcStruct as in char-builder-2.js
            sourceType: 'ancestry',
            sourceLevel: 1,
            sourceCode: 'heritage',
            sourceCodeSNum: 'a',
        };
        displayNotesField($('#descriptionContent'), srcStructHeritage, 2);

    }

    $('#descriptionContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5 pt-2">Other Information</p>');
    $('#descriptionContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');

    let charHistoryAreaID = "charHistoryArea";
    let charHistoryAreaControlShellID = "charHistoryAreaControlShell";

    $('#descriptionContent').append('<div id="'+charHistoryAreaControlShellID+'" class="control mt-1 mx-1"><textarea id="'+charHistoryAreaID+'" class="textarea has-fixed-size use-custom-scrollbar" rows="8" spellcheck="false" placeholder="Use this area to keep information about your character\'s backstory, appearance, or really anything!"></textarea></div>');

    $("#"+charHistoryAreaID).val(data.Character.details);

    $("#"+charHistoryAreaID).blur(function(){
        if(data.Character.details != $(this).val()) {

            $("#"+charHistoryAreaControlShellID).addClass("is-loading");

            socket.emit("requestDetailsSave",
                getCharIDFromURL(),
                $(this).val());
                
            data.Character.details = $(this).val();

        }
    });

}

socket.on("returnDetailsSave", function(){
    $("#charHistoryAreaControlShell").removeClass("is-loading");
});




function displayCompanionsSection(){

    $('#detailsTabContent').html('');
    $('#detailsTabContent').append('<div id="companionsContent" class="use-custom-scrollbar" style="height: 570px; max-height: 570px; overflow-y: auto;"></div>');


    for(let charAnimalComp of g_companionData.AnimalCompanions){
      if(charAnimalComp == null) { continue; }
        
      let charAnimalCompEntryID = 'charAnimalComp'+charAnimalComp.id;

      let imageURL = charAnimalComp.imageURL;
      if(imageURL.match(/\.(jpeg|jpg|gif|png)$/) == null){
          imageURL = 'https://wanderersguide.app/images/default_animal_comp.png';
      }

      initAnimalSpecializationArray(charAnimalComp);
      let maxHP = getAnimalCompanionMaxHealth(charAnimalComp);
      let currentHP = charAnimalComp.currentHP;
      if(currentHP == -1){ currentHP = maxHP; }

      let bulmaTextColor = getBulmaTextColorFromCurrentHP(currentHP, maxHP);

      $('#companionsContent').append('<div id="'+charAnimalCompEntryID+'" class="columns is-mobile pt-1 is-marginless"><div class="column is-paddingless is-1 border-bottom border-dark-lighter cursor-clickable"><figure class="image is-64x64 is-marginless mb-1"><img class="is-rounded companion-icon" src="'+imageURL+'"></figure></div><div class="column is-paddingless is-3 border-bottom border-dark-lighter cursor-clickable"><p class="pl-3 ml-2 pt-2 has-text-left is-size-4 has-text-grey-light">'+charAnimalComp.name+'</p></div><div class="column is-paddingless is-4 border-bottom border-dark-lighter cursor-clickable"><p class="pt-3"><span class="is-size-5 '+bulmaTextColor+'">'+currentHP+'</span><span class="is-size-5 has-text-grey"> / </span><span class="is-size-5 has-text-grey-like">'+maxHP+'</span></p></div><div class="column is-paddingless is-4 border-bottom border-dark-lighter cursor-clickable"><p class="pt-3 is-size-5-5 is-italic has-text-grey-like">Animal Companion</p></div></div>');

      $('#'+charAnimalCompEntryID).click(function(){
          openQuickView('animalCompanionView', {
              CharAnimalComp: charAnimalComp
          });
      });

      $('#'+charAnimalCompEntryID).mouseenter(function(){
          $(this).addClass('has-background-grey-darker');
      });
      $('#'+charAnimalCompEntryID).mouseleave(function(){
          $(this).removeClass('has-background-grey-darker');
      });

    }

    for(let charFamiliar of g_companionData.Familiars){
      if(charFamiliar == null) { continue; }
      
      let charFamiliarEntryID = 'charFamiliar'+charFamiliar.id;
      processFamiliarAbilities(charFamiliar);

      let imageURL = charFamiliar.imageURL;
      if(imageURL.match(/\.(jpeg|jpg|gif|png)$/) == null){
          imageURL = '/images/paw_icon.png';
      }

      let maxHP = getFamiliarMaxHealth(charFamiliar);
      let currentHP = charFamiliar.currentHP;
      if(currentHP == -1){ currentHP = maxHP; }

      let bulmaTextColor = getBulmaTextColorFromCurrentHP(currentHP, maxHP);

      $('#companionsContent').append('<div id="'+charFamiliarEntryID+'" class="columns is-mobile pt-1 is-marginless"><div class="column is-paddingless is-1 border-bottom border-dark-lighter cursor-clickable"><figure class="image is-64x64 is-marginless mb-1"><img class="is-rounded companion-icon" src="'+imageURL+'"></figure></div><div class="column is-paddingless is-3 border-bottom border-dark-lighter cursor-clickable"><p class="pl-3 ml-2 pt-2 has-text-left is-size-4 has-text-grey-light">'+charFamiliar.name+'</p></div><div class="column is-paddingless is-4 border-bottom border-dark-lighter cursor-clickable"><p class="pt-3"><span class="is-size-5 '+bulmaTextColor+'">'+currentHP+'</span><span class="is-size-5 has-text-grey"> / </span><span class="is-size-5 has-text-grey-like">'+maxHP+'</span></p></div><div class="column is-paddingless is-4 border-bottom border-dark-lighter cursor-clickable"><p class="pt-3 is-size-5-5 is-italic has-text-grey-like">Animal Companion</p></div></div>');

      $('#'+charFamiliarEntryID).click(function(){
          openQuickView('familiarView', {
              CharFamiliar: charFamiliar
          });
      });

      $('#'+charFamiliarEntryID).mouseenter(function(){
          $(this).addClass('has-background-grey-darker');
      });
      $('#'+charFamiliarEntryID).mouseleave(function(){
          $(this).removeClass('has-background-grey-darker');
      });

    }


    $('#companionsContent').append('<div class="columns is-mobile is-centered is-marginless my-1"><div class="column is-narrow"><div id="addAnimalCompanionField" class="field has-addons has-addons-centered is-marginless"><div class="control"><div class="select is-small is-info"><select id="selectAnimalCompanion"></select></div></div><div class="control"><button id="addAnimalCompanion" type="submit" class="button is-small is-info is-rounded">Add</button></div></div></div><div class="column is-narrow"><div id="addFamiliarField" class="field has-addons has-addons-centered is-marginless"><div class="control"><div class="select is-small is-info"><select id="selectFamiliar"></select></div></div><div class="control"><button id="addFamiliar" type="submit" class="button is-small is-info is-rounded">Add</button></div></div></div></div>');



    // Add Animal Companion //
    $('#selectAnimalCompanion').append('<option value="chooseDefault">Animal Companion</option>');
	  $('#selectAnimalCompanion').append('<optgroup label="──────────"></optgroup>');
		
	  for(let animalComp of g_companionData.AllAnimalCompanions){
        $('#selectAnimalCompanion').append('<option value="'+animalComp.id+'">'+animalComp.name+'</option>');
    }
    
    $('#addAnimalCompanion').click(function() {
        let animalCompID = $('#selectAnimalCompanion').val();
        if(animalCompID != "chooseDefault"){
            $(this).addClass('is-loading');
            socket.emit("requestAddAnimalCompanion",
                getCharIDFromURL(),
                animalCompID);
        }
    });


    // Add Familiar //
	  $('#selectFamiliar').append('<option value="Familiar">Familiar</option>');
    
    $('#addFamiliar').click(function() {
        //let familiarType = $('#selectFamiliar').val();
        $(this).addClass('is-loading');
        socket.emit("requestAddFamiliar",
            getCharIDFromURL());
    });

}

socket.on("returnAddAnimalCompanion", function(charAnimalComp){
    g_companionData.AnimalCompanions.push(charAnimalComp);
    displayCompanionsSection();
});

socket.on("returnAddFamiliar", function(charFamiliar){
  g_companionData.Familiars.push(charFamiliar);
  displayCompanionsSection();
});