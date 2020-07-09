// ======================================================================================== //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Apeiron Styling Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ======================================================================================== //

let processingDebug = false;

// Global Variables //
let codeQueue = [];
let runningCodeQueue = false;
let gCode_statements, gCode_srcStruct, gCode_locationID;
let ascChoiceStruct = null;
let ascMapsInit = false;
let ascSkillMap, ascFeatMap, ascLangMap, ascSpellMap = null;
//                  //

function processCode(ascCode, srcStruct, locationID){
    
    if(ascCode == null || ascCode == ''){
        return;
    }

    ascCode = ascCode.toUpperCase();
    let newSrcStruct = cloneObj(srcStruct);

    if(ascChoiceStruct == null){
        displayError("ASC ChoiceStruct Has Not Been Init!");
        if(processingDebug) {console.log("ASC ChoiceStruct Has Not Been Init!");}
        return;
    }

    codeDecompiling(ascCode, newSrcStruct, locationID);

}

function codeDecompiling(ascCode, srcStruct, locationID){

    codeQueue.push({ ascCode, srcStruct, locationID });

    if(!runningCodeQueue){

        runningCodeQueue = true;
        if(!ascMapsInit){
            //if(processingDebug) {console.log("Did not find valid ASC Maps :(");}
            socket.emit("requestASCMapsInit",
                getCharIDFromURL());
        } else {
            //if(processingDebug) {console.log("> Found a valid ASC Maps!");}
            shiftCodeQueue();
        }

    }

}

socket.on("returnASCMapsInit", function(){
    //if(processingDebug) {console.log("Setting ASC Maps...");}
    ascMapsInit = true;

    initExpressionProcessor({
        ChoiceStruct : ascChoiceStruct,
    });
    
    window.setTimeout(() => {
        shiftCodeQueue();
    }, 100);
});

function shiftCodeQueue(){

    runningCodeQueue = true;
    let code = codeQueue.shift();

    if(processingDebug) {console.log("Starting Code Queue:");}
    if(processingDebug) {console.log(code);}
    if(code != null){
        gCode_statements = code.ascCode.split(/\n/);
        gCode_locationID = code.locationID;

        code.srcStruct.sourceCodeSNum = 'a'+code.srcStruct.sourceCodeSNum;
        gCode_srcStruct = code.srcStruct;
        
        let stateReturn = runNextStatement();
        if(stateReturn === 'END'){
            if(processingDebug) {console.log("Code Queue Complete - only 1 statement!");}
            shiftCodeQueue();
        } else if(stateReturn === 'SKIP'){
            statementComplete();
        }
    } else {
        runningCodeQueue = false;
        if(processingDebug) {console.log("No More Code Queues Remaining :)");}
        finishLoadingPage();
    }
    
}

function statementComplete(){
    if(processingDebug) {console.log("Statement Complete, onto next statement...");}

    if(processingDebug) {console.log(gCode_srcStruct.sourceCodeSNum);}
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
    if(processingDebug) {console.log(gCode_srcStruct.sourceCodeSNum);}
    
    let stateReturn = runNextStatement();
    if(stateReturn === 'END'){
        if(processingDebug) {console.log("Code Queue Complete");}
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

    if(processingDebug) {console.log('SRC-STRUCT');}
    if(processingDebug) {console.log(srcStruct);}
    if(processingDebug) {console.log(ascStatement);}
    
    if(ascStatement != null){
        if(ascStatement == ''){ return 'SKIP'; }
        if(ascStatement.endsWith(',')){ ascStatement = ascStatement.slice(0, -1); }

        // Test/Check Statement for Expressions //
        ascStatement = testExpr(ascStatement);
        if(ascStatement === null) {return 'SKIP'; }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
        
        // It could be a sheet statement,
        if(testSheetCode(ascStatement)){
            if(processingDebug) {console.log("Skipping '"+ascStatement+"' because it's a sheet statement.");}
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
            processingFeats(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-PROF")){
            processingProf(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-SKILL")){
            processingSkills(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-LANG")){
            processingLangs(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-ABILITY-BOOST")){
            processingAbilityBoosts(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-INNATE")){
            processingInnateSpells(ascStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(ascStatement.includes("-FOCUS")){
            processingFocusSpells(ascStatement, srcStruct, locationID);
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

        if(ascStatement.includes("-KEY-ABILITY")){
            processingKeyAbilities(ascStatement, srcStruct, locationID);
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

function injectASCChoiceStruct(choiceStruct){
    ascChoiceStruct = choiceStruct;
    updateExpressionProcessor({
        ChoiceStruct : choiceStruct,
    });
}

socket.on("returnASCUpdateChoices", function(updateType, updateData){
    //if(processingDebug) {console.log("Updating choiceStruct part...");}

    if(updateType == 'ABILITY-BOOSTS'){
        ascChoiceStruct.BonusArray = updateData;
    } else if(updateType == 'FEATS'){
        ascChoiceStruct.FeatArray = updateData;
    } else if(updateType == 'DOMAINS'){
        ascChoiceStruct.DomainArray = updateData;
    } else {
        displayError("Failed to update correct charChoice data!");
        if(processingDebug) {console.error('Failed to update correct charChoice data!');}
    }
    
    updateExpressionProcessor({
        ChoiceStruct : ascChoiceStruct,
    });
});

socket.on("returnASCUpdateSkills", function(skillObject){
    let skillMap = objToMap(skillObject);
    //if(processingDebug) {console.log("Updating skillMap...");}
    ascSkillMap = skillMap;
});

socket.on("returnASCUpdateFeats", function(featObject){
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
    //if(processingDebug) {console.log("Updating featMap...");}
    ascFeatMap = featMap;
});

socket.on("returnASCUpdateLangs", function(langObject){
    let langMap = objToMap(langObject);
    //if(processingDebug) {console.log("Updating langMap...");}
    ascLangMap = new Map([...langMap.entries()].sort(
        function(a, b) {
            return a[1].Lang.name > b[1].Lang.name ? 1 : -1;
        })
    );
});

socket.on("returnASCUpdateSpells", function(spellObject){
    let spellsMap = objToMap(spellObject);
    spellsMap = new Map([...spellsMap.entries()].sort(
        function(a, b) {
            if (a[1].Spell.level === b[1].Spell.level) {
                // Name is only important when levels are the same
                return a[1].Spell.name > b[1].Spell.name ? 1 : -1;
            }
            return b[1].Spell.level - a[1].Spell.level;
        })
    );
    //if(processingDebug) {console.log("Updating spellMap...");}
    ascSpellMap = spellsMap;
});

//////////////

function processCode_ClassAbilities(classAbilities){
    //if(processingDebug) {console.log("Starting to run class abilities code...");}
    for(const classAbility of classAbilities) {
        if(classAbility.selectType != 'SELECT_OPTION' && classAbility.level <= ascChoiceStruct.Level) {
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
}

function processCode_AncestryAbilities(ancestryFeatsLocs){
    //if(processingDebug) {console.log("Starting to run ancestry feats code...");}
    let ancestryFeatCount = 0;
    for(const ancestryFeatsLoc of ancestryFeatsLocs) {
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
}