
//--------------------- Processing Ability Boosts --------------------//
function processingAbilityBoosts(ascStatement, srcID, locationID, statementNum){

    // GIVE-ABILITY-BOOST-SINGLE=ALL
    // GIVE-ABILITY-BOOST-SINGLE=INT,WIS,CHA
    if(ascStatement.includes("GIVE-ABILITY-BOOST-SINGLE")){
        let selectionOptions = ascStatement.split('=')[1];
        giveAbilityBoostSingle(srcID, selectionOptions, locationID, statementNum);
    } else if(ascStatement.includes("GIVE-ABILITY-BOOST-MULTIPLE")){// GIVE-ABILITY-BOOST-MULTIPLE=3
        let numberOfBoosts = ascStatement.split('=')[1];
        giveAbilityBoostMultiple(srcID, numberOfBoosts, locationID, statementNum);
    } else {
        displayError("Unknown statement (2): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Ability Boost - Single ///////////////////////////////////

function giveAbilityBoostMultiple(srcID, numberOfBoosts, locationID, statementNum) {
    if(numberOfBoosts > 6){
        displayError("Attempted to create more than 6 ability boosts!");
        statementComplete();
        return;
    }
    for (let i = 0; i < numberOfBoosts; i++) {
        displayAbilityBoostSingle(srcID, locationID, ((statementNum+1)*100)+i,
                         getAllAbilityTypes());
    }
}

function giveAbilityBoostSingle(srcID, selectionOptions, locationID, statementNum){

    selectionOptions = selectionOptions.toUpperCase();

    if(selectionOptions == "ALL"){
        displayAbilityBoostSingle(srcID, locationID, statementNum, getAllAbilityTypes());
    } else {

        let selectionOptionsArray = selectionOptions.split(",");
        if(selectionOptionsArray.length < 8){
            let abilityTypes = [];
            for(let selectionOption of selectionOptionsArray){
                let abilityType = lengthenAbilityType(selectionOption);
                if(!abilityTypes.includes(abilityType)){
                    abilityTypes.push(abilityType);
                }
            }
            if(abilityTypes.length != 0){
                displayAbilityBoostSingle(srcID, locationID, statementNum, abilityTypes);
            } else {
                displayError("Attempted to produce an invalid ability boost! (2)");
                statementComplete();
            }
        } else {
            displayError("Attempted to produce an invalid ability boost! (1)");
            statementComplete();
        }
        
    }
    

}

function displayAbilityBoostSingle(srcID, locationID, statementNum, abilityTypes){

    let selectBoostID = "selectBoost"+locationID+statementNum;
    let selectBoostSet = "selectBoostSet"+locationID;
    let selectBoostControlShellClass = selectBoostSet+'ControlShell';

    $('#'+locationID).append('<span class="select is-medium '+selectBoostControlShellClass+'"><select id="'+selectBoostID+'" class="'+selectBoostSet+'"></select></span>');

    let selectBoost = $('#'+selectBoostID);
    selectBoost.append('<option value="chooseDefault">Choose an Ability to Boost</option>');
    selectBoost.append('<hr class="dropdown-divider"></hr>');
    for(const ability of abilityTypes){
        selectBoost.append('<option value="'+ability+'">'+ability+'</option>');
    }

    let bonusChoiceMap = objToMap(ascChoiceStruct.BonusObject);

    if(bonusChoiceMap.get(srcID+statementNum) != null){
        let bonus = bonusChoiceMap.get(srcID+statementNum)[0];
        let longAbilityType = lengthenAbilityType(bonus.Ability);
        
        $(selectBoost).val(longAbilityType);
        if ($(selectBoost).val() != longAbilityType){
            $(selectBoost).val($("#"+selectBoostID+" option:first").val());
        }
    }

    $(selectBoost).change(function(){

        if(hasDuplicateSelected($('.'+selectBoostSet))){
            $('.'+selectBoostControlShellClass).addClass("is-danger");
        } else {
            $('.'+selectBoostControlShellClass).removeClass("is-danger");
            $('.'+selectBoostControlShellClass).addClass("is-loading");

            if($(this).val() != "chooseDefault"){
                let boostArray = [{ Ability : shortenAbilityType($(this).val()), Bonus : "Boost" }];
                socket.emit("requestAbilityBoostChange",
                    getCharIDFromURL(),
                    srcID+statementNum,
                    boostArray,
                    selectBoostControlShellClass);
            }

        }
        
    });

    statementComplete();

}

socket.on("returnAbilityBoostChange", function(selectBoostControlShellClass){
    $('.'+selectBoostControlShellClass).removeClass("is-loading");
    socket.emit("requestASCUpdateChoices", getCharIDFromURL());
});