
let socket = io();

let g_character = null;
let g_classDetails = null;
let g_ancestry = null;
let g_heritage = null;
let g_background = null;
let g_charTagsArray = null;

let g_itemMap = null;
let g_invStruct = null;
let g_bulkAndCoinsStruct = null;
let g_openBagsSet = new Set();

let g_otherSpeeds = null;

let g_conditionsMap = null;
let g_allConditions = null;

let g_profMap = null;
let g_weaponProfMap = null;
let g_armorProfMap = null;

let g_equippedArmorInvItemID = null;
let g_equippedShieldInvItemID = null;

let g_abilMap = null;
let g_skillMap = null;
let g_langArray = null;
let g_senseArray = null;
let g_phyFeatArray = null;

let g_featMap = null;
let g_featChoiceArray = null;

let g_spellMap = null;
let g_spellSlotsMap = null;
let g_spellBookArray = null;
let g_innateSpellArray = null;

let g_resistAndVulners = null;

let g_specializationStruct = null;

let g_notesFields = null;

let currentInvests = null;
let maxInvests = null;

let g_inventoryTabScroll = null;
let g_selectedTabID = 'inventoryTab';
let g_selectedSubTabID = null;
let g_selectedSubTabLock = false;

let g_conditionsLoadingState = null;
let g_preConditions_strScore = null;
let g_preConditions_dexScore = null;



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
    g_itemMap = new Map([...g_itemMap.entries()].sort(
        function(a, b) {
            if(a[1].Item.itemType == 'CURRENCY'){
                return 1;
            }

            if (a[1].Item.level === b[1].Item.level) {
                // Name is only important when levels are the same
                return a[1].Item.name > b[1].Item.name ? 1 : -1;
            }
            return a[1].Item.level - b[1].Item.level;
        })
    );

    g_invStruct = charInfo.InvStruct;

    g_equippedArmorInvItemID = g_invStruct.Inventory.equippedArmorInvItemID;
    g_equippedShieldInvItemID = g_invStruct.Inventory.equippedShieldInvItemID;

    g_character = charInfo.Character;

    g_otherSpeeds = charInfo.OtherSpeeds;

    g_conditionsMap = objToMap(charInfo.ConditionsObject);
    g_allConditions = charInfo.AllConditions;
    g_allConditions = g_allConditions.sort(
        function(a, b) {
            return a.name > b.name ? 1 : -1;
        }
    );

    g_abilMap = objToMap(charInfo.AbilObject);
    g_skillMap = objToMap(charInfo.SkillObject);
    g_langArray = charInfo.ChoicesStruct.LangArray;
    g_senseArray = charInfo.ChoicesStruct.SenseArray;
    g_phyFeatArray = charInfo.ChoicesStruct.PhyFeatArray;

    g_profMap = objToMap(charInfo.ProfObject);
    g_weaponProfMap = buildWeaponProfMap();
    g_armorProfMap = buildArmorProfMap();

    g_featMap = objToMap(charInfo.FeatObject);
    g_featChoiceArray = charInfo.ChoicesStruct.FeatArray;

    g_spellMap = objToMap(charInfo.SpellObject);
    g_spellMap = new Map([...g_spellMap.entries()].sort(
        function(a, b) {
            if (a[1].Spell.level === b[1].Spell.level) {
                // Name is only important when levels are the same
                return a[1].Spell.name > b[1].Spell.name ? 1 : -1;
            }
            return a[1].Spell.level - b[1].Spell.level;
        })
    );
    
    g_spellSlotsMap = objToMap(charInfo.SpellDataStruct.SpellSlotObject);
    g_spellBookArray = charInfo.SpellDataStruct.SpellBookArray;

    g_focusSpellMap = objToMap(charInfo.SpellDataStruct.FocusSpellObject);
    /*g_focusSpellMap = new Map([...g_focusSpellMap.entries()].sort(
        function(a, b) {
            let aStruct = g_spellMap.get(a[1].SpellID+"");
            let bStruct = g_spellMap.get(b[1].SpellID+"");
            if (aStruct.Spell.level === bStruct.Spell.level) {
                // Name is only important when levels are the same
                return aStruct.Spell.name > bStruct.Spell.name ? 1 : -1;
            }
            return aStruct.Spell.level - bStruct.Spell.level;
        })
    );*/

    g_innateSpellArray = charInfo.SpellDataStruct.InnateSpellArray;
    g_innateSpellArray = g_innateSpellArray.sort(
        function(a, b) {
            return a.SpellLevel - b.SpellLevel;
        }
    );

    g_charTagsArray = charInfo.ChoicesStruct.CharTagsArray;
    
    g_classDetails = charInfo.ChoicesStruct.ClassDetails;
    g_classDetails.AbilityChoices = charInfo.ChoicesStruct.ChoiceArray;

    g_ancestry = charInfo.Ancestry;
    g_heritage = charInfo.Heritage;
    g_background = charInfo.Background;

    g_resistAndVulners = charInfo.ResistAndVulners;

    g_specializationStruct = charInfo.SpecializeStruct;

    g_notesFields = charInfo.NotesFields;

    initExpressionProcessor(g_character.level, objToMap(charInfo.ProfObject));

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

    // Hide Spells Tab //
    if(g_spellSlotsMap.size === 0 && g_focusSpellMap.size === 0 && g_innateSpellArray.length === 0){
        $('#spellsTab').addClass('is-hidden');
    } else {
        $('#spellsTab').removeClass('is-hidden');
    }

    // Set Conditions Loading State to Default //
    g_conditionsLoadingState = 'READY';

    // ~~~~~~~~~~~~~~~~~~~~~~~ Adding Stats To Map ~~~~~~~~~~~~~~~~~~~~~~~ //

    addStat('SPEED', 'BASE', g_ancestry.speed);
    for(const otherSpeed of g_otherSpeeds){
        addStat('SPEED_'+otherSpeed.Type, 'BASE', parseInt(otherSpeed.Amount));
    }

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
    addStat('SAVE_FORT', 'USER_BONUS', fortData.UserBonus);
    addStat('SAVE_FORT', 'MODIFIER', 'CON');
    
    let reflexData = g_profMap.get("Reflex");
    addStat('SAVE_REFLEX', 'PROF_BONUS', reflexData.NumUps);
    addStat('SAVE_REFLEX', 'USER_BONUS', reflexData.UserBonus);
    addStat('SAVE_REFLEX', 'MODIFIER', 'DEX');

    let willData = g_profMap.get("Will");
    addStat('SAVE_WILL', 'PROF_BONUS', willData.NumUps);
    addStat('SAVE_WILL', 'USER_BONUS', willData.UserBonus);
    addStat('SAVE_WILL', 'MODIFIER', 'WIS');

    for(const [skillName, skillData] of g_skillMap.entries()){
        let profData = g_profMap.get(skillName);
        if(profData != null){
            addStat('SKILL_'+skillName, 'PROF_BONUS', profData.NumUps);
            addStat('SKILL_'+skillName, 'USER_BONUS', profData.UserBonus);
        } else {
            addStat('SKILL_'+skillName, 'PROF_BONUS', skillData.NumUps);
        }
        addStat('SKILL_'+skillName, 'MODIFIER', skillData.Skill.ability);
    }

    let perceptionData = g_profMap.get("Perception");
    addStat('PERCEPTION', 'PROF_BONUS', perceptionData.NumUps);
    addStat('PERCEPTION', 'USER_BONUS', perceptionData.UserBonus);
    addStat('PERCEPTION', 'MODIFIER', 'WIS');

    // Spell Attacks and DCs
    let arcaneSpellAttack = g_profMap.get("ArcaneSpellAttacks");
    if(arcaneSpellAttack != null){
        addStat('ARCANE_SPELL_ATTACK', 'PROF_BONUS', arcaneSpellAttack.NumUps);
        addStat('ARCANE_SPELL_ATTACK', 'USER_BONUS', arcaneSpellAttack.UserBonus);
    }
    let occultSpellAttack = g_profMap.get("OccultSpellAttacks");
    if(occultSpellAttack != null){
        addStat('OCCULT_SPELL_ATTACK', 'PROF_BONUS', occultSpellAttack.NumUps);
        addStat('OCCULT_SPELL_ATTACK', 'USER_BONUS', occultSpellAttack.UserBonus);
    }
    let primalSpellAttack = g_profMap.get("PrimalSpellAttacks");
    if(primalSpellAttack != null){
        addStat('PRIMAL_SPELL_ATTACK', 'PROF_BONUS', primalSpellAttack.NumUps);
        addStat('PRIMAL_SPELL_ATTACK', 'USER_BONUS', primalSpellAttack.UserBonus);
    }
    let divineSpellAttack = g_profMap.get("DivineSpellAttacks");
    if(divineSpellAttack != null){
        addStat('DIVINE_SPELL_ATTACK', 'PROF_BONUS', divineSpellAttack.NumUps);
        addStat('DIVINE_SPELL_ATTACK', 'USER_BONUS', divineSpellAttack.UserBonus);
    }
    
    let arcaneSpellDC = g_profMap.get("ArcaneSpellDCs");
    if(arcaneSpellDC != null){
        addStat('ARCANE_SPELL_DC', 'PROF_BONUS', arcaneSpellDC.NumUps);
        addStat('ARCANE_SPELL_DC', 'USER_BONUS', arcaneSpellDC.UserBonus);
    }
    let occultSpellDC = g_profMap.get("OccultSpellDCs");
    if(occultSpellDC != null){
        addStat('OCCULT_SPELL_DC', 'PROF_BONUS', occultSpellDC.NumUps);
        addStat('OCCULT_SPELL_DC', 'USER_BONUS', occultSpellDC.UserBonus);
    }
    let primalSpellDC = g_profMap.get("PrimalSpellDCs");
    if(primalSpellDC != null){
        addStat('PRIMAL_SPELL_DC', 'PROF_BONUS', primalSpellDC.NumUps);
        addStat('PRIMAL_SPELL_DC', 'USER_BONUS', primalSpellDC.UserBonus);
    }
    let divineSpellDC = g_profMap.get("DivineSpellDCs");
    if(divineSpellDC != null){
        addStat('DIVINE_SPELL_DC', 'PROF_BONUS', divineSpellDC.NumUps);
        addStat('DIVINE_SPELL_DC', 'USER_BONUS', divineSpellDC.UserBonus);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    // Display Ability Scores //
    displayAbilityScores();

    // Display Health and Temp //
    initHealthAndTemp();

    // Determine Bulk and Coins //
    determineBulkAndCoins(g_invStruct.InvItems, g_itemMap, getMod(getStatTotal('SCORE_STR')));

    // Get STR and DEX score before conditions code runs (in the case of Enfeebled)
    g_preConditions_strScore = getStatTotal('SCORE_STR');
    g_preConditions_dexScore = getStatTotal('SCORE_DEX');

    // Run All Conditions Code //
    runAllConditionsCode();

    // Run Feats and Abilities Code //
    runAllFeatsAndAbilitiesCode();

    // Determine Invested Items and Run Code //
    determineInvestitures();

    // Determine Armor //
    determineArmor(getMod(getStatTotal('SCORE_DEX')), g_preConditions_strScore);

    // Display Conditions List //
    displayConditionsList();

    // Display All Other Info //
    displayInformation();

    // Set To Previous Tab //
    g_selectedSubTabLock = true;
    $('#'+g_selectedTabID).trigger("click", [true]);
    if(g_selectedSubTabID != null){
        $('#'+g_selectedSubTabID).trigger("click");
    }
    g_selectedSubTabLock = false;

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
    $('#character-type').html(g_heritage.name+" "+g_classDetails.Class.name);
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
    ////////////////////////////////////// Resist and Vulners //////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    let resistAndVulnerText = '';
    if(g_resistAndVulners.Resistances.length != 0){
        resistAndVulnerText += 'Resistances';
        if(g_resistAndVulners.Vulnerabilities.length != 0){
            resistAndVulnerText += ' | ';
        }
    }
    if(g_resistAndVulners.Vulnerabilities.length != 0){
        resistAndVulnerText += 'Weaknesses';
    }

    if(resistAndVulnerText != ''){
        $('#resistAndVulnerContent').removeClass('is-hidden');
        $('#resistAndVulnerText').html(resistAndVulnerText);
        $('#resistAndVulnerContent').click(function(){
            openQuickView('resistView',{
                ResistAndVulners: g_resistAndVulners,
                CharLevel : g_character.level,
            });
        });
        $("#resistAndVulnerContent").mouseenter(function(){
            $(this).addClass('has-background-grey-darker');
        });
        $("#resistAndVulnerContent").mouseleave(function(){
            $(this).removeClass('has-background-grey-darker');
        });
    } else {
        $('#resistAndVulnerContent').addClass('is-hidden');
    }

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
    /////////////////////////////////////// Back to Builder ////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    $("#backToBuilderButton").click(function(){
        // Hardcoded redirect
        window.location.href = window.location.href.replace(
            "/"+getCharIDFromURL(), "/builder/"+getCharIDFromURL()+"/page1?");
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////// Take Rest ///////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    $("#restButton").click(function(){
        takeRest();
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////// Saves /////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    let fortBonus = getStatTotal('SAVE_FORT');
    let fortBonusContent = $("#fortSave");
    let fortBonusDisplayed = (hasConditionals('SAVE_FORT')) ? signNumber(fortBonus)+'<sup class="is-size-5 has-text-info">*</sup>' : signNumber(fortBonus);
    fortBonusContent.html(fortBonusDisplayed);

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
    let reflexBonusContent = $("#reflexSave");
    let reflexBonusDisplayed = (hasConditionals('SAVE_REFLEX')) ? signNumber(reflexBonus)+'<sup class="is-size-5 has-text-info">*</sup>' : signNumber(reflexBonus);
    reflexBonusContent.html(reflexBonusDisplayed);

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
    let willBonusContent = $("#willSave");
    let willBonusDisplayed = (hasConditionals('SAVE_WILL')) ? signNumber(willBonus)+'<sup class="is-size-5 has-text-info">*</sup>' : signNumber(willBonus);
    willBonusContent.html(willBonusDisplayed);

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

    $("#speedSection").click(function(){
        openQuickView('speedView', {
        });
    });

    if(g_otherSpeeds.length != 0){
        $("#speedBottom").removeClass('is-hidden');
    } else {
        $("#speedBottom").addClass('is-hidden');
    }

    $("#speedSection").mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
        $("#speedDivider").addClass('hr-highlighted');
    });
    $("#speedSection").mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
        $("#speedDivider").removeClass('hr-highlighted');
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////// Perception ///////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    let visionSenseArray = [];
    let additionalSenseArray = [];
    let primaryVisionSense = null;
    for(const sense of g_senseArray){
        if(sense.value.isVisionType == 0){
            additionalSenseArray.push(sense.value);
        } else {
            visionSenseArray.push(sense.value);
            if(primaryVisionSense == null || sense.value.visionPrecedence > primaryVisionSense.visionPrecedence) {
                primaryVisionSense = sense.value;
            }
        }
    }

    $("#perceptionPrimaryVisionSense").html(primaryVisionSense.name);

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
            CharLevel : g_character.level,
            PrimaryVisionSense : primaryVisionSense,
            VisionSenseArray : visionSenseArray,
            AdditionalSenseArray : additionalSenseArray
        });
    });

    $("#perceptionBonusSection").mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
        $("#perceptionBonusDivider").addClass('hr-highlighted');
    });
    $("#perceptionBonusSection").mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
        $("#perceptionBonusDivider").removeClass('hr-highlighted');
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////// Attacks and Defenses /////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $("#addNewProfButton").click(function(){
        openQuickView('addProfView', {
        });
    });

    let otherProfsNum = 0;

    let attacks = $("#attacksContent");
    attacks.html('');

    let profSimpleWeapons = g_profMap.get("Simple_Weapons");
    if(profSimpleWeapons != null){
        let profWord = getProfNameFromNumUps(profSimpleWeapons.NumUps);
        otherProfsNum++;
        otherProfBuild(attacks, profWord, 'Simple Weapons', otherProfsNum, profSimpleWeapons);
    }
    let profMartialWeapons = g_profMap.get("Martial_Weapons");
    if(profMartialWeapons != null){
        let profWord = getProfNameFromNumUps(profMartialWeapons.NumUps);
        otherProfsNum++;
        otherProfBuild(attacks, profWord, 'Martial Weapons', otherProfsNum, profMartialWeapons);
    }
    let profAdvancedWeapons = g_profMap.get("Advanced_Weapons");
    if(profAdvancedWeapons != null){
        let profWord = getProfNameFromNumUps(profAdvancedWeapons.NumUps);
        otherProfsNum++;
        otherProfBuild(attacks, profWord, 'Advanced Weapons', otherProfsNum, profAdvancedWeapons);
    }
    let profUnarmedAttacks = g_profMap.get("Unarmed_Attacks");
    if(profUnarmedAttacks != null){
        let profWord = getProfNameFromNumUps(profUnarmedAttacks.NumUps);
        otherProfsNum++;
        otherProfBuild(attacks, profWord, 'Unarmed Attacks', otherProfsNum, profUnarmedAttacks);
    }
    for(const [profName, profData] of g_profMap.entries()){
        if(profData.For == "Attack" && profName != "Simple_Weapons" && profName != "Martial_Weapons" && profName != "Advanced_Weapons" && profName != "Unarmed_Attacks"){
            let dProfName = profName.replace(/_/g,' ');
            let profWord = getProfNameFromNumUps(profData.NumUps);
            otherProfsNum++;
            otherProfBuild(attacks, profWord, capitalizeWords(dProfName), otherProfsNum, profData);
        }
    }


    let defenses = $("#defensesContent");
    defenses.html('');

    let profLightArmor = g_profMap.get("Light_Armor");
    if(profLightArmor != null){
        let profWord = getProfNameFromNumUps(profLightArmor.NumUps);
        otherProfsNum++;
        otherProfBuild(defenses, profWord, 'Light Armor', otherProfsNum, profLightArmor);
    }
    let profMediumArmor = g_profMap.get("Medium_Armor");
    if(profMediumArmor != null){
        let profWord = getProfNameFromNumUps(profMediumArmor.NumUps);
        otherProfsNum++;
        otherProfBuild(defenses, profWord, 'Medium Armor', otherProfsNum, profMediumArmor);
    }
    let profHeavyArmor = g_profMap.get("Heavy_Armor");
    if(profHeavyArmor != null){
        let profWord = getProfNameFromNumUps(profHeavyArmor.NumUps);
        otherProfsNum++;
        otherProfBuild(defenses, profWord, 'Heavy Armor', otherProfsNum, profHeavyArmor);
    }
    let profUnarmoredDefense = g_profMap.get("Unarmored_Defense");
    if(profUnarmoredDefense != null){
        let profWord = getProfNameFromNumUps(profUnarmoredDefense.NumUps);
        otherProfsNum++;
        otherProfBuild(defenses, profWord, 'Unarmored Defense', otherProfsNum, profUnarmoredDefense);
    }
    for(const [profName, profData] of g_profMap.entries()){
        if(profData.For == "Defense" && profName != "Light_Armor" && profName != "Medium_Armor" && profName != "Heavy_Armor" && profName != "Unarmored_Defense"){
            let dProfName = profName.replace(/_/g,' ');
            let profWord = getProfNameFromNumUps(profData.NumUps);
            otherProfsNum++;
            otherProfBuild(defenses, profWord, capitalizeWords(dProfName), otherProfsNum, profData);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////// Spells ////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    let spells = $("#spellsContent");
    spells.html('');

    let arcaneSpellAttack = g_profMap.get("ArcaneSpellAttacks");
    if(arcaneSpellAttack != null){
        let profWord = getProfNameFromNumUps(arcaneSpellAttack.NumUps);
        otherProfsNum++;
        otherProfBuild(spells, profWord, 'Arcane Attacks', otherProfsNum, arcaneSpellAttack);
    }

    let arcaneSpellDC = g_profMap.get("ArcaneSpellDCs");
    if(arcaneSpellDC != null){
        let profWord = getProfNameFromNumUps(arcaneSpellDC.NumUps);
        otherProfsNum++;
        otherProfBuild(spells, profWord, 'Arcane DCs', otherProfsNum, arcaneSpellDC);
    }

    let divineSpellAttack = g_profMap.get("DivineSpellAttacks");
    if(divineSpellAttack != null){
        let profWord = getProfNameFromNumUps(divineSpellAttack.NumUps);
        otherProfsNum++;
        otherProfBuild(spells, profWord, 'Divine Attacks', otherProfsNum, divineSpellAttack);
    }

    let divineSpellDC = g_profMap.get("DivineSpellDCs");
    if(divineSpellDC != null){
        let profWord = getProfNameFromNumUps(divineSpellDC.NumUps);
        otherProfsNum++;
        otherProfBuild(spells, profWord, 'Divine DCs', otherProfsNum, divineSpellDC);
    }

    let occultSpellAttack = g_profMap.get("OccultSpellAttacks");
    if(occultSpellAttack != null){
        let profWord = getProfNameFromNumUps(occultSpellAttack.NumUps);
        otherProfsNum++;
        otherProfBuild(spells, profWord, 'Occult Attacks', otherProfsNum, occultSpellAttack);
    }

    let occultSpellDC = g_profMap.get("OccultSpellDCs");
    if(occultSpellDC != null){
        let profWord = getProfNameFromNumUps(occultSpellDC.NumUps);
        otherProfsNum++;
        otherProfBuild(spells, profWord, 'Occult DCs', otherProfsNum, occultSpellDC);
    }

    let primalSpellAttack = g_profMap.get("PrimalSpellAttacks");
    if(primalSpellAttack != null){
        let profWord = getProfNameFromNumUps(primalSpellAttack.NumUps);
        otherProfsNum++;
        otherProfBuild(spells, profWord, 'Primal Attacks', otherProfsNum, primalSpellAttack);
    }

    let primalSpellDC = g_profMap.get("PrimalSpellDCs");
    if(primalSpellDC != null){
        let profWord = getProfNameFromNumUps(primalSpellDC.NumUps);
        otherProfsNum++;
        otherProfBuild(spells, profWord, 'Primal DCs', otherProfsNum, primalSpellDC);
    }

    if(spells.html() == ''){
        $('#spellsContentSection').addClass('is-hidden');
    } else {
        $('#spellsContentSection').removeClass('is-hidden');
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////// Skills ////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    let skills = $("#skills");
    skills.html('<p class="is-size-5"><strong class="has-text-grey-lighter">Skills</strong></p><hr class="border-secondary is-marginless">');
    let hasFascinatedCondition = hasCondition(14); // Hardcoded - Fascinated condition decreases all skills by -2
    for(const [skillName, skillData] of g_skillMap.entries()){
        let profData = g_profMap.get(skillName);
        if(profData == null){ profData = skillData; }

        let skillButtonID = ("skillButton"+skillName).replace(/ /g,'_');

        let abilMod = getMod(g_abilMap.get(skillData.Skill.ability));
        let profNum = getProfNumber(profData.NumUps, g_character.level);

        let totalBonus = getStatTotal('SKILL_'+skillName);
        if(hasFascinatedCondition){
            totalBonus -= 2;
        }

        let conditionalStar = (hasConditionals('SKILL_'+skillName)) ? '<sup class="is-size-7 has-text-info">*</sup>' : '';

        skills.append('<a id="'+skillButtonID+'" class="panel-block skillButton border-dark-lighter"><span class="panel-icon has-text-grey-lighter">'+signNumber(totalBonus)+conditionalStar+'</span><span class="pl-3 has-text-grey-light">'+skillName+'</span></a>');

        $('#'+skillButtonID).click(function(){
            openQuickView('skillView', {
                Skill : skillData.Skill,
                SkillName : skillName,
                ProfData : profData,
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

    for(const feat of g_featChoiceArray){
        let featStruct = g_featMap.get(feat.value.id+"");

        // Hardcoded Exploration and Downtime Tag IDs
        let explorationTag = featStruct.Tags.find(tag => {
            return tag.id === 15;
        });
        let downtimeTag = featStruct.Tags.find(tag => {
            return tag.id === 218;
        });

        featStruct.Feat.isCore = 1;
        if(explorationTag != null){
            explorationFeatStructArray.push(featStruct);
        } else if(downtimeTag != null){
            downtimeFeatStructArray.push(featStruct);
        } else if(feat.value.actions != 'NONE'){
            encounterFeatStructArray.push(featStruct);
        }
    }

    for(const [featID, featStruct] of g_featMap.entries()){

        if(featStruct.Feat.isDefault == 1){

            // Hardcoded Exploration and Downtime Tag IDs
            let explorationTag = featStruct.Tags.find(tag => {
                return tag.id === 15;
            });
            let downtimeTag = featStruct.Tags.find(tag => {
                return tag.id === 218;
            });
    
            if(explorationTag != null){
                featStruct.Feat.isCore = 1;
                explorationFeatStructArray.push(featStruct);
            } else if(downtimeTag != null){
                featStruct.Feat.isCore = 1;
                downtimeFeatStructArray.push(featStruct);
            } else if(featStruct.Feat.actions != 'NONE'){
                encounterFeatStructArray.push(featStruct);
            }
        }
    }


    encounterFeatStructArray = encounterFeatStructArray.sort(
        function(a, b) {
            return (a.Feat.name > b.Feat.name) ? 1 : -1;
        }
    );
    explorationFeatStructArray = explorationFeatStructArray.sort(
        function(a, b) {
            return (a.Feat.name > b.Feat.name) ? 1 : -1;
        }
    );
    downtimeFeatStructArray = downtimeFeatStructArray.sort(
        function(a, b) {
            return (a.Feat.name > b.Feat.name) ? 1 : -1;
        }
    );

    $('#actionsTab').click(function(event, preventQuickviewClose){
        if(preventQuickviewClose){
            event.stopImmediatePropagation();
        }
        changeTab('actionsTab', {
            FeatMap : g_featMap,
            FeatChoiceArray : g_featChoiceArray,
            SkillMap : g_skillMap,
            EncounterFeatStructArray : encounterFeatStructArray,
            ExplorationFeatStructArray : explorationFeatStructArray,
            DowntimeFeatStructArray : downtimeFeatStructArray
        });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////// Weapons Tab //////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $('#weaponsTab').click(function(event, preventQuickviewClose){
        if(preventQuickviewClose){
            event.stopImmediatePropagation();
        }
        changeTab('weaponsTab', {
            StrMod : getMod(getStatTotal('SCORE_STR')),
            DexMod : getMod(getStatTotal('SCORE_DEX')),
            Size : g_ancestry.size,
        });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////// Spells Tab //////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $('#spellsTab').click(function(event, preventQuickviewClose){
        if(preventQuickviewClose){
            event.stopImmediatePropagation();
        }
        changeTab('spellsTab', null);
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
    ///////////////////////////////////////// Details Tab //////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $('#detailsTab').click(function(event, preventQuickviewClose){
        if(preventQuickviewClose){
            event.stopImmediatePropagation();
        }
        changeTab('detailsTab', {
            FeatMap : g_featMap,
            FeatChoiceArray : g_featChoiceArray,
            AbilityMap : g_abilMap,
            AncestryTagsArray : g_charTagsArray,
            Character : g_character,
            Heritage : g_heritage,
            Background : g_background,
            PhyFeats : g_phyFeatArray,
            ClassDetails : g_classDetails,
            Ancestry : g_ancestry,
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
    for(const lang of g_langArray){
        if(langCount != 0){languagesContent.append(', ');}
        langCount++;
        let langID = 'langLink'+lang.value.id+"C"+langCount;
        languagesContent.append('<a id="'+langID+'" class="is-size-6">'+lang.value.name+'</a>');
        $('#'+langID).click(function(){
            openQuickView('languageView', {
                Language : lang.value
            });
        });
    }


}

////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// Health ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function initHealthAndTemp() {

    let maxHealth = $('#char-max-health');
    let maxHealthNum = getStatTotal('MAX_HEALTH');
    maxHealthNum += (g_classDetails.Class.hitPoints+getStatTotal('MAX_HEALTH_BONUS_PER_LEVEL'))*g_character.level;

    // Drained Condition Reduces HP and MaxHP - Only Reduces MaxHP
    let drainedCondition = getCondition(10); // Hardcoded ID - Drained
    if(drainedCondition != null){
        maxHealthNum -= drainedCondition.Value * g_character.level;
        if(maxHealthNum < 0){ maxHealthNum = 0; }
    }

    maxHealth.html(maxHealthNum);

    if(g_character.currentHealth == null){
        g_character.currentHealth = maxHealthNum;
    }
    g_character.currentHealth = (g_character.currentHealth > maxHealthNum) ? maxHealthNum : g_character.currentHealth;

    let currentHealth = $('#char-current-health');
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
        let newCurrentHealth = parseInt(currentHealthNum);
        
        if(g_character.currentHealth === 0 && newCurrentHealth > 0){
            removeCondition(11); // Hardcoded ID - Remove Dying Condition
            let woundedCondition = getCondition(35); // Hardcoded ID - Wounded
            if(woundedCondition != null){
                let woundedValue = woundedCondition.Value + 1;
                addCondition(35,
                    woundedValue,
                    woundedCondition.SourceText,
                    woundedCondition.ParentID);
            } else {
                addCondition(35, 1, null);
            }
        }

        g_character.currentHealth = newCurrentHealth;
        let bulmaTextColor = getBulmaTextColorFromCurrentHP(g_character.currentHealth, maxHealthNum);
        $('#char-current-health').html('<p class="is-size-5 is-unselectable text-center '+bulmaTextColor+'" style="width: 70px;">'+g_character.currentHealth+'</p>');
        $('#char-current-health').removeClass('is-in-input-mode');
        socket.emit("requestCurrentHitPointsSave",
            getCharIDFromURL(),
            g_character.currentHealth);

        if(g_character.currentHealth === 0){
            let dyingValue = 1;
            let woundedCondition = getCondition(35); // Hardcoded ID - Wounded
            if(woundedCondition != null){
                dyingValue += woundedCondition.Value;
            }
            addCondition(11, dyingValue, null); // Hardcoded ID - Add Dying Condition
        }

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

        let profData = g_armorProfMap.get(armorStruct.Item.Item.id);

        let profNumUps = null;
        let profBonus = null;
        if(profData != null){
            profNumUps = profData.NumUps;
            profBonus = profData.UserBonus;
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
        totalAC += getStatTotal('AC');

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
            addStat('SPEED', 'PENALTY (ARMOR)', speedPenalty);
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

        let profData = g_armorProfMap.get(31); // No Armor Hidden Item ID

        let profNumUps = null;
        let profBonus = null;
        if(profData != null){
            profNumUps = profData.NumUps;
            profBonus = profData.UserBonus;
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
                processSheetCode(propertyRuneCode, 'ARMOR_PROPERTY_RUNE');
            }
            return;
        }
    }

}

function applyArmorCheckPenaltyToSkill(skillName, checkPenalty){

    addStat('SKILL_'+skillName, 'PENALTY (ARMOR)', checkPenalty);
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
//////////////////////////////////////// Rune Data Struct //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function generateRuneDataStruct(){

    let weaponRuneArray = [];
    let armorRuneArray = [];
    for(const [itemID, itemData] of g_itemMap.entries()){
        if(itemData.RuneData != null){
            if(itemData.RuneData.etchedType == 'WEAPON'){
                weaponRuneArray[itemData.RuneData.id] = itemData;
            } else if(itemData.RuneData.etchedType == 'ARMOR'){
                armorRuneArray[itemData.RuneData.id] = itemData;
            }
        }
    }
    weaponRuneArray = weaponRuneArray.sort(
        function(a, b) {
            if(a.RuneData.isFundamental == 1 && b.RuneData.isFundamental == 1){
                return a.Item.id - b.Item.id;
            } else {
                return a.Item.name > b.Item.name ? 1 : -1;
            }
        }
    );
    armorRuneArray = armorRuneArray.sort(
        function(a, b) {
            if(a.RuneData.isFundamental == 1 && b.RuneData.isFundamental == 1){
                return a.Item.id - b.Item.id;
            } else {
                return a.Item.name > b.Item.name ? 1 : -1;
            }
        }
    );

    return { WeaponArray : weaponRuneArray, ArmorArray : armorRuneArray };

}

////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// Determine Bulk And Coins ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function determineBulkAndCoins(invItems, itemMap, strMod){

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

    let encumberedSrcText = 'Exceeding the amount of Bulk you can even hold.';
    if(totalBulk > weightMax) { // Hardcoded Condition IDs
        addCondition(13, null, encumberedSrcText);
        cantMove = true;
    } else {
        removeCondition(13, encumberedSrcText);

        let immobilizedSrcText = 'Holding more Bulk than you can carry.';
        if(totalBulk > weightEncumbered){
            addCondition(1, null, immobilizedSrcText);
            isEncumbered = true;
        } else {
            removeCondition(1, immobilizedSrcText);
        }
        
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
//////////////////////////////////// Determine Investitures ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function determineInvestitures(){

    let incredibleInvest = g_featChoiceArray.find(feat => {
        return feat.value.id == 700; // Hardcoded Incredible Invest Feat ID
    });

    if(incredibleInvest != null){
        maxInvests = 12;
    } else {
        maxInvests = 10;
    }

    currentInvests = 0;
    for(const invItem of g_invStruct.InvItems){
        if(invItem.isInvested == 1) {
            currentInvests++;

            console.log(invItem.code);
            processSheetCode(invItem.code, invItem.name);

        }
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// Feats and Abilities Code ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function runAllFeatsAndAbilitiesCode() {
    
    for(const feat of g_featChoiceArray){
        if(feat != null && feat.value != null){
            processSheetCode(feat.value.code, feat.value.name);
        }
    }

    for(const [featID, featStruct] of g_featMap.entries()){
        if(featStruct.Feat.isDefault == 1){
            processSheetCode(featStruct.Feat.code, featStruct.Feat.name);
        }
    }

    for(let classAbil of g_classDetails.Abilities){
        if(classAbil.selectType != 'SELECT_OPTION' && classAbil.level <= g_character.level) {
            processSheetCode(classAbil.code, classAbil.name);

            if(classAbil.selectType == "SELECTOR"){
                for(let classAbilChoice of g_classDetails.AbilityChoices){
                    if(classAbilChoice.SelectorID == classAbil.id){

                        let abilityOption = g_classDetails.Abilities.find(ability => {
                            return ability.id == classAbilChoice.OptionID;
                        });
                        processSheetCode(abilityOption.code, abilityOption.name);

                        break;

                    }
                }
            }

        }
    }

    for(let phyFeat of g_phyFeatArray){
        processSheetCode(phyFeat.value.code, phyFeat.value.name);
    }
    
    processSheetCode(g_heritage.code, g_heritage.name+' Heritage');
    processSheetCode(g_background.code, g_background.name+' Background');

}

////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Other Profs //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function otherProfBuild(content, prof, name, otherProfsNum, profData){

    if(profData.UserAdded){
        prof = '<span class="is-underlined">'+prof+'</span>';
    } else {
        prof = '<span>'+prof+'</span>';
    }

    content.append('<div id="otherProf'+otherProfsNum+'" class="cursor-clickable"><span class="is-size-7 is-italic">'+prof+' - </span><span class="is-size-7 has-text-weight-bold">'+name+'</span></div>');

    $("#otherProf"+otherProfsNum).click(function(){
        openQuickView('otherProfsView', {
            ProfData : profData,
            Name : name,
        });
    });

}

////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////// Rest /////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function takeRest(){

    // Regen Health
    let conMod = getModOfValue('CON');
    if(1 > conMod){ conMod = 1; }
    let regenAmount = g_character.level*conMod;
    g_character.currentHealth += regenAmount;

    socket.emit("requestCurrentHitPointsSave",
        getCharIDFromURL(),
        g_character.currentHealth);


    // Reset Innate Spells
    for(let innateSpell of g_innateSpellArray){
        innateSpell.TimesCast = 0;
        socket.emit("requestInnateSpellCastingUpdate",
            innateSpell,
            0);
    }

    // Reset Focus Spells
    for(const [spellSRC, focusSpellArray] of g_focusSpellMap.entries()){
        for(let focusSpellData of focusSpellArray){
            focusSpellData.Used = 0;
            socket.emit("requestFocusSpellCastingUpdate",
                getCharIDFromURL(),
                focusSpellData,
                spellSRC,
                focusSpellData.SpellID,
                focusSpellData.Used);
        }
    }

    // Reset Spell Slots
    for(const [level, slotArray] of g_spellSlotsMap.entries()){
        for(let slot of slotArray){
            slot.used = false;
            socket.emit("requestSpellSlotUpdate",
                getCharIDFromURL(),
                slot);
        }
    }

    // Remove Fatigued Condition
    removeCondition(15); // Hardcoded ID - Fatigued

    // Decrease Drained Condition
    let drainedCondition = getCondition(10); // Hardcoded ID - Drained
    if(drainedCondition != null){
        let drainedValue = drainedCondition.Value - 1;
        if(drainedValue > 0){
            addCondition(10,
                drainedValue,
                drainedCondition.SourceText,
                drainedCondition.ParentID);
        } else {
            removeCondition(10);
        }
    }

    // Decrease Doomed Condition
    let doomedCondition = getCondition(9); // Hardcoded ID - Doomed
    if(doomedCondition != null){
        let doomedValue = doomedCondition.Value - 1;
        if(doomedValue > 0){
            addCondition(9,
                doomedValue,
                doomedCondition.SourceText,
                doomedCondition.ParentID);
        } else {
            removeCondition(9);
        }
    }

    loadCharSheet();
    
}

////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Socket Returns ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

socket.on("returnFinalProfs", function(profObject, skillObject){
    g_profMap = objToMap(profObject);
    g_skillMap = objToMap(skillObject);
    g_weaponProfMap = buildWeaponProfMap();
    g_armorProfMap = buildArmorProfMap();
    loadCharSheet();
    closeQuickView();
});

socket.on("returnHeroPointsSave", function(){
});

socket.on("returnProficiencyChange", function(profChangePacket){
    socket.emit("requestFinalProfs",
        getCharIDFromURL());
});

socket.on("returnAddFundamentalRune", function(invItemID, invStruct){
    $('#invItemAddFundamentalRuneButton'+invItemID).removeClass('is-loading');
    g_invStruct = invStruct;
    loadCharSheet();
    closeQuickView();
});

socket.on("returnAddItemToInv", function(item, invItem, invStruct){
    $('#addItemAddItem'+item.id).removeClass('is-loading');
    $('#createCustomItemBtn').removeClass('is-loading');
    g_invStruct = invStruct;
    processDefaultItemRuneSheetCode(item.code, invItem.id);
    loadCharSheet();
});

socket.on("returnRemoveItemFromInv", function(invItemID, invStruct){
    $('#invItemRemoveButton'+invItemID).removeClass('is-loading');
    g_invStruct = invStruct;
    loadCharSheet();
    closeQuickView();
});

socket.on("returnInvItemMoveBag", function(invItemID, invStruct){
    $('#invItemMoveSelect'+invItemID).removeClass('is-loading');
    g_invStruct = invStruct;
    loadCharSheet();
    closeQuickView();
});

socket.on("returnInvItemUpdated", function(invStruct){
    g_invStruct = invStruct;
    loadCharSheet();
    closeQuickView();
});

