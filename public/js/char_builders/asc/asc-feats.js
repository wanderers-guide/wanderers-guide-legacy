
//------------------------- Processing Feats -------------------------//
function initFeatProcessing(ascStatement, srcStruct, locationID){
    if(ascFeatMap == null) {
        //console.log("Did not find valid featMap :(");
        socket.emit("requestASCFeats",
                getCharIDFromURL(),
                ascStatement,
                srcStruct,
                locationID);
    } else {
        //console.log("> Found a valid featMap!");
        processingFeats(ascStatement, srcStruct, locationID);
    }
}

socket.on("returnASCFeats", function(ascStatement, srcStruct, locationID, featObject){
    let featMap = objToMap(featObject);
    featMap = new Map([...featMap.entries()].sort(
        function(a, b) {
            if (a[1].Feat.level === b[1].Feat.level) {
                // Name is only important when levels are the same
                return a[1].Feat.name > b[1].Feat.name ? 1 : -1;
            }
            return b[1].Feat.level - a[1].Feat.level;
        })
    );
    //console.log("Setting featMap to new one...");
    ascFeatMap = featMap;
    processingFeats(ascStatement, srcStruct, locationID);
});

function processingFeats(ascStatement, srcStruct, locationID){
    
    if(ascStatement.includes("GIVE-GENERAL-FEAT")){ // GIVE-GENERAL-FEAT=3[metamagic]
        let value = ascStatement.split('=')[1];
        let optionals = value.match(/^\d+?\[(\S+?)\]$/);
        if(optionals != null){
            optionals = optionals[1].split(',');
        }
        let level = parseInt(value);
        giveGeneralFeat(srcStruct, locationID, level, optionals);
    }
    else if(ascStatement.includes("GIVE-ANCESTRY-FEAT")){ // GIVE-ANCESTRY-FEAT=3[metamagic]
        let value = ascStatement.split('=')[1];
        let optionals = value.match(/^\d+?\[(\S+?)\]$/);
        if(optionals != null){
            optionals = optionals[1].split(',');
        }
        let level = parseInt(value);
        giveAncestryFeat(srcStruct, locationID, level,
            ascChoiceStruct.CharTagsArray, optionals);
    }
    else if(ascStatement.includes("GIVE-CLASS-FEAT")){ // GIVE-CLASS-FEAT=3[metamagic]
        let value = ascStatement.split('=')[1];
        let optionals = value.match(/^\d+?\[(\S+?)\]$/);
        if(optionals != null){
            optionals = optionals[1].split(',');
        }
        let level = parseInt(value);
        let className = (ascChoiceStruct.ClassDetails.Class != null) ? ascChoiceStruct.ClassDetails.Class.name : null;
        giveClassFeat(srcStruct, locationID, level, className, optionals);
    }
    else if(ascStatement.includes("GIVE-SKILL-FEAT")){ // GIVE-SKILL-FEAT=3[metamagic]
        let value = ascStatement.split('=')[1];
        let optionals = value.match(/^\d+?\[(\S+?)\]$/);
        if(optionals != null){
            optionals = optionals[1].split(',');
        }
        let level = parseInt(value);
        giveSkillFeat(srcStruct, locationID, level, optionals);
    } 
    else if(ascStatement.includes("GIVE-FEAT-NAME")){ // GIVE-FEAT-NAME=Ancestral_Paragon
        let featName = ascStatement.split('=')[1];
        featName = featName.replace(/_/g," ");
        giveFeatByName(srcStruct, featName, locationID);
    } else {
        displayError("Unknown statement (2-Feat): \'"+ascStatement+"\'");
        statementComplete();
    }

}


////////////////////////////////// Choose Feats /////////////////////////////////////////////

function giveGeneralFeat(srcStruct, locationID, featLevel, optionalTags){

    displayFeatChoice(
        srcStruct,
        locationID,
        "Choose a General Feat",
        ["General"],
        featLevel,
        optionalTags
    );

}

function giveSkillFeat(srcStruct, locationID, featLevel, optionalTags){

    displayFeatChoice(
        srcStruct,
        locationID,
        "Choose a Skill Feat",
        ["Skill"],
        featLevel,
        optionalTags
    );

}

function giveAncestryFeat(srcStruct, locationID, featLevel, charTagsArray, optionalTags){

    displayFeatChoice(
        srcStruct,
        locationID,
        "Choose an Ancestry Feat",
        charTagsArray,
        featLevel,
        optionalTags
    );

}

function giveClassFeat(srcStruct, locationID, featLevel, className, optionalTags){

    displayFeatChoice(
        srcStruct,
        locationID,
        "Choose a Class Feat",
        [className],
        featLevel,
        optionalTags
    );

}

function displayFeatChoice(srcStruct, locationID, selectionName, tagsArray, featLevel, optionalTags) {

    // TO-DO. If feat requires prereq, check feats that the char has from choiceMap
    
    let selectFeatID = "selectFeat"+locationID+"-"+srcStruct.sourceCodeSNum;
    let descriptionFeatID = "descriptionFeat"+locationID+"-"+srcStruct.sourceCodeSNum;
    let selectFeatControlShellClass = selectFeatID+'ControlShell';

    $('#'+locationID).append('<div class="field"><div class="select '+selectFeatControlShellClass+'"><select id="'+selectFeatID+'" class="selectFeat"></select></div><div id="'+descriptionFeatID+'"></div></div>');

    $('#'+selectFeatID).append('<option value="chooseDefault">'+selectionName+'</option>');

    let triggerChange = false;
    // Set saved feat choices

    let featArray = ascChoiceStruct.FeatArray;
    
    let featData = featArray.find(featData => {
        return hasSameSrc(featData, srcStruct);
    });

    let selectedFeat = null;
    if(featData != null){
        selectedFeat = featData.value;
        triggerChange = true;
    }

    // Make optional tags lowercase
    if(optionalTags != null){
        for (let i = 0; i < optionalTags.length; i++) {
            optionalTags[i] = optionalTags[i].toLowerCase();
        }
    }

    let prevLevel = 100;
    for(const featStruct of ascFeatMap){
        let feat = featStruct[1];
        if(feat.Feat.level < 1){ continue; }

        let featName = feat.Feat.name;
        if(feat.Feat.isArchived === 1){
            if(selectedFeat != null && selectedFeat.id == feat.Feat.id){
                featName += ' - Archived';
            } else {
                continue;
            }
        }

        let hasCorrectTags = false;
        let sameOpsTagsArray = [];
        for(let featTag of feat.Tags){
            if(tagsArray.includes(featTag.name)){
                hasCorrectTags = true;
            }
            if(optionalTags != null){
                let featTagNameLower = featTag.name.toLowerCase();
                if(optionalTags.includes(featTagNameLower)){
                    sameOpsTagsArray.push(featTagNameLower);
                }
            }
        }
        if(optionalTags != null){
            hasCorrectTags = (optionalTags.sort().join(',') === sameOpsTagsArray.sort().join(','));
        }

        if(feat.Feat.level <= featLevel && hasCorrectTags){

            if(feat.Feat.level < prevLevel){
                $('#'+selectFeatID).append('<hr class="dropdown-divider"></hr>');
            }

            $('#'+selectFeatID).append('<option value="'+feat.Feat.id+'">('+feat.Feat.level+') '+featName+'</option>');

            prevLevel = feat.Feat.level;

        }

    }

    if(selectedFeat != null){
        $('#'+selectFeatID).val(selectedFeat.id);
        if ($('#'+selectFeatID).val() != selectedFeat.id){
            $('#'+selectFeatID).val($("#"+selectFeatID+" option:first").val());
            $('#'+selectFeatID).parent().addClass("is-info");
        }
    }

    // On feat choice change
    $('#'+selectFeatID).change(function(event, triggerSave, checkDup) {

        if(!($(this).is(":hidden"))) {

            let featID = $(this).val();
            let feat = ascFeatMap.get(featID+"");

            if($(this).val() == "chooseDefault" || feat == null){
                $('.'+selectFeatControlShellClass).addClass("is-info");
                $('.'+selectFeatControlShellClass).removeClass("is-danger");

                // Display nothing
                $('#'+descriptionFeatID).html('');

                socket.emit("requestFeatChange",
                    getCharIDFromURL(),
                    {srcStruct, feat : null, featID : null, codeLocationID : descriptionFeatID+"Code" },
                    selectFeatControlShellClass);

            } else {
                $('.'+selectFeatControlShellClass).removeClass("is-info");

                let featArray = ascChoiceStruct.FeatArray;

                let canSelectFeat = true;
                if((checkDup == null || checkDup) && feat.Feat.canSelectMultiple == 0 && hasDuplicateFeat(featArray, $(this).val())){
                    canSelectFeat = false;
                }
                if(selectedFeat != null && selectedFeat.id == feat.Feat.id) {
                    canSelectFeat = true;
                }

                if(!canSelectFeat){
                    
                    $('.'+selectFeatControlShellClass).addClass("is-danger");

                    // Display feat as issue
                    $('#'+descriptionFeatID).html('<p class="help is-danger">You cannot select a feat more than once unless it states otherwise.</p>');

                } else {
                    $('.'+selectFeatControlShellClass).removeClass("is-danger");

                    // Display feat
                    displayFeat(descriptionFeatID, feat);

                    // Save feats
                    if(triggerSave == null || triggerSave) {
                        $('.'+selectFeatControlShellClass).addClass("is-loading");
                        socket.emit("requestFeatChange",
                            getCharIDFromURL(),
                            {srcStruct, feat, featID, codeLocationID : descriptionFeatID+"Code" },
                            selectFeatControlShellClass);
                    }
                
                }

            }
        }
    });

    $('#'+selectFeatID).trigger("change", [triggerChange, false]);

    statementComplete();

}

socket.on("returnFeatChange", function(featChangePacket, selectFeatControlShellClass){
    
    if(selectFeatControlShellClass != null) {
        $('.'+selectFeatControlShellClass).removeClass("is-loading");
        $('.'+selectFeatControlShellClass+'>select').blur();
    }

    if(featChangePacket.isStatement != null && featChangePacket.isStatement){
        statementComplete();
    }

    selectorUpdated();
    socket.emit("requestASCUpdateChoices", getCharIDFromURL(), 'FEATS');

    // Clear previous code and run new code
    if(featChangePacket.feat != null){
        processCode(
            featChangePacket.feat.Feat.code,
            featChangePacket.srcStruct,
            featChangePacket.codeLocationID);
    }

});

//////////////////////////////// Give Feat (by Name) ///////////////////////////////////

function giveFeatByName(srcStruct, featName, locationID){
    featName = featName.replace(/_/g," ");
    featName = featName.replace(/’/g,"'");
    let featEntry = null;
    ascFeatMap.forEach(function(value, key, map){
        if(value.Feat.isArchived === 0) {
            if(value.Feat.name.toUpperCase() === featName){
                featEntry = value;
                return;
            }
        }
    });
    if(featEntry == null){
        displayError("Cannot find feat: \'"+featName+"\'");
        statementComplete();
        return;
    }

    let descriptionFeatID = "descriptionFeat"+locationID+"-"+srcStruct.sourceCodeSNum;
    $('#'+locationID).append('<div id="'+descriptionFeatID+'"></div>');

    displayFeat(descriptionFeatID, featEntry);

    socket.emit("requestFeatChangeByName",
        getCharIDFromURL(),
        {srcStruct, feat : featEntry, featName : featName,
            codeLocationID : descriptionFeatID+"Code", isStatement : true });

}