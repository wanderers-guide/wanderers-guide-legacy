
function openPerceptionQuickview(data) {

    $('#quickViewTitle').html(data.ProfData.Name);
    let qContent = $('#quickViewContent');

    let profName = getProfNameFromNumUps(data.ProfData.NumUps);

    qContent.append('<p><strong>Proficiency:</strong> '+profName+'</p>');
    qContent.append('<hr class="m-2">');
    qContent.append('<p>Perception measures your character’s ability to notice hidden objects or unusual situations, and it usually determines how quickly the character springs into action in combat.</p>');
    qContent.append('<hr class="m-2">');
    qContent.append('<p class="has-text-centered"><strong>Bonus Breakdown</strong></p>');

    let breakDownInnerHTML = '<p class="has-text-centered">'+signNumber(data.TotalBonus)+' = ';

    breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your Wisdom modifier. It is added when determining your total Perception bonus.">'+data.WisMod+'</a>';

    breakDownInnerHTML += ' + ';

    if(profName == "Untrained") {
        breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in Perception, your proficiency bonus is 0.">'+data.ProfNum+'</a>';
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
        breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in Perception, your proficiency bonus is equal to your level ('+data.CharLevel+') plus '+extraBonus+'.">'+data.ProfNum+'</a>';
    }

    breakDownInnerHTML += ' + ';

    let amalgBonus = data.TotalBonus - (data.WisMod + data.ProfNum);
    breakDownInnerHTML += '<a id="amalgBonusNum" class="has-text-link has-tooltip-bottom">'+amalgBonus+'</a>';

    breakDownInnerHTML += '</p>';

    qContent.append(breakDownInnerHTML);

    let amalgBonuses = getStatExtraBonuses('PERCEPTION');
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

    // Conditionals //
    let conditionalStatMap = getConditionalStatMap('PERCEPTION');
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

    // Senses //
    qContent.append('<hr class="m-2">');

    qContent.append('<p class="has-text-centered is-size-5"><strong>Senses</strong></p>');

    qContent.append('<p class="has-text-centered has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+data.PrimaryVisionSense.description+'">'+data.PrimaryVisionSense.name+'</p>');

    for(let additionalSense of data.AdditionalSenseArray) {
        qContent.append('<p class="has-text-centered has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+additionalSense.description+'">'+additionalSense.name+'</p>');
    }

}