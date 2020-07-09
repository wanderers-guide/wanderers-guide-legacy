
//--------------------- Processing Char Tags --------------------//
function processingCharTags(ascStatement, srcStruct, locationID){
    
    if(ascStatement.includes("GIVE-CHAR-TRAIT-NAME")){ // GIVE-CHAR-TRAIT-NAME=Elf
        let charTagName = ascStatement.split('=')[1];
        giveCharTag(srcStruct, charTagName);
    } else if(ascStatement.includes("GIVE-CHAR-TRAIT")){ // GIVE-CHAR-TRAIT
        displayCharTagChoice(srcStruct, locationID);
    } else {
        displayError("Unknown statement (2-CharTrait): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Char Tag ///////////////////////////////////

function giveCharTag(srcStruct, charTagName){
    charTagName = capitalizeWord(charTagName);

    socket.emit("requestCharTagChange",
        getCharIDFromURL(),
        srcStruct,
        charTagName);

}

socket.on("returnCharTagChange", function(){
    statementComplete();
});

//////////////////////////////// Give Char Tag Selector ///////////////////////////////////

function displayCharTagChoice(srcStruct, locationID){

    let selectCharTagID = "selectCharTag"+locationID+"-"+srcStruct.sourceCodeSNum;
    let selectCharTagControlShellClass = selectCharTagID+'ControlShell';

    $('#'+locationID).append('<div class="field"><div class="select '+selectCharTagControlShellClass+'"><select id="'+selectCharTagID+'" class="selectCharTag"></select></div></div>');

    $('#'+selectCharTagID).append('<option value="chooseDefault">Choose a Trait</option>');

    let triggerChange = false;
    // Set saved char trait choices

    let charTagsArray = ascChoiceStruct.CharTagsArray;
    
    let charTagsData = charTagsArray.find(charTags => {
        return hasSameSrc(charTags, srcStruct);
    });

    let selectedCharTag = null;
    if(charTagsData != null){
        selectedCharTag = charTagsData;
        triggerChange = true;
    }

    for(const ancestry of ascChoiceStruct.AllAncestries){
        if(ancestry.isArchived === 0){
            $('#'+selectCharTagID).append('<option value="'+ancestry.name+'">'+ancestry.name+'</option>');
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
    $('#'+selectCharTagID).change(function(event, triggerSave) {

        let charTagName = $(this).val();

        if($(this).val() == "chooseDefault"){
            $('.'+selectCharTagControlShellClass).addClass("is-info");

            socket.emit("requestASCCharTagChange",
                getCharIDFromURL(),
                srcStruct,
                null,
                selectCharTagControlShellClass);

        } else {
            $('.'+selectCharTagControlShellClass).removeClass("is-info");

            // Save char tag
            if(triggerSave == null || triggerSave) {
                $('.'+selectCharTagControlShellClass).addClass("is-loading");
                socket.emit("requestASCCharTagChange",
                    getCharIDFromURL(),
                    srcStruct,
                    charTagName,
                    selectCharTagControlShellClass);
            }

        }
        
    });

    $('#'+selectCharTagID).trigger("change", [triggerChange]);

    statementComplete();

}

socket.on("returnASCCharTagChange", function(selectControlShellClass){
    if(selectControlShellClass != null) {
        $('.'+selectControlShellClass).removeClass("is-loading");
        $('.'+selectControlShellClass+'>select').blur();
    }
    selectorUpdated();
});