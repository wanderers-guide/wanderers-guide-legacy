
function openAddItemQuickview(data) {

    $('#quickViewTitle').html('Add Items');
    $('#quickViewTitleRight').html('<button id="createCustomItemBtn" class="button is-very-small is-success is-outlined is-rounded is-pulled-right mr-1">Create Item</button>');
    let qContent = $('#quickViewContent');

    $('#createCustomItemBtn').click(function(){
        $(this).addClass('is-loading');
        socket.emit("requestAddItemToInv",
            data.InvID,
            62, // Hardcoded New Item ID
            1);
        $(this).blur();
    });

    qContent.append('<div class="tabs is-small is-centered is-marginless mb-1"><ul class="category-tabs"><li><a id="itemTabAll">All</a></li><li><a id="itemTabGeneral">General</a></li><li><a id="itemTabCombat">Combat</a></li><li><a id="itemTabStorage">Storage</a></li><li><a id="itemTabCurrency">Currency</a></li></ul></div>');

    qContent.append('<div class="mb-3"><p class="control has-icons-left"><input id="allItemSearch" class="input" type="text" placeholder="Search Items in Category"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div>');

    qContent.append('<div id="addItemListSection" class="tile is-ancestor is-vertical"></div>');

    $('#itemTabAll').click(function(){
        changeItemCategoryTab('itemTabAll', data);
    });

    $('#itemTabGeneral').click(function(){
        changeItemCategoryTab('itemTabGeneral', data);
    });

    $('#itemTabCombat').click(function(){
        changeItemCategoryTab('itemTabCombat', data);
    });

    $('#itemTabStorage').click(function(){
        changeItemCategoryTab('itemTabStorage', data);
    });

    $('#itemTabCurrency').click(function(){
        changeItemCategoryTab('itemTabCurrency', data);
    });

    $('#itemTabAll').click();

}





function changeItemCategoryTab(type, data){

    $('#addItemListSection').html('');

    $('#itemTabAll').parent().removeClass("is-active");
    $('#itemTabGeneral').parent().removeClass("is-active");
    $('#itemTabCombat').parent().removeClass("is-active");
    $('#itemTabStorage').parent().removeClass("is-active");
    $('#itemTabCurrency').parent().removeClass("is-active");

    let allItemSearch = $('#allItemSearch');
    let allItemSearchInput = null;
    if(allItemSearch.val() != ''){
        allItemSearchInput = allItemSearch.val().toLowerCase();
        allItemSearch.addClass('is-info');
    } else {
        allItemSearch.removeClass('is-info');
    }

    $('#allItemSearch').off('change');
    $('#allItemSearch').change(function(){
        changeItemCategoryTab(type, data);
    });

    
    $('#'+type).parent().addClass("is-active");

    for(const [itemID, itemDataStruct] of data.ItemMap.entries()){

        let willDisplay = false;

        let itemType = itemDataStruct.Item.itemType;
        if(type == 'itemTabAll') {
            willDisplay = true;
        } else if(type == 'itemTabGeneral') {
            if(itemType == 'GENERAL' || itemType == 'KIT' || itemType == 'INGREDIENT' || itemType == 'OTHER' || itemType == 'TOOL' || itemType == 'INSTRUMENT') {
                willDisplay = true;
            }
        } else if(type == 'itemTabCombat') {
            if(itemType == 'WEAPON' || itemType == 'ARMOR') {
                willDisplay = true;
            }
        } else if(type == 'itemTabStorage') {
            if(itemType == 'STORAGE') {
                willDisplay = true;
            }
        } else if(type == 'itemTabCurrency') {
            if(itemType == 'CURRENCY') {
                willDisplay = true;
            }
        }

        if(allItemSearchInput != null){
            let itemName = itemDataStruct.Item.name.toLowerCase();
            if(!itemName.includes(allItemSearchInput)){
                willDisplay = false;
            }
        }

        if(willDisplay){
            displayAddItem(itemID, itemDataStruct, data);
        }

    }

}

function displayAddItem(itemID, itemDataStruct, data){

    if(itemDataStruct.Item.hidden == 1 || itemDataStruct.Item.isArchived == 1){
        return;
    }

    let addItemViewItemClass = 'addItemViewItem'+itemID;
    let addItemAddItemID = 'addItemAddItem'+itemID;
    let addItemChevronItemID = 'addItemChevronItemID'+itemID;
    let addItemNameID = 'addItemName'+itemID;
    let addItemDetailsItemID = 'addItemDetailsItem'+itemID;

    let itemLevel = (itemDataStruct.Item.level == 0) ? "" : "Lvl "+itemDataStruct.Item.level;

    let itemName = itemDataStruct.Item.name;
    if(itemDataStruct.Item.quantity > 1){
        itemName += ' ('+itemDataStruct.Item.quantity+')';
    }

    $('#addItemListSection').append('<div class="tile is-parent is-paddingless border-bottom border-additems has-background-black-like cursor-clickable"><div class="tile is-child is-7 '+addItemViewItemClass+'"><p id="'+addItemNameID+'" class="has-text-left mt-1 pl-3 has-text-grey-lighter">'+itemName+'</p></div><div class="tile is-child is-2"><p class="has-text-centered is-size-7 mt-2">'+itemLevel+'</p></div><div class="tile is-child"><button id="'+addItemAddItemID+'" class="button my-1 is-small is-success is-outlined is-rounded">Add</button></div><div class="tile is-child is-1 '+addItemViewItemClass+'"><span class="icon has-text-grey mt-2"><i id="'+addItemChevronItemID+'" class="fas fa-chevron-down"></i></span></div></div><div id="'+addItemDetailsItemID+'" class="tile is-parent is-vertical is-paddingless border-bottom border-additems is-hidden p-2 text-center"></div>');

    let rarity = itemDataStruct.Item.rarity;
    let tagsInnerHTML = '';
    switch(rarity) {
      case 'UNCOMMON': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-primary">Uncommon</button>';
        break;
      case 'RARE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-success">Rare</button>';
        break;
      case 'UNIQUE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-danger">Unique</button>';
        break;
      default: break;
    }
    for(const tagStruct of itemDataStruct.TagArray){
        tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+tagStruct.Tag.description+'">'+tagStruct.Tag.name+'</button>';
    }

    if(tagsInnerHTML != ''){
        $('#'+addItemDetailsItemID).append('<div class="buttons is-marginless is-centered">'+tagsInnerHTML+'</div>');
        $('#'+addItemDetailsItemID).append('<hr class="mb-2 mt-1">');
    }


    if(itemDataStruct.WeaponData != null){

        let weapGroup = null;
        if(itemDataStruct.WeaponData.isRanged == 1){
            weapGroup = capitalizeWord(itemDataStruct.WeaponData.rangedWeaponType);
        }
        if(itemDataStruct.WeaponData.isMelee == 1){
            weapGroup = capitalizeWord(itemDataStruct.WeaponData.meleeWeaponType);
        }

        let weapCategory = capitalizeWord(itemDataStruct.WeaponData.category);
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><p><strong>Category:</strong> '+weapCategory+'</p></div><div class="tile is-child is-6"><p><strong>Group:</strong> '+weapGroup+'</p></div></div>');

        $('#'+addItemDetailsItemID).append('<hr class="m-2">');

    }

    if(itemDataStruct.ArmorData != null){

        let armorCategory = capitalizeWord(itemDataStruct.ArmorData.category);
        let armorGroup = (itemDataStruct.ArmorData.armorType == 'N/A') ? '-' : capitalizeWord(itemDataStruct.ArmorData.armorType);
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><p><strong>Category:</strong> '+armorCategory+'</p></div><div class="tile is-child is-6"><p><strong>Group:</strong> '+armorGroup+'</p></div></div>');

        $('#'+addItemDetailsItemID).append('<hr class="m-2">');

    }


    let price = getCoinToString(itemDataStruct.Item.price);
    if(itemDataStruct.Item.quantity > 1){
        price += ' for '+itemDataStruct.Item.quantity;
    }
    $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-4"><strong>Price</strong></div><div class="tile is-child is-4"><strong>Bulk</strong></div><div class="tile is-child is-4"><strong>Hands</strong></div></div>');
    $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-4"><p>'+price+'</p></div><div class="tile is-child is-4"><p>'+getBulkFromNumber(itemDataStruct.Item.bulk)+'</p></div><div class="tile is-child is-4"><p>'+getHandsToString(itemDataStruct.Item.hands)+'</p></div></div>');
    
    $('#'+addItemDetailsItemID).append('<hr class="m-2">');

        
    if(itemDataStruct.WeaponData != null){

        if(itemDataStruct.WeaponData.isMelee == 1){

            let damage = itemDataStruct.WeaponData.diceNum+""+itemDataStruct.WeaponData.dieType+" "+itemDataStruct.WeaponData.damageType;

            $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child"><strong>Damage</strong></div></div>');
            $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child"><p>'+damage+'</p></div></div>');

            $('#'+addItemDetailsItemID).append('<hr class="m-2">');

        }

        if(itemDataStruct.WeaponData.isRanged == 1){

            let damage = itemDataStruct.WeaponData.diceNum+""+itemDataStruct.WeaponData.dieType+" "+itemDataStruct.WeaponData.damageType;

            $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child"><strong>Damage</strong></div></div>');
            $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child"><p>'+damage+'</p></div></div>');

            $('#'+addItemDetailsItemID).append('<hr class="m-2">');

            let reload = itemDataStruct.WeaponData.rangedReload;
            if(reload == 0){ reload = '-'; }
            let range = itemDataStruct.WeaponData.rangedRange+" ft";
            $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><strong>Range</strong></div><div class="tile is-child is-6"><strong>Reload</strong></div></div>');
            $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><p>'+range+'</p></div><div class="tile is-child is-6"><p>'+reload+'</p></div></div>');

            $('#'+addItemDetailsItemID).append('<hr class="m-2">');

        }

    }

    if(itemDataStruct.ArmorData != null){
        
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><strong>AC Bonus</strong></div><div class="tile is-child is-6"><strong>Dex Cap</strong></div></div>');
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><p>'+signNumber(itemDataStruct.ArmorData.acBonus)+'</p></div><div class="tile is-child is-6"><p>'+signNumber(itemDataStruct.ArmorData.dexCap)+'</p></div></div>');

        $('#'+addItemDetailsItemID).append('<hr class="m-2">');

        let minStrength = (itemDataStruct.ArmorData.minStrength == 0) ? '-' : itemDataStruct.ArmorData.minStrength+'';
        let checkPenalty = (itemDataStruct.ArmorData.checkPenalty == 0) ? '-' : itemDataStruct.ArmorData.checkPenalty+'';
        let speedPenalty = (itemDataStruct.ArmorData.speedPenalty == 0) ? '-' : itemDataStruct.ArmorData.speedPenalty+' ft';
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-4"><strong>Strength</strong></div><div class="tile is-child is-4"><strong>Check Penalty</strong></div><div class="tile is-child is-4"><strong>Speed Penalty</strong></div></div>');
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-4"><p>'+minStrength+'</p></div><div class="tile is-child is-4"><p>'+checkPenalty+'</p></div><div class="tile is-child is-4"><p>'+speedPenalty+'</p></div></div>');

        $('#'+addItemDetailsItemID).append('<hr class="m-2">');

    }

    if(itemDataStruct.ShieldData != null){

        let speedPenalty = (itemDataStruct.ShieldData.speedPenalty == 0) ? '-' : itemDataStruct.ShieldData.speedPenalty+' ft';
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><strong>AC Bonus</strong></div><div class="tile is-child is-6"><strong>Speed Penalty</strong></div></div>');
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><p>'+signNumber(itemDataStruct.ShieldData.acBonus)+'</p></div><div class="tile is-child is-6"><p>'+speedPenalty+'</p></div></div>');

        $('#'+addItemDetailsItemID).append('<hr class="m-2">');

    }

    if(itemDataStruct.StorageData != null){
        
        let maxBagBulk = itemDataStruct.StorageData.maxBulkStorage;
        let bulkIgnored = itemDataStruct.StorageData.bulkIgnored;
        let bulkIgnoredMessage = "-";
        if(bulkIgnored != 0.0){
            if(bulkIgnored == maxBagBulk){
                bulkIgnoredMessage = "All Items";
            } else {
                bulkIgnoredMessage = "First "+bulkIgnored+" Bulk of Items";
            }
        }

        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><strong>Bulk Storage</strong></div><div class="tile is-child is-6"><strong>Bulk Ignored</strong></div></div>');
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><p>'+maxBagBulk+'</p></div><div class="tile is-child is-6"><p>'+bulkIgnoredMessage+'</p></div></div>');

        $('#'+addItemDetailsItemID).append('<hr class="m-2">');
    }

    $('#'+addItemDetailsItemID).append(processText(itemDataStruct.Item.description, true, true, 'MEDIUM'));


    $('#'+addItemAddItemID).click(function(){
        $(this).addClass('is-loading');
        socket.emit("requestAddItemToInv",
            data.InvID,
            itemID,
            itemDataStruct.Item.quantity);
        $(this).blur();
    });

    $('.'+addItemViewItemClass).click(function(){
        if($('#'+addItemDetailsItemID).is(":visible")){
            $('#'+addItemDetailsItemID).addClass('is-hidden');
            $('#'+addItemChevronItemID).removeClass('fa-chevron-up');
            $('#'+addItemChevronItemID).addClass('fa-chevron-down');
            $('#'+addItemNameID).removeClass('has-text-weight-bold');
        } else {
            $('#'+addItemDetailsItemID).removeClass('is-hidden');
            $('#'+addItemChevronItemID).removeClass('fa-chevron-down');
            $('#'+addItemChevronItemID).addClass('fa-chevron-up');
            $('#'+addItemNameID).addClass('has-text-weight-bold');
        }
    });

}