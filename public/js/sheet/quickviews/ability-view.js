
function openAbilityQuickview(data) {
    addBackFunctionality(data);

    $('#quickViewTitle').html(data.Ability.name);
    $('#quickViewTitleRight').html('<span class="pr-2">Level '+data.Ability.level+'</span>');
    let qContent = $('#quickViewContent');

    qContent.append('<div>'+processText(data.Ability.description, true)+'</div>');

    if(data.Ability.selectType == "SELECTOR"){
        for(let classAbilChoice of g_classDetails.AbilityChoices){
            if(classAbilChoice.SelectorID == data.Ability.id){

                let abilityOption = g_classDetails.Abilities.find(ability => {
                    return ability.id == classAbilChoice.OptionID;
                });
                
                let abilityOptionCardID = 'abilityOptionCard'+abilityOption.id;
                
                qContent.append('<div class="card mt-2"><div class="card-header level is-shadowless is-marginless"><div class="level-left is-size-4"><span>'+abilityOption.name+'</span></div><div class="level-right is-size-4"></div></div><div id="'+abilityOptionCardID+'" class="card-content has-text-left pt-1"></div></div>');

                 $('#'+abilityOptionCardID).append(processText(abilityOption.description, true));

                // Hardcoded 'classAbilitySelector' sourceCode title name
                let sourceCode = 'classAbilitySelector-'+abilityOption.selectOptionFor;
                displayNotesField($('#'+abilityOptionCardID), sourceCode);

                break;

            }
        }
    }

    // Hardcoded 'classAbility' sourceCode title name
    let sourceCode = 'classAbility-'+data.Ability.id;
    displayNotesField(qContent, sourceCode);

}