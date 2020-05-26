// ======================================================================================== //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Apeiron Styling Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ======================================================================================== //

// Global Variables //
let codeQueue = [];
let runningCodeQueue = false;
let gCode_statements, gCode_srcStruct, gCode_locationID;
let ascChoiceStruct, ascSkillMap, ascFeatMap, ascLangMap = null;
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
    initExpressionProcessor(choiceStruct.Level, choiceStruct.FinalProfObject);
    
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
        gCode_statements = code.ascCode.split(", ");
        gCode_locationID = code.locationID;

        code.srcStruct.sourceCodeSNum = '1'+code.srcStruct.sourceCodeSNum;
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
    let firstNumber = parseInt(sourceCodeSNum[0]); // Get first number
    sourceCodeSNum = sourceCodeSNum.substr(1); // Remove first number
    firstNumber++;
    if(firstNumber > 9){
        displayError("Attempted to run more than 9 ASC statements in a single code block!");
        return;
    }
    sourceCodeSNum = firstNumber+sourceCodeSNum;
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
        
        if(ascStatement.includes("FEAT")){
            initFeatProcessing(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("SKILL")){
            initSkillProcessing(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("LANG")){
            initLangProcessing(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("ABILITY-BOOST")){
            processingAbilityBoosts(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("PROF")){
            processingProf(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("INNATE")){
            processingInnateSpells(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("SPELL")){
            processingSpells(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("LORE")){
            processingLore(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("RESISTANCE") || ascStatement.includes("WEAKNESS")){
            processingResistances(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        // It could be a sheet statement,
        if(!testSheetCode(ascStatement)){
            displayError("Unknown statement (1): \'"+ascStatement+"\'");
        } else{
            console.log("Skipping '"+ascStatement+"' because it's a sheet statement.");
        }
        return 'SKIP';

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

socket.on("returnASCUpdateChoices", function(choiceStruct){
    //console.log("Updating choiceStruct...");
    ascChoiceStruct = choiceStruct;
    updateExpressionProcessor(choiceStruct.Level, choiceStruct.FinalProfObject);
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
    updateExpressionProcessor(choiceStruct.Level, choiceStruct.FinalProfObject);
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
    updateExpressionProcessor(choiceStruct.Level, choiceStruct.FinalProfObject);
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
        let srcStruct = {
            sourceType: 'class',
            sourceLevel: classAbility.level,
            sourceCode: 'classAbility-'+classAbility.id,
            sourceCodeSNum: '0',
        };
        processCode(
            classAbility.code,
            srcStruct,
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
    updateExpressionProcessor(choiceStruct.Level, choiceStruct.FinalProfObject);
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
            sourceCodeSNum: '0',
        };
        processCode(
            'GIVE-ANCESTRY-FEAT='+ancestryFeatsLoc.Level,
            srcStruct,
            ancestryFeatsLoc.LocationID);
        ancestryFeatCount++;
    }
});