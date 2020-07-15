// ========================================================================================= //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Wanderer's Guide Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ========================================================================================= //

let processingDebug = false;

// Global Variables //
let codeQueue = [];
let runningCodeQueue = false;
let gCode_statements, gCode_srcStruct, gCode_locationID;
let wscChoiceStruct = null;
let wscMapsInit = false;
let wscSkillMap, wscFeatMap, wscLangMap, wscSpellMap = null;
//                  //

function processCode(wscCode, srcStruct, locationID){
    
    if(wscCode == null || wscCode == ''){
        return;
    }

    wscCode = wscCode.toUpperCase();
    let newSrcStruct = cloneObj(srcStruct);

    if(wscChoiceStruct == null){
        displayError("WSC ChoiceStruct Has Not Been Init!");
        if(processingDebug) {console.log("WSC ChoiceStruct Has Not Been Init!");}
        return;
    }

    codeDecompiling(wscCode, newSrcStruct, locationID);

}

function codeDecompiling(wscCode, srcStruct, locationID){

    codeQueue.push({ wscCode, srcStruct, locationID });

    if(!runningCodeQueue){

        runningCodeQueue = true;
        if(!wscMapsInit){
            //if(processingDebug) {console.log("Did not find valid WSC Maps :(");}
            socket.emit("requestWSCMapsInit",
                getCharIDFromURL());
        } else {
            //if(processingDebug) {console.log("> Found a valid WSC Maps!");}
            shiftCodeQueue();
        }

    }

}

socket.on("returnWSCMapsInit", function(){
    //if(processingDebug) {console.log("Setting WSC Maps...");}
    wscMapsInit = true;

    initExpressionProcessor({
        ChoiceStruct : wscChoiceStruct,
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
        gCode_statements = code.wscCode.split(/\n/);
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
        displayError("Attempted to run more WSC statements than maximum!");
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

    let wscStatement = gCode_statements.shift();
    let srcStruct = {
        sourceType: gCode_srcStruct.sourceType,
        sourceLevel: gCode_srcStruct.sourceLevel,
        sourceCode: gCode_srcStruct.sourceCode,
        sourceCodeSNum: gCode_srcStruct.sourceCodeSNum,
    };
    let locationID = gCode_locationID;

    if(processingDebug) {console.log('SRC-STRUCT');}
    if(processingDebug) {console.log(srcStruct);}
    if(processingDebug) {console.log(wscStatement);}
    
    if(wscStatement != null){
        if(wscStatement == ''){ return 'SKIP'; }
        if(wscStatement.endsWith(',')){ wscStatement = wscStatement.slice(0, -1); }

        // Test/Check Statement for Expressions //
        wscStatement = testExpr(wscStatement);
        if(wscStatement === null) {return 'SKIP'; }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
        
        // It could be a sheet statement,
        if(testSheetCode(wscStatement)){
            if(processingDebug) {console.log("Skipping '"+wscStatement+"' because it's a sheet statement.");}
            return 'SKIP';
        }

        if(wscStatement.includes("-CHAR-TRAIT")){
            processingCharTags(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-PHYSICAL-FEATURE")){
            processingPhysicalFeatures(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-SENSE")){
            processingSenses(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-FEAT")){
            processingFeats(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-PROF")){
            processingProf(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-SKILL")){
            processingSkills(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-LANG")){
            processingLangs(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-ABILITY-BOOST")){
            processingAbilityBoosts(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-INNATE")){
            processingInnateSpells(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-FOCUS")){
            processingFocusSpells(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-SPELL")){
            processingSpells(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-LORE")){
            processingLore(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-RESISTANCE") || wscStatement.includes("-WEAKNESS")){
            processingResistances(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-DOMAIN")){
            processingDomains(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-SPECIALIZATION")){
            processingSpecializations(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-FAMILIARITY")){
            processingFamiliarities(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-NOTES")){
            processingNotes(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-SPEED")){
            processingSpeeds(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        if(wscStatement.includes("-KEY-ABILITY")){
            processingKeyAbilities(wscStatement, srcStruct, locationID);
            return 'WAIT';
        }

        displayError("Unknown statement (1): \'"+wscStatement+"\'");
        return 'END';

    } else {
        return 'END';
    }

}


socket.on("returnWSCStatementFailure", function(details){
    if(details != null){
        displayError("Statement failure: \'"+details+"\'");
    } else {
        displayError("Unknown statement failure");
    }
    statementComplete();
});

/////////////

function injectWSCChoiceStruct(choiceStruct){
    wscChoiceStruct = choiceStruct;
    updateExpressionProcessor({
        ChoiceStruct : choiceStruct,
    });
}

socket.on("returnWSCUpdateChoices", function(updateType, updateData){
    //if(processingDebug) {console.log("Updating choiceStruct part...");}

    if(updateType == 'ABILITY-BOOSTS'){
        wscChoiceStruct.BonusArray = updateData;
    } else if(updateType == 'FEATS'){
        wscChoiceStruct.FeatArray = updateData;
    } else if(updateType == 'DOMAINS'){
        wscChoiceStruct.DomainArray = updateData;
    } else {
        displayError("Failed to update correct charChoice data!");
        if(processingDebug) {console.error('Failed to update correct charChoice data!');}
    }
    
    updateExpressionProcessor({
        ChoiceStruct : wscChoiceStruct,
    });
});

socket.on("returnWSCUpdateSkills", function(skillObject){
    let skillMap = objToMap(skillObject);
    //if(processingDebug) {console.log("Updating skillMap...");}
    wscSkillMap = skillMap;
});

socket.on("returnWSCUpdateFeats", function(featObject){
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
    wscFeatMap = featMap;
});

socket.on("returnWSCUpdateLangs", function(langObject){
    let langMap = objToMap(langObject);
    //if(processingDebug) {console.log("Updating langMap...");}
    wscLangMap = new Map([...langMap.entries()].sort(
        function(a, b) {
            return a[1].Lang.name > b[1].Lang.name ? 1 : -1;
        })
    );
});

socket.on("returnWSCUpdateSpells", function(spellObject){
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
    wscSpellMap = spellsMap;
});

//////////////

function processCode_ClassAbilities(classAbilities){
    //if(processingDebug) {console.log("Starting to run class abilities code...");}
    for(const classAbility of classAbilities) {
        if(classAbility.selectType != 'SELECT_OPTION' && classAbility.level <= wscChoiceStruct.Level) {
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