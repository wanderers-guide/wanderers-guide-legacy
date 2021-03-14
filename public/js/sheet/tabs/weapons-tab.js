/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

const FIST_ITEM_ID = 56; // <- Fist, Hardcoded Item ID

function openWeaponsTab(data) {

    let addWeaponEntry = function(weaponEntryID, item, invItem, extraData) {
        let weaponListEntryID = 'weaponListEntry'+weaponEntryID;

        let calcStruct = getAttackAndDamage(item, invItem);
        //let itemTagArray = getItemTraitsArray(item, invItem);

        let weaponRange = '-';
        let weaponReload = '-';
        if(item.WeaponData.isRanged == 1){
            weaponReload = item.WeaponData.rangedReload;
            if(weaponReload == 0){ weaponReload = '-'; }
            weaponRange = item.WeaponData.rangedRange+" ft";
        }

        let unarmedIcon = '';
        if(extraData.IsCustomUnarmedAttack) {
          unarmedIcon = '<sup class="icon is-small has-text-info"><i class="fas fa-sm fa-fist-raised"></i></sup>';
        }

        $('#weaponsTabContent').append('<div id="'+weaponListEntryID+'" class="columns is-mobile pt-1 is-marginless"><div class="column is-paddingless is-4 border-bottom border-dark-lighter cursor-clickable"><p class="pl-3 has-text-left has-text-grey-light">'+invItem.name+unarmedIcon+'</p></div><div class="column is-paddingless is-1 border-bottom border-dark-lighter cursor-clickable"><p class="has-text-grey-light">'+calcStruct.AttackBonus+'</p></div><div class="column is-paddingless is-2 border-bottom border-dark-lighter cursor-clickable"><p class="has-text-grey-light">'+calcStruct.Damage+'</p></div><div class="column is-paddingless is-1 border-bottom border-dark-lighter cursor-clickable"></div><div class="column is-paddingless is-1 border-bottom border-dark-lighter cursor-clickable"><p class="has-text-grey-light">'+weaponRange+'</p></div><div class="column is-paddingless is-2 border-bottom border-dark-lighter cursor-clickable"><p class="has-text-grey-light">'+weaponReload+'</p></div><div class="column is-paddingless is-1 border-bottom border-dark-lighter cursor-clickable"></div></div>');

        g_calculatedStats.weapons.push({
            Name: invItem.name,
            Bonus: calcStruct.AttackBonus,
            Damage: calcStruct.Damage});// Calculated Stat

        $('#'+weaponListEntryID).click(function(){
            openQuickView('invItemView', {
                InvItem : invItem,
                Item : item,
                InvData : null,
                ExtraData : extraData
            });
        });

        $('#'+weaponListEntryID).mouseenter(function(){
            $(this).addClass('has-background-grey-darker');
        });
        $('#'+weaponListEntryID).mouseleave(function(){
            $(this).removeClass('has-background-grey-darker');
        });
    };

    $('#tabContent').append('<div class="columns is-mobile pt-1 is-marginless"><div class="column is-paddingless is-4"><p class="pl-3 has-text-left"><strong class="has-text-grey-light">Name</strong></p></div><div class="column is-paddingless is-1"><p class=""><strong class="has-text-grey-light">Attack</strong></p></div><div class="column is-paddingless is-2"><p class=""><strong class="has-text-grey-light">Damage</strong></p></div><div class="column is-paddingless is-1"></div><div class="column is-paddingless is-1"><p class=""><strong class="has-text-grey-light">Range</strong></p></div><div class="column is-paddingless is-2"><p class=""><strong class="has-text-grey-light">Reload</strong></p></div><div class="column is-paddingless is-1"></div></div><div class="is-divider hr-light is-marginless"></div>');

    $('#tabContent').append('<div id="weaponsTabContent" class="use-custom-scrollbar" style="height: 580px; max-height: 580px; overflow-y: auto;"></div>');

    $('#tabContent').append('<div class="pos-absolute pos-t-4 pos-r-1"><span id="addNewUnarmedAttackButton" class="icon has-text-info has-tooltip-left" data-tooltip="Add Unarmed Attack"><i class="fas fa-lg fa-fist-raised"></i></span></div>');

    $("#addNewUnarmedAttackButton").click(function(){
      openQuickView('addUnarmedAttackView', {
        IsCustomize: false,
        AddedItemID: FIST_ITEM_ID
      });
    });

    // Physical Features to Unarmed Attacks
    let phyFeatWeaponMap = new Map();
    phyFeatWeaponMap.set(0, FIST_ITEM_ID);

    for(const physicalFeature of g_phyFeatArray){
        if(physicalFeature.value.itemWeaponID != null){
            if(physicalFeature.value.overrides == null){
                if(!phyFeatWeaponMap.has(physicalFeature.value.id)) {
                    phyFeatWeaponMap.set(physicalFeature.value.id, physicalFeature.value.itemWeaponID);
                }
            } else {
                phyFeatWeaponMap.set(physicalFeature.value.overrides, physicalFeature.value.itemWeaponID);
            }
        }
    }

    let willAddUnarmedAttacks = [];
    let willRemoveUnarmedAttacks = [];
    for(const [pfWeaponID, itemWeaponID] of phyFeatWeaponMap.entries()){
      const invItem = g_invStruct.InvItems.find(invItem => {
        return invItem.itemID === itemWeaponID;
      });
      if(invItem == null){
        willAddUnarmedAttacks.push(itemWeaponID);
      }
    }
    for(const invItem of g_invStruct.InvItems){
      const item = g_itemMap.get(invItem.itemID+"");
      if(isUnarmedAttack(item) && item.Item.id != FIST_ITEM_ID){ // Is Non-Custom Unarmed Attack
        const itemWeaponID = Array.from(phyFeatWeaponMap.values()).find(itemWeaponID => {
          return itemWeaponID === invItem.itemID;
        });
        if(itemWeaponID == null){
          willRemoveUnarmedAttacks.push(invItem.id);
        }
      }
    }

    for(let itemID of willAddUnarmedAttacks) {

      // Normal Fist has qty of 0 to detect that it is the base Fist, hope that makes sense
      let qty;
      if(itemID == FIST_ITEM_ID){ qty = 0; } else { qty = 1; }
      socket.emit("requestAddItemToInv",
          getCharIDFromURL(),
          g_invStruct.Inventory.id,
          itemID,
          qty);

    }
    for(let invItemID of willRemoveUnarmedAttacks) {

      socket.emit("requestRemoveItemFromInv",
          invItemID);

    }

    // Display Weapons & Attacks
    let weaponEntryID = 0;
    for(const invItem of g_invStruct.InvItems){
        let item = g_itemMap.get(invItem.itemID+"");
        if(item == null) { continue; }
        if(item.WeaponData != null){
            weaponEntryID++;
            addWeaponEntry(weaponEntryID, item, invItem, {
              IsUnarmedAttack: isUnarmedAttack(item),
              IsCustomUnarmedAttack: (isUnarmedAttack(item) && item.Item.id === FIST_ITEM_ID && invItem.quantity !== 0)
            });
        }
    }

    // If has shield eqipped,
    if(g_equippedShieldInvItemID != null){
        weaponEntryID++;
        let pwItem = g_itemMap.get(1266+""); // Shield Bash, Hardcoded Item ID
        if(pwItem != null) {
            let pwInvItem = pwItem.Item;
            pwInvItem.currentHitPoints = pwInvItem.hitPoints;
            pwInvItem.viewOnly = true;
            addWeaponEntry(weaponEntryID, pwItem, pwInvItem, {
              IsUnarmedAttack: false,
              IsCustomUnarmedAttack: false
            });
        }
    }

}