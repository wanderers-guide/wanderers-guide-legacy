
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

    qContent.append('<div class="tabs is-small is-centered is-marginless mb-1"><ul class="category-tabs"><li><a id="itemTabAll">All</a></li><li><a id="itemTabGeneral">General</a></li><li><a id="itemTabCombat">Combat</a></li><li><a id="itemTabStorage">Storage</a></li><li><a id="itemTabCurrency">Currency</a></li></ul></div>');

    qContent.append('<div class="columns is-mobile is-marginless mb-3"><div class="column is-9 pr-1"><p class="control has-icons-left"><input id="allItemSearch" class="input" type="text" placeholder="Search Items in Category"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div><div class="column mt-1"><div class="select is-small is-info"><select id="allItemsFilterByLevel"><option value="0">Basic</option><option value="1">Lvl 1</option><option value="2">Lvl 2</option><option value="3">Lvl 3</option><option value="4">Lvl 4</option><option value="5">Lvl 5</option><option value="6">Lvl 6</option><option value="7">Lvl 7</option><option value="8">Lvl 8</option><option value="9">Lvl 9</option><option value="10">Lvl 10</option><option value="11">Lvl 11</option><option value="12">Lvl 12</option><option value="13">Lvl 13</option><option value="14">Lvl 14</option><option value="15">Lvl 15</option><option value="16">Lvl 16</option><option value="17">Lvl 17</option><option value="18">Lvl 18</option><option value="19">Lvl 19</option><option value="20">Lvl 20</option><option value="21">Lvl 21</option><option value="22">Lvl 22</option><option value="23">Lvl 23</option><option value="24">Lvl 24</option><option value="25">Lvl 25</option></select></div></div></div>');

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
    $('#'+type).parent().addClass("is-active");

    let allItemSearch = $('#allItemSearch');
    let allItemSearchInput = null;
    if(allItemSearch.val() != ''){
        allItemSearchInput = allItemSearch.val().toLowerCase();
        allItemSearch.addClass('is-info');
    } else {
        allItemSearch.removeClass('is-info');
        allItemSearch.blur();
    }

    let allItemsFilterByLevelValue = $('#allItemsFilterByLevel').val();

    $('#allItemSearch').off('change');
    $('#allItemSearch').change(function(){
        changeItemCategoryTab(type, data);
    });

    $('#allItemsFilterByLevel').off('change');
    $('#allItemsFilterByLevel').change(function(){
        changeItemCategoryTab(type, data);
    });

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
            $('#allItemsFilterByLevel').parent().removeClass('is-info');

            let itemName = itemDataStruct.Item.name.toLowerCase();
            if(!itemName.includes(allItemSearchInput)){
                willDisplay = false;
            }
        } else {
            $('#allItemsFilterByLevel').parent().addClass('is-info');

            if(itemDataStruct.Item.level != allItemsFilterByLevelValue){
                willDisplay = false;
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
            $('#'+addItemNameID).removeClass('has-text-weight-bold');
            displayItemDetails(null, addItemDetailsItemID);
        } else {
            $('#'+addItemChevronItemID).removeClass('fa-chevron-down');
            $('#'+addItemChevronItemID).addClass('fa-chevron-up');
            $('#'+addItemNameID).addClass('has-text-weight-bold');
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

    let itemLevel = (itemDataStruct.Item.level == 0) ? "" : "Lvl "+itemDataStruct.Item.level;

    let itemName = itemDataStruct.Item.name;
    if(itemDataStruct.Item.quantity > 1){
        itemName += ' ('+itemDataStruct.Item.quantity+')';
    }

    $('#addItemListSection').append('<div class="tile is-parent is-paddingless border-bottom border-additems has-background-black-like cursor-clickable" data-item-id="'+itemID+'"><div class="tile is-child is-7 itemEntryPart"><p id="'+addItemNameID+'" class="has-text-left mt-1 pl-3 has-text-grey-lighter">'+itemName+'</p></div><div class="tile is-child is-2"><p class="has-text-centered is-size-7 mt-2">'+itemLevel+'</p></div><div class="tile is-child"><button id="'+addItemAddItemID+'" class="button my-1 is-small is-success is-outlined is-rounded">Add</button></div><div class="tile is-child is-1 itemEntryPart"><span class="icon has-text-grey mt-2"><i id="'+addItemChevronItemID+'" class="fas fa-chevron-down"></i></span></div></div><div id="'+addItemDetailsItemID+'"></div>');


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
      case 'UNCOMMON': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-primary">Uncommon</button>';
        break;
      case 'RARE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-success">Rare</button>';
        break;
      case 'UNIQUE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-danger">Unique</button>';
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
        let tagArray = itemDataStruct.TagArray;
        openQuickView('tagView', {
            TagName : tagName,
            TagArray : tagArray,
            _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
        });
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


    let price = getCoinToString(itemDataStruct.Item.price);
    if(itemDataStruct.Item.quantity > 1){
        price += ' for '+itemDataStruct.Item.quantity;
    }
    itemDetails.append('<div class="tile"><div class="tile is-child is-4"><strong>Price</strong></div><div class="tile is-child is-4"><strong>Bulk</strong></div><div class="tile is-child is-4"><strong>Hands</strong></div></div>');
    itemDetails.append('<div class="tile"><div class="tile is-child is-4"><p>'+price+'</p></div><div class="tile is-child is-4"><p>'+getBulkFromNumber(itemDataStruct.Item.bulk)+'</p></div><div class="tile is-child is-4"><p>'+getHandsToString(itemDataStruct.Item.hands)+'</p></div></div>');
    
    itemDetails.append('<hr class="m-2">');

        
    if(itemDataStruct.WeaponData != null){

        if(itemDataStruct.WeaponData.isMelee == 1){

            let damage = itemDataStruct.WeaponData.diceNum+""+itemDataStruct.WeaponData.dieType+" "+itemDataStruct.WeaponData.damageType;

            itemDetails.append('<div class="tile"><div class="tile is-child"><strong>Damage</strong></div></div>');
            itemDetails.append('<div class="tile"><div class="tile is-child"><p>'+damage+'</p></div></div>');

            itemDetails.append('<hr class="m-2">');

        }

        if(itemDataStruct.WeaponData.isRanged == 1){

            let damage = itemDataStruct.WeaponData.diceNum+""+itemDataStruct.WeaponData.dieType+" "+itemDataStruct.WeaponData.damageType;

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