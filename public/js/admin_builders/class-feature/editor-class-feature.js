/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

$(function () {

});

socket.on("returnAdminClassDetails", function(classObject, featsObject){

    let classMap = objToMap(classObject);
    
    let classFeatureID = getClassFeatureEditorIDFromURL();

    //let cClass = ;
    //let classFeature = ;
    for(const [classID, classData] of classMap.entries()){
        for(let ability of classData.Abilities){
            //if()
        }
    }

    if(cClass == null){
        window.location.href = '/admin/manage/class-feature';
        return;
    }

    $("#inputContentSource").val(cClass.Class.contentSrc);

    // Class Abilities //
    for(let classAbil of cClass.Abilities){
        if(classAbil.selectType != 'SELECT_OPTION') {
            $("#addClassFeatureButton").trigger("click");
        }
    }

    let classAbilCount = 0;
    $(".classFeature").each(function(){
        if(!$(this).hasClass("isLayout")) {
            let classAbil = cClass.Abilities[classAbilCount];
            classAbilCount++;
            while (classAbil.selectType === 'SELECT_OPTION') {
                classAbil = cClass.Abilities[classAbilCount];
                classAbilCount++;
            }

            $(this).find(".inputClassFeatureName").val(classAbil.name);
            $(this).find(".inputClassFeatureLevel").val(classAbil.level);
            $(this).find(".inputClassFeatureDesc").val(classAbil.description);
            $(this).find(".inputClassFeatureCode").val(classAbil.code);
            let displayInSheet = (classAbil.displayInSheet == 1) ? true : false;
            $(this).find(".inputClassFeatureDisplayInSheet").prop('checked', displayInSheet);

            // Minimize Class Ability
            $(this).find(".card-header").trigger("click");
            // Trigger Class Ability Name and Tags
            $(this).find(".inputClassFeatureName").trigger("change");

            if(classAbil.selectType === 'SELECTOR'){
                $(this).find(".inputClassFeatureIsSelector").prop('checked', true);
                $(this).find(".inputClassFeatureIsSelector").trigger("change");

                let classAbilOptionsArray = [];
                for(let classAbilOption of cClass.Abilities){
                    if(classAbilOption.selectType === 'SELECT_OPTION' && classAbilOption.selectOptionFor === classAbil.id){
                        classAbilOptionsArray.push(classAbilOption);
                        $(this).find(".classFeatureAddOptionButton").trigger("click");
                    }
                }

                let classAbilOptionCount = 0;
                $(this).find(".classFeatureOption").each(function(){
                    let classAbilOption = classAbilOptionsArray[classAbilOptionCount];
                    classAbilOptionCount++;

                    $(this).find(".inputClassFeatureName").val(classAbilOption.name);
                    $(this).find(".inputClassFeatureDesc").val(classAbilOption.description);
                    $(this).find(".inputClassFeatureCode").val(classAbilOption.code);

                });

            }

        }
    });

    $("#updateButton").click(function(){
        $(this).unbind();
        finishClassFeature(true);
    });

});