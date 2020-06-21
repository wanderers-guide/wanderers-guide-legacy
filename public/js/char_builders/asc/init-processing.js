// ======================================================================================== //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Apeiron Styling Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ======================================================================================== //

// Global Variables //
let codeQueue = [];
let runningCodeQueue = false;
let gCode_statements, gCode_srcStruct, gCode_locationID;
let ascChoiceStruct, ascSkillMap, ascFeatMap, ascLangMap, ascSpellMap = null;
//                  //

function processCode(ascCode, srcStruct, locationID){
    
    if(ascCode == null || ascCode == ''){
        return;
    }

    ascCode = ascCode.toUpperCase();
    let newSrcStruct = cloneObj(srcStruct);

    if(ascChoiceStruct == null){
        //console.log("Did not find valid choiceStruct :(");
        socket.emit("requestASCChoices",
            getCharIDFromURL(),
            ascCode,
            newSrcStruct,
            locationID);
    } else {
        //console.log("> Found a valid choiceStruct!");
        codeDecompiling(ascCode, newSrcStruct, locationID);
    }

}

socket.on("returnASCChoices", function(ascCode, srcStruct, locationID, choiceStruct){
    //console.log("Setting choiceStruct new one...");
    ascChoiceStruct = choiceStruct;
    initExpressionProcessor({
        ChoiceStruct : choiceStruct,
    });
    
    codeDecompiling(ascCode, srcStruct, locationID);
});

function codeDecompiling(ascCode, srcStruct, locationID){

    codeQueue.push({ ascCode, srcStruct, locationID });

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
        gCode_statements = code.ascCode.split(/\n/);
        gCode_locationID = code.locationID;

        code.srcStruct.sourceCodeSNum = 'a'+code.srcStruct.sourceCodeSNum;
        gCode_srcStruct = code.srcStruct;
        
        let stateReturn = runNextStatement();
        if(stateReturn === 'END'){
            console.log("Code Queue Complete - only 1 statement!");
            shiftCodeQueue();
        } else if(stateReturn === 'SKIP'){
            statementComplete();
        }
    } else {
        runningCodeQueue = false;
        console.log("No More Code Queues Remaining :)");
        finishLoadingPage();
    }
    
}

function statementComplete(){
    console.log("Statement Complete, onto next statement...");

    console.log(gCode_srcStruct.sourceCodeSNum);
    // Up ticks the first digit in the sourceCodeSNum string.
    let sourceCodeSNum = gCode_srcStruct.sourceCodeSNum;
    let firstChar = sourceCodeSNum[0]; // Get first char
    sourceCodeSNum = sourceCodeSNum.substr(1); // Remove first char
    firstChar = charIncrease(firstChar);
    if(firstChar == null){
        displayError("Attempted to run more ASC statements than maximum!");
        return;
    }
    sourceCodeSNum = firstChar+sourceCodeSNum;
    gCode_srcStruct.sourceCodeSNum = sourceCodeSNum;
    console.log(gCode_srcStruct.sourceCodeSNum);
    
    let stateReturn = runNextStatement();
    if(stateReturn === 'END'){
        console.log("Code Queue Complete");
        shiftCodeQueue();
    } else if(stateReturn === 'SKIP'){
        statementComplete();
    }
}

function runNextStatement(){

    let ascStatement = gCode_statements.shift();
    let srcStruct = {
        sourceType: gCode_srcStruct.sourceType,
        sourceLevel: gCode_srcStruct.sourceLevel,
        sourceCode: gCode_srcStruct.sourceCode,
        sourceCodeSNum: gCode_srcStruct.sourceCodeSNum,
    };
    let locationID = gCode_locationID;

    console.log('SRC-STRUCT');
    console.log(srcStruct);
    console.log(ascStatement);
    
    if(ascStatement != null){
        if(ascStatement == ''){ return 'SKIP'; }
        if(ascStatement.endsWith(',')){ ascStatement = ascStatement.slice(0, -1); }

        // Test/Check Statement for Expressions //
        ascStatement = testExpr(ascStatement);
        if(ascStatement === null) {return 'SKIP'; }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
        
        // It could be a sheet statement,
        if(testSheetCode(ascStatement)){
            console.log("Skipping '"+ascStatement+"' because it's a sheet statement.");
            return 'SKIP';
        }

        if(ascStatement.includes("-CHAR-TRAIT")){
            processingCharTags(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-PHYSICAL-FEATURE")){
            processingPhysicalFeatures(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-SENSE")){
            processingSenses(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-FEAT")){
            initFeatProcessing(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-PROF")){
            processingProf(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-SKILL")){
            initSkillProcessing(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-LANG")){
            initLangProcessing(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-ABILITY-BOOST")){
            processingAbilityBoosts(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-INNATE")){
            initInnateSpellProcessing(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-SPELL")){
            processingSpells(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-LORE")){
            processingLore(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-RESISTANCE") || ascStatement.includes("-WEAKNESS")){
            processingResistances(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-DOMAIN")){
            processingDomains(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-SPECIALIZATION")){
            processingSpecializations(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-FAMILIARITY")){
            processingFamiliarities(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-NOTES")){
            processingNotes(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-SPEED")){
            processingSpeeds(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        displayError("Unknown statement (1): \'"+ascStatement+"\'");
        return 'END';

    } else {
        return 'END';
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

socket.on("returnASCUpdateChoices", function(updateType, updateData){
    //console.log("Updating choiceStruct part...");

    if(updateType == 'ABILITY-BOOSTS'){
        ascChoiceStruct.BonusArray = updateData;
    } else if(updateType == 'FEATS'){
        ascChoiceStruct.FeatArray = updateData;
    } else if(updateType == 'DOMAINS'){
        ascChoiceStruct.DomainArray = updateData;
    } else {
        displayError("Failed to update correct charChoice data!");
        console.error('Failed to update correct charChoice data!');
    }
    
    updateExpressionProcessor({
        ChoiceStruct : ascChoiceStruct,
    });
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
    updateExpressionProcessor({
        ChoiceStruct : choiceStruct,
    });
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
    updateExpressionProcessor({
        ChoiceStruct : choiceStruct,
    });
    ascSkillMap = objToMap(skillObject);

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
    ascFeatMap = featMap;
    
    for(const classAbility of classAbilities) {
        if(classAbility.selectType != 'SELECT_OPTION' && classAbility.level <= choiceStruct.Level) {
            let srcStruct = {
                sourceType: 'class',
                sourceLevel: classAbility.level,
                sourceCode: 'classAbility-'+classAbility.id,
                sourceCodeSNum: 'a',
            };
            processCode(
                classAbility.code,
                srcStruct,
                'classAbilityCode'+classAbility.id);
        }
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
    updateExpressionProcessor({
        ChoiceStruct : choiceStruct,
    });
    ascSkillMap = objToMap(skillObject);

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
    ascFeatMap = featMap;

    let ancestryFeatCount = 0;
    for(const ancestryFeatsLoc of ancestryFeatsLocs) {
        // No need for a process clear because it will be going to Feats data every time.
        let srcStruct = {
            sourceType: 'ancestry',
            sourceLevel: ancestryFeatsLoc.Level,
            sourceCode: 'ancestryFeat-'+ancestryFeatCount,
            sourceCodeSNum: 'a',
        };
        processCode(
            'GIVE-ANCESTRY-FEAT='+ancestryFeatsLoc.Level,
            srcStruct,
            ancestryFeatsLoc.LocationID);
        ancestryFeatCount++;
    }
});