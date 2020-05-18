
let amalgamationBonusText = "This is an amalgamation of any additional bonuses you might have. This usually includes bonuses from feats, items, conditions, or any custom-set bonuses that you may have added manually.";

function openSkillQuickview(data) {

    $('#quickViewTitle').html(data.SkillName);
    let qContent = $('#quickViewContent');

    let abilityScoreName = lengthenAbilityType(data.Skill.ability);
    let profName = getProfNameFromNumUps(data.SkillData.NumUps);

    qContent.append('<p><strong>Proficiency:</strong> '+profName+'</p>');
    qContent.append('<p><strong>Ability Score:</strong> '+abilityScoreName+'</p>');
    qContent.append('<hr class="m-2">');
    qContent.append('<p>'+data.Skill.description+'</p>');
    qContent.append('<hr class="m-2">');
    qContent.append('<p class="has-text-centered"><strong>Bonus Breakdown</strong></p>');

    let breakDownInnerHTML = '<p class="has-text-centered">'+signNumber(data.TotalBonus)+' = ';

    breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your '+abilityScoreName+' modifier. Because '+data.Skill.name+' is a '+abilityScoreName+'-based skill, you add your '+abilityScoreName+' modifier to determine your skill bonus.">'+data.AbilMod+'</a>';

    breakDownInnerHTML += ' + ';

    if(profName == "Untrained") {
        breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in '+data.SkillName+', your proficiency bonus is 0.">'+data.ProfNum+'</a>';
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
        breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in '+data.SkillName+', your proficiency bonus is equal to your level ('+data.CharLevel+') plus '+extraBonus+'.">'+data.ProfNum+'</a>';
    }

    breakDownInnerHTML += ' + ';

    let amalgBonus = data.TotalBonus - (data.AbilMod + data.ProfNum);
    breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+amalgamationBonusText+'">'+amalgBonus+'</a>';

    breakDownInnerHTML += '</p>';

    qContent.append(breakDownInnerHTML);

    let conditionalStatMap = getConditionalStatMap('SKILL_'+data.SkillName);
    if(conditionalStatMap != null){

        qContent.append('<hr class="m-2">');

        qContent.append('<p class="has-text-centered"><strong>Contitionals</strong></p>');
        
        for(const [condition, value] of conditionalStatMap.entries()){
            qContent.append('<p class="has-text-centered">'+value+' '+condition+'</p>');
        }

    }

}