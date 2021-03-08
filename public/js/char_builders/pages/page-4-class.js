/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_class = null;

// ~~~~~~~~~~~~~~ // Processings // ~~~~~~~~~~~~~~ //

function loadClassPage(classObject) {

    let classMap = objToMap(classObject);
    classMap = new Map([...classMap.entries()].sort(
        function(a, b) {
            return a[1].Class.name > b[1].Class.name ? 1 : -1;
        })
    );

    // Populate Class Selector
    let selectClass = $('#selectClass');
    selectClass.append('<option value="chooseDefault" name="chooseDefault">Choose a Class</option>');
    selectClass.append('<optgroup label="──────────"></optgroup>');
    for(const [key, value] of classMap.entries()){
        if(value.Class.id == g_char_classID){
            if(value.Class.isArchived == 0){
                selectClass.append('<option value="'+value.Class.id+'" selected>'+value.Class.name+'</option>');
            } else {
                selectClass.append('<option value="'+value.Class.id+'" selected>'+value.Class.name+' (archived)</option>');
            }
        } else if(value.Class.isArchived == 0){
            selectClass.append('<option value="'+value.Class.id+'">'+value.Class.name+'</option>');
        }
    }


    // Class Selection //
    $('#selectClass').change(function(event, triggerSave) {
        let classID = $("#selectClass option:selected").val();
        if(classID != "chooseDefault"){
            $('.class-content').removeClass("is-hidden");
            $('#selectClassControlShell').removeClass("is-info");

            if(triggerSave == null || triggerSave) {
                $('#selectClassControlShell').addClass("is-loading");

                g_char_classID = classID;
                g_class = classMap.get(classID);
                socket.emit("requestClassChange",
                    getCharIDFromURL(),
                    classID);
                
            } else {
                displayCurrentClass(classMap.get(classID), false);
            }

        } else {
            $('.class-content').addClass("is-hidden");
            $('#selectClassControlShell').addClass("is-info");

            // Delete class, set to null
            g_char_classID = null;
            g_class = null;
            socket.emit("requestClassChange",
                getCharIDFromURL(),
                null);
        }

    });
 
    $('#selectClass').trigger("change", [false]);
    finishLoadingPage();

}

socket.on("returnClassChange", function(inChoiceStruct){
    $('#selectClassControlShell').removeClass("is-loading");

    if(g_class != null){
        injectWSCChoiceStruct(inChoiceStruct);
        updateSkillMap(true);
        displayCurrentClass(g_class, true);
    } else {
        finishLoadingPage();
    }

});

function displayCurrentClass(classStruct, saving) {
    g_class = null;
    $('#selectClass').blur();

    // Add support for Free Archetype Variant if enabled...
    if(wscChoiceStruct.Character.variantFreeArchetype == 1){
      classStruct = addFreeArchetypeVariant(classStruct);
    }

    // Add support for Auto Bonus Progression Variant if enabled...
    if(wscChoiceStruct.Character.variantAutoBonusProgression == 1){
      classStruct = addAutoBonusProgressionVariant(classStruct);
    }

    let choiceArray = wscChoiceStruct.ChoiceArray;

    if(classStruct.Class.isArchived == 1){
        $('#isArchivedMessage').removeClass('is-hidden');
    } else {
        $('#isArchivedMessage').addClass('is-hidden');
    }

    let classDescription = $('#classDescription');
    classDescription.html(processText(classStruct.Class.description, false, null, 'MEDIUM', false));

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Key Ability ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    let keyAbility = $('#keyAbility');
    keyAbility.html('');
    
    if(classStruct.Class.keyAbility == 'OTHER'){

        keyAbility.append('<p class="is-size-5">Other</p>');

    } else if(classStruct.Class.keyAbility.includes(' or ')) {

        let keyAbilitySelectID = 'keyAbilitySelect';
        let keyAbilityControlShellClass = 'keyAbilityControlShell';
        let keyAbilityOptionArray = classStruct.Class.keyAbility.split(' or ');
        keyAbility.append('<div class="select '+keyAbilityControlShellClass+'"><select id="'+keyAbilitySelectID+'"></select></div>');

        let keyAbilitySelect = $('#'+keyAbilitySelectID);
        keyAbilitySelect.append('<option value="chooseDefault">Choose an Ability</option>');
        keyAbilitySelect.append('<optgroup label="──────────"></optgroup>');

        keyAbilitySelect.append('<option value="'+keyAbilityOptionArray[0]+'">'+keyAbilityOptionArray[0]+'</option>');
        keyAbilitySelect.append('<option value="'+keyAbilityOptionArray[1]+'">'+keyAbilityOptionArray[1]+'</option>');

        $('#'+keyAbilitySelectID).change(function() {
            let abilityName = $(this).val();
            if(abilityName != "chooseDefault"){
                $('.'+keyAbilityControlShellClass).removeClass("is-info");
                socket.emit("requestAbilityBonusChange",
                    getCharIDFromURL(),
                    {sourceType: 'class', sourceLevel: 1, sourceCode: 'keyAbility', sourceCodeSNum: 'a'},
                    {Ability : shortenAbilityType(abilityName), Bonus : "Boost"});
            } else {
                $('.'+keyAbilityControlShellClass).addClass("is-info");
                socket.emit("requestAbilityBonusChange",
                    getCharIDFromURL(),
                    {sourceType: 'class', sourceLevel: 1, sourceCode: 'keyAbility', sourceCodeSNum: 'a'},
                    null);
            }
            $(this).blur();
        });

        let keyAbilitySrcStruct = {
            sourceType: 'class',
            sourceLevel: 1,
            sourceCode: 'keyAbility',
            sourceCodeSNum: 'a'
        };
        let bonusArray = wscChoiceStruct.BonusArray;
        let keyAbilityChoice = bonusArray.find(bonus => {
            return hasSameSrc(bonus, keyAbilitySrcStruct);
        });
        if(keyAbilityChoice != null){
            keyAbilitySelect.val(lengthenAbilityType(keyAbilityChoice.Ability));
        }

        if(keyAbilitySelect.val() != "chooseDefault"){
            $('.'+keyAbilityControlShellClass).removeClass("is-info");
        } else {
            $('.'+keyAbilityControlShellClass).addClass("is-info");
        }

    } else {
        keyAbility.append('<p class="is-size-5">'+classStruct.Class.keyAbility+'</p>');
        socket.emit("requestAbilityBonusChange",
            getCharIDFromURL(),
            {sourceType: 'class', sourceLevel: 1, sourceCode: 'keyAbility', sourceCodeSNum: 'a'},
            {Ability : shortenAbilityType(classStruct.Class.keyAbility), Bonus : "Boost"});
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Hit Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    let hitPoints = $('#hitPoints');
    hitPoints.html('');
    hitPoints.append('<p class="is-inline is-size-5">'+classStruct.Class.hitPoints+'</p>');



    let savingProfArray = [];

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Perception ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    let profPerception = $('#profPerception');
    profPerception.html('');
    profPerception.append('<ul id="profPerceptionUL"></ul>');

    let profPerceptionUL = $('#profPerceptionUL');
    profPerceptionUL.append('<li id="profPerceptionLI"></li>');

    let profPerceptionLI = $('#profPerceptionLI');
    profPerceptionLI.append(profToWord(classStruct.Class.tPerception));

    savingProfArray.push({ For : "Perception", To : "Perception", Prof : classStruct.Class.tPerception });

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Skills ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    $('#profSkillsCode').html('');
    let profSkills = $('#profSkills');
    profSkills.html('');
    profSkills.append('<ul id="profSkillsUL"></ul>');
    
    let profSkillsUL = $('#profSkillsUL');

    let tSkillsArray;
    if(classStruct.Class.tSkills != null){
        tSkillsArray = classStruct.Class.tSkills.split(', ');
    } else {
        tSkillsArray = [];
    }
    for(const tSkill of tSkillsArray){

        let tSkillID = tSkill.replace(/ /g,'_');
        profSkillsUL.append('<li id="profSkillsLI'+tSkillID+'"></li>');
        let profSkillsLI = $('#profSkillsLI'+tSkillID);

        if(tSkill.includes(' or ')){

            let tSkillControlShellClass = tSkillID+'ControlShell';
            let tSkillsOptionArray = tSkill.split(' or ');
            profSkillsLI.append('Trained in <div class="select is-small '+tSkillControlShellClass+'"><select id="'+tSkillID+'"></select></div>');

            let tSkillSelect = $('#'+tSkillID);

            tSkillSelect.append('<option value="chooseDefault">Choose a Skill</option>');
            tSkillSelect.append('<optgroup label="──────────"></optgroup>');

            tSkillSelect.append('<option value="'+tSkillsOptionArray[0]+'">'+tSkillsOptionArray[0]+'</option>');
            tSkillSelect.append('<option value="'+tSkillsOptionArray[1]+'">'+tSkillsOptionArray[1]+'</option>');

            $('#'+tSkillID).change(function() {
                let skillName = $(this).val();

                let srcStruct = {
                    sourceType: 'class',
                    sourceLevel: 1,
                    sourceCode: 'inits-misc-'+tSkillID,
                    sourceCodeSNum: 'a',
                };

                if(skillName != "chooseDefault"){
                    $('.'+tSkillControlShellClass).removeClass("is-info");
                    processCode(
                        'GIVE-PROF-IN='+skillName+':T',
                        srcStruct,
                        'profSkillsCode',
                        'Initial Class');
                } else {
                    $('.'+tSkillControlShellClass).addClass("is-info");
                    socket.emit("requestProficiencyChange",
                        getCharIDFromURL(),
                        {srcStruct, isSkill : true},
                        null);
                }
                $(this).blur();
            });

            let tSkillSrcStruct = {
                sourceType: 'class',
                sourceLevel: 1,
                sourceCode: 'inits-misc-'+tSkillID,
                sourceCodeSNum: 'aa',
            };
            let profArray = wscChoiceStruct.ProfArray;
            let tSkillChoice = profArray.find(bonus => {
                return hasSameSrc(bonus, tSkillSrcStruct);
            });
            if(tSkillChoice != null){
                tSkillSelect.val(tSkillChoice.To);
            }

            if(tSkillSelect.val() != "chooseDefault"){
                $('.'+tSkillControlShellClass).removeClass("is-info");
            } else {
                $('.'+tSkillControlShellClass).addClass("is-info");
            }

        } else {

            profSkillsLI.append("Trained in "+tSkill);
            savingProfArray.push({ For : "Skill", To : tSkillID, Prof : 'T' });

        }

    }

    profSkillsUL.append('<li id="profSkillsLIAdditionalTrained"></li>');
    let profSkillsLIAddTrained = $('#profSkillsLIAdditionalTrained');

    profSkillsLIAddTrained.append('Trained in <a class="has-text-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="You will get to select training in an additional number of skills equal to '+classStruct.Class.tSkillsMore+' plus your Intelligence modifer in the Finalize step">'+classStruct.Class.tSkillsMore+'*</a> more skills');


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Saving Throws ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    let profSavingThrows = $('#profSavingThrows');
    profSavingThrows.html('');
    profSavingThrows.append('<ul id="profSavingThrowsUL"></ul>');

    let profSavingThrowsUL = $('#profSavingThrowsUL');
    profSavingThrowsUL.append('<li id="profSavingThrowsLIFort"></li>');
    profSavingThrowsUL.append('<li id="profSavingThrowsLIReflex"></li>');
    profSavingThrowsUL.append('<li id="profSavingThrowsLIWill"></li>');

    let profSavingThrowsLIFort = $('#profSavingThrowsLIFort');
    profSavingThrowsLIFort.append(profToWord(classStruct.Class.tFortitude)+" in Fortitude");

    let profSavingThrowsLIReflex = $('#profSavingThrowsLIReflex');
    profSavingThrowsLIReflex.append(profToWord(classStruct.Class.tReflex)+" in Reflex");

    let profSavingThrowsLIWill = $('#profSavingThrowsLIWill');
    profSavingThrowsLIWill.append(profToWord(classStruct.Class.tWill)+" in Will");

    savingProfArray.push({ For : "Save", To : 'Fortitude', Prof : classStruct.Class.tFortitude });
    savingProfArray.push({ For : "Save", To : 'Reflex', Prof : classStruct.Class.tReflex });
    savingProfArray.push({ For : "Save", To : 'Will', Prof : classStruct.Class.tWill });


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Attacks ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    let profAttacks = $('#profAttacks');
    profAttacks.html('');

    profAttacks.append('<ul id="profAttacksUL"></ul>');
    let profAttacksUL = $('#profAttacksUL');


    let tWeaponsArray = [];
    if(classStruct.Class.tWeapons != null) { tWeaponsArray = classStruct.Class.tWeapons.split(',,, '); }
    for(const tWeapons of tWeaponsArray){
        
        let sections = tWeapons.split(':::');
        let weapTraining = sections[0];
        let weaponName = sections[1];

        let weapID;
        let profConvertData = g_profConversionMap.get(weaponName.replace(/_|\s+/g,'').toUpperCase());
        if(profConvertData != null){
            weapID = profConvertData.Name;
        } else {
            weapID = weaponName.replace(/\s+/g,'_').toUpperCase();
        }

        profAttacksUL.append('<li id="profAttacksLI'+weapID+'"></li>');
        let profAttacksLI = $('#profAttacksLI'+weapID);

        if(weaponName.slice(-1) === 's'){
            // is plural
            profAttacksLI.append(profToWord(weapTraining)+" in all "+weaponName);
        } else {
            // is singular
            profAttacksLI.append(profToWord(weapTraining)+" in the "+weaponName);
        }

        savingProfArray.push({ For : "Attack", To : weapID, Prof : weapTraining });

    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Defenses ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    let profDefenses = $('#profDefenses');
    profDefenses.html('');

    profDefenses.append('<ul id="profDefensesUL"></ul>');
    let profDefensesUL = $('#profDefensesUL');


    let tArmorArray = [];
    if(classStruct.Class.tArmor != null) { tArmorArray = classStruct.Class.tArmor.split(',,, '); }
    for(const tArmor of tArmorArray){

        let sections = tArmor.split(':::');
        let armorTraining = sections[0];
        let armorName = sections[1];

        let armorID;
        let profConvertData = g_profConversionMap.get(armorName.replace(/_|\s+/g,'').toUpperCase());
        if(profConvertData != null){
            armorID = profConvertData.Name;
        } else {
            armorID = armorName.replace(/\s+/g,'_').toUpperCase();
        }

        profDefensesUL.append('<li id="profDefensesLI'+armorID+'"></li>');
        let profDefensesLI = $('#profDefensesLI'+armorID);

        profDefensesLI.append(profToWord(armorTraining)+" in all "+armorName);

        savingProfArray.push({ For : "Defense", To : armorID, Prof : armorTraining });

    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Class DC ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    let profClassDC = $('#profClassDC');
    profClassDC.html('');
    profClassDC.append('<ul id="profClassDCUL"></ul>');

    let profClassDCUL = $('#profClassDCUL');
    profClassDCUL.append('<li id="profClassDCLI"></li>');

    let profClassDCLI = $('#profClassDCLI');
    profClassDCLI.append(profToWord(classStruct.Class.tClassDC));

    savingProfArray.push({ For : "Class_DC", To : "Class_DC", Prof : classStruct.Class.tClassDC });


    let savingProfCount = 0;
    for(let savingProf of savingProfArray){
        let srcStruct = {
            sourceType: 'class',
            sourceLevel: 1,
            sourceCode: 'inits-'+savingProfCount,
            sourceCodeSNum: 'a',
        };
        if(savingProf.For === 'Skill' && savingProf.Prof === 'T'){
            processCode( // Use WSC because if the character is already trained, it will give them a new skill.
                'GIVE-PROF-IN='+savingProf.To+':T',
                srcStruct,
                'profSkillsCode',
                'Initial Class');
        } else {
            savingProf.SourceName = 'Initial Class';
            socket.emit("requestProficiencyChange",
                getCharIDFromURL(),
                {srcStruct, isSkill : false},
                savingProf);
        }
        savingProfCount++;
    }


    $('#classAbilities').html('<div id="classAbilitiesTabs"></div><div id="classAbilitiesContent"></div>');

    let abilityTabsTempSet = new Set();
    let abilityNameSet = new Set();
    for(const classAbility of classStruct.Abilities) {
        if(classAbility.selectType != 'SELECT_OPTION') {
            if(abilityNameSet.has(classAbility.name)){
                abilityTabsTempSet.add(classAbility.name);
            } else {
                abilityNameSet.add(classAbility.name);
            }
        }
    }

    let abilityTabsSet = new Set();
    for(const abilName of abilityNameSet){
        if(abilityTabsTempSet.has(abilName)){
            abilityTabsSet.add(abilName);
        }
    }

    let abilityTabHTML = '<li><a id="abilityTabOther">Core Features</a></li>';
    for(const abilityTab of abilityTabsSet){
        let hashOfName = hashCode(abilityTab);
        abilityTabHTML += '<li><a id="abilityTab'+hashOfName+'">'+abilityTab+'</a></li>';
        $('#classAbilitiesContent').append('<div id="abilityContent'+hashOfName+'" class="is-hidden"></div>');
    }
    $('#classAbilitiesContent').append('<div id="abilityContentOther" class="is-hidden"></div>');

    $('#classAbilitiesTabs').html('<div class="tabs is-centered is-marginless use-custom-scrollbar"><ul class="ability-tabs">'+abilityTabHTML+'</ul></div>');

    for(const classAbility of classStruct.Abilities) {
        if(classAbility.level == -1) {continue;}

        if(classAbility.selectType != 'SELECT_OPTION' && classAbility.level <= wscChoiceStruct.Character.level) {

            let classAbilityID = "classAbility"+classAbility.id;
            let classAbilityHeaderID = "classAbilityHeader"+classAbility.id;
            let classAbilityContentID = "classAbilityContent"+classAbility.id;
            let classAbilityCodeID = "classAbilityCode"+classAbility.id;

            let tabContent = null;
            if(abilityTabsSet.has(classAbility.name)){

                let hashOfName = hashCode(classAbility.name);
                tabContent = $('#abilityContent'+hashOfName);
                tabContent.append('<div id="'+classAbilityID+'" class="classAbility pt-1"></div>');

                let classAbilitySection = $('#'+classAbilityID);
                classAbilitySection.append('<span id="'+classAbilityHeaderID+'" class="is-size-4 has-text-weight-semibold">Level '+classAbility.level+'<span class="classAbilityUnselectedOption"></span></span>');
                classAbilitySection.append('<div id="'+classAbilityContentID+'"></div>');
                classAbilitySection.append('<hr class="ability-hr">');

            } else {

                tabContent = $('#abilityContentOther');
                tabContent.append('<div id="'+classAbilityID+'" class="classAbility pt-1"></div>');

                let classAbilitySection = $('#'+classAbilityID);
                classAbilitySection.append('<span id="'+classAbilityHeaderID+'" class="is-size-4 has-text-weight-semibold">'+classAbility.name+'<sup class="is-italic pl-2 is-size-6">'+rankLevel(classAbility.level)+'</sup><span class="classAbilityUnselectedOption"></span></span>');
                classAbilitySection.append('<div id="'+classAbilityContentID+'"></div>');
                classAbilitySection.append('<hr class="ability-hr">');

            }

            let classAbilityContent = $('#'+classAbilityContentID);
            classAbilityContent.append('<div class="container ability-text-section">'+processText(classAbility.description, false, null)+'</div>');

            classAbilityContent.append('<div class="columns is-mobile is-centered is-marginless"><div id="'+classAbilityCodeID+'" class="column is-mobile is-11 is-paddingless"></div></div>');

            if(classAbility.selectType === 'SELECTOR') {

                let selectorID = 'classAbilSelection'+classAbility.id;
                let descriptionID = 'classAbilSelection'+classAbility.id+'Description';
                let abilityCodeID = 'classAbilSelection'+classAbility.id+'Code';

                let classAbilitySelectorInnerHTML = '';

                classAbilitySelectorInnerHTML += '<div class="field"><div class="select">';
                classAbilitySelectorInnerHTML += '<select id="'+selectorID+'" class="classAbilSelection" name="'+classAbility.id+'">';

                classAbilitySelectorInnerHTML += '<option value="chooseDefault">Choose a '+classAbility.name+'</option>';
                classAbilitySelectorInnerHTML += '<optgroup label="──────────"></optgroup>';

                let choice = choiceArray.find(choice => {
                    return choice.SelectorID == classAbility.id;
                });
                for(const classSelectionOption of classStruct.Abilities) {
                    if(classSelectionOption.selectType === 'SELECT_OPTION' && (classSelectionOption.selectOptionFor === classAbility.id || classSelectionOption.indivClassAbilName === classAbility.name)) {

                        if(choice != null && choice.OptionID == classSelectionOption.id) {
                            classAbilitySelectorInnerHTML += '<option value="'+classSelectionOption.id+'" selected>'+classSelectionOption.name+'</option>';
                        } else {
                            classAbilitySelectorInnerHTML += '<option value="'+classSelectionOption.id+'">'+classSelectionOption.name+'</option>';
                        }

                    }
                }

                classAbilitySelectorInnerHTML += '</select>';
                classAbilitySelectorInnerHTML += '</div></div>';

                classAbilitySelectorInnerHTML += '<div class="columns is-centered is-hidden"><div class="column is-mobile is-8"><article class="message is-info"><div class="message-body"><div id="'+descriptionID+'"></div><div id="'+abilityCodeID+'"></div></div></article></div></div>';

                classAbilityContent.append(classAbilitySelectorInnerHTML);

            }


        }

    }


    let abilSelectors = $('.classAbilSelection');
    for(const abilSelector of abilSelectors){

        $(abilSelector).change(function(event, triggerSave){

            let descriptionID = $(this).attr('id')+'Description';
            let abilityCodeID = $(this).attr('id')+'Code';
            $('#'+descriptionID).html('');
            $('#'+abilityCodeID).html('');

            let classAbilityID = $(this).attr('name');
            let classAbility = classStruct.Abilities.find(classAbility => {
                return classAbility.id == classAbilityID;
            });

            let srcStruct = {
                sourceType: 'class',
                sourceLevel: classAbility.level,
                sourceCode: 'classAbilitySelector-'+classAbilityID,
                sourceCodeSNum: 'a',
            };

            if($(this).val() == "chooseDefault"){
                $(this).parent().addClass("is-info");
                $('#'+descriptionID).parent().parent().parent().parent().addClass('is-hidden');
                
                // Save ability choice
                if(triggerSave == null || triggerSave) {
                    socket.emit("requestClassChoiceChange",
                        getCharIDFromURL(),
                        srcStruct,
                        null);
                }

            } else {
                $(this).parent().removeClass("is-info");
                $('#'+descriptionID).parent().parent().parent().parent().removeClass('is-hidden');

                let chosenAbilityID = $(this).val();
                let chosenClassAbility = classStruct.Abilities.find(classAbility => {
                    return classAbility.id == chosenAbilityID;
                });

                $('#'+descriptionID).html(processText(chosenClassAbility.description, false, null));

                // Save ability choice
                if(triggerSave == null || triggerSave) {
                    socket.emit("requestClassChoiceChange",
                        getCharIDFromURL(),
                        srcStruct,
                        { SelectorID : classAbilityID, OptionID : chosenAbilityID });
                }

                // Run ability choice code
                processCode(
                    chosenClassAbility.code,
                    srcStruct,
                    abilityCodeID,
                    chosenClassAbility.name);
                
            }
            $(this).blur();
            selectorUpdated();
        });

    }

    $('.classAbilSelection').trigger("change", [false]);

    processCode_ClassAbilities(classStruct.Abilities);


    
    for(let abilityTab of $('.ability-tabs a')){
        let tabNameHash = $(abilityTab).attr('id').replace('abilityTab', '');
        if($('#abilityContent'+tabNameHash).html() == ''){
            $(abilityTab).parent().addClass('is-hidden');
        } else {
            $(abilityTab).parent().removeClass('is-hidden');
        }
    }

    $('.ability-tabs a').click(function(){
        $('#classAbilitiesContent > div').addClass('is-hidden');
        $('.ability-tabs > li').removeClass("is-active");

        let tabNameHash = $(this).attr('id').replace('abilityTab', '');
        $('#abilityContent'+tabNameHash).removeClass('is-hidden');
        $('#abilityTab'+tabNameHash).parent().addClass("is-active");
    });

    $('.ability-tabs a:first').click();

}

socket.on("returnClassChoiceChange", function(srcStruct, selectorID, optionID){
    
    let choiceArray = wscChoiceStruct.ChoiceArray;

    let foundChoiceData = false;
    for(let choiceData of choiceArray){
        if(hasSameSrc(choiceData, srcStruct)){
            foundChoiceData = true;
            if(selectorID != null && optionID != null){
                choiceData.value = selectorID+':::'+optionID;
                choiceData.SelectorID = selectorID;
                choiceData.OptionID = optionID;
            } else {
                choiceData.value = null;
                choiceData.SelectorID = null;
                choiceData.OptionID = null;
            }
            break;
        }
    }

    if(!foundChoiceData && selectorID != null && optionID != null){
        let choiceData = cloneObj(srcStruct);
        choiceData.value = selectorID+':::'+optionID;
        choiceData.SelectorID = selectorID;
        choiceData.OptionID = optionID;
        choiceArray.push(choiceData);
    }

    wscChoiceStruct.ChoiceArray = choiceArray;
    updateExpressionProcessor({
        ChoiceStruct : wscChoiceStruct,
    });

});

function selectorUpdated() {

    $('.classAbility').each(function() {
        if($(this).find('.select.is-info').length !== 0 || $(this).find('.feat-selection.is-default').length !== 0){
            $(this).find('.classAbilityUnselectedOption').html('<span class="icon is-small has-text-info pl-3"><i class="fas fa-xs fa-circle"></i></span>');
        } else {
            $(this).find('.classAbilityUnselectedOption').html('');
        }

        // Make sure everything is centered
        //$(this).find('.has-text-left').removeClass('has-text-left');
        
    });
    
}