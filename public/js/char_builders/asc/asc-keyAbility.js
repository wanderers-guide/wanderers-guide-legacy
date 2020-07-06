
//--------------------- Processing Key Ability --------------------//
function processingKeyAbilities(ascStatement, srcStruct, locationID){
    
    // SET-KEY-ABILITY=ALL
    // SET-KEY-ABILITY=INT,WIS,CHA
    if(ascStatement.includes("SET-KEY-ABILITY")){
        let selectionOptions = ascStatement.split('=')[1];
        let keyAbilitySrcStruct = {
            sourceType: 'class',
            sourceLevel: 1,
            sourceCode: 'keyAbility',
            sourceCodeSNum: 'a'
        };
        giveAbilityBoostSingle(keyAbilitySrcStruct, selectionOptions, locationID);
    } else {
        displayError("Unknown statement (2-KeyAbility): \'"+ascStatement+"\'");
        statementComplete();
    }

}