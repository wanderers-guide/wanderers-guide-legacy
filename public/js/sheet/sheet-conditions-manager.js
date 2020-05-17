
function getConditionFromName(name){
    for(const condition of g_allConditions){
        if(condition.name.toLowerCase() == name.toLowerCase()){
            return condition;
        }
    }
    return null;
}

function getConditionFromID(conditionID){
    for(const condition of g_allConditions){
        if(condition.id == conditionID){
            return condition;
        }
    }
    return null;
}


function addCondition(conditionID, value, sourceText){
    console.log('Adding condition w/ ID:');
    console.log(conditionID);
    let existingCondition = g_conditionsMap.get(conditionID+'');
    if(existingCondition != null){
        if(!existingCondition.IsActive){
            if(sourceText != null){ // Sourced Condition
                console.log('-> Making Active '+existingCondition.SourceText+" "+sourceText);
                setTimeout(function(){
                    socket.emit("requestUpdateConditionActive",
                        getCharIDFromURL(),
                        conditionID,
                        true,
                        false);
                }, 100);
                existingCondition.IsActive = true;
            } else { // User Input Condition
                console.log('-> Making Active via SourceSwitch '+conditionID);
                existingCondition.Value = value;
                existingCondition.SourceText = sourceText;
                existingCondition.IsActive = true;
                socket.emit("requestRemoveCondition",
                    getCharIDFromURL(),
                    conditionID,
                    false);
                setTimeout(function(){
                    socket.emit("requestAddCondition",
                        getCharIDFromURL(),
                        conditionID,
                        value,
                        sourceText,
                        true);
                }, 500);
            }
        } else {
            if(sourceText != null){ // Sourced Condition
                console.log('-> Overriding User Condition with Sourced '+conditionID);
                existingCondition.Value = value;
                existingCondition.SourceText = sourceText;
                socket.emit("requestRemoveCondition",
                    getCharIDFromURL(),
                    conditionID,
                    false);
                setTimeout(function(){
                    socket.emit("requestAddCondition",
                        getCharIDFromURL(),
                        conditionID,
                        value,
                        sourceText,
                        false);
                }, 500);
            }
        }
    } else {
        console.log('-> Adding New Record');
        setTimeout(function(){
            let reloadCharSheet = (sourceText == null);
            socket.emit("requestAddCondition",
                getCharIDFromURL(),
                conditionID,
                value,
                sourceText,
                reloadCharSheet);
        }, 100);
        g_conditionsMap.set(conditionID+'', {
            Condition : getConditionFromID(conditionID),
            Value : value,
            SourceText : sourceText,
            IsActive : true
        });
    }
}

function removeCondition(conditionID, deleteRecord){
    console.log('Removing condition w/ ID:');
    console.log(conditionID);
    let existingCondition = g_conditionsMap.get(conditionID+'');
    if(existingCondition != null){
        if(deleteRecord) {
            console.log('-> Removing Record');
            socket.emit("requestRemoveCondition",
                getCharIDFromURL(),
                conditionID,
                true);
            g_conditionsMap.delete(conditionID+"");
        } else {
            if(existingCondition.IsActive){
                if(existingCondition.SourceText != null){
                    console.log('-> Making Inactive');
                    socket.emit("requestUpdateConditionActive",
                        getCharIDFromURL(),
                        conditionID,
                        false,
                        false);
                    existingCondition.IsActive = false;
                }
            }
        }
    }
}

socket.on("returnUpdateConditionsMap", function(reloadCharSheet){
    if(reloadCharSheet){
        loadCharSheet();
    }
});



// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    $('#conditionsModalBackground').click(function(){
        closeConditionsModal();
    });
    $('#conditionsModalCloseButton').click(function(){
        closeConditionsModal();
    });

    $('#conditionsModalSubtractButton').click(function(){
        let value = parseInt($('#conditionsModalValue').html());
        if(!isNaN(value)){
            value--;
            value = (value > 9) ? 9 : value;
            value = (value < 1) ? 1 : value;
            $('#conditionsModalValue').html(value);
        }
    });

    $('#conditionsModalAddButton').click(function(){
        let value = parseInt($('#conditionsModalValue').html());
        if(!isNaN(value)){
            value++;
            value = (value > 9) ? 9 : value;
            value = (value < 1) ? 1 : value;
            $('#conditionsModalValue').html(value);
        }
    });

});

function displayConditionsList(){

    $('#conditionsContent').html('');

    let conditionFound = false;
    for(const [conditionID, conditionData] of g_conditionsMap.entries()){
        console.log(conditionID+" is "+conditionData.IsActive);
        if(conditionData.IsActive){
            conditionFound = true;
            let conditionLinkID = 'conditionLink'+conditionID;
            let conditionValueHTML = (conditionData.Value != null) ? 'data-badge="'+conditionData.Value+'"' : '';
            $('#conditionsContent').append('<button id="'+conditionLinkID+'" class="button is-small is-danger is-outlined has-badge-rounded has-badge-danger" '+conditionValueHTML+'>'+conditionData.Condition.name+'</button>');
            $('#'+conditionLinkID).click(function(){
                openConditionsModal(conditionID);
            });
        }
    }

    if(!conditionFound){
        $('#conditionsContent').append('<em class="has-text-grey-light is-unselectable">None</em>');
    }

}

function runAllConditionsCode(){
    console.log(g_conditionsMap);
    for(const [conditionID, conditionData] of g_conditionsMap.entries()){
        console.log("Running Code From Char Sheet Load > "+conditionID+":"+conditionData.IsActive);
        if(conditionData.IsActive){
            runConditionCode(conditionID);
        }
    }
}

function runConditionCode(conditionID){
    let conditionData = g_conditionsMap.get(conditionID+"");
    if(conditionData != null){

        let conditionCode = conditionData.Condition.code;
        if(conditionCode != null){
            conditionCode = conditionCode.replace(/CONDITION_VALUE_TIMES_TWO/g, conditionData.Value*2);
            conditionCode = conditionCode.replace(/CONDITION_VALUE/g, conditionData.Value);
            processSheetCode(conditionCode, conditionData.Condition.name);
        }

    }
}

function resetConditionsMap(){

    let conditionIDArray = [];
    for(const [conditionID, conditionData] of g_conditionsMap.entries()){
        if(conditionData.SourceText != null && conditionData.IsActive){
            conditionIDArray.push(conditionID);
            conditionData.IsActive = false;
        }
    }
    console.log('Making '+conditionIDArray.length+' Records Inactive');
    if(conditionIDArray.length > 0){
        socket.emit("requestUpdateConditionActiveForArray",
            getCharIDFromURL(),
            conditionIDArray,
            false,
            false);
    }

}

function openConditionsModal(conditionID){

    let conditionData = g_conditionsMap.get(conditionID+'');

    console.log(g_conditionsMap);

    if(conditionData.Value != null){
        $('#conditionsModalFooter').addClass('buttons'); 
        $('#conditionsModalSubtractButton').removeClass('is-hidden');
        $('#conditionsModalValueButton').removeClass('is-hidden');
        $('#conditionsModalAddButton').removeClass('is-hidden');
        $('#conditionsModalValue').html(conditionData.Value);
    } else {
        $('#conditionsModalFooter').removeClass('buttons');
        $('#conditionsModalSubtractButton').addClass('is-hidden');
        $('#conditionsModalValueButton').addClass('is-hidden');
        $('#conditionsModalAddButton').addClass('is-hidden');
    }

    if(conditionData.SourceText != null){
        $('#conditionsModalRemoveButton').addClass('is-hidden');
        $('#conditionsModalTitle').removeClass('pl-5');
        $('#conditionsModalSourceContent').html(conditionData.SourceText);
        $('#conditionsModalSourceSection').removeClass('is-hidden');
    } else {
        $('#conditionsModalRemoveButton').removeClass('is-hidden');
        $('#conditionsModalSourceSection').addClass('is-hidden');
        $('#conditionsModalTitle').addClass('pl-5');

        $('#conditionsModalRemoveButton').off('click');
        $('#conditionsModalRemoveButton').click(function(){
            removeCondition(conditionID, true);
            closeConditionsModal();
        });

    }

    $('#conditionsModalTitle').html(conditionData.Condition.name);
    $('#conditionsModalContent').html(processText(conditionData.Condition.description, true));


    $('#conditionsModalDefault').addClass('is-active');
    $('html').addClass('is-clipped');

    $('#conditionsModalDefault').attr('name', conditionID);

}

function closeConditionsModal(){

    $('#conditionsModalDefault').removeClass('is-active');
    $('html').removeClass('is-clipped');

    let conditionID = parseInt($('#conditionsModalDefault').attr('name'));
    let conditionData = g_conditionsMap.get(conditionID+'');
    
    if(conditionData != null && conditionData.Value != null){
        let value = parseInt($('#conditionsModalValue').html());
        if(conditionData.Value != value){
            socket.emit("requestUpdateConditionValue",
                getCharIDFromURL(),
                conditionID,
                value,
                true);
            conditionData.Value = value;
        }
    }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~ Select Conditions ~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    $('#conditionsSelectModalBackground').click(function(){
        closeSelectConditionsModal();
    });
    $('#conditionsSelectModalCloseButton').click(function(){
        closeSelectConditionsModal();
    });

});


function openSelectConditionsModal() {

    $('#conditionsSelectModalContent').html('');

    for(const condition of g_allConditions){

        let conditionSectionID = 'conditionSection'+condition.id;
        let conditionData = g_conditionsMap.get(condition.id+"");

        if(conditionData != null && conditionData.IsActive) {

            $('#conditionsSelectModalContent').append('<div id="'+conditionSectionID+'" class="tile is-parent is-paddingless has-background-black-ter cursor-clickable"><div class="tile is-child"><p class="has-text-centered is-size-5 border-bottom border-dark">'+condition.name+'</p></div></div>');
            
        } else {

            $('#conditionsSelectModalContent').append('<div id="'+conditionSectionID+'" class="tile is-parent is-paddingless cursor-clickable"><div class="tile is-child"><p class="has-text-centered is-size-5 border-bottom border-dark">'+condition.name+'</p></div></div>');

            $('#'+conditionSectionID).mouseenter(function(){
                $(this).addClass('has-background-black-ter');
            });
            $('#'+conditionSectionID).mouseleave(function(){
                $(this).removeClass('has-background-black-ter');
            });

            $('#'+conditionSectionID).click(function(){
                value = (condition.hasValue == 1) ? 1 : null;
                addCondition(condition.id+"", value, null);
                closeSelectConditionsModal();
            });

        }

        

    }

    $('#conditionsSelectModalDefault').addClass('is-active');
    $('html').addClass('is-clipped');

}

function closeSelectConditionsModal() {

    $('#conditionsSelectModalDefault').removeClass('is-active');
    $('html').removeClass('is-clipped');

}