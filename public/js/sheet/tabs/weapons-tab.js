
function openWeaponsTab(data) {

    let runeDataStruct = generateRuneDataStruct();

    let addWeaponEntry = function(weaponEntryID, item, invItem, runeDataStruct, data) {
        let weaponListEntryID = 'weaponListEntry'+weaponEntryID;

        let calcStruct = getAttackAndDamage(item, invItem);
        let weaponRange = '-';
        let weaponReload = '-';
        if(item.WeaponData.isRanged == 1){
            weaponReload = item.WeaponData.rangedReload;
            if(weaponReload == 0){ weaponReload = '-'; }
            weaponRange = item.WeaponData.rangedRange+" ft";
        }
        $('#weaponsTabContent').append('<div id="'+weaponListEntryID+'" class="columns is-mobile pt-1 is-marginless"><div class="column is-paddingless is-4 border-bottom border-dark-lighter cursor-clickable"><p class="pl-3 has-text-left has-text-grey-light">'+invItem.name+'</p></div><div class="column is-paddingless is-1 border-bottom border-dark-lighter cursor-clickable"><p class="has-text-grey-light">'+calcStruct.AttackBonus+'</p></div><div class="column is-paddingless is-2 border-bottom border-dark-lighter cursor-clickable"><p class="has-text-grey-light">'+calcStruct.Damage+'</p></div><div class="column is-paddingless is-1 border-bottom border-dark-lighter cursor-clickable"></div><div class="column is-paddingless is-1 border-bottom border-dark-lighter cursor-clickable"><p class="has-text-grey-light">'+weaponRange+'</p></div><div class="column is-paddingless is-2 border-bottom border-dark-lighter cursor-clickable"><p class="has-text-grey-light">'+weaponReload+'</p></div><div class="column is-paddingless is-1 border-bottom border-dark-lighter cursor-clickable"></div></div>');

        $('#'+weaponListEntryID).click(function(){
            openQuickView('invItemView', {
                InvItem : invItem,
                Item : item,
                RuneDataStruct : runeDataStruct,
                InvData : null,
                Data : data // Same contents in data object as inventory tab uses
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

    $('#tabContent').append('<div id="weaponsTabContent" class="use-custom-scrollbar" style="height: 590px; max-height: 590px; overflow-y: auto;"></div>');

    // Physical Features to Unarmed Attacks
    let phyFeatWeaponMap = new Map();
    phyFeatWeaponMap.set(0, 56); // <- Fist, Hardcoded

    for(const physicalFeature of g_phyFeatArray){
        if(physicalFeature.value.overrides == null){
            if(!phyFeatWeaponMap.has(physicalFeature.value.id)) {
                phyFeatWeaponMap.set(physicalFeature.value.id, physicalFeature.value.itemWeaponID);
            }
        } else {
            phyFeatWeaponMap.set(physicalFeature.value.overrides, physicalFeature.value.itemWeaponID);
        }
    }

    let weaponEntryID = 0;
    for(const [pfWeaponID, itemWeaponID] of phyFeatWeaponMap.entries()){
        weaponEntryID++;
        let pwItem = g_itemMap.get(itemWeaponID+"");
        let pwInvItem = pwItem.Item;
        pwInvItem.currentHitPoints = pwInvItem.hitPoints;
        pwInvItem.viewOnly = true;
        addWeaponEntry(weaponEntryID, pwItem, pwInvItem, runeDataStruct, data);
    }

    for(const invItem of g_invStruct.InvItems){
        let item = g_itemMap.get(invItem.itemID+"");
        if(item.WeaponData != null){
            weaponEntryID++;
            addWeaponEntry(weaponEntryID, item, invItem, runeDataStruct, data);
        }
    }

}