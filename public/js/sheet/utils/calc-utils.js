

function getAttackAndDamage(itemData, invItem, strMod, dexMod){
    
    let itemRuneData = invItem.itemRuneData;

    if(itemData.WeaponData.isMelee == 1){

        let finesseTag = itemData.TagArray.find(tag => {
            return tag.Tag.id == 42; // Hardcoded Finesse Tag ID
        });
        let abilMod = strMod;
        if(finesseTag != null){
            abilMod = (dexMod > abilMod) ? dexMod : abilMod;
        }
    
        let profData = g_weaponProfMap.get(itemData.Item.id+"");
    
        let profNumUps = null;
        let profBonus = null;
        if(profData != null){
            profNumUps = profData.NumUps;
            profBonus = profData.Bonus;
        } else {
            profNumUps = 0;
            profBonus = 0;
        }

        let dmgStrBonus = (strMod == 0) ? '' : signNumber(strMod);

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

        let attackBonus = signNumber(abilMod+getProfNumber(profNumUps, g_character.level)+profBonus+potencyRuneBonus+shoddyPenalty+otherBonuses);

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
        let maxDamage = diceNum*dieTypeToNum(itemData.WeaponData.dieType)+strMod+weapSpecialBonus;
        if(maxDamage > 1) {
            damage = diceNum+""+itemData.WeaponData.dieType+dmgStrBonus+weapSpecial+" "+itemData.WeaponData.damageType;
        } else {
            damage = '<a class="has-text-grey" data-tooltip="'+diceNum+""+itemData.WeaponData.dieType+dmgStrBonus+weapSpecial+'">1</a> '+itemData.WeaponData.damageType;
        }

        return { AttackBonus : attackBonus, Damage : damage };

    } else if(itemData.WeaponData.isRanged == 1){

        let thrownTag = itemData.TagArray.find(tag => {
            return tag.Tag.id == 47; // Hardcoded Thrown Tag ID
        });
        let dmgStrBonus = '';
        if(thrownTag != null && strMod != 0){
            dmgStrBonus = signNumber(strMod);
        }

        let profData = g_weaponProfMap.get(itemData.Item.id+"");
        
        let profNumUps = null;
        let profBonus = null;
        if(profData != null){
            profNumUps = profData.NumUps;
            profBonus = profData.Bonus;
        } else {
            profNumUps = 0;
            profBonus = 0;
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

        let attackBonus = signNumber(dexMod+getProfNumber(profNumUps, g_character.level)+profBonus+potencyRuneBonus+shoddyPenalty+otherBonuses);

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
        let maxDamage = diceNum*dieTypeToNum(itemData.WeaponData.dieType)+strMod+weapSpecialBonus;
        if(maxDamage > 1) {
            damage = diceNum+""+itemData.WeaponData.dieType+dmgStrBonus+weapSpecial+" "+itemData.WeaponData.damageType;
        } else {
            damage = '<a class="has-text-grey" data-tooltip="'+diceNum+""+itemData.WeaponData.dieType+dmgStrBonus+weapSpecial+'">1</a> '+itemData.WeaponData.damageType;
        }

        return { AttackBonus : attackBonus, Damage : damage };

    } else {
        return null;
    }

}