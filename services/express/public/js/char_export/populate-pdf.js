/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

const { PDFDocument } = PDFLib;

function getMod(abilScore) {
  let mod = Math.floor((abilScore-10)/2);
  return mod;
}

function getNumZeroIfNull(number) {
  return (number != null) ? number : 0;
}

function initCharacterExportToPDF(){

  $('#btn-export-to-pdf').click(function() {
    startSpinnerSubLoader();
    socket.emit("requestCharExportPDFInfo", activeModalCharID);
  });

}

socket.on("returnCharExportPDFInfo", function(charInfo, extraData){

  try {
    charExportGeneratePDF(charInfo, extraData);
  } catch (err) {
    console.error('Failed to generate character PDF:');
    console.error(err);
  }

});

let g_featMap = null;

// HARDCODED Names of final profs and PDF fields

// Field names: https://www.pdfescape.com

async function charExportGeneratePDF(charInfo, extraData) {
  const startTime = Date.now();

  g_featMap = objToMap(extraData.featsObject);

  console.log(charInfo);

  const formUrl = '/pdf/character_sheet.pdf';
  const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(formPdfBytes);

  const form = pdfDoc.getForm();


  const profMap = objToMap(charInfo.profs);

  const nameField = form.getTextField('CHARACTER_NAME');
  const playerNameField = form.getTextField('PLAYER_NAME');
  const xpField = form.getTextField('EXPERIENCE_POINTS_XP');
  const ancestryHeritageField = form.getTextField('ANCESTRY');
  const backgroundField = form.getTextField('BACKGROUND');
  const classField = form.getTextField('CLASS');
  const sizeField = form.getTextField('SIZE');
  const alignmentField = form.getTextField('ALIGNMENT');
  const traitsField = form.getTextField('TRAITS');
  const deityField = form.getTextField('DEITY');
  const levelField = form.getTextField('LEVEL');
  const heroPointsField = form.getTextField('HERO_POINTS');

  const strModField = form.getTextField('STR_MOD');
  const dexModField = form.getTextField('DEX_MOD');
  const conModField = form.getTextField('CON_MOD');
  const intModField = form.getTextField('INT_MOD');
  const wisModField = form.getTextField('WIS_MOD');
  const chaModField = form.getTextField('CHA_MOD');

  const strScoreField = form.getTextField('STR_SCORE');
  const dexScoreField = form.getTextField('DEX_SCORE');
  const conScoreField = form.getTextField('CON_SCORE');
  const intScoreField = form.getTextField('INT_SCORE');
  const wisScoreField = form.getTextField('WIS_SCORE');
  const chaScoreField = form.getTextField('CHA_SCORE');

  const fortProfBonusValue = getProfNumber(profToNumUp(profMap.get('Fortitude')), charInfo.character.level);
  const reflexProfBonusValue = getProfNumber(profToNumUp(profMap.get('Reflex')), charInfo.character.level);
  const willProfBonusValue = getProfNumber(profToNumUp(profMap.get('Will')), charInfo.character.level);

  let abilityMods = [];

  let totalAbilityScores = JSON.parse(charInfo.stats.totalAbilityScores);
  for(let abilityScore of totalAbilityScores){
    switch(abilityScore.Name){
      case 'Strength':
        abilityMods['Strength'] = getMod(abilityScore.Score);
        strScoreField.setText(abilityScore.Score+'');
        strModField.setText(signNumber(abilityMods['Strength'])+'');
        break;
      case 'Dexterity':
        abilityMods['Dexterity'] = getMod(abilityScore.Score);
        dexScoreField.setText(abilityScore.Score+'');
        dexModField.setText(signNumber(abilityMods['Dexterity'])+'');
        break;
      case 'Constitution':
        abilityMods['Constitution'] = getMod(abilityScore.Score);
        conScoreField.setText(abilityScore.Score+'');
        conModField.setText(signNumber(abilityMods['Constitution'])+'');
        break;
      case 'Intelligence':
        abilityMods['Intelligence'] = getMod(abilityScore.Score);
        intScoreField.setText(abilityScore.Score+'');
        intModField.setText(signNumber(abilityMods['Intelligence'])+'');
        break;
      case 'Wisdom':
        abilityMods['Wisdom']  = getMod(abilityScore.Score);
        wisScoreField.setText(abilityScore.Score+'');
        wisModField.setText(signNumber(abilityMods['Wisdom'])+'');
        break;
      case 'Charisma':
        abilityMods['Charisma'] = getMod(abilityScore.Score);
        chaScoreField.setText(abilityScore.Score+'');
        chaModField.setText(signNumber(abilityMods['Charisma'])+'');
        break;
      default: break;
    }
  }


  const totalSpeedField = form.getTextField('SPEED');
  const otherSpeedsField = form.getTextField('MOVEMENT_NOTES');

  const totalClassDCField = form.getTextField('DC_VALUE');
  const dcKeyBonusField = form.getTextField('DC_KEY_BONUS');
  const dcProfBonusField = form.getTextField('DC_PROF_BONUS');
  const dcTBox = form.getCheckBox('DC_PROF_T');
  const dcEBox = form.getCheckBox('DC_PROF_E');
  const dcMBox = form.getCheckBox('DC_PROF_M');
  const dcLBox = form.getCheckBox('DC_PROF_L');
  const dcItemBonusField = form.getTextField('DC_ITEM_BONUS');

  // //
  const totalACField = form.getTextField('AC_VALUE');

  const acCapField = form.getTextField('AC_CAP');
  const acProfBonusField = form.getTextField('AC_PROF_BONUS');
  const acProfTrainedField = form.getCheckBox('AC_PROF_T');
  const acProfExpertField = form.getCheckBox('AC_PROF_E');
  const acProfMasterField = form.getCheckBox('AC_PROF_M');
  const acProfLegendaryField = form.getCheckBox('AC_PROF_L');
  const acItemBonusField = form.getTextField('AC_ITEM_BONUS');

  const unarmoredTBox = form.getCheckBox('AC_PROF_UNARMORED_T');
  const unarmoredEBox = form.getCheckBox('AC_PROF_UNARMORED_E');
  const unarmoredMBox = form.getCheckBox('AC_PROF_UNARMORED_M');
  const unarmoredLBox = form.getCheckBox('AC_PROF_UNARMORED_L');
  setProfCheckBox(profMap.get('Unarmored_Defense'), unarmoredTBox, unarmoredEBox, unarmoredMBox, unarmoredLBox);

  const lightArmorTBox = form.getCheckBox('AC_PROF_LIGHT_T');
  const lightArmorEBox = form.getCheckBox('AC_PROF_LIGHT_E');
  const lightArmorMBox = form.getCheckBox('AC_PROF_LIGHT_M');
  const lightArmorLBox = form.getCheckBox('AC_PROF_LIGHT_L');
  setProfCheckBox(profMap.get('Light_Armor'), lightArmorTBox, lightArmorEBox, lightArmorMBox, lightArmorLBox);

  const mediumArmorTBox = form.getCheckBox('AC_PROF_MEDIUM_T');
  const mediumArmorEBox = form.getCheckBox('AC_PROF_MEDIUM_E');
  const mediumArmorMBox = form.getCheckBox('AC_PROF_MEDIUM_M');
  const mediumArmorLBox = form.getCheckBox('AC_PROF_MEDIUM_L');
  setProfCheckBox(profMap.get('Medium_Armor'), mediumArmorTBox, mediumArmorEBox, mediumArmorMBox, mediumArmorLBox);

  const heavyArmorTBox = form.getCheckBox('AC_PROF_HEAVY_T');
  const heavyArmorEBox = form.getCheckBox('AC_PROF_HEAVY_E');
  const heavyArmorMBox = form.getCheckBox('AC_PROF_HEAVY_M');
  const heavyArmorLBox = form.getCheckBox('AC_PROF_HEAVY_L');
  setProfCheckBox(profMap.get('Heavy_Armor'), heavyArmorTBox, heavyArmorEBox, heavyArmorMBox, heavyArmorLBox);

  const shieldACBonusField = form.getTextField('AC_SHIELD_BONUS');
  const shieldHardnessField = form.getTextField('SHIELD_HARDNESS');
  const shieldHealthField = form.getTextField('SHIELD_MAX_HP');
  const shieldBTField = form.getTextField('SHIELD_BROKEN_THRESHOLD');
  const shieldCurrentHPField = form.getTextField('SHIELD_CURRENT_HP');

  // //
  const maxHPField = form.getTextField('HP_MAX');
  const currentHPField = form.getTextField('HP_CURRENT');
  const tempHPField = form.getTextField('TEMPORARY');
  const dyingField = form.getTextField('DYING');
  const woundedField = form.getTextField('WOUNDED');
  const resistancesField = form.getTextField('RESISTANCES');
  const conditionsField = form.getTextField('CONDITIONS');

  const totalPerceptionField = form.getTextField('PERCEPTION_VALUE');
  totalPerceptionField.setText(signNumber(charInfo.stats.totalPerception));

  const perceptionProfBonusField = form.getTextField('PERCEPTION_PROF_BONUS');
  const perceptionProfBonusValue = getProfNumber(profToNumUp(profMap.get('Perception')), charInfo.character.level);
  perceptionProfBonusField.setText(signNumber(perceptionProfBonusValue));
  const perceptionItemBonusField = form.getTextField('PERCEPTION_ITEM_BONUS');

  const percepTBox = form.getCheckBox('PERCEPTION_PROF_T');
  const percepEBox = form.getCheckBox('PERCEPTION_PROF_E');
  const percepMBox = form.getCheckBox('PERCEPTION_PROF_M');
  const percepLBox = form.getCheckBox('PERCEPTION_PROF_L');
  setProfCheckBox(profMap.get('Perception'), percepTBox, percepEBox, percepMBox, percepLBox);

  const sensesField = form.getTextField('SENSES');
  let sensesText = '';
  for(let sense of charInfo.build.senses){
    sensesText += sense.value.name+', ';
  }
  sensesText = sensesText.slice(0, -2);// Trim off that last ', '
  sensesField.setText(sensesText);

  // Saving throws
  let totalSaves = JSON.parse(charInfo.stats.totalSaves);

  const totalFortField = form.getTextField('FORT_VALUE');
  totalFortField.setText(signNumber(totalSaves[0].Bonus)+'');

  // const fortConModField = form.getTextField('FORT_CON_BONUS');
  // fortConModField.setText(signNumber(abilityMods['Constitution'])+'');
  const fortProfBonusField = form.getTextField('FORT_PROF_BONUS');
  fortProfBonusField.setText(signNumber(fortProfBonusValue)+'');
  const fortItemBonusField = form.getTextField('FORT_ITEM_BONUS');

  const fortTBox = form.getCheckBox('FORT_PROF_T');
  const fortEBox = form.getCheckBox('FORT_PROF_E');
  const fortMBox = form.getCheckBox('FORT_PROF_M');
  const fortLBox = form.getCheckBox('FORT_PROF_L');
  setProfCheckBox(profMap.get('Fortitude'), fortTBox, fortEBox, fortMBox, fortLBox);

  const totalReflexField = form.getTextField('REFL_VALUE');
  totalReflexField.setText(signNumber(totalSaves[1].Bonus)+'');

  const reflexProfBonusField = form.getTextField('REFL_PROF_BONUS');
  reflexProfBonusField.setText(signNumber(reflexProfBonusValue)+'');
  const reflexItemBonusField = form.getTextField('REFL_ITEM_BONUS');

  const reflexTBox = form.getCheckBox('REFL_PROF_T');
  const reflexEBox = form.getCheckBox('REFL_PROF_E');
  const reflexMBox = form.getCheckBox('REFL_PROF_M');
  const reflexLBox = form.getCheckBox('REFL_PROF_L');
  setProfCheckBox(profMap.get('Reflex'), reflexTBox, reflexEBox, reflexMBox, reflexLBox);

  const totalWillField = form.getTextField('WILL_VALUE');
  totalWillField.setText(signNumber(totalSaves[2].Bonus)+'');

  const willProfBonusField = form.getTextField('WILL_PROF_BONUS');
  willProfBonusField.setText(signNumber(willProfBonusValue)+'');
  const willItemBonusField = form.getTextField('WILL_ITEM_BONUS');

  const willTBox = form.getCheckBox('WILL_PROF_T');
  const willEBox = form.getCheckBox('WILL_PROF_E');
  const willMBox = form.getCheckBox('WILL_PROF_M');
  const willLBox = form.getCheckBox('WILL_PROF_L');
  setProfCheckBox(profMap.get('Will'), willTBox, willEBox, willMBox, willLBox);

  // Melee and ranged strikes
  const weaponStats = JSON.parse(charInfo.stats.weapons);

  const meleeWeapons = [];
  const rangedWeapons = [];
  charInfo.invItems.forEach(function (item) {
    if (item.itemIsWeapon) {
      const stats = weaponStats.find(function (aStat) {
        return aStat.Name === item.name;
      }, weaponStats);

      if (charInfo.profs[`${item._itemOriginalName}_Weapons`]) {

      }

      if (item.itemWeaponReload) {
        rangedWeapons.push([item, stats]);
      } else {
        meleeWeapons.push([item, stats]);
      }
    }
  });

  meleeWeapons.sort(function (a, b) {
    return b[0].price - a[0].price;
  });
  rangedWeapons.sort(function (a, b) {
    return b[0].price - a[0].price;
  });
  meleeWeapons.every((weapon, index) => {
    fillWeaponFields(form, index + 1, weapon[0], weapon[1])
    return index < 3;
  })
  rangedWeapons.forEach((weapon, index) => {
    fillWeaponFields(form, index + 3, weapon[0], weapon[1])
    return index < 3;
  })

  // Skills

  let totalSkills = JSON.parse(charInfo.stats.totalSkills);

  totalSkills.forEach(function (skill, i) {
    if (!skill.Name.includes('Lore')) {
      const skillName = skill.Name.toUpperCase();
      const bonusField = form.getTextField(`${skillName}_VALUE`);
      bonusField.setText(signNumber(totalSkills[i].Bonus)+'');

      const tBox = form.getCheckBox(`${skillName}_PROF_T`);
      const eBox = form.getCheckBox(`${skillName}_PROF_E`);
      const mBox = form.getCheckBox(`${skillName}_PROF_M`);
      const lBox = form.getCheckBox(`${skillName}_PROF_L`);
      const prof = charInfo.profs[skill.Name];
      setProfCheckBox(prof, tBox, eBox, mBox, lBox);

      const profBonusField = form.getTextField(`${skillName}_PROF_BONUS`);
      const profBonusValue = getProfNumber(profToNumUp(prof), charInfo.character.level);
      profBonusField.setText(signNumber(profBonusValue));
    }
  });

  totalSkills.slice(16, 18).map(function (loreSkill, i) {
    const prof = charInfo.profs[loreSkill.Name];
    const profBonusValue = getProfNumber(profToNumUp(prof), charInfo.character.level);

    const loreNameField = form.getTextField(`LORE_DESC_${i + 1}`);
    const loreBonusField = form.getTextField(`LORE_${i + 1}_VALUE`);
    const loreProfBonusField = form.getTextField(`LORE_${i + 1}_PROF_BONUS`);
    const tBox = form.getCheckBox(`LORE_${i + 1}_PROF_T`);
    const eBox = form.getCheckBox(`LORE_${i + 1}_PROF_E`);
    const mBox = form.getCheckBox(`LORE_${i + 1}_PROF_M`);
    const lBox = form.getCheckBox(`LORE_${i + 1}_PROF_L`);

    loreNameField.setText(loreSkill.Name.replace(' Lore', ''));
    loreBonusField.setText(signNumber(loreSkill.Bonus) + '');
    loreProfBonusField.setText(profBonusValue + '');
    setProfCheckBox(prof, tBox, eBox, mBox, lBox);
  });

  // Weapon Proficiencies

  const simpleWeapTBox = form.getCheckBox('WP_SIMPLE_T');
  const simpleWeapEBox = form.getCheckBox('WP_SIMPLE_E');
  const simpleWeapMBox = form.getCheckBox('WP_SIMPLE_M');
  const simpleWeapLBox = form.getCheckBox('WP_SIMPLE_L');
  setProfCheckBox(profMap.get('Simple_Weapons'),
      simpleWeapTBox, simpleWeapEBox, simpleWeapMBox, simpleWeapLBox);

  const martialWeapTBox = form.getCheckBox('WP_MARTIAL_T');
  const martialWeapEBox = form.getCheckBox('WP_MARTIAL_E');
  const martialWeapMBox = form.getCheckBox('WP_MARTIAL_M');
  const martialWeapLBox = form.getCheckBox('WP_MARTIAL_L');
  setProfCheckBox(profMap.get('Martial_Weapons'),
      martialWeapTBox, martialWeapEBox, martialWeapMBox, martialWeapLBox);

  // All weapons are grouped by proficiency
  let otherAttackProfMap = new Map();
  charInfo.metaData.forEach(function (metadata) {
    if (metadata.source === 'proficiencies') {
      // Regex to find all attacks except Simple and Martial Weapons
      // match[1] = weapon name
      // match[2] = proficiency level
      const matches = metadata.value.match(/^Attack:::(.*):::(\w):::/);
      if (matches && matches[1] !== 'Simple_Weapons' && matches[1] !== 'Martial_Weapons') {
        const cleanName = capitalizeWords(matches[1]).replace('_', ' ');
        otherAttackProfMap.set(cleanName, matches[2]);
      }
    }
  });

  // Print all the weapon proficiencies of the same level together
  // Only two fields are available so higher proficiences are preferred
  let inverseOtherAttackProfMap = new Map();
  for (const [weaponName, prof] of otherAttackProfMap.entries()) {
    if (inverseOtherAttackProfMap.has(prof)) {
      inverseOtherAttackProfMap.get(prof).push(weaponName);
    } else {
      inverseOtherAttackProfMap.set(prof, [weaponName]);
    }
  }

  let count = 0;
  ['L', 'M', 'E', 'T'].forEach(function (prof) {
    const weaponNames = inverseOtherAttackProfMap.get(prof) || [];
    if (!weaponNames.length || count > 1) {
      return;
    }

    const fixedNames = weaponNames
      .sort()
      .join(', ');

    const otherWeaponDeskField = form.getTextField(`WP_OTHER_${count + 1}_DESC`);
    otherWeaponDeskField.setText(fixedNames);
    const otherWeapTBox = form.getCheckBox(`WP_OTHER_${count + 1}_T`);
    const otherWeapEBox = form.getCheckBox(`WP_OTHER_${count + 1}_E`);
    const otherWeapMBox = form.getCheckBox(`WP_OTHER_${count + 1}_M`);
    const otherWeapLBox = form.getCheckBox(`WP_OTHER_${count + 1}_L`);
    setProfCheckBox(prof, otherWeapTBox, otherWeapEBox, otherWeapMBox, otherWeapLBox);

    count++;
  });

  // Languages
  const languagesField = form.getTextField('LANGUAGES');
  const languages = charInfo.build.languages.map(function (language) {
    return language.value != null ? language.value.name : null;
  }).join(', ');
  languagesField.setText(languages);

  /// Feats and Features ///

  // Ancestry Feats
  const ancestryFeatSpecialField = form.getTextField('AF_S1');

  const ancestryFeatHeritageField = form.getTextField('AF_H1');
  ancestryFeatHeritageField.setText(findFeatName(charInfo.build.feats, 'ancestry', 1, 'heritage'));

  const ancestryFeat1Field = form.getTextField('AF_1');
  ancestryFeat1Field.setText(findFeatName(charInfo.build.feats, 'ancestry', 1));

  const ancestryFeat5Field = form.getTextField('AF_5');
  ancestryFeat5Field.setText(findFeatName(charInfo.build.feats, 'ancestry', 5));

  const ancestryFeat9Field = form.getTextField('AF_9');
  ancestryFeat9Field.setText(findFeatName(charInfo.build.feats, 'ancestry', 9));

  const ancestryFeat13Field = form.getTextField('AF_13');
  ancestryFeat13Field.setText(findFeatName(charInfo.build.feats, 'ancestry', 13));

  const ancestryFeat17Field = form.getTextField('AF_17');
  ancestryFeat17Field.setText(findFeatName(charInfo.build.feats, 'ancestry', 17));

  // Skill Feats
  const skillFeatBackgroundField = form.getTextField('SF_B');
  skillFeatBackgroundField.setText(findFeatName(charInfo.build.feats, 'background', 1));

  for (let i = 2; i <= 20; i += 2) {
    const skillFeatField = form.getTextField(`SF_${i}`);
    skillFeatField.setText(findFeatNameWithTrait(charInfo.build.feats, 'skill', 'class', i));
  }

  // General Feats
  for (let i = 3; i <= 19; i += 4) {
    const generalFeatField = form.getTextField(`GF_${i}`);
    generalFeatField.setText(findFeatNameWithTrait(charInfo.build.feats, 'general', 'class', i));
  }

  // Class Feats and abilities
  const classFeats = charInfo.build.feats.filter(function (feat) {
    return feat.sourceType === 'class';
  });

  const classFeat1Field = form.getTextField('CF_1');
  classFeat1Field.setText(findFeatNameWithTrait(charInfo.build.feats, 'skill', 'class', 1, true));

  const bonusFeats = [];
  classFeats.forEach(function (classFeat) {
    if (classFeat.sourceLevel === 1 || (classFeat.sourceLevel % 2 === 0)) {
      const classFeatField = form.getTextField(`CF_${classFeat.sourceLevel}`);
      classFeatField.setText(classFeat.value.name);
    } else {
      bonusFeats.push(classFeat);
    }
  });

  // Class Features

  // TODO Add class features

  // Bonus feats
  bonusFeats.slice(0, 2).forEach(function (feat, i) {
    const bonusFeatField = form.getTextField(`BF_${i + 1}`);
    bonusFeatField.setText(feat.value.name);
  });

  ////

  nameField.setText(charInfo.character.name)

  let heritageAndAncestryName = ''
  if (charInfo.character._heritage == null) {
    heritageAndAncestryName = charInfo.character._ancestry.name
  } else {
    heritageAndAncestryName = charInfo.character._heritage.name
  }
  ancestryHeritageField.setText(heritageAndAncestryName)

  if (charInfo.character._class != null) {
    classField.setText(charInfo.character._class.name)
  }

  if(charInfo.character._background != null){
    backgroundField.setText(charInfo.character._background.name);
  }

  // Armor Class
  let acCurrentDefenseCategory = 'Unarmored_Defense';
  if (charInfo.inventory.equippedArmorCategory === 'HEAVY') {
    acCurrentDefenseCategory = 'Heavy_Armor';
  } else if (charInfo.inventory.equippedArmorCategory === 'MEDIUM') {
    acCurrentDefenseCategory = 'Medium_Armor';
  } else if (charInfo.inventory.equippedArmorCategory === 'LIGHT') {
    acCurrentDefenseCategory = 'Light_Armor';
  }
  const acProf = charInfo.profs[acCurrentDefenseCategory];
  const acProfBonusValue = getProfNumber(profToNumUp(acProf), charInfo.character.level);

  totalACField.setText(charInfo.stats.totalAC+'');
  setProfCheckBox(acProf, acProfTrainedField, acProfExpertField, acProfMasterField, acProfLegendaryField);
  acProfBonusField.setText(signNumber(acProfBonusValue)+'');

  // TODO add item armor class bonus
  // TODO add shield information

  // Speed
  totalSpeedField.setText(charInfo.stats.totalSpeed+'');

  // Hit points
  maxHPField.setText(charInfo.stats.maxHP+'');
  currentHPField.setText(getNumZeroIfNull(charInfo.character.currentHealth)+'');
  tempHPField.setText(getNumZeroIfNull(charInfo.character.tempHealth)+'');

  heroPointsField.setText(charInfo.character.heroPoints+'');
  levelField.setText(charInfo.character.level+'');
  xpField.setText(getNumZeroIfNull(charInfo.character.experience)+'');

  let generalInfo = JSON.parse(charInfo.stats.generalInfo);
  if (generalInfo.size != null) {
    sizeField.setText(generalInfo.size)
  }

  // Class DC
  totalClassDCField.setText(charInfo.stats.totalClassDC+'');
  const keyAbility = charInfo.build.boosts.find(function (boost) {
    return boost.sourceCode === 'keyAbility' && boost.source === 'abilityBonus';
  })['Ability'];
  const keyAbilityModValue = abilityMods[lengthenAbilityType(keyAbility)];
  dcKeyBonusField.setText(signNumber(keyAbilityModValue + ''));
  const dcProf = charInfo.profs['Class_DC'];
  const dcProfValue = getProfNumber(profToNumUp(dcProf), charInfo.character.level);
  setProfCheckBox(dcProf, dcTBox, dcEBox, dcMBox, dcLBox);
  dcProfBonusField.setText(signNumber(dcProfValue)+'');

  let conditionNames = [];
  let wounded = null;
  let dying = null;
  charInfo.conditions.forEach(function (condition) {
    const name = condition._conditionName;
    if (name.startsWith('Dying')) {
      dying = condition.value;
    } else if (name.startsWith('Wounded')) {
      wounded = condition.value;
    } else if (condition.value) {
      conditionNames.push(`${name} ${condition.value}`);
    } else {
      conditionNames.push(name);
    }
  });

  if (wounded) {
    woundedField.setText(wounded + '');
  }
  if (dying) {
    dyingField.setText(dying + '');
  }
  conditionsField.setText(conditionNames.join(', '));

  // Inventory
  const wornItemsField = form.getTextField('WORN_ITEMS_LIST');
  const wornItemsBulkField = form.getTextField('WORN_ITEMS_BULK');
  const wornItemsInvestField = form.getTextField('WORN_ITEMS_INVEST');

  let itemsStr = '';
  let bulkField = '';
  let bulkCount = 0;
  let investCount = 0;

  let copperCount = 0;
  let silverCount = 0;
  let goldCount = 0;
  let platinumCount = 0;

  for (let invItem of charInfo.invItems) {
    if (invItem.name === 'Copper (cp)') {
      copperCount += invItem.quantity;
      continue;
    }
    if (invItem.name === 'Silver (sp)') {
      silverCount += invItem.quantity;
      continue;
    }
    if (invItem.name === 'Gold (gp)') {
      goldCount += invItem.quantity;
      continue;
    }
    if (invItem.name === 'Platinum (pp)') {
      platinumCount += invItem.quantity;
      continue;
    }

    if (invItem.name === 'Fist' || invItem.quantity === 0) {
      continue;
    }

    itemsStr += invItem.name + '\n';
    bulkField += invItem.bulk + '\n';

    bulkCount += invItem.bulk;
    if (invItem.isInvested === 1) {
      investCount++;
    }
  }
  bulkCount = round(bulkCount, 1);

  wornItemsField.setText(itemsStr);
  wornItemsBulkField.setText(bulkField + '');
  wornItemsInvestField.setText(investCount + '');

  const totalField = form.getTextField('CURRENT_BULK');
  totalField.setText(bulkCount + '');

  const encumberedBulkField = form.getTextField('ENCUMBERED_BULK');
  encumberedBulkField.setText((abilityMods['Strength'] + 5) + '');

  const maximumBulkField = form.getTextField('MAXIMUM_BULK');
  maximumBulkField.setText((abilityMods['Strength'] + 10) + '');

  const cpField = form.getTextField('COPPER');
  cpField.setText(copperCount+'');
  const spField = form.getTextField('SILVER');
  spField.setText(silverCount+'');
  const gpField = form.getTextField('GOLD');
  gpField.setText(goldCount+'');
  const ppField = form.getTextField('PLATINUM');
  ppField.setText(platinumCount+'');


  // Character Extra Info
  let extraInfo = JSON.parse(charInfo.character.infoJSON);

  if(extraInfo?.ethnicity) {
    form.getTextField('ETHNICITY').setText(extraInfo.ethnicity);
  }
  if(extraInfo?.nationality) {
    form.getTextField('NATIONALITY').setText(extraInfo.nationality);
  }
  if(extraInfo?.age) {
    form.getTextField('AGE').setText(extraInfo.age);
  }
  let genderPronouns = '';
  if(extraInfo?.gender) {
    genderPronouns += extraInfo.gender;
  }
  if(extraInfo?.pronouns) {
    if(genderPronouns == ''){
      genderPronouns += extraInfo.pronouns;
    } else {
      genderPronouns += ' & '+extraInfo.pronouns;
    }
  }
  form.getTextField('GENDER_PRONOUNS').setText(genderPronouns);

  if(extraInfo?.appearance) {
    form.getTextField('APPEARANCE').setText(extraInfo.appearance);
  }
  if(extraInfo?.personality) {
    form.getTextField('ATTITUDE').setText(extraInfo.personality);
  }
  if(extraInfo?.beliefs) {
    form.getTextField('BELIEFS').setText(extraInfo.beliefs);
  }

  if (extraInfo?.alignment) {
    alignmentField.setText(extraInfo.alignment)
  }

  // Campaign notes

  // Actions and activities

  // Free actions and reactions
  // const freeActionsAndReactionFeats = charInfo.build.feats.filter(function (feat) {
  //   return feat.value && (
  //     feat.value.actions === 'REACTION' ||
  //     feat.value.actions === 'FREE-ACTION'
  //   );
  // });

  const isSpellCaster = !!charInfo.spellBookSpells.length;
  if (isSpellCaster) {
    // Spell Attack roll
    // TODO decide what to do with spell attacks,
    //  at the moment the max related proficiency found is used
    // TODO include penalties in the total spell attack roll value
    const spellKeyAbility = charInfo.metaData.find(function (metadata) {
      return metadata.source === 'spellKeyAbilities';
    }).value.split('=').at(-1);
    const spellKeyAbilityModValue = abilityMods[lengthenAbilityType(spellKeyAbility)];

    const spellAttackRollProficiency = charInfo.metaData.reduce(function (proficiency, metadata) {
      const matches = metadata.value.match(/^SpellAttack:::.*:::(\w):::/);
      if (matches && matches[1] && profToNumUp(matches[1]) > profToNumUp(proficiency)) {
        return matches[1];
      }

      return proficiency;
    }, 'U');
    const spellAttackProfBonusValue = getProfNumber(profToNumUp(spellAttackRollProficiency), charInfo.character.level);
    const spellAttackRollValue = spellKeyAbilityModValue + spellAttackProfBonusValue;

    const spellAttackRollField = form.getTextField('SPELL_ATTACK_VALUE');
    spellAttackRollField.setText(spellAttackRollValue + '');
    const spellAttackRollKeyBonusField = form.getTextField('SPELL_ATTACK_KEY_BONUS');
    spellAttackRollKeyBonusField.setText(signNumber(spellKeyAbilityModValue) + '');
    const spellAttackRollProfBonusField = form.getTextField('SPELL_ATTACK_PROF_BONUS');
    spellAttackRollProfBonusField.setText(signNumber(spellAttackProfBonusValue) + '');
    const spellAttackRollProfTBox = form.getCheckBox('SPELL_ATTACK_PROF_T');
    const spellAttackRollProfEBox = form.getCheckBox('SPELL_ATTACK_PROF_E');
    const spellAttackRollProfMBox = form.getCheckBox('SPELL_ATTACK_PROF_M');
    const spellAttackRollProfLBox = form.getCheckBox('SPELL_ATTACK_PROF_L');
    setProfCheckBox(spellAttackRollProficiency, spellAttackRollProfTBox, spellAttackRollProfEBox, spellAttackRollProfMBox, spellAttackRollProfLBox);

    // Spell DC
    // TODO decide what to do with spell DC,
    //  at the moment the maximum related proficiency found is used
    const spellDCRollProficiencyValue = charInfo.metaData.reduce(function (proficiency, metadata) {
      const matches = metadata.value.match(/^SpellDC:::.*:::(\w):::/);
      if (matches && matches[1] && profToNumUp(matches[1]) > profToNumUp(proficiency)) {
        return matches[1];
      }

      return proficiency;
    }, 'U');
    const spellDcProfBonusValue = getProfNumber(profToNumUp(spellDCRollProficiencyValue), charInfo.character.level);
    const spellDcRollValue = 10 + keyAbilityModValue + spellDcProfBonusValue;

    const spellDcRollField = form.getTextField('SPELL_DC_VALUE');
    spellDcRollField.setText(spellDcRollValue + '');
    const spellDCRollKeyBonusField = form.getTextField('SPELL_DC_KEY_BONUS');
    spellDCRollKeyBonusField.setText(signNumber(spellKeyAbilityModValue) + '');

    const spellDcRollProfBonusField = form.getTextField('SPELL_DC_PROF_BONUS');
    spellDcRollProfBonusField.setText(signNumber(spellDcProfBonusValue) + '');
    const spellDCRollProfTBox = form.getCheckBox('SPELL_DC_PROF_T');
    const spellDcRollProfEBox = form.getCheckBox('SPELL_DC_PROF_E');
    const spellDcRollProfMBox = form.getCheckBox('SPELL_DC_PROF_M');
    const spellDcRollProfLBox = form.getCheckBox('SPELL_DC_PROF_L');
    setProfCheckBox(spellDCRollProficiencyValue, spellDCRollProfTBox, spellDcRollProfEBox, spellDcRollProfMBox, spellDcRollProfLBox);

    // Magic traditions
    const spellLists = charInfo.metaData.filter(function (metadata) {
      return metadata.source === 'spellLists'
    }).map(function (metadata) {
      return metadata.value.split('=')[1];
    });

    spellLists.forEach(function (spellList) {
      const spellListBox = form.getCheckBox(spellList);
      spellListBox.check();
    });

    const spellCastingTypes = charInfo.metaData.filter(function (metadata) {
      return metadata.source === 'spellCastingType'
    }).map(function (metadata) {
      return metadata.value.split('=')[1];
    });
    spellCastingTypes.forEach(function (spellCastingType) {
      const innateBox = form.getCheckBox('SPONTANEOUS');
      const preparedBox = form.getCheckBox('PREPARED');
      if (spellCastingType.startsWith('SPONTANEOUS')) {
        innateBox.check();
      } else if (spellCastingType.startsWith('PREPARED')) {
        preparedBox.check();
      }
    });

    // Spell Slots per day
    const cantripLevel = Math.ceil(charInfo.character.level / 2.0);
    const cantripLevelField = form.getTextField('CANTRIP_LEVEL');
    cantripLevelField.setText(cantripLevel + '');

    const spellSlotsMetadata = charInfo.metaData.find(function (metadata) {
      return metadata.source === 'spellSlots';
    });
    if (spellSlotsMetadata) {
      const spellSlots = JSON.parse(spellSlotsMetadata.value.split('=')[1]);
      const spellLevels = [
        'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh',
        'eighth', 'ninth', 'tenth'
      ];

      spellLevels.forEach(function (spellLevel, i ) {
        const spellLevelData = spellSlots[`${spellLevel}Level`];
        if (!spellLevelData) {
          return;
        }

        const spellLevelSlotsCount = spellLevelData.reduce(function (count, spellLevel) {
          return (spellLevel.level_lock <= charInfo.character.level) + count;
        }, 0);

        const spellLevelSlotsUsedCount = Math.min(spellLevelSlotsCount,
          spellLevelData.reduce(function (count, spellSlot) {
          return !spellSlot.used + count
        }, 0));

        const spellSlotsMaxField = form.getField(`SS${i + 1}_MAX`);
        const spellSlotsRemainingField = form.getField(`SS${i + 1}_REMAINING`);
        if (spellLevelSlotsCount) {
          spellSlotsMaxField.setText(spellLevelSlotsCount + '');
          spellSlotsRemainingField.setText(spellLevelSlotsUsedCount + '');
        }
      })
    }

    // Cantrips
    const cantrips = [];
    const spells = [];
    charInfo.spellBookSpells.forEach(function (spellBookEntry) {
      if (spellBookEntry.spellLevel > 0) {
        spells.push(spellBookEntry);
      } else {
        cantrips.push(spellBookEntry);
      }
    });

    cantrips.forEach(function (cantrip, i) {
      const number = i + 1;
      fillSpell(
        cantrip, form.getTextField(`CAN${number}_NAME`), form.getTextField(`CAN${number}_DESCRIPTION`),
        form.getCheckBox(`CAN${number}_PREP`), form.getTextField(`CAN${number}_ACTIONS`),
        form.getCheckBox(`CAN${number}_M`), form.getCheckBox(`CAN${number}_S`), form.getCheckBox(`CAN${number}_V`)
      );
    });

    // Spells
    spells.sort(function (a, b) {
      return a.spellLevel - b.spellLevel;
    }).forEach(function (spell, i) {
      const number = i + 1;
      fillSpell(
        spell, form.getTextField(`SPELL${number}_NAME`), form.getTextField(`SPELL${number}_DESCRIPTION`),
        form.getCheckBox(`SPELL${number}_PREP`), form.getTextField(`SPELL${number}_ACTIONS`),
        form.getCheckBox(`SPELL${number}_M`), form.getCheckBox(`SPELL${number}_S`), form.getCheckBox(`SPELL${number}_V`)
      );
    });

    // Innate spells

    // Focus spells
    const focusPointsMetadata = charInfo.metaData.filter(function (metadata) {
      return metadata.source === 'focusPoint';
    });

    const totalFocusPoints = focusPointsMetadata.length;
    const remainingFocusPoints = focusPointsMetadata.reduce(function (sum, metadata) {
      return Number(metadata.value) + sum;
    }, 0);

    const totalFocusPointsField = form.getTextField('FOCUS_POINTS_MAXIMUM');
    totalFocusPointsField.setText(totalFocusPoints + '');
    const remainingFocusPointsField = form.getTextField('FOCUS_POINTS_CURRENT');
    remainingFocusPointsField.setText(remainingFocusPoints + '');
  }

  // PDF printing

  const pdfBytes = await pdfDoc.save();

  // Trigger the browser to download the PDF document
  download(pdfBytes, charInfo.character.name+" - Character Sheet.pdf", "application/pdf");

  $('.modal-card-close').trigger('click');
  stopSpinnerSubLoader();

  console.log('Elapsed', (Date.now() - startTime));
}

function setProfCheckBox(prof, trainedBox, expertBox, masterBox, legendaryBox){
  switch(prof) {
    case "U": return;
    case "T": trainedBox.check(); return;
    case "E": trainedBox.check(); expertBox.check(); return;
    case "M": trainedBox.check(); expertBox.check(); masterBox.check(); return;
    case "L": trainedBox.check(); expertBox.check(); masterBox.check(); legendaryBox.check(); return;
    default: return;
  }
}

function findFeat(featsArray, sourceType, sourceLevel, sourceCode=null){

  let featData;
  if(sourceCode == null){
    featData = featsArray.find(featData => {
      return featData.source == 'chosenFeats' && featData.sourceType == sourceType && featData.sourceLevel == sourceLevel;
    });
  } else {
    featData = featsArray.find(featData => {
      return featData.source == 'chosenFeats' && featData.sourceType == sourceType && featData.sourceLevel == sourceLevel && featData.sourceCode == sourceCode;
    });
  }

  if(featData != null && featData.value != null){
    return featData.value;
  } else {
    return null;
  }

}

function findFeatName(featsArray, sourceType, sourceLevel, sourceCode=null){
  let feat = findFeat(featsArray, sourceType, sourceLevel, sourceCode);
  if(feat != null){
    return feat.name;
  } else {
    return '';
  }
}

function findFeatNameWithTrait (featsArray, traitName, sourceType, sourceLevel, not = false) {
  for (let featData of featsArray) {
    if (featData.source == 'chosenFeats' && featData.sourceType == sourceType && featData.sourceLevel == sourceLevel && featData.value != null) {
      let featStruct = g_featMap.get(featData.value.id + '')
      let tag = featStruct.Tags.find(tag => {
        return tag.name.toLowerCase() == traitName.toLowerCase()
      })
      if (tag != null && !not) {
        return featData.value.name
      } else if (not) {
        return featData.value.name
      }
    }
  }
  return ''
}

function fillWeaponFields(form, index, weapon, stats) {
  const nameField = form.getTextField(`W${index}_NAME`);
  nameField.setText(weapon.name);

  const hitBonusField = form.getTextField(`W${index}_ATTACK`);
  hitBonusField.setText(stats.Bonus);

  let damage = stats.Damage.split(/\+| /);
  const damageDice = damage.shift();
  const damageType = damage.pop();
  const damageKeyBonus = damage[0];

  const damageDiceField = form.getTextField(`W${index}_DAMAGE_DICE`);
  damageDiceField.setText(damageDice);

  const damageKeyBonusField = form.getTextField(`W${index}_DAMAGE_BONUS`);
  damageKeyBonusField.setText(signNumber(damageKeyBonus) + '');

  const damageTypeBox = form.getCheckBox(`W${index}_${damageType}`);
  damageTypeBox.check();
}

function fillSpell(
  spell, nameField, descriptionField, prepField, actionsField,
  materialCheck, somaticCheck, verbalCheck
  ) {
  nameField.setText(spell._spellName);
}
