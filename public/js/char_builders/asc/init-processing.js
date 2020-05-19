// ======================================================================================== //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Apeiron Styling Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ======================================================================================== //

// Global Variables //
let codeQueue = [];
let runningCodeQueue = false;
let gCode_statements, gCode_srcID, gCode_locationID, gCode_stateNum = null;
let ascChoiceStruct, ascSkillMap, ascFeatMap, ascLangMap = null;
//                  //

function processClear(srcID){

    console.log('Starting process clear...');

    //  To prevent an issue with process clearing and code queues where
    //  the process clear would be complete before it can gather the ASC choices.
    //   -> There could still be an issue here, where the first process clear on a
    //      page load never actually goes through.
    if(ascChoiceStruct != null){

        processCode(
            'CLEARING_DATA',
            srcID,
            'CLEARING_DATA'
        );

        socket.emit("requestASCProcessClear", getCharIDFromURL(), srcID);
    } else {
        console.log('Process clear canceled.');
    }

}
socket.on("returnASCProcessClear", function(){
    console.log('PROCESS CLEAR COMPLETED');
    statementComplete();
});

function processCode(ascCode, srcID, locationID){
    
    if(ascCode == null || ascCode == ''){
        return;
    }

    if(ascChoiceStruct == null){
        //console.log("Did not find valid choiceStruct :(");
        socket.emit("requestASCChoices",
            getCharIDFromURL(),
            ascCode,
            srcID,
            locationID);
    } else {
        //console.log("> Found a valid choiceStruct!");
        codeDecompiling(ascCode, srcID, locationID);
    }

}

socket.on("returnASCChoices", function(ascCode, srcID, locationID, choiceStruct){
    //console.log("Setting choiceStruct new one...");
    ascChoiceStruct = choiceStruct;
    
    codeDecompiling(ascCode, srcID, locationID);
});

function codeDecompiling(ascCode, srcID, locationID){

    codeQueue.push({ ascCode, srcID, locationID });

    if(!runningCodeQueue){
        shiftCodeQueue();
    }

}

function shiftCodeQueue(){

    runningCodeQueue = true;
    let code = codeQueue.shift();

    console.log("Starting Code Queue:");
    console.log(code);
    if(code != null){
        gCode_statements = code.ascCode.split(", ");
        gCode_srcID = code.srcID;
        gCode_locationID = code.locationID;
        gCode_stateNum = 0;
    
        statementComplete();
    } else {
        runningCodeQueue = false;
        console.log("No More Code Queues Remaining :)");
        finishLoadingPage();
    }
    
}

function statementComplete(){
    console.log("Statement Complete, onto next statement...");
    gCode_stateNum++;
    let endOfStatements = runNextStatement();
    if(endOfStatements){
        console.log("Code Queue Complete");
        shiftCodeQueue();
    }
}

function runNextStatement(){

    let ascStatement = gCode_statements.shift();
    let srcID = gCode_srcID;
    let locationID = gCode_locationID;
    let statementNum = gCode_stateNum;
    
    if(ascStatement != null){
        if(ascStatement == ''){ return false; }
        if(ascStatement.endsWith(',')){ ascStatement = ascStatement.slice(0, -1); }
        
        if(ascStatement.includes("FEAT")){
            initFeatProcessing(ascStatement, srcID, locationID, statementNum);
            return false;
        }

        if(ascStatement.includes("SKILL")){
            initSkillProcessing(ascStatement, srcID, locationID, statementNum);
            return false;
        }

        if(ascStatement.includes("LANG")){
            initLangProcessing(ascStatement, srcID, locationID, statementNum);
            return false;
        }

        if(ascStatement.includes("ABILITY-BOOST")){
            processingAbilityBoosts(ascStatement, srcID, locationID, statementNum);
            return false;
        }

        if(ascStatement.includes("PROF")){
            processingProf(ascStatement, srcID, locationID, statementNum);
            return false;
        }

        if(ascStatement.includes("SPELL")){
            processingSpells(ascStatement, srcID, locationID, statementNum);
            return false;
        }

        if(ascStatement.includes("LORE")){
            processingLore(ascStatement, srcID, locationID, statementNum);
            return false;
        }

        // Wait for clear to complete.
        if(ascStatement === 'CLEARING_DATA'){
            return false;
        }

        // It could be a sheet statement,
        if(!testSheetCode(ascStatement)){
            displayError("Unknown statement (1): \'"+ascStatement+"\'");
        } else{
            console.log("Skipping '"+ascStatement+"' because it's a sheet statement.");
            statementComplete();
        }
        return false;

    } else {
        return true;
    }

}


socket.on("returnASCStatementFailure", function(details){
    if(details != null){
        displayError("Statement failure: \'"+details+"\'");
    } else {
        displayError("Unknown statement failure");
    }
    statementComplete();
});

/////////////

socket.on("returnASCUpdateChoices", function(choiceStruct){
    //console.log("Updating choiceStruct...");
    ascChoiceStruct = choiceStruct;
});

socket.on("returnASCUpdateSkills", function(skillObject){
    let skillMap = objToMap(skillObject);
    //console.log("Updating skillMap...");
    ascSkillMap = skillMap;
});

socket.on("returnASCUpdateLangs", function(langObject){
    let langMap = objToMap(langObject);
    //console.log("Updating langMap...");
    ascLangMap = langMap;
});

/////////////

function injectASCChoiceStruct(choiceStruct){
    ascChoiceStruct = choiceStruct;
}

//////////////

function processCode_ClassAbilities(classAbilities){
    socket.emit("requestASCClassAbilities",
            getCharIDFromURL(),
            classAbilities);
}

socket.on("returnASCClassAbilities", function(choiceStruct, featObject, skillObject, classAbilities){
    //console.log("Setting choiceStruct, featMap, and skillmap to new ones before classAbilities...");
    ascChoiceStruct = choiceStruct;
    ascFeatMap = objToMap(featObject);
    ascSkillMap = objToMap(skillObject);

    processClear('Type-ClassAbility');
    for(const classAbility of classAbilities) {
        processCode(
            classAbility.code,
            'Type-ClassAbility_Level-'+classAbility.level+'_Code-Ability'+classAbility.id,
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
    //console.log("Setting choiceStruct, featMap, and skillmap to new ones before ancestryFeats...");
    ascChoiceStruct = choiceStruct;
    ascFeatMap = objToMap(featObject);
    ascSkillMap = objToMap(skillObject);
    for(const ancestryFeatsLoc of ancestryFeatsLocs) {
        // No need for a process clear because it will be going to Feats data every time.
        processCode(
            'GIVE-ANCESTRY-FEAT='+ancestryFeatsLoc.Level,
            'Type-Ancestry_Level-'+ancestryFeatsLoc.Level+'_Code-None',
            ancestryFeatsLoc.LocationID);
    }
});