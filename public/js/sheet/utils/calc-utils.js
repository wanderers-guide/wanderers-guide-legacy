/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function getAttackAndDamage(itemData, invItem){

    let strMod = getMod(getStatTotal('SCORE_STR'));
    let dexMod = getMod(getStatTotal('SCORE_DEX'));
    let pre_strMod = getMod(g_preConditions_strScore);
    let pre_dexMod = getMod(g_preConditions_dexScore);
    let itemRuneData = (invItem.invItemRunes != null) ? invItem.invItemRunes[0] : null;

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

        let finesseTag = tagArray.find(tag => {
            return tag.Tag.id == 42; // Hardcoded Finesse Tag ID
        });
        let abilMod = strMod;
        if(finesseTag != null){
            abilMod = (pre_dexMod > abilMod) ? pre_dexMod : abilMod;
        } // Use preDex mod becuase Clumsy condition affects ranged attacks but not finesse melee attacks
    
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
            return tag.Tag.id == 391; // Hardcoded Splash Tag ID
        });
        let dmgStrBonus = '';
        if(gState_hasFinesseMeleeUseDexDamage && finesseTag != null){
            if(pre_dexMod > pre_strMod) {
              if(pre_dexMod != 0){
                dmgStrBonus = signNumber(pre_dexMod);
              }
            } else {
              if(pre_strMod != 0){
                dmgStrBonus = signNumber(pre_strMod);
              }
            }
        } else {
            if(splashTag == null && pre_strMod != 0){
                dmgStrBonus = signNumber(pre_strMod);
            }
        }

        let potencyRuneBonus = 0;
        if(itemRuneData != null){
            if(isWeaponPotencyOne(itemRuneData.fundPotencyRuneID)){
                potencyRuneBonus = 1;
            } else if(isWeaponPotencyTwo(itemRuneData.fundPotencyRuneID)){
                potencyRuneBonus = 2;
            } else if(isWeaponPotencyThree(itemRuneData.fundPotencyRuneID)){
                potencyRuneBonus = 3;
            }
        }

        let shoddyPenalty = (invItem.isShoddy == 1) ? -2 : 0;

        let otherBonuses = getStatTotal('ATTACKS');
        otherBonuses += getStatTotal('MELEE_ATTACKS');

        let attackBonus = signNumber(abilMod+profAttackBonus+profBonus+potencyRuneBonus+shoddyPenalty+otherBonuses);

        let diceNum = itemData.WeaponData.diceNum;
        if(itemRuneData != null){
            if(isStriking(itemRuneData.fundRuneID)){
                diceNum = 2;
            } else if(isGreaterStriking(itemRuneData.fundRuneID)){
                diceNum = 3;
            } else if(isMajorStriking(itemRuneData.fundRuneID)){
                diceNum = 4;
            }
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

        let damage = '';
        if(damageDieType != 'NONE') {
            let maxDamage = diceNum*dieTypeToNum(damageDieType)+pre_strMod+weapSpecialBonus;
            if(maxDamage >= 1) {
                damage = diceNum+""+damageDieType+dmgStrBonus+weapSpecial+" "+damageDamageType;
            } else {
                damage = '<a class="has-text-grey" data-tooltip="'+diceNum+""+damageDieType+dmgStrBonus+weapSpecial+'">1</a> '+damageDamageType;
            }
        } else {
            damage = '-';
        }

        return { AttackBonus : attackBonus, Damage : damage };

    } else if(itemData.WeaponData.isRanged == 1){

        let thrownTag = tagArray.find(tag => {
            return 47 <= tag.Tag.id && tag.Tag.id <= 54; // Hardcoded Thrown Tag ID Range (47-54)
        });
        let splashTag = tagArray.find(tag => {
            return tag.Tag.id == 391; // Hardcoded Splash Tag ID
        });
        let propulsiveTag = tagArray.find(tag => {
            return tag.Tag.id == 653; // Hardcoded Propulsive Tag ID
        });

        let dmgStrSigned = '';
        let dmgStr = 0;

        if(propulsiveTag != null){
            if(pre_strMod >= 0){
                let strAmt = Math.floor(pre_strMod/2);
                if(strAmt != 0){
                    dmgStrSigned = signNumber(strAmt);
                    dmgStr = strAmt;
                }
            } else {
                dmgStrSigned = signNumber(pre_strMod);
                dmgStr = pre_strMod;
            }
        }
        if(thrownTag != null && splashTag == null && pre_strMod != 0){
            dmgStrSigned = signNumber(pre_strMod);
            dmgStr = pre_strMod;
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
        if(itemRuneData != null){
            if(isWeaponPotencyOne(itemRuneData.fundPotencyRuneID)){
                potencyRuneBonus = 1;
            } else if(isWeaponPotencyTwo(itemRuneData.fundPotencyRuneID)){
                potencyRuneBonus = 2;
            } else if(isWeaponPotencyThree(itemRuneData.fundPotencyRuneID)){
                potencyRuneBonus = 3;
            }
        }

        let shoddyPenalty = (invItem.isShoddy == 1) ? -2 : 0;

        let otherBonuses = getStatTotal('ATTACKS');
        otherBonuses += getStatTotal('RANGED_ATTACKS');

        let attackBonus = signNumber(dexMod+profAttackBonus+profBonus+potencyRuneBonus+shoddyPenalty+otherBonuses);

        let diceNum = itemData.WeaponData.diceNum;
        if(itemRuneData != null){
            if(isStriking(itemRuneData.fundRuneID)){
                diceNum = 2;
            } else if(isGreaterStriking(itemRuneData.fundRuneID)){
                diceNum = 3;
            } else if(isMajorStriking(itemRuneData.fundRuneID)){
                diceNum = 4;
            }
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

        let damage = '';
        if(damageDieType != 'NONE') {
            let maxDamage = diceNum*dieTypeToNum(damageDieType)+dmgStr+weapSpecialBonus;
            if(maxDamage >= 1) {
                damage = diceNum+""+damageDieType+dmgStrSigned+weapSpecial+" "+damageDamageType;
            } else {
                damage = '<a class="has-text-grey" data-tooltip="'+diceNum+""+damageDieType+dmgStrSigned+weapSpecial+'">1</a> '+damageDamageType;
            }
        } else {
            damage = '-';
        }

        return { AttackBonus : attackBonus, Damage : damage };

    } else {
        return { AttackBonus : null, Damage : null };
    }

}