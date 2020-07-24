/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

// Note: The fundamental RuneIDs in here are hardcoded. //

function isWeaponPotencyOne(runeID){
    return runeID == 20;
}

function isWeaponPotencyTwo(runeID){
    return runeID == 27;
}

function isWeaponPotencyThree(runeID){
    return runeID == 31;
}

//

function isStriking(runeID){
    return runeID == 24;
}

function isGreaterStriking(runeID){
    return runeID == 29;
}

function isMajorStriking(runeID){
    return runeID == 33;
}

//

function isArmorPotencyOne(runeID){
    return runeID == 25;
}

function isArmorPotencyTwo(runeID){
    return runeID == 28;
}

function isArmorPotencyThree(runeID){
    return runeID == 32;
}

//

function isResilient(runeID){
    return runeID == 26;
}

function isGreaterResilient(runeID){
    return runeID == 30;
}

function isMajorResilient(runeID){
    return runeID == 34;
}

//

function isWeaponPotencyRune(runeID){
    return isWeaponPotencyOne(runeID) || isWeaponPotencyTwo(runeID) || isWeaponPotencyThree(runeID);
}

function isStrikingRune(runeID){
    return isStriking(runeID) || isGreaterStriking(runeID) || isMajorStriking(runeID);
}

//

function isArmorPotencyRune(runeID){
    return isArmorPotencyOne(runeID) || isArmorPotencyTwo(runeID) || isArmorPotencyThree(runeID);
}

function isResilientRune(runeID){
    return isResilient(runeID) || isGreaterResilient(runeID) || isMajorResilient(runeID);
}

//

function runestoneNameToRuneName(runestoneItemName){
    return runestoneItemName.replace(' Runestone','');
}



function displayRunesForItem(qContent, invItem, isWeapon){
    const runeDataStruct = g_runeDataStruct;

    let invItemAddFundamentalRuneSelectID = 'invItemAddFundamentalRuneSelect'+invItem.id;
    let invItemAddFundamentalRuneButtonID = 'invItemAddFundamentalRuneButton'+invItem.id;

    qContent.append('<div id="addFuneRuneField" class="field has-addons has-addons-centered is-marginless"><div class="control"><div class="select is-small is-success"><select id="'+invItemAddFundamentalRuneSelectID+'"></select></div></div><div class="control"><button id="'+invItemAddFundamentalRuneButtonID+'" type="submit" class="button is-small is-success is-rounded is-outlined">Add</button></div></div>');

    $('#'+invItemAddFundamentalRuneSelectID).append('<option value="chooseDefault">Add Fundamental Rune</option>');
    $('#'+invItemAddFundamentalRuneSelectID).append('<hr class="dropdown-divider"></hr>');
    
    let foundRune = false;
    if(isWeapon) {

        for(let weaponRuneItem of runeDataStruct.WeaponArray){
            if(weaponRuneItem == null){ continue; }
            if(weaponRuneItem.RuneData.isFundamental == 1) {
    
                 let dontDisplay = false;
                if(invItem.itemRuneData != null){
                    if(isWeaponPotencyRune(weaponRuneItem.RuneData.id)){
                        let hasPotency = isWeaponPotencyRune(invItem.itemRuneData.fundPotencyRuneID);
                        if(hasPotency) {
                            dontDisplay = true;
                        }
                    }
                    if(isStrikingRune(weaponRuneItem.RuneData.id)){
                        let hasStriking = isStrikingRune(invItem.itemRuneData.fundRuneID);
                        if(hasStriking) {
                            dontDisplay = true;
                        }
                    }
                }
                        
                if(!dontDisplay){
                    foundRune = true;
                    $('#'+invItemAddFundamentalRuneSelectID).append('<option value="'+weaponRuneItem.RuneData.id+'">'+runestoneNameToRuneName(weaponRuneItem.Item.name)+'</option>');
                }
            }
        }

    } else {

        for(let armorRuneItem of runeDataStruct.ArmorArray){
            if(armorRuneItem == null){ continue; }
            if(armorRuneItem.RuneData.isFundamental == 1) {
    
                 let dontDisplay = false;
                if(invItem.itemRuneData != null){
                    if(isArmorPotencyRune(armorRuneItem.RuneData.id)){
                        let hasPotency = isArmorPotencyRune(invItem.itemRuneData.fundPotencyRuneID);
                        if(hasPotency) {
                            dontDisplay = true;
                        }
                    }
                    if(isResilientRune(armorRuneItem.RuneData.id)){
                        let hasResilient = isResilientRune(invItem.itemRuneData.fundRuneID);
                        if(hasResilient) {
                            dontDisplay = true;
                        }
                    }
                }
                        
                if(!dontDisplay){
                    foundRune = true;
                    $('#'+invItemAddFundamentalRuneSelectID).append('<option value="'+armorRuneItem.RuneData.id+'">'+runestoneNameToRuneName(armorRuneItem.Item.name)+'</option>');
                }
            }
        }

    }

    if(!foundRune){
        $('#addFuneRuneField').addClass('is-hidden');
    } else {
        $('#'+invItemAddFundamentalRuneButtonID).click(function() {
            let runeID = $('#'+invItemAddFundamentalRuneSelectID).val();
            if(runeID != "chooseDefault"){
                $(this).addClass('is-loading');
                socket.emit("requestAddFundamentalRune",
                    invItem.id,
                    runeID);
            }
        });
    }

    if(invItem.itemRuneData != null){

        displayRunesInQuickview(qContent, invItem, runeDataStruct);
                
    }

}



function displayRunesInQuickview(qContent, invItem, runeDataStruct){

    if(invItem.itemRuneData.fundRuneID != null){
        let fundRuneID = invItem.itemRuneData.fundRuneID;
        if(isStriking(fundRuneID)){

            let runeName = "Striking";
            let runeDescription = "A striking rune stores destructive magic in the weapon, increasing the weapon damage dice it deals to two instead of one.";
            addFundamentalRuneEntry(qContent, invItem, fundRuneID, runeName, runeDescription);

        }

        if(isGreaterStriking(fundRuneID)){

            let runeName = "Greater Striking";
            let runeDescription = "A greater striking rune stores destructive magic in the weapon, increasing the weapon damage dice it deals to three instead of one.";
            addFundamentalRuneEntry(qContent, invItem, fundRuneID, runeName, runeDescription);

        }

        if(isMajorStriking(fundRuneID)){

            let runeName = "Major Striking";
            let runeDescription = "A major striking rune stores destructive magic in the weapon, increasing the weapon damage dice it deals to four instead of one.";
            addFundamentalRuneEntry(qContent, invItem, fundRuneID, runeName, runeDescription);

        }

        ////

        if(isResilient(fundRuneID)){

            let runeName = "Resilient";
            let runeDescription = "Resilient runes imbue armor with additional protective magic. This grants the wearer a +1 item bonus to saving throws.";
            addFundamentalRuneEntry(qContent, invItem, fundRuneID, runeName, runeDescription);

        }

        if(isGreaterResilient(fundRuneID)){

            let runeName = "Greater Resilient";
            let runeDescription = "Resilient runes imbue armor with additional protective magic. This grants the wearer a +2 item bonus to saving throws.";
            addFundamentalRuneEntry(qContent, invItem, fundRuneID, runeName, runeDescription);

        }

        if(isMajorResilient(fundRuneID)){

            let runeName = "Major Resilient";
            let runeDescription = "Resilient runes imbue armor with additional protective magic. This grants the wearer a +3 item bonus to saving throws.";
            addFundamentalRuneEntry(qContent, invItem, fundRuneID, runeName, runeDescription);

        }

    }
    if(invItem.itemRuneData.fundPotencyRuneID != null){
        let potencyRuneID = invItem.itemRuneData.fundPotencyRuneID;
        if(isWeaponPotencyOne(potencyRuneID)){
            
            let runeName = "+1 Weapon Potency";
            let runeDescription = "Magical enhancements make this weapon strike true. Attack rolls with this weapon gain a +1 item bonus, and the weapon can be etched with one property rune.";
            addFundamentalRuneEntry(qContent, invItem, potencyRuneID, runeName, runeDescription);

            addPropertyRuneSelection(qContent, invItem, runeDataStruct.WeaponArray, 1);

        }

        if(isWeaponPotencyTwo(potencyRuneID)){
            
            let runeName = "+2 Weapon Potency";
            let runeDescription = "Magical enhancements make this weapon strike true. Attack rolls with this weapon gain a +2 item bonus, and the weapon can be etched with two property runes.";
            addFundamentalRuneEntry(qContent, invItem, potencyRuneID, runeName, runeDescription);

            addPropertyRuneSelection(qContent, invItem, runeDataStruct.WeaponArray, 1);
            addPropertyRuneSelection(qContent, invItem, runeDataStruct.WeaponArray, 2);

        }

        if(isWeaponPotencyThree(potencyRuneID)){
            
            let runeName = "+3 Weapon Potency";
            let runeDescription = "Magical enhancements make this weapon strike true. Attack rolls with this weapon gain a +3 item bonus, and the weapon can be etched with three property runes.";
            addFundamentalRuneEntry(qContent, invItem, potencyRuneID, runeName, runeDescription);

            addPropertyRuneSelection(qContent, invItem, runeDataStruct.WeaponArray, 1);
            addPropertyRuneSelection(qContent, invItem, runeDataStruct.WeaponArray, 2);
            addPropertyRuneSelection(qContent, invItem, runeDataStruct.WeaponArray, 3);

        }

        ////

        if(isArmorPotencyOne(potencyRuneID)){
            
            let runeName = "+1 Armor Potency";
            let runeDescription = "Magic wards deflect attacks. Increase the armor’s item bonus to AC by 1. The armor can be etched with one property rune.";
            addFundamentalRuneEntry(qContent, invItem, potencyRuneID, runeName, runeDescription);

            addPropertyRuneSelection(qContent, invItem, runeDataStruct.ArmorArray, 1);

        }

        if(isArmorPotencyTwo(potencyRuneID)){
            
            let runeName = "+2 Armor Potency";
            let runeDescription = "Magic wards deflect attacks. Increase the armor’s item bonus to AC by 2. The armor can be etched with two property runes.";
            addFundamentalRuneEntry(qContent, invItem, potencyRuneID, runeName, runeDescription);

            addPropertyRuneSelection(qContent, invItem, runeDataStruct.ArmorArray, 1);
            addPropertyRuneSelection(qContent, invItem, runeDataStruct.ArmorArray, 2);

        }

        if(isArmorPotencyThree(potencyRuneID)){
            
            let runeName = "+3 Armor Potency";
            let runeDescription = "Magic wards deflect attacks. Increase the armor’s item bonus to AC by 3. The armor can be etched with three property rune.";
            addFundamentalRuneEntry(qContent, invItem, potencyRuneID, runeName, runeDescription);

            addPropertyRuneSelection(qContent, invItem, runeDataStruct.ArmorArray, 1);
            addPropertyRuneSelection(qContent, invItem, runeDataStruct.ArmorArray, 2);
            addPropertyRuneSelection(qContent, invItem, runeDataStruct.ArmorArray, 3);

        }

    }

}

function addFundamentalRuneEntry(qContent, invItem, runeID, runeName, runeDescription){

    let runeEntryID = 'runeEntry'+runeID;
    let runeEntryDeleteID = runeEntryID+'Delete';
    qContent.append('<div class="has-text-centered mt-1"><p class="is-inline"><a class="has-text-grey-lighter has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+runeDescription+'">'+runeName+'</a></p><a id="'+runeEntryDeleteID+'" class="is-size-6"><span class="icon is-small has-text-danger ml-3"><i class="fas fa-sm fa-minus-circle"></i></span></a></div>');

    $('#'+runeEntryDeleteID).click(function() {
        socket.emit("requestRemoveFundamentalRune",
            invItem.id,
            runeID);
    });

}

function getPropertyRuneIDBySlot(invItem, propertyRuneSlot){
    switch(propertyRuneSlot) {
        case 1:
            return invItem.itemRuneData.propRune1ID;
        case 2:
            return invItem.itemRuneData.propRune2ID;
        case 3:
            return invItem.itemRuneData.propRune3ID;
        default:
            return null;
    }
}

function addPropertyRuneSelection(qContent, invItem, runeArray, propertyRuneSlot){

    let propertyRuneSelectionID = 'propertyRuneSelection'+propertyRuneSlot;
    qContent.append('<div class="has-text-centered p-1"><div class="select is-small is-success"><select id="'+propertyRuneSelectionID+'"></select></div></div>');

    $('#'+propertyRuneSelectionID).append('<option value="chooseDefault">Add Property Rune</option>');
    $('#'+propertyRuneSelectionID).append('<hr class="dropdown-divider"></hr>');

    let existingPropRuneID = getPropertyRuneIDBySlot(invItem, propertyRuneSlot);
    for(let weaponRuneItem of runeArray){
        if(weaponRuneItem == null){ continue; }
        if(weaponRuneItem.RuneData.isFundamental == 0) {
            if(existingPropRuneID != null && existingPropRuneID == weaponRuneItem.RuneData.id){
                $('#'+propertyRuneSelectionID).append('<option value="'+weaponRuneItem.RuneData.id+'" selected>'+runestoneNameToRuneName(weaponRuneItem.Item.name)+'</option>');
            } else {
                $('#'+propertyRuneSelectionID).append('<option value="'+weaponRuneItem.RuneData.id+'">'+runestoneNameToRuneName(weaponRuneItem.Item.name)+'</option>');
            }
        }
    }

    if(existingPropRuneID != null){
        
        let runeItem = runeArray.find(itemDataStruct => {
            return itemDataStruct.RuneData.id == existingPropRuneID;
        }).Item;

        let usageText = (runeItem.usage != null) ? '<p class="has-text-centered is-size-7"><strong>Usage: </strong>'+runeItem.usage+'</p>' : '';
        qContent.append('<div class="columns is-marginless"><div class="column is-paddingless is-8 is-offset-2"><hr class="m-0">'+usageText+processText(runeItem.description, true, true, 'SMALL')+'<hr class="m-1"></div></div>');

        /* If existingPropRuneID isn't null, a property rune is active */
        $('#'+propertyRuneSelectionID).parent().removeClass('is-success');
        $('#'+propertyRuneSelectionID).parent().addClass('is-success-dark');

    }
    
    $('#'+propertyRuneSelectionID).change(function() {
        let propRuneID = $('#'+propertyRuneSelectionID).val();
        if(propRuneID != "chooseDefault" && existingPropRuneID != propRuneID){
            socket.emit("requestAddPropertyRune",
                invItem.id,
                propRuneID,
                propertyRuneSlot);
        } else if(existingPropRuneID != null){
            socket.emit("requestRemovePropertyRune",
                invItem.id,
                propertyRuneSlot);
        }
    });
    
}