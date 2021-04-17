/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
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

    if(itemData.WeaponData.isMelee == 1){

        let agileTag = tagArray.find(tag => {
          return tag.id == 43; // Hardcoded Agile Tag ID
        });
        let finesseTag = tagArray.find(tag => {
            return tag.id == 42; // Hardcoded Finesse Tag ID
        });
        let abilMod = strMod;
        if(finesseTag != null){
          abilMod = (dexMod > abilMod) ? dexMod : abilMod;
        } // Use preDex mod becuase Clumsy condition affects ranged attacks but not finesse melee attacks?
    
        let profNumUps = weaponProfDetermineNumUps(itemData);

        let profData = g_weaponProfMap.get(itemData.WeaponData.profName);
        let profBonus = null;
        if(profData != null){
            profBonus = profData.UserBonus;
        } else {
            profBonus = 0;
        }

        let profAttackBonus;
        if(profNumUps === 0 && gState_addLevelToUntrainedWeaponAttack && !gOption_hasProfWithoutLevel) {
            profAttackBonus = g_character.level; // Sheet-State, adds level to untrained weapons
        } else {
            profAttackBonus = getProfNumber(profNumUps, g_character.level);
        }

        let splashTag = tagArray.find(tag => {
            return tag.id == 391; // Hardcoded Splash Tag ID
        });
        let dmgStrBonus = '';
        if(gState_hasFinesseMeleeUseDexDamage && finesseTag != null){
            if(dexMod > strMod) {
              if(dexMod != 0){
                dmgStrBonus = signNumber(dexMod);
              }
            } else {
              if(strMod != 0){
                dmgStrBonus = signNumber(strMod);
              }
            }
        } else {
            if(splashTag == null && strMod != 0){
                dmgStrBonus = signNumber(strMod);
            }
        }

        let potencyRuneBonus = 0;
        if(isWeaponPotencyOne(invItem.fundPotencyRuneID)){
          potencyRuneBonus = 1;
        } else if(isWeaponPotencyTwo(invItem.fundPotencyRuneID)){
          potencyRuneBonus = 2;
        } else if(isWeaponPotencyThree(invItem.fundPotencyRuneID)){
          potencyRuneBonus = 3;
        }

        let shoddyPenalty = (invItem.isShoddy == 1) ? -2 : 0;

        let otherBonuses = getStatTotal('ATTACKS');
        otherBonuses += getStatTotal('MELEE_ATTACKS');

        let attackBonus = signNumber(abilMod+profAttackBonus+profBonus+potencyRuneBonus+shoddyPenalty+otherBonuses);

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

        let weapSpecialBonus = 0; // Hardcoded Damage Amount to Weap Profs
        if(g_specializationStruct.WeaponSpecial){
            if(profNumUps === 2) {
                weapSpecialBonus = 2;
            } else if(profNumUps === 3) {
                weapSpecialBonus = 3;
            } else if(profNumUps === 4) {
                weapSpecialBonus = 4;
            }
        }
        if(g_specializationStruct.GreaterWeaponSpecial){
            if(profNumUps === 2) {
                weapSpecialBonus = 4;
            } else if(profNumUps === 3) {
                weapSpecialBonus = 6;
            } else if(profNumUps === 4) {
                weapSpecialBonus = 8;
            }
        }
        let weapSpecial = (weapSpecialBonus != 0) ? signNumber(weapSpecialBonus) : '';

        // Bonus for - Weapons //
        let weapExtraBonus = getStatTotal('ATTACKS_DMG_BONUS');
        let weapExtra = '';
        if(weapExtraBonus != null) {
          weapExtra = signNumber(weapExtraBonus);
        } else {
          weapExtraBonus = 0;
        }

        // Bonus for - Melee Weapons //
        let weapMeleeExtraBonus = getStatTotal('MELEE_ATTACKS_DMG_BONUS');
        let weapMeleeExtra = '';
        if(weapMeleeExtraBonus != null) {
          weapMeleeExtra = signNumber(weapMeleeExtraBonus);
        } else {
          weapMeleeExtraBonus = 0;
        }

        // Bonus for - Agile Melee Weapons //
        let weapMeleeAgileExtraBonus = getStatTotal('AGILE_MELEE_ATTACKS_DMG_BONUS');
        let weapMeleeAgileExtra = '';
        let weapMeleeNonAgileExtraBonus = getStatTotal('NON_AGILE_MELEE_ATTACKS_DMG_BONUS');
        let weapMeleeNonAgileExtra = '';
        if(agileTag != null){
          if(weapMeleeAgileExtraBonus != null) {
            weapMeleeAgileExtra = signNumber(weapMeleeAgileExtraBonus);
          } else {
            weapMeleeAgileExtraBonus = 0;
          }
        } else {
          if(weapMeleeNonAgileExtraBonus != null) {
            weapMeleeNonAgileExtra = signNumber(weapMeleeNonAgileExtraBonus);
          } else {
            weapMeleeNonAgileExtraBonus = 0;
          }
        }

        let damageBonusInt = strMod+weapSpecialBonus+weapExtraBonus+weapMeleeExtraBonus+weapMeleeAgileExtraBonus+weapMeleeNonAgileExtraBonus;
        let damageBonusStr = dmgStrBonus+weapSpecial+weapExtra+weapMeleeExtra+weapMeleeAgileExtra+weapMeleeNonAgileExtra;

        let damage = '';
        if(damageDieType != 'NONE') {
            let maxDamage = diceNum*dieTypeToNum(damageDieType)+damageBonusInt;
            if(maxDamage >= 1) {
                damage = diceNum+""+damageDieType+damageBonusStr+" "+damageDamageType;
            } else {
                damage = '<a class="has-text-grey" data-tooltip="'+diceNum+""+damageDieType+damageBonusStr+'">1</a> '+damageDamageType;
            }
        } else {
            damage = '-';
        }

        return { AttackBonus : attackBonus, Damage : damage };

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

        let dmgStrSigned = '';
        let dmgStr = 0;

        if(propulsiveTag != null){
            if(strMod >= 0){
                let strAmt = Math.floor(strMod/2);
                if(strAmt != 0){
                    dmgStrSigned = signNumber(strAmt);
                    dmgStr = strAmt;
                }
            } else {
                dmgStrSigned = signNumber(strMod);
                dmgStr = strMod;
            }
        }
        if(thrownTag != null && splashTag == null && strMod != 0){
            dmgStrSigned = signNumber(strMod);
            dmgStr = strMod;
        }

        let profNumUps = weaponProfDetermineNumUps(itemData);

        let profData = g_weaponProfMap.get(itemData.WeaponData.profName);
        let profBonus = null;
        if(profData != null){
            profBonus = profData.UserBonus;
        } else {
            profBonus = 0;
        }

        let profAttackBonus;
        if(profNumUps === 0 && gState_addLevelToUntrainedWeaponAttack && !gOption_hasProfWithoutLevel) {
            profAttackBonus = g_character.level; // Sheet-State, adds level to untrained weapons
        } else {
            profAttackBonus = getProfNumber(profNumUps, g_character.level);
        }

        let potencyRuneBonus = 0;
        if(isWeaponPotencyOne(invItem.fundPotencyRuneID)){
          potencyRuneBonus = 1;
        } else if(isWeaponPotencyTwo(invItem.fundPotencyRuneID)){
          potencyRuneBonus = 2;
        } else if(isWeaponPotencyThree(invItem.fundPotencyRuneID)){
          potencyRuneBonus = 3;
        }

        let shoddyPenalty = (invItem.isShoddy == 1) ? -2 : 0;

        let otherBonuses = getStatTotal('ATTACKS');
        otherBonuses += getStatTotal('RANGED_ATTACKS');

        let attackBonus = signNumber(dexMod+profAttackBonus+profBonus+potencyRuneBonus+shoddyPenalty+otherBonuses);

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
        let overrideRangedDmgDice = getStatTotal('RANGED_ATTACKS_DMG_DICE');
        if(overrideRangedDmgDice != null) { diceNum = overrideRangedDmgDice; }

        let weapSpecialBonus = 0; // Hardcoded Damage Amount to Weap Profs
        if(g_specializationStruct.WeaponSpecial){
            if(profNumUps === 2) {
                weapSpecialBonus = 2;
            } else if(profNumUps === 3) {
                weapSpecialBonus = 3;
            } else if(profNumUps === 4) {
                weapSpecialBonus = 4;
            }
        }
        if(g_specializationStruct.GreaterWeaponSpecial){
            if(profNumUps === 2) {
                weapSpecialBonus = 4;
            } else if(profNumUps === 3) {
                weapSpecialBonus = 6;
            } else if(profNumUps === 4) {
                weapSpecialBonus = 8;
            }
        }
        let weapSpecial = (weapSpecialBonus != 0) ? signNumber(weapSpecialBonus) : '';

        let weapExtraBonus = getStatTotal('ATTACKS_DMG_BONUS');
        let weapExtra = '';
        if(weapExtraBonus != null) {
          weapExtra = signNumber(weapExtraBonus);
        } else {
          weapExtraBonus = 0;
        }

        let weapRangedExtraBonus = getStatTotal('RANGED_ATTACKS_DMG_BONUS');
        let weapRangedExtra = '';
        if(weapRangedExtraBonus != null) {
          weapRangedExtra = signNumber(weapRangedExtraBonus);
        } else {
          weapRangedExtraBonus = 0;
        }

        let damageBonusInt = dmgStr+weapSpecialBonus+weapExtraBonus+weapRangedExtraBonus;
        let damageBonusStr = dmgStrSigned+weapSpecial+weapExtra+weapRangedExtra;

        let damage = '';
        if(damageDieType != 'NONE') {
            let maxDamage = diceNum*dieTypeToNum(damageDieType)+damageBonusInt;
            if(maxDamage >= 1) {
                damage = diceNum+""+damageDieType+damageBonusStr+" "+damageDamageType;
            } else {
                damage = '<a class="has-text-grey" data-tooltip="'+diceNum+""+damageDieType+damageBonusStr+'">1</a> '+damageDamageType;
            }
        } else {
            damage = '-';
        }

        return { AttackBonus : attackBonus, Damage : damage };

    } else {
        return { AttackBonus : null, Damage : null };
    }

}


// MAP Calc //
function generateStringMAP(attackBonus, itemTagArray){

  attackBonus = parseInt(attackBonus);
  let agileTag = itemTagArray.find(tag => {
    return tag.id == 43; // Hardcoded Agile Tag ID
  });

  if(gState_MAP == 'TIER_1'){
    if(agileTag == null){
      return signNumber(attackBonus)+'/'+signNumber(attackBonus-5)+'/'+signNumber(attackBonus-10);
    } else {
      return signNumber(attackBonus)+'/'+signNumber(attackBonus-4)+'/'+signNumber(attackBonus-8);
    }
  } else if(gState_MAP == 'TIER_2'){
    if(agileTag == null){
      return signNumber(attackBonus)+'/'+signNumber(attackBonus-4)+'/'+signNumber(attackBonus-8);
    } else {
      return signNumber(attackBonus)+'/'+signNumber(attackBonus-3)+'/'+signNumber(attackBonus-6);
    }
  } else if(gState_MAP == 'TIER_3'){
    if(agileTag == null){
      return signNumber(attackBonus)+'/'+signNumber(attackBonus-3)+'/'+signNumber(attackBonus-6);
    } else {
      return signNumber(attackBonus)+'/'+signNumber(attackBonus-2)+'/'+signNumber(attackBonus-4);
    }
  } else if(gState_MAP == 'TIER_4'){
    if(agileTag == null){
      return signNumber(attackBonus)+'/'+signNumber(attackBonus-2)+'/'+signNumber(attackBonus-4);
    } else {
      return signNumber(attackBonus)+'/'+signNumber(attackBonus-1)+'/'+signNumber(attackBonus-2);
    }
  }

}