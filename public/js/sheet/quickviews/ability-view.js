/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openAbilityQuickview(data) {
    addBackFunctionality(data);
    addContentSource(data.Ability.contentSrc, data.Ability.homebrewID);

    $('#quickViewTitle').html(data.Ability.name);
    if(data.Ability.level != null && data.Ability.level > 0) {
      $('#quickViewTitleRight').html('<span class="pr-2">Level '+data.Ability.level+'</span>');
    }
    let qContent = $('#quickViewContent');

    qContent.append('<div>'+processText(data.Ability.description, true, true, 'MEDIUM')+'</div>');

    if(data.Ability.selectType == "SELECTOR"){
        for(let classAbilChoice of g_classDetails.AbilityChoices){
            if(classAbilChoice.SelectorID == data.Ability.id){

                let abilityOption = g_allClassAbilityOptions.find(ability => {
                    return ability.id == classAbilChoice.OptionID;
                });
                if(abilityOption == null){ break; }
                
                let abilityOptionCardID = 'abilityOptionCard'+abilityOption.id;
                
                qContent.append('<div class="card mt-2"><div class="card-header level is-shadowless is-marginless"><div class="level-left is-size-4"><span>'+abilityOption.name+'</span></div><div class="level-right is-size-4"></div></div><div id="'+abilityOptionCardID+'" class="card-content has-text-left pt-1"></div></div>');

                 $('#'+abilityOptionCardID).append(processText(abilityOption.description, true));

                // Add Text Statements
                processAddText(abilityOption.code, abilityOptionCardID);

                // Note Field Statements
                let srcStruct = { // Hardcoded 'classAbilitySelector' sourceCode title name
                    sourceType: null,
                    sourceLevel: null,
                    sourceCode: 'classAbilitySelector-'+abilityOption.selectOptionFor,
                    sourceCodeSNum: 'a',
                };

                if(typeof displayNotesField === "function") {
                  displayNotesField($('#'+abilityOptionCardID), srcStruct);
                }

                break;

            }
        }
    }

    // Add Text Statements
    processAddText(data.Ability.code, 'quickViewContent');

    // Note Field Statements
    let srcStruct = { // Hardcoded 'classAbility' sourceCode title name
        sourceType: null,
        sourceLevel: null,
        sourceCode: 'classAbility-'+data.Ability.id,
        sourceCodeSNum: 'a',
    };
    if(typeof displayNotesField === "function") {
      displayNotesField(qContent, srcStruct);
    }

}