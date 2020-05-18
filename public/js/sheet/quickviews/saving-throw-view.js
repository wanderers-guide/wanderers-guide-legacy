
function openSavingThrowQuickview(data) {

    $('#quickViewTitle').html(data.ProfData.Name);
    let qContent = $('#quickViewContent');

    let profName = getProfNameFromNumUps(data.ProfData.NumUps);

    qContent.append('<p><strong>Proficiency:</strong> '+profName+'</p>');
    qContent.append('<p><strong>Ability Score:</strong> '+data.AbilityName+'</p>');
    qContent.append('<hr class="m-2">');
    qContent.append('<p>'+data.SavingThrowDescription+'</p>');
    qContent.append('<hr class="m-2">');
    qContent.append('<p class="has-text-centered"><strong>Bonus Breakdown</strong></p>');

    let breakDownInnerHTML = '<p class="has-text-centered">'+signNumber(data.TotalBonus)+' = ';

    breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your '+data.AbilityName+' modifier. Your '+data.AbilityName+' is relevant in determining how well you can act in dealing with situations where you will need to make a '+data.ProfData.Name+' saving throw; as a result, it\'s modifier is added when determining your total saving throw bonus.">'+data.AbilMod+'</a>';

    breakDownInnerHTML += ' + ';

    if(profName == "Untrained") {
        breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in '+data.ProfData.Name+' saving throws, your proficiency bonus is 0.">'+data.ProfNum+'</a>';
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
        breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in '+data.ProfData.Name+' saving throws, your proficiency bonus is equal to your level ('+data.CharLevel+') plus '+extraBonus+'.">'+data.ProfNum+'</a>';
    }

    breakDownInnerHTML += ' + ';

    let amalgBonus = data.TotalBonus - (data.AbilMod + data.ProfNum);
    breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+amalgamationBonusText+'">'+amalgBonus+'</a>';

    breakDownInnerHTML += '</p>';

    qContent.append(breakDownInnerHTML);

}