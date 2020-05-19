
let socket = io();

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    let builderTypeSelection = $("#inputBuilderType");
    builderTypeSelection.change(function(){
        let builderType = $(this).val();
        if(builderType == "GENERAL"){
            $("#sectionWeapon").addClass('is-hidden');
            $("#sectionWeaponMelee").addClass('is-hidden');
            $("#sectionWeaponRanged").addClass('is-hidden');
            $("#sectionStorage").addClass('is-hidden');
            $("#sectionShield").addClass('is-hidden');
            $("#sectionRunestone").addClass('is-hidden');
            $("#sectionArmor").addClass('is-hidden');
            $("#sectionArmorPenalties").addClass('is-hidden');

            $("#sectionBulk").removeClass('is-hidden');
            $("#sectionSize").removeClass('is-hidden');
            $("#sectionHands").removeClass('is-hidden');
            $("#sectionIsShoddy").removeClass('is-hidden');
            $("#sectionQuantity").removeClass('is-hidden');
            $("#sectionHealth").removeClass('is-hidden');
            $("#inputCategory").val("GENERAL");
        } else if(builderType == "STORAGE"){
            $("#sectionWeapon").addClass('is-hidden');
            $("#sectionWeaponMelee").addClass('is-hidden');
            $("#sectionWeaponRanged").addClass('is-hidden');
            $("#sectionStorage").removeClass('is-hidden');
            $("#sectionShield").addClass('is-hidden');
            $("#sectionRunestone").addClass('is-hidden');
            $("#sectionArmor").addClass('is-hidden');
            $("#sectionArmorPenalties").addClass('is-hidden');

            $("#sectionBulk").removeClass('is-hidden');
            $("#sectionSize").removeClass('is-hidden');
            $("#sectionHands").removeClass('is-hidden');
            $("#sectionIsShoddy").removeClass('is-hidden');
            $("#sectionQuantity").addClass('is-hidden');
            $("#sectionHealth").removeClass('is-hidden');
            $("#inputCategory").val("STORAGE");
        } else if(builderType == "WEAPON"){
            $("#sectionWeapon").removeClass('is-hidden');
            $("#sectionWeaponMelee").removeClass('is-hidden');
            $("#sectionWeaponRanged").removeClass('is-hidden');
            $("#sectionStorage").addClass('is-hidden');
            $("#sectionShield").addClass('is-hidden');
            $("#sectionRunestone").addClass('is-hidden');
            $("#sectionArmor").addClass('is-hidden');
            $("#sectionArmorPenalties").addClass('is-hidden');

            $("#sectionBulk").removeClass('is-hidden');
            $("#sectionSize").removeClass('is-hidden');
            $("#sectionHands").removeClass('is-hidden');
            $("#sectionIsShoddy").removeClass('is-hidden');
            $("#sectionQuantity").removeClass('is-hidden');
            $("#sectionHealth").removeClass('is-hidden');
            $("#inputCategory").val("WEAPON");
        } else if(builderType == "ARMOR"){
            $("#sectionWeapon").addClass('is-hidden');
            $("#sectionWeaponMelee").addClass('is-hidden');
            $("#sectionWeaponRanged").addClass('is-hidden');
            $("#sectionStorage").addClass('is-hidden');
            $("#sectionShield").addClass('is-hidden');
            $("#sectionRunestone").addClass('is-hidden');
            $("#sectionArmor").removeClass('is-hidden');
            $("#sectionArmorPenalties").removeClass('is-hidden');

            $("#sectionBulk").removeClass('is-hidden');
            $("#sectionSize").removeClass('is-hidden');
            $("#sectionHands").addClass('is-hidden');
            $("#sectionIsShoddy").removeClass('is-hidden');
            $("#sectionQuantity").addClass('is-hidden');
            $("#sectionHealth").removeClass('is-hidden');
            $("#inputCategory").val("ARMOR");
        } else if(builderType == "SHIELD"){
            $("#sectionWeapon").addClass('is-hidden');
            $("#sectionWeaponMelee").addClass('is-hidden');
            $("#sectionWeaponRanged").addClass('is-hidden');
            $("#sectionStorage").addClass('is-hidden');
            $("#sectionShield").removeClass('is-hidden');
            $("#sectionRunestone").addClass('is-hidden');
            $("#sectionArmor").addClass('is-hidden');
            $("#sectionArmorPenalties").addClass('is-hidden');

            $("#sectionBulk").removeClass('is-hidden');
            $("#sectionSize").removeClass('is-hidden');
            $("#sectionHands").addClass('is-hidden');
            $("#sectionIsShoddy").removeClass('is-hidden');
            $("#sectionQuantity").addClass('is-hidden');
            $("#sectionHealth").removeClass('is-hidden');
            $("#inputCategory").val("ARMOR");
        } else if(builderType == "RUNE"){
            $("#sectionWeapon").addClass('is-hidden');
            $("#sectionWeaponMelee").addClass('is-hidden');
            $("#sectionWeaponRanged").addClass('is-hidden');
            $("#sectionStorage").addClass('is-hidden');
            $("#sectionShield").addClass('is-hidden');
            $("#sectionRunestone").removeClass('is-hidden');
            $("#sectionArmor").addClass('is-hidden');
            $("#sectionArmorPenalties").addClass('is-hidden');

            $("#sectionBulk").addClass('is-hidden');
            $("#sectionSize").addClass('is-hidden');
            $("#sectionHands").addClass('is-hidden');
            $("#sectionIsShoddy").addClass('is-hidden');
            $("#sectionQuantity").addClass('is-hidden');
            $("#sectionHealth").addClass('is-hidden');
            $("#inputCategory").val("RUNE");
        }
    });
    builderTypeSelection.trigger("change");


    let inputTags = $("#inputTags");
    inputTags.change(function(){
        let tagNames = '- ';
        $(this).find(":selected").each(function(){
            tagNames += $(this).text()+' ';
        });
        $("#selectedTraits").html(tagNames);
        
    });


    $("#createButton").click(function(){
        $(this).unbind();
        finishItem(false);
    });

});

function finishItem(isUpdate){

    let builderType = $("#inputBuilderType").val();
    let itemName = $("#inputName").val();
    let itemVersion = $("#inputVersion").val();
    let itemPrice = $("#inputPrice").val();
    let itemLevel = $("#inputLevel").val();
    let itemCategory = $("#inputCategory").val();
    let itemRarity = $("#inputRarity").val();
    let itemTagsArray = $("#inputTags").val();
    let itemUsage = $("#inputUsage").val();
    let itemDesc = $("#inputDesc").val();
    let itemCraftReq = $("#inputCraftReq").val();
    let itemCode = $("#inputCode").val();

    let itemBulk = null;
    if($("#sectionBulk").is(":visible")) {
        itemBulk = $("#inputBulk").val();
    }
    let itemSize = null;
    if($("#sectionSize").is(":visible")) {
        itemSize = $("#inputSize").val();
    }
    let itemHands = null;
    if($("#sectionHands").is(":visible")) {
        itemHands = $("#inputHands").val();
    }

    let itemIsShoddy = null;
    if($("#sectionIsShoddy").is(":visible")) {
        itemIsShoddy = ($("#inputIsShoddy:checked").val() == '1') ? 1 : 0;
    }
    let itemHasQuantity, itemQuantity = null;
    if($("#sectionQuantity").is(":visible")) {
        itemHasQuantity = ($("#inputHasQuantity:checked").val() == '1') ? 1 : 0;
        itemQuantity = $("#inputQuantity").val();
    }

    let itemHitPoints, itemBrokenThreshold, itemHardness = null;
    if($("#sectionHealth").is(":visible")) {
        itemHitPoints = $("#inputHitPoints").val();
        itemBrokenThreshold = $("#inputBrokenThreshold").val();
        itemHardness = $("#inputHardness").val();
    }

    let itemWeaponData = null;
    if($("#sectionWeapon").is(":visible")) {
        itemWeaponData = {
            dieType: $("#inputDieType").val(),
            damageType: $("#inputDamageType").val(),
            weaponCategory: $("#inputWeaponCategory").val(),
            isMelee: ($("#inputIsMelee:checked").val() == '1') ? 1 : 0,
            meleeWeaponType: $("#inputMeleeWeaponType").val(),
            isRanged: ($("#inputIsRanged:checked").val() == '1') ? 1 : 0,
            rangedWeaponType: $("#inputRangedWeaponType").val(),
            range: $("#inputRange").val(),
            reload: $("#inputReload").val()
        };
    }

    let itemStorageData = null;
    if($("#sectionStorage").is(":visible")) {
        itemStorageData = {
            maxBulkStorage: $("#inputMaxBulkStorage").val(),
            bulkIgnored: $("#inputBulkIgnored").val(),
            ignoreSelfBulkIfWearing: ($("#inputIgnoreSelfBulkIfWearing:checked").val() == '1') ? 1 : 0
        };
    }

    let itemShieldData = null;
    if($("#sectionShield").is(":visible")) {
        itemShieldData = {
            acBonus: $("#inputShieldACBonus").val(),
            speedPenalty: $("#inputShieldSpeedPenalty").val()
        };
    }

    let itemRuneData = null;
    if($("#sectionRunestone").is(":visible")) {
        itemRuneData = {
            runeType: $("#inputRuneType").val(),
            etchedType: $("#inputEtchedType").val()
        };
    }

    let itemArmorData = null;
    if($("#sectionArmor").is(":visible")) {
        itemArmorData = {
            acBonus: $("#inputArmorACBonus").val(),
            dexCap: $("#inputArmorDexCap").val(),
            type: $("#inputArmorType").val(),
            category: $("#inputArmorCategory").val(),
            checkPenalty: $("#inputArmorCheckPenalty").val(),
            speedPenalty: $("#inputArmorSpeedPenalty").val(),
            minStrength: $("#inputArmorMinStrength").val()
        };
    }
    
    let requestPacket = null;
    let itemID = null;
    if(isUpdate){
        requestPacket = "requestAdminUpdateItem";
        itemID = getItemEditorIDFromURL();
    } else {
        requestPacket = "requestAdminAddItem";
    }

    socket.emit(requestPacket,{
        itemID,
        builderType,
        itemName,
        itemVersion,
        itemPrice,
        itemLevel,
        itemCategory,
        itemRarity,
        itemTagsArray,
        itemUsage,
        itemDesc,
        itemCraftReq,
        itemCode,
        itemBulk,
        itemSize,
        itemHands,
        itemIsShoddy,
        itemHasQuantity,
        itemQuantity,
        itemHitPoints,
        itemBrokenThreshold,
        itemHardness,
        itemWeaponData,
        itemArmorData,
        itemShieldData,
        itemStorageData,
        itemRuneData
    });

}

socket.on("returnAdminCompleteItem", function() {
    window.location.href = '/admin/manage/item';
});