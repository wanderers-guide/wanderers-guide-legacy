
//--------------------- Processing Ability Boosts --------------------//
function processingAbilityBoosts(ascStatement, srcStruct, locationID){

    // GIVE-ABILITY-BOOST-SINGLE=ALL
    // GIVE-ABILITY-BOOST-SINGLE=INT,WIS,CHA
    if(ascStatement.includes("GIVE-ABILITY-BOOST-SINGLE")){
        let selectionOptions = ascStatement.split('=')[1];
        giveAbilityBoostSingle(srcStruct, selectionOptions, locationID);
    } else if(ascStatement.includes("GIVE-ABILITY-BOOST-MULTIPLE")){// GIVE-ABILITY-BOOST-MULTIPLE=3
        let numberOfBoosts = ascStatement.split('=')[1];
        giveAbilityBoostMultiple(srcStruct, numberOfBoosts, locationID);
    } else {
        displayError("Unknown statement (2-Boost): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Ability Boost - Single ///////////////////////////////////

function giveAbilityBoostMultiple(srcStruct, numberOfBoosts, locationID) {
    statementComplete();
    if(numberOfBoosts > 6){
        displayError("Attempted to create more than 6 ability boosts!");
    } else {
        let multiBoostCodeStr = '';
        for (let i = 0; i < numberOfBoosts; i++) {
            multiBoostCodeStr += 'GIVE-ABILITY-BOOST-SINGLE=ALL\n';
        }
        if(multiBoostCodeStr != ''){
            processCode(
                multiBoostCodeStr,
                srcStruct,
                locationID);
        }
    }
}

function giveAbilityBoostSingle(srcStruct, selectionOptions, locationID){

    selectionOptions = selectionOptions.toUpperCase();

    if(selectionOptions == "ALL"){
        displayAbilityBoostSingle(srcStruct, locationID, getAllAbilityTypes());
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
                displayAbilityBoostSingle(srcStruct, locationID, abilityTypes);
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

function displayAbilityBoostSingle(srcStruct, locationID, abilityTypes){
    
    let selectBoostID = "selectBoost"+locationID+"-"+srcStruct.sourceCodeSNum;
    let selectBoostSet = "selectBoostSet"+locationID;
    let selectBoostControlShellClass = selectBoostSet+'ControlShell';

    $('#'+locationID).append('<span class="select mb-1 mx-1 is-medium '+selectBoostControlShellClass+'"><select id="'+selectBoostID+'" class="'+selectBoostSet+'"></select></span>');

    let selectBoost = $('#'+selectBoostID);
    selectBoost.append('<option value="chooseDefault">Choose an Ability</option>');
    selectBoost.append('<hr class="dropdown-divider"></hr>');
    for(const ability of abilityTypes){
        selectBoost.append('<option value="'+ability+'">'+ability+'</option>');
    }

    let bonusArray = ascChoiceStruct.BonusArray;

    let bonus = bonusArray.find(bonus => {
        return hasSameSrc(bonus, srcStruct);
    });
    if(bonus != null){
        let longAbilityType = lengthenAbilityType(bonus.Ability);
        
        $(selectBoost).val(longAbilityType);
        if ($(selectBoost).val() != longAbilityType){
            $(selectBoost).val($("#"+selectBoostID+" option:first").val());
            $(selectBoost).parent().addClass("is-info");
        }
    } else {
        $(selectBoost).parent().addClass("is-info");
    }

    $(selectBoost).change(function(){

        if(hasDuplicateSelected($('.'+selectBoostSet))){
            $('.'+selectBoostControlShellClass).addClass("is-danger");
        } else {
            $('.'+selectBoostControlShellClass).removeClass("is-danger");
            $('.'+selectBoostControlShellClass).addClass("is-loading");

            if($(this).val() != "chooseDefault"){
                $(this).parent().removeClass("is-info");
                socket.emit("requestWSCAbilityBonusChange",
                    getCharIDFromURL(),
                    srcStruct,
                    {Ability: shortenAbilityType($(this).val()), Bonus: "Boost"},
                    selectBoostControlShellClass);
            } else {
                $(this).parent().addClass("is-info");
                socket.emit("requestWSCAbilityBonusChange",
                    getCharIDFromURL(),
                    srcStruct,
                    null,
                    selectBoostControlShellClass);
            }

        }
        
    });

    statementComplete();

}

socket.on("returnWSCAbilityBonusChange", function(selectBoostControlShellClass){
    $('.'+selectBoostControlShellClass).removeClass("is-loading");
    $('.'+selectBoostControlShellClass+'>select').blur();
    selectorUpdated();
    socket.emit("requestWSCUpdateChoices", getCharIDFromURL(), 'ABILITY-BOOSTS');
});