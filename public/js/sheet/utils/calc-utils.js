/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function getAttackAndDamage(itemData, invItem){

    let strMod = getMod(getStatTotal('SCORE_STR'));
    let dexMod = getMod(getStatTotal('SCORE_DEX'));
    let pre_strMod = getMod(g_preConditions_strScore);
    let pre_dexMod = getMod(g_preConditions_dexScore);

    let tagArray = getItemTraitsArray(itemData, invItem);

    let damageDieType = invItem.itemWeaponDieType;
    if(damageDieType == null){
        damageDieType = itemData.WeaponData.dieType;
    }
    let damageDamageType = invItem.itemWeaponDamageType;
    if(damageDamageType == null){
        damageDamageType = itemData.WeaponData.damageType;
    }

    const weapStruct = {
      attack: {
        parts: new Map(),
        conditionals: new Map(),
      },
      damage: {
        parts: new Map(),
        conditionals: new Map(),
      }
    };
    
    // Bonuses from weapon custom bonus //
    let weapAtkCustomBonus = invItem.itemWeaponAtkBonus;
    if(weapAtkCustomBonus == null) {
      weapAtkCustomBonus = 0;
    }
    weapStruct.attack.parts.set('Custom Attacks Bonus', weapAtkCustomBonus);

    let weapDmgCustomBonus = invItem.itemWeaponDmgBonus;
    if(weapDmgCustomBonus == null) {
      weapDmgCustomBonus = 0;
    }
    weapStruct.damage.parts.set('Custom Damage Bonus', weapDmgCustomBonus);

    if(itemData.WeaponData.isMelee == 1){

        let splashTag = tagArray.find(tag => {
          return tag.id == 391; // Hardcoded Splash Tag ID
        });
        let agileTag = tagArray.find(tag => {
          return tag.id == 43; // Hardcoded Agile Tag ID
        });
        let finesseTag = tagArray.find(tag => {
            return tag.id == 42; // Hardcoded Finesse Tag ID
        });
    
        ////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////// Attack Bonus ///////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////

        let useDexForAttack = false;
        if(finesseTag != null){
          if(dexMod > strMod){
            weapStruct.attack.parts.set('This is your Dexterity modifier. Because this weapon is a finesse weapon, you can use your Dexterity modifier instead of Strength on attack rolls.', dexMod);
            useDexForAttack = true;
          }
          // Use preDex mod because Clumsy condition affects ranged attacks but not finesse melee attacks?
        }
        if(!useDexForAttack){
          weapStruct.attack.parts.set('This is your Strength modifier. You add your Strength modifier to attack rolls with most melee weapons.', strMod);
        }

        // Proficiency Bonus //
        let profNumUps = weaponProfDetermineNumUps(itemData);
        let profName = getProfNameFromNumUps(profNumUps);
        if(profNumUps === 0 && gState_addLevelToUntrainedWeaponAttack && !gOption_hasProfWithoutLevel) {
          let profAttackBonus = g_character.level; // Sheet-State, adds level to untrained weapons
          weapStruct.attack.parts.set('This is your proficiency bonus. You are '+profName.toLowerCase()+' in this weapon but have an ability that adds your level ('+g_character.level+') to your proficiency bonus, making it '+signNumber(getBonusFromProfName(profName))+'.', profAttackBonus);
        } else {
          let profAttackBonus = getProfNumber(profNumUps, g_character.level);
          if(gOption_hasProfWithoutLevel){
            weapStruct.attack.parts.set('This is your proficiency bonus. Because you are '+profName.toLowerCase()+' in this weapon, your proficiency bonus is '+signNumber(getBonusFromProfName(profName))+'.', profAttackBonus);
          } else {
            weapStruct.attack.parts.set('This is your proficiency bonus. Because you are '+profName.toLowerCase()+' in this weapon, your proficiency bonus is equal to your level ('+g_character.level+') plus '+getBonusFromProfName(profName)+'.', profAttackBonus);
          }
        }

        // Potency Bonus //
        let potencyRuneBonus = 0;
        if(isWeaponPotencyOne(invItem.fundPotencyRuneID)){
          potencyRuneBonus = 1;
        } else if(isWeaponPotencyTwo(invItem.fundPotencyRuneID)){
          potencyRuneBonus = 2;
        } else if(isWeaponPotencyThree(invItem.fundPotencyRuneID)){
          potencyRuneBonus = 3;
        } else if(isWeaponPotencyFour(invItem.fundPotencyRuneID)){
          potencyRuneBonus = 4;
        }
        weapStruct.attack.parts.set('This is the item bonus granted by this weapon\'s potency rune.', potencyRuneBonus);

        // Shoddy Penalty //
        let shoddyPenalty = (invItem.isShoddy == 1) ? -2 : 0;
        weapStruct.attack.parts.set('This is the item penalty applied due to this weapon being shoddy.', shoddyPenalty);

        // Bonus for - Attacks //
        let extraAttackBonus = getStatTotal('ATTACKS');
        if(extraAttackBonus == null) { extraAttackBonus = 0; }
        weapStruct.attack.parts.set('This bonus is being added by an effect that adds a bonus to all attacks.', extraAttackBonus);
        weapStruct.attack.conditionals =
              new Map([...weapStruct.attack.conditionals, ...getConditionalStatMap('ATTACKS')]);

        // Bonus for - Melee Attacks //
        let extraAttackMeleeBonus = getStatTotal('MELEE_ATTACKS');
        if(extraAttackMeleeBonus == null) { extraAttackMeleeBonus = 0; }
        weapStruct.attack.parts.set('This bonus is being added by an effect that adds a bonus to all melee attacks.', extraAttackMeleeBonus);
        weapStruct.attack.conditionals =
              new Map([...weapStruct.attack.conditionals, ...getConditionalStatMap('MELEE_ATTACKS')]);

        // User-Added Bonus //
        let profData = g_weaponProfMap.get(itemData.WeaponData.profName);
        let profUserBonus = null;
        if(profData != null){
          profUserBonus = profData.UserBonus;
        } else {
          profUserBonus = 0;
        }
        weapStruct.attack.parts.set('This is a custom bonus that\'s been added manually.', profUserBonus);

        // Totaling Attack Bonus //
        let totalAttackBonus = 0;
        for(const [source, amount] of weapStruct.attack.parts.entries()){
          totalAttackBonus += amount;
        }
        let attackBonus = signNumber(totalAttackBonus);

        ////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////// Damage //////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////

        // Number of Dice for Damage //
        let diceNum = itemData.WeaponData.diceNum;
        if(isStriking(invItem.fundRuneID)){
          diceNum = 2;
        } else if(isGreaterStriking(invItem.fundRuneID)){
          diceNum = 3;
        } else if(isMajorStriking(invItem.fundRuneID)){
          diceNum = 4;
        }

        let overrideAttacksDmgDice = getStatTotal('ATTACKS_DMG_DICE');
        if(overrideAttacksDmgDice != null) { diceNum = overrideAttacksDmgDice; }
        let overrideMeleeDmgDice = getStatTotal('MELEE_ATTACKS_DMG_DICE');
        if(overrideMeleeDmgDice != null) { diceNum = overrideMeleeDmgDice; }

        // Ability Score Modifier //
        let dmgStrBonus = 0;
        if(gState_hasFinesseMeleeUseDexDamage && finesseTag != null){
            if(dexMod > strMod) {
              if(dexMod != 0){
                dmgStrBonus = dexMod;
                weapStruct.damage.parts.set('This is your Dexterity modifier. You\'re adding Dexterity instead of Strength to your weapon\'s damage, because this weapon is a finesse weapon and you have an ability that allows you to use your Dexterity modifier instead of Strength for damage with finesse weapons.', dmgStrBonus);
              }
            } else {
              if(strMod != 0){
                dmgStrBonus = strMod;
                weapStruct.damage.parts.set('This is your Strength modifier. You have an ability that allows you to use your Dexterity modifier instead of Strength for damage with finesse weapons. However, your Strength modifier is greater than your Dexterity so it is being used instead.', dmgStrBonus);
              }
            }
        } else {
            if(splashTag == null && strMod != 0){
              dmgStrBonus = strMod;
              weapStruct.damage.parts.set('This is your Strength modifier. You generally add your Strength modifier to damage with melee weapons.', dmgStrBonus);
            }
        }

        // Weapon Specialization //
        if(g_specializationStruct.GreaterWeaponSpecial){ // Hardcoded bonuses
          let weapSpecialBonus = 0;
          if(profNumUps === 2) {
              weapSpecialBonus = 4;
          } else if(profNumUps === 3) {
              weapSpecialBonus = 6;
          } else if(profNumUps === 4) {
              weapSpecialBonus = 8;
          }
          weapStruct.damage.parts.set('This is the extra damage being added due to your Greater Weapon Specialization class feature.', weapSpecialBonus);
        } else {
          if(g_specializationStruct.WeaponSpecial){
            let weapSpecialBonus = 0;
            if(profNumUps === 2) {
                weapSpecialBonus = 2;
            } else if(profNumUps === 3) {
                weapSpecialBonus = 3;
            } else if(profNumUps === 4) {
                weapSpecialBonus = 4;
            }
            weapStruct.damage.parts.set('This is the extra damage being added due to your Weapon Specialization class feature.', weapSpecialBonus);
          }
        }

        // Bonus for - Weapons //
        let weapExtraBonus = getStatTotal('ATTACKS_DMG_BONUS');
        if(weapExtraBonus == null) { weapExtraBonus = 0; }
        weapStruct.damage.parts.set('This bonus is being added by an effect that adds a bonus to damage with all attacks.', weapExtraBonus);
        weapStruct.damage.conditionals =
              new Map([...weapStruct.damage.conditionals, ...getConditionalStatMap('ATTACKS_DMG_BONUS')]);

        // Bonus for - Melee Weapons //
        let weapMeleeExtraBonus = getStatTotal('MELEE_ATTACKS_DMG_BONUS');
        if(weapMeleeExtraBonus == null) {
          weapMeleeExtraBonus = 0;
        }
        weapStruct.damage.parts.set('This bonus is being added by an effect that adds a bonus to damage with all melee attacks.', weapMeleeExtraBonus);
        weapStruct.damage.conditionals =
              new Map([...weapStruct.damage.conditionals, ...getConditionalStatMap('MELEE_ATTACKS_DMG_BONUS')]);

        // Bonus for - Agile Melee Weapons //
        let weapMeleeAgileExtraBonus = getStatTotal('AGILE_MELEE_ATTACKS_DMG_BONUS');
        let weapMeleeNonAgileExtraBonus = getStatTotal('NON_AGILE_MELEE_ATTACKS_DMG_BONUS');
        if(agileTag != null){
          if(weapMeleeAgileExtraBonus == null) {
            weapMeleeAgileExtraBonus = 0;
          }
          weapStruct.damage.parts.set('This bonus is being added by an effect that adds a bonus to damage with all agile, melee attacks.', weapMeleeAgileExtraBonus);
          weapStruct.damage.conditionals =
              new Map([...weapStruct.damage.conditionals, ...getConditionalStatMap('AGILE_MELEE_ATTACKS_DMG_BONUS')]);
        } else {
          if(weapMeleeNonAgileExtraBonus == null) {
            weapMeleeNonAgileExtraBonus = 0;
          }
          weapStruct.damage.parts.set('This bonus is being added by an effect that adds a bonus to damage with all non-agile, melee attacks.', weapMeleeNonAgileExtraBonus);
          weapStruct.damage.conditionals =
              new Map([...weapStruct.damage.conditionals, ...getConditionalStatMap('NON_AGILE_MELEE_ATTACKS_DMG_BONUS')]);
        }

        // Totaling Damage //
        let totalDamageBonus = 0;
        for(const [source, amount] of weapStruct.damage.parts.entries()){
          totalDamageBonus += amount;
        }
        let totalDamageBonusStr = (totalDamageBonus != 0) ? signNumber(totalDamageBonus) : '';

        // Finalizing Damage into Display String //
        let damage = '';
        let damageDice = '';
        if(damageDieType != 'NONE') {
            let maxDamage = diceNum*dieTypeToNum(damageDieType)+totalDamageBonus;
            if(maxDamage >= 1) {
                damage = diceNum+""+damageDieType+totalDamageBonusStr+" "+damageDamageType;
            } else {
                damage = '<a class="has-text-grey" data-tooltip="'+diceNum+""+damageDieType+totalDamageBonusStr+'">1</a> '+damageDamageType;
            }
            damageDice = diceNum+''+damageDieType;
        } else {
            damage = '-';
            damageDice = '-';
        }

        return { AttackBonus : attackBonus, Damage : damage, DamageDice : damageDice, WeapStruct: weapStruct };

    } else if(itemData.WeaponData.isRanged == 1){

        let thrownTag = tagArray.find(tag => {
            return 47 <= tag.id && tag.id <= 54; // Hardcoded Thrown Tag ID Range (47-54)
        });
        let splashTag = tagArray.find(tag => {
            return tag.id == 391; // Hardcoded Splash Tag ID
        });
        let propulsiveTag = tagArray.find(tag => {
            return tag.id == 653; // Hardcoded Propulsive Tag ID
        });

        ////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////// Attack Bonus ///////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////

        weapStruct.attack.parts.set('This is your Dexterity modifier. You add your Dexterity modifier to attack rolls with most ranged weapons.', dexMod);

        // Proficiency Bonus //
        let profNumUps = weaponProfDetermineNumUps(itemData);
        let profName = getProfNameFromNumUps(profNumUps);
        if(profNumUps === 0 && gState_addLevelToUntrainedWeaponAttack && !gOption_hasProfWithoutLevel) {
          let profAttackBonus = g_character.level; // Sheet-State, adds level to untrained weapons
          weapStruct.attack.parts.set('This is your proficiency bonus. You are '+profName.toLowerCase()+' in this weapon but have an ability that adds your level ('+g_character.level+') to your proficiency bonus, making it '+signNumber(getBonusFromProfName(profName))+'.', profAttackBonus);
        } else {
          let profAttackBonus = getProfNumber(profNumUps, g_character.level);
          if(gOption_hasProfWithoutLevel){
            weapStruct.attack.parts.set('This is your proficiency bonus. Because you are '+profName.toLowerCase()+' in this weapon, your proficiency bonus is '+signNumber(getBonusFromProfName(profName))+'.', profAttackBonus);
          } else {
            weapStruct.attack.parts.set('This is your proficiency bonus. Because you are '+profName.toLowerCase()+' in this weapon, your proficiency bonus is equal to your level ('+g_character.level+') plus '+getBonusFromProfName(profName)+'.', profAttackBonus);
          }
        }

        // Potency Bonus //
        let potencyRuneBonus = 0;
        if(isWeaponPotencyOne(invItem.fundPotencyRuneID)){
          potencyRuneBonus = 1;
        } else if(isWeaponPotencyTwo(invItem.fundPotencyRuneID)){
          potencyRuneBonus = 2;
        } else if(isWeaponPotencyThree(invItem.fundPotencyRuneID)){
          potencyRuneBonus = 3;
        } else if(isWeaponPotencyFour(invItem.fundPotencyRuneID)){
          potencyRuneBonus = 4;
        }
        weapStruct.attack.parts.set('This is the item bonus granted by this weapon\'s potency rune.', potencyRuneBonus);

        // Shoddy Penalty //
        let shoddyPenalty = (invItem.isShoddy == 1) ? -2 : 0;
        weapStruct.attack.parts.set('This is the item penalty applied due to this weapon being shoddy.', shoddyPenalty);

        // Bonus for - Attacks //
        let extraAttackBonus = getStatTotal('ATTACKS');
        if(extraAttackBonus == null) { extraAttackBonus = 0; }
        weapStruct.attack.parts.set('This bonus is being added by an effect that adds a bonus to all attacks.', extraAttackBonus);
        weapStruct.attack.conditionals =
              new Map([...weapStruct.attack.conditionals, ...getConditionalStatMap('ATTACKS')]);

        // Bonus for - Ranged Attacks //
        let extraAttackRangedBonus = getStatTotal('RANGED_ATTACKS');
        if(extraAttackRangedBonus == null) { extraAttackRangedBonus = 0; }
        weapStruct.attack.parts.set('This bonus is being added by an effect that adds a bonus to all ranged attacks.', extraAttackRangedBonus);
        weapStruct.attack.conditionals =
              new Map([...weapStruct.attack.conditionals, ...getConditionalStatMap('RANGED_ATTACKS')]);

        // User-Added Bonus //
        let profData = g_weaponProfMap.get(itemData.WeaponData.profName);
        let profUserBonus = null;
        if(profData != null){
          profUserBonus = profData.UserBonus;
        } else {
          profUserBonus = 0;
        }
        weapStruct.attack.parts.set('This is a custom bonus that\'s been added manually.', profUserBonus);


        // Totaling Attack Bonus //
        let totalAttackBonus = 0;
        for(const [source, amount] of weapStruct.attack.parts.entries()){
          totalAttackBonus += amount;
        }
        let attackBonus = signNumber(totalAttackBonus);

        ////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////// Damage //////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////

        // Number of Dice for Damage //
        let diceNum = itemData.WeaponData.diceNum;
        if(isStriking(invItem.fundRuneID)){
          diceNum = 2;
        } else if(isGreaterStriking(invItem.fundRuneID)){
          diceNum = 3;
        } else if(isMajorStriking(invItem.fundRuneID)){
          diceNum = 4;
        }

        let overrideAttacksDmgDice = getStatTotal('ATTACKS_DMG_DICE');
        if(overrideAttacksDmgDice != null) { diceNum = overrideAttacksDmgDice; }
        let overrideMeleeDmgDice = getStatTotal('RANGED_ATTACKS_DMG_DICE');
        if(overrideMeleeDmgDice != null) { diceNum = overrideMeleeDmgDice; }

        // Ability Score Modifier //
        let dmgStrBonus = 0;
        if(propulsiveTag != null){
            if(strMod >= 0){
                let strAmt = Math.floor(strMod/2);
                if(strAmt != 0){
                    dmgStrBonus = strAmt;
                    weapStruct.damage.parts.set('This is half of your Strength modifier. Because this weapon is a propulsive weapon and you have a positive Strength modifier, you add half of your Strength modifier (rounded down) to the damage.', dmgStrBonus);
                }
            } else {
                dmgStrBonus = strMod;
                weapStruct.damage.parts.set('This is your Strength modifier. Because this weapon is a propulsive weapon and you have a negative Strength modifier, you add your full Strength modifier to the damage.', dmgStrBonus);
            }
        }
        if(thrownTag != null && splashTag == null && strMod != 0){
            dmgStrBonus = strMod;
            weapStruct.damage.parts.set('This is your Strength modifier. Because this is a thrown ranged weapon, you add your Strength modifier to the damage.', dmgStrBonus);
        }

        // Weapon Specialization // 
        if(g_specializationStruct.GreaterWeaponSpecial){ // Hardcoded bonuses
          let weapSpecialBonus = 0;
          if(profNumUps === 2) {
              weapSpecialBonus = 4;
          } else if(profNumUps === 3) {
              weapSpecialBonus = 6;
          } else if(profNumUps === 4) {
              weapSpecialBonus = 8;
          }
          weapStruct.damage.parts.set('This is the extra damage being added due to your Greater Weapon Specialization class feature.', weapSpecialBonus);
        } else {
          if(g_specializationStruct.WeaponSpecial){
            let weapSpecialBonus = 0;
            if(profNumUps === 2) {
                weapSpecialBonus = 2;
            } else if(profNumUps === 3) {
                weapSpecialBonus = 3;
            } else if(profNumUps === 4) {
                weapSpecialBonus = 4;
            }
            weapStruct.damage.parts.set('This is the extra damage being added due to your Weapon Specialization class feature.', weapSpecialBonus);
          }
        }

        // Bonus for - Weapons //
        let weapExtraBonus = getStatTotal('ATTACKS_DMG_BONUS');
        if(weapExtraBonus == null) { weapExtraBonus = 0; }
        weapStruct.damage.parts.set('This bonus is being added by an effect that adds a bonus to damage with all attacks.', weapExtraBonus);
        weapStruct.damage.conditionals =
              new Map([...weapStruct.damage.conditionals, ...getConditionalStatMap('ATTACKS_DMG_BONUS')]);

        // Bonus for - Ranged Weapons //
        let weapRangedExtraBonus = getStatTotal('RANGED_ATTACKS_DMG_BONUS');
        if(weapRangedExtraBonus == null) {
          weapRangedExtraBonus = 0;
        }
        weapStruct.damage.parts.set('This bonus is being added by an effect that adds a bonus to damage with all ranged attacks.', weapRangedExtraBonus);
        weapStruct.damage.conditionals =
              new Map([...weapStruct.damage.conditionals, ...getConditionalStatMap('RANGED_ATTACKS_DMG_BONUS')]);

        // Totaling Damage //
        let totalDamageBonus = 0;
        for(const [source, amount] of weapStruct.damage.parts.entries()){
          totalDamageBonus += amount;
        }
        let totalDamageBonusStr = (totalDamageBonus != 0) ? signNumber(totalDamageBonus) : '';

        // Finalizing Damage into Display String //
        let damage = '';
        let damageDice = '';
        if(damageDieType != 'NONE') {
            let maxDamage = diceNum*dieTypeToNum(damageDieType)+totalDamageBonus;
            if(maxDamage >= 1) {
                damage = diceNum+""+damageDieType+totalDamageBonusStr+" "+damageDamageType;
            } else {
                damage = '<a class="has-text-grey" data-tooltip="'+diceNum+""+damageDieType+totalDamageBonusStr+'">1</a> '+damageDamageType;
            }
            damageDice = diceNum+''+damageDieType;
        } else {
            damage = '-';
            damageDice = '-';
        }

        return { AttackBonus : attackBonus, Damage : damage, DamageDice : damageDice, WeapStruct: weapStruct };

    } else {
      return { AttackBonus : null, Damage : null, WeapStruct: null };
    }

}


// MAP Calc //
function generateMAP(attackBonus, itemTagArray) {

  attackBonus = parseInt(attackBonus);
  let agileTag = itemTagArray.find(tag => {
    return tag.id == 43; // Hardcoded Agile Tag ID
  });

  if(gState_MAP == 'TIER_1'){
    if(agileTag == null){
      return {one:signNumber(attackBonus),two:signNumber(attackBonus-5),three:signNumber(attackBonus-10)};
    } else {
      return {one:signNumber(attackBonus),two:signNumber(attackBonus-4),three:signNumber(attackBonus-8)};
    }
  } else if(gState_MAP == 'TIER_2'){
    if(agileTag == null){
      return {one:signNumber(attackBonus),two:signNumber(attackBonus-4),three:signNumber(attackBonus-8)};
    } else {
      return {one:signNumber(attackBonus),two:signNumber(attackBonus-3),three:signNumber(attackBonus-6)};
    }
  } else if(gState_MAP == 'TIER_3'){
    if(agileTag == null){
      return {one:signNumber(attackBonus),two:signNumber(attackBonus-3),three:signNumber(attackBonus-6)};
    } else {
      return {one:signNumber(attackBonus),two:signNumber(attackBonus-2),three:signNumber(attackBonus-4)};
    }
  } else if(gState_MAP == 'TIER_4'){
    if(agileTag == null){
      return {one:signNumber(attackBonus),two:signNumber(attackBonus-2),three:signNumber(attackBonus-4)};
    } else {
      return {one:signNumber(attackBonus),two:signNumber(attackBonus-1),three:signNumber(attackBonus-2)};
    }
  }

}

function generateStringMAP(attackBonus, itemTagArray){

  let map = generateMAP(attackBonus, itemTagArray);
  return `${map.one}/${map.two}/${map.three}`;

}