
// ======================================================================================== //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Apeiron Styling Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ======================================================================================== //

function testSheetCode(ascCode){
    return processSheetCode(ascCode, 'TEST', true);
}

function processSheetCode(ascCode, sourceName){
    return processSheetCode(ascCode, sourceName, false);
}

function processSheetCode(ascCode, sourceName, isTest){
    if(ascCode == null) {return false;}
    
    let ascStatements = ascCode.split(/\n/);

    let success = true;
    for(const ascStatementRaw of ascStatements) {
        // Test/Check Statement for Expressions //
        let ascStatement = testExpr(ascStatementRaw);
        if(ascStatement === null) {continue;}
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

        if(ascStatement.toUpperCase().includes("GIVE-CONDITION")){ // GIVE-CONDITION=Clumsy:1 OR GIVE-CONDITION=Clumsy
            if(isTest) {continue;}

            let conditionName = ascStatement.split('=')[1];
            let conditionValue = null;
            if(ascStatement.includes(":")){
                let conditionNameData = conditionName.split(":");
                conditionName = conditionNameData[0];
                conditionValue = parseInt(conditionNameData[1]);
            }

            let conditionID = getConditionFromName(conditionName).id;
            let conditionParentID = getCurrentConditionIDFromName(sourceName);
            addCondition(conditionID+'', conditionValue, sourceName, conditionParentID);

            continue;
        }

        if(ascStatement.toUpperCase().includes("CONDITIONAL-INCREASE-")){
            if(isTest) {continue;}
            // Ex. CONDITIONAL-INCREASE-PERCEPTION=2~status bonus to checks for initiative

            let adjustmentData = (ascStatement.split('-')[2]).split('=');
            let adjustmentTowards = adjustmentData[0];
            let adjustmentNumInfoData = (adjustmentData[1]).split('~');
            let adjustmentNum = parseInt(adjustmentNumInfoData[0]);
            let adjustmentCondition = adjustmentNumInfoData[1];
            addConditionalStat(adjustmentTowards, adjustmentCondition, adjustmentNum);

            continue;
        }

        if(ascStatement.toUpperCase().includes("CONDITIONAL-DECREASE-")){
            if(isTest) {continue;}
            // Ex. CONDITIONAL-DECREASE-PERCEPTION=2~status penalty to checks for initiative

            let adjustmentData = (ascStatement.split('-')[2]).split('=');
            let adjustmentTowards = adjustmentData[0];
            let adjustmentNumInfoData = (adjustmentData[1]).split('~');
            let adjustmentNum = parseInt(adjustmentNumInfoData[0]);
            let adjustmentCondition = adjustmentNumInfoData[1];
            addConditionalStat(adjustmentTowards, adjustmentCondition, -1*adjustmentNum);

            continue;
        }

        if(ascStatement.toUpperCase().includes("CONDITIONAL-")){
            if(isTest) {continue;}
            // Ex. CONDITIONAL-SAVE_FORT=When you roll a success, you get a critical success instead.

            let adjustmentData = (ascStatement.split('-')[1]).split('=');
            let adjustmentTowards = adjustmentData[0];
            let adjustmentInfo = adjustmentData[1];
            addConditionalStat(adjustmentTowards, adjustmentInfo, null);

            continue;
        }

        if(ascStatement.toUpperCase().includes("INCREASE-")){
            if(isTest) {continue;}
            // INCREASE-X=5 (Ex. INCREASE-SCORE_STR=2, INCREASE-SPEED=10-STATUS)

            let adjValData = ascStatement.split('-');
            let adjustmentData = adjValData[1].split('=');
            let adjustmentTowards = adjustmentData[0];

            let adjustmentNum = parseInt(adjustmentData[1]);
            let adjustmentSource = 'OTHER-'+sourceName;
            if(adjValData[2] != null) {
                adjustmentSource = adjValData[2];
            }

            addStatAndSrc(adjustmentTowards, adjustmentSource+'_BONUS', adjustmentNum, sourceName);

            continue;
        }

        if(ascStatement.toUpperCase().includes("DECREASE-")){
            if(isTest) {continue;}
            // DECREASE-X=5 (Ex. DECREASE-SCORE_STR=2, DECREASE-SPEED=10-STATUS)

            let adjValData = ascStatement.split('-');
            let adjustmentData = adjValData[1].split('=');
            let adjustmentTowards = adjustmentData[0];

            let adjustmentNum = parseInt(adjustmentData[1]);
            let adjustmentSource = 'OTHER-'+sourceName;
            if(adjValData[2] != null) {
                adjustmentSource = adjValData[2];
            }

            addStatAndSrc(adjustmentTowards, adjustmentSource+'_PENALTY', -1*adjustmentNum, sourceName);

            continue;
        }

        if(ascStatement.toUpperCase().includes("SET-APEX-ABILITY-SCORE")){
            if(isTest) {continue;}
            // SET-APEX-ABILITY-SCORE=X (Ex. SET-APEX-ABILITY-SCORE=DEX)

            let adjustmentData = ascStatement.split('=');
            let abilityScore = adjustmentData[1];

            let baseStat = getStat('SCORE_'+abilityScore, 'BASE');
            if(baseStat >= 18){
                addStat('SCORE_'+abilityScore, 'BASE', baseStat+2);
            } else {
                addStat('SCORE_'+abilityScore, 'BASE', 18);
            }

            continue;
        }

        if(ascStatement.toUpperCase() == "SET-FINESSE-MELEE-USE-DEX-DAMAGE"){
            if(isTest) {continue;}

            gState_hasFinesseMeleeUseDexDamage = true;

            continue;
        }

        // Could not identify asc statement
        success = false;

    }

    return success;

}
