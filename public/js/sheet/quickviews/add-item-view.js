/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openAddItemQuickview(data) {

    $('#quickViewTitle').html('Add Items');
    $('#quickViewTitleRight').html('<button id="createCustomItemBtn" class="button is-very-small is-success is-outlined is-rounded is-pulled-right mr-1">Create Item</button>');
    $('#createCustomItemBtn').click(function(){
        $(this).addClass('is-loading');
        socket.emit("requestAddItemToInv",
            data.InvID,
            62, // Hardcoded New Item ID
            1);
        $(this).blur();
    });

    let qContent = $('#quickViewContent');

    qContent.append('<div class="tabs is-small is-centered is-marginless mb-1"><ul class="category-tabs"><li><a id="itemTabAll">All</a></li><li><a id="itemTabGeneral">General</a></li><li><a id="itemTabMagical">Magical</a></li><li><a id="itemTabAlchemical">Alchemical</a></li><li><a id="itemTabCurrency">Currency</a></li></ul></div>');

    qContent.append('<div class="columns is-mobile is-marginless mb-3"><div class="column py-1 pr-1"><p class="control has-icons-left"><input id="allItemSearch" class="input" type="text"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div><div class="column is-3 py-1 mt-1"><div class="select is-small is-info"><select id="allItemsFilterBySubcategory"></select></div></div></div>');

    qContent.append('<div id="addItemListSection" class="tile is-ancestor is-vertical"></div>');

    $('#itemTabAll').click(function(){
        $('#allItemsFilterBySubcategory').parent().parent().addClass('is-hidden');
        $('#allItemsFilterBySubcategory').html('');
        $('#allItemSearch').attr('placeholder', 'Search All Items');
        changeItemCategoryTab('itemTabAll', data);
    });

    $('#itemTabGeneral').click(function(){
        $('#allItemsFilterBySubcategory').parent().parent().removeClass('is-hidden');
        $('#allItemsFilterBySubcategory').html('<option value="ALL">Category</option><option value="AMMUNITION">Ammunition</option><option value="ARMOR">Armor</option><option value="BOOK">Book</option><option value="INGREDIENT">Ingredient</option><option value="INSTRUMENT">Instrument</option><option value="KIT">Kit</option><option value="SHIELD">Shield</option><option value="STORAGE">Storage</option><option value="TOOL">Tool</option><option value="WEAPON">Weapon</option><option value="OTHER">Other</option>');
        $('#allItemSearch').attr('placeholder', 'Search General Items');
        changeItemCategoryTab('itemTabGeneral', data);
    });

    $('#itemTabMagical').click(function(){
        $('#allItemsFilterBySubcategory').parent().parent().removeClass('is-hidden');
        $('#allItemsFilterBySubcategory').html('<option value="ALL">Category</option><option value="ARTIFACT">Artifact</option><option value="AMMUNITION">Ammunition</option><option value="ARMOR">Armor</option><option value="BELT">Belt</option><option value="BOOK">Book</option><option value="BOOTS">Boots</option><option value="BRACERS">Bracers</option><option value="CIRCLET">Circlet</option><option value="CLOAK">Cloak</option><option value="COMPANION">Companion</option><option value="EYEPIECE">Eyepiece</option><option value="GLOVES">Gloves</option><option value="HAT">Hat</option><option value="INSTRUMENT">Instrument</option><option value="MASK">Mask</option><option value="NECKLACE">Necklace</option><option value="OIL">Oil</option><option value="POTION">Potion</option><option value="RING">Ring</option><option value="ROD">Rod</option><option value="RUNE">Runestone</option><option value="SCROLL">Scroll</option><option value="SHIELD">Shield</option><option value="STAFF">Staff</option><option value="STORAGE">Storage</option><option value="STRUCTURE">Structure</option><option value="TALISMAN">Talisman</option><option value="WAND">Wand</option><option value="WEAPON">Weapon</option><option value="OTHER">Other</option>');
        $('#allItemSearch').attr('placeholder', 'Search Magical Items');
        changeItemCategoryTab('itemTabMagical', data);
    });

    $('#itemTabAlchemical').click(function(){
        $('#allItemsFilterBySubcategory').parent().parent().removeClass('is-hidden');
        $('#allItemsFilterBySubcategory').html('<option value="ALL">Category</option><option value="BOMB">Bomb</option><option value="DRUG">Drug</option><option value="ELIXIR">Elixir</option><option value="INGREDIENT">Ingredient</option><option value="POISON">Poison</option><option value="TOOL">Tool</option><option value="OTHER">Other</option>');
        $('#allItemSearch').attr('placeholder', 'Search Alchemical Items');
        changeItemCategoryTab('itemTabAlchemical', data);
    });

    $('#itemTabCurrency').click(function(){
        $('#allItemsFilterBySubcategory').parent().parent().addClass('is-hidden');
        $('#allItemsFilterBySubcategory').html('<option value="ALL">All</option>');
        $('#allItemSearch').attr('placeholder', 'Search Currency');
        changeItemCategoryTab('itemTabCurrency', data);
    });

    $('#itemTabAll').click();

}





function changeItemCategoryTab(type, data){

    $('#addItemListSection').html('');

    $('#itemTabAll').parent().removeClass("is-active");
    $('#itemTabGeneral').parent().removeClass("is-active");
    $('#itemTabMagical').parent().removeClass("is-active");
    $('#itemTabAlchemical').parent().removeClass("is-active");
    $('#itemTabCurrency').parent().removeClass("is-active");
    $('#'+type).parent().addClass("is-active");

    let allItemSearch = $('#allItemSearch');
    let allItemSearchInput = null;
    if(allItemSearch.val() != ''){
        allItemSearchInput = allItemSearch.val().toUpperCase();
        allItemSearch.addClass('is-info');
    } else {
        allItemSearch.removeClass('is-info');
        if(type != 'itemTabAll') {
            allItemSearch.blur();
        }
    }

    let allItemsFilterBySubcategoryValue = $('#allItemsFilterBySubcategory').val();

    $('#allItemSearch').off('change');
    $('#allItemSearch').change(function(){
        changeItemCategoryTab(type, data);
    });

    $('#allItemsFilterBySubcategory').off('change');
    $('#allItemsFilterBySubcategory').change(function(){
        changeItemCategoryTab(type, data);
    });

    for(const [itemID, itemDataStruct] of data.ItemMap.entries()){

        let willDisplay = false;

        if(type == 'itemTabAll') {
            willDisplay = (allItemSearchInput != null);
        } else if(type == 'itemTabGeneral') {
            let magical = itemDataStruct.TagArray.find(tag => {
                // Hardcoded - Magical Trait ID 41;
                // Primal Trait ID 304; Occult Trait ID 500; Divine Trait ID 265; Arcane Trait ID 2;
                return tag.Tag.id === 41 || tag.Tag.id === 304 || tag.Tag.id === 500 || tag.Tag.id === 265 || tag.Tag.id === 2;
            });
            let alchemical = itemDataStruct.TagArray.find(tag => {
                return tag.Tag.id === 399; // Hardcoded - Alchemical Trait ID 399
            });
            willDisplay = (magical == null && alchemical == null && itemDataStruct.Item.itemType != 'CURRENCY');
        } else if(type == 'itemTabMagical') {
            let magical = itemDataStruct.TagArray.find(tag => {
                // Hardcoded - Magical Trait ID 41;
                // Primal Trait ID 304; Occult Trait ID 500; Divine Trait ID 265; Arcane Trait ID 2;
                return tag.Tag.id === 41 || tag.Tag.id === 304 || tag.Tag.id === 500 || tag.Tag.id === 265 || tag.Tag.id === 2;
            });
            willDisplay = (magical != null);
        } else if(type == 'itemTabAlchemical') {
            let alchemical = itemDataStruct.TagArray.find(tag => {
                return tag.Tag.id === 399; // Hardcoded - Alchemical Trait ID 399
            });
            willDisplay = (alchemical != null);
        } else if(type == 'itemTabCurrency') {
            if(itemDataStruct.Item.itemType == 'CURRENCY') {
                willDisplay = true;
            }
        }
        
        if(allItemSearchInput != null){
            $('#allItemsFilterBySubcategory').parent().removeClass('is-info');
            
            let itemName = itemDataStruct.Item.name.toUpperCase();
            if(!itemName.includes(allItemSearchInput)){
                willDisplay = false;
            }

        } else {
            $('#allItemsFilterBySubcategory').parent().addClass('is-info');

            if(allItemsFilterBySubcategoryValue == 'ALL'){
                $('#allItemsFilterBySubcategory').parent().removeClass('is-info');
                if(type != 'itemTabCurrency'){
                    willDisplay = false;
                }
            } else if(allItemsFilterBySubcategoryValue == 'OTHER'){
                let foundItemType = false;
                if(itemDataStruct.Item.itemType != 'OTHER') {
                    $("#allItemsFilterBySubcategory option").each(function() {
                        if(itemDataStruct.Item.itemType === $(this).val()){
                            foundItemType = true;
                        }
                    });
                }
                if(foundItemType){
                    willDisplay = false;
                }
            } else {
                if(itemDataStruct.Item.itemType !== allItemsFilterBySubcategoryValue){
                    willDisplay = false;
                }
            }

        }

        if(willDisplay){
            displayAddItem(itemID, itemDataStruct, data);
        }

    }

    $('.itemEntryPart').click(function(){

        let itemID = $(this).parent().attr('data-item-id');
        let itemDataStruct = data.ItemMap.get(itemID+"");

        let addItemChevronItemID = 'addItemChevronItemID'+itemID;
        let addItemNameID = 'addItemName'+itemID;
        let addItemDetailsItemID = 'addItemDetailsItem'+itemID;
        if($('#'+addItemDetailsItemID).html() != ''){
            $('#'+addItemChevronItemID).removeClass('fa-chevron-up');
            $('#'+addItemChevronItemID).addClass('fa-chevron-down');
            $('#'+addItemNameID).removeClass('has-text-white-ter');
            $(this).parent().removeClass('has-background-black-like-more');
            displayItemDetails(null, addItemDetailsItemID);
        } else {
            $('#'+addItemChevronItemID).removeClass('fa-chevron-down');
            $('#'+addItemChevronItemID).addClass('fa-chevron-up');
            $('#'+addItemNameID).addClass('has-text-white-ter');
            $(this).parent().addClass('has-background-black-like-more');
            displayItemDetails(itemDataStruct, addItemDetailsItemID);
        }

    });

}

function displayAddItem(itemID, itemDataStruct, data){

    if(itemDataStruct.Item.hidden == 1 || itemDataStruct.Item.isArchived == 1){
        return;
    }

    let addItemAddItemID = 'addItemAddItem'+itemID;
    let addItemChevronItemID = 'addItemChevronItemID'+itemID;
    let addItemNameID = 'addItemName'+itemID;
    let addItemDetailsItemID = 'addItemDetailsItem'+itemID;
    
    let itemLevel = (itemDataStruct.Item.level == 0 || itemDataStruct.Item.level == 999) ? "" : "Lvl "+itemDataStruct.Item.level;

    let itemName = itemDataStruct.Item.name;
    if(itemDataStruct.Item.quantity > 1){
        itemName += ' ('+itemDataStruct.Item.quantity+')';
    }

    $('#addItemListSection').append('<div class="tile is-parent is-paddingless border-bottom border-additems has-background-black-like cursor-clickable" data-item-id="'+itemID+'"><div class="tile is-child is-7 itemEntryPart"><p id="'+addItemNameID+'" class="has-text-left mt-1 pl-3 has-text-grey-lighter">'+itemName+'</p></div><div class="tile is-child is-2 itemEntryPart"><p class="has-text-centered is-size-7 mt-2">'+itemLevel+'</p></div><div class="tile is-child"><button id="'+addItemAddItemID+'" class="button my-1 is-small is-success is-outlined is-rounded">Add</button></div><div class="tile is-child is-1 itemEntryPart"><span class="icon has-text-grey mt-2"><i id="'+addItemChevronItemID+'" class="fas fa-chevron-down"></i></span></div></div><div id="'+addItemDetailsItemID+'"></div>');


    $('#'+addItemAddItemID).click(function(){
        $(this).addClass('is-loading');
        socket.emit("requestAddItemToInv",
            data.InvID,
            itemID,
            itemDataStruct.Item.quantity);
        $(this).blur();
    });

}

function displayItemDetails(itemDataStruct, addItemDetailsItemID){

    if(itemDataStruct == null){
        $('#'+addItemDetailsItemID).html('');
        return;
    }

    $('#'+addItemDetailsItemID).html('<div class="tile is-parent is-vertical is-paddingless border-bottom border-additems p-2 text-center"></div>');
    let itemDetails = $('#'+addItemDetailsItemID+' > div');

    let rarity = itemDataStruct.Item.rarity;
    let tagsInnerHTML = '';
    switch(rarity) {
      case 'UNCOMMON': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-uncommon">Uncommon</button>';
        break;
      case 'RARE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-rare">Rare</button>';
        break;
      case 'UNIQUE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-unique">Unique</button>';
        break;
      default: break;
    }

    let itemSize = itemDataStruct.Item.size;
    switch(itemSize) {
        case 'TINY': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="An item of Tiny size has the same Price but half the Bulk of a Medium-sized version of the same item (half of a 1 Bulk item is treated as light Bulk for this conversion).">Tiny</button>';
            break;
        case 'SMALL': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="An item of Small size has the same Price and Bulk as the Medium-sized version, the item is simply a bit smaller for tinier folk.">Small</button>';
            break;
        case 'LARGE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="An item of Large size has 2 times the Price and Bulk of a Medium-sized version of the same item.">Large</button>';
            break;
        case 'HUGE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="An item of Huge size has 4 times the Price and Bulk of a Medium-sized version of the same item.">Huge</button>';
            break;
        case 'GARGANTUAN': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="An item of Gargantuan size has 8 times the Price and Bulk of a Medium-sized version of the same item.">Gargantuan</button>';
            break;
        default: break;
    }

    for(const tagStruct of itemDataStruct.TagArray){
        let tagDescription = tagStruct.Tag.description;
        if(tagDescription.length > g_tagStringLengthMax){
            tagDescription = tagDescription.substring(0, g_tagStringLengthMax);
            tagDescription += '...';
        }
        tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-info has-tooltip-bottom has-tooltip-multiline tagButton" data-tooltip="'+tagDescription+'">'+tagStruct.Tag.name+'</button>';
    }

    if(tagsInnerHTML != ''){
        itemDetails.append('<div class="buttons is-marginless is-centered">'+tagsInnerHTML+'</div>');
        itemDetails.append('<hr class="mb-2 mt-1">');
    }

    $('.tagButton').click(function(){
        let tagName = $(this).text();
        openQuickView('tagView', {
            TagName : tagName,
            _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
        }, $('#quickviewDefault').hasClass('is-active'));
    });

    if(itemDataStruct.WeaponData != null){

        let weapGroup = null;
        if(itemDataStruct.WeaponData.isRanged == 1){
            weapGroup = capitalizeWord(itemDataStruct.WeaponData.rangedWeaponType);
        }
        if(itemDataStruct.WeaponData.isMelee == 1){
            weapGroup = capitalizeWord(itemDataStruct.WeaponData.meleeWeaponType);
        }

        let weapCategory = capitalizeWord(itemDataStruct.WeaponData.category);
        itemDetails.append('<div class="tile"><div class="tile is-child is-6"><p><strong>Category:</strong> '+weapCategory+'</p></div><div class="tile is-child is-6"><p><strong>Group:</strong> '+weapGroup+'</p></div></div>');

        itemDetails.append('<hr class="m-2">');

    }

    if(itemDataStruct.ArmorData != null){

        let armorCategory = capitalizeWord(itemDataStruct.ArmorData.category);
        let armorGroup = (itemDataStruct.ArmorData.armorType == 'N/A') ? '-' : capitalizeWord(itemDataStruct.ArmorData.armorType);
        itemDetails.append('<div class="tile"><div class="tile is-child is-6"><p><strong>Category:</strong> '+armorCategory+'</p></div><div class="tile is-child is-6"><p><strong>Group:</strong> '+armorGroup+'</p></div></div>');

        itemDetails.append('<hr class="m-2">');

    }


    let price = getConvertedPriceForSize(itemDataStruct.Item.size, itemDataStruct.Item.price);
    price = getCoinToString(price);
    if(itemDataStruct.Item.quantity > 1){
        price += ' for '+itemDataStruct.Item.quantity;
    }

    let bulk = getConvertedBulkForSize(itemDataStruct.Item.size, itemDataStruct.Item.bulk);
    bulk = getBulkFromNumber(bulk);

    itemDetails.append('<div class="tile"><div class="tile is-child is-4"><strong>Price</strong></div><div class="tile is-child is-4"><strong>Bulk</strong></div><div class="tile is-child is-4"><strong>Hands</strong></div></div>');
    itemDetails.append('<div class="tile"><div class="tile is-child is-4"><p>'+price+'</p></div><div class="tile is-child is-4"><p>'+bulk+'</p></div><div class="tile is-child is-4"><p>'+getHandsToString(itemDataStruct.Item.hands)+'</p></div></div>');
    
    if(itemDataStruct.Item.usage != null){
        itemDetails.append('<hr class="m-2">');
        itemDetails.append('<p class="is-size-6 has-text-left px-3 negative-indent"><strong>Usage:</strong> '+itemDataStruct.Item.usage+'</p>');
    }

    itemDetails.append('<hr class="m-2">');

        
    if(itemDataStruct.WeaponData != null){

        let consumableTag = itemDataStruct.TagArray.find(tag => {
            return tag.Tag.id == 402; // Hardcoded Consumable Tag ID
        });

        if(itemDataStruct.WeaponData.isMelee == 1){

            let damage = itemDataStruct.WeaponData.diceNum+""+itemDataStruct.WeaponData.dieType+" "+itemDataStruct.WeaponData.damageType;
            damage = (consumableTag != null) ? 'See Text' : damage;

            itemDetails.append('<div class="tile"><div class="tile is-child"><strong>Damage</strong></div></div>');
            itemDetails.append('<div class="tile"><div class="tile is-child"><p>'+damage+'</p></div></div>');

            itemDetails.append('<hr class="m-2">');

        }

        if(itemDataStruct.WeaponData.isRanged == 1){

            let damage = itemDataStruct.WeaponData.diceNum+""+itemDataStruct.WeaponData.dieType+" "+itemDataStruct.WeaponData.damageType;
            damage = (consumableTag != null) ? 'See Text' : damage;

            itemDetails.append('<div class="tile"><div class="tile is-child"><strong>Damage</strong></div></div>');
            itemDetails.append('<div class="tile"><div class="tile is-child"><p>'+damage+'</p></div></div>');

            itemDetails.append('<hr class="m-2">');

            let reload = itemDataStruct.WeaponData.rangedReload;
            if(reload == 0){ reload = '-'; }
            let range = itemDataStruct.WeaponData.rangedRange+" ft";
            itemDetails.append('<div class="tile"><div class="tile is-child is-6"><strong>Range</strong></div><div class="tile is-child is-6"><strong>Reload</strong></div></div>');
            itemDetails.append('<div class="tile"><div class="tile is-child is-6"><p>'+range+'</p></div><div class="tile is-child is-6"><p>'+reload+'</p></div></div>');

            itemDetails.append('<hr class="m-2">');

        }

    }

    if(itemDataStruct.ArmorData != null){
        
        itemDetails.append('<div class="tile"><div class="tile is-child is-6"><strong>AC Bonus</strong></div><div class="tile is-child is-6"><strong>Dex Cap</strong></div></div>');
        itemDetails.append('<div class="tile"><div class="tile is-child is-6"><p>'+signNumber(itemDataStruct.ArmorData.acBonus)+'</p></div><div class="tile is-child is-6"><p>'+signNumber(itemDataStruct.ArmorData.dexCap)+'</p></div></div>');

        itemDetails.append('<hr class="m-2">');

        let minStrength = (itemDataStruct.ArmorData.minStrength == 0) ? '-' : itemDataStruct.ArmorData.minStrength+'';
        let checkPenalty = (itemDataStruct.ArmorData.checkPenalty == 0) ? '-' : itemDataStruct.ArmorData.checkPenalty+'';
        let speedPenalty = (itemDataStruct.ArmorData.speedPenalty == 0) ? '-' : itemDataStruct.ArmorData.speedPenalty+' ft';
        itemDetails.append('<div class="tile"><div class="tile is-child is-4"><strong>Strength</strong></div><div class="tile is-child is-4"><strong>Check Penalty</strong></div><div class="tile is-child is-4"><strong>Speed Penalty</strong></div></div>');
        itemDetails.append('<div class="tile"><div class="tile is-child is-4"><p>'+minStrength+'</p></div><div class="tile is-child is-4"><p>'+checkPenalty+'</p></div><div class="tile is-child is-4"><p>'+speedPenalty+'</p></div></div>');

        itemDetails.append('<hr class="m-2">');

    }

    if(itemDataStruct.ShieldData != null){

        let speedPenalty = (itemDataStruct.ShieldData.speedPenalty == 0) ? '-' : itemDataStruct.ShieldData.speedPenalty+' ft';
        itemDetails.append('<div class="tile"><div class="tile is-child is-6"><strong>AC Bonus</strong></div><div class="tile is-child is-6"><strong>Speed Penalty</strong></div></div>');
        itemDetails.append('<div class="tile"><div class="tile is-child is-6"><p>'+signNumber(itemDataStruct.ShieldData.acBonus)+'</p></div><div class="tile is-child is-6"><p>'+speedPenalty+'</p></div></div>');

        itemDetails.append('<hr class="m-2">');

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

        itemDetails.append('<div class="tile"><div class="tile is-child is-6"><strong>Bulk Storage</strong></div><div class="tile is-child is-6"><strong>Bulk Ignored</strong></div></div>');
        itemDetails.append('<div class="tile"><div class="tile is-child is-6"><p>'+maxBagBulk+'</p></div><div class="tile is-child is-6"><p>'+bulkIgnoredMessage+'</p></div></div>');

        itemDetails.append('<hr class="m-2">');
    }

    itemDetails.append(processText(itemDataStruct.Item.description, true, true, 'MEDIUM'));

}