
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
    
    ascCode = ascCode.toUpperCase();
    let ascStatements = ascCode.split(", ");

    let success = true;
    for(const ascStatementRaw of ascStatements) {
        // Test/Check Statement for Expressions //
        let ascStatement = testExpr(ascStatementRaw);
        if(ascStatement === null) {continue;}
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

        if(ascStatement.includes("GIVE-CONDITION")){ // GIVE-CONDITION=Clumsy:1 OR GIVE-CONDITION=Clumsy
            if(isTest) {continue;}

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
            if(isTest) {continue;}
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

        if(ascStatement.includes("INCREASE-")){
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

            addStat(adjustmentTowards, adjustmentSource+'_BONUS', adjustmentNum);

            continue;
        }

        if(ascStatement.includes("DECREASE-")){
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

            addStat(adjustmentTowards, adjustmentSource+'_PENALTY', -1*adjustmentNum);

            continue;
        }

        // Could not identify asc statement
        success = false;

    }

    return success;

}