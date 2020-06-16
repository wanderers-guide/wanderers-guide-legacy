
function findItemDataByName(itemMap, itemName){
    for(const [itemID, itemData] of itemMap.entries()){
        if(itemData.Item.name.toLowerCase() == itemName){
            return itemData;
        }
    }
    return null;
}

function buildWeaponProfMap(){

    let weaponProfMap = new Map(); // Key: ItemID Value: { NumUps, UserBonus }

    for(const [profName, profData] of g_profMap.entries()){
        if(profData.For == "Attack"){

            if(profName == 'Simple_Weapons'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.WeaponData != null && itemData.WeaponData.category == "SIMPLE"){
                        weaponProfMap.set(parseInt(itemID), {
                            NumUps : profData.NumUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else if(profName == 'Martial_Weapons'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.WeaponData != null && itemData.WeaponData.category == "MARTIAL"){
                        weaponProfMap.set(parseInt(itemID), {
                            NumUps : profData.NumUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else if(profName == 'Advanced_Weapons'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.WeaponData != null && itemData.WeaponData.category == "ADVANCED"){
                        weaponProfMap.set(parseInt(itemID), {
                            NumUps : profData.NumUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else if(profName == 'Unarmed_Attacks'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.WeaponData != null && itemData.WeaponData.category == "UNARMED"){
                        weaponProfMap.set(parseInt(itemID), {
                            NumUps : profData.NumUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else {
                let dProfName = profName.toLowerCase().replace(/_/g,' ');
                let itemData = findItemDataByName(g_itemMap, dProfName);
                if(itemData != null){
                    weaponProfMap.set(itemData.Item.id, {
                        NumUps : profData.NumUps,
                        UserBonus : profData.UserBonus
                    });
                }
            }

        }
    }

    return weaponProfMap;
}


function buildArmorProfMap(){

    let armorProfMap = new Map(); // Key: ItemID Value: { NumUps, UserBonus }

    for(const [profName, profData] of g_profMap.entries()){
        if(profData.For == "Defense"){

            if(profName == 'Light_Armor'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.ArmorData != null && itemData.ArmorData.category == "LIGHT"){
                        armorProfMap.set(parseInt(itemID), {
                            NumUps : profData.NumUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else if(profName == 'Medium_Armor'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.ArmorData != null && itemData.ArmorData.category == "MEDIUM"){
                        armorProfMap.set(parseInt(itemID), {
                            NumUps : profData.NumUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else if(profName == 'Heavy_Armor'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.ArmorData != null && itemData.ArmorData.category == "HEAVY"){
                        armorProfMap.set(parseInt(itemID), {
                            NumUps : profData.NumUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else if(profName == 'Unarmored_Defense'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.ArmorData != null && itemData.ArmorData.category == "UNARMORED"){
                        armorProfMap.set(parseInt(itemID), {
                            NumUps : profData.NumUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else {
                let dProfName = profName.toLowerCase().replace(/_/g,' ');
                let itemData = findItemDataByName(g_itemMap, dProfName);
                if(itemData != null){
                    armorProfMap.set(itemData.Item.id, {
                        NumUps : profData.NumUps,
                        UserBonus : profData.UserBonus
                    });
                }
            }

        }
    }

    return armorProfMap;
}