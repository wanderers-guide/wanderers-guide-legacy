
//------------------------- Processing Feats -------------------------//
function initFeatProcessing(ascStatement, srcID, locationID, statementNum){
    if(ascFeatMap == null) {
        //console.log("Did not find valid featMap :(");
        socket.emit("requestASCFeats",
                getCharIDFromURL(),
                ascStatement,
                srcID,
                locationID,
                statementNum);
    } else {
        //console.log("> Found a valid featMap!");
        processingFeats(ascStatement, srcID, locationID, statementNum);
    }
}

socket.on("returnASCFeats", function(ascStatement, srcID, locationID, statementNum, featObject){
    let featMap = objToMap(featObject);
    //console.log("Setting featMap to new one...");
    ascFeatMap = featMap;
    processingFeats(ascStatement, srcID, locationID, statementNum);
});

function processingFeats(ascStatement, srcID, locationID, statementNum){
    
    if(ascStatement.includes("GIVE-GENERAL-FEAT")){ // GIVE-GENERAL-FEAT=3
        let level = parseInt(ascStatement.split('=')[1]);
        giveGeneralFeat(srcID, locationID, statementNum, level);
    }
    else if(ascStatement.includes("GIVE-ANCESTRY-FEAT")){ // GIVE-ANCESTRY-FEAT=3
        let level = parseInt(ascStatement.split('=')[1]);
        giveAncestryFeat(srcID, locationID, statementNum, level,
            ascChoiceStruct.CharTagsArray);
    }
    else if(ascStatement.includes("GIVE-CLASS-FEAT")){ // GIVE-CLASS-FEAT=3
        let level = parseInt(ascStatement.split('=')[1]);
        giveClassFeat(srcID, locationID, statementNum, level);
    }
    else if(ascStatement.includes("GIVE-SKILL-FEAT")){ // GIVE-SKILL-FEAT=3
        let level = parseInt(ascStatement.split('=')[1]);
        giveSkillFeat(srcID, locationID, statementNum, level);
    } 
    else if(ascStatement.includes("GIVE-FEAT-NAME")){ // GIVE-FEAT-NAME=Ancestral_Paragon
        let featName = ascStatement.split('=')[1];
        featName = featName.replace(/_/g," ");
        giveFeatByName(srcID, featName, locationID, statementNum);
    } else {
        displayError("Unknown statement (2): \'"+ascStatement+"\'");
        statementComplete();
    }

}


////////////////////////////////// Choose Feats /////////////////////////////////////////////

function giveGeneralFeat(srcID, locationID, statementNum, featLevel){

    displayFeatChoice(
        srcID,
        locationID,
        statementNum,
        "Choose a General Feat",
        ["General"],
        featLevel
    );

}

function giveSkillFeat(srcID, locationID, statementNum, featLevel){

    displayFeatChoice(
        srcID,
        locationID,
        statementNum,
        "Choose a Skill Feat",
        ["Skill"],
        featLevel
    );

}

function giveAncestryFeat(srcID, locationID, statementNum, featLevel, charTagsArray){

    displayFeatChoice(
        srcID,
        locationID,
        statementNum,
        "Choose an Ancestry Feat",
        charTagsArray,
        featLevel
    );

}

function giveClassFeat(srcID, locationID, statementNum, featLevel){

    let className = $('#selectClass option:selected').attr("name");

    if(className != "chooseDefault"){
        displayFeatChoice(
            srcID,
            locationID,
            statementNum,
            "Choose a Class Feat",
            [className],
            featLevel
        );
    } else {
        statementComplete();
    }

}

function displayFeatChoice(srcID, locationID, statementNum, selectionName, tagsArray, featLevel) {

    // TO-DO. If feat requires prereq, check feats that the char has from choiceMap
    
    let selectFeatID = "selectFeat"+locationID+statementNum;
    let descriptionFeatID = "descriptionFeat"+locationID+statementNum;
    let selectFeatControlShellClass = selectFeatID+'ControlShell';

    $('#'+locationID).append('<div class="field"><div class="select '+selectFeatControlShellClass+'"><select id="'+selectFeatID+'" class="selectFeat"></select></div><div id="'+descriptionFeatID+'"></div></div>');

    $('#'+selectFeatID).append('<option value="chooseDefault">'+selectionName+'</option>');
    $('#'+selectFeatID).append('<hr class="dropdown-divider"></hr>');

    let prevLevel = 1;
    for(const featStruct of ascFeatMap){
        let feat = featStruct[1];

        let tag = feat.Tags.find(tag => {
            return tagsArray.includes(tag.name);
        });

        if(feat.Feat.level <= featLevel && feat.Tags.includes(tag)){

            $('#'+selectFeatID).append('<option value="'+feat.Feat.id+'">('+feat.Feat.level+') '+feat.Feat.name+'</option>');

            if(feat.Feat.level > prevLevel){
                $('#'+selectFeatID).append('<hr class="dropdown-divider"></hr>');
            }
            prevLevel = feat.Feat.level;

        }

    }

    let triggerChange = false;

    // Set saved feat choices
    let featArray = objToMap(ascChoiceStruct.FeatObject).get(srcID);
    if(featArray != null && featArray[0] != null){
        $('#'+selectFeatID).val(featArray[0].id);
        triggerChange = true;
    }

    // On feat choice change
    $('#'+selectFeatID).change(function(event, triggerSave, checkDup) {

        if(!($(this).is(":hidden"))) {
            if($(this).val() == "chooseDefault"){

                // Display nothing
                $('#'+descriptionFeatID).html('');

                $('.'+selectFeatControlShellClass).removeClass("is-danger");
                $('.'+selectFeatControlShellClass).addClass("is-info");

                socket.emit("requestFeatChange",
                    getCharIDFromURL(),
                    {srcID : srcID, feat : null, featID : null, codeLocationID : descriptionFeatID+"Code" },
                    selectFeatControlShellClass);

            } else {

                let featID = $(this).val();
                let feat = ascFeatMap.get(featID+"");

                let featChoiceMap = objToMap(ascChoiceStruct.FeatObject);

                if((checkDup == null || checkDup) 
                    && feat.Feat.canSelectMultiple == 0 
                    && hasDuplicateFeat(featChoiceMap, $(this).val())){
                    
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
                            {srcID : srcID, feat : feat, featID : featID, codeLocationID : descriptionFeatID+"Code" },
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
    }

    if(featChangePacket.isStatement != null && featChangePacket.isStatement){
        statementComplete();
    }

    socket.emit("requestASCUpdateChoices", getCharIDFromURL());

    if(featChangePacket.feat != null){
        // Process chosen feats code
        let srcType, srcLevel = null;
        let srcSections = featChangePacket.srcID.split('_');
        srcType = srcSections[0].split('-')[1];
        srcLevel = srcSections[1].split('-')[1];
        processCode(
            featChangePacket.feat.Feat.code,
            'Type-'+srcType+'_Level-'+srcLevel+'_Code-Feat'+featChangePacket.featID,
            featChangePacket.codeLocationID);
    }

});

//////////////////////////////// Give Feat (by Name) ///////////////////////////////////

function giveFeatByName(srcID, featName, locationID, statementNum){

    let featEntry = null;
    ascFeatMap.forEach(function(value, key, map){
        if(value.Feat.name.toLowerCase() === featName.toLowerCase()){
            featEntry = value;
            return;
        }
    });
    if(featEntry == null){
        displayError("Cannot find feat: \'"+featName+"\'");
        statementComplete();
        return;
    }

    let descriptionFeatID = "descriptionFeat"+locationID+statementNum;
    $('#'+locationID).append('<div id="'+descriptionFeatID+'"></div>');

    displayFeat(descriptionFeatID, featEntry);

    socket.emit("requestFeatChangeByName",
        getCharIDFromURL(),
        {srcID : srcID, feat : featEntry, featName : featName,
            codeLocationID : descriptionFeatID+"Code", isStatement : true });

}