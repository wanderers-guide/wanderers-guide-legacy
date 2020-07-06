
$(function () {

    socket.emit("requestAdminItemDetails");

});

socket.on("returnAdminItemDetails", function(itemObject){

    let itemMap = objToMap(itemObject);
    let item = itemMap.get(getItemEditorIDFromURL()+"");

    if(item == null){
        window.location.href = '/admin/manage/item';
        return;
    }

    $("#inputBuilderType").val(item.Item.itemStructType);
    $("#inputName").val(item.Item.name);
    $("#inputVersion").val(item.Item.version);
    $("#inputPrice").val(item.Item.price);
    $("#inputLevel").val(item.Item.level);
    $("#inputRarity").val(item.Item.rarity);
    $("#inputUsage").val(item.Item.usage);
    $("#inputDesc").val(item.Item.description);
    $("#inputCraftReq").val(item.Item.craftRequirements);
    $("#inputCode").val(item.Item.code);

    $("#inputContentSource").val(item.Item.contentSrc);

    $("#inputBulk").val(item.Item.bulk);
    $("#inputSize").val(item.Item.size);
    $("#inputMaterial").val(item.Item.materialType);
    $("#inputHands").val(item.Item.hands);
    let isShoddy = (item.Item.isShoddy == 1) ? true : false;
    $("#inputIsShoddy").prop('checked', isShoddy);
    let hasQuantity = (item.Item.hasQuantity == 1) ? true : false;
    $("#inputHasQuantity").prop('checked', hasQuantity);
    $("#inputQuantity").val(item.Item.quantity);
    $("#inputHitPoints").val(item.Item.hitPoints);
    $("#inputBrokenThreshold").val(item.Item.brokenThreshold);
    $("#inputHardness").val(item.Item.hardness);
    
    if(item.WeaponData != null){
        $("#inputDieType").val(item.WeaponData.dieType);
        $("#inputDamageType").val(item.WeaponData.damageType);
        $("#inputWeaponCategory").val(item.WeaponData.category);
        let isMelee = (item.WeaponData.isMelee == 1) ? true : false;
        $("#inputIsMelee").prop('checked', isMelee);
        $("#inputMeleeWeaponType").val(item.WeaponData.meleeWeaponType);
        let isRanged = (item.WeaponData.isRanged == 1) ? true : false;
        $("#inputIsRanged").prop('checked', isRanged);
        $("#inputRangedWeaponType").val(item.WeaponData.rangedWeaponType);
        $("#inputRange").val(item.WeaponData.rangedRange);
        $("#inputReload").val(item.WeaponData.rangedReload);
    }

    if(item.ArmorData != null){
        $("#inputArmorACBonus").val(item.ArmorData.acBonus);
        $("#inputArmorDexCap").val(item.ArmorData.dexCap);
        $("#inputArmorType").val(item.ArmorData.armorType);
        $("#inputArmorCategory").val(item.ArmorData.category);
        $("#inputArmorCheckPenalty").val(item.ArmorData.checkPenalty);
        $("#inputArmorSpeedPenalty").val(item.ArmorData.speedPenalty);
        $("#inputArmorMinStrength").val(item.ArmorData.minStrength);
    }

    if(item.ShieldData != null){
        $("#inputShieldACBonus").val(item.ShieldData.acBonus);
        $("#inputShieldSpeedPenalty").val(item.ShieldData.speedPenalty);
    }

    if(item.StorageData != null){
        $("#inputMaxBulkStorage").val(item.StorageData.maxBulkStorage);
        $("#inputBulkIgnored").val(item.StorageData.bulkIgnored);
        let ignoreSelfBulkIfWearing = (item.StorageData.ignoreSelfBulkIfWearing == 1) ? true : false;
        $("#inputIgnoreSelfBulkIfWearing").prop('checked', ignoreSelfBulkIfWearing);
    }

    if(item.RuneData != null){
        let runeType = (item.RuneData.isFundamental == 1) ? 'FUNDAMENTAL' : 'POTENCY';
        $("#inputRuneType").val(runeType);
        $("#inputEtchedType").val(item.RuneData.etchedType);

        // Remove these to prevent a continued stacking
        let itemName = item.Item.name.replace(' Runestone','');
        let itemPrice = item.Item.price - 300;
        $("#inputName").val(itemName);
        $("#inputPrice").val(itemPrice);
    }
    
    for(let tag of item.TagArray){
        $("#inputTags").find('option[value='+tag.Tag.id+']').attr('selected','selected');
    }
    $("#inputTags").trigger("change");
    $("#inputBuilderType").trigger("change");
    $("#inputCategory").val(item.Item.itemType);

    $("#updateButton").click(function(){
        $(this).unbind();
        finishItem(true);
    });

});