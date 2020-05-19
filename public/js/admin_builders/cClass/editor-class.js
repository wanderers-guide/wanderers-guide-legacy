
$(function () {

    socket.emit("requestAdminClassDetails");

});

socket.on("returnAdminClassDetails", function(classObject, featsObject){

    let classMap = objToMap(classObject);
    let featMap = objToMap(featsObject);
    
    let cClass = classMap.get(getClassEditorIDFromURL()+"");

    if(cClass == null){
        window.location.href = '/admin/manage/class';
        return;
    }

    $("#inputName").val(cClass.Class.name);
    $("#inputVersion").val(cClass.Class.version);
    $("#inputHitPoints").val(cClass.Class.hitPoints);

    let classKeyAbility = cClass.Class.keyAbility;
    if(classKeyAbility === null){
        $("#inputKeyAbility").val('');
    } else if(classKeyAbility.includes(' or ')){
        $("#inputKeyAbility").val('OR');
        let keyAbilData = classKeyAbility.split(' or ');
        $("#inputKeyAbilityOptionOne").val(keyAbilData[0]);
        $("#inputKeyAbilityOptionTwo").val(keyAbilData[1]);
        $("#inputKeyAbility").trigger("change");
    } else {
        $("#inputKeyAbility").val(classKeyAbility);
    }

    $("#inputPerception").val(cClass.Class.tPerception);
    $("#inputSkills").val(cClass.Class.tSkills);
    $("#inputSkillsMore").val(cClass.Class.tSkillsMore);
    $("#inputFortitude").val(cClass.Class.tFortitude);
    $("#inputReflex").val(cClass.Class.tReflex);
    $("#inputWill").val(cClass.Class.tWill);
    $("#inputDescription").val(cClass.Class.description);

    let classWeaponsArray = cClass.Class.tWeapons.split(',,, ');
    for(let classWeapon of classWeaponsArray) {
        let weapData = classWeapon.split(':::');
        if(weapData[0] === 'T'){
            $('#inputWeaponsTrained option[value="'+weapData[1]+'"]').attr('selected','selected');
        } else if(weapData[0] === 'E'){
            $('#inputWeaponsExpert option[value="'+weapData[1]+'"]').attr('selected','selected');
        }
    }
    $('#inputWeaponsTrained').trigger("change");
    $('#inputWeaponsExpert').trigger("change");

    let classArmorArray = cClass.Class.tArmor.split(',,, ');
    for(let classArmor of classArmorArray) {
        let armorData = classArmor.split(':::');
        if(armorData[0] === 'T'){
            $('#inputArmorTrained option[value="'+armorData[1]+'"]').attr('selected','selected');
        }
    }
    $('#inputArmorTrained').trigger("change");

    // Class Abilities //
    for(let classAbil of cClass.Abilities){
        if(classAbil.selectType != 'SELECT_OPTION') {
            $("#addClassFeatureButton").trigger("click");
        }
    }

    let classAbilCount = 0;
    $(".classFeature").each(function(){
        if($(this).is(":visible")) {
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

            // Minimize Class Ability
            $(this).find(".card-header").trigger("click");
            // Trigger Class Ability Name and Tags
            $(this).find(".inputClassFeatureName").trigger("change");

            if(classAbil.selectType === 'SELECTOR'){
                $(this).find(".inputClassFeatureIsSelector").prop('checked', true);
                $(this).find(".inputClassFeatureIsSelector").trigger("change");

                let classAbilOptionsArray = [];
                for(let classAbilOption of cClass.Abilities){
                    console.log(classAbilOption.selectOptionFor+" "+classAbil.id);
                    if(classAbilOption.selectType === 'SELECT_OPTION' && classAbilOption.selectOptionFor === classAbil.id){
                        classAbilOptionsArray.push(classAbilOption);
                        console.log('GOT HERE');
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


    // Class Feats //
    let classFeats = [];
    for(const [key, value] of featMap.entries()){
        let classTag = value.Tags.find(tag => {
            return tag.id === cClass.Class.tagID;
        });
        if(classTag != null){
            $("#addFeatButton").trigger("click");
            classFeats.push(value);
        }
    }

    let classFeatCount = 0;
    $(".classFeat").each(function(){
        if($(this).is(":visible")) {
            let feat = classFeats[classFeatCount];
            classFeatCount++;

            $(this).find(".inputFeatName").val(feat.Feat.name);
            $(this).find(".inputFeatLevel").val(feat.Feat.level);
            $(this).find(".inputFeatActions").val(feat.Feat.actions);
            $(this).find(".inputFeatRarity").val(feat.Feat.rarity);
            $(this).find(".inputFeatPrereq").val(feat.Feat.prerequisites);
            $(this).find(".inputFeatReq").val(feat.Feat.requirements);
            $(this).find(".inputFeatFreq").val(feat.Feat.frequency);
            $(this).find(".inputFeatTrigger").val(feat.Feat.trigger);
            $(this).find(".inputFeatDesc").val(feat.Feat.description);
            $(this).find(".inputFeatSpecial").val(feat.Feat.special);
            let checkBoxState = (feat.Feat.canSelectMultiple == 1) ? true : false;
            $(this).find(".inputFeatSelectMultiple").prop('checked', checkBoxState);
            $(this).find(".inputFeatCode").val(feat.Feat.code);

            for(let featTag of feat.Tags){
                if(featTag.id != cClass.Class.tagID) {
                    $(this).find(".inputFeatTags").find('option[value='+featTag.id+']').attr('selected','selected');
                }
            }

            // Minimize Feat
            $(this).find(".card-header").trigger("click");
            // Trigger Feat Name and Tags
            $(this).find(".inputFeatName").trigger("change");
            $(this).find(".inputFeatTags").trigger("change");
        }
    });


    $("#updateButton").click(function(){
        $(this).unbind();
        finishClass(true);
    });

});