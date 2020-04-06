// ======================================================================================== //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Apeiron Styling Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ======================================================================================== //

// Global Variables //
let ascChoiceStruct, ascSkillMap, ascFeatMap, ascLangMap = null;
//                  //

function processText(text) {

    // Wrap in a paragraph
    text = "<p>"+text+"</p>";


    // <n> -> Newline
    text = text.replace(/<n>/g, "</p><p>");

    // page ### -> Core Rulebook Link
    let regexCoreRules = /page\s*(\d+)/g;
    text = text.replace(regexCoreRules, '<a href="https://paizo.com/products/btq01zp3?Pathfinder-Core-Rulebook" target="_blank">page $1</a>');

    // Pathfinder Bestiary ### -> Bestiary Link
    let regexBestiary = /Pathfinder Bestiary\s*(\d+)/g;
    text = text.replace(regexBestiary, '<a href="https://paizo.com/products/btq01zp4?Pathfinder-Bestiary" target="_blank">Pathfinder Bestiary $1</a>');


    return text;

}

/////////////

function processCode_ClassAbilities(classAbilities){
    socket.emit("requestASCClassAbilities",
            getCharIDFromURL(),
            classAbilities);
}

socket.on("returnASCClassAbilities", function(choiceStruct, featObject, skillObject, classAbilities){
    console.log("Setting choiceStruct, featMap, and skillmap to new ones before classAbilities...")
    ascChoiceStruct = choiceStruct;
    ascFeatMap = objToMap(featObject);
    ascSkillMap = objToMap(skillObject);
    for(const classAbility of classAbilities) {
        processCode(
            classAbility.code,
            'Type-Class_Level-'+classAbility.level+'_Code-Ability'+classAbility.id,
            'classAbilityCode'+classAbility.id);
    }
});

/////////////

function processCode_AncestryAbilities(ancestryFeatsLocs){
    socket.emit("requestASCAncestryFeats",
            getCharIDFromURL(),
            ancestryFeatsLocs);
}

socket.on("returnASCAncestryFeats", function(choiceStruct, featObject, skillObject, ancestryFeatsLocs){
    console.log("Setting choiceStruct, featMap, and skillmap to new ones before ancestryFeats...")
    ascChoiceStruct = choiceStruct;
    ascFeatMap = objToMap(featObject);
    ascSkillMap = objToMap(skillObject);
    for(const ancestryFeatsLoc of ancestryFeatsLocs) {
        processCode(
            'GIVE-ANCESTRY-FEAT='+ancestryFeatsLoc.Level,
            'Type-Ancestry_Level-'+ancestryFeatsLoc.Level+'_Code-None',
            ancestryFeatsLoc.LocationID);
    }
});

/////////////

socket.on("returnASCUpdateChoices", function(choiceStruct){
    console.log("Updating choiceStruct...")
    ascChoiceStruct = choiceStruct;
});

socket.on("returnASCUpdateSkills", function(skillObject){
    let skillMap = objToMap(skillObject);
    console.log("Updating skillMap...")
    ascSkillMap = skillMap;
});

socket.on("returnASCUpdateLangs", function(langObject){
    let langMap = objToMap(langObject);
    console.log("Updating langMap...")
    ascLangMap = langMap;
});

/////////////

function processCode(ascCode, srcID, locationID){

    if(ascCode == null){
        return;
    }

    if(ascChoiceStruct == null){
        console.log("Did not find valid choiceStruct :(");
        socket.emit("requestASCChoices",
            getCharIDFromURL(),
            ascCode,
            srcID,
            locationID);
    } else {
        console.log("> Found a valid choiceStruct!");
        codeDecompiling(ascCode, srcID, locationID);
    }

}

socket.on("returnASCChoices", function(ascCode, srcID, locationID, choiceStruct){
    console.log("Setting choiceStruct new one...")
    ascChoiceStruct = choiceStruct;
    codeDecompiling(ascCode, srcID, locationID);
});

function codeDecompiling(ascCode, srcID, locationID){

    // Split into statements by ', '
    let ascStatements = ascCode.split(", ");

    let statementNum = 0;
    for(const ascStatement of ascStatements) {

        if(ascStatement.includes("FEAT")){
            initFeatProcessing(ascStatement, srcID, locationID, statementNum);
            statementNum++;
            continue;
        }

        if(ascStatement.includes("SKILL")){
            initSkillProcessing(ascStatement, srcID, locationID, statementNum);
            statementNum++;
            continue;
        }

        if(ascStatement.includes("LANG")){
            initLangProcessing(ascStatement, srcID, locationID, statementNum);
            statementNum++;
            continue;
        }

        if(ascStatement.includes("GIVE-LORE")){ // GIVE-LORE=Sailing
            let loreName = ascStatement.split('=')[1];
            giveLore(srcID, loreName);
            giveSkillIncreaseInSkill(srcID, loreName+" Lore");
            statementNum++;
            continue;
        }

        // GIVE-ABILITY-BOOST-SINGLE=ALL
        // GIVE-ABILITY-BOOST-SINGLE=INT,WIS,CHA
        if(ascStatement.includes("GIVE-ABILITY-BOOST-SINGLE")){
            let selectionOptions = ascStatement.split('=')[1];
            giveAbilityBoostSingle(srcID, selectionOptions, locationID, statementNum);
            statementNum++;
            continue;
        }

        // GIVE-ABILITY-BOOST-MULTIPLE=3
        if(ascStatement.includes("GIVE-ABILITY-BOOST-MULTIPLE")){
            let numberOfBoosts = ascStatement.split('=')[1];
            giveAbilityBoostMultiple(srcID, numberOfBoosts, locationID, statementNum);
            statementNum++;
            continue;
        }

    }

}

//------------------------- Processing Langs -------------------------//
function initLangProcessing(ascStatement, srcID, locationID, statementNum) {
    if(ascLangMap == null) {
        console.log("Did not find valid langMap :(");
        socket.emit("requestASCLangs",
                getCharIDFromURL(),
                ascStatement,
                srcID,
                locationID,
                statementNum);
    } else {
        console.log("> Found a valid langMap!");
        processingLangs(ascStatement, srcID, locationID, statementNum);
    }
}

socket.on("returnASCLangs", function(ascStatement, srcID, locationID, statementNum, langObject){
    let langMap = objToMap(langObject);
    console.log("Setting langMap to new one...")
    ascLangMap = langMap;
    processingLangs(ascStatement, srcID, locationID, statementNum);
});

function processingLangs(ascStatement, srcID, locationID, statementNum){

    if(ascStatement.includes("GIVE-LANG-IN")){ // GIVE-LANG-IN=Elvish
        let skillName = ascStatement.split('=')[1];
        giveLangInLang(srcID, skillName);
    }
    else if(ascStatement.includes("GIVE-LANG-BONUS-ONLY")){// GIVE-LANG-BONUS-ONLY
        giveLang(srcID, locationID, statementNum, true);
    }
    else if(ascStatement.includes("GIVE-LANG")){// GIVE-LANG
        giveLang(srcID, locationID, statementNum, false);
    }

}

//------------------------- Processing Skills -------------------------//
function initSkillProcessing(ascStatement, srcID, locationID, statementNum) {
    if(ascSkillMap == null) {
        console.log("Did not find valid skillMap :(");
        socket.emit("requestASCSkills",
                getCharIDFromURL(),
                ascStatement,
                srcID,
                locationID,
                statementNum);
    } else {
        console.log("> Found a valid skillMap!");
        processingSkills(ascStatement, srcID, locationID, statementNum);
    }
}

socket.on("returnASCSkills", function(ascStatement, srcID, locationID, statementNum, skillObject){
    let skillMap = objToMap(skillObject);
    console.log("Setting skillMap to new one...")
    ascSkillMap = skillMap;
    processingSkills(ascStatement, srcID, locationID, statementNum);
});

function processingSkills(ascStatement, srcID, locationID, statementNum){

    if(ascStatement.includes("GIVE-SKILL-INCREASE-IN")){// GIVE-SKILL-INCREASE-IN=Arcana
        let skillName = ascStatement.split('=')[1];
        giveSkillIncreaseInSkill(srcID, skillName);
    }
    else if(ascStatement.includes("GIVE-SKILL-INCREASE")){// GIVE-SKILL-INCREASE
        giveSkillIncrease(srcID, locationID, statementNum);
    }
    else if(ascStatement.includes("GIVE-SKILL-PROF-IN")){// GIVE-SKILL-PROF-IN=Arcana:T
        let data = ascStatement.split('=')[1];
        let segments = data.split(':');
        giveSkillProfInSkill(srcID, segments[0], segments[1]);
    }
    else if(ascStatement.includes("GIVE-SKILL-PROF")){// GIVE-SKILL-PROF=T
        let prof = ascStatement.split('=')[1];
        giveSkillProf(srcID, locationID, statementNum, prof);
    }

}

//------------------------- Processing Feats -------------------------//
function initFeatProcessing(ascStatement, srcID, locationID, statementNum){
    if(ascFeatMap == null) {
        console.log("Did not find valid featMap :(");
        socket.emit("requestASCFeats",
                getCharIDFromURL(),
                ascStatement,
                srcID,
                locationID,
                statementNum);
    } else {
        console.log("> Found a valid featMap!");
        processingFeats(ascStatement, srcID, locationID, statementNum);
    }
}

socket.on("returnASCFeats", function(ascStatement, srcID, locationID, statementNum, featObject){
    let featMap = objToMap(featObject);
    console.log("Setting featMap to new one...")
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
    else if(ascStatement.includes("GIVE-FEAT-ID")){ // GIVE-FEAT-ID=15
        let featID = parseInt(ascStatement.split('=')[1]);
        giveFeatByID(srcID, featID, locationID, statementNum);
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
        console.log("Set stored data to ID "+featArray[0].id);
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
                console.log(featID);
                console.log(feat);
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

}

socket.on("returnFeatChange", function(featChangePacket, selectFeatControlShellClass){
    
    if(selectFeatControlShellClass != null) {
        $('.'+selectFeatControlShellClass).removeClass("is-loading");
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
    let increaseDescriptionID = "selectIncrease"+locationID+statementNum;

    $('#'+locationID).append('<div class="field"><div class="select '+selectIncreaseControlShellClass+'"><select id="'+selectIncreaseID+'" class="selectIncrease"></select></div></div>');

    $('#'+locationID).append('<div id="'+increaseDescriptionID+'"></div>');

    $('#'+selectIncreaseID).append('<option value="chooseDefault">Choose a Skill</option>');
    $('#'+selectIncreaseID).append('<hr class="dropdown-divider"></hr>');

    // Set saved prof choices to savedProfData
    let profChoiceMap = objToMap(ascChoiceStruct.ProficiencyObject);
    let profArray = profChoiceMap.get(srcID);
    let savedProfData = null;
    if(profArray != null && profArray[0] != null){
        savedProfData = profArray[0];
    }

    for(const [skillName, skillData] of ascSkillMap.entries()){

        if(savedProfData != null && savedProfData.To == skillName) {
            $('#'+selectIncreaseID).append('<option value="'+skillName+'" selected>'+skillName+'</option>');
        } else {
            $('#'+selectIncreaseID).append('<option value="'+skillName+'">'+skillName+'</option>');
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
                        let numUps = ascSkillMap.get($('#'+selectIncreaseID).val()).NumUps;
                        if(isAbleToSelectIncrease(numUps+1, ascChoiceStruct.Level)) {
                            canSave= true;
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

//////////////////////////////// Skill Prof ///////////////////////////////////

function giveSkillIncreaseInSkill(srcID, skillName){
    giveInSkill(srcID, skillName, 'Up');
}

function giveSkillProfInSkill(srcID, skillName, prof){
    giveInSkill(srcID, skillName, prof);
}

function giveInSkill(srcID, skillName, prof){

    socket.emit("requestProficiencyChange",
        getCharIDFromURL(),
        {srcID : srcID, isSkill : true},
        [{ For : "Skill", To : skillName, Prof : prof }]);

}

socket.on("returnProficiencyChange", function(profChangePacket){

    if(profChangePacket.isSkill){
        socket.emit("requestASCUpdateSkills", getCharIDFromURL());
    }

});

//////////////////////////////// Give Feat (by ID) ///////////////////////////////////

function giveFeatByID(srcID, featID, locationID, statementNum){

    let feat = ascFeatMap.get(featID+"");

    let descriptionFeatID = "descriptionFeat"+locationID+statementNum;
    $('#'+locationID).append('<div id="'+descriptionFeatID+'"></div>');

    displayFeat(descriptionFeatID, feat);

    socket.emit("requestFeatChange",
        getCharIDFromURL(),
        {srcID : srcID, feat : feat, featID : featID, codeLocationID : locationID+"Code" },
        null);

}


//////////////////////////////// Give Lore ///////////////////////////////////

function giveLore(srcID, loreName){

    console.log(srcID+" : "+loreName);

    socket.emit("requestLoreChange",
        getCharIDFromURL(),
        srcID,
        loreName);

}

socket.on("returnLoreChange", function(){
    console.log("Saved a lore");
});

//////////////////////////////// Give Ability Boost - Single ///////////////////////////////////

function giveAbilityBoostMultiple(srcID, numberOfBoosts, locationID, statementNum) {
    for (let i = 0; i < numberOfBoosts; i++) {
        displayAbilityBoostSingle(srcID, locationID, ((statementNum+1)*100)+i,
                         getAllAbilityTypes());
    }
}

function giveAbilityBoostSingle(srcID, selectionOptions, locationID, statementNum){

    selectionOptions = selectionOptions.toUpperCase();

    if(selectionOptions == "ALL"){
        displayAbilityBoostSingle(srcID, locationID, statementNum, getAllAbilityTypes());
    } else {

        let selectionOptionsArray = selectionOptions.split(",");
        if(selectionOptionsArray.length < 8){
            let abilityTypes = [];
            for(selectionOption of selectionOptionsArray){
                let abilityType = lengthenAbilityType(selectionOption);
                if(!abilityTypes.includes(abilityType)){
                    abilityTypes.push(abilityType);
                }
            }
            if(abilityTypes.length != 0){
                displayAbilityBoostSingle(srcID, locationID, statementNum, abilityTypes)
            } else {
                console.error("Error: Attempted to produce an invalid ability boost! (2)");
            }
        } else {
            console.error("Error: Attempted to produce an invalid ability boost! (1)");
        }
        
    }
    

}

function displayAbilityBoostSingle(srcID, locationID, statementNum, abilityTypes){

    let selectBoostID = "selectBoost"+locationID+statementNum;
    let selectBoostSet = "selectBoostSet"+locationID;
    let selectBoostControlShellClass = selectBoostSet+'ControlShell';

    $('#'+locationID).append('<span class="select is-medium '+selectBoostControlShellClass+'"><select id="'+selectBoostID+'" class="'+selectBoostSet+'"></select></span>');

    let selectBoost = $('#'+selectBoostID);
    selectBoost.append('<option value="chooseDefault">Choose an Ability to Boost</option>');
    selectBoost.append('<hr class="dropdown-divider"></hr>');
    for(const ability of abilityTypes){
        selectBoost.append('<option value="'+ability+'">'+ability+'</option>');
    }

    let bonusChoiceMap = objToMap(ascChoiceStruct.BonusObject);

    if(bonusChoiceMap.get(srcID+statementNum) != null){
        let bonus = bonusChoiceMap.get(srcID+statementNum)[0];
        let longAbilityType = lengthenAbilityType(bonus.Ability);
        
        $(selectBoost).val(longAbilityType);
        if ($(selectBoost).val() != longAbilityType){
            $(selectBoost).val($("#"+selectBoostID+" option:first").val());
        }
    }

    $(selectBoost).change(function(){

        if(hasDuplicateSelected($('.'+selectBoostSet))){
            $('.'+selectBoostControlShellClass).addClass("is-danger");
        } else {
            $('.'+selectBoostControlShellClass).removeClass("is-danger");
            $('.'+selectBoostControlShellClass).addClass("is-loading");

            if($(this).val() != "chooseDefault"){
                let boostArray = [{ Ability : shortenAbilityType($(this).val()), Bonus : "Boost" }];
                socket.emit("requestAbilityBoostChange",
                    getCharIDFromURL(),
                    srcID+statementNum,
                    boostArray,
                    selectBoostControlShellClass);
            }

        }
        
    });

}

socket.on("returnAbilityBoostChange", function(selectBoostControlShellClass){
    $('.'+selectBoostControlShellClass).removeClass("is-loading");
    socket.emit("requestASCUpdateChoices", getCharIDFromURL());
});

//////////////////////////////// Give Lang ///////////////////////////////////

function giveLang(srcID, locationID, statementNum, bonusOnly){

    let selectLangID = "selectLang"+locationID+statementNum;
    let selectLangControlShellClass = selectLangID+'ControlShell';
    let langDescriptionID = selectLangID+"Description";

    $('#'+locationID).append('<div class="field"><div class="select '+selectLangControlShellClass+'"><select id="'+selectLangID+'" class="selectLang"></select></div></div>');

    $('#'+locationID).append('<div class="columns is-centered"><div id="'+langDescriptionID+'" class="column is-8"></div></div>');

    $('#'+selectLangID).append('<option value="chooseDefault">Choose a Language</option>');
    $('#'+selectLangID).append('<hr class="dropdown-divider"></hr>');

    // Set saved prof choices to savedProfData
    let langChoiceMap = objToMap(ascChoiceStruct.LangObject);
    let langArray = langChoiceMap.get(srcID);
    let savedLang = null;
    if(langArray != null && langArray[0] != null){
        savedLang = langArray[0];
    }

    for(const [langID, langData] of ascLangMap.entries()){
        
        if(bonusOnly){

            if(langData.IsBonus) {

                if(savedLang != null && savedLang.id == langID) {
                    $('#'+selectLangID).append('<option value="'+langData.Lang.id+'" selected>'+langData.Lang.name+'</option>');
                } else {
                    $('#'+selectLangID).append('<option value="'+langData.Lang.id+'">'+langData.Lang.name+'</option>');
                }

            }

        } else {

            if(savedLang != null && savedLang.id == langID) {
                $('#'+selectLangID).append('<option value="'+langData.Lang.id+'" selected>'+langData.Lang.name+'</option>');
            } else {
                $('#'+selectLangID).append('<option value="'+langData.Lang.id+'">'+langData.Lang.name+'</option>');
            }

        }

    }

    // On lang choice change
    $('#'+selectLangID).change(function(event, triggerSave) {
        
        if(!($(this).is(":hidden"))) {

            if($(this).val() == "chooseDefault"){
                
                $('.'+selectLangControlShellClass).removeClass("is-danger");
                $('.'+selectLangControlShellClass).addClass("is-info");

                socket.emit("requestLanguagesChange",
                    getCharIDFromURL(),
                    srcID,
                    [null]);

            } else {

                $('.'+selectLangControlShellClass).removeClass("is-info");

                let langID = $(this).val();
                let lang = ascLangMap.get(langID).Lang;

                // Save lang
                if(triggerSave == null || triggerSave) {

                    let langChoiceMap = objToMap(ascChoiceStruct.LangObject);
                    if(!hasDuplicateLang(langChoiceMap, langID)) {
                        $('.'+selectLangControlShellClass).removeClass("is-danger");

                        $('#'+langDescriptionID).html('');

                        socket.emit("requestLanguagesChange",
                            getCharIDFromURL(),
                            srcID,
                            [langID]);

                    } else {
                        $('.'+selectLangControlShellClass).addClass("is-danger");

                        $('#'+langDescriptionID).html('<p class="help is-danger">You already know this language!</p>');

                    }
                
                } else {

                    $('#'+langDescriptionID).html('');

                }
                
            }

        }

    });

    $('#'+selectLangID).trigger("change", [false]);

}

socket.on("returnLanguagesChange", function(){
    socket.emit("requestASCUpdateLangs", getCharIDFromURL());
});