
function openInvItemQuickview(data) {

    let viewOnly = (data.InvItem.viewOnly != null) ? true : false;

    let invItemName = data.InvItem.name;
    if(data.InvItem.name != data.Item.Item.name){
        invItemName += '<p class="is-inline pl-1 is-size-7 is-italic"> ( '+data.Item.Item.name+' )</p>';
    }
    $('#quickViewTitle').html(invItemName);
    let qContent = $('#quickViewContent');

    let invItemQtyInputID = 'invItemQtyInput'+data.InvItem.id;
    let invItemHPInputID = 'invItemHPInput'+data.InvItem.id;
    
    let invItemMoveSelectID = 'invItemMoveSelect'+data.InvItem.id;
    let invItemMoveButtonID = 'invItemMoveButton'+data.InvItem.id;

    let invItemRemoveButtonID = 'invItemRemoveButton'+data.InvItem.id;
    let invItemCustomizeButtonID = 'invItemCustomizeButton'+data.InvItem.id;

    let isShoddy = (data.InvItem.isShoddy == 1);
    let maxHP = (isShoddy) ? Math.floor(data.InvItem.hitPoints/2) : data.InvItem.hitPoints;
    let brokenThreshold = (isShoddy) ? Math.floor(data.InvItem.brokenThreshold/2) : data.InvItem.brokenThreshold;

    data.InvItem.currentHitPoints = (data.InvItem.currentHitPoints > maxHP) ? maxHP : data.InvItem.currentHitPoints;

    let isBroken = (data.InvItem.currentHitPoints <= brokenThreshold);

    let tagsInnerHTML = '';
    if(isBroken){
        tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-danger has-tooltip-bottom has-tooltip-multiline" data-tooltip="A broken object can’t be used for its normal function, nor does it grant bonuses - with the exception of armor. Broken armor still grants its item bonus to AC, but it also imparts a status penalty to AC depending on its category: -1 for broken light armor, -2 for broken medium armor, or -3 for broken heavy armor. A broken item still imposes penalties and limitations normally incurred by carrying, holding, or wearing it.">Broken</button>';
    }
    if(isShoddy){
        tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-warning has-tooltip-bottom has-tooltip-multiline" data-tooltip="Improvised or of dubious make, shoddy items are never available for purchase except for in the most desperate of communities. When available, a shoddy item usually costs half the Price of a standard item, though you can never sell one in any case. Attacks and checks involving a shoddy item take a –2 item penalty. This penalty also applies to any DCs that a shoddy item applies to (such as AC, for shoddy armor). A shoddy suit of armor also worsens the armor’s check penalty by 2. A shoddy item’s Hit Points and Broken Threshold are each half that of a normal item of its type.">Shoddy</button>';
    }

    let itemSize = data.InvItem.size;
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

    let rarity = data.Item.Item.rarity;
    switch(rarity) {
        case 'UNCOMMON': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-primary">Uncommon</button>';
            break;
        case 'RARE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-success">Rare</button>';
            break;
        case 'UNIQUE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-danger">Unique</button>';
            break;
        default: break;
    }
    for(const tagStruct of data.Item.TagArray){
        tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+tagStruct.Tag.description+'">'+tagStruct.Tag.name+'</button>';
    }

    if(tagsInnerHTML != ''){
        qContent.append('<div class="buttons is-marginless is-centered">'+tagsInnerHTML+'</div>');
        qContent.append('<hr class="mb-2 mt-1">');
    }

    let price = getConvertedPriceForSize(data.InvItem.size, data.InvItem.price);
    price = getCoinToString(price);
    if(data.Item.Item.quantity > 1){
        price += ' for '+data.Item.Item.quantity;
    }

    let bulk = getConvertedBulkForSize(data.InvItem.size, data.InvItem.bulk);
    bulk = getBulkFromNumber(bulk);
    qContent.append('<p class="is-size-6"><strong>Price:</strong> '+price+'</p>');
    qContent.append('<p class="is-size-6"><strong>Bulk:</strong> '+bulk+'</p>');
    if(data.Item.Item.hands != 'NONE'){
        qContent.append('<p class="is-size-6"><strong>Hands:</strong> '+getHandsToString(data.Item.Item.hands)+'</p>');
    }

    qContent.append('<hr class="m-2">');

    if(data.Item.WeaponData != null){

        if(data.Item.WeaponData.isMelee == 1){
            
            let calcStruct = getAttackAndDamage(data.Item, data.InvItem, data.Data.StrMod, data.Data.DexMod);

            qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>Attack Bonus</strong></div><div class="tile is-child is-6"><strong>Damage</strong></div></div>');
            qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p class="pr-1">'+calcStruct.AttackBonus+'</p></div><div class="tile is-child is-6"><p>'+calcStruct.Damage+'</p></div></div>');

            qContent.append('<hr class="m-2">');

        }
        
        if(data.Item.WeaponData.isRanged == 1){
            
            let calcStruct = getAttackAndDamage(data.Item, data.InvItem, data.Data.StrMod, data.Data.DexMod);

            qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>Attack Bonus</strong></div><div class="tile is-child is-6"><strong>Damage</strong></div></div>');
            qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p class="pr-1">'+calcStruct.AttackBonus+'</p></div><div class="tile is-child is-6"><p>'+calcStruct.Damage+'</p></div></div>');

            qContent.append('<hr class="m-2">');

            let reload = data.Item.WeaponData.rangedReload;
            if(reload == 0){ reload = '-'; }
            let range = data.Item.WeaponData.rangedRange+" ft";
            qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>Range</strong></div><div class="tile is-child is-6"><strong>Reload</strong></div></div>');
            qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p>'+range+'</p></div><div class="tile is-child is-6"><p>'+reload+'</p></div></div>');

            qContent.append('<hr class="m-2">');

        }

    }

    if(data.Item.ArmorData != null){
        
        // Apply Shoddy to Armor
        let acBonus = data.Item.ArmorData.acBonus;
        acBonus += (isShoddy) ? -2 : 0;

        let armorCheckPenalty = data.Item.ArmorData.checkPenalty;
        armorCheckPenalty += (isShoddy) ? -2 : 0;
        //

        qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>AC Bonus</strong></div><div class="tile is-child is-6"><strong>Dex Cap</strong></div></div>');
        qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p>'+signNumber(acBonus)+'</p></div><div class="tile is-child is-6"><p>'+signNumber(data.Item.ArmorData.dexCap)+'</p></div></div>');

        qContent.append('<hr class="m-2">');

        let minStrength = (data.Item.ArmorData.minStrength == 0) ? '-' : data.Item.ArmorData.minStrength+'';
        let checkPenalty = (armorCheckPenalty == 0) ? '-' : armorCheckPenalty+'';
        let speedPenalty = (data.Item.ArmorData.speedPenalty == 0) ? '-' : data.Item.ArmorData.speedPenalty+' ft';
        qContent.append('<div class="tile text-center"><div class="tile is-child is-4"><strong>Strength</strong></div><div class="tile is-child is-4"><strong>Check Penalty</strong></div><div class="tile is-child is-4"><strong>Speed Penalty</strong></div></div>');
        qContent.append('<div class="tile text-center"><div class="tile is-child is-4"><p>'+minStrength+'</p></div><div class="tile is-child is-4"><p>'+checkPenalty+'</p></div><div class="tile is-child is-4"><p>'+speedPenalty+'</p></div></div>');

        qContent.append('<hr class="m-2">');

    }

    if(data.Item.ShieldData != null){

        let speedPenalty = (data.Item.ShieldData.speedPenalty == 0) ? '-' : data.Item.ShieldData.speedPenalty+' ft';
        qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>AC Bonus</strong></div><div class="tile is-child is-6"><strong>Speed Penalty</strong></div></div>');
        qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p>'+signNumber(data.Item.ShieldData.acBonus)+'</p></div><div class="tile is-child is-6"><p>'+speedPenalty+'</p></div></div>');

        qContent.append('<hr class="m-2">');

    }

    if(data.Item.StorageData != null){
        
        let maxBagBulk = data.Item.StorageData.maxBulkStorage;
        let bulkIgnored = data.Item.StorageData.bulkIgnored;
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

    qContent.append('<div>'+processText(data.InvItem.description, true, true, 'MEDIUM')+'</div>');

    qContent.append('<hr class="m-2">');

    // Item Quantity
    if(!viewOnly && data.Item.Item.hasQuantity == 1){
        qContent.append('<div class="field has-addons has-addons-centered"><p class="control"><a class="button is-static has-text-grey-lighter has-background-grey-darkest border-darker">Quantity</a></p><p class="control"><input id="'+invItemQtyInputID+'" class="input" type="number" min="1" max="9999999" value="'+data.InvItem.quantity+'"></p></div>');

        $('#'+invItemQtyInputID).blur(function() {
            let newQty = $(this).val();
            if(newQty != data.InvItem.quantity && newQty != ''){
                if(newQty <= 9999999 && newQty >= 1) {
                    $(this).removeClass('is-danger');
                    socket.emit("requestInvItemQtyChange",
                        data.InvItem.id,
                        newQty);
                } else {
                    $(this).addClass('is-danger');
                }
            }
        });
    }

    // Weapon and Armor Category
    if(data.Item.WeaponData != null){

        let weapGroup = null;

        if(data.Item.WeaponData.isMelee == 1){
            if(weapGroup == null){
                weapGroup = capitalizeWord(data.Item.WeaponData.meleeWeaponType);
            }
        }

        if(data.Item.WeaponData.isRanged == 1){
            if(weapGroup == null){
                weapGroup = capitalizeWord(data.Item.WeaponData.rangedWeaponType);
            }
        }

        let weapCategory = capitalizeWord(data.Item.WeaponData.category);
        let weapOrAttack = (weapCategory === 'Unarmed') ? 'Attack' : 'Weapon';

        if(weapGroup != null){
            qContent.append('<div class="tile is-child text-center"><p class="is-size-7"><strong>'+weapCategory+' '+weapOrAttack+' - '+weapGroup+'</strong></p></div>');
        } else {
            qContent.append('<div class="tile is-child text-center"><p class="is-size-7"><strong>'+weapCategory+' '+weapOrAttack+'</strong></p></div>');
        }

        qContent.append('<hr class="m-2">');

    }

    if(data.Item.ArmorData != null){

        let armorTypeAndGroupListing = '';
        let armorCategory = capitalizeWord(data.Item.ArmorData.category);
        if(data.Item.ArmorData.armorType == 'N/A'){
            armorTypeAndGroupListing = (armorCategory == 'Unarmored') ? armorCategory : armorCategory+' Armor';
        } else {
            let armorGroup = capitalizeWord(data.Item.ArmorData.armorType);
            armorTypeAndGroupListing = (armorCategory == 'Unarmored') ? armorCategory+' - '+armorGroup : armorCategory+' Armor - '+armorGroup;
        }
        qContent.append('<div class="tile is-child text-center"><p class="is-size-7"><strong>'+armorTypeAndGroupListing+'</strong></p></div>');

        qContent.append('<hr class="m-2">');

    }

    // Item Runes
    if(!viewOnly){ // In ViewOnly mode you cannot view weapon runes
        if(data.Item.WeaponData != null){

            displayRunesForItem(qContent, data.InvItem, data.RuneDataStruct, true);

            qContent.append('<hr class="m-2">');

        }

        if(data.Item.ArmorData != null){

            displayRunesForItem(qContent, data.InvItem, data.RuneDataStruct, false);

            qContent.append('<hr class="m-2">');

        }
    }

    // Health, Hardness, and Broken Threshold
    if(!viewOnly) {
        qContent.append('<p class="has-text-centered is-size-7"><strong>Health</strong></p>');
        qContent.append('<div class="field has-addons has-addons-centered"><p class="control"><input id="'+invItemHPInputID+'" class="input is-small" type="number" min="0" max="'+maxHP+'" value="'+data.InvItem.currentHitPoints+'"></p><p class="control"><a class="button is-static is-small has-text-grey-light has-background-grey-darkest border-darker">/</a><p class="control"><a class="button is-static is-small has-text-grey-lighter has-background-grey-darklike border-darker">'+maxHP+'</a></p></div>');
        qContent.append('<div class="columns is-centered is-marginless text-center"><div class="column is-5 is-paddingless"><p class="is-size-7"><strong>Hardness:</strong> '+data.InvItem.hardness+'</p></div><div class="column is-7 is-paddingless"><p class="is-size-7"><strong>Broken Threshold:</strong> '+brokenThreshold+'</p></div></div>');

        $('#'+invItemHPInputID).blur(function() {
            let newHP = $(this).val();
            if(newHP != data.InvItem.currentHitPoints && newHP != ''){
                if(newHP <= maxHP && newHP >= 0) {
                    $(this).removeClass('is-danger');
                    socket.emit("requestInvItemHPChange",
                        data.InvItem.id,
                        newHP);
                } else {
                    $(this).addClass('is-danger');
                }
            }
        });
    }

    // Move, Customize, and Remove Item
    if(!viewOnly) {
        qContent.append('<hr class="mt-2 mb-3">');
        if(data.InvData != null){
            if(data.InvData.ItemIsStorage && !data.InvData.ItemIsStorageAndEmpty) {

            } else {

                qContent.append('<div class="field has-addons has-addons-centered"><div class="control"><div class="select is-small is-link"><select id="'+invItemMoveSelectID+'"></select></div></div><div class="control"><button id="'+invItemMoveButtonID+'" type="submit" class="button is-small is-link is-rounded is-outlined">Move</button></div></div>');
        
                $('#'+invItemMoveSelectID).append('<option value="Unstored">Unstored</option>');
                for(const bagInvItem of data.InvData.OpenBagInvItemArray){
                    if(data.InvItem.id != bagInvItem.id) {
                        if(data.InvItem.bagInvItemID == bagInvItem.id){
                            $('#'+invItemMoveSelectID).append('<option value="'+bagInvItem.id+'" selected>'+bagInvItem.name+'</option>');
                        } else {
                            $('#'+invItemMoveSelectID).append('<option value="'+bagInvItem.id+'">'+bagInvItem.name+'</option>');
                        }
                    }
                }
        
                $('#'+invItemMoveButtonID).click(function() {
                    let bagItemID = $('#'+invItemMoveSelectID).val();
                    if(bagItemID == 'Unstored') { bagItemID = null; }
                    $(this).addClass('is-loading');
                    socket.emit("requestInvItemMoveBag",
                        data.InvItem.id,
                        bagItemID,
                        data.InvItem.invID);
                });

            }

            qContent.append('<div class="buttons is-centered is-marginless"><a id="'+invItemCustomizeButtonID+'" class="button is-small is-primary is-rounded is-outlined">Customize</a><a id="'+invItemRemoveButtonID+'" class="button is-small is-danger is-rounded is-outlined">Remove</a></div>');

            $('#'+invItemRemoveButtonID).click(function() {
                $(this).addClass('is-loading');
                socket.emit("requestRemoveItemFromInv",
                    data.InvItem.id);
            });

            $('#'+invItemCustomizeButtonID).click(function() {
                openQuickView('customizeItem', {
                    Item: data.Item,
                    InvItem: data.InvItem
                });
            });
        }

    }

}