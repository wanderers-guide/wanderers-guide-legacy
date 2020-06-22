
function openConditionQuickview(data) {
    addBackFunctionality(data);

    $('#quickViewTitle').html('Condition - '+capitalizeWords(data.Condition.name));
    let qContent = $('#quickViewContent');

    qContent.append(processText(data.Condition.description, true, true, 'MEDIUM', false));

}