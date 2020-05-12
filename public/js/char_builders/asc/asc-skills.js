
//------------------------- Processing Skills -------------------------//
function initSkillProcessing(ascStatement, srcID, locationID, statementNum) {
    if(ascSkillMap == null) {
        //console.log("Did not find valid skillMap :(");
        socket.emit("requestASCSkills",
                getCharIDFromURL(),
                ascStatement,
                srcID,
                locationID,
                statementNum);
    } else {
        //console.log("> Found a valid skillMap!");
        processingSkills(ascStatement, srcID, locationID, statementNum);
    }
}

socket.on("returnASCSkills", function(ascStatement, srcID, locationID, statementNum, skillObject){
    let skillMap = objToMap(skillObject);
    //console.log("Setting skillMap to new one...");
    ascSkillMap = skillMap;
    processingSkills(ascStatement, srcID, locationID, statementNum);
});

function processingSkills(ascStatement, srcID, locationID, statementNum){

    if(ascStatement.includes("GIVE-SKILL-INCREASE")){// GIVE-SKILL-INCREASE
        giveSkillIncrease(srcID, locationID, statementNum);
    }
    else if(ascStatement.includes("GIVE-SKILL")){// GIVE-SKILL=T
        let prof = ascStatement.split('=')[1];
        giveSkillProf(srcID, locationID, statementNum, prof);
    } else {
        displayError("Unknown statement (2): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Skill Increase ///////////////////////////////////

function giveSkillIncrease(srcID, locationID, statementNum){
    giveSkill(srcID, locationID, statementNum, 'Up');
}

function giveSkillProf(srcID, locationID, statementNum, prof){
    giveSkill(srcID, locationID, statementNum, prof);
}

function giveSkill(srcID, locationID, statementNum, profType){

    let selectIncreaseID = "selectIncrease"+locationID+statementNum;
    let selectIncreaseControlShellClass = selectIncreaseID+'ControlShell';
    let increaseDescriptionID = "selectIncreaseDescription"+locationID+statementNum;

    $('#'+locationID).append('<div class="field"><div class="select '+selectIncreaseControlShellClass+'"><select id="'+selectIncreaseID+'" class="selectIncrease"></select></div></div>');

    $('#'+locationID).append('<div id="'+increaseDescriptionID+'"></div>');

    $('#'+selectIncreaseID).append('<option value="chooseDefault">Choose a Skill</option>');
    $('#'+selectIncreaseID).append('<hr class="dropdown-divider"></hr>');

    // Set saved skill choices
    let skillArray = objToMap(ascChoiceStruct.ProficiencyObject).get(srcID);
    let savedSkillData = null;
    if(skillArray != null && skillArray[0] != null){
        savedSkillData = skillArray[0];
    }

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
                    {srcID : srcID, isSkill : true},
                    [null]);

            } else {

                // Save increase
                if(triggerSave == null || triggerSave) {
                
                    let canSave = false;

                    if(profType == 'Up') {
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
                            {srcID : srcID, isSkill : true},
                            [{ For : "Skill", To : skillName, Prof : profType }]);
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
        socket.emit("requestASCUpdateSkills", getCharIDFromURL());
    }
    if(profChangePacket.isStatement != null && profChangePacket.isStatement){
        statementComplete();
    }

});