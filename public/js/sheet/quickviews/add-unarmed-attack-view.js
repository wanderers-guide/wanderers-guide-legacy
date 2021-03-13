/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openAddUnarmedAttackQuickview(data) {
    addBackFunctionality(data);

    let itemID,itemName,itemDescription,itemDamageType,itemDieType,itemCode,itemMaterialType,itemTagArray;
    if(data.IsCustomize){ // Customize Unarmed Attack
      $('#quickViewTitle').html("Customize Unarmed Attack");

      let itemData = data.InvItem;

      itemID = itemData.id;
      itemName = itemData.name;
      itemDescription = itemData.description;
      itemDamageType = itemData.itemWeaponDamageType;
      itemDieType = itemData.itemWeaponDieType;
      itemCode = itemData.code;
      itemMaterialType = itemData.materialType;
      itemTagArray = itemData.itemTags;
      if(itemTagArray == null) { itemTagArray = data.Item.TagArray; }

    } else { // Add Unarmed Attack
      $('#quickViewTitle').html("Add Unarmed Attack");

      let itemData = g_itemMap.get(data.AddedItemID+"");

      itemID = itemData.Item.id;
      itemName = 'New '+itemData.Item.name;
      itemDescription = itemData.Item.description;
      itemDamageType = itemData.WeaponData.damageType;
      itemDieType = itemData.WeaponData.dieType;
      itemCode = itemData.Item.code;
      itemMaterialType = itemData.Item.materialType;
      itemTagArray = itemData.TagArray;

    }

    let qContent = $('#quickViewContent');

    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Name</label></div><div class="field-body"><div class="field"><div class="control"><input id="customizeItemName" class="input" type="text" maxlength="32" spellcheck="false" autocomplete="off" value="'+itemName+'"></div></div></div></div>');
    qContent.append('<div class="field"><label class="label">Description <a href="/wsc_docs/#description_fields" target="_blank"><span class="icon is-small has-text-info has-tooltip-top" data-tooltip="WSC Docs"><i class="fas fa-book"></i></span></a></label><div class="control"><textarea id="customizeItemDescription" class="textarea use-custom-scrollbar">'+itemDescription+'</textarea></div></div>');

    qContent.append('<hr class="m-2 mb-4">');

    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Dmg Die</label></div><div class="field-body"><div class="field"><div class="control"><div class="select"><select id="customizeWeaponDamageDie"><option value="">1</option><option value="d2">d2</option><option value="d4">d4</option><option value="d6">d6</option><option value="d8">d8</option><option value="d10">d10</option><option value="d12">d12</option><option value="d20">d20</option><option value="NONE">-</option></select></div></div></div></div></div>');
    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Dmg Type</label></div><div class="field-body"><div class="field is-narrow"><div class="control"><input id="customizeWeaponDamageType" class="input" type="text" maxlength="40" spellcheck="false" autocomplete="off" value="'+itemDamageType+'"></div></div></div></div>');

    qContent.append('<hr class="m-2 mb-4">');

    let tagsSelectOptions = '';
    for(let tag of g_allTags){
        if(tag.isHidden == 0 && tag.isArchived == 0){
            tagsSelectOptions += '<option value="'+tag.id+'">'+tag.name+'</option>';
        }
    }
    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Traits</label></div><div class="field-body"><select id="customizeItemTraits" data-placeholder="Select Traits" multiple>'+tagsSelectOptions+'</select></div></div>');

    $("#customizeItemTraits").chosen({width: "100%"});

    qContent.append('<hr class="m-2 mb-4">');

    let materialSelectOptions = '<option value="">N/A</option>';
    for(const [materialCodeName, data] of g_materialsMap.entries()){
        materialSelectOptions += '<option value="'+materialCodeName+'">'+data.Name+'</option>';
    }
    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Material</label></div><div class="field-body"><div class="field"><div class="control"><div class="select"><select id="customizeItemMaterial">'+materialSelectOptions+'</select></div></div></div></div></div>');

    qContent.append('<hr class="m-2 mb-4">');
    
    itemCode = (itemCode == null) ? '' : itemCode;
    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Code <a href="/wsc_docs/#code_fields" target="_blank"><span class="icon is-small has-text-info has-tooltip-top" data-tooltip="WSC Docs"><i class="fas fa-book"></i></span></a></label></div><div class="field-body"><div class="field"><div class="control"><textarea id="customizeItemCode" class="textarea nanum-coding use-custom-scrollbar" rows="1" spellcheck="false" maxlength="990">'+itemCode+'</textarea></div></div></div></div>');

    if(data.IsCustomize){
      qContent.append('<div class="buttons is-centered pt-2"><button id="customizeItemSaveButton" class="button is-link">Save</button></div>');
    } else {
      qContent.append('<div class="buttons is-centered pt-2"><button id="customizeItemSaveButton" class="button is-link">Add</button></div>');
    }


    // Material //
    $('#customizeItemMaterial').val(itemMaterialType);

    // Traits //
    try {
      for(let tagID of JSON.parse(itemTagArray)){
        $("#customizeItemTraits").find('option[value='+tagID+']').attr('selected','selected');
      }
    } catch (err) {
      for(let tag of itemTagArray){
        $("#customizeItemTraits").find('option[value='+tag.Tag.id+']').attr('selected','selected');
      }
    }
    $('#customizeItemTraits').trigger("chosen:updated");

    // Weapon //
    $('#customizeWeaponDamageDie').val(itemDieType);

    $('#customizeItemSaveButton').click(function(){

        let name = $('#customizeItemName').val();
        let description = $('#customizeItemDescription').val();
        let materialType = $('#customizeItemMaterial').val();
        let code = $('#customizeItemCode').val();

        let isValid = true;

        if(name == null || name == ''){
            $('#customizeItemName').addClass('is-danger');
            isValid = false;
        } else {
            $('#customizeItemName').removeClass('is-danger');
        }

        if(description == '') {
            description = '__No Description__';
        }

        if(code == '') {
            code = null;
        }

        // Traits //
        let itemTagsData = JSON.stringify($("#customizeItemTraits").val());
        if(itemTagsData.length > 400){
            itemTagsData = null;
        }

        // Weapon //
        let weaponDieType = null;
        let weaponDamageType = null;
        weaponDieType = $('#customizeWeaponDamageDie').val();
        weaponDamageType = $('#customizeWeaponDamageType').val();

        if(isValid){

          if(data.IsCustomize){

            socket.emit("requestCustomizeInvItem",
                itemID,
                {
                    name: name,
                    price: 0,
                    bulk: 0,
                    description: description,
                    size: 'MEDIUM',
                    isShoddy: 0,
                    materialType: materialType,
                    hitPoints: 0,
                    brokenThreshold: 0,
                    hardness: 0,
                    code: code,
                    itemTagsData: itemTagsData,

                    weaponDieType: weaponDieType,
                    weaponDamageType: weaponDamageType,

                    storageMaxBulk: null,
                }
            );

          } else {

            socket.emit("requestAddItemCustomizeToInv",
                getCharIDFromURL(),
                g_character.inventoryID,
                itemID,
                {
                  name: name,
                  price: 0,
                  bulk: 0,
                  description: description,
                  size: 'MEDIUM',
                  isShoddy: 0,
                  materialType: materialType,
                  hitPoints: 0,
                  brokenThreshold: 0,
                  hardness: 0,
                  code: code,
                  itemTagsData: itemTagsData,

                  weaponDieType: weaponDieType,
                  weaponDamageType: weaponDamageType,

                  storageMaxBulk: null,

                  quantity: 1
                }
            );
            closeQuickView();

          }

        }

    });

}


function isUnarmedAttack(item){
  return (item.WeaponData != null && item.WeaponData.category.toUpperCase() == 'UNARMED');
}
