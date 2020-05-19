
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
        displayCurrentClass(g_class, true);
    } else {
        finishLoadingPage();
    }

});

function displayCurrentClass(classStruct, saving) {

    let abilityMap = objToMap(choiceStruct.AbilityObject);

    if(classStruct.Class.isArchived == 1){
        $('#isArchivedMessage').removeClass('is-hidden');
    } else {
        $('#isArchivedMessage').addClass('is-hidden');
    }

    let classDescription = $('#classDescription');
    classDescription.html('<p>'+classStruct.Class.description+'</p>');

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Key Ability ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    let keyAbility = $('#keyAbility');
    keyAbility.html('');
    
    if(classStruct.Class.keyAbility.includes(' or ')) {

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
                        "Type-Class_Level-1_Code-OtherKeyAbility",
                        [{ Ability : shortenAbilityType(abilityName), Bonus : "Boost" }]);
            } else {
                $('.'+keyAbilityControlShellClass).addClass("is-info");
                socket.emit("requestAbilityBonusChange",
                        getCharIDFromURL(),
                        "Type-Class_Level-1_Code-OtherKeyAbility",
                        null);
            }
        });

        let keyAbilityChoice = choiceStruct.BonusObject["Type-Class_Level-1_Code-OtherKeyAbility"];
        if(keyAbilityChoice != null && keyAbilityChoice[0] != null){
            keyAbilitySelect.val(lengthenAbilityType(keyAbilityChoice[0].Ability));
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
            "Type-Class_Level-1_Code-OtherKeyAbility",
            [{ Ability : shortenAbilityType(classStruct.Class.keyAbility), Bonus : "Boost" }]);
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

    let tSkillsArray = classStruct.Class.tSkills.split(', ');
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
                if(skillName != "chooseDefault"){
                    $('.'+tSkillControlShellClass).removeClass("is-info");
                    socket.emit("requestProficiencyChange",
                        getCharIDFromURL(),
                        {srcID : "Type-Class_Level-1_Code-Other"+tSkillID, isSkill : true},
                        [{ For : "Skill", To : skillName, Prof : 'T' }]);
                } else {
                    $('.'+tSkillControlShellClass).addClass("is-info");
                    socket.emit("requestProficiencyChange",
                        getCharIDFromURL(),
                        {srcID : "Type-Class_Level-1_Code-Other"+tSkillID, isSkill : true},
                        null);
                }
            });

            let tSkillChoice = choiceStruct.ProficiencyObject["Type-Class_Level-1_Code-Other"+tSkillID];
            if(tSkillChoice != null && tSkillChoice[0] != null){
                tSkillSelect.val(tSkillChoice[0].To);
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

    profSkillsLIAddTrained.append('Trained in <a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="You will get to select training in an additional number of skills equal to '+classStruct.Class.tSkillsMore+' plus your Intelligence modifer in the Finalize step">'+classStruct.Class.tSkillsMore+'*</a> more skills');


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

    if(saving){
        socket.emit("requestProficiencyChange",
            getCharIDFromURL(),
            {srcID : 'Type-Class_Level-1_Code-None', isSkill : false},
            savingProfArray);
    }


    let classAbilities = $('#classAbilities');
    classAbilities.html('');

    for(const classAbility of classStruct.Abilities) {

        if(classAbility.selectType != 'SELECT_OPTION' && classAbility.level <= choiceStruct.Level) {

                    // accordions now contains an array of all Accordion instances
                    var accordions = bulmaAccordion.attach();

            let classAbilityID = "classAbility"+classAbility.id;
            let classAbilityHeaderID = "classAbilityHeader"+classAbility.id;
            let classAbilityContentID = "classAbilityContent"+classAbility.id;
            let classAbilityCodeID = "classAbilityCode"+classAbility.id;

            
            classAbilities.append('<section class="accordions"><article id="'+classAbilityID+'" class="accordion classAbility"></article></section>');

            let classAbilityInnerCard = $('#'+classAbilityID);
            classAbilityInnerCard.append('<div id="'+classAbilityHeaderID+'" class="accordion-header toggle"><p class="is-size-4 has-text-weight-semibold">'+classAbility.name+'</p><span class="has-text-weight-bold">'+abilityLevelDisplay(classAbility.level)+'</span></div>');

            classAbilityInnerCard.append('<div class="accordion-body"><div id="'+classAbilityContentID+'" class="accordion-content"></div></div>');


            let classAbilityContent = $('#'+classAbilityContentID);
            let abilityDescription = processText(classAbility.description, false);
            classAbilityContent.append('<div class="container px-5" id="classAbility'+classAbility.id+'"><div>'+abilityDescription+'</div></div>');

            classAbilityContent.append('<div class="columns is-centered"><div id="'+classAbilityCodeID+'" class="column is-8"></div></div>');

            if(classAbility.selectType === 'SELECTOR') {

                let selectorID = 'classAbilSelection'+classAbility.id;
                let descriptionID = 'classAbilSelection'+classAbility.id+'Description';
                let abilityCodeID = 'classAbilSelection'+classAbility.id+'Code';

                let classAbilitySelectorInnerHTML = '';

                classAbilitySelectorInnerHTML += '<div class="field"><div class="select">';
                classAbilitySelectorInnerHTML += '<select id="'+selectorID+'" class="classAbilSelection" name="'+classAbility.id+'">';

                classAbilitySelectorInnerHTML += '<option value="chooseDefault">Choose a '+classAbility.name+'</option>';
                classAbilitySelectorInnerHTML += '<hr class="dropdown-divider"></hr>';

                for(const classSelectionOption of classStruct.Abilities) {
                    if(classSelectionOption.selectType === 'SELECT_OPTION' && classSelectionOption.selectOptionFor === classAbility.id) {

                        let selectOptionAbilityID = abilityMap.get(classAbility.id+"");
                        if(selectOptionAbilityID == classSelectionOption.id) {
                            classAbilitySelectorInnerHTML += '<option value="'+classSelectionOption.id+'" selected>'+classSelectionOption.name+'</option>';
                        } else {
                            classAbilitySelectorInnerHTML += '<option value="'+classSelectionOption.id+'">'+classSelectionOption.name+'</option>';
                        }

                    }
                }

                classAbilitySelectorInnerHTML += '</select>';
                classAbilitySelectorInnerHTML += '</div></div>';

                classAbilitySelectorInnerHTML += '<div class="columns is-centered"><div class="column is-8"><article class="message is-info"><div class="message-body"><div id="'+descriptionID+'"></div><div id="'+abilityCodeID+'"></div></div></article></div></div>';

                classAbilityContent.append(classAbilitySelectorInnerHTML);

            }

                    // accordions now contains an array of all Accordion instances
                    var accordions2 = bulmaAccordion.attach();



        }

    }


    let abilSelectors = $('.classAbilSelection');
    for(const abilSelector of abilSelectors){

        $(abilSelector).change(function(event, triggerSave){

            let descriptionID = $(this).attr('id')+'Description';
            let abilityCodeID = $(this).attr('id')+'Code';

            if($(this).val() == "chooseDefault"){
                // Display nothing
                $('#'+descriptionID).html('');
            } else {
                
                let classAbilityID = $(this).attr('name');
                let classAbility = classStruct.Abilities.find(classAbility => {
                    return classAbility.id == classAbilityID;
                });

                let chosenAbilityID = $(this).val();
                let chosenClassAbility = classStruct.Abilities.find(classAbility => {
                    return classAbility.id == chosenAbilityID;
                });

                $('#'+descriptionID).html(processText(chosenClassAbility.description, false));

                // Save feats
                if(triggerSave == null || triggerSave) {

                    socket.emit("requestSelectAbilityChange",
                        getCharIDFromURL(),
                        'Type-Class_Level-'+classAbility.level+'_Code-Processor'+abilityCodeID,
                        [{ SelectorAbility : classAbilityID, SelectOptionAbility : chosenAbilityID }]);

                }

                let srcID = 'Type-ClassAbility_Level-'+chosenClassAbility.level+'_Code-Processor'+abilityCodeID;
                processClear(srcID);
                processCode(
                    chosenClassAbility.code,
                    srcID,
                    abilityCodeID);
                
            }

        });

    }

    $('.classAbilSelection').trigger("change", [false]);



    processCode_ClassAbilities(classStruct.Abilities);

}

socket.on("returnSelectAbilityChange", function(){
    console.log("Got here from the select abil change");
});

function finishLoadingPage() {
    // Turn off page loading
    $('.pageloader').addClass("fadeout");
}