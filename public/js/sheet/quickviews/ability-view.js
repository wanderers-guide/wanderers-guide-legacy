
function openAbilityQuickview(data) {
    addBackFunctionality(data);

    $('#quickViewTitle').html(data.Ability.name);
    $('#quickViewTitleRight').html('<span class="pr-2">Level '+data.Ability.level+'</span>');
    let qContent = $('#quickViewContent');

    qContent.append('<div>'+processText(data.Ability.description, true)+'</div>');

}