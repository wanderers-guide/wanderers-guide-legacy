
//------------------------- Processing Skills -------------------------//
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

    $('#'+locationID).append('<div class="field is-grouped is-grouped-centered is-marginless"><div class="select '+selectIncreaseControlShellClass+'"><select id="'+selectIncreaseID+'" class="selectIncrease"></select></div></div>');

    $('#'+locationID).append('<div id="'+increaseDescriptionID+'" class="pb-2"></div>');

    $('#'+selectIncreaseID).append('<option value="chooseDefault">Choose a Skill</option>');
    $('#'+selectIncreaseID).append('<hr class="dropdown-divider"></hr>');

    // Set saved skill choices
    let savedSkillData = ascChoiceStruct.ProfArray.find(prof => {
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
        
        if($(this).val() == "chooseDefault"){

            $('.'+selectIncreaseControlShellClass).removeClass("is-danger");
            $('.'+selectIncreaseControlShellClass).addClass("is-info");

            skillsUpdateASCChoiceStruct(srcStruct, null, null);
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
                        $('#'+increaseDescriptionID).html('<p class="help is-danger text-center">You cannot increase the proficiency of this skill any further at your current level!</p>');
                    }
                } else {
                    canSave = true;
                }

                if(canSave) {
                    $('.'+selectIncreaseControlShellClass).removeClass("is-danger");

                    let skillName = $(this).val();

                    skillsUpdateASCChoiceStruct(srcStruct, skillName, profType);
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

function skillsUpdateASCChoiceStruct(srcStruct, profTo, profType){

    let foundProfData = false;
    for(let profData of ascChoiceStruct.ProfArray){
        if(hasSameSrc(profData, srcStruct)){
            foundProfData = true;
            if(profTo != null && profType != null){
                profData.value = 'Skill:::'+profTo+':::'+profType;
                profData.For = 'Skill';
                profData.To = profTo;
                profData.Prof = profType;
            } else {
                profData = null;
            }
            break;
        }
    }

    if(!foundProfData){
        let profData = srcStruct;
        profData.value = 'Skill:::'+profTo+':::'+profType;
        profData.For = 'Skill';
        profData.To = profTo;
        profData.Prof = profType;
        ascChoiceStruct.ProfArray.push(profData);
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