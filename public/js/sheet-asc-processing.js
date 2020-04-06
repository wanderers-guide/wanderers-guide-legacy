
// ======================================================================================== //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Apeiron Styling Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ======================================================================================== //

function processSheetText(text) {

    // Wrap in a paragraph
    text = '<p class="p-1 pl-2">'+text+'</p>';


    // <n> -> Newline
    text = text.replace(/<n>/g, '</p><p class="p-1 pl-2">'); // class="p-1">&nbsp;

    // page ### -> Core Rulebook Link
    let regexCoreRules = /page\s*(\d+)/g;
    text = text.replace(regexCoreRules, '<a href="https://paizo.com/products/btq01zp3?Pathfinder-Core-Rulebook" target="_blank">page $1</a>');

    // Pathfinder Bestiary ### -> Bestiary Link
    let regexBestiary = /Pathfinder Bestiary\s*(\d+)/g;
    text = text.replace(regexBestiary, '<a href="https://paizo.com/products/btq01zp4?Pathfinder-Bestiary" target="_blank">Pathfinder Bestiary $1</a>');


    // {WIS_MOD} -> Character Wisdom Modifier (unsigned)
    // {WIS_MOD|Wisdom Modifier} -> Character Wisdom Modifier (unsigned). Can hover over to reveal text.
    // {+WIS_MOD} ->  Character Wisdom Modifier (signed)
    let regexSheetVariables = /\{(.*?)\}/g;
    text = text.replace(regexSheetVariables, handleSheetVariables);


    // |CRITICAL_SUCCESS:text|
    // |SUCCESS:text|
    // |FAILURE:text|
    // |CRITICAL_FAILURE:text|

    text = text.replace('|CRITICAL_SUCCESS','<p><strong class="pl-3">Critical Success: </strong>');
    text = text.replace('|SUCCESS:','<p><strong class="pl-3">Success: </strong>');
    text = text.replace('|FAILURE:','<p><strong class="pl-3">Failure: </strong>');
    text = text.replace('|CRITICAL_FAILURE:','<p><strong class="pl-3">Critical Failure: </strong>');
    text = text.replace(/\|/g,'</p>');


    return text;

}

function handleSheetVariables(match, innerText){
    if(innerText.includes("|")){
        let innerTextData = innerText.split("|");
        innerTextVariable = innerTextData[0].replace(/\s/g, "").toUpperCase();
        return '<a class="has-text-link has-tooltip-bottom" data-tooltip="'+innerTextData[1]+'">'+acquireSheetVariable(innerTextVariable)+'</a>';
    } else {
        innerText = innerText.replace(/\s/g, "").toUpperCase();
        return acquireSheetVariable(innerText);
    }
}

function acquireSheetVariable(variableName){
    if(variableName.charAt(0) === '+') {
        variableName = variableName.substring(1);
        if(variableName.slice(-3) === "_DC") {
            variableName = variableName.slice(0, -3);
            return signNumber(getStatTotal(variableName)+10);
        } else {
            return signNumber(getStatTotal(variableName));
        }
    } else {
        if(variableName.slice(-3) === "_DC") {
            variableName = variableName.slice(0, -3);
            return getStatTotal(variableName)+10;
        } else {
            return getStatTotal(variableName);
        }
    }
}

function processSheetCode(ascCode, sourceName, sourceType){

    let ascStatements = ascCode.split(", ");

    for(const ascStatement of ascStatements) {

        if(ascStatement.includes("GIVE-CONDITION")){ // GIVE-CONDITION=Clumsy:1 OR GIVE-CONDITION=Clumsy

            let conditionName = ascStatement.split('=')[1];
            let conditionValue = 1;
            if(ascStatement.includes(":")){
                let conditionNameData = conditionName.split(":");
                conditionName = conditionNameData[0];
                conditionValue = parseInt(conditionNameData[1]);
            }

            let conditionID = getConditionFromName(conditionName).id;
            addCondition(conditionID+'', conditionValue, sourceName);

            continue;
        }

        if(ascStatement.includes("CONDITIONAL-INCREASE-")){
            // Ex. CONDITIONAL-INCREASE-PERCEPTION=2~status penalty to checks for initiative

            let adjustmentData = (ascStatement.split('-')[2]).split('=');
            let adjustmentTowards = adjustmentData[0];
            let adjustmentNumInfoData = (adjustmentData[1]).split('~');
            let adjustmentNum = parseInt(adjustmentNumInfoData[0]);
            let adjustmentCondition = adjustmentNumInfoData[1];
            addConditionalStat(adjustmentTowards, adjustmentCondition, adjustmentNum);

            continue;
        }

        if(ascStatement.includes("CONDITIONAL-DECREASE-")){
            // Ex. CONDITIONAL-DECREASE-PERCEPTION=2~status penalty to checks for initiative

            let adjustmentData = (ascStatement.split('-')[2]).split('=');
            let adjustmentTowards = adjustmentData[0];
            let adjustmentNumInfoData = (adjustmentData[1]).split('~');
            let adjustmentNum = parseInt(adjustmentNumInfoData[0]);
            let adjustmentCondition = adjustmentNumInfoData[1];
            addConditionalStat(adjustmentTowards, adjustmentCondition, -1*adjustmentNum);

            continue;
        }

        if(ascStatement.includes("INCREASE-")){ // INCREASE-X=5 (Ex. INCREASE-SCORE_STR=2, INCREASE-SPEED=10)

            let adjustmentData = (ascStatement.split('-')[1]).split('=');
            let adjustmentTowards = adjustmentData[0];
            let adjustmentNum = parseInt(adjustmentData[1]);
            addStat(adjustmentTowards, sourceType+'_BONUS', adjustmentNum);

            continue;
        }

        if(ascStatement.includes("DECREASE-")){ // DECREASE-X=5 (Ex. DECREASE-SCORE_STR=2, DECREASE-SPEED=10)

            let adjustmentData = (ascStatement.split('-')[1]).split('=');
            let adjustmentTowards = adjustmentData[0];
            let adjustmentNum = parseInt(adjustmentData[1]);
            addStat(adjustmentTowards, sourceType+'_PENALTY', -1*adjustmentNum);

            continue;
        }

    }

}