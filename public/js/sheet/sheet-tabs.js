
// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    



});

function changeTab(type, data) {

    $('#tabContent').html('');

    $('#actionsTab').parent().removeClass("is-active");
    $('#weaponsTab').parent().removeClass("is-active");
    $('#spellsTab').parent().removeClass("is-active");
    $('#inventoryTab').parent().removeClass("is-active");
    $('#detailsTab').parent().removeClass("is-active");
    $('#notesTab').parent().removeClass("is-active");

    $('#'+type).parent().addClass("is-active");
    g_selectedTabID = type;

    if(type == 'actionsTab'){

        $('#tabContent').append('<div class="tabs is-centered is-marginless"><ul class="action-tabs"><li><a id="actionTabEncounter">Encounter</a></li><li><a id="actionTabExploration">Exploration</a></li><li><a id="actionTabDowntime">Downtime</a></li></ul></div>');

        let filterInnerHTML = '<div class="columns is-mobile is-marginless"><div class="column is-4"><p id="stateNumberOfActions" class="is-size-7 has-text-left">3 Actions per Turn</p></div><div class="column is-1"><p class="is-size-6 has-text-grey-lighter">Filter</p></div>';
        filterInnerHTML += '<div class="column is-2"><div class="select is-small"><select id="actionFilterSelectBySkill"><option value="chooseDefault">By Skill</option>';

        for(const [skillName, skillData] of data.SkillMap.entries()){
            filterInnerHTML += '<option value="'+skillData.Skill.name+'">'+skillData.Skill.name+'</option>';
        }

        filterInnerHTML += '</select></div></div><div class="column is-2"><div class="select is-small"><select id="actionFilterSelectByAction"><option value="chooseDefault">By Action</option><option value="OneAction" class="pf-icon">[one-action]</option><option value="TwoActions" class="pf-icon">[two-actions]</option><option value="ThreeActions" class="pf-icon">[three-actions]</option><option value="FreeAction" class="pf-icon">[free-action]</option><option value="Reaction" class="pf-icon">[reaction]</option></select></div></div></div>';

        filterInnerHTML += '<div class="mb-2"><p class="control has-icons-left"><input id="actionFilterSearch" class="input" type="text" placeholder="Search"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div>';

        $('#tabContent').append(filterInnerHTML);

        $('#tabContent').append('<div id="actionTabContent"></div>');


        $('#actionTabEncounter').click(function(){
            changeActionTab('actionTabEncounter', data);
        });

        $('#actionTabExploration').click(function(){
            changeActionTab('actionTabExploration', data);
        });

        $('#actionTabDowntime').click(function(){
            changeActionTab('actionTabDowntime', data);
        });

        $('#actionTabEncounter').click();

    } else if(type == 'weaponsTab'){

        let runeDataStruct = generateRuneDataStruct();

        let addWeaponEntry = function(weaponEntryID, item, invItem, runeDataStruct, data) {
            let weaponListEntryID = 'weaponListEntry'+weaponEntryID;

            let calcStruct = getAttackAndDamage(item, invItem, data.StrMod, data.DexMod);
            let weaponRange = '-';
            let weaponReload = '-';
            if(item.WeaponData.isRanged == 1){
                weaponReload = item.WeaponData.rangedReload;
                if(weaponReload == 0){ weaponReload = '-'; }
                weaponRange = item.WeaponData.rangedRange+" ft";
            }
            $('#tabContent').append('<div id="'+weaponListEntryID+'" class="columns is-mobile pt-1 is-marginless"><div class="column is-paddingless is-4 border-bottom border-dark-lighter cursor-clickable"><p class="pl-3 has-text-left has-text-grey-light">'+invItem.name+'</p></div><div class="column is-paddingless is-1 border-bottom border-dark-lighter cursor-clickable"><p class="has-text-grey-light">'+calcStruct.AttackBonus+'</p></div><div class="column is-paddingless is-2 border-bottom border-dark-lighter cursor-clickable"><p class="has-text-grey-light">'+calcStruct.Damage+'</p></div><div class="column is-paddingless is-1 border-bottom border-dark-lighter cursor-clickable"></div><div class="column is-paddingless is-1 border-bottom border-dark-lighter cursor-clickable"><p class="has-text-grey-light">'+weaponRange+'</p></div><div class="column is-paddingless is-2 border-bottom border-dark-lighter cursor-clickable"><p class="has-text-grey-light">'+weaponReload+'</p></div><div class="column is-paddingless is-1 border-bottom border-dark-lighter cursor-clickable"></div></div>');

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

        // Physical Features to Unarmed Attacks
        let phyFeatWeaponMap = new Map();
        phyFeatWeaponMap.set(0, 56); // <- Fist, Hardcoded

        for(const [srcID, physicalFeatureArray] of g_physicalFeatureMap.entries()){
            for(let physicalFeature of physicalFeatureArray){
                if(physicalFeature.overrides == null){
                    if(!phyFeatWeaponMap.has(physicalFeature.id)) {
                        phyFeatWeaponMap.set(physicalFeature.id, physicalFeature.itemWeaponID);
                    }
                } else {
                    phyFeatWeaponMap.set(physicalFeature.overrides, physicalFeature.itemWeaponID);
                }
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

    } else if(type == 'spellsTab'){

        $('#tabContent').append('<div class="columns is-mobile is-marginless"><div class="column is-9 is-paddingless py-3"><p class="control has-icons-left"><input id="spellsSearch" class="input" type="text" placeholder="Search Spells"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div><div class="column is-3 is-paddingless py-3 px-2"><button id="manageSpellsBtn" class="button is-info is-rounded">Manage Spells</button></div></div><div id="spellsContent" class="use-custom-scrollbar"></div>');

        $('#manageSpellsBtn').click(function(){
            openManageSpellsModal(data);
        });

        /*
        console.log(data.SpellSlotsMap);
        for(const [level, slotArray] of data.SpellSlotsMap.entries()){

            let sectionName = (level == 0) ? 'Cantrips' : 'Level '+level;
            $('#spellsContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">'+sectionName+'</p>');
            $('#spellsContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');
            $('#spellsContent').append('<div class="columns is-mobile pt-1 is-marginless"><div class="column is-6"><p class="has-text-left pl-3"><strong class="has-text-grey-light">Name</strong></p></div><div class="column is-1"><p class="pr-3"><strong class="has-text-grey-light">Cast</strong></p></div><div class="column is-1"><p class="pr-3"><strong class="has-text-grey-light">Range</strong></p></div><div class="column is-1"><p class="pr-3"><strong class="has-text-grey-light">Health</strong></p></div><div class="column is-3"><p class="pr-4"><strong class="has-text-grey-light">Tags</strong></p></div></div>');

            let spellsInnerHTML = '';
            for(let slot of slotArray){
                let spellSlotID = 'spellSlot'+slot.slotID;
                if(slot.spell != null) {
                    
                } else {
                    $('#spellsContent').append('<div class="columns is-mobile pt-1 is-marginless"><div class="column is-6"><p class="has-text-left pl-3"><strong class="has-text-grey-light">Empty</strong></p></div><div class="column is-1"><p class="pr-3"><strong class="has-text-grey-light">Qty</strong></p></div><div class="column is-1"><p class="pr-3"><strong class="has-text-grey-light">Bulk</strong></p></div><div class="column is-1"><p class="pr-3"><strong class="has-text-grey-light">Health</strong></p></div><div class="column is-3"><p class="pr-4"><strong class="has-text-grey-light">Tags</strong></p></div></div>');
                }
                
            }

        }
        */

    } else if(type == 'inventoryTab'){

        // Update armor and shield within the sheet
        determineArmor(data.DexMod);

        $('#tabContent').append('<div class="columns is-mobile pt-1 is-marginless"><div class="column is-inline-flex is-paddingless pt-2 px-3"><p class="is-size-6 pr-3"><strong class="has-text-grey-lighter">Total Bulk</strong></p><p id="bulkTotal" class="is-size-6 has-text-left">'+g_bulkAndCoinsStruct.TotalBulk+' / '+g_bulkAndCoinsStruct.WeightEncumbered+'</p><p id="bulkMax" class="is-size-7 pl-2 has-text-left">(Limit '+g_bulkAndCoinsStruct.WeightMax+')</p></div><div class="column is-paddingless pt-2 px-3"><div class="is-inline-flex is-pulled-right"><p id="coinsMessage" class="is-size-6"><strong class="has-text-grey-lighter">Total Coins</strong></p><div id="coinsCopperSection" class="is-inline-flex" data-tooltip="Copper"><figure class="image is-16x16 is-marginless mt-1 ml-3 mr-1"><img src="/images/copper_coin.png"></figure><p>'+g_bulkAndCoinsStruct.CopperCoins+'</p></div><div id="coinsSilverSection" class="is-inline-flex" data-tooltip="Silver"><figure class="image is-16x16 is-marginless mt-1 ml-3 mr-1"><img src="/images/silver_coin.png"></figure><p>'+g_bulkAndCoinsStruct.SilverCoins+'</p></div><div id="coinsGoldSection" class="is-inline-flex" data-tooltip="Gold"><figure class="image is-16x16 is-marginless mt-1 ml-3 mr-1"><img src="/images/gold_coin.png"></figure><p>'+g_bulkAndCoinsStruct.GoldCoins+'</p></div><div id="coinsPlatinumSection" class="is-inline-flex" data-tooltip="Platinum"><figure class="image is-16x16 is-marginless mt-1 ml-3 mr-1"><img src="/images/platinum_coin.png"></figure><p>'+g_bulkAndCoinsStruct.PlatinumCoins+'</p></div></div></div></div>');

        $('#tabContent').append('<div class="columns is-mobile is-marginless"><div class="column is-10"><p class="control has-icons-left"><input id="inventorySearch" class="input" type="text" placeholder="Search Inventory"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div><div class="column"><button id="invAddItems" class="button is-info is-rounded">Add Items</button></div></div><div class="tile is-ancestor is-vertical"><div class="tile is-parent is-paddingless pt-1 px-2"><div class="tile is-child is-6"><p class="has-text-left pl-3"><strong class="has-text-grey-light">Name</strong></p></div><div class="tile is-child is-1"><p class="pr-3"><strong class="has-text-grey-light">Qty</strong></p></div><div class="tile is-child is-1"><p class="pr-3"><strong class="has-text-grey-light">Bulk</strong></p></div><div class="tile is-child is-1"><p class="pr-3"><strong class="has-text-grey-light">Health</strong></p></div><div class="tile is-child is-3"><p class="pr-4"><strong class="has-text-grey-light">Tags</strong></p></div></div><div class="is-divider hr-light is-marginless"></div><div id="inventoryContent" class="use-custom-scrollbar"></div></div>');

        if(g_bulkAndCoinsStruct.CantMove) {
            $('#bulkTotal').addClass('has-text-black');
            $('#bulkTotal').addClass('has-text-weight-bold');
            $('#bulkTotal').addClass('has-background-danger');
            $('#bulkMax').addClass('has-text-black');
            $('#bulkMax').addClass('has-text-weight-bold');
            $('#bulkMax').addClass('has-background-danger');
        } else if(g_bulkAndCoinsStruct.IsEncumbered){
            $('#bulkTotal').addClass('has-text-danger');
            $('#bulkTotal').addClass('has-text-weight-bold');
        }

        let foundCoins = false;
        if(g_bulkAndCoinsStruct.CopperCoins > 0){
            foundCoins = true;
            $('#coinsCopperSection').removeClass('is-hidden');
        } else {
            $('#coinsCopperSection').addClass('is-hidden');
        }
        if(g_bulkAndCoinsStruct.SilverCoins > 0){
            foundCoins = true;
            $('#coinsSilverSection').removeClass('is-hidden');
        } else {
            $('#coinsSilverSection').addClass('is-hidden');
        }
        if(g_bulkAndCoinsStruct.GoldCoins > 0){
            foundCoins = true;
            $('#coinsGoldSection').removeClass('is-hidden');
        } else {
            $('#coinsGoldSection').addClass('is-hidden');
        }
        if(g_bulkAndCoinsStruct.PlatinumCoins > 0){
            foundCoins = true;
            $('#coinsPlatinumSection').removeClass('is-hidden');
        } else {
            $('#coinsPlatinumSection').addClass('is-hidden');
        }

        if(!foundCoins){
            $('#coinsMessage').append(' None');
        }

        displayInventorySection(data);

        $("#inventoryContent").scrollTop(g_inventoryTabScroll);

        $('#invAddItems').click(function(){
            openQuickView('addItemView', {
                ItemMap : g_itemMap,
                InvID : g_invStruct.Inventory.id,
                Data : data
            });
        });


    } else if(type == 'detailsTab'){

        $('#tabContent').append('<div class="tabs is-centered is-marginless"><ul><li><a id="detailsTabFeats">Feats</a></li><li><a id="detailsTabAbilities">Abilities</a></li><li><a id="detailsTabDescription">Description</a></li></ul></div>');

        $('#tabContent').append('<div id="detailsTabContent"></div>');

        $('#detailsTabFeats').click(function(){
            changeDetailsTab('detailsTabFeats', data);
        });

        $('#detailsTabAbilities').click(function(){
            changeDetailsTab('detailsTabAbilities', data);
        });

        $('#detailsTabDescription').click(function(){
            changeDetailsTab('detailsTabDescription', data);
        });

        $('#detailsTabFeats').click();

    } else if(type == 'notesTab'){

        let notesAreaID = "notesArea";
        let notesAreaControlShellID = "notesAreaControlShell";

        $('#tabContent').html('<div id="'+notesAreaControlShellID+'" class="control mt-3"><textarea id="'+notesAreaID+'" class="textarea has-fixed-size use-custom-scrollbar" rows="24" spellcheck="false" placeholder="Feel free to write notes here about your character, campaign, or anything else you\'d like!"></textarea></div>');

        $("#"+notesAreaID).val(data.Character.notes);

        $("#"+notesAreaID).blur(function(){
            if(data.Character.notes != $(this).val()) {

                $("#"+notesAreaControlShellID).addClass("is-loading");

                socket.emit("requestNotesSave",
                    getCharIDFromURL(),
                    $(this).val());
                
                data.Character.notes = $(this).val();

            }
        });

    }

}

socket.on("returnNotesSave", function(){
    $("#notesAreaControlShell").removeClass("is-loading");
});


// Inventory //

function displayInventorySection(data){

    $('#inventorySearch').off('change');

    let openBagInvItemArray = [];
    for(const invItem of g_invStruct.InvItems){
        let item = g_itemMap.get(invItem.itemID+"");
        if(item.Item.itemType == "STORAGE" && invItem.bagInvItemID == null){
            openBagInvItemArray.push(invItem);
        }
    }

    let runeDataStruct = generateRuneDataStruct();

    let inventorySearch = $('#inventorySearch');
    let invSearchInput = null;
    if(inventorySearch.val() != ''){
        invSearchInput = inventorySearch.val().toLowerCase();
        inventorySearch.addClass('is-info');
    } else {
        inventorySearch.removeClass('is-info');
    }

    $('#inventorySearch').change(function(){
        displayInventorySection(data);
    });

    $('#inventoryContent').html('');

    for(const invItem of g_invStruct.InvItems){

        let willDisplay = true;
        if(invItem.bagInvItemID != null){
            willDisplay = false;
        }

        if(invSearchInput == 'weapons'){
            let item = g_itemMap.get(invItem.itemID+"");
            if(item.WeaponData != null){
                willDisplay = true;
            } else {
                willDisplay = false;
            }

        } else if(invSearchInput == 'armor'){
            let item = g_itemMap.get(invItem.itemID+"");
            if(item.ArmorData != null){
                willDisplay = true;
            } else {
                willDisplay = false;
            }

        } else if(invSearchInput == 'coins' || invSearchInput == 'money'){
            if(invItem.itemID == 22 || invItem.itemID == 23 || invItem.itemID == 24 || invItem.itemID == 25){
                willDisplay = true;
            } else {
                willDisplay = false;
            }

        } else {

            if(invSearchInput != null){
                let itemName = invItem.name.toLowerCase();
                if(!itemName.includes(invSearchInput)){
                    willDisplay = false;
                } else {
                    willDisplay = true;
                }
            }

        }

        if(willDisplay) {
            displayInventoryItem(invItem, openBagInvItemArray, runeDataStruct, data);
        }

    }

    handleArmorEquip(g_invStruct.Inventory.id);
    handleShieldEquip(g_invStruct.Inventory.id);

}

function displayInventoryItem(invItem, openBagInvItemArray, runeDataStruct, data) {

    let item = g_itemMap.get(invItem.itemID+"");
    let itemIsStorage = (item.Item.itemType == "STORAGE");
    let itemIsStorageAndEmpty = false;

    let invItemSectionID = 'invItemSection'+invItem.id;
    let invItemNameID = 'invItemName'+invItem.id;
    let invItemQtyID = 'invItemQty'+invItem.id;
    let invItemBulkID = 'invItemBulk'+invItem.id;
    let invItemHealthID = 'invItemHealth'+invItem.id;
    let invItemShoddyTagID = 'invItemShoddyTag'+invItem.id;
    let invItemBrokenTagID = 'invItemBrokenTag'+invItem.id;

    // Halve maxHP if it's shoddy
    let maxHP = (invItem.isShoddy == 1) ? Math.floor(invItem.hitPoints/2) : invItem.hitPoints;

    // Halve brokenThreshold if it's shoddy
    let brokenThreshold = (invItem.isShoddy == 1) ? Math.floor(invItem.brokenThreshold/2) : invItem.brokenThreshold;

    // Reduce currentHP if it's over maxHP
    invItem.currentHitPoints = (invItem.currentHitPoints > maxHP) ? maxHP : invItem.currentHitPoints;

    if(itemIsStorage) {

        let invItemStorageViewButtonID = 'invItemStorageViewButton'+invItem.id;
        let invItemStorageSectionID = 'invItemStorageSection'+invItem.id;
        let invItemStorageBulkAmountID = 'invItemStorageBulkAmount'+invItem.id;

        $('#inventoryContent').append('<div id="'+invItemSectionID+'" class="tile is-parent is-paddingless pt-1 px-2 border-bottom border-dark-lighter cursor-clickable"><div class="tile is-child is-6"><p id="'+invItemNameID+'" class="has-text-left pl-3 is-size-6 has-text-grey-light"><a id="'+invItemStorageViewButtonID+'" class="button is-small is-info is-rounded is-outlined mb-1 ml-3">Open</a></p></div><div id="'+invItemQtyID+'" class="tile is-child is-1"><p></p></div><div id="'+invItemBulkID+'" class="tile is-child is-1"><p></p></div><div id="'+invItemHealthID+'" class="tile is-child is-1"><p></p></div><div class="tile is-child is-3"><div class="tags is-centered"><span id="'+invItemShoddyTagID+'" class="tag is-warning">Shoddy</span><span id="'+invItemBrokenTagID+'" class="tag is-danger">Broken</span></div></div></div>');

        $('#inventoryContent').append('<div id="'+invItemStorageSectionID+'" class="tile is-vertical is-hidden"></div>');

        let bulkIgnored = item.StorageData.bulkIgnored;
        let bagBulk = g_bulkAndCoinsStruct.BagBulkMap.get(invItem.id);
        if(bagBulk == null) {
            bagBulk = 0;
        } else {
            bagBulk += bulkIgnored;
        }
        bagBulk = round(bagBulk, 1);
        let maxBagBulk = item.StorageData.maxBulkStorage;
        let bulkIgnoredMessage = "";
        if(bulkIgnored != 0.0){
            if(bulkIgnored == maxBagBulk){
                bulkIgnoredMessage = "Items don’t count towards your Total Bulk.";
            } else {
                bulkIgnoredMessage = "The first "+bulkIgnored+" Bulk of items don’t count towards your Total Bulk.";
            }
        }
        $('#'+invItemStorageSectionID).append('<div class="tile is-parent is-paddingless pt-1 px-2"><div class="tile is-child is-1"></div><div class="tile is-child is-3 border-bottom border-dark-lighter"><p id="'+invItemStorageBulkAmountID+'" class="has-text-left pl-5 is-size-6 has-text-grey">Bulk '+bagBulk+' / '+maxBagBulk+'</p></div><div class="tile is-child is-8 border-bottom border-dark-lighter"><p class="has-text-left pl-3 is-size-6 has-text-grey is-italic">'+bulkIgnoredMessage+'</p></div></div>');

        if(bagBulk > maxBagBulk){
            $('#'+invItemStorageBulkAmountID).removeClass('has-text-grey');
            $('#'+invItemStorageBulkAmountID).addClass('has-text-danger');
            $('#'+invItemStorageBulkAmountID).addClass('has-text-weight-bold');
        }

        let foundBaggedItem = false;
        for(const baggedInvItem of g_invStruct.InvItems){
            if(baggedInvItem.bagInvItemID == invItem.id){
                foundBaggedItem = true;

                let baggedItem = g_itemMap.get(baggedInvItem.itemID+"");
                let baggedItemIsStorage = (baggedItem.Item.itemType == "STORAGE");

                let baggedInvItemSectionID = 'baggedInvItemSection'+baggedInvItem.id;
                let baggedInvItemIndentID = 'baggedInvItemIndent'+baggedInvItem.id;
                let baggedInvItemNameID = 'baggedInvItemName'+baggedInvItem.id;
                let baggedInvItemQtyID = 'baggedInvItemQty'+baggedInvItem.id;
                let baggedInvItemBulkID = 'baggedInvItemBulk'+baggedInvItem.id;
                let baggedInvItemHealthID = 'baggedInvItemHealth'+baggedInvItem.id;
                let baggedInvItemShoddyTagID = 'baggedInvItemShoddyTag'+baggedInvItem.id;
                let baggedInvItemBrokenTagID = 'baggedInvItemBrokenTag'+baggedInvItem.id;


                // Halve maxHP if it's shoddy
                let baggedInvItemMaxHP = (baggedInvItem.isShoddy == 1) ? Math.floor(baggedInvItem.hitPoints/2) : baggedInvItem.hitPoints;

                // Halve brokenThreshold if it's shoddy
                let baggedInvItemBrokenThreshold = (baggedInvItem.isShoddy == 1) ? Math.floor(baggedInvItem.brokenThreshold/2) : baggedInvItem.brokenThreshold;

                // Reduce currentHP if it's over maxHP
                baggedInvItem.currentHitPoints = (baggedInvItem.currentHitPoints > baggedInvItemMaxHP) ? baggedInvItemMaxHP : baggedInvItem.currentHitPoints;

                $('#'+invItemStorageSectionID).append('<div id="'+baggedInvItemSectionID+'" class="tile is-parent is-paddingless pt-1 px-2 cursor-clickable"><div id="'+baggedInvItemIndentID+'" class="tile is-child is-1"></div><div class="tile is-child is-5 border-bottom border-dark-lighter"><p id="'+baggedInvItemNameID+'" class="has-text-left pl-3 is-size-6 has-text-grey-light"></p></div><div id="'+baggedInvItemQtyID+'" class="tile is-child is-1 border-bottom border-dark-lighter"><p></p></div><div id="'+baggedInvItemBulkID+'" class="tile is-child is-1 border-bottom border-dark-lighter"><p></p></div><div id="'+baggedInvItemHealthID+'" class="tile is-child is-1 border-bottom border-dark-lighter"><p></p></div><div class="tile is-child is-3 border-bottom border-dark-lighter"><div class="tags is-centered"><span id="'+baggedInvItemShoddyTagID+'" class="tag is-warning">Shoddy</span><span id="'+baggedInvItemBrokenTagID+'" class="tag is-danger">Broken</span></div></div></div>');

                $('#'+baggedInvItemNameID).html(baggedInvItem.name);

                if(baggedItem.WeaponData != null){
                    let calcStruct = getAttackAndDamage(baggedItem, baggedInvItem, data.StrMod, data.DexMod);
                    $('#'+baggedInvItemNameID).append('<sup class="pl-2 has-text-weight-light">'+calcStruct.AttackBonus+'</sup><sup class="pl-3 has-text-weight-light has-text-grey">'+calcStruct.Damage+'</sup>');
                }

                if(baggedItem.Item.hasQuantity == 1){
                    $('#'+baggedInvItemQtyID).html(baggedInvItem.quantity);
                } else {
                    $('#'+baggedInvItemQtyID).html('-');
                }

                let bulk = getConvertedBulkForSize(baggedInvItem.size, baggedInvItem.bulk);
                bulk = getBulkFromNumber(bulk);
                $('#'+baggedInvItemBulkID).html(bulk);

                if(baggedInvItem.currentHitPoints == baggedInvItemMaxHP) {
                    $('#'+baggedInvItemHealthID).html('-');
                } else {
                    $('#'+baggedInvItemHealthID).html(baggedInvItem.currentHitPoints+'/'+baggedInvItemMaxHP);
                }

                if(baggedInvItem.isShoddy == 0){
                    $('#'+baggedInvItemShoddyTagID).addClass('is-hidden');
                } else {
                    $('#'+baggedInvItemShoddyTagID).removeClass('is-hidden');
                }

                if(baggedInvItem.currentHitPoints > baggedInvItemBrokenThreshold){
                    $('#'+baggedInvItemBrokenTagID).addClass('is-hidden');
                } else {
                    $('#'+baggedInvItemBrokenTagID).removeClass('is-hidden');
                }

                $('#'+baggedInvItemSectionID).click(function(){
                    openQuickView('invItemView', {
                        InvItem : baggedInvItem,
                        Item : baggedItem,
                        RuneDataStruct : runeDataStruct,
                        InvData : {
                            OpenBagInvItemArray : openBagInvItemArray,
                            ItemIsStorage : baggedItemIsStorage,
                            ItemIsStorageAndEmpty : true
                        },
                        Data : data
                    });
                });

                $('#'+baggedInvItemSectionID).mouseenter(function(){
                    $(this).addClass('has-background-grey-darker');
                });
                $('#'+baggedInvItemSectionID).mouseleave(function(){
                    $(this).removeClass('has-background-grey-darker');
                });

            }
        }

        if(!foundBaggedItem){
            $('#'+invItemStorageSectionID).append('<div class="tile is-parent is-paddingless pt-1 px-2"><div class="tile is-child is-1"></div><div class="tile is-child is-11 border-bottom border-dark-lighter"><p class="has-text-left pl-3 is-size-7 has-text-grey is-italic">Empty</p></div></div>');
            itemIsStorageAndEmpty = true;
        }

        $('#'+invItemStorageViewButtonID).click(function(event){
            event.stopImmediatePropagation();
            if($('#'+invItemStorageSectionID).is(":visible")){
                $('#'+invItemStorageSectionID).addClass('is-hidden');
                $('#'+invItemStorageViewButtonID).html('Open');
                $('#'+invItemStorageViewButtonID).removeClass('has-text-white');
                $('#'+invItemStorageViewButtonID).addClass('is-outlined');

                g_openBagsSet.delete(invItem.id);
            } else {
                $('#'+invItemStorageSectionID).removeClass('is-hidden');
                $('#'+invItemStorageViewButtonID).html('Close');
                $('#'+invItemStorageViewButtonID).addClass('has-text-white');
                $('#'+invItemStorageViewButtonID).removeClass('is-outlined');
                
                g_openBagsSet.add(invItem.id);
            }
        });

        if(g_openBagsSet.has(invItem.id)){
            $('#'+invItemStorageViewButtonID).click();
        }

    } else {
        $('#inventoryContent').append('<div id="'+invItemSectionID+'" class="tile is-parent is-paddingless pt-1 px-2 border-bottom border-dark-lighter cursor-clickable"><div class="tile is-child is-6"><p id="'+invItemNameID+'" class="has-text-left pl-3 is-size-6 has-text-grey-light"></p></div><div id="'+invItemQtyID+'" class="tile is-child is-1"><p></p></div><div id="'+invItemBulkID+'" class="tile is-child is-1"><p></p></div><div id="'+invItemHealthID+'" class="tile is-child is-1"><p></p></div><div class="tile is-child is-3"><div class="tags is-centered"><span id="'+invItemShoddyTagID+'" class="tag is-warning">Shoddy</span><span id="'+invItemBrokenTagID+'" class="tag is-danger">Broken</span></div></div></div>');
    }

    

    $('#'+invItemNameID).prepend(invItem.name);

    if(item.WeaponData != null){
        console.log(invItem);
        let calcStruct = getAttackAndDamage(item, invItem, data.StrMod, data.DexMod);
        $('#'+invItemNameID).append('<sup class="pl-2 has-text-weight-light">'+calcStruct.AttackBonus+'</sup><sup class="pl-3 has-text-weight-light has-text-grey">'+calcStruct.Damage+'</sup>');
    }

    if(item.ArmorData != null){
        $('#'+invItemNameID).append('<button name="'+invItem.id+'" class="equipArmorButton button is-small is-info is-rounded is-outlined mb-1 ml-3"><span class="icon is-small"><i class="fas fa-tshirt"></i></span></button>');
    }

    if(item.ShieldData != null){
        let notBroken = (invItem.currentHitPoints > brokenThreshold);
        if(notBroken){
            $('#'+invItemNameID).append('<button name="'+invItem.id+'" class="equipShieldButton button is-small is-info is-rounded is-outlined mb-1 ml-3"><span class="icon is-small"><i class="fas fa-shield-alt"></i></span></button>');
        } else {
            $('#'+invItemNameID).append('<button class="button is-small is-danger is-rounded mb-1 ml-3"><span class="icon is-small"><i class="fas fa-shield-alt"></i></span></button>');
        }
    }


    if(item.Item.hasQuantity == 1){
        $('#'+invItemQtyID).html(invItem.quantity);
    } else {
        $('#'+invItemQtyID).html('-');
    }

    let bulk = getConvertedBulkForSize(invItem.size, invItem.bulk);
    bulk = getBulkFromNumber(bulk);
    if(item.StorageData != null && item.StorageData.ignoreSelfBulkIfWearing == 1){ bulk = '-'; }
    $('#'+invItemBulkID).html(bulk);

    if(invItem.currentHitPoints == maxHP) {
        $('#'+invItemHealthID).html('-');
    } else {
        $('#'+invItemHealthID).html(invItem.currentHitPoints+'/'+maxHP);
    }

    if(invItem.isShoddy == 0){
        $('#'+invItemShoddyTagID).addClass('is-hidden');
    } else {
        $('#'+invItemShoddyTagID).removeClass('is-hidden');
    }

    if(invItem.currentHitPoints > brokenThreshold){
        $('#'+invItemBrokenTagID).addClass('is-hidden');
    } else {
        $('#'+invItemBrokenTagID).removeClass('is-hidden');
    }

    $('#'+invItemSectionID).click(function(){
        openQuickView('invItemView', {
            InvItem : invItem,
            Item : item,
            RuneDataStruct : runeDataStruct,
            InvData : {
                OpenBagInvItemArray : openBagInvItemArray,
                ItemIsStorage : itemIsStorage,
                ItemIsStorageAndEmpty : itemIsStorageAndEmpty
            },
            Data : data
        });
    });

    $('#'+invItemSectionID).mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $('#'+invItemSectionID).mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });

}

function handleArmorEquip(invID){
    $('.equipArmorButton').each(function(i, obj) {
        let invItemID = $(this).attr('name');
        if(g_equippedArmorInvItemID == invItemID) {
            $(this).removeClass('is-outlined');
            $(this).click(function(event){
                event.stopImmediatePropagation();
                g_equippedArmorInvItemID = null;
                loadCharSheet();
                updateInventoryBackend(invID);
            });
        } else {
            $(this).addClass('is-outlined');
            $(this).click(function(event){
                event.stopImmediatePropagation();
                g_equippedArmorInvItemID = invItemID;
                loadCharSheet();
                updateInventoryBackend(invID);
            });
        }
    });
}

function handleShieldEquip(invID){
    $('.equipShieldButton').each(function(i, obj) {
        let invItemID = $(this).attr('name');
        console.log("Got here "+g_equippedShieldInvItemID+" "+invItemID);
        if(g_equippedShieldInvItemID == invItemID) {
            $(this).removeClass('is-outlined');
            $(this).click(function(event){
                event.stopImmediatePropagation();
                g_equippedShieldInvItemID = null;
                loadCharSheet();
                updateInventoryBackend(invID);
            });
        } else {
            $(this).addClass('is-outlined');
            $(this).click(function(event){
                event.stopImmediatePropagation();
                g_equippedShieldInvItemID = invItemID;
                loadCharSheet();
                updateInventoryBackend(invID);
            });
        }
    });
}

let isUpdateInventoryAvailable = true;
function updateInventoryBackend(invID){
    if(isUpdateInventoryAvailable){
        isUpdateInventoryAvailable = false;
        setTimeout(function(){
            socket.emit("requestUpdateInventory",
                invID,
                g_equippedArmorInvItemID,
                g_equippedShieldInvItemID);
            isUpdateInventoryAvailable = true;
        }, 5000);
    }
}


// Action Tabs //
function changeActionTab(type, data){

    $('#actionFilterSelectByAction').off('change');
    $('#actionFilterSelectBySkill').off('change');
    $('#actionFilterSearch').off('change');


    $('#actionTabContent').html('');

    $('#actionTabEncounter').parent().removeClass("is-active");
    $('#actionTabExploration').parent().removeClass("is-active");
    $('#actionTabDowntime').parent().removeClass("is-active");

    $('#'+type).parent().addClass("is-active");


    let actionFilterSelectByAction = $('#actionFilterSelectByAction');
    if(actionFilterSelectByAction.val() == "chooseDefault"){
        actionFilterSelectByAction.parent().removeClass('is-info');
        actionFilterSelectByAction.removeClass('pf-icon');
    } else {
        actionFilterSelectByAction.parent().addClass('is-info');
        actionFilterSelectByAction.addClass('pf-icon');
    }

    let actionFilterSelectBySkill = $('#actionFilterSelectBySkill');
    if(actionFilterSelectBySkill.val() == "chooseDefault"){
        actionFilterSelectBySkill.parent().removeClass('is-info');
    } else {
        actionFilterSelectBySkill.parent().addClass('is-info');
    }

    let actionFilterSearch = $('#actionFilterSearch');
    if(actionFilterSearch.val() == ""){
        actionFilterSearch.removeClass('is-info');
    } else {
        actionFilterSearch.addClass('is-info');
    }

    $('#actionFilterSelectByAction').change(function(){
        changeActionTab(type, data);
    });

    $('#actionFilterSelectBySkill').change(function(){
        changeActionTab(type, data);
    });

    $('#actionFilterSearch').change(function(){
        changeActionTab(type, data);
    });


    if(type != 'actionTabEncounter') {
        $('#stateNumberOfActions').addClass('is-hidden');
        actionFilterSelectByAction.parent().addClass('is-hidden');
    } else {
        $('#stateNumberOfActions').removeClass('is-hidden');
        actionFilterSelectByAction.parent().removeClass('is-hidden');
    }

    switch(type) {
        case 'actionTabEncounter': filterActionArray(data, data.EncounterFeatStructArray); break;
        case 'actionTabExploration': filterActionArray(data, data.ExplorationFeatStructArray); break;
        case 'actionTabDowntime': filterActionArray(data, data.DowntimeFeatStructArray); break;
        default: break;
    }

}

function filterActionArray(data, featStructArray){

    let actionCount = 0;
    for(const featStruct of featStructArray){

        let willDisplay = true;

        let actionFilterSelectByAction = $('#actionFilterSelectByAction');
        if(actionFilterSelectByAction.val() != "chooseDefault" && actionFilterSelectByAction.is(":visible")){
            if(actionFilterSelectByAction.val() == "OneAction"){
                if(featStruct.Feat.actions != 'ACTION'){
                    willDisplay = false;
                }
            } else if(actionFilterSelectByAction.val() == "OneAction"){
                if(featStruct.Feat.actions != 'ACTION'){
                    willDisplay = false;
                }
            } else if(actionFilterSelectByAction.val() == "TwoActions"){
                if(featStruct.Feat.actions != 'TWO_ACTIONS'){
                    willDisplay = false;
                }
            } else if(actionFilterSelectByAction.val() == "ThreeActions"){
                if(featStruct.Feat.actions != 'THREE_ACTIONS'){
                    willDisplay = false;
                }
            } else if(actionFilterSelectByAction.val() == "FreeAction"){
                if(featStruct.Feat.actions != 'FREE_ACTION'){
                    willDisplay = false;
                }
            } else if(actionFilterSelectByAction.val() == "Reaction"){
                if(featStruct.Feat.actions != 'REACTION'){
                    willDisplay = false;
                }
            }
        }

        let actionFilterSelectBySkill = $('#actionFilterSelectBySkill');
        if(actionFilterSelectBySkill.val() != "chooseDefault"){
            let skillName = actionFilterSelectBySkill.val();
            let skillTag = featStruct.Tags.find(tag => {
                return tag.name == skillName;
            });
            if(skillTag == null){
                willDisplay = false;
            }
        }

        let actionFilterSearch = $('#actionFilterSearch');
        if(actionFilterSearch.val() != ''){
            let actionSearchInput = actionFilterSearch.val().toLowerCase();
            let featName = featStruct.Feat.name.toLowerCase();
            if(!featName.includes(actionSearchInput)){
                let nameOfTag = featStruct.Tags.find(tag => {
                    return tag.name.toLowerCase().includes(actionSearchInput);
                });
                if(nameOfTag == null){
                    willDisplay = false;
                }
            }
        }

        if(willDisplay){
            displayAction(featStruct, actionCount);
        }

        actionCount++;
    }

}

function displayAction(featStruct, actionCount) {

    let actionID = 'actionLink'+featStruct.Feat.id+"C"+actionCount;
                
    let actionNameInnerHTML = '<span class="is-size-5">'+featStruct.Feat.name+'</span>';

    let actionActionInnerHTML = '';
    switch(featStruct.Feat.actions) {
        case 'FREE_ACTION': actionActionInnerHTML += '<div class="column is-paddingless is-1 p-1 pt-2"><span class="pf-icon is-size-5">[free-action]</span></div>'; break;
        case 'REACTION': actionActionInnerHTML += '<div class="column is-paddingless is-1 p-1 pt-2"><span class="pf-icon is-size-5">[reaction]</span></div>'; break;
        case 'ACTION': actionActionInnerHTML += '<div class="column is-paddingless is-1 p-1 pt-2"><span class="pf-icon is-size-5">[one-action]</span></div>'; break;
        case 'TWO_ACTIONS': actionActionInnerHTML += '<div class="column is-paddingless is-1 p-1 pt-2"><span class="pf-icon is-size-5">[two-actions]</span></div>'; break;
        case 'THREE_ACTIONS': actionActionInnerHTML += '<div class="column is-paddingless is-1 p-1 pt-2"><span class="pf-icon is-size-5">[three-actions]</span></div>'; break;
        default: break;
    }

    let actionTagsInnerHTML = '<div class="buttons is-marginless is-right">';
    switch(featStruct.Feat.rarity) {
        case 'UNCOMMON': actionTagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-small is-primary">Uncommon</button>';
            break;
        case 'RARE': actionTagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-small is-success">Rare</button>';
            break;
        case 'UNIQUE': actionTagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-small is-danger">Unique</button>';
            break;
        default: break;
    }
    for(const tag of featStruct.Tags){
        actionTagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-small is-info">'+tag.name+'</button>';
    }
    actionTagsInnerHTML += '</div>';

    
    $('#actionTabContent').append('<div id="'+actionID+'" class="columns is-mobile border-bottom border-dark-lighter cursor-clickable is-marginless mx-2">'+actionActionInnerHTML+'<div class="column is-paddingless p-1"><p class="text-left pl-2">'+actionNameInnerHTML+'</p></div><div class="column is-paddingless p-1"><p class="">'+actionTagsInnerHTML+'</p></div></div>');

    if(actionCount == 0){
        $('#'+actionID).addClass('border-top');
    }
                
    $('#'+actionID).click(function(){

        let actionNameHTML = '<span>'+featStruct.Feat.name+'</span>';
        switch(featStruct.Feat.actions) {
            case 'FREE_ACTION': actionNameHTML += '<span class="px-2 pf-icon">[free-action]</span>'; break;
            case 'REACTION': actionNameHTML += '<span class="px-2 pf-icon">[reaction]</span>'; break;
            case 'ACTION': actionNameHTML += '<span class="px-2 pf-icon">[one-action]</span>'; break;
            case 'TWO_ACTIONS': actionNameHTML += '<span class="px-2 pf-icon">[two-actions]</span>'; break;
            case 'THREE_ACTIONS': actionNameHTML += '<span class="px-2 pf-icon">[three-actions]</span>'; break;
            default: break;
        }

        openQuickView('featView', {
            Feat : featStruct.Feat,
            Tags : featStruct.Tags,
            FeatNameHTML : actionNameHTML,
        });
    });

    $('#'+actionID).mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $('#'+actionID).mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });

}



// Details Tabs //
function changeDetailsTab(type, data){

    $('#detailsTabContent').html('');

    $('#detailsTabFeats').parent().removeClass("is-active");
    $('#detailsTabAbilities').parent().removeClass("is-active");
    $('#detailsTabDescription').parent().removeClass("is-active");

    $('#'+type).parent().addClass("is-active");

    switch(type) {
        case 'detailsTabFeats': displayFeatsSection(data); break;
        case 'detailsTabAbilities': displayAbilitiesSection(data); break;
        case 'detailsTabDescription': displayDescriptionSection(data); break;
        default: break;
    }

}


function displayFeatsSection(data) {

    $('#detailsTabContent').append('<div class="columns is-mobile is-marginless"><div class="column is-10"><p class="control has-icons-left"><input id="featsSearch" class="input" type="text" placeholder="Search Feats"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div><div class="column"><div class="select"><select id="featsFilterByType"><option value="All">All</option><option value="Class">Class</option><option value="Ancestry">Ancestry</option><option value="Other">Other</option></select></div></div></div><div id="featsContent" class="use-custom-scrollbar"></div>');
    displayFeatContent(data);

}

function displayFeatContent(data){

    $('#featsFilterByType').off('change');
    $('#featsSearch').off('change');

    $('#featsContent').html('');

    let featsFilterByType = $('#featsFilterByType');
    if(featsFilterByType.val() == "All"){
        featsFilterByType.parent().removeClass('is-info');
    } else {
        featsFilterByType.parent().addClass('is-info');
    }

    let featsSearch = $('#featsSearch');
    let featsSearchValue = (featsSearch.val() === "") ? null : featsSearch.val();
    if(featsSearchValue == null){
        featsSearch.removeClass('is-info');
    } else {
        featsSearch.addClass('is-info');
    }

    $('#featsFilterByType').change(function(){
        displayFeatContent(data);
    });

    $('#featsSearch').change(function(){
        displayFeatContent(data);
    });

    let selectedFeatFilter = $('#featsFilterByType').val();
    if(selectedFeatFilter === "All"){
        displayClassFeats(data, featsSearchValue);
        displayAncestryFeats(data, featsSearchValue);
        displayOtherFeats(data, featsSearchValue);
    } else if(selectedFeatFilter === "Class"){
        displayClassFeats(data, featsSearchValue);
    } else if(selectedFeatFilter === "Ancestry"){
        displayAncestryFeats(data, featsSearchValue);
    } else if(selectedFeatFilter === "Other"){
        displayOtherFeats(data, featsSearchValue);
    }

}

function displayClassFeats(data, featsSearchValue){
    $('#featsContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">Class</p>');
    $('#featsContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');
    featDisplayByType(data, [data.ClassName], featsSearchValue);
}

function displayAncestryFeats(data, featsSearchValue){
    $('#featsContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">Ancestry</p>');
    $('#featsContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');
    featDisplayByType(data, data.AncestryTagsArray, featsSearchValue);
}

function displayOtherFeats(data, featsSearchValue){
    $('#featsContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">General / Skill</p>');
    $('#featsContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');
    featDisplayByType(data, null, featsSearchValue);
}

function featDisplayByType(data, sortingTagNameArray, featsSearchValue){

    let featCount = 0;
    for(const [dataSrc, dataFeatArray] of data.FeatChoiceMap.entries()){
        for(const feat of dataFeatArray){
                
            let featTags = data.FeatMap.get(feat.id+"").Tags;
            if(sortingTagNameArray == null){
                // Is Other, display if feat is NOT ancestry or class
                let sortingTagNameArray = data.AncestryTagsArray;
                sortingTagNameArray.push(data.ClassName);
                let tag = featTags.find(tag => {
                    return sortingTagNameArray.includes(tag.name);
                });
                if(tag == null){
                    filterFeatsThroughSearch(feat, featTags, featCount, featsSearchValue);
                }
            } else {
                let tag = featTags.find(tag => {
                    return sortingTagNameArray.includes(tag.name);
                });
                if(tag != null){
                    filterFeatsThroughSearch(feat, featTags, featCount, featsSearchValue);
                }
            }
            featCount++;
        }
    }

}

function filterFeatsThroughSearch(feat, featTags, featCount, featsSearchValue){

    let willDisplay = false;
    if(featsSearchValue != null){
        let featName = feat.name.toLowerCase();
        if(!featName.includes(featsSearchValue)){
            willDisplay = false;
        } else {
            willDisplay = true;
        }
    } else {
        willDisplay = true;
    }

    if(willDisplay) {
        displayFeat(feat, featTags, featCount);
    }

}

function displayFeat(feat, featTags, featCount){

    let featID = 'featLink'+feat.id+"C"+featCount;
                
    let featNameInnerHTML = '<span>'+feat.name+'</span>';
    switch(feat.actions) {
        case 'FREE_ACTION': featNameInnerHTML += '<span class="px-2 pf-icon">[free-action]</span>'; break;
        case 'REACTION': featNameInnerHTML += '<span class="px-2 pf-icon">[reaction]</span>'; break;
        case 'ACTION': featNameInnerHTML += '<span class="px-2 pf-icon">[one-action]</span>'; break;
        case 'TWO_ACTIONS': featNameInnerHTML += '<span class="px-2 pf-icon">[two-actions]</span>'; break;
        case 'THREE_ACTIONS': featNameInnerHTML += '<span class="px-2 pf-icon">[three-actions]</span>'; break;
        default: break;
    }

    let featTagsInnerHTML = '<div class="buttons is-marginless is-right">';
    switch(feat.rarity) {
        case 'UNCOMMON': featTagsInnerHTML += '<button class="button is-marginless mr-2 is-small is-primary">Uncommon</button>';
            break;
        case 'RARE': featTagsInnerHTML += '<button class="button is-marginless mr-2 is-small is-success">Rare</button>';
            break;
        case 'UNIQUE': featTagsInnerHTML += '<button class="button is-marginless mr-2 is-small is-danger">Unique</button>';
            break;
        default: break;
    }
    for(const tag of featTags){
        featTagsInnerHTML += '<button class="button is-marginless mr-2 is-small is-info">'+tag.name+'</button>';
    }
    featTagsInnerHTML += '</div>';


    $('#featsContent').append('<div id="'+featID+'" class="columns is-mobile border-bottom border-dark-lighter cursor-clickable is-marginless mx-2"><div class="column is-paddingless p-1 pl-3"><p class="text-left">'+featNameInnerHTML+'</p></div><div class="column is-paddingless p-1"><p class="">'+featTagsInnerHTML+'</p></div></div>');
                
    $('#'+featID).click(function(){
        openQuickView('featView', {
            Feat : feat,
            Tags : featTags,
            FeatNameHTML : featNameInnerHTML,
        });
    });

    $('#'+featID).mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $('#'+featID).mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });

}

function displayAbilitiesSection(data){

}

function displayDescriptionSection(data){
    $('#detailsTabContent').append('<div id="descriptionContent" class="use-custom-scrollbar" style="height: 570px; max-height: 570px; overflow-y: auto;"></div>');

    $('#descriptionContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">Background - '+data.Background.name+'</p>');
    $('#descriptionContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');

    $('#descriptionContent').append('<div class="mx-3">'+processText(data.Background.description, true, true, 'SMALL')+'</div>');

    $('#descriptionContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">Heritage - '+data.Heritage.name+' </p>');
    $('#descriptionContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');

    $('#descriptionContent').append('<div class="mx-3">'+processText(data.Heritage.description, true, true, 'SMALL')+'</div>');

    $('#descriptionContent').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">Information</p>');
    $('#descriptionContent').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');

    let charHistoryAreaID = "charHistoryArea";
    let charHistoryAreaControlShellID = "charHistoryAreaControlShell";

    $('#descriptionContent').append('<div id="'+charHistoryAreaControlShellID+'" class="control mt-1"><textarea id="'+charHistoryAreaID+'" class="textarea has-fixed-size use-custom-scrollbar" rows="10" spellcheck="false" placeholder="Use this area to keep information about your character\'s backstory, appearance, or really anything!"></textarea></div>');

    $("#"+charHistoryAreaID).val(data.Character.details);

    $("#"+charHistoryAreaID).blur(function(){
        if(data.Character.details != $(this).val()) {

            $("#"+charHistoryAreaControlShellID).addClass("is-loading");

            socket.emit("requestDetailsSave",
                getCharIDFromURL(),
                $(this).val());
                
            data.Character.details = $(this).val();

        }
    });

}

socket.on("returnDetailsSave", function(){
    $("#charHistoryAreaControlShell").removeClass("is-loading");
});