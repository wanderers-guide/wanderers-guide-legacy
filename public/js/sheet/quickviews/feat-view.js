/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openFeatQuickview(data) {
    addBackFunctionality(data);

    let featNameInnerHTML = '<span>'+data.Feat.name+'</span>';
    switch(data.Feat.actions) {
        case 'FREE_ACTION': featNameInnerHTML += '<span class="px-2 pf-icon">[free-action]</span>'; break;
        case 'REACTION': featNameInnerHTML += '<span class="px-2 pf-icon">[reaction]</span>'; break;
        case 'ACTION': featNameInnerHTML += '<span class="px-2 pf-icon">[one-action]</span>'; break;
        case 'TWO_ACTIONS': featNameInnerHTML += '<span class="px-2 pf-icon">[two-actions]</span>'; break;
        case 'THREE_ACTIONS': featNameInnerHTML += '<span class="px-2 pf-icon">[three-actions]</span>'; break;
        default: break;
    }

    if(data.Feat.isArchived === 1){
        featNameInnerHTML += '<em class="pl-1">(archived)</em>';
    }

    $('#quickViewTitle').html(featNameInnerHTML);
    if(data.Feat.level > 0){
        $('#quickViewTitleRight').html('<span class="pr-2">Level '+data.Feat.level+'</span>');
    }
    let qContent = $('#quickViewContent');

    let featTagsInnerHTML = '<div class="columns is-centered is-marginless"><div class="column is-9 is-paddingless"><div class="buttons is-marginless is-centered">';
    switch(data.Feat.rarity) {
    case 'UNCOMMON': featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-uncommon">Uncommon</button>';
        break;
    case 'RARE': featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-rare">Rare</button>';
        break;
    case 'UNIQUE': featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-unique">Unique</button>';
        break;
    default: break;
    }
    if(data.Feat.skillID != null){
        let skill = null;
        for(const [skillName, skillData] of g_skillMap.entries()){
            if(skillData.Skill.id == data.Feat.skillID) {
                skill = skillData.Skill;
                break;
            }
        }
        featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="An action with this trait is categorized under the '+skill.name+' skill. It usually requires a certain proficiency in the skill to perform.">'+skill.name+'</button>';
    }

    data.Tags = data.Tags.sort(
        function(a, b) {
            return a.name > b.name ? 1 : -1;
        }
    );
    for(const tag of data.Tags){
        if(data.Feat.level == -1 && tag.name == 'General'){ continue; }
        let tagDescription = tag.description;
        if(tagDescription.length > g_tagStringLengthMax){
            tagDescription = tagDescription.substring(0, g_tagStringLengthMax);
            tagDescription += '...';
        }
        featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-info has-tooltip-bottom has-tooltip-multiline tagButton" data-tooltip="'+tagDescription+'">'+tag.name+'</button>';
    }
    featTagsInnerHTML += '</div></div></div>';

    qContent.append(featTagsInnerHTML);

    $('.tagButton').click(function(){
        let tagName = $(this).text();
        openQuickView('tagView', {
            TagName : tagName,
            _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
        });
    });

    let featContentInnerHTML = '';
    let foundUpperFeatLine = false;
    if(data.Feat.prerequisites != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Prerequisites: </strong></span><span>'+data.Feat.prerequisites+'</span></p></div>';
        foundUpperFeatLine = true;
    }
    if(data.Feat.frequency != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Frequency: </strong></span><span>'+data.Feat.frequency+'</span></p></div>';
        foundUpperFeatLine = true;
    }
    if(data.Feat.cost != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Cost: </strong></span><span>'+data.Feat.cost+'</span></p></div>';
        foundUpperFeatLine = true;
    }
    if(data.Feat.trigger != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Trigger: </strong></span><span>'+data.Feat.trigger+'</span></p></div>';
        foundUpperFeatLine = true;
    }
    if(data.Feat.requirements != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Requirements: </strong></span><span>'+data.Feat.requirements+'</span></p></div>';
        foundUpperFeatLine = true;
    }

    if(foundUpperFeatLine){
        featContentInnerHTML += '<hr class="m-1">';
    }

    let description = featViewTextProcessor(data.Feat.description);
    featContentInnerHTML += '<div>'+processText(description, true, true, 'MEDIUM')+'</div>';

    if(data.Feat.special != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Special: </strong></span><span>'+data.Feat.special+'</span></p></div>';
    }

    qContent.append(featContentInnerHTML);

    // Notes Field
    if(data.SrcStruct != null){
        displayNotesField(qContent, data.SrcStruct);
    }

}

function featViewTextProcessor(text){

    let speedNum = getStatTotal('SPEED');
    speedNum = (speedNum > 5) ? speedNum : 5;

    text = text.replace('for 5 feet plus 5 feet per 20 feet of your land Speed', '<span class="has-text-info">'+(5+5*Math.floor(speedNum/20))+' feet</span>');
    text = text.replace('for 5 feet per 20 feet of your land Speed', '<span class="has-text-info">'+(5*Math.floor(speedNum/20) != 0 ? 5*Math.floor(speedNum/20) : 5)+' feet</span>');

    text = text.replace('10 feet plus 5 feet per 20 feet of your land Speed', '<span class="has-text-info">'+(10+5*Math.floor(speedNum/20))+' feet</span>');
    text = text.replace('5 feet plus 5 feet per 20 feet of your land Speed.', '<span class="has-text-info">'+(5+5*Math.floor(speedNum/20))+' feet</span>');

    return text;
}