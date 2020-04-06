
// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    



});

function changeTab(type, data) {

    $('#tabContent').html('');

    $('#actionsTab').parent().removeClass("is-active");
    $('#spellsTab').parent().removeClass("is-active");
    $('#inventoryTab').parent().removeClass("is-active");
    $('#featsTab').parent().removeClass("is-active");
    $('#notesTab').parent().removeClass("is-active");

    $('#'+type).parent().addClass("is-active");
    g_selectedTabID = type;

    if(type == 'actionsTab'){

        $('#tabContent').append('<div class="tabs is-centered is-marginless"><ul class="action-tabs"><li><a id="actionTabEncounter">Encounter</a></li><li><a id="actionTabExploration">Exploration</a></li><li><a id="actionTabDowntime">Downtime</a></li></ul></div>');

        let filterInnerHTML = '<div class="columns is-marginless"><div class="column is-4"><p id="stateNumberOfActions" class="is-size-7 has-text-left">3 Actions per Turn</p></div><div class="column is-1"><p class="is-size-6 has-text-grey-lighter">Filter</p></div>';
        filterInnerHTML += '<div class="column is-2"><div class="select is-small"><select id="actionFilterSelectBySkill"><option value="chooseDefault">By Skill</option>';

        for(const [skillName, skillData] of data.SkillMap.entries()){
            filterInnerHTML += '<option value="'+skillData.Skill.name+'">'+skillData.Skill.name+'</option>';
        }

        filterInnerHTML += '</select></div></div><div class="column is-2"><div class="select is-small"><select id="actionFilterSelectByAction"><option value="chooseDefault">By Action</option><option value="OneAction" class="pf-icon">[one-action]</option><option value="TwoActions" class="pf-icon">[two-actions]</option><option value="ThreeActions" class="pf-icon">[three-actions]</option><option value="FreeAction" class="pf-icon">[free-action]</option><option value="Reaction" class="pf-icon">[reaction]</option></select></div></div></div>';

        filterInnerHTML += '<div class="mb-4"><p class="control has-icons-left"><input id="actionFilterSearch" class="input" type="text" placeholder="Search"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div>';

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

    } else if(type == 'spellsTab'){



    } else if(type == 'inventoryTab'){

        // Determine Armor
        determineArmor(data.DexMod);

        $('#tabContent').append('<div class="columns pt-1 is-marginless"><div class="column is-inline-flex is-paddingless pt-2 px-3"><p class="is-size-6 pr-3"><strong class="has-text-grey-lighter">Total Bulk</strong></p><p id="bulkTotal" class="is-size-6 has-text-left">'+g_bulkAndCoinsStruct.TotalBulk+' / '+g_bulkAndCoinsStruct.WeightEncumbered+'</p><p id="bulkMax" class="is-size-7 pl-2 has-text-left">(Limit '+g_bulkAndCoinsStruct.WeightMax+')</p></div><div class="column is-paddingless pt-2 px-3"><div class="is-inline-flex is-pulled-right"><p id="coinsMessage" class="is-size-6"><strong class="has-text-grey-lighter">Total Coins</strong></p><div id="coinsCopperSection" class="is-inline-flex" data-tooltip="Copper"><figure class="image is-16x16 is-marginless mt-1 ml-3 mr-1"><img src="/images/copper_coin.png"></figure><p>'+g_bulkAndCoinsStruct.CopperCoins+'</p></div><div id="coinsSilverSection" class="is-inline-flex" data-tooltip="Silver"><figure class="image is-16x16 is-marginless mt-1 ml-3 mr-1"><img src="/images/silver_coin.png"></figure><p>'+g_bulkAndCoinsStruct.SilverCoins+'</p></div><div id="coinsGoldSection" class="is-inline-flex" data-tooltip="Gold"><figure class="image is-16x16 is-marginless mt-1 ml-3 mr-1"><img src="/images/gold_coin.png"></figure><p>'+g_bulkAndCoinsStruct.GoldCoins+'</p></div><div id="coinsPlatinumSection" class="is-inline-flex" data-tooltip="Platinum"><figure class="image is-16x16 is-marginless mt-1 ml-3 mr-1"><img src="/images/platinum_coin.png"></figure><p>'+g_bulkAndCoinsStruct.PlatinumCoins+'</p></div></div></div></div>');

        $('#tabContent').append('<div class="columns is-marginless"><div class="column is-10"><p class="control has-icons-left"><input id="inventorySearch" class="input" type="text" placeholder="Search Inventory"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div><div class="column"><button id="invAddItems" class="button is-info is-rounded">Add Items</button></div></div><div class="tile is-ancestor is-vertical"><div class="tile is-parent is-paddingless pt-1 px-2"><div class="tile is-child is-6"><p class="has-text-left pl-3"><strong class="has-text-grey-light">Name</strong></p></div><div class="tile is-child is-1"><p class="pr-3"><strong class="has-text-grey-light">Qty</strong></p></div><div class="tile is-child is-1"><p class="pr-3"><strong class="has-text-grey-light">Bulk</strong></p></div><div class="tile is-child is-1"><p class="pr-3"><strong class="has-text-grey-light">Health</strong></p></div><div class="tile is-child is-3"><p class="pr-4"><strong class="has-text-grey-light">Tags</strong></p></div></div><div class="is-divider border-secondary is-marginless"></div><div id="inventoryContent" class="use-custom-scrollbar"></div></div>');

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


    } else if(type == 'featsTab'){

        
        $('#tabContent').append('<div class="tabs is-centered"><ul><li><a id="featTabAll">All</a></li><li><a id="featTabGeneral">General</a></li><li><a id="featTabClass">Class</a></li><li><a id="featTabAncestry">Ancestry</a></li></ul></div>');

        $('#tabContent').append('<div id="featTabContent"></div>');

        $('#featTabAll').click(function(){
            changeFeatTab('featTabAll', data);
        });

        $('#featTabGeneral').click(function(){
            changeFeatTab('featTabGeneral', data);
        });

        $('#featTabClass').click(function(){
            changeFeatTab('featTabClass', data);
        });

        $('#featTabAncestry').click(function(){
            changeFeatTab('featTabAncestry', data);
        });

        $('#featTabAll').click();

    } else if(type == 'notesTab'){

        let notesAreaID = "notesArea";
        let notesAreaControlShellID = "notesAreaControlShell";

        $('#tabContent').html('<div id="'+notesAreaControlShellID+'" class="control mt-3"><textarea id="'+notesAreaID+'" class="textarea has-fixed-size use-custom-scrollbar" rows="24" spellcheck="false" placeholder="Feel free to write notes here about your character, backstory, or anything else you\'d like!"></textarea></div>');

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

    let weaponRuneArray = [];
    let armorRuneArray = [];
    for(const [itemID, itemData] of g_itemMap.entries()){
        if(itemData.RuneData != null){
            if(itemData.RuneData.etchedType == 'WEAPON'){
                weaponRuneArray.push(itemData);
            } else if(itemData.RuneData.etchedType == 'ARMOR'){
                armorRuneArray.push(itemData);
            }
        }
    }
    let runeDataStruct = { WeaponArray : weaponRuneArray, ArmorArray : armorRuneArray };

    let inventorySearch = $('#inventorySearch');
    let invSearchInput = null;
    if(inventorySearch.val() != ''){
        invSearchInput = inventorySearch.val().toLowerCase();
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

    invItem.currentHitPoints = (invItem.currentHitPoints > invItem.hitPoints) ? invItem.hitPoints : invItem.currentHitPoints;

    if(itemIsStorage) {

        let invItemStorageViewButtonID = 'invItemStorageViewButton'+invItem.id;
        let invItemStorageSectionID = 'invItemStorageSection'+invItem.id;
        let invItemStorageBulkAmountID = 'invItemStorageBulkAmount'+invItem.id;

        $('#inventoryContent').append('<div id="'+invItemSectionID+'" class="tile is-parent is-paddingless pt-1 px-2 border-bottom border-dark cursor-clickable"><div class="tile is-child is-6"><p id="'+invItemNameID+'" class="has-text-left pl-3 is-size-6 has-text-grey-lighter"><a id="'+invItemStorageViewButtonID+'" class="button is-small is-info is-rounded is-outlined mb-1 ml-3">Open</a></p></div><div id="'+invItemQtyID+'" class="tile is-child is-1"><p></p></div><div id="'+invItemBulkID+'" class="tile is-child is-1"><p></p></div><div id="'+invItemHealthID+'" class="tile is-child is-1"><p></p></div><div class="tile is-child is-3"><div class="tags is-centered"><span id="'+invItemShoddyTagID+'" class="tag is-warning">Shoddy</span><span id="'+invItemBrokenTagID+'" class="tag is-danger">Broken</span></div></div></div>');

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
        $('#'+invItemStorageSectionID).append('<div class="tile is-parent is-paddingless pt-1 px-2"><div class="tile is-child is-1"></div><div class="tile is-child is-3 border-bottom border-dark"><p id="'+invItemStorageBulkAmountID+'" class="has-text-left pl-5 is-size-6 has-text-grey">Bulk '+bagBulk+' / '+maxBagBulk+'</p></div><div class="tile is-child is-8 border-bottom border-dark"><p class="has-text-left pl-3 is-size-6 has-text-grey is-italic">'+bulkIgnoredMessage+'</p></div></div>');

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

                baggedInvItem.currentHitPoints = (baggedInvItem.currentHitPoints > baggedInvItem.hitPoints) ? baggedInvItem.hitPoints : baggedInvItem.currentHitPoints;

                $('#'+invItemStorageSectionID).append('<div id="'+baggedInvItemSectionID+'" class="tile is-parent is-paddingless pt-1 px-2 cursor-clickable"><div id="'+baggedInvItemIndentID+'" class="tile is-child is-1"></div><div class="tile is-child is-5 border-bottom border-dark"><p id="'+baggedInvItemNameID+'" class="has-text-left pl-3 is-size-6 has-text-grey-light"></p></div><div id="'+baggedInvItemQtyID+'" class="tile is-child is-1 border-bottom border-dark"><p></p></div><div id="'+baggedInvItemBulkID+'" class="tile is-child is-1 border-bottom border-dark"><p></p></div><div id="'+baggedInvItemHealthID+'" class="tile is-child is-1 border-bottom border-dark"><p></p></div><div class="tile is-child is-3 border-bottom border-dark"><div class="tags is-centered"><span id="'+baggedInvItemShoddyTagID+'" class="tag is-warning">Shoddy</span><span id="'+baggedInvItemBrokenTagID+'" class="tag is-danger">Broken</span></div></div></div>');

                $('#'+baggedInvItemNameID).html(baggedInvItem.name);

                if(baggedItem.WeaponData != null){
                    let calcStruct = getAttackAndDamage(baggedItem, data.StrMod, data.DexMod);
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

                if(baggedInvItem.currentHitPoints == baggedInvItem.hitPoints) {
                    $('#'+baggedInvItemHealthID).html('-');
                } else {
                    $('#'+baggedInvItemHealthID).html(baggedInvItem.currentHitPoints+'/'+baggedInvItem.hitPoints);
                }

                if(baggedInvItem.isShoddy == 0){
                    $('#'+baggedInvItemShoddyTagID).addClass('is-hidden');
                } else {
                    $('#'+baggedInvItemShoddyTagID).removeClass('is-hidden');
                }

                if(baggedInvItem.currentHitPoints > baggedInvItem.brokenThreshold){
                    $('#'+baggedInvItemBrokenTagID).addClass('is-hidden');
                } else {
                    $('#'+baggedInvItemBrokenTagID).removeClass('is-hidden');
                }

                $('#'+baggedInvItemSectionID).click(function(){
                    openQuickView('invItemView', {
                        InvItem : baggedInvItem,
                        Item : baggedItem,
                        OpenBagInvItemArray : openBagInvItemArray,
                        RuneDataStruct : runeDataStruct,
                        ItemIsStorage : baggedItemIsStorage,
                        ItemIsStorageAndEmpty : true,
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
            $('#'+invItemStorageSectionID).append('<div class="tile is-parent is-paddingless pt-1 px-2"><div class="tile is-child is-1"></div><div class="tile is-child is-11 border-bottom border-dark"><p class="has-text-left pl-3 is-size-7 has-text-grey is-italic">Empty</p></div></div>');
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
        $('#inventoryContent').append('<div id="'+invItemSectionID+'" class="tile is-parent is-paddingless pt-1 px-2 border-bottom border-dark cursor-clickable"><div class="tile is-child is-6"><p id="'+invItemNameID+'" class="has-text-left pl-3 is-size-6 has-text-grey-light"></p></div><div id="'+invItemQtyID+'" class="tile is-child is-1"><p></p></div><div id="'+invItemBulkID+'" class="tile is-child is-1"><p></p></div><div id="'+invItemHealthID+'" class="tile is-child is-1"><p></p></div><div class="tile is-child is-3"><div class="tags is-centered"><span id="'+invItemShoddyTagID+'" class="tag is-warning">Shoddy</span><span id="'+invItemBrokenTagID+'" class="tag is-danger">Broken</span></div></div></div>');
    }

    

    $('#'+invItemNameID).prepend(invItem.name);

    if(item.WeaponData != null){
        let calcStruct = getAttackAndDamage(item, data.StrMod, data.DexMod);
        $('#'+invItemNameID).append('<sup class="pl-2 has-text-weight-light">'+calcStruct.AttackBonus+'</sup><sup class="pl-3 has-text-weight-light has-text-grey">'+calcStruct.Damage+'</sup>');
    }

    if(item.ArmorData != null){
        $('#'+invItemNameID).append('<button name="'+invItem.id+'" class="equipArmorButton button is-small is-info is-rounded is-outlined mb-1 ml-3"><span class="icon is-small"><i class="fas fa-tshirt"></i></span></button>');
    }

    if(item.ShieldData != null){
        let notBroken = (invItem.currentHitPoints > invItem.brokenThreshold);
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
    console.log(invItem);
    if(invItem.currentHitPoints == invItem.hitPoints) {
        $('#'+invItemHealthID).html('-');
    } else {
        $('#'+invItemHealthID).html(invItem.currentHitPoints+'/'+invItem.hitPoints);
    }

    if(invItem.isShoddy == 0){
        $('#'+invItemShoddyTagID).addClass('is-hidden');
    } else {
        $('#'+invItemShoddyTagID).removeClass('is-hidden');
    }

    if(invItem.currentHitPoints > invItem.brokenThreshold){
        $('#'+invItemBrokenTagID).addClass('is-hidden');
    } else {
        $('#'+invItemBrokenTagID).removeClass('is-hidden');
    }

    $('#'+invItemSectionID).click(function(){
        openQuickView('invItemView', {
            InvItem : invItem,
            Item : item,
            OpenBagInvItemArray : openBagInvItemArray,
            RuneDataStruct : runeDataStruct,
            ItemIsStorage : itemIsStorage,
            ItemIsStorageAndEmpty : itemIsStorageAndEmpty,
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
        actionFilterSearch.parent().removeClass('is-info');
    } else {
        actionFilterSearch.parent().addClass('is-info');
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


    $('#actionTabContent').append('<div id="'+actionID+'" class="columns border cursor-clickable">'+actionActionInnerHTML+'<div class="column is-paddingless p-1"><p class="has-text-left pl-2">'+actionNameInnerHTML+'</p></div><div class="column is-paddingless p-1"><p class="">'+actionTagsInnerHTML+'</p></div></div>');

    if(actionCount != 0){
        $('#'+actionID).addClass('border-top-0');
    }
                
    $('#'+actionID).click(function(){
        console.log("GOT HERRRREEEEEE");

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

}



// Feat Tabs //
function changeFeatTab(type, data){

    $('#featTabContent').html('');

    $('#featTabAll').parent().removeClass("is-active");
    $('#featTabGeneral').parent().removeClass("is-active");
    $('#featTabClass').parent().removeClass("is-active");
    $('#featTabAncestry').parent().removeClass("is-active");

    $('#'+type).parent().addClass("is-active");

    switch(type) {
        case 'featTabAll': featSort(data, ['AnyTag']); break;
        case 'featTabGeneral': featSort(data, ['General']); break;
        case 'featTabClass': featSort(data, [data.ClassName]); break;
        case 'featTabAncestry': featSort(data, data.AncestryTagsArray); break;
        default: break;
    }

}

// Feat Sorting //
function featSort(data, sortingTagNameArray){

    let featCount = 0;
    for(const [dataSrc, dataFeatArray] of data.FeatChoiceMap.entries()){
        for(const feat of dataFeatArray){
                
            let featTags = data.FeatMap.get(feat.id+"").Tags;
            if(sortingTagNameArray[0] == "AnyTag"){
                displayFeat(feat, featTags, featCount);
            } else {
                let tag = featTags.find(tag => {
                    return sortingTagNameArray.includes(tag.name);
                });
                if(tag != null){
                    displayFeat(feat, featTags, featCount);
                }
            }

            featCount++;
        }
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


    $('#featTabContent').append('<div id="'+featID+'" class="columns border cursor-clickable"><div class="column is-paddingless p-1 pl-3"><p class="has-text-left">'+featNameInnerHTML+'</p></div><div class="column is-paddingless p-1"><p class="">'+featTagsInnerHTML+'</p></div></div>');

    if(featCount != 0){
        $('#'+featID).addClass('border-top-0');
    }
                
    $('#'+featID).click(function(){
        openQuickView('featView', {
            Feat : feat,
            Tags : featTags,
            FeatNameHTML : featNameInnerHTML,
        });
    });

}