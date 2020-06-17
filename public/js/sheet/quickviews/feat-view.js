
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
    let qContent = $('#quickViewContent');

    let featTagsInnerHTML = '<div class="columns is-centered is-marginless"><div class="column is-9 is-paddingless"><div class="buttons is-marginless is-centered">';
    switch(data.Feat.rarity) {
    case 'UNCOMMON': featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-primary">Uncommon</button>';
        break;
    case 'RARE': featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-success">Rare</button>';
        break;
    case 'UNIQUE': featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-danger">Unique</button>';
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
        featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+tag.description+'">'+tag.name+'</button>';
    }
    featTagsInnerHTML += '</div></div></div>';

    qContent.append(featTagsInnerHTML);

    let featContentInnerHTML = '';
    if(data.Feat.prerequisites != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Prerequisites: </strong></span><span>'+data.Feat.prerequisites+'</span></p></div>';
    }
    if(data.Feat.frequency != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Frequency: </strong></span><span>'+data.Feat.frequency+'</span></p></div>';
    }
    if(data.Feat.cost != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Cost: </strong></span><span>'+data.Feat.cost+'</span></p></div>';
    }
    if(data.Feat.trigger != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Trigger: </strong></span><span>'+data.Feat.trigger+'</span></p></div>';
    }
    if(data.Feat.requirements != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Requirements: </strong></span><span>'+data.Feat.requirements+'</span></p></div>';
    }
    
    featContentInnerHTML += '<hr class="m-1">';

    featContentInnerHTML += '<div>'+processText(data.Feat.description, true, true, 'MEDIUM')+'</div>';

    if(data.Feat.special != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Special: </strong></span><span>'+data.Feat.special+'</span></p></div>';
    }

    qContent.append(featContentInnerHTML);

    // Notes Field
    let featChoice = g_featChoiceArray.find(feat => {
        if(feat != null && feat.value != null){
            if(feat.value.id === data.Feat.id) {
                return true;
            }
        }
        return false;
    });
    if(featChoice != null){
        displayNotesField(qContent, featChoice);
    }

}