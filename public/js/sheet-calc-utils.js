

function getAttackAndDamage(itemData, strMod, dexMod){

    if(itemData.WeaponData.isMelee == 1){

        let finesseTag = itemData.TagArray.find(tag => {
            return tag.Tag.id == 42; // Finesse Tag ID
        });
        let abilMod = strMod;
        if(finesseTag != null){
            abilMod = (dexMod > abilMod) ? dexMod : abilMod;
        }
    
        let profData = g_weaponProfMap.get(itemData.Item.id+"");
    
        let profNumUps = null;
        let profBonus = null;
        if(profData != null){
            profNumUps = profData.NumUps
            profBonus = profData.Bonus;
        } else {
            profNumUps = 0;
            profBonus = 0;
        }

        let dmgStrBonus = (strMod == 0) ? '' : signNumber(strMod);

        let attackBonus = signNumber(abilMod+getProfNumber(profNumUps, g_character.level)+profBonus);

        let damage = '';
        let maxDamage = itemData.WeaponData.diceNum*dieTypeToNum(itemData.WeaponData.dieType)+strMod;
        if(maxDamage > 1) {
            damage = itemData.WeaponData.diceNum+""+itemData.WeaponData.dieType+dmgStrBonus+" "+itemData.WeaponData.damageType;
        } else {
            damage = '<a class="has-text-grey" data-tooltip="'+itemData.WeaponData.diceNum+""+itemData.WeaponData.dieType+dmgStrBonus+'">1</a> '+itemData.WeaponData.damageType;
        }

        return { AttackBonus : attackBonus, Damage : damage };

    } else if(itemData.WeaponData.isRanged == 1){

        let thrownTag = itemData.TagArray.find(tag => {
            return tag.Tag.id == 45; // Thrown Tag ID
        });
        let dmgStrBonus = '';
        if(thrownTag != null && strMod != 0){
            dmgStrBonus = signNumber(strMod);
        }

        let profData = g_weaponProfMap.get(itemData.Item.id+"");
        
        let profNumUps = null;
        let profBonus = null;
        if(profData != null){
            profNumUps = profData.NumUps
            profBonus = profData.Bonus;
        } else {
            profNumUps = 0;
            profBonus = 0;
        }

        let attackBonus = signNumber(dexMod+getProfNumber(profNumUps, g_character.level)+profBonus);

        let damage = '';
        let maxDamage = itemData.WeaponData.diceNum*dieTypeToNum(itemData.WeaponData.dieType)+strMod;
        if(maxDamage > 1) {
            damage = itemData.WeaponData.diceNum+""+itemData.WeaponData.dieType+dmgStrBonus+" "+itemData.WeaponData.damageType;
        } else {
            damage = '<a class="has-text-grey" data-tooltip="'+itemData.WeaponData.diceNum+""+itemData.WeaponData.dieType+dmgStrBonus+'">1</a> '+itemData.WeaponData.damageType;
        }

        return { AttackBonus : attackBonus, Damage : damage };

    } else {
        return null;
    }

}
