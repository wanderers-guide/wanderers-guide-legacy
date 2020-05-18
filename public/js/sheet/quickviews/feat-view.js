
function openFeatQuickview(data) {

    $('#quickViewTitle').html(data.FeatNameHTML);
    let qContent = $('#quickViewContent');

    let featTagsInnerHTML = '<div class="columns is-centered is-marginless"><div class="column is-10 is-paddingless"><div class="buttons is-marginless is-centered">';
    switch(data.Feat.rarity) {
    case 'UNCOMMON': featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-small is-primary">Uncommon</button>';
        break;
    case 'RARE': featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-small is-success">Rare</button>';
        break;
    case 'UNIQUE': featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-small is-danger">Unique</button>';
        break;
    default: break;
    }
    for(const tag of data.Tags){
        featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-small is-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+tag.description+'">'+tag.name+'</button>';
    }
    featTagsInnerHTML += '</div></div></div>';

    qContent.append(featTagsInnerHTML);

    let featContentInnerHTML = '';
    if(data.Feat.prerequisites != null){
        featContentInnerHTML += '<div><span><p><strong>Prerequisites: </strong></span><span>'+data.Feat.prerequisites+'</span></p></div>';
    }
    if(data.Feat.frequency != null){
        featContentInnerHTML += '<div><p><span><strong>Frequency: </strong></span><span>'+data.Feat.frequency+'</span></p></div>';
    }
    if(data.Feat.trigger != null){
        featContentInnerHTML += '<div><p><span><strong>Trigger: </strong></span><span>'+data.Feat.trigger+'</span></p></div>';
    }
    if(data.Feat.requirements != null){
        featContentInnerHTML += '<div><p><span><strong>Requirements: </strong></span><span>'+data.Feat.requirements+'</span></p></div>';
    }
    
    featContentInnerHTML += '<hr class="m-1">';

    featContentInnerHTML += '<div>'+processText(data.Feat.description, true)+'</div>';

    if(data.Feat.special != null){
        featContentInnerHTML += '<div><p><span><strong>Special: </strong></span><span>'+data.Feat.special+'</span></p></div>';
    }

    qContent.append(featContentInnerHTML);

}