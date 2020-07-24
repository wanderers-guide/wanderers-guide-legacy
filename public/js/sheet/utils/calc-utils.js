/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function getAttackAndDamage(itemData, invItem){

    let strMod = getMod(getStatTotal('SCORE_STR'));
    let dexMod = getMod(getStatTotal('SCORE_DEX'));
    let pre_strMod = getMod(g_preConditions_strScore);
    let pre_dexMod = getMod(g_preConditions_dexScore);
    let itemRuneData = invItem.itemRuneData;

    if(itemData.WeaponData.isMelee == 1){

        let finesseTag = itemData.TagArray.find(tag => {
            return tag.Tag.id == 42; // Hardcoded Finesse Tag ID
        });
        let abilMod = strMod;
        if(finesseTag != null){
            abilMod = (pre_dexMod > abilMod) ? pre_dexMod : abilMod;
        } // Use preDex mod becuase Clumsy condition affects ranged attacks but not finesse melee attacks
        
        let profData = g_weaponProfMap.get(itemData.WeaponData.profName);
    
        let profNumUps = null;
        let profBonus = null;
        if(profData != null){
            profNumUps = profData.NumUps;
            profBonus = profData.UserBonus;
        } else {
            profNumUps = 0;
            profBonus = 0;
        }

        let profAttackBonus;
        if(profNumUps === 0 && gState_addLevelToUntrainedWeaponAttack && !gOption_hasProfWithoutLevel) {
            profAttackBonus = g_character.level; // Sheet-State, adds level to untrained weapons
        } else {
            profAttackBonus = getProfNumber(profNumUps, g_character.level);
        }

        let splashTag = itemData.TagArray.find(tag => {
            return tag.Tag.id == 391; // Hardcoded Splash Tag ID
        });
        let dmgStrBonus = '';
        if(gState_hasFinesseMeleeUseDexDamage && finesseTag != null){
            if(pre_dexMod != 0){
                dmgStrBonus = signNumber(pre_dexMod);
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
        if(itemData.WeaponData.dieType != 'NONE') {
            let maxDamage = diceNum*dieTypeToNum(itemData.WeaponData.dieType)+pre_strMod+weapSpecialBonus;
            if(maxDamage >= 1) {
                damage = diceNum+""+itemData.WeaponData.dieType+dmgStrBonus+weapSpecial+" "+itemData.WeaponData.damageType;
            } else {
                damage = '<a class="has-text-grey" data-tooltip="'+diceNum+""+itemData.WeaponData.dieType+dmgStrBonus+weapSpecial+'">1</a> '+itemData.WeaponData.damageType;
            }
        } else {
            damage = '-';
        }

        return { AttackBonus : attackBonus, Damage : damage };

    } else if(itemData.WeaponData.isRanged == 1){

        let thrownTag = itemData.TagArray.find(tag => {
            return 47 <= tag.Tag.id && tag.Tag.id <= 54; // Hardcoded Thrown Tag ID Range (47-54)
        });
        let splashTag = itemData.TagArray.find(tag => {
            return tag.Tag.id == 391; // Hardcoded Splash Tag ID
        });
        let propulsiveTag = itemData.TagArray.find(tag => {
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

        let profData = g_weaponProfMap.get(itemData.WeaponData.profName);

        let profNumUps = null;
        let profBonus = null;
        if(profData != null){
            profNumUps = profData.NumUps;
            profBonus = profData.UserBonus;
        } else {
            profNumUps = 0;
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
        if(itemData.WeaponData.dieType != 'NONE') {
            let maxDamage = diceNum*dieTypeToNum(itemData.WeaponData.dieType)+dmgStr+weapSpecialBonus;
            if(maxDamage >= 1) {
                damage = diceNum+""+itemData.WeaponData.dieType+dmgStrSigned+weapSpecial+" "+itemData.WeaponData.damageType;
            } else {
                damage = '<a class="has-text-grey" data-tooltip="'+diceNum+""+itemData.WeaponData.dieType+dmgStrSigned+weapSpecial+'">1</a> '+itemData.WeaponData.damageType;
            }
        } else {
            damage = '-';
        }

        return { AttackBonus : attackBonus, Damage : damage };

    } else {
        return { AttackBonus : null, Damage : null };
    }

}