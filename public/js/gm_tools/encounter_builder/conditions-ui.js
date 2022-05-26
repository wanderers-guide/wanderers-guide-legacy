/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let conditionsModal_currentMember = null;
let conditionsModal_currentConditionName = null;

$(function () {

    $('#conditionsModalBackground').click(function(){
        closeConditionsModal();
    });
    $('#conditionsModalCloseButton').click(function(){
        closeConditionsModal();
    });

    $('#conditionsModalSubtractButton').click(function(){
        let value = parseInt($('#conditionsModalValue').text());
        if(!isNaN(value)){
            value--;
            value = (value > 9) ? 9 : value;
            value = (value < 1) ? 1 : value;
            $('#conditionsModalValue').text(value);
        }
    });

    $('#conditionsModalAddButton').click(function(){
        let value = parseInt($('#conditionsModalValue').text());
        if(!isNaN(value)){
            value++;
            value = (value > 9) ? 9 : value;
            value = (value < 1) ? 1 : value;
            $('#conditionsModalValue').text(value);
        }
    });

    $('#conditionsSelectModalBackground').click(function(){
        closeSelectConditionsModal();
    });
    $('#conditionsSelectModalCloseButton').click(function(){
        closeSelectConditionsModal();
    });

});




function openConditionsModal(member, conditionData){

    let condition = g_allConditions.find(condition => {
        return condition.name == conditionData.name;
    });

    if(conditionData.value != null){
        $('#conditionsModalFooter').addClass('buttons'); 
        $('#conditionsModalSubtractButton').removeClass('is-hidden');
        $('#conditionsModalValueButton').removeClass('is-hidden');
        $('#conditionsModalAddButton').removeClass('is-hidden');
        $('#conditionsModalValue').text(conditionData.value);
    } else {
        $('#conditionsModalFooter').removeClass('buttons');
        $('#conditionsModalSubtractButton').addClass('is-hidden');
        $('#conditionsModalValueButton').addClass('is-hidden');
        $('#conditionsModalAddButton').addClass('is-hidden');
    }


    $('#conditionsModalRemoveButton').removeClass('is-hidden');
    $('#conditionsModalSourceSection').addClass('is-hidden');
    $('#conditionsModalTitle').addClass('pl-5');

    $('#conditionsModalRemoveButton').off('click');
    $('#conditionsModalRemoveButton').click(function(){
        removeCondition(member, conditionData.name);
        closeConditionsModal();
    });


    $('#conditionsModalTitle').html(condition.name);
    $('#conditionsModalContent').html(processText(condition.description, true, true, 'MEDIUM', false));


    $('#conditionsModalDefault').addClass('is-active');
    $('html').addClass('is-clipped');

    conditionsModal_currentMember = member;
    conditionsModal_currentConditionName = conditionData.name;

}

function closeConditionsModal(){

    $('#conditionsModalDefault').removeClass('is-active');
    $('html').removeClass('is-clipped');

    if(conditionsModal_currentMember != null){
        let value = parseInt($('#conditionsModalValue').text());
        if(!isNaN(value)){
            updateCondition(conditionsModal_currentMember, conditionsModal_currentConditionName, value);
        }
    }

    conditionsModal_currentMember = null;
    conditionsModal_currentConditionName = null;

}


function openSelectConditionsModal(member) {

    $('#conditionsSelectModalContent').html('');

    for (const condition of g_allConditions) {

        let conditionSectionID = 'conditionSection' + condition.id;

        $('#conditionsSelectModalContent').append('<div id="' + conditionSectionID + '" class="tile is-parent is-paddingless cursor-clickable"><div class="tile is-child"><p class="has-text-centered is-size-5 border-bottom border-dark">' + condition.name + '</p></div></div>');

        $('#' + conditionSectionID).mouseenter(function () {
            $(this).addClass('has-bg-selectable');
        });
        $('#' + conditionSectionID).mouseleave(function () {
            $(this).removeClass('has-bg-selectable');
        });

        $('#' + conditionSectionID).click(function () {
            let value = (condition.hasValue == 1) ? 1 : null;
            addCondition(member, condition.name, value);
            closeSelectConditionsModal();
        });



    }

    $('#conditionsSelectModalDefault').addClass('is-active');
    $('html').addClass('is-clipped');

}

function closeSelectConditionsModal() {

    $('#conditionsSelectModalDefault').removeClass('is-active');
    $('html').removeClass('is-clipped');

}