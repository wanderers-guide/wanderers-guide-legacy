/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openTagQuickview(data) {
    addBackFunctionality(data);

    $('#quickViewTitle').html('Trait - '+capitalizeFirstLetterOfWord(data.TagName));
    let qContent = $('#quickViewContent');

    let tag = g_allTags.find(tag => {
      return tag.name.toUpperCase() === data.TagName.toUpperCase();
    });

    if(tag != null){

      qContent.append(processText(tag.description, true, true, 'MEDIUM'));

    } else {

      qContent.append('<p class="pl-2 pr-1 negative-indent has-text-left has-text-danger"><em>Unknown trait!</em></p>');

    }

}