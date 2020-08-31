/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_familiarAbilitiesMap = new Map();

function processFamiliarAbilities(charFamiliar){
  if(charFamiliar.abilitiesJSON == null) { return; }
  let abilitiesArray = [];
  let abilityNamesArray = JSON.parse(charFamiliar.abilitiesJSON);
  for(let abilityName of abilityNamesArray) {
    let famAbility = g_companionData.AllFamiliarAbilities.find(famAbility => {
      return famAbility.name === abilityName;
    });
    if(famAbility != null){
      abilitiesArray.push(famAbility);
    }
  }
  g_familiarAbilitiesMap.set(charFamiliar.id, abilitiesArray);
  processFamiliarAbilityCode(charFamiliar.id, abilitiesArray);
}

// Familiar Abilities - Code //
let g_familiarSpeedsMap = new Map();
let g_familiarSensesMap = new Map();
let g_familiarHPMap = new Map();

let temp_charFamiliarID = null;
function processFamiliarAbilityCode(charFamiliarID, abilitiesArray){
  temp_charFamiliarID = charFamiliarID;

  g_familiarSpeedsMap.set(temp_charFamiliarID, []);
  g_familiarSensesMap.set(temp_charFamiliarID, []);
  g_familiarHPMap.set(temp_charFamiliarID, []);

  for(let ability of abilitiesArray){
    let abilCode = ability.code;
    if(abilCode == null) { continue; }
    
    let regexFamSpeed = /FAMILIAR-GIVE-SPEED=(.+)/ig; // FAMILIAR-GIVE-SPEED=swim 25
    abilCode = abilCode.replace(regexFamSpeed, handleFamiliarSpeed);

    let regexFamSense = /FAMILIAR-GIVE-SENSE=(.+)/ig; // FAMILIAR-GIVE-SENSE=darkvision
    abilCode = abilCode.replace(regexFamSense, handleFamiliarSense);

    let regexFamMaxHP = /FAMILIAR-GIVE-MAX-HP=(\d+)/ig; // FAMILIAR-GIVE-MAX-HP=2
    abilCode = abilCode.replace(regexFamMaxHP, handleFamiliarMaxHP);

    processSheetCode(abilCode, ability.name+' Familiar Ability');

    // Handle NoteField Statements //
    let noteFieldSrcStruct = {
      sourceType: 'familiar',
      sourceLevel: 0,
      sourceCode: 'familiarAbility-'+charFamiliarID+'-'+ability.id,
      sourceCodeSNum: 'a',
    };
    let rNoteField = abilCode.match(/GIVE-NOTES-FIELD=(.+)/i);
    if(rNoteField != null){
      socket.emit("requestNotesFieldChange",
          getCharIDFromURL(),
          noteFieldSrcStruct,
          rNoteField[1],
          null);
    } else {
      socket.emit("requestNotesFieldDelete",
          getCharIDFromURL(),
          noteFieldSrcStruct);
    }

  }

}

function handleFamiliarSpeed(match, innerText){
  let speedArray = g_familiarSpeedsMap.get(temp_charFamiliarID);
  if(speedArray != null){
    speedArray.push(innerText);
    g_familiarSpeedsMap.set(temp_charFamiliarID, speedArray);
  }
  return '';
}

function handleFamiliarSense(match, innerText){
  let senseArray = g_familiarSensesMap.get(temp_charFamiliarID);
  if(senseArray != null){
    senseArray.push(innerText);
    g_familiarSensesMap.set(temp_charFamiliarID, senseArray);
  }
  return '';
}

function handleFamiliarMaxHP(match, innerText){
  let hpArray = g_familiarHPMap.get(temp_charFamiliarID);
  if(hpArray != null){
    hpArray.push(parseInt(innerText));
    g_familiarHPMap.set(temp_charFamiliarID, hpArray);
  }
  return '';
}

////

function getFamiliarMaxHealth(charFamiliar){
  let hpArray = g_familiarHPMap.get(charFamiliar.id);
  let hpIncrease = 5;
  if(hpArray != null){
    for(let hp of hpArray){
      hpIncrease += hp;
    }
  }
  return g_character.level * hpIncrease;
}

////

function getFamiliarAC(){
  return g_totalACNum;
}

function getFamiliarSpellBonus(){
  let levelBonus = g_character.level;
  if(gOption_hasProfWithoutLevel) { levelBonus = 0; }
  if(g_spellBookArray != null && g_spellBookArray.length > 0){
    let spellKeyAbility = g_spellBookArray[0].SpellKeyAbility;
    if(spellKeyAbility == 'STR'){
      return levelBonus + getMod(g_preConditions_strScore);
    } else if(spellKeyAbility == 'DEX'){
      return levelBonus + getMod(g_preConditions_dexScore);
    } else if(spellKeyAbility == 'CON'){
      return levelBonus + getMod(g_preConditions_conScore);
    } else if(spellKeyAbility == 'INT'){
      return levelBonus + getMod(g_preConditions_intScore);
    } else if(spellKeyAbility == 'WIS'){
      return levelBonus + getMod(g_preConditions_wisScore);
    } else if(spellKeyAbility == 'CHA'){
      return levelBonus + getMod(g_preConditions_chaScore);
    }
  }
  return levelBonus + getMod(g_preConditions_chaScore);
}

function getFamiliarMiscBonus(){
  if(gOption_hasProfWithoutLevel) {
    return 0;
  } else {
    return g_character.level;
  }
}

function getFamiliarFortBonus(){
  return getStatTotal('SAVE_FORT');
}
function getFamiliarReflexBonus(){
  return getStatTotal('SAVE_REFLEX');
}
function getFamiliarWillBonus(){
  return getStatTotal('SAVE_WILL');
}

function getFamiliarPerception(){
  return getFamiliarSpellBonus();
}

function getFamiliarAcrobatics(){
  return getFamiliarSpellBonus();
}

function getFamiliarStealth(){
  return getFamiliarSpellBonus();
}

////

function getFamiliarSize(){
  return 'TINY';
}

function getFamiliarSense(charFamiliar){
  let senseArray = g_familiarSensesMap.get(charFamiliar.id);
  let senseText = 'low-light vision, empathy (1 mile, only to you)';
  if(senseArray != null){
    for(let sense of senseArray){
      sense = sense.toLowerCase();
      if(sense.includes('vision')) {
        senseText = senseText.replace('low-light vision, ', sense+', ');
      } else {
        senseText += ', '+sense;
      }
    }
  }
  return senseText;
}

function getFamiliarSpeed(charFamiliar){
  let speedArray = g_familiarSpeedsMap.get(charFamiliar.id);
  let speedText = '25';
  if(speedArray != null){
    for(let speed of speedArray){
      speedText += ', '+speed;
    }
  }
  return speedText;
}


/// Specific Familiars ///

function getFamiliarSpecificStruct(specificType){
  if(specificType == null) {return null;}

  if(specificType == 'FAERIE-DRAGON'){
    return {
      SpecificType: specificType,
      Name: 'Faerie Dragon',
      Alignment: null,
      Tags: ['Dragon'],
      Description: 'These tiny, mischievous dragons make natural allies for benevolent or capricious characters.',
      NumAbils: 6,
      AbilsJSON: '["Amphibious","Darkvision","Flier","Manual Dexterity","Speech","Touch Telepathy"]',
      ExtraAbils: [
        '~ Breath Weapon: TWO-ACTIONS ((trait: arcane), (trait: evocation), (trait: poison)) **Frequency** once per hour; **Effect** The faerie dragon breathes euphoric gas in a 10-foot cone. Each creature in the area must attempt a Fortitude save against your class DC or spell DC, whichever is higher. A creature that fails its save is stupefied 2 and slowed 1 for 1d4 rounds; on a critical failure, the duration is 1 minute.'
      ]
    };
  }

  if(specificType == 'IMP'){
    return {
      SpecificType: specificType,
      Name: 'Imp',
      Alignment: 'An imp must be lawful evil.',
      Tags: ['Devil','Fiend'],
      Description: 'Imp familiars pretend to be subservient in order to trick their masters into losing their souls to Hell. Their resistance is in fire and poison and they\'re skilled in Deception.',
      NumAbils: 8,
      AbilsJSON: '["Darkvision","Flier","Manual Dexterity","Resistance","Skilled","Speech","Touch Telepathy"]',
      ExtraAbils: [
        '~ Imp Invisibility: Once per hour, your imp familiar can cast 2nd-level (spell: invisibility) on itself as a divine innate spell.',
        '~ Infernal Temptation: ONE-ACTION ((trait: concentrate), (trait: divine), (trait: enchantment), (trait: evil), (trait: fortune)) **Frequency** once per day; **Effect** The imp offers a non-fiend within 15 feet a bargain, granting a boon of good luck if the creature accepts. The boon lasts for 1 hour once accepted. If the creature dies while the boon is in place, its soul travels to Hell, where it is bound for eternity and unable to be raised or resurrected except by wish or similar magic. Once during the hour, the creature can roll an attack roll or saving throw twice and use the higher result.'
      ]
    };
  }

  if(specificType == 'SPELLSLIME'){
    return {
      SpecificType: specificType,
      Name: 'Spellslime',
      Alignment: null,
      Tags: ['Ooze'],
      Description: 'These friendly, colorful oozes congeal from the essences left over from casting spells. They are extremely loyal to their masters. You can select a spellslime familiar only if you can cast spells using spell slots.',
      NumAbils: 4,
      AbilsJSON: '["Climber","Darkvision","Focused Rejuvenation","Tough"]',
      ExtraAbils: [
        '~ Magic Scent: Your spellslime familiar gains an imprecise sense with a range of 30 feet that enables it to smell magic of the same tradition as your own.',
        '~ Ooze Defense: Your spellslime familiar is easy to hit, but it lacks weak points. It is immune to critical hits and precision damage, but its AC is only 10 + your level (instead of an AC equal to yours).',
        '~ Slime Rejuvenation: Your spellslime familiar gains the focused rejuvenation ability, but it recovers 2 Hit Points per level when you (action: Refocus) instead of 1.'
      ]
    };
  }

}

function displayFamiliarTraits(content, specificStruct){
  if(specificStruct == null) {return;}
  let tagsInnerHTML = '<div class="columns is-centered is-marginless"><div class="column is-9 is-paddingless"><div class="buttons is-marginless is-centered">';
  for(const tag of specificStruct.Tags){
    tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-info tagButton">'+tag+'</button>';
  }
  tagsInnerHTML += '</div></div></div>';
  content.append(tagsInnerHTML);
}

function displayFamiliarAlignment(content, specificStruct){
  if(specificStruct == null || specificStruct.Alignment == null) {return;}
  content.append('<hr class="m-2">');
  content.append('<div class="px-3"><p class="negative-indent"><strong>Alignment</strong> '+specificStruct.Alignment+'</p></div>');
}

function displayFamiliarReqAbils(content, specificStruct){
  if(specificStruct == null) {return;}
  content.append('<div class="px-3"><p class="negative-indent"><strong>Required Number of Abilities</strong> '+specificStruct.NumAbils+'</p></div>');
}

function displayFamiliarExtraAbils(content, specificStruct){
  if(specificStruct == null) {return;}
  content.append('<hr class="m-2">');
  for(let extraAbil of specificStruct.ExtraAbils){
    content.append('<div class="px-1">'+processText(extraAbil, true, true, 'MEDIUM')+'</div>');
  }
}
