
function openCustomizeItemQuickview(data) {

    $('#quickViewTitle').html("Customize Item");
    let qContent = $('#quickViewContent');

    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Name</label></div><div class="field-body"><div class="field"><div class="control"><input id="customizeItemName" class="input" type="text" maxlength="32" value="'+data.InvItem.name+'"></div></div></div></div>');
    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Price (cp)</label></div><div class="field-body"><div class="field"><div class="control"><input id="customizeItemPrice" class="input" type="number" min="0" max="99999999" value="'+data.InvItem.price+'"></div></div></div></div>');
    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Bulk</label></div><div class="field-body"><div class="field"><div class="control"><input class="input" id="customizeItemBulk" type="number" min="0" max="100" step="0.1" value="'+data.InvItem.bulk+'"></div></div></div></div>');
    qContent.append('<div class="field"><label class="label">Description <a href="/asc_docs/#description_fields" target="_blank"><span class="icon is-small has-text-info has-tooltip-bottom" data-tooltip="ASC Docs"><i class="fas fa-book"></i></span></a></label><div class="control"><textarea id="customizeItemDescription" class="textarea">'+data.InvItem.description+'</textarea></div></div>');
    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Size</label></div><div class="field-body"><div class="field"><div class="control"><div class="select"><select id="customizeItemSize"><option value="TINY">Tiny</option><option value="SMALL">Small</option><option value="MEDIUM">Medium</option><option value="LARGE">Large</option><option value="HUGE">Huge</option><option value="GARGANTUAN">Gargantuan</option></select></div></div></div></div></div>');
    qContent.append('<div class="field is-horizontal"><div class="field-label"><label class="label">Shoddy</label></div><div class="field-body"><div class="field"><div class="control"><label class="checkbox"><input id="customizeItemShoddy" type="checkbox"></label></div></div></div></div>');

    qContent.append('<hr class="m-2 mb-4">');

    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Max HP</label></div><div class="field-body"><div class="field"><div class="control"><input class="input" id="customizeItemHitPoints" type="number" min="1" max="99999" value="'+data.InvItem.hitPoints+'"></div></div></div></div>');
    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">BT</label></div><div class="field-body"><div class="field"><div class="control"><input class="input" id="customizeItemBrokenThreshold" type="number" min="0" max="99999" value="'+data.InvItem.brokenThreshold+'"></div></div></div></div>');
    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Hardness</label></div><div class="field-body"><div class="field"><div class="control"><input class="input" id="customizeItemHardness" type="number" min="0" max="99999" value="'+data.InvItem.hardness+'"></div></div></div></div>');

    qContent.append('<hr class="m-2 mb-4">');

    data.InvItem.code = (data.InvItem.code == null) ? '' : data.InvItem.code;
    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Code <a href="/asc_docs/#code_fields" target="_blank"><span class="icon is-small has-text-info has-tooltip-bottom" data-tooltip="ASC Docs"><i class="fas fa-book"></i></span></a></label></div><div class="field-body"><div class="field"><div class="control"><input id="customizeItemCode" class="input" type="text" maxlength="32" value="'+data.InvItem.code+'"></div></div></div></div>');

    qContent.append('<div class="buttons is-centered pt-2"><button id="customizeItemSaveButton" class="button is-link">Save Changes</button></div>');


    $('#customizeItemSize').val(data.InvItem.size);
    if(data.InvItem.isShoddy == 1){
        $('#customizeItemShoddy').prop('checked', true);
    }


    $('#customizeItemSaveButton').click(function(){

        let name = $('#customizeItemName').val();
        let price = parseInt($('#customizeItemPrice').val());
        let bulk = parseFloat($('#customizeItemBulk').val());
        let description = $('#customizeItemDescription').val();
        let size = $('#customizeItemSize').val();
        let isShoddy = ($('#customizeItemShoddy').prop('checked') == true) ? 1 : 0;
        let hitPoints = parseInt($('#customizeItemHitPoints').val());
        let brokenThreshold = parseInt($('#customizeItemBrokenThreshold').val());
        let hardness = parseInt($('#customizeItemHardness').val());
        let code = $('#customizeItemCode').val();

        let isValid = true;

        if(name == null || name == ''){
            $('#customizeItemName').addClass('is-danger');
            isValid = false;
        } else {
            $('#customizeItemName').removeClass('is-danger');
        }

        if(price == null || price > 99999999 || price < 0 || price % 1 != 0) {
            $('#customizeItemPrice').addClass('is-danger');
            isValid = false;
        } else {
            $('#customizeItemPrice').removeClass('is-danger');
        }

        if(bulk == null || bulk > 99 || bulk < 0) {
            $('#customizeItemBulk').addClass('is-danger');
            isValid = false;
        } else {
            $('#customizeItemBulk').removeClass('is-danger');
        }

        if(description == '') {
            description = '__No Description__';
        }

        if(hitPoints == null || hitPoints > 99999 || hitPoints < 1 || hitPoints % 1 != 0) {
            $('#customizeItemHitPoints').addClass('is-danger');
            isValid = false;
        } else {
            $('#customizeItemHitPoints').removeClass('is-danger');
        }

        if(brokenThreshold == null|| brokenThreshold > hitPoints || brokenThreshold < 0 || brokenThreshold % 1 != 0) {
            $('#customizeItemBrokenThreshold').addClass('is-danger');
            isValid = false;
        } else {
            $('#customizeItemBrokenThreshold').removeClass('is-danger');
        }

        if(hardness == null || hardness > 99999 || hardness < 0 || hardness % 1 != 0) {
            $('#customizeItemHardness').addClass('is-danger');
            isValid = false;
        } else {
            $('#customizeItemHardness').removeClass('is-danger');
        }

        if(code == '') {
            code = null;
        }

        if(isValid){
            socket.emit("requestCustomizeInvItem",
                data.InvItem.id,
                {
                    name: name,
                    price: price,
                    bulk: bulk,
                    description: description,
                    size: size,
                    isShoddy: isShoddy,
                    hitPoints: hitPoints,
                    brokenThreshold: brokenThreshold,
                    hardness: hardness,
                    code: code,
                });
        }

    });

}