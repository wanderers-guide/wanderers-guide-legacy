
// ======================================================================================== //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Apeiron Styling Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ======================================================================================== //

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