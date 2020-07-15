
//--------------------- Processing Key Ability --------------------//
function processingKeyAbilities(wscStatement, srcStruct, locationID){
    
    // SET-KEY-ABILITY=ALL
    // SET-KEY-ABILITY=INT,WIS,CHA
    if(wscStatement.includes("SET-KEY-ABILITY")){
        let selectionOptions = wscStatement.split('=')[1];
        let keyAbilitySrcStruct = {
            sourceType: 'class',
            sourceLevel: 1,
            sourceCode: 'keyAbility',
            sourceCodeSNum: 'a'
        };
        giveAbilityBoostSingle(keyAbilitySrcStruct, selectionOptions, locationID);
    } else {
        displayError("Unknown statement (2-KeyAbility): \'"+wscStatement+"\'");
        statementComplete();
    }

}