
function openItemQuickview(data) {
    addBackFunctionality(data);

    let qContent = $('#quickViewContent');

    let itemDataStruct = data.ItemDataStruct;

    let itemName = itemDataStruct.Item.name;
    if(itemDataStruct.Item.quantity > 1){
        itemName += ' ('+itemDataStruct.Item.quantity+')';
    }
    $('#quickViewTitle').html(itemName);
    
    let itemLevel = (itemDataStruct.Item.level == 0 || itemDataStruct.Item.level == 999) ? "" : "Lvl "+itemDataStruct.Item.level;
    $('#quickViewTitleRight').html('<span class="pr-2">'+itemLevel+'</span>');

    let tagsInnerHTML = '';

    let rarity = itemDataStruct.Item.rarity;
    switch(rarity) {
      case 'UNCOMMON': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-primary">Uncommon</button>';
        break;
      case 'RARE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-success">Rare</button>';
        break;
      case 'UNIQUE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-danger">Unique</button>';
        break;
      default: break;
    }

    let itemSize = itemDataStruct.Item.size;
    switch(itemSize) {
        case 'TINY': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link">Tiny</button>';
            break;
        case 'SMALL': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link">Small</button>';
            break;
        case 'LARGE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link">Large</button>'; break;
        case 'HUGE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link">Huge</button>'; break;
        case 'GARGANTUAN': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link">Gargantuan</button>';
            break;
        default: break;
    }

    if(itemDataStruct.Item.materialType != null){
        let itemMaterial = g_materialsMap.get(itemDataStruct.Item.materialType);
        if(itemMaterial != null){
            tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+itemMaterial.Description+'">'+itemMaterial.Name+'</button>';
        }
    }

    itemDataStruct.TagArray = itemDataStruct.TagArray.sort(
        function(a, b) {
            return a.Tag.name > b.Tag.name ? 1 : -1;
        }
    );
    for(const tagStruct of itemDataStruct.TagArray){
        let tagDescription = tagStruct.Tag.description;
        if(tagDescription.length > g_tagStringLengthMax){
            tagDescription = tagDescription.substring(0, g_tagStringLengthMax);
            tagDescription += '...';
        }
        tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-info has-tooltip-bottom has-tooltip-multiline tagButton" data-tooltip="'+tagDescription+'">'+tagStruct.Tag.name+'</button>';
    }

    if(tagsInnerHTML != ''){
        qContent.append('<div class="buttons is-marginless is-centered">'+tagsInnerHTML+'</div>');
        qContent.append('<hr class="mb-2 mt-1">');
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
        qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p><strong>Category:</strong> '+weapCategory+'</p></div><div class="tile is-child is-6"><p><strong>Group:</strong> '+weapGroup+'</p></div></div>');

        qContent.append('<hr class="m-2">');

    }

    if(itemDataStruct.ArmorData != null){

        let armorCategory = capitalizeWord(itemDataStruct.ArmorData.category);
        let armorGroup = (itemDataStruct.ArmorData.armorType == 'N/A') ? '-' : capitalizeWord(itemDataStruct.ArmorData.armorType);
        qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p><strong>Category:</strong> '+armorCategory+'</p></div><div class="tile is-child is-6"><p><strong>Group:</strong> '+armorGroup+'</p></div></div>');

        qContent.append('<hr class="m-2">');

    }

    // Item Specializations
    displayCriticalSpecialization(qContent, itemDataStruct);

    let price = getCoinToString(itemDataStruct.Item.price);
    if(itemDataStruct.Item.quantity > 1){
        price += ' for '+itemDataStruct.Item.quantity;
    }
    qContent.append('<div class="tile text-center"><div class="tile is-child is-4"><strong>Price</strong></div><div class="tile is-child is-4"><strong>Bulk</strong></div><div class="tile is-child is-4"><strong>Hands</strong></div></div>');
    qContent.append('<div class="tile text-center"><div class="tile is-child is-4"><p>'+price+'</p></div><div class="tile is-child is-4"><p>'+getBulkFromNumber(itemDataStruct.Item.bulk)+'</p></div><div class="tile is-child is-4"><p>'+getHandsToString(itemDataStruct.Item.hands)+'</p></div></div>');

    if(itemDataStruct.Item.usage != null){
        qContent.append('<hr class="m-2">');
        qContent.append('<p class="is-size-6 has-text-left px-3 negative-indent"><strong>Usage:</strong> '+itemDataStruct.Item.usage+'</p>');
    }

    qContent.append('<hr class="m-2">');

        
    if(itemDataStruct.WeaponData != null){

        if(itemDataStruct.WeaponData.isMelee == 1){

            let damage = itemDataStruct.WeaponData.diceNum+""+itemDataStruct.WeaponData.dieType+" "+itemDataStruct.WeaponData.damageType;

            qContent.append('<div class="tile text-center"><div class="tile is-child"><strong>Damage</strong></div></div>');
            qContent.append('<div class="tile text-center"><div class="tile is-child"><p>'+damage+'</p></div></div>');

            qContent.append('<hr class="m-2">');

        }

        if(itemDataStruct.WeaponData.isRanged == 1){

            let damage = itemDataStruct.WeaponData.diceNum+""+itemDataStruct.WeaponData.dieType+" "+itemDataStruct.WeaponData.damageType;

            qContent.append('<div class="tile text-center"><div class="tile is-child"><strong>Damage</strong></div></div>');
            qContent.append('<div class="tile text-center"><div class="tile is-child"><p>'+damage+'</p></div></div>');

            qContent.append('<hr class="m-2">');

            let reload = itemDataStruct.WeaponData.rangedReload;
            if(reload == 0){ reload = '-'; }
            let range = itemDataStruct.WeaponData.rangedRange+" ft";
            qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>Range</strong></div><div class="tile is-child is-6"><strong>Reload</strong></div></div>');
            qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p>'+range+'</p></div><div class="tile is-child is-6"><p>'+reload+'</p></div></div>');

            qContent.append('<hr class="m-2">');

        }

    }

    if(itemDataStruct.ArmorData != null){
        
        qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>AC Bonus</strong></div><div class="tile is-child is-6"><strong>Dex Cap</strong></div></div>');
        qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p>'+signNumber(itemDataStruct.ArmorData.acBonus)+'</p></div><div class="tile is-child is-6"><p>'+signNumber(itemDataStruct.ArmorData.dexCap)+'</p></div></div>');

        qContent.append('<hr class="m-2">');

        let minStrength = (itemDataStruct.ArmorData.minStrength == 0) ? '-' : itemDataStruct.ArmorData.minStrength+'';
        let checkPenalty = (itemDataStruct.ArmorData.checkPenalty == 0) ? '-' : itemDataStruct.ArmorData.checkPenalty+'';
        let speedPenalty = (itemDataStruct.ArmorData.speedPenalty == 0) ? '-' : itemDataStruct.ArmorData.speedPenalty+' ft';
        qContent.append('<div class="tile text-center"><div class="tile is-child is-4"><strong>Strength</strong></div><div class="tile is-child is-4"><strong>Check Penalty</strong></div><div class="tile is-child is-4"><strong>Speed Penalty</strong></div></div>');
        qContent.append('<div class="tile text-center"><div class="tile is-child is-4"><p>'+minStrength+'</p></div><div class="tile is-child is-4"><p>'+checkPenalty+'</p></div><div class="tile is-child is-4"><p>'+speedPenalty+'</p></div></div>');

        qContent.append('<hr class="m-2">');

    }

    if(itemDataStruct.ShieldData != null){

        let speedPenalty = (itemDataStruct.ShieldData.speedPenalty == 0) ? '-' : itemDataStruct.ShieldData.speedPenalty+' ft';
        qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>AC Bonus</strong></div><div class="tile is-child is-6"><strong>Speed Penalty</strong></div></div>');
        qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p>'+signNumber(itemDataStruct.ShieldData.acBonus)+'</p></div><div class="tile is-child is-6"><p>'+speedPenalty+'</p></div></div>');

        qContent.append('<hr class="m-2">');

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

        qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>Bulk Storage</strong></div><div class="tile is-child is-6"><strong>Bulk Ignored</strong></div></div>');
        qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p>'+maxBagBulk+'</p></div><div class="tile is-child is-6"><p>'+bulkIgnoredMessage+'</p></div></div>');

        qContent.append('<hr class="m-2">');
    }

    qContent.append('<div class="text-left">'+processText(itemDataStruct.Item.description, true, true, 'MEDIUM')+'</div>');

    if(itemDataStruct.Item.craftRequirements != null){
        qContent.append('<hr class="m-2">');
        qContent.append(processText('~ Craft Requirements: '+itemDataStruct.Item.craftRequirements+'\n', true, true, 'MEDIUM'));
    }

}