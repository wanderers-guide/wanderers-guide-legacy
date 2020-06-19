
function openSavingThrowQuickview(data) {

    $('#quickViewTitle').html(data.ProfData.Name);
    $('#quickViewTitleRight').html('<button id="customizeProfBtn" class="button is-very-small is-success is-outlined is-rounded is-pulled-right mr-1">Customize</button>');
    $('#customizeProfBtn').click(function(){
        openQuickView('customizeProfView', {
            ProfData : data.ProfData,
            _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
        });
    });

    let qContent = $('#quickViewContent');

    let profName = getProfNameFromNumUps(data.ProfData.NumUps);
    if(data.ProfData.UserProfOverride){
        qContent.append('<p><strong>Proficiency:</strong> '+profName+' <span class="is-inline pl-1 is-size-7 is-italic"> ( Override )</span></p>');
    } else {
        qContent.append('<p><strong>Proficiency:</strong> '+profName+'</p>');
    }
    
    let userBonus = data.ProfData.UserBonus;
    if(userBonus != 0){
        qContent.append('<p><strong>Extra Bonus:</strong> '+signNumber(userBonus)+'</p>');
    }
    
    qContent.append('<p><strong>Ability Score:</strong> '+data.AbilityName+'</p>');
    qContent.append('<hr class="m-2">');
    qContent.append('<p>'+data.SavingThrowDescription+'</p>');
    qContent.append('<hr class="m-2">');
    qContent.append('<p class="has-text-centered"><strong>Bonus Breakdown</strong></p>');

    let breakDownInnerHTML = '<p class="has-text-centered">'+signNumber(data.TotalBonus)+' = ';

    breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your '+data.AbilityName+' modifier. Your '+data.AbilityName+' is relevant in determining how well you can act in dealing with situations where you will need to make a '+data.ProfData.Name+' saving throw; as a result, it\'s modifier is added when determining your total saving throw bonus.">'+data.AbilMod+'</a>';

    breakDownInnerHTML += ' + ';

    if(profName == "Untrained") {
        let untrainedProfBonus = 0;
        if(gOption_hasProfWithoutLevel){
            untrainedProfBonus = -2;
        }
        breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in '+data.ProfData.Name+', your proficiency bonus is '+signNumber(untrainedProfBonus)+'.">'+data.ProfNum+'</a>';
    } else {
        let extraBonus = 0;
        if(profName == "Trained"){
            extraBonus = 2;
        } else if(profName == "Expert"){
            extraBonus = 4;
        } else if(profName == "Master"){
            extraBonus = 6;
        } else if(profName == "Legendary"){
            extraBonus = 8;
        }

        if(gOption_hasProfWithoutLevel){
            breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in '+data.ProfData.Name+', your proficiency bonus is '+signNumber(extraBonus)+'.">'+data.ProfNum+'</a>';
        } else {
            breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in '+data.ProfData.Name+', your proficiency bonus is equal to your level ('+data.CharLevel+') plus '+extraBonus+'.">'+data.ProfNum+'</a>';
        }
    }

    breakDownInnerHTML += ' + ';

    let amalgBonus = data.TotalBonus - (data.AbilMod + data.ProfNum);
    breakDownInnerHTML += '<a id="amalgBonusNum" class="has-text-link has-tooltip-bottom">'+amalgBonus+'</a>';

    breakDownInnerHTML += '</p>';

    qContent.append(breakDownInnerHTML);

    let saveDataName = (data.ProfData.Name == 'Fortitude') ? 'SAVE_Fort' : 'SAVE_'+data.ProfData.Name;

    let amalgBonuses = getStatExtraBonuses(saveDataName);
    if(amalgBonuses != null && amalgBonuses.length > 0){
        $('#amalgBonusNum').removeClass('has-tooltip-multiline');
        let amalgTooltipText = 'Additional adjustments:';
        for(let amalgExtra of amalgBonuses){
            amalgTooltipText += '\n'+amalgExtra;
        }
        $('#amalgBonusNum').attr('data-tooltip', amalgTooltipText);
    } else {
        $('#amalgBonusNum').addClass('has-tooltip-multiline');
        $('#amalgBonusNum').attr('data-tooltip', amalgamationBonusText);
    }

    let conditionalStatMap = getConditionalStatMap(saveDataName);
    if(conditionalStatMap != null){

        qContent.append('<hr class="m-2">');

        qContent.append('<p class="has-text-centered"><strong>Contitionals</strong></p>');
        
        for(const [condition, value] of conditionalStatMap.entries()){
            if(value == null){
                qContent.append('<p class="has-text-centered">'+condition+'</p>');
            } else {
                qContent.append('<p class="has-text-centered">'+value+' '+condition+'</p>');
            }
        }

    }

}