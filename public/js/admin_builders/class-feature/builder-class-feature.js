/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    socket.emit("requestAdminClassDetails");

});

socket.on("returnAdminClassDetails", function(classObject, featsObject){

    let classMap = objToMap(classObject);
    $('#inputClassFor').html('');
    for(const [classID, classData] of classMap.entries()){
        if(classData.Class.isArchived == 0){
            $('#inputClassFor').append('<option value="'+classData.Class.name+'">'+classData.Class.name+'</option>');
        }
    }

    $('#inputBuilderType').change(function(){
        if($(this).val() == 'FEATURE'){
            $('#sectionClassFeatureFor').addClass('is-hidden');
        } else if($(this).val() == 'FEATURE-OPTION'){
            $('#sectionClassFeatureFor').removeClass('is-hidden');
        }
    });
    $('#inputBuilderType').trigger("change");


    $('#inputClassFor').change(function(){
        $('#inputClassFeatureFor').html('');
        for(const [classID, classData] of classMap.entries()){
            if($(this).val() == classData.Class.name){
                for(let ability of classData.Abilities){
                    if(ability.isArchived == 0 && ability.selectType == 'SELECTOR'){
                        $('#inputClassFeatureFor').append('<option value="'+ability.name+'">'+ability.name+'</option>');
                    }
                }
                break;
            }
        }
    });
    $('#inputClassFor').trigger("change");


    let classAbilityID = "classAbility0";
    let newClassAbility = $("#classFeatureLayout").clone();
    newClassAbility.attr('id', classAbilityID);
    newClassAbility.removeClass('is-hidden');
    newClassAbility.removeClass('isLayout');
    newClassAbility.find('.card-header').addClass('is-hidden');
    newClassAbility.appendTo("#classFeatureContent");

    // When 'Is Selector' checkbox is changed
    let inputClassFeatureIsSelector = $("#"+classAbilityID).find(".inputClassFeatureIsSelector");
    inputClassFeatureIsSelector.change(function(){
        
        if ($(this).is(":checked")) {

            let classFeatureSelectionOptions = $("#"+classAbilityID).find(".classFeatureSelectionOptions");
            classFeatureSelectionOptions.removeClass('is-hidden');

            let classFeatureOptionsContent = $("#"+classAbilityID).find(".classFeatureOptionsContent");
            let classFeatureAddOptionButton = $("#"+classAbilityID).find(".classFeatureAddOptionButton");
            let classAbilityOptionsCount = 0;
            classFeatureAddOptionButton.click(function(){
                classAbilityOptionsCount++;

                let classAbilityOptionID = classAbilityID+"Option"+classAbilityOptionsCount;

                let newClassAbilityOption = $("#classFeatureLayout").clone();
                newClassAbilityOption.attr('id', classAbilityOptionID);
                newClassAbilityOption.removeClass('is-hidden');
                newClassAbilityOption.removeClass('isLayout');
                newClassAbilityOption.removeClass('classFeature');
                newClassAbilityOption.addClass('classFeatureOption');
                newClassAbilityOption.find(".classFeatureLevelSection").remove();
                newClassAbilityOption.find(".classFeatureDisplayInSheetSection").remove();
                newClassAbilityOption.find(".classFeatureIsSelectorSection").remove();
                newClassAbilityOption.find(".classFeatureSelectionOptions").remove();
                newClassAbilityOption.find(".card-header-title").html('Option');
                newClassAbilityOption.appendTo(classFeatureOptionsContent);

                let cardHeader = $("#"+classAbilityOptionID).find(".card-header");
                let cardContent = $("#"+classAbilityOptionID).find(".card-content");

                cardHeader.click(function(){
                    if(cardContent.is(":visible")) {
                        cardContent.addClass('is-hidden');
                    } else {
                        cardContent.removeClass('is-hidden');
                    }
                });

                let cardHeaderIcon = $("#"+classAbilityOptionID).find(".card-header-icon");
                cardHeaderIcon.click(function(){
                    $("#"+classAbilityOptionID).remove();
                });

            });

        } else {

            let classFeatureSelectionOptions = $("#"+classAbilityID).find(".classFeatureSelectionOptions");
            classFeatureSelectionOptions.addClass('is-hidden');

        }

    });


    $("#createButton").click(function(){
        $(this).unbind();
        finishClassFeature(false);
    });

});

function finishClassFeature(isUpdate){

    let classFeatureClassName = $("#inputClassFor").val();
    let classFeatureContentSrc = $("#inputContentSource").val();

    let classFeatureData = null;
    $(".classFeature").each(function(){
        if(!$(this).hasClass("isLayout")) {
            let classFeatureName = $(this).find(".inputClassFeatureName").val();
            let classFeatureLevel = $(this).find(".inputClassFeatureLevel").val();
            let classFeatureDesc = $(this).find(".inputClassFeatureDesc").val();
            let classFeatureCode = $(this).find(".inputClassFeatureCode").val();
            let classFeatureDisplayInSheet = ($(this).find(".inputClassFeatureDisplayInSheet:checked").val() == '1') ? 1 : 0;
            
            let classFeatureOptions = [];
            if(!$(this).find(".classFeatureSelectionOptions").hasClass("isLayout")){
                $(this).find(".classFeatureOption").each(function(){
                    classFeatureOptions.push({
                        name: $(this).find(".inputClassFeatureName").val(),
                        description: $(this).find(".inputClassFeatureDesc").val(),
                        code: $(this).find(".inputClassFeatureCode").val(),
                    });
                });
            }

            classFeatureData = {
                name: classFeatureName,
                level: classFeatureLevel,
                description: classFeatureDesc,
                code: classFeatureCode,
                displayInSheet: classFeatureDisplayInSheet,
                options: classFeatureOptions,
            };
        }
    });
    
    let requestPacket = null;
    let classFeatureID = null;
    if(isUpdate){
        requestPacket = "requestAdminUpdateClassFeature";
        classFeatureID = getClassFeatureEditorIDFromURL();
    } else {
        requestPacket = "requestAdminAddClassFeature";
    }
    
    socket.emit(requestPacket,{
        classFeatureID,
        classFeatureData,
        classFeatureClassName,
        classFeatureContentSrc
    });

}

socket.on("returnAdminCompleteClassFeature", function() {
    window.location.href = '/admin/manage/class-feature';
});