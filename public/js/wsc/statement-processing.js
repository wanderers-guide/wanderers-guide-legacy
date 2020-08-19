/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

// ========================================================================================= //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Wanderer's Guide Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ========================================================================================= //

function testSheetCode(wscCode){
    return processSheetCode(wscCode, 'TEST', true);
}

function processSheetCode(wscCode, sourceName, isTest=false){
    if(wscCode == null) {return false;}

    let wscStatements = wscCode.split(/\n/);

    let success = true;
    for(const wscStatementRaw of wscStatements) {
        // Test/Check Statement for Expressions //
        let wscStatement = testExpr(wscStatementRaw);
        if(wscStatement === null) {continue;}
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
        let wscStatementUpper = wscStatement.toUpperCase();

        if(wscStatementUpper.includes("ADD-TEXT=")){
            continue; // Ignore ADD-TEXT statements, they're processed separately
        }

        if(wscStatementUpper.includes("GIVE-CONDITION=")){ // GIVE-CONDITION=Clumsy:1 OR GIVE-CONDITION=Clumsy
            if(isTest) {continue;}

            let conditionName = wscStatement.split('=')[1];
            let conditionValue = null;
            if(wscStatement.includes(":")){
                let conditionNameData = conditionName.split(":");
                conditionName = conditionNameData[0];
                conditionValue = parseInt(conditionNameData[1]);
            }

            let conditionID = getConditionFromName(conditionName).id;
            let conditionParentID = getCurrentConditionIDFromName(sourceName);
            addCondition(conditionID+'', conditionValue, sourceName, conditionParentID);

            continue;
        }

        if(wscStatementUpper.includes("CONDITIONAL-INCREASE-")){
            if(isTest) {continue;}
            // Ex. CONDITIONAL-INCREASE-PERCEPTION=2~status bonus to checks for initiative

            let adjustmentData = (wscStatement.split('-')[2]).split('=');
            let adjustmentTowards = adjustmentData[0];
            let adjustmentNumInfoData = (adjustmentData[1]).split('~');
            let adjustmentNum = parseInt(adjustmentNumInfoData[0]);
            let adjustmentCondition = adjustmentNumInfoData[1];
            addConditionalStat(adjustmentTowards, adjustmentCondition, adjustmentNum);

            continue;
        }

        if(wscStatementUpper.includes("CONDITIONAL-DECREASE-")){
            if(isTest) {continue;}
            // Ex. CONDITIONAL-DECREASE-PERCEPTION=2~status penalty to checks for initiative

            let adjustmentData = (wscStatement.split('-')[2]).split('=');
            let adjustmentTowards = adjustmentData[0];
            let adjustmentNumInfoData = (adjustmentData[1]).split('~');
            let adjustmentNum = parseInt(adjustmentNumInfoData[0]);
            let adjustmentCondition = adjustmentNumInfoData[1];
            addConditionalStat(adjustmentTowards, adjustmentCondition, -1*adjustmentNum);

            continue;
        }

        if(wscStatementUpper.includes("CONDITIONAL-")){
            if(isTest) {continue;}
            // Ex. CONDITIONAL-SAVE_FORT=When you roll a success, you get a critical success instead.

            let adjustmentData = (wscStatement.split('-')[1]).split('=');
            let adjustmentTowards = adjustmentData[0];
            let adjustmentInfo = adjustmentData[1];
            addConditionalStat(adjustmentTowards, adjustmentInfo, null);

            continue;
        }

        if(wscStatementUpper.includes("INCREASE-")){
            if(isTest) {continue;}
            // INCREASE-X=5 (Ex. INCREASE-SCORE_STR=2, INCREASE-SPEED=10-STATUS)

            let adjValData = wscStatement.split('-');
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

        if(wscStatementUpper.includes("DECREASE-")){
            if(isTest) {continue;}
            // DECREASE-X=5 (Ex. DECREASE-SCORE_STR=2, DECREASE-SPEED=10-STATUS)

            let adjValData = wscStatement.split('-');
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

        if(wscStatementUpper.includes("OVERRIDE-")){
            if(isTest) {continue;}
            // OVERRIDE-X=5 (Ex. OVERRIDE-PERCEPTION=10-MODIFIER)

            let adjValData = wscStatement.split('-');
            let overrideData = adjValData[1].split('=');

            let overrideTowards = overrideData[0];
            let overrideSource = adjValData[2];
            let overrideNum = parseInt(overrideData[1]);

            if(overrideTowards.endsWith('_PENALTY')){
                overrideNum = -1*overrideNum;
            }
            
            addStat(overrideTowards, overrideSource, overrideNum);

            continue;
        }

        if(wscStatementUpper.includes("SET-APEX-ABILITY-SCORE=")){
            if(isTest) {continue;}
            // SET-APEX-ABILITY-SCORE=X (Ex. SET-APEX-ABILITY-SCORE=DEX)

            let adjustmentData = wscStatement.split('=');
            let abilityScore = adjustmentData[1];

            let baseStat = getStat('SCORE_'+abilityScore, 'BASE');
            if(baseStat >= 18){
                addStat('SCORE_'+abilityScore, 'BASE', baseStat+2);
            } else {
                addStat('SCORE_'+abilityScore, 'BASE', 18);
            }

            continue;
        }

        if(wscStatementUpper == "SET-FINESSE-MELEE-USE-DEX-DAMAGE"){
            if(isTest) {continue;}

            gState_hasFinesseMeleeUseDexDamage = true;

            continue;
        }

        if(wscStatementUpper == "SET-ARMORED-STEALTH"){
            if(isTest) {continue;}

            gState_armoredStealth = true;

            continue;
        }

        if(wscStatementUpper == "SET-MIGHTY-BULWARK"){
            if(isTest) {continue;}

            gState_mightyBulwark = true;

            continue;
        }

        if(wscStatementUpper == "SET-ADD-LEVEL-TO-UNTRAINED-WEAPONS"){
            if(isTest) {continue;}

            gState_addLevelToUntrainedWeaponAttack = true;

            continue;
        }

        if(wscStatementUpper == "DISPLAY-COMPANION-TAB"){
            if(isTest) {continue;}

            gState_displayCompanionTab = true;

            continue;
        }

        // Could not identify wsc statement
        success = false;

    }

    // MiscFeats is run even on tests, which is how the code is run for character builder.
    //  - Probably should change this to a better system in the future.
    let miscFeatSuccess = processMiscFeatStatements(wscCode);
    if(!success && miscFeatSuccess) { success = true; }

    return success;

}
