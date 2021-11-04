/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

$(function () {

  startDiceLoader();
  socket.emit("requestPlannerCore");

  // Create the container for each level
  $(`#creation-section`).html(`
    <div class="accord-container accord-creation-container my-1">
      <div class="accord-header">
        <span class="title-font pl-2">Initial Stats <span class="has-txt-noted is-italic">(Level 1)</span></span>
        <span class="accord-indicate-unselected-options"></span>
        <span class="icon is-pulled-right">
          <i class="accord-chevron fas fa-chevron-down"></i>
        </span>
      </div>
      <div class="accord-body is-hidden">
        <div id="initial-stats-ancestry"></div>
        <div id="initial-stats-background"></div>
        <div id="initial-stats-class"></div>
      </div>
    </div>
  `);
  for(let lvl = 1; lvl <= g_char_level; lvl++){
    $(`#creation-section`).append(`
      <div class="accord-container accord-creation-container my-1">
        <div class="accord-header">
          <span class="title-font pl-2">Level ${lvl}</span>
          <span class="accord-indicate-unselected-options"></span>
          <span class="icon is-pulled-right">
            <i class="accord-chevron fas fa-chevron-down"></i>
          </span>
        </div>
        <div id="level-${lvl}-body" class="accord-body is-hidden">
        </div>
      </div>
    `);
  }

});

socket.on("returnPlannerCore", function(coreStruct) {
  stopDiceLoader();
  mainLoaded(coreStruct.plannerStruct, coreStruct.choiceStruct);
});






let g_character = null;
let gOption_hasProfWithoutLevel = false;

let g_char_level = 10;

let temp_classNum = 1;
let g_unselectedData = null;

let g_featMap = null;
let g_itemMap = null;
let g_spellMap = null;
let g_skillMap = null;

let g_allLanguages = null;
let g_allConditions = null;
let g_allTags = null;
let g_allPhyFeats = null;
let g_allSenses = null;

let g_classMap = null;
let g_ancestryMap = null;
let g_archetypes = null;
let g_backgrounds = null;
let g_uniHeritages = null;


function mainLoaded(plannerCoreStruct, choiceStruct){

  console.log(plannerCoreStruct);

  // Core Data //
  g_featMap = objToMap(plannerCoreStruct.featsObject);
  g_itemMap = objToMap(plannerCoreStruct.itemObject);
  g_spellMap = objToMap(plannerCoreStruct.spellObject);
  g_skillMap = objToMap(plannerCoreStruct.skillObject);

  g_allLanguages = plannerCoreStruct.allLanguages;
  g_allConditions = plannerCoreStruct.allConditions;
  g_allTags = plannerCoreStruct.allTags;
  g_allPhyFeats = plannerCoreStruct.allPhyFeats;
  g_allSenses = plannerCoreStruct.allSenses;

  g_classMap = objToMap(plannerCoreStruct.classes);
  g_ancestryMap = objToMap(plannerCoreStruct.ancestries);
  g_archetypes = plannerCoreStruct.archetypes;
  g_backgrounds = plannerCoreStruct.backgrounds;
  g_uniHeritages = plannerCoreStruct.uniHeritages;
  //          //

  console.log(choiceStruct);

  g_unselectedData = [];
  for(let metaData of choiceStruct.charMetaData){
    if(metaData.source == 'unselectedData'){
      g_unselectedData.push(JSON.parse(metaData.value));
    }
  }

  initDataMap(choiceStruct.charMetaData);

  g_character = choiceStruct.character;
  gOption_hasProfWithoutLevel = (g_character.variantProfWithoutLevel === 1);


  initVariables();

  // Process Modules //
  processClass();
  processAncestry();
  processBackground();

  // Open First Accordion //
  $(`#level-${g_char_level}-body`).parent().find('.accord-header').trigger('click');
  // Scroll down to Accordion
  $(`#level-${g_char_level}-body`).parent()[0].scrollIntoView();

  // Display Results //
  displayStats();

  if(getCharAncestry() != null){
    $('#selected-ancestry').text(getCharAncestry().Ancestry.name);
  }
  if(getCharBackground() != null){
    $('#selected-background').text(getCharBackground().name);
  }
  if(getCharClass() != null){
    $('#selected-class').text(getCharClass().Class.name);
  }

  // Change ancestry
  let ancestrySelections = [];
  for(const [ancestryID, ancestryData] of g_ancestryMap.entries()){
    if(ancestryData.Ancestry.isArchived == 1){ continue; }
    ancestrySelections.push({
      id: ancestryID,
      name: ancestryData.Ancestry.name,
      rarity: ancestryData.Ancestry.rarity
    });
  }
  ancestrySelections = ancestrySelections.sort(
    function(a, b) {
      return a.name > b.name ? 1 : -1;
    }
  );
  ancestrySelections = [{id: 'none', name: 'None', rarity: 'COMMON'}, ...ancestrySelections];
  $('#selected-ancestry').click(function() {
    new ModalSelection('Select Ancestry', 'Confirm Ancestry', ancestrySelections, 'ancestry', 'modal-select-ancestry', 'modal-select-ancestry-confirm-btn', g_featMap, 'none');
    $('#modal-select-ancestry-confirm-btn').click(function() {
      console.log('Clicked butn');
    });
  });

  // Change background
  let backgroundSelections = [];
  for(const background of g_backgrounds){
    if(background.isArchived == 1){ continue; }
    backgroundSelections.push({
      id: background.id,
      name: background.name,
      rarity: background.rarity
    });
  }
  backgroundSelections = backgroundSelections.sort(
    function(a, b) {
      return a.name > b.name ? 1 : -1;
    }
  );
  backgroundSelections = [{id: 'none', name: 'None', rarity: 'COMMON'}, ...backgroundSelections];
  $('#selected-background').click(function() {
    new ModalSelection('Select Background', 'Confirm Background', backgroundSelections, 'background', 'modal-select-background', 'modal-select-background-confirm-btn', g_featMap, 'none');
    $('#modal-select-background-confirm-btn').click(function() {
      console.log('Clicked butn');
    });
  });

  // Change class
  let classSelections = [];
  for(const [classID, classData] of g_classMap.entries()){
    if(classData.Class.isArchived == 1){ continue; }
    classSelections.push({
      id: classID,
      name: classData.Class.name,
      rarity: classData.Class.rarity
    });
  }
  classSelections = classSelections.sort(
    function(a, b) {
      return a.name > b.name ? 1 : -1;
    }
  );
  classSelections = [{id: 'none', name: 'None', rarity: 'COMMON'}, ...classSelections];
  $('#selected-class').click(function() {
    new ModalSelection('Select Class', 'Confirm Class', classSelections, 'class', 'modal-select-class', 'modal-select-class-confirm-btn', g_featMap, 269);
    $('#modal-select-class-confirm-btn').click(function() {
      console.log('Clicked butn');
    });
  });


}

function displayStats(){

  // Scores
  $('#str-score').text(variables_getTotal(VARIABLE.SCORE_STR));
  $('#dex-score').text(variables_getTotal(VARIABLE.SCORE_DEX));
  $('#con-score').text(variables_getTotal(VARIABLE.SCORE_CON));
  $('#int-score').text(variables_getTotal(VARIABLE.SCORE_INT));
  $('#wis-score').text(variables_getTotal(VARIABLE.SCORE_WIS));
  $('#cha-score').text(variables_getTotal(VARIABLE.SCORE_CHA));

  // Hit Points
  let maxHealth = variables_getTotal(VARIABLE.MAX_HEALTH);
  let maxHealthPerLevel = 0;
  if(getCharClass() != null){
    maxHealthPerLevel = (getCharClass().Class.hitPoints+getMod(variables_getTotal(VARIABLE.SCORE_CON))+variables_getTotal(VARIABLE.MAX_HEALTH_BONUS_PER_LEVEL))*g_character.level;
  }
  $('#hit-points-total').text(maxHealth+maxHealthPerLevel);

  // Class DC
  $('#class-dc-total').text(variables_getTotal(VARIABLE.CLASS_DC)+10);
  $('#class-dc-rank').text(variables_getFinalRank(VARIABLE.CLASS_DC));

  // Perception
  $('#perception-total').text(signNumber(variables_getTotal(VARIABLE.PERCEPTION)));
  $('#perception-rank').text(variables_getFinalRank(VARIABLE.PERCEPTION));

  // Resists / Weaks
  let resistances = variables_getFullString(VARIABLE.RESISTANCES);
  let weaknesses = variables_getFullString(VARIABLE.WEAKNESSES);
  populateAccord('resist-weaks-body', []);

  let saves = [
    {
      Value1: 'Fortitude',
      Value2: signNumber(variables_getTotal(VARIABLE.SAVE_FORT)),
      Value3: variables_getFinalRank(VARIABLE.SAVE_FORT),
      VarName: VARIABLE.SAVE_FORT,
    },
    {
      Value1: 'Reflex',
      Value2: signNumber(variables_getTotal(VARIABLE.SAVE_REFLEX)),
      Value3: variables_getFinalRank(VARIABLE.SAVE_REFLEX),
      VarName: VARIABLE.SAVE_REFLEX,
    },
    {
      Value1: 'Will',
      Value2: signNumber(variables_getTotal(VARIABLE.SAVE_WILL)),
      Value3: variables_getFinalRank(VARIABLE.SAVE_WILL),
      VarName: VARIABLE.SAVE_WILL,
    },
  ];
  populateAccord('saves-body', saves);

  let skills = [
    {
      Value1: 'Acrobatics',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_ACROBATICS)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_ACROBATICS),
      VarName: VARIABLE.SKILL_ACROBATICS,
    },
    {
      Value1: 'Arcana',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_ARCANA)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_ARCANA),
      VarName: VARIABLE.SKILL_ARCANA,
    },
    {
      Value1: 'Athletics',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_ATHLETICS)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_ATHLETICS),
      VarName: VARIABLE.SKILL_ATHLETICS,
    },
    {
      Value1: 'Crafting',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_CRAFTING)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_CRAFTING),
      VarName: VARIABLE.SKILL_CRAFTING,
    },
    {
      Value1: 'Deception',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_DECEPTION)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_DECEPTION),
      VarName: VARIABLE.SKILL_DECEPTION,
    },
    {
      Value1: 'Diplomacy',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_DIPLOMACY)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_DIPLOMACY),
      VarName: VARIABLE.SKILL_DIPLOMACY,
    },
    {
      Value1: 'Intimidation',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_INTIMIDATION)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_INTIMIDATION),
      VarName: VARIABLE.SKILL_INTIMIDATION,
    },
    {
      Value1: 'Medicine',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_MEDICINE)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_MEDICINE),
      VarName: VARIABLE.SKILL_MEDICINE,
    },
    {
      Value1: 'Nature',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_NATURE)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_NATURE),
      VarName: VARIABLE.SKILL_NATURE,
    },
    {
      Value1: 'Occultism',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_OCCULTISM)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_OCCULTISM),
      VarName: VARIABLE.SKILL_OCCULTISM,
    },
    {
      Value1: 'Performance',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_PERFORMANCE)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_PERFORMANCE),
      VarName: VARIABLE.SKILL_PERFORMANCE,
    },
    {
      Value1: 'Religion',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_RELIGION)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_RELIGION),
      VarName: VARIABLE.SKILL_RELIGION,
    },
    {
      Value1: 'Society',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_SOCIETY)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_SOCIETY),
      VarName: VARIABLE.SKILL_SOCIETY,
    },
    {
      Value1: 'Stealth',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_STEALTH)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_STEALTH),
      VarName: VARIABLE.SKILL_STEALTH,
    },
    {
      Value1: 'Survival',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_SURVIVAL)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_SURVIVAL),
      VarName: VARIABLE.SKILL_SURVIVAL,
    },
    {
      Value1: 'Thievery',
      Value2: signNumber(variables_getTotal(VARIABLE.SKILL_THIEVERY)),
      Value3: variables_getFinalRank(VARIABLE.SKILL_THIEVERY),
      VarName: VARIABLE.SKILL_THIEVERY,
    },
  ];

  const sortedLoreDataArray = getDataAll(DATA_SOURCE.LORE).sort(
    function(a, b) {
      return a.value > b.value ? 1 : -1;
    }
  );
  for(const loreData of sortedLoreDataArray){
    skills.push({
      Value1: capitalizeWords(loreData.value)+' Lore',
      Value2: signNumber(variables_getTotal(`SKILL_${profConversion_convertOldName(loreData.value)}_LORE`)),
      Value3: variables_getFinalRank(`SKILL_${profConversion_convertOldName(loreData.value)}_LORE`),
      VarName: `SKILL_${profConversion_convertOldName(loreData.value)}_LORE`,
    });
  }
  populateAccord('skills-body', skills);

  let attacks = [
    {
      Value1: 'Simple Weapons',
      Value2: variables_getFinalRank(VARIABLE.SIMPLE_WEAPONS),
      VarName: VARIABLE.SIMPLE_WEAPONS,
    },
    {
      Value1: 'Martial Weapons',
      Value2: variables_getFinalRank(VARIABLE.MARTIAL_WEAPONS),
      VarName: VARIABLE.MARTIAL_WEAPONS,
    },
    {
      Value1: 'Advanced Weapons',
      Value2: variables_getFinalRank(VARIABLE.ADVANCED_WEAPONS),
      VarName: VARIABLE.ADVANCED_WEAPONS,
    },
    {
      Value1: 'Unarmed Attacks',
      Value2: variables_getFinalRank(VARIABLE.UNARMED_ATTACKS),
      VarName: VARIABLE.UNARMED_ATTACKS,
    },
  ];
  populateAccord('attacks-body', attacks);

  let defenses = [
    {
      Value1: 'Light Armor',
      Value2: variables_getFinalRank(VARIABLE.LIGHT_ARMOR),
      VarName: VARIABLE.LIGHT_ARMOR,
    },
    {
      Value1: 'Medium Armor',
      Value2: variables_getFinalRank(VARIABLE.MEDIUM_ARMOR),
      VarName: VARIABLE.MEDIUM_ARMOR,
    },
    {
      Value1: 'Heavy Armor',
      Value2: variables_getFinalRank(VARIABLE.HEAVY_ARMOR),
      VarName: VARIABLE.HEAVY_ARMOR,
    },
    {
      Value1: 'Unarmored Defense',
      Value2: variables_getFinalRank(VARIABLE.UNARMORED_DEFENSE),
      VarName: VARIABLE.UNARMORED_DEFENSE,
    },
  ];
  populateAccord('defenses-body', defenses);

  let spellcasting = [];
  const arcaneSpellAttacksRank = variables_getFinalRank(VARIABLE.ARCANE_SPELL_ATTACK);
  if(arcaneSpellAttacksRank != 'U'){
    spellcasting.push({
      Value1: 'Arcane Spell Attacks',
      Value2: arcaneSpellAttacksRank,
      VarName: VARIABLE.ARCANE_SPELL_ATTACK,
    });
  }
  const arcaneSpellDCsRank = variables_getFinalRank(VARIABLE.ARCANE_SPELL_DC);
  if(arcaneSpellDCsRank != 'U'){
    spellcasting.push({
      Value1: 'Arcane Spell DCs',
      Value2: arcaneSpellDCsRank,
      VarName: VARIABLE.ARCANE_SPELL_DC,
    });
  }

  const divineSpellAttacksRank = variables_getFinalRank(VARIABLE.DIVINE_SPELL_ATTACK);
  if(divineSpellAttacksRank != 'U'){
    spellcasting.push({
      Value1: 'Divine Spell Attacks',
      Value2: divineSpellAttacksRank,
      VarName: VARIABLE.DIVINE_SPELL_ATTACK,
    });
  }
  const divineSpellDCsRank = variables_getFinalRank(VARIABLE.DIVINE_SPELL_DC);
  if(divineSpellDCsRank != 'U'){
    spellcasting.push({
      Value1: 'Divine Spell DCs',
      Value2: divineSpellDCsRank,
      VarName: VARIABLE.DIVINE_SPELL_DC,
    });
  }

  const occultSpellAttacksRank = variables_getFinalRank(VARIABLE.OCCULT_SPELL_ATTACK);
  if(occultSpellAttacksRank != 'U'){
    spellcasting.push({
      Value1: 'Occult Spell Attacks',
      Value2: occultSpellAttacksRank,
      VarName: VARIABLE.OCCULT_SPELL_ATTACK,
    });
  }
  const occultSpellDCsRank = variables_getFinalRank(VARIABLE.OCCULT_SPELL_DC);
  if(occultSpellDCsRank != 'U'){
    spellcasting.push({
      Value1: 'Occult Spell DCs',
      Value2: occultSpellDCsRank,
      VarName: VARIABLE.OCCULT_SPELL_DC,
    });
  }

  const primalSpellAttacksRank = variables_getFinalRank(VARIABLE.PRIMAL_SPELL_ATTACK);
  if(primalSpellAttacksRank != 'U'){
    spellcasting.push({
      Value1: 'Primal Spell Attacks',
      Value2: primalSpellAttacksRank,
      VarName: VARIABLE.PRIMAL_SPELL_ATTACK,
    });
  }
  const primalSpellDCsRank = variables_getFinalRank(VARIABLE.PRIMAL_SPELL_DC);
  if(primalSpellDCsRank != 'U'){
    spellcasting.push({
      Value1: 'Primal Spell DCs',
      Value2: primalSpellDCsRank,
      VarName: VARIABLE.PRIMAL_SPELL_DC,
    });
  }
  populateAccord('spellcasting-body', spellcasting);

  let languages = [];
  for(const [key, data] of variables_getExtrasMap(VARIABLE.LANGUAGES).entries()){
    let lang = g_allLanguages.find(lang => {
      return lang.id == data.Value;
    });
    if(lang != null){
      languages.push({
        Value1: lang.name,
        Value2: '',
        CustomQuickview: {name: 'languageView', data: {Language: lang}},
      });
    }
  }
  populateAccord('languages-body', languages);

  let resistWeaks = [];
  for(const [key, data] of variables_getExtrasMap(VARIABLE.RESISTANCES).entries()){
    let dParts = data.Value.split(getSeparator());
    resistWeaks.push({
      Value1: dParts[0]+' '+dParts[1],
      Value2: 'Resist',
    });
  }
  for(const [key, data] of variables_getExtrasMap(VARIABLE.WEAKNESSES).entries()){
    let dParts = data.Value.split(getSeparator());
    resistWeaks.push({
      Value1: dParts[0]+' '+dParts[1],
      Value2: 'Weak',
    });
  }
  populateAccord('resist-weaks-body', resistWeaks);

}


function getCharIDFromURL(){
  return 60423;
}

function getAllAbilityTypes() {
  return ['Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma'];
}

function finishLoadingPage(){

}

function hasDuplicateFeat(featID){
  for(const feat of getDataAll(DATA_SOURCE.FEAT_CHOICE)){
    if(feat.value != null && feat.value == featID) {
      return true;
    }
  }
  return false;
}

function hasDuplicateSelected(selectOptions) {
  let optionValArray = [];
  $(selectOptions).each(function() {
      if($(this).val() != "chooseDefault"){
          optionValArray.push($(this).val());
      }
  });
  return (new Set(optionValArray)).size !== optionValArray.length;
}

function getSkillNameAbbrev(skillName){
  skillName = skillName.toUpperCase();
  switch(skillName) {
    case 'ACROBATICS': return 'Acro.';
    case 'ARCANA': return 'Arcana';
    case 'ATHLETICS': return 'Athletics';
    case 'CRAFTING': return 'Crafting';
    case 'DECEPTION': return 'Deception';
    case 'DIPLOMACY': return 'Diplomacy';
    case 'INTIMIDATION': return 'Intim.';
    case 'LORE': return 'Lore';
    case 'MEDICINE': return 'Medicine';
    case 'NATURE': return 'Nature';
    case 'OCCULTISM': return 'Occultism';
    case 'PERFORMANCE': return 'Perform.';
    case 'RELIGION': return 'Religion';
    case 'SOCIETY': return 'Society';
    case 'STEALTH': return 'Stealth';
    case 'SURVIVAL': return 'Survival';
    case 'THIEVERY': return 'Thievery';
    default: return '';
  }
}

function getSkillIDToName(skillID){
  switch(skillID) { // Hardcoded - Skill IDs
    case 1: return 'Acrobatics';
    case 3: return 'Arcana';
    case 4: return 'Athletics';
    case 5: return 'Crafting';
    case 6: return 'Deception';
    case 7: return 'Diplomacy';
    case 8: return 'Intimidation';
    case 9: return 'Lore';
    case 10: return 'Medicine';
    case 11: return 'Nature';
    case 12: return 'Occultism';
    case 14: return 'Performance';
    case 15: return 'Religion';
    case 16: return 'Society';
    case 17: return 'Stealth';
    case 18: return 'Survival';
    case 19: return 'Thievery';
    default: return 'Unknown';
  }
}