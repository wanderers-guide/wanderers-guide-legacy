
let socket = io();

let g_character = null;
let g_class = null;
let g_ancestry = null;
let g_heritage = null;
let g_charTagsArray = null;

let g_itemMap = null;
let g_invStruct = null;
let g_bulkAndCoinsStruct = null;
let g_openBagsSet = new Set();

let g_conditionsMap = null;
let g_allConditions = null;

let g_profMap = null;
let g_weaponProfMap = null;
let g_armorProfMap = null;

let g_equippedArmorInvItemID = null;
let g_equippedShieldInvItemID = null;

let g_abilMap = null;
let g_skillMap = null;
let g_langMap = null;

let g_featMap = null;
let g_featChoiceMap = null;

let g_inventoryTabScroll = null;
let g_selectedTabID = 'inventoryTab';



// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    // Remove Footer //
    $('#apeiron-footer').addClass('is-hidden');
    $('#main-container').addClass('is-paddingless');

    socket.emit("requestCharacterSheetInfo",
        getCharIDFromURL());

});


socket.on("returnCharacterSheetInfo", function(charInfo){

    g_itemMap = objToMap(charInfo.ItemObject);
    g_invStruct = charInfo.InvStruct;

    g_equippedArmorInvItemID = g_invStruct.Inventory.equippedArmorInvItemID;
    g_equippedShieldInvItemID = g_invStruct.Inventory.equippedShieldInvItemID;

    g_character = charInfo.Character;

    g_conditionsMap = objToMap(charInfo.ConditionsObject);
    g_allConditions = charInfo.AllConditions;

    g_abilMap = objToMap(charInfo.AbilObject);
    g_skillMap = objToMap(charInfo.SkillObject);
    g_langMap = objToMap(charInfo.ChoicesStruct.LangObject);

    g_profMap = objToMap(charInfo.ProfObject);
    g_weaponProfMap = objToMap(charInfo.WeaponProfObject);
    g_armorProfMap = objToMap(charInfo.ArmorProfObject);

    g_featMap = objToMap(charInfo.FeatObject);
    g_featChoiceMap = objToMap(charInfo.ChoicesStruct.FeatObject);

    g_charTagsArray = charInfo.ChoicesStruct.CharTagsArray;
    g_class = charInfo.ChoicesStruct.Class;
    g_ancestry = charInfo.Ancestry;
    g_heritage = charInfo.Heritage;

    loadCharSheet();

    // Turn off page loading
    $('.pageloader').addClass("fadeout");

});

function loadCharSheet(){

    console.log('~ LOADING CHAR SHEET ~');

    // Saving Scroll States //
    g_inventoryTabScroll = $('#inventoryContent').scrollTop();

    // Unbind All jQuery Events //
    $('#character-sheet-section').find("*").off();

    // Init Stats (set to new Map) //
    initStats();

    // Reset Conditions Map (sets all temp data to inactive) //
    resetConditionsMap();

    // ~~~~~~~~~~~~~~~~~~~~~~~ Adding Stats To Map ~~~~~~~~~~~~~~~~~~~~~~~ //

    addStat('SPEED', 'BASE', g_ancestry.speed);

    addStat('MAX_HEALTH', 'ANCESTRY', g_ancestry.hitPoints);
    addStat('MAX_HEALTH_BONUS_PER_LEVEL', 'MODIFIER', 'CON');

    addStat('SCORE_STR', 'BASE', g_abilMap.get("STR"));
    addStat('SCORE_DEX', 'BASE', g_abilMap.get("DEX"));
    addStat('SCORE_CON', 'BASE', g_abilMap.get("CON"));
    addStat('SCORE_INT', 'BASE', g_abilMap.get("INT"));
    addStat('SCORE_WIS', 'BASE', g_abilMap.get("WIS"));
    addStat('SCORE_CHA', 'BASE', g_abilMap.get("CHA"));

    let fortData = g_profMap.get("Fortitude");
    addStat('SAVE_FORT', 'PROF_BONUS', fortData.NumUps);
    addStat('SAVE_FORT', 'USER_BONUS', fortData.Bonus);
    addStat('SAVE_FORT', 'MODIFIER', 'CON');
    
    let reflexData = g_profMap.get("Reflex");
    addStat('SAVE_REFLEX', 'PROF_BONUS', reflexData.NumUps);
    addStat('SAVE_REFLEX', 'USER_BONUS', reflexData.Bonus);
    addStat('SAVE_REFLEX', 'MODIFIER', 'DEX');

    let willData = g_profMap.get("Will");
    addStat('SAVE_WILL', 'PROF_BONUS', willData.NumUps);
    addStat('SAVE_WILL', 'USER_BONUS', willData.Bonus);
    addStat('SAVE_WILL', 'MODIFIER', 'WIS');

    for(const [skillName, skillData] of g_skillMap.entries()){
        addStat('SKILL_'+skillName, 'PROF_BONUS', skillData.NumUps);
        addStat('SKILL_'+skillName, 'USER_BONUS', skillData.Bonus);
        addStat('SKILL_'+skillName, 'MODIFIER', skillData.Skill.ability);
    }

    let perceptionData = g_profMap.get("Perception");
    addStat('PERCEPTION', 'PROF_BONUS', perceptionData.NumUps);
    addStat('PERCEPTION', 'USER_BONUS', perceptionData.Bonus);
    addStat('PERCEPTION', 'MODIFIER', 'WIS');

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    // Apply Items Code //

    // Apply Feats Code //

    // Display Ability Scores //
    displayAbilityScores();

    // Determine Bulk and Coins //
    determineBulkAndCoins(g_invStruct.InvItems, g_itemMap, getMod(getStatTotal('SCORE_STR')));

    // Get STR score before conditions code runs (in the case of Enfeebled)
    let strScore = getStatTotal('SCORE_STR');

    // Run Init Condition Code //
    runAllConditionsCode();

    // Determine Armor //
    determineArmor(getMod(getStatTotal('SCORE_DEX')), strScore);

    // Display Conditions List //
    displayConditionsList();

    // Display All Other Info //
    displayInformation();

    // Set To Previous Tab //
    $('#'+g_selectedTabID).trigger("click", [true]);

}

function displayAbilityScores() {

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Ability Scores ////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    let strScore = getStatTotal('SCORE_STR');
    $("#strScore").html(strScore);
    $("#strMod").html(signNumber(getMod(strScore)));
    $("#strSection").click(function(){
        openQuickView('abilityScoreView', {
            AbilityName : 'Strength',
            AbilityScore : strScore,
            AbilityMod : getMod(strScore)
        });
    });
    $("#strSection").mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $("#strSection").mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });

    let dexScore = getStatTotal('SCORE_DEX');
    $("#dexScore").html(dexScore);
    $("#dexMod").html(signNumber(getMod(dexScore)));
    $("#dexSection").click(function(){
        openQuickView('abilityScoreView', {
            AbilityName : 'Dexterity',
            AbilityScore : dexScore,
            AbilityMod : getMod(dexScore)
        });
    });
    $("#dexSection").mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $("#dexSection").mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });

    let conScore = getStatTotal('SCORE_CON');
    $("#conScore").html(conScore);
    $("#conMod").html(signNumber(getMod(conScore)));
    $("#conSection").click(function(){
        openQuickView('abilityScoreView', {
            AbilityName : 'Constitution',
            AbilityScore : conScore,
            AbilityMod : getMod(conScore)
        });
    });
    $("#conSection").mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $("#conSection").mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });

    let intScore = getStatTotal('SCORE_INT');
    $("#intScore").html(intScore);
    $("#intMod").html(signNumber(getMod(intScore)));
    $("#intSection").click(function(){
        openQuickView('abilityScoreView', {
            AbilityName : 'Intelligence',
            AbilityScore : intScore,
            AbilityMod : getMod(intScore)
        });
    });
    $("#intSection").mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $("#intSection").mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });

    let wisScore = getStatTotal('SCORE_WIS');
    $("#wisScore").html(wisScore);
    $("#wisMod").html(signNumber(getMod(wisScore)));
    $("#wisSection").click(function(){
        openQuickView('abilityScoreView', {
            AbilityName : 'Wisdom',
            AbilityScore : wisScore,
            AbilityMod : getMod(wisScore)
        });
    });
    $("#wisSection").mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $("#wisSection").mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });

    let chaScore = getStatTotal('SCORE_CHA');
    $("#chaScore").html(chaScore);
    $("#chaMod").html(signNumber(getMod(chaScore)));
    $("#chaSection").click(function(){
        openQuickView('abilityScoreView', {
            AbilityName : 'Charisma',
            AbilityScore : chaScore,
            AbilityMod : getMod(chaScore)
        });
    });
    $("#chaSection").mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $("#chaSection").mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });

}

function displayInformation() {

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Character Info ////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $('#character-name').html(g_character.name);
    $('#character-type').html(g_heritage.name+" "+g_class.name);
    $('#character-level').html("Lvl "+g_character.level);

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////// Experience //////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    let expInput = $('#exp-input');
    expInput.val(g_character.experience);
    $(expInput).blur(function(){
        let experience = $(this).val();
        if(experience == null || experience > 99999 || experience < 0 || experience == '' || experience % 1 != 0) {
            expInput.addClass('is-danger');
        } else {
            expInput.removeClass('is-danger');
            socket.emit("requestExperienceSave",
                getCharIDFromURL(),
                $(this).val());
            g_character.experience = parseInt(experience);
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////// Health ////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    initHealthAndTemp();

    ////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////// Back to Builder ////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $("#backToBuilderButton").click(function(){
        // Hardcoded redirect
        window.location.href = window.location.href.replace(
            "/"+getCharIDFromURL(), "/builder/"+getCharIDFromURL()+"/page1?");
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////// Conditions ///////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $('#addNewConditionsButton').click(function(){
        openSelectConditionsModal();
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////// Hero Points //////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $("#heroPointsSelect").val(g_character.heroPoints);
    $("#heroPointsSelect").change(function(){
        socket.emit("requestHeroPointsSave",
            getCharIDFromURL(),
            $(this).val());
        g_character.heroPoints = parseInt($(this).val());
    });
    $("#heroPointsTitle").click(function(){
        openQuickView('heroPointsView', {});
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////// Saves /////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    let fortBonus = getStatTotal('SAVE_FORT');
    $("#fortSave").html(signNumber(fortBonus));

    let fortData = g_profMap.get("Fortitude");
    let fortProfNum = getProfNumber(fortData.NumUps, g_character.level);
    $("#fortSection").click(function(){
        openQuickView('savingThrowView', {
            ProfData : fortData,
            ProfNum : fortProfNum,
            AbilMod : getMod(g_abilMap.get("CON")),
            TotalBonus : fortBonus,
            CharLevel : g_character.level,
            AbilityName : 'Constitution',
            SavingThrowDescription : 'A Fortitude saving throw is used when your character’s health or vitality is under attack, such as from poison or disease.'
        });
    });
    $("#fortSection").mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $("#fortSection").mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });


    let reflexBonus = getStatTotal('SAVE_REFLEX');
    $("#reflexSave").html(signNumber(reflexBonus));

    let reflexData = g_profMap.get("Reflex");
    let reflexProfNum = getProfNumber(reflexData.NumUps, g_character.level);
    $("#reflexSection").click(function(){
        openQuickView('savingThrowView', {
            ProfData : reflexData,
            ProfNum : reflexProfNum,
            AbilMod : getMod(g_abilMap.get("DEX")),
            TotalBonus : reflexBonus,
            CharLevel : g_character.level,
            AbilityName : 'Dexterity',
            SavingThrowDescription : 'A Reflex saving throw is called for when your character must dodge away from danger, usually something that affects a large area, such as the scorching blast of a fireball spell.'
        });
    });
    $("#reflexSection").mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $("#reflexSection").mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });


    let willBonus = getStatTotal('SAVE_WILL');
    $("#willSave").html(signNumber(willBonus));

    let willData = g_profMap.get("Will");
    let willProfNum = getProfNumber(willData.NumUps, g_character.level);
    $("#willSection").click(function(){
        openQuickView('savingThrowView', {
            ProfData : willData,
            ProfNum : willProfNum,
            AbilMod : getMod(g_abilMap.get("WIS")),
            TotalBonus : willBonus,
            CharLevel : g_character.level,
            AbilityName : 'Wisdom',
            SavingThrowDescription : 'A Will saving throw is often used as your character’s defense against spells and effects that target their mind, such as a charm or confusion spell.'
        });
    });
    $("#willSection").mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $("#willSection").mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////// Speed /////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    let speedContent = $("#speedContent");
    let speedNum = getStatTotal('SPEED');
    speedNum = (speedNum > 5) ? speedNum : 5;
    speedContent.html(speedNum+' ft');

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////// Perception ///////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    let perceptionBonusContent = $("#perceptionBonusContent");
    let perceptionBonus = getStatTotal('PERCEPTION');
    let perceptionBonusDisplayed = (hasConditionals('PERCEPTION')) 
            ? signNumber(perceptionBonus)+'<sup class="is-size-5 has-text-info">*</sup>' : signNumber(perceptionBonus);
    perceptionBonusContent.html(perceptionBonusDisplayed);

    let perceptionData = g_profMap.get("Perception");
    let perceptionProfNum = getProfNumber(perceptionData.NumUps, g_character.level);
    $("#perceptionBonusSection").click(function(){
        openQuickView('perceptionView', {
            ProfData : perceptionData,
            ProfNum : perceptionProfNum,
            WisMod : getMod(g_abilMap.get("WIS")),
            TotalBonus : perceptionBonus,
            CharLevel : g_character.level
        });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////// Attacks and Defenses /////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    let attacks = $("#attacksContent");
    attacks.html('');
    for(const [profName, profData] of g_profMap.entries()){
        if(profData.For == "Attack"){
            let dProfName = profName.replace(/_/g,' ');
            let profWord = getProfNameFromNumUps(profData.NumUps);
            attacks.append('<div><span class="is-size-7 is-italic">'+profWord+' - </span><span class="is-size-7 has-text-weight-bold">'+dProfName+'</span></div>');
        }
    }

    let defenses = $("#defensesContent");
    defenses.html('');
    for(const [profName, profData] of g_profMap.entries()){
        if(profData.For == "Defense"){
            let dProfName = profName.replace(/_/g,' ');
            let profWord = getProfNameFromNumUps(profData.NumUps);
            defenses.append('<div><span class="is-size-7 is-italic">'+profWord+' - </span><span class="is-size-7 has-text-weight-bold">'+dProfName+'</span></div>');
        }
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////// Skills ////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    let skills = $("#skills");
    skills.html('<p class="is-size-5"><strong class="has-text-grey-lighter">Skills</strong></p><hr class="border-secondary is-marginless">');
    for(const [skillName, skillData] of g_skillMap.entries()){

        let skillButtonID = ("skillButton"+skillName).replace(/ /g,'_');

        let abilMod = getMod(g_abilMap.get(skillData.Skill.ability));
        let profNum = getProfNumber(skillData.NumUps, g_character.level);

        let totalBonus = getStatTotal('SKILL_'+skillName);

        let conditionalStar = (hasConditionals('SKILL_'+skillName)) ? '<sup class="is-size-7 has-text-info">*</sup>' : '';

        skills.append('<a id="'+skillButtonID+'" class="panel-block skillButton border-dark"><span class="panel-icon has-text-grey-lighter">'+signNumber(totalBonus)+conditionalStar+'</span><span class="pl-3 has-text-grey-light">'+skillName+'</span></a>');

        $('#'+skillButtonID).click(function(){
            openQuickView('skillView', {
                Skill : skillData.Skill,
                SkillName : skillName,
                SkillData : skillData,
                AbilMod : abilMod,
                ProfNum : profNum,
                TotalBonus : totalBonus,
                CharLevel : g_character.level
            });
        });

    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////// Actions Tab //////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    let encounterFeatStructArray = [];
    let explorationFeatStructArray = [];
    let downtimeFeatStructArray = [];

    for(const [dataSrc, dataFeatArray] of g_featChoiceMap.entries()){
        for(const feat of dataFeatArray){

            let featStruct = g_featMap.get(feat.id+"");

            let explorationTag = featStruct.Tags.find(tag => {
                return tag.name == 'Exploration';
            });
            let downtimeTag = featStruct.Tags.find(tag => {
                return tag.name == 'Downtime';
            });

            if(explorationTag != null){
                explorationFeatStructArray.push(featStruct);
            } else if(downtimeTag != null){
                downtimeFeatStructArray.push(featStruct);
            } else if(feat.actions != 'NONE'){
                encounterFeatStructArray.push(featStruct);
            }
        }
    }

    for(const [featID, featStruct] of g_featMap.entries()){

        if(featStruct.Feat.isDefault == 1){

            let explorationTag = featStruct.Tags.find(tag => {
                return tag.name == 'Exploration';
            });
            let downtimeTag = featStruct.Tags.find(tag => {
                return tag.name == 'Downtime';
            });
    
            if(explorationTag != null){
                explorationFeatStructArray.push(featStruct);
            } else if(downtimeTag != null){
                downtimeFeatStructArray.push(featStruct);
            } else if(featStruct.Feat.actions != 'NONE'){
                encounterFeatStructArray.push(featStruct);
            }
        }
    }

    $('#actionsTab').click(function(event, preventQuickviewClose){
        if(preventQuickviewClose){
            event.stopImmediatePropagation();
        }
        changeTab('actionsTab', {
            FeatMap : g_featMap,
            FeatChoiceMap : g_featChoiceMap,
            SkillMap : g_skillMap,
            EncounterFeatStructArray : encounterFeatStructArray,
            ExplorationFeatStructArray : explorationFeatStructArray,
            DowntimeFeatStructArray : downtimeFeatStructArray
        });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////// Spells Tab //////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $('#spellsTab').click(function(event, preventQuickviewClose){
        if(preventQuickviewClose){
            event.stopImmediatePropagation();
        }
        changeTab('spellsTab', {
            
        });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Inventory Tab /////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $('#inventoryTab').click(function(event, preventQuickviewClose){
        if(preventQuickviewClose){
            event.stopImmediatePropagation();
        }
        changeTab('inventoryTab', {
            StrMod : getMod(getStatTotal('SCORE_STR')),
            DexMod : getMod(getStatTotal('SCORE_DEX')),
            Size : g_ancestry.size,
        });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////// Feats Tab ///////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $('#featsTab').click(function(event, preventQuickviewClose){
        if(preventQuickviewClose){
            event.stopImmediatePropagation();
        }
        changeTab('featsTab', {
            FeatMap : g_featMap,
            FeatChoiceMap : g_featChoiceMap,
            AncestryTagsArray : g_charTagsArray,
            ClassName : g_class.name
        });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////// Notes Tab ///////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $('#notesTab').click(function(event, preventQuickviewClose){
        if(preventQuickviewClose){
            event.stopImmediatePropagation();
        }
        changeTab('notesTab', {
            Character : g_character,
        });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////// Languages ///////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    let languagesContent = $('#languagesContent');
    languagesContent.html('');
    let langCount = 0;
    for(const [dataSrc, dataLangArray] of g_langMap.entries()){
        for(const language of dataLangArray){
            if(langCount != 0){languagesContent.append(', ');}
            langCount++;
            let langID = 'langLink'+language.id+"C"+langCount;
            languagesContent.append('<a id="'+langID+'" class="is-size-6">'+language.name+'</a>');
            $('#'+langID).click(function(){
                openQuickView('languageView', {
                    Language : language
                });
            });
        }
    }


}

////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// Health ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function initHealthAndTemp() {

    let maxHealth = $('#char-max-health');
    let maxHealthNum = getStatTotal('MAX_HEALTH');
    maxHealthNum += (g_class.hitPoints+getStatTotal('MAX_HEALTH_BONUS_PER_LEVEL'))*g_character.level;
    maxHealth.html(maxHealthNum);

    let currentHealth = $('#char-current-health');
    if(g_character.currentHealth == null){
        g_character.currentHealth = maxHealthNum;
    } else {
        g_character.currentHealth = (g_character.currentHealth > maxHealthNum) ? maxHealthNum : g_character.currentHealth;
    }

    let bulmaTextColor = getBulmaTextColorFromCurrentHP(g_character.currentHealth, maxHealthNum);
    currentHealth.html('<p class="is-size-5 is-unselectable text-center '+bulmaTextColor+'" style="width: 70px;">'+g_character.currentHealth+'</p>');

    $(currentHealth).click(function(){
        if(!$(this).hasClass('is-in-input-mode')) {

            $(this).addClass('is-in-input-mode');
            $(this).html('<input id="current-health-input" class="input" type="number" min="0" max="'+maxHealthNum+'" style="width: 70px;" value="'+g_character.currentHealth+'">');
            $('#current-health-input').focus();

            $('#current-health-input').blur(function(){
                healthConfirm(maxHealthNum);
            });

            // Press Enter Key
            $('#current-health-input').on('keypress',function(e){
                if(e.which == 13){
                    healthConfirm(maxHealthNum);
                }
            });

        }
    });


    let tempHealth = $('#char-temp-health');
    
    if(g_character.tempHealth == null){
        g_character.tempHealth = 0;
    }

    if(g_character.tempHealth == 0){
        tempHealth.html('<p class="is-size-5 is-unselectable text-center has-text-grey-lighter" style="width: 70px;">―</p>');
    } else {
        tempHealth.html('<p class="is-size-5 is-unselectable text-center has-text-info" style="width: 70px;">'+g_character.tempHealth+'</p>');
    }

    $(tempHealth).click(function(){
        if(!$(this).hasClass('is-in-input-mode')) {

            $(this).addClass('is-in-input-mode');
            $(this).html('<input id="temp-health-input" class="input" type="number" min="0" max="999" style="width: 70px;" value="'+g_character.tempHealth+'">');
            $('#temp-health-input').focus();

            $('#temp-health-input').blur(function(){
                tempHealthConfirm();
            });

            // Press Enter Key
            $('#temp-health-input').on('keypress',function(e){
                if(e.which == 13){
                    tempHealthConfirm();
                }
            });

        }
    });

}

function healthConfirm(maxHealthNum){
    let currentHealthNum = $('#current-health-input').val();
    if(currentHealthNum == null || currentHealthNum > maxHealthNum || currentHealthNum < 0 || currentHealthNum == '') {
        $('#current-health-input').addClass('is-danger');
    } else {
        g_character.currentHealth = parseInt(currentHealthNum);
        let bulmaTextColor = getBulmaTextColorFromCurrentHP(g_character.currentHealth, maxHealthNum);
        $('#char-current-health').html('<p class="is-size-5 is-unselectable text-center '+bulmaTextColor+'" style="width: 70px;">'+g_character.currentHealth+'</p>');
        $('#char-current-health').removeClass('is-in-input-mode');
        socket.emit("requestCurrentHitPointsSave",
            getCharIDFromURL(),
            g_character.currentHealth);
    }
}

function tempHealthConfirm(){
    let tempHealth = $('#char-temp-health');
    let tempHealthNum = $('#temp-health-input').val();
    if(tempHealthNum == null || tempHealthNum > 999 || tempHealthNum < 0) {
        $('#temp-health-input').addClass('is-danger');
    } else {
        g_character.tempHealth = (tempHealthNum == '') ? 0 : parseInt(tempHealthNum);
        if(g_character.tempHealth == 0){
            tempHealth.html('<p class="is-size-5 is-unselectable text-center has-text-grey-lighter" style="width: 70px;">―</p>');
        } else {
            tempHealth.html('<p class="is-size-5 is-unselectable text-center has-text-info" style="width: 70px;">'+g_character.tempHealth+'</p>');
        }
        $('#char-temp-health').removeClass('is-in-input-mode');
        socket.emit("requestTempHitPointsSave",
            getCharIDFromURL(),
            g_character.tempHealth);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Armor and Shields ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function determineArmor(dexMod, strScore) {

    let shieldStruct = findEquippedShield();
    if(shieldStruct != null){

        // Halve maxHP if it's shoddy
        let maxHP = (shieldStruct.InvItem.isShoddy == 1) ? Math.floor(shieldStruct.InvItem.hitPoints/2) : shieldStruct.InvItem.hitPoints;

        $('#shieldSection').removeClass('is-hidden');
        $('#shieldBonus').html('+'+shieldStruct.Item.ShieldData.acBonus);
        $('#shieldSection').attr('data-tooltip', shieldStruct.InvItem.name+'\nHardness: '+shieldStruct.InvItem.hardness+'\nHealth: '+shieldStruct.InvItem.currentHitPoints+'/'+maxHP);
    } else {
        $('#shieldSection').addClass('is-hidden');
    }

    let armorStruct = findEquippedArmor();
    if(armorStruct != null){

        let profData = g_armorProfMap.get(armorStruct.Item.Item.id+"");

        let profNumUps = null;
        let profBonus = null;
        if(profData != null){
            profNumUps = profData.NumUps;
            profBonus = profData.Bonus;
        } else {
            profNumUps = 0;
            profBonus = 0;
        }

        let profNumber = getProfNumber(profNumUps, g_character.level);
        dexMod = (dexMod > armorStruct.Item.ArmorData.dexCap) ? armorStruct.Item.ArmorData.dexCap : dexMod;

        // Halve maxHP if it's shoddy
        let maxHP = (armorStruct.InvItem.isShoddy == 1) ? Math.floor(armorStruct.InvItem.hitPoints/2) : armorStruct.InvItem.hitPoints;
        // Reduce currentHP if it's over maxHP
        armorStruct.InvItem.currentHitPoints = (armorStruct.InvItem.currentHitPoints > maxHP) ? maxHP : armorStruct.InvItem.currentHitPoints;
        // Halve brokenThreshold if it's shoddy
        let brokenThreshold = (armorStruct.InvItem.isShoddy == 1) ? Math.floor(armorStruct.InvItem.brokenThreshold/2) : armorStruct.InvItem.brokenThreshold;

        let brokenPenalty = 0;
        let isBroken = (armorStruct.InvItem.currentHitPoints <= brokenThreshold);
        if(isBroken){
            switch(armorStruct.Item.ArmorData.category){
                case 'LIGHT': brokenPenalty = -1; break;
                case 'MEDIUM': brokenPenalty = -2; break;
                case 'HEAVY': brokenPenalty = -3; break;
                default: break;
            }
        }

        let shoddyPenalty = (armorStruct.InvItem.isShoddy == 1) ? -2 : 0;

        let totalAC = 10 + dexMod + profNumber + armorStruct.Item.ArmorData.acBonus + profBonus + brokenPenalty + shoddyPenalty;

        // Apply armor penalties to character...
        let checkPenalty = armorStruct.Item.ArmorData.checkPenalty;
        checkPenalty += (armorStruct.InvItem.isShoddy == 1) ? -2 : 0;
        let speedPenalty = armorStruct.Item.ArmorData.speedPenalty;

        if(strScore >= armorStruct.Item.ArmorData.minStrength) {

            speedPenalty += 5;

        } else {

            applyArmorCheckPenaltyToSkill('Acrobatics', checkPenalty);
            applyArmorCheckPenaltyToSkill('Athletics', checkPenalty);
            applyArmorCheckPenaltyToSkill('Stealth', checkPenalty);
            applyArmorCheckPenaltyToSkill('Thievery', checkPenalty);

        }

        if(speedPenalty < 0){
            addStat('SPEED', 'ARMOR_PENALTY', speedPenalty);
        }
        
        // Apply armor's rune effects to character...
        if(armorStruct.InvItem.itemRuneData != null){

            let armorRuneData = armorStruct.InvItem.itemRuneData;

            if(isArmorPotencyOne(armorRuneData.fundPotencyRuneID)){
                totalAC += 1;
            } else if(isArmorPotencyTwo(armorRuneData.fundPotencyRuneID)){
                totalAC += 2;
            } else if(isArmorPotencyThree(armorRuneData.fundPotencyRuneID)){
                totalAC += 3;
            }

            if(isResilient(armorRuneData.fundRuneID)){
                addStat('SAVE_FORT', 'ITEM_BONUS', 1);
                addStat('SAVE_WILL', 'ITEM_BONUS', 1);
                addStat('SAVE_REFLEX', 'ITEM_BONUS', 1);
            } else if(isGreaterResilient(armorRuneData.fundRuneID)){
                addStat('SAVE_FORT', 'ITEM_BONUS', 2);
                addStat('SAVE_WILL', 'ITEM_BONUS', 2);
                addStat('SAVE_REFLEX', 'ITEM_BONUS', 2);
            } else if(isMajorResilient(armorRuneData.fundRuneID)){
                addStat('SAVE_FORT', 'ITEM_BONUS', 3);
                addStat('SAVE_WILL', 'ITEM_BONUS', 3);
                addStat('SAVE_REFLEX', 'ITEM_BONUS', 3);
            }

            runArmorPropertyRuneCode(armorRuneData.propRune1ID);
            runArmorPropertyRuneCode(armorRuneData.propRune2ID);
            runArmorPropertyRuneCode(armorRuneData.propRune3ID);
            runArmorPropertyRuneCode(armorRuneData.propRune4ID);

        }


        // Final Product
        $('#acNumber').html(totalAC);
        $('#acSection').attr('data-tooltip', armorStruct.InvItem.name);

    } else {

        let profData = g_armorProfMap.get("31"); // No Armor Hidden Item ID

        let profNumUps = null;
        let profBonus = null;
        if(profData != null){
            profNumUps = profData.NumUps;
            profBonus = profData.Bonus;
        } else {
            profNumUps = 0;
            profBonus = 0;
        }

        let profNumber = getProfNumber(profNumUps, g_character.level);

        let totalAC = 10 + dexMod + profNumber + profBonus;

        $('#acNumber').html(totalAC);
        $('#acSection').attr('data-tooltip', 'Wearing Nothing');

    }

}

function runArmorPropertyRuneCode(propertyRuneID){

    if(propertyRuneID == null){ return; }

    for(const [itemID, itemData] of g_itemMap.entries()){
        if(itemData.RuneData != null && itemData.RuneData.id == propertyRuneID){
            let propertyRuneCode = itemData.Item.code;
            if(propertyRuneCode != null){
                processSheetCode(propertyRuneCode, 'ARMOR_PROPERTY_RUNE', 'ITEM');
            }
            return;
        }
    }

}

function applyArmorCheckPenaltyToSkill(skillName, checkPenalty){

    addStat('SKILL_'+skillName, 'ARMOR_PENALTY', checkPenalty);
    addConditionalStat('SKILL_'+skillName, "penalty from armor is NOT applied to skill checks that have the attack trait", checkPenalty);

}

function findEquippedArmor() {
    for(const invItem of g_invStruct.InvItems){
        if(invItem.id == g_equippedArmorInvItemID) {
            let item = g_itemMap.get(invItem.itemID+"");
            if(invItem.bagInvItemID == null && item.ArmorData != null){
                return { Item : item, InvItem : invItem };
            }
        }
    }
    return null;
}

function findEquippedShield() {
    for(const invItem of g_invStruct.InvItems){
        if(invItem.id == g_equippedShieldInvItemID) {
            let item = g_itemMap.get(invItem.itemID+"");
            if(invItem.bagInvItemID == null && item.ShieldData != null){

                // Halve maxHP if it's shoddy
                let maxHP = (invItem.isShoddy == 1) ? Math.floor(invItem.hitPoints/2) : invItem.hitPoints;
                // Reduce currentHP if it's over maxHP
                invItem.currentHitPoints = (invItem.currentHitPoints > maxHP) ? maxHP : invItem.currentHitPoints;
                // Halve brokenThreshold if it's shoddy
                let brokenThreshold = (invItem.isShoddy == 1) ? Math.floor(invItem.brokenThreshold/2) : invItem.brokenThreshold;
                
                if(invItem.currentHitPoints > brokenThreshold){
                    return { Item : item, InvItem : invItem };
                } else {
                    g_equippedShieldInvItemID = null;
                    return null;
                }
                
            }
        }
    }
    return null;
}

////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// Determine Bulk And Coins ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function determineBulkAndCoins(invItems, itemMap, strMod){

    console.log(invItems);

    let bagBulkMap = new Map();
    let totalBulk = 0;

    let copperCoins = 0;
    let silverCoins = 0;
    let goldCoins = 0;
    let platinumCoins = 0;

    for(const invItem of invItems){

        // Coins //
        if(invItem.itemID == 22){ // Copper
            copperCoins += invItem.quantity;
        } else if(invItem.itemID == 23){ // Silver
            silverCoins += invItem.quantity;
        } else if(invItem.itemID == 24){ // Gold
            goldCoins += invItem.quantity;
        } else if(invItem.itemID == 25){ // Platinum
            platinumCoins += invItem.quantity;
        }
            
        // Bulk //
        if(invItem.bagInvItemID != null){
            let bagBulk = bagBulkMap.get(invItem.bagInvItemID);
            if(bagBulk == null){
                let bagInvItem = invItems.find(searchInvItem => {
                    return searchInvItem.id == invItem.bagInvItemID;
                });
                let bagItem = itemMap.get(bagInvItem.itemID+"");
                let invItemQuantity = (invItem.quantity == null) ? 1 : invItem.quantity;
                let invItemBulk = getConvertedBulkForSize(invItem.size, invItem.bulk);
                invItemBulk = (invItemBulk == 0.0) ? 0.001 : invItemBulk;
                let invItemTotalBulk = invItemBulk * invItemQuantity;
                bagBulkMap.set(invItem.bagInvItemID, invItemTotalBulk-bagItem.StorageData.bulkIgnored);
            } else {
                let invItemQuantity = (invItem.quantity == null) ? 1 : invItem.quantity;
                let invItemBulk = getConvertedBulkForSize(invItem.size, invItem.bulk);
                invItemBulk = (invItemBulk == 0.0) ? 0.001 : invItemBulk;
                let invItemTotalBulk = invItemBulk * invItemQuantity;
                bagBulkMap.set(invItem.bagInvItemID, bagBulk+invItemTotalBulk);
            }
        } else {

            let includeSelf = true;
            let item = itemMap.get(invItem.itemID+"");
            if(item.StorageData != null){
                if(item.StorageData.ignoreSelfBulkIfWearing == 1){
                    includeSelf = false;
                }
            }

            if(includeSelf){
                let invItemQuantity = (invItem.quantity == null) ? 1 : invItem.quantity;
                let invItemBulk = getConvertedBulkForSize(invItem.size, invItem.bulk);
                invItemBulk = (invItemBulk == 0.0) ? 0.001 : invItemBulk;
                let invItemTotalBulk = invItemBulk * invItemQuantity;
                totalBulk += invItemTotalBulk;
            }
        }
    }

    for(const [bagInvItemID, bulkAmount] of bagBulkMap.entries()){
        if(bulkAmount > 0){
            totalBulk += bulkAmount;
        }
    }

    totalBulk = round(totalBulk, 0);

    let weightEncumbered = 5+strMod;
    let weightMax = 10+strMod;

    let isEncumbered = false;
    let cantMove = false;

    if(totalBulk > weightMax) {
        addCondition(13, null, 'Exceeding the amount of Bulk you can even hold.');
        cantMove = true;
    } else {
        removeCondition(13, false);
    }
    if(totalBulk > weightEncumbered){
        addCondition(1, null, 'Holding more Bulk than you can carry.');
        isEncumbered = true;
    } else {
        removeCondition(1, false);
    }

    g_bulkAndCoinsStruct = {
        TotalBulk : totalBulk,
        BagBulkMap : bagBulkMap,
        IsEncumbered : isEncumbered,
        CantMove : cantMove,
        WeightMax : weightMax,
        WeightEncumbered : weightEncumbered,
        CopperCoins : copperCoins,
        SilverCoins : silverCoins,
        GoldCoins : goldCoins,
        PlatinumCoins : platinumCoins,
    };

    return g_bulkAndCoinsStruct;

}

////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Socket Returns ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

socket.on("returnHeroPointsSave", function(){
});

socket.on("returnAddFundamentalRune", function(invItemID, invStruct){
    $('#invItemAddFundamentalRuneButton'+invItemID).removeClass('is-loading');
    g_invStruct = invStruct;
    loadCharSheet();
    $('#quickviewDefault').removeClass('is-active');
});

socket.on("returnAddItemToInv", function(itemID, invStruct){
    $('#addItemAddItem'+itemID).removeClass('is-loading');
    g_invStruct = invStruct;
    loadCharSheet();
});

socket.on("returnRemoveItemFromInv", function(invItemID, invStruct){
    $('#invItemRemoveButton'+invItemID).removeClass('is-loading');
    g_invStruct = invStruct;
    loadCharSheet();
    $('#quickviewDefault').removeClass('is-active');
});

socket.on("returnInvItemMoveBag", function(invItemID, invStruct){
    $('#invItemMoveSelect'+invItemID).removeClass('is-loading');
    g_invStruct = invStruct;
    loadCharSheet();
    $('#quickviewDefault').removeClass('is-active');
});

socket.on("returnInvItemUpdated", function(invStruct){
    g_invStruct = invStruct;
    loadCharSheet();
    $('#quickviewDefault').removeClass('is-active');
});
