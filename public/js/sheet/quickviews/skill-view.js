
let amalgamationBonusText = "This is an amalgamation of any additional bonuses or penalties you might have. This includes adjustments from feats, items, conditions, or those you may have added manually.";

function openSkillQuickview(data) {

    if(data.ProfData.OriginalData == null){
        data.ProfData.OriginalData = {
            For : 'Skill',
            To : data.ProfData.Name,
        };
    }

    $('#quickViewTitle').html(data.SkillName);
    $('#quickViewTitleRight').html('<button id="customizeProfBtn" class="button is-very-small is-success is-outlined is-rounded is-pulled-right mr-1">Customize</button>');
    $('#customizeProfBtn').click(function(){
        openQuickView('customizeProfView', {
            ProfData : data.ProfData,
            _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
        });
    });

    let qContent = $('#quickViewContent');

    let abilityScoreName = lengthenAbilityType(data.Skill.ability);

    let profName = getProfNameFromNumUps(data.ProfData.NumUps);
    if(data.ProfData.UserProfOverride != null && data.ProfData.UserProfOverride){
        qContent.append('<p><strong>Proficiency:</strong> '+profName+' <span class="is-inline pl-1 is-size-7 is-italic"> ( Override )</span></p>');
    } else {
        qContent.append('<p><strong>Proficiency:</strong> '+profName+'</p>');
    }
    
    let userBonus = data.ProfData.UserBonus;
    if(data.ProfData.UserBonus != null && userBonus != 0){
        qContent.append('<p><strong>Extra Bonus:</strong> '+signNumber(userBonus)+'</p>');
    }

    qContent.append('<p><strong>Ability Score:</strong> '+abilityScoreName+'</p>');
    qContent.append('<hr class="m-2">');
    qContent.append(processText(data.Skill.description, true, true, 'MEDIUM'));
    qContent.append('<hr class="m-2">');
    qContent.append('<p class="has-text-centered"><strong>Bonus Breakdown</strong></p>');

    let breakDownInnerHTML = '<p class="has-text-centered">'+signNumber(data.TotalBonus)+' = ';

    breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your '+abilityScoreName+' modifier. Because '+data.Skill.name+' is a '+abilityScoreName+'-based skill, you add your '+abilityScoreName+' modifier to determine your skill bonus.">'+data.AbilMod+'</a>';

    breakDownInnerHTML += ' + ';

    if(profName == "Untrained") {
        let untrainedProfBonus = 0;
        if(gOption_hasProfWithoutLevel){
            untrainedProfBonus = -2;
        }
        breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in '+data.SkillName+', your proficiency bonus is '+signNumber(untrainedProfBonus)+'.">'+data.ProfNum+'</a>';
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
            breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in '+data.SkillName+', your proficiency bonus is '+signNumber(extraBonus)+'.">'+data.ProfNum+'</a>';
        } else {
            breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in '+data.SkillName+', your proficiency bonus is equal to your level ('+data.CharLevel+') plus '+extraBonus+'.">'+data.ProfNum+'</a>';
        }
    }

    breakDownInnerHTML += ' + ';

    let amalgBonus = data.TotalBonus - (data.AbilMod + data.ProfNum);
    breakDownInnerHTML += '<a id="amalgBonusNum" class="has-text-link has-tooltip-bottom">'+amalgBonus+'</a>';

    breakDownInnerHTML += '</p>';

    qContent.append(breakDownInnerHTML);

    let amalgBonuses = getStatExtraBonuses('SKILL_'+data.SkillName);
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

    let conditionalStatMap = getConditionalStatMap('SKILL_'+data.SkillName);
    if(conditionalStatMap != null){

        qContent.append('<hr class="m-2">');

        qContent.append('<p class="has-text-centered"><strong>Contitionals</strong></p>');
        
        for(const [condition, value] of conditionalStatMap.entries()){
            if(value == null){
                qContent.append('<p class="has-text-centered">'+condition+'</p>');
            } else {
                qContent.append('<p class="has-text-centered">'+signNumber(value)+' '+condition+'</p>');
            }
        }

    }

}