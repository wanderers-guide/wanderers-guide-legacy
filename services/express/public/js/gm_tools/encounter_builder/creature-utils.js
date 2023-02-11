/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function applyEliteWeak(inputData, eliteWeak){
    let data = cloneObj(inputData);

    let adj_rangedAttack = 0;
    let adj_rangedDamage = 0;
    let adj_meleeAttack = 0;
    let adj_meleeDamage = 0;
    let adj_spellAttack = 0;
    let adj_spellDC = 0;

    let adj_generalDC = 0;
    let adj_generalDamage = 0;
    let adj_generalDamageLimited = 0;

    let skills = JSON.parse(data.skillsJSON);

    if(eliteWeak == 'elite' || eliteWeak == 'weak'){
        let sign = (eliteWeak == 'elite') ? 1 : -1;

        data.acValue += sign*2;
        adj_meleeAttack = sign*2;
        adj_rangedAttack = sign*2;
        adj_spellAttack = sign*2;
        adj_spellDC = sign*2;

        adj_generalDC = sign*2;
        adj_generalDamage = sign*2;

        adj_generalDamageLimited = sign*4; // TODO

        adj_meleeDamage = sign*2;
        adj_rangedDamage = sign*2;

        data.reflexBonus += sign*2;
        data.fortBonus += sign*2;
        data.willBonus += sign*2;

        data.perceptionBonus += sign*2;
        for(let skill of skills){
            skill.bonus += sign*2;
        }

        data.hpMax = getCreatureMaxHP(data.level, data.hpMax, eliteWeak);
        data.level = getCreatureLevel(data.level, eliteWeak);

    }

    data.skills = skills;
    data.adj_rangedAttack = adj_rangedAttack;
    data.adj_rangedDamage = adj_rangedDamage;
    data.adj_meleeAttack = adj_meleeAttack;
    data.adj_meleeDamage = adj_meleeDamage;
    data.adj_spellAttack = adj_spellAttack;
    data.adj_spellDC = adj_spellDC;
    data.adj_generalDC = adj_generalDC;
    data.adj_generalDamage = adj_generalDamage;
    data.adj_generalDamageLimited = adj_generalDamageLimited;

    return data;

}

function calculateCreatureStats(data, conditions){

    let perceptionConditionals = '';

    let adjustmentMap = new Map();
    let addAdjustment = function(variable, type, value){
        let adjustments = adjustmentMap.get(variable);
        if(adjustments == null){adjustments = new Map();}
        adjustments.set(type, value);
        adjustmentMap.set(variable, adjustments);
    };
    let getTotalAdjustment = function(variable){
        let adjustments = adjustmentMap.get(variable);
        if(adjustments != null){
            let result = 0;
            for(const [type, value] of adjustments.entries()){
                result += value;
            }
            return result;
        } else {
            return 0;
        }
    };

    // Handle Conditions //
    let appliedConditions = getAppliedConditions(conditions);

    // Process each applied condition 
    for(let condition of appliedConditions){
        if(condition.name.toLowerCase() == 'encumbered'){
            addAdjustment('speed', 'encumbered', -10);

        } else if(condition.name.toLowerCase() == 'clumsy'){
            addAdjustment('dex', 'status', -1*condition.value);
            addAdjustment('ac', 'status', -1*condition.value);
            addAdjustment('reflex', 'status', -1*condition.value);
            addAdjustment('ranged_attack', 'status', -1*condition.value);
            addAdjustment('skill_acrobatics', 'status', -1*condition.value);
            addAdjustment('skill_stealth', 'status', -1*condition.value);
            addAdjustment('skill_thievery', 'status', -1*condition.value);

        } else if(condition.name.toLowerCase() == 'blinded'){
            addAdjustment('perception', 'status', -4);

        } else if(condition.name.toLowerCase() == 'deafened'){
            perceptionConditionals += ', -2 status penalty to checks for initiative or that involve sound but also rely on other senses';

        } else if(condition.name.toLowerCase() == 'drained'){
            addAdjustment('con', 'status', -1*condition.value);
            addAdjustment('fort', 'status', -1*condition.value);
            addAdjustment('hp', 'drained', -1*condition.value*((data.level > 1) ? data.level : 1));

        } else if(condition.name.toLowerCase() == 'enfeebled'){
            addAdjustment('str', 'status', -1*condition.value);
            addAdjustment('melee_attack', 'status', -1*condition.value);
            addAdjustment('melee_damage', 'status', -1*condition.value);
            addAdjustment('skill_athletics', 'status', -1*condition.value);

        } else if(condition.name.toLowerCase() == 'fascinated'){
            addAdjustment('perception', 'status', -2);
            addAdjustment('skill', 'status', -2);

        } else if(condition.name.toLowerCase() == 'fatigued'){
            addAdjustment('ac', 'status', -1);
            addAdjustment('reflex', 'status', -1);
            addAdjustment('fort', 'status', -1);
            addAdjustment('will', 'status', -1);

        } else if(condition.name.toLowerCase() == 'flat-footed'){
            addAdjustment('ac', 'circum', -2);

        } else if(condition.name.toLowerCase() == 'frightened'){
            addAdjustment('perception', 'status', -1*condition.value);
            addAdjustment('skill', 'status', -1*condition.value);

            addAdjustment('ac', 'status', -1*condition.value);
            addAdjustment('reflex', 'status', -1*condition.value);
            addAdjustment('fort', 'status', -1*condition.value);
            addAdjustment('will', 'status', -1*condition.value);

            addAdjustment('melee_attack', 'status', -1*condition.value);
            addAdjustment('ranged_attack', 'status', -1*condition.value);

            addAdjustment('spell_attack', 'status', -1*condition.value);
            addAdjustment('spell_dc', 'status', -1*condition.value);

        } else if(condition.name.toLowerCase() == 'prone'){
            addAdjustment('melee_attack', 'circum', -2);
            addAdjustment('ranged_attack', 'circum', -2);
            addAdjustment('spell_attack', 'circum', -2);

        } else if(condition.name.toLowerCase() == 'sickened'){
            addAdjustment('perception', 'status', -1*condition.value);
            addAdjustment('skill', 'status', -1*condition.value);

            addAdjustment('ac', 'status', -1*condition.value);
            addAdjustment('reflex', 'status', -1*condition.value);
            addAdjustment('fort', 'status', -1*condition.value);
            addAdjustment('will', 'status', -1*condition.value);

            addAdjustment('melee_attack', 'status', -1*condition.value);
            addAdjustment('ranged_attack', 'status', -1*condition.value);

            addAdjustment('spell_attack', 'status', -1*condition.value);
            addAdjustment('spell_dc', 'status', -1*condition.value);

        } else if(condition.name.toLowerCase() == 'stupefied'){
            addAdjustment('int', 'status', -1*condition.value);
            addAdjustment('wis', 'status', -1*condition.value);
            addAdjustment('cha', 'status', -1*condition.value);

            addAdjustment('will', 'status', -1*condition.value);
            addAdjustment('spell_attack', 'status', -1*condition.value);
            addAdjustment('spell_dc', 'status', -1*condition.value);

            addAdjustment('perception', 'status', -1*condition.value);
            addAdjustment('skill_arcana', 'status', -1*condition.value);
            addAdjustment('skill_crafting', 'status', -1*condition.value);
            addAdjustment('skill_deception', 'status', -1*condition.value);
            addAdjustment('skill_diplomacy', 'status', -1*condition.value);
            addAdjustment('skill_intimidation', 'status', -1*condition.value);
            addAdjustment('skill_medicine', 'status', -1*condition.value);
            addAdjustment('skill_nature', 'status', -1*condition.value);
            addAdjustment('skill_occultism', 'status', -1*condition.value);
            addAdjustment('skill_performance', 'status', -1*condition.value);
            addAdjustment('skill_religion', 'status', -1*condition.value);
            addAdjustment('skill_society', 'status', -1*condition.value);
            addAdjustment('skill_survival', 'status', -1*condition.value);
            addAdjustment('skill_lore', 'status', -1*condition.value);

        } else if(condition.name.toLowerCase() == 'unconscious'){
            addAdjustment('ac', 'status', -4);
            addAdjustment('perception', 'status', -4);
            addAdjustment('reflex', 'status', -4);

        } else {
            console.warn('Unknown condition: '+condition.name);
        }
    }

    let perception = data.perceptionBonus + getTotalAdjustment('perception');
    for(let skill of data.skills){
        if(skill.name.toLowerCase().includes(' lore')){
            skill.bonus += getTotalAdjustment('skill_lore');
        } else {
            skill.bonus += getTotalAdjustment('skill_'+skill.name.toLowerCase());
        }
        skill.bonus += getTotalAdjustment('skill');
    }

    let abilityMods = {
        str: data.strMod + getTotalAdjustment('str'),
        dex: data.dexMod + getTotalAdjustment('dex'),
        con: data.conMod + getTotalAdjustment('con'),
        int: data.intMod + getTotalAdjustment('int'),
        wis: data.wisMod + getTotalAdjustment('wis'),
        cha: data.chaMod + getTotalAdjustment('cha'),
    };
    let ac = data.acValue + getTotalAdjustment('ac');
    let saves = {
        fort: data.fortBonus + getTotalAdjustment('fort'),
        reflex: data.reflexBonus + getTotalAdjustment('reflex'),
        will: data.willBonus + getTotalAdjustment('will'),
    };
    let hpMax = data.hpMax + getTotalAdjustment('hp');

    return {
        perception,
        skills: data.skills,
        abilityMods,
        ac,
        saves,
        hpMax,
        perceptionConditionals,
        adj_speed: getTotalAdjustment('speed'),
        adj_rangedAttack: getTotalAdjustment('ranged_attack')+data.adj_rangedAttack,
        adj_rangedDamage: getTotalAdjustment('ranged_damage')+data.adj_rangedDamage,
        adj_meleeAttack: getTotalAdjustment('melee_attack')+data.adj_meleeAttack,
        adj_meleeDamage: getTotalAdjustment('melee_damage')+data.adj_meleeDamage,
        adj_spellAttack: getTotalAdjustment('spell_attack')+data.adj_spellAttack,
        adj_spellDC: getTotalAdjustment('spell_dc')+data.adj_spellDC,

        adj_generalDC: getTotalAdjustment('general_dc')+data.adj_generalDC,
        adj_generalDamage: getTotalAdjustment('general_damage')+data.adj_generalDamage,
    };


}


function getBonusForInitiative(){
    // Get after condition bonus for perception / skill. If has defeaned condition, give -2.
}

function getCreatureMaxHP(level, hpMax, eliteWeak){

    let maxHp = hpMax;
    if(eliteWeak == 'elite' || eliteWeak == 'weak'){
        let sign = (eliteWeak == 'elite') ? 1 : -1;
        if(level >= 20){
            maxHp = hpMax + sign*30;
        } else if(level >= 5){
            maxHp = hpMax + sign*20;
        } else if(level >= 2){
            maxHp = hpMax + sign*15;
        } else {
            maxHp = hpMax + sign*10;
        }
    }
    return maxHp;

}

function getCreatureLevel(level, eliteWeak){

    let lvl = level;
    if(eliteWeak == 'elite' || eliteWeak == 'weak'){
        let sign = (eliteWeak == 'elite') ? 1 : -1;
        if(level == -1 && eliteWeak == 'elite'){
            lvl = 1;
        } else if(level == 1 && eliteWeak == 'weak'){
            lvl = -1;
        } else {
            lvl = level + sign;
        }
    }
    return lvl;

}

function getRecallKnowledgeDC(lvl, rarity, traits) {

  const getDCFromLevel = (lvl) => {
    switch(lvl){
      case -3: return 14;
      case -2: return 14;
      case -1: return 14;
      case 0: return 14;
      case 1: return 15;
      case 2: return 16;
      case 3: return 18;
      case 4: return 19;
      case 5: return 20;
      case 6: return 22;
      case 7: return 23;
      case 8: return 24;
      case 9: return 26;
      case 10: return 27;
      case 11: return 28;
      case 12: return 30;
      case 13: return 31;
      case 14: return 32;
      case 15: return 34;
      case 16: return 35;
      case 17: return 36;
      case 18: return 38;
      case 19: return 39;
      case 20: return 40;
      case 21: return 42;
      case 22: return 44;
      case 23: return 46;
      case 24: return 48;
      case 25: return 50;
      default: 50;
    }
  }

  const getRarityAdjustment = (rarity) => {
    switch (rarity) {
      case 'UNCOMMON': return 2;
      case 'RARE': return 5;
      case 'UNIQUE': return 10;
      default: return 0;
    }
  }

  const getCreatureSkill = (traits) => {
    for (const traitName of traits) {
      switch(traitName.toLowerCase()){
        case 'aberration': return 'Occultism';
        case 'animal': return 'Nature';
        case 'astral': return 'Occultism';
        case 'beast': return 'Arcana or Nature';
        case 'celestial': return 'Religion';
        case 'construct': return 'Arcana or Crafting';
        case 'dragon': return 'Arcana';
        case 'elemental': return 'Arcana or Nature';
        case 'ethereal': return 'Occultism';
        case 'fey': return 'Nature';
        case 'fiend': return 'Religion';
        case 'fungus': return 'Nature';
        case 'humanoid': return 'Society';
        case 'monitor': return 'Religion';
        case 'ooze': return 'Occultism';
        case 'plant': return 'Nature';
        case 'spirit': return 'Occultism';
        case 'undead': return 'Religion';
        default: break;
      }
    }
    return '';
  }

  return `${getDCFromLevel(lvl) + getRarityAdjustment(rarity)} ${getCreatureSkill(traits)}`;

}