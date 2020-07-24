/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openAbilityQuickview(data) {
    addBackFunctionality(data);

    $('#quickViewTitle').html(data.Ability.name);
    $('#quickViewTitleRight').html('<span class="pr-2">Level '+data.Ability.level+'</span>');
    let qContent = $('#quickViewContent');

    qContent.append('<div>'+processText(data.Ability.description, true, true, 'MEDIUM')+'</div>');

    if(data.Ability.selectType == "SELECTOR"){
        for(let classAbilChoice of g_classDetails.AbilityChoices){
            if(classAbilChoice.SelectorID == data.Ability.id){

                let abilityOption = g_classDetails.Abilities.find(ability => {
                    return ability.id == classAbilChoice.OptionID;
                });
                
                let abilityOptionCardID = 'abilityOptionCard'+abilityOption.id;
                
                qContent.append('<div class="card mt-2"><div class="card-header level is-shadowless is-marginless"><div class="level-left is-size-4"><span>'+abilityOption.name+'</span></div><div class="level-right is-size-4"></div></div><div id="'+abilityOptionCardID+'" class="card-content has-text-left pt-1"></div></div>');

                 $('#'+abilityOptionCardID).append(processText(abilityOption.description, true));

                let srcStruct = { // Hardcoded 'classAbilitySelector' sourceCode title name
                    sourceType: null,
                    sourceLevel: null,
                    sourceCode: 'classAbilitySelector-'+abilityOption.selectOptionFor,
                    sourceCodeSNum: 'a',
                };
                displayNotesField($('#'+abilityOptionCardID), srcStruct);

                break;

            }
        }
    }

    
    let srcStruct = { // Hardcoded 'classAbility' sourceCode title name
        sourceType: null,
        sourceLevel: null,
        sourceCode: 'classAbility-'+data.Ability.id,
        sourceCodeSNum: 'a',
    };
    displayNotesField(qContent, srcStruct);

}