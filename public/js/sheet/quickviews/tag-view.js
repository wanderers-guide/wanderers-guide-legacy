
function openTagQuickview(data) {
    addBackFunctionality(data);

    $('#quickViewTitle').html('Trait - '+data.TagName);
    let qContent = $('#quickViewContent');

    let tag = data.TagArray.find(tag => {
        if(tag.name != null){
            return tag.name === data.TagName;
        } else {
            return tag.Tag.name === data.TagName;
        }
    });

    if(tag != null){

        let tagDescription;
        if(tag.description != null){
            tagDescription = tag.description;
        } else {
            tagDescription = tag.Tag.description;
        }

        qContent.append(processText(tagDescription, true, true, 'MEDIUM'));

    } else {

        qContent.append('Failed to find trait!');

    }

}