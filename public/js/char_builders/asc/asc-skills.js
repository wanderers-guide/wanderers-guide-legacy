
//------------------------- Processing Skills -------------------------//
function initSkillProcessing(ascStatement, srcStruct, locationID) {
    if(ascSkillMap == null) {
        //console.log("Did not find valid skillMap :(");
        socket.emit("requestASCSkills",
                getCharIDFromURL(),
                ascStatement,
                srcStruct,
                locationID);
    } else {
        //console.log("> Found a valid skillMap!");
        processingSkills(ascStatement, srcStruct, locationID);
    }
}

socket.on("returnASCSkills", function(ascStatement, srcStruct, locationID, skillObject){
    let skillMap = objToMap(skillObject);
    //console.log("Setting skillMap to new one...");
    ascSkillMap = skillMap;
    processingSkills(ascStatement, srcStruct, locationID);
});

function processingSkills(ascStatement, srcStruct, locationID){

    if(ascStatement.includes("GIVE-SKILL-INCREASE")){// GIVE-SKILL-INCREASE
        giveSkillIncrease(srcStruct, locationID);
    }
    else if(ascStatement.includes("GIVE-SKILL")){// GIVE-SKILL=T
        let prof = ascStatement.split('=')[1];
        giveSkillProf(srcStruct, locationID, prof);
    } else {
        displayError("Unknown statement (2-Skill): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Skill Increase ///////////////////////////////////

function giveSkillIncrease(srcStruct, locationID){
    giveSkill(srcStruct, locationID, 'UP');
}

function giveSkillProf(srcStruct, locationID, prof){
    giveSkill(srcStruct, locationID, prof);
}

function giveSkill(srcStruct, locationID, profType){

    let selectIncreaseID = "selectIncrease"+locationID+"-"+srcStruct.sourceCodeSNum;
    let selectIncreaseControlShellClass = selectIncreaseID+'ControlShell';
    let increaseDescriptionID = "selectIncreaseDescription"+locationID+"-"+srcStruct.sourceCodeSNum;

    $('#'+locationID).append('<div class="field"><div class="select '+selectIncreaseControlShellClass+'"><select id="'+selectIncreaseID+'" class="selectIncrease"></select></div></div>');

    $('#'+locationID).append('<div id="'+increaseDescriptionID+'"></div>');

    $('#'+selectIncreaseID).append('<option value="chooseDefault">Choose a Skill</option>');
    $('#'+selectIncreaseID).append('<hr class="dropdown-divider"></hr>');

    // Set saved skill choices
    let profArray = ascChoiceStruct.ProfArray;

    let savedSkillData = profArray.find(prof => {
        return hasSameSrc(prof, srcStruct);
    });

    for(const [skillName, skillData] of ascSkillMap.entries()){

        if(savedSkillData != null && savedSkillData.To == skillName) {
            $('#'+selectIncreaseID).append('<option value="'+skillName+'" selected>'+skillName+'</option>');
        } else {
            if(skillData.NumUps < profToNumUp(profType)) {
                $('#'+selectIncreaseID).append('<option value="'+skillName+'">'+skillName+'</option>');
            }
        }

    }

    // On increase choice change
    $('#'+selectIncreaseID).change(function(event, triggerSave) {
        
        if(!($(this).is(":hidden"))) {

            if($(this).val() == "chooseDefault"){

                $('.'+selectIncreaseControlShellClass).removeClass("is-danger");
                $('.'+selectIncreaseControlShellClass).addClass("is-info");

                socket.emit("requestProficiencyChange",
                    getCharIDFromURL(),
                    {srcStruct, isSkill : true},
                    null);

            } else {

                $('.'+selectIncreaseControlShellClass).removeClass("is-info");

                // Save increase
                if(triggerSave == null || triggerSave) {
                
                    let canSave = false;

                    if(profType === 'UP') {
                        let skillName = $('#'+selectIncreaseID).val();
                        let numUps = ascSkillMap.get(skillName).NumUps;
                        if(isAbleToSelectIncrease(numUps+1, ascChoiceStruct.Level)) {
                            canSave = true;
                            $('#'+increaseDescriptionID).html('');
                        } else {
                            $('.'+selectIncreaseControlShellClass).addClass("is-danger");
                            $('#'+increaseDescriptionID).html('<p class="help is-danger">You cannot increase the proficiency of this skill any further at your current level!</p>');
                        }
                    } else {
                        canSave = true;
                    }

                    if(canSave) {
                        $('.'+selectIncreaseControlShellClass).removeClass("is-danger");

                        let skillName = $(this).val();

                        socket.emit("requestProficiencyChange",
                            getCharIDFromURL(),
                            {srcStruct, isSkill : true},
                            { For : "Skill", To : skillName, Prof : profType });
                    }
                
                } else {

                    let numUps = $('#'+selectIncreaseID+' option:selected').attr("name");
                    if(isAbleToSelectIncrease(parseInt(numUps), ascChoiceStruct.Level)) {
                        $('.'+selectIncreaseControlShellClass).removeClass("is-danger");
                    } else {
                        $('.'+selectIncreaseControlShellClass).addClass("is-danger");

                        $('#'+increaseDescriptionID).html('<p class="help is-danger">You cannot increase the proficiency of this skill any further at your current level!</p>');

                    }

                }
                
            }

            $(this).blur();

        }

    });

    $('#'+selectIncreaseID).trigger("change", [false]);

    statementComplete();

}

function isAbleToSelectIncrease(numUps, charLevel){
    if(numUps == 3){
        return (charLevel >= 7);
    } else if (numUps == 4){
        return  (charLevel >= 15);
    } else if (numUps > 4) {
        return false;
    } else {
        return true;
    }
}

socket.on("returnProficiencyChange", function(profChangePacket){

    if(profChangePacket.isSkill){
        selectorUpdated();
        socket.emit("requestASCUpdateSkills", getCharIDFromURL());
    }
    if(profChangePacket.isStatement != null && profChangePacket.isStatement){
        statementComplete();
    }

});