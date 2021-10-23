/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

//--------------------- Processing Char Tags --------------------//
function processingCharTags(wscStatement, srcStruct, locationID, extraData){
    
    if(wscStatement.includes("GIVE-CHAR-TRAIT-NAME")){ // GIVE-CHAR-TRAIT-NAME=Elf
        let charTagName = wscStatement.split('=')[1];
        giveCharTag(srcStruct, charTagName);
    } else if(wscStatement.includes("GIVE-CHAR-TRAIT-COMMON")){ // GIVE-CHAR-TRAIT-COMMON
        displayCharTagChoice(srcStruct, locationID, extraData, true);
    } else if(wscStatement.includes("GIVE-CHAR-TRAIT")){ // GIVE-CHAR-TRAIT
        displayCharTagChoice(srcStruct, locationID, extraData);
    } else {
        displayError("Unknown statement (2-CharTrait): \'"+wscStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Char Tag ///////////////////////////////////

function giveCharTag(srcStruct, charTagName){
    charTagName = capitalizeWords(charTagName);

    setData(DATA_SOURCE.CHAR_TRAIT, srcStruct, charTagName);

    socket.emit("requestCharTagChange",
        getCharIDFromURL(),
        srcStruct,
        charTagName);

}

socket.on("returnCharTagChange", function(charTagsArray){
    if($('#quickviewLeftDefault').hasClass('is-active')){
        openLeftQuickView('skillsView', null);
    }
    statementComplete();
});

//////////////////////////////// Give Char Tag Selector ///////////////////////////////////

function displayCharTagChoice(srcStruct, locationID, extraData, commonOnly=false){

    let selectCharTagID = "selectCharTag"+locationID+"-"+srcStruct.sourceCode+"-"+srcStruct.sourceCodeSNum;
    let selectCharTagControlShellClass = selectCharTagID+'ControlShell';

    const selectionTagInfo = getTagFromData(srcStruct, extraData.sourceName, 'Unselected Option', 'UNSELECTED');

    $('#'+locationID).append('<div class="field my-2"><div class="select '+selectCharTagControlShellClass+'" data-selection-info="'+selectionTagInfo+'"><select id="'+selectCharTagID+'" class="selectCharTag"></select></div></div>');

    $('#'+selectCharTagID).append('<option value="chooseDefault">Choose an Ancestry</option>');
    $('#'+selectCharTagID).append('<optgroup label="──────────"></optgroup>');

    let triggerChange = false;
    // Set saved char trait choices
    let charTagsData = getDataSingle(DATA_SOURCE.CHAR_TRAIT, srcStruct);

    let selectedCharTag = null;
    if(charTagsData != null){
        selectedCharTag = charTagsData;
        triggerChange = true;
    }

    let sortedAncestries = wscChoiceStruct.AllAncestries.sort(
      function(a, b) {
        return a.name > b.name ? 1 : -1;
      }
    );

    if(commonOnly) {

      for(const ancestry of sortedAncestries){
        if(ancestry.isArchived === 0 && ancestry.rarity === 'COMMON'){
          $('#'+selectCharTagID).append('<option value="'+ancestry.name+'">'+ancestry.name+'</option>');
        }
      }
      $('#'+selectCharTagID).append('<optgroup label="──────────"></optgroup>');
      for(const ancestry of sortedAncestries){
        if(ancestry.isArchived === 0 && ancestry.rarity !== 'COMMON'){
          $('#'+selectCharTagID).append('<option value="'+ancestry.name+'" class="is-non-available-very">'+ancestry.name+'</option>');
        }
      }

    } else {

      for(const ancestry of sortedAncestries){
        if(ancestry.isArchived === 0){
          $('#'+selectCharTagID).append('<option value="'+ancestry.name+'">'+ancestry.name+'</option>');
        }
      }

    }

    if(selectedCharTag != null){
        $('#'+selectCharTagID).val(selectedCharTag.value);
        if ($('#'+selectCharTagID).val() != selectedCharTag.value){
            $('#'+selectCharTagID).val($("#"+selectCharTagID+" option:first").val());
            $('#'+selectCharTagID).parent().addClass("is-info");
        }
    }

    // On char tag choice change
    $('#'+selectCharTagID).change(function(event, triggerSave, triggerReload) {
        if(triggerReload == null){ triggerReload = true; }

        let charTagName = $(this).val();

        if($(this).val() == "chooseDefault"){
            $('.'+selectCharTagControlShellClass).addClass("is-info");
            deleteData(DATA_SOURCE.CHAR_TRAIT, srcStruct);

            socket.emit("requestWSCCharTagChange",
                getCharIDFromURL(),
                srcStruct,
                null,
                selectCharTagControlShellClass,
                triggerReload);

        } else {
            $('.'+selectCharTagControlShellClass).removeClass("is-info");

            // Save char tag
            if(triggerSave == null || triggerSave) {
                $('.'+selectCharTagControlShellClass).addClass("is-loading");
                setData(DATA_SOURCE.CHAR_TRAIT, srcStruct, charTagName);

                socket.emit("requestWSCCharTagChange",
                    getCharIDFromURL(),
                    srcStruct,
                    charTagName,
                    selectCharTagControlShellClass,
                    triggerReload);
            }

        }
        
    });

    $('#'+selectCharTagID).trigger("change", [triggerChange, false]);

    statementComplete();

}

socket.on("returnWSCCharTagChange", function(charTagsArray, selectControlShellClass, triggerReload){
    if(selectControlShellClass != null) {
        $('.'+selectControlShellClass).removeClass("is-loading");
        $('.'+selectControlShellClass+'>select').blur();
    }
    if($('#quickviewLeftDefault').hasClass('is-active')){
        openLeftQuickView('skillsView', null);
    }
    selectorUpdated();

    // If on ancestry page, reload ancestry feats
    if(triggerReload && g_pageNum == 2){
      window.setTimeout(() => {
        createAncestryFeats(wscChoiceStruct.Character.level);
      }, 250);
    }

});