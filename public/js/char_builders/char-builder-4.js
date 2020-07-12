
let socket = io();

let choiceStruct = null;
let g_class = null;

// ~~~~~~~~~~~~~~ // General - Run On Load // ~~~~~~~~~~~~~~ //
$(function () {

    // Change page
    $("#nextButton").click(function(){
        nextPage();
    });
    
    $("#prevButton").click(function(){
        prevPage();
    });

    // On load get class details
    socket.emit("requestClassDetails",
        getCharIDFromURL());

});


// ~~~~~~~~~~~~~~ // Change Page // ~~~~~~~~~~~~~~ //

function nextPage() {
    // Hardcoded redirect
    window.location.href = window.location.href.replace("page4", "page5");
}

function prevPage() {
    // Hardcoded redirect
    window.location.href = window.location.href.replace("page4", "page3");
}

// ~~~~~~~~~~~~~~ // Reload Page // ~~~~~~~~~~~~~~ //

function reloadPage(){

    $('#char-builder').find("*").off();
    socket.emit("requestClassDetails",
        getCharIDFromURL());

}


// ~~~~~~~~~~~~~~ // Process Class Info // ~~~~~~~~~~~~~~ //

socket.on("returnClassDetails", function(classObject, inChoiceStruct){

    choiceStruct = inChoiceStruct;
    let classMap = objToMap(classObject);
    classMap = new Map([...classMap.entries()].sort(
        function(a, b) {
            return a[1].Class.name > b[1].Class.name ? 1 : -1;
        })
    );

    // Populate Class Selector
    let selectClass = $('#selectClass');
    selectClass.append('<option value="chooseDefault" name="chooseDefault">Choose a Class</option>');
    selectClass.append('<hr class="dropdown-divider"></hr>');
    for(const [key, value] of classMap.entries()){
        let currentClassID = $('#selectClass').attr('name');
        if(value.Class.id == currentClassID){
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

                g_class = classMap.get(classID);
                socket.emit("requestClassChange",
                    getCharIDFromURL(),
                    classID);
                
            } else {
                injectWSCChoiceStruct(choiceStruct);
                displayCurrentClass(classMap.get(classID), false);
            }

        } else {
            $('.class-content').addClass("is-hidden");
            $('#selectClassControlShell').addClass("is-info");

            // Delete class, set to null
            g_class = null;
            socket.emit("requestClassChange",
                getCharIDFromURL(),
                null);
        }

    });
 
    $('#selectClass').trigger("change", [false]);

});

socket.on("returnClassChange", function(inChoiceStruct){
    $('#selectClassControlShell').removeClass("is-loading");
    choiceStruct = inChoiceStruct;

    if(g_class != null){
        injectWSCChoiceStruct(choiceStruct);
        displayCurrentClass(g_class, true);
    } else {
        finishLoadingPage();
    }

});

function displayCurrentClass(classStruct, saving) {
    g_class = null;
    $('#selectClass').blur();

    let choiceArray = choiceStruct.ChoiceArray;

    if(classStruct.Class.isArchived == 1){
        $('#isArchivedMessage').removeClass('is-hidden');
    } else {
        $('#isArchivedMessage').addClass('is-hidden');
    }

    let classDescription = $('#classDescription');
    classDescription.html(processText(classStruct.Class.description, false));

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
        keyAbilitySelect.append('<hr class="dropdown-divider"></hr>');

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
        let bonusArray = choiceStruct.BonusArray;
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
    profPerceptionLI.append(profToWord(classStruct.Class.tPerception)+" in Perception");

    savingProfArray.push({ For : "Perception", To : "Perception", Prof : classStruct.Class.tPerception });

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Skills ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
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
            tSkillSelect.append('<hr class="dropdown-divider"></hr>');

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
                    socket.emit("requestProficiencyChange",
                        getCharIDFromURL(),
                        {srcStruct, isSkill : true},
                        { For : "Skill", To : skillName, Prof : 'T' });
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
                sourceCodeSNum: 'a',
            };
            let profArray = choiceStruct.ProfArray;
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


    let tWeaponsArray = classStruct.Class.tWeapons.split(',,, ');
    for(const tWeapons of tWeaponsArray){
        
        let sections = tWeapons.split(':::');
        let weapTraining = sections[0];
        let weaponName = sections[1];
        let weapID = weaponName.replace(/ /g,'_');

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


    let tArmorArray = classStruct.Class.tArmor.split(',,, ');
    for(const tArmor of tArmorArray){

        let sections = tArmor.split(':::');
        let armorTraining = sections[0];
        let armorName = sections[1];
        let armorID = armorName.replace(/ /g,'_');

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


    if(saving){
        let savingProfCount = 0;
        for(let savingProf of savingProfArray){
            let srcStruct = {
                sourceType: 'class',
                sourceLevel: 1,
                sourceCode: 'inits-'+savingProfCount,
                sourceCodeSNum: 'a',
            };
            socket.emit("requestProficiencyChange",
                getCharIDFromURL(),
                {srcStruct, isSkill : false},
                savingProf);
            savingProfCount++;
        }
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

    let abilityTabHTML = '';
    for(const abilityTab of abilityTabsSet){
        let hashOfName = hashCode(abilityTab);
        abilityTabHTML += '<li><a id="abilityTab'+hashOfName+'">'+abilityTab+'</a></li>';
        $('#classAbilitiesContent').append('<div id="abilityContent'+hashOfName+'" class="is-hidden"></div>');
    }
    abilityTabHTML += '<li><a id="abilityTabOther">Extra Features</a></li>';
    $('#classAbilitiesContent').append('<div id="abilityContentOther" class="is-hidden"></div>');

    $('#classAbilitiesTabs').html('<div class="tabs is-centered is-marginless"><ul class="ability-tabs">'+abilityTabHTML+'</ul></div>');

    for(const classAbility of classStruct.Abilities) {

        if(classAbility.selectType != 'SELECT_OPTION' && classAbility.level <= choiceStruct.Level) {

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
                classAbilitySection.append('<span id="'+classAbilityHeaderID+'" class="is-size-4 has-text-weight-semibold">'+classAbility.name+'<sup class="is-italic pl-2 is-size-6">'+abilityLevelDisplay(classAbility.level)+'</sup><span class="classAbilityUnselectedOption"></span></span>');
                classAbilitySection.append('<div id="'+classAbilityContentID+'"></div>');
                classAbilitySection.append('<hr class="ability-hr">');

            }

            let classAbilityContent = $('#'+classAbilityContentID);
            let abilityDescription = processText(classAbility.description, false);
            classAbilityContent.append('<div class="container px-5" id="classAbility'+classAbility.id+'"><div class="mx-5">'+abilityDescription+'</div></div>');

            classAbilityContent.append('<div class="columns is-mobile is-centered is-marginless"><div id="'+classAbilityCodeID+'" class="column is-mobile is-11 is-paddingless"></div></div>');

            if(classAbility.selectType === 'SELECTOR') {

                let selectorID = 'classAbilSelection'+classAbility.id;
                let descriptionID = 'classAbilSelection'+classAbility.id+'Description';
                let abilityCodeID = 'classAbilSelection'+classAbility.id+'Code';

                let classAbilitySelectorInnerHTML = '';

                classAbilitySelectorInnerHTML += '<div class="field"><div class="select">';
                classAbilitySelectorInnerHTML += '<select id="'+selectorID+'" class="classAbilSelection" name="'+classAbility.id+'">';

                classAbilitySelectorInnerHTML += '<option value="chooseDefault">Choose a '+classAbility.name+'</option>';
                classAbilitySelectorInnerHTML += '<hr class="dropdown-divider"></hr>';

                let choice = choiceArray.find(choice => {
                    return choice.SelectorID == classAbility.id;
                });
                for(const classSelectionOption of classStruct.Abilities) {
                    if(classSelectionOption.selectType === 'SELECT_OPTION' && classSelectionOption.selectOptionFor === classAbility.id) {

                        if(choice != null && choice.OptionID == classSelectionOption.id) {
                            classAbilitySelectorInnerHTML += '<option value="'+classSelectionOption.id+'" selected>'+classSelectionOption.name+'</option>';
                        } else {
                            classAbilitySelectorInnerHTML += '<option value="'+classSelectionOption.id+'">'+classSelectionOption.name+'</option>';
                        }

                    }
                }

                classAbilitySelectorInnerHTML += '</select>';
                classAbilitySelectorInnerHTML += '</div></div>';

                classAbilitySelectorInnerHTML += '<div class="columns is-centered"><div class="column is-mobile is-11"><article class="message is-info"><div class="message-body"><div id="'+descriptionID+'"></div><div id="'+abilityCodeID+'"></div></div></article></div></div>';

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
                
                // Save ability choice
                if(triggerSave == null || triggerSave) {
                    socket.emit("requestClassChoiceChange",
                        getCharIDFromURL(),
                        srcStruct,
                        null);
                }

            } else {
                $(this).parent().removeClass("is-info");

                let chosenAbilityID = $(this).val();
                let chosenClassAbility = classStruct.Abilities.find(classAbility => {
                    return classAbility.id == chosenAbilityID;
                });

                $('#'+descriptionID).html(processText(chosenClassAbility.description, false));

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
                    abilityCodeID);
                
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

socket.on("returnClassChoiceChange", function(){
    
});

function finishLoadingPage() {
    // Turn off page loading
    $('.pageloader').addClass("fadeout");
}

function selectorUpdated() {

    $('.classAbility').each(function() {
        if($(this).find('.select.is-info').length !== 0){
            $(this).find('.classAbilityUnselectedOption').html('<span class="icon is-small has-text-info pl-3"><i class="fas fa-xs fa-circle"></i></span>');
        } else {
            $(this).find('.classAbilityUnselectedOption').html('');
        }
    });
    
}