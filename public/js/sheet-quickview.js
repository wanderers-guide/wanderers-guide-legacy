
// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    let quickviews = bulmaQuickview.attach();
    
    $('#quickViewClose').click(function(){
        $('#quickviewDefault').removeClass('is-active');
    });

    $('#character-sheet-section').click(function(){
        if($('#quickviewDefault').hasClass('quickview-auto-close-protection')){
            $('#quickviewDefault').removeClass('quickview-auto-close-protection');
        } else {
            $('#quickviewDefault').removeClass('is-active');
        }
    });

});

let amalgamationBonusText = "This is an amalgamation of any additional bonuses you might have. This usually includes bonuses from feats, items, conditions, or any custom-set bonuses that you may have added manually.";

function openQuickView(type, data) {

    $('#quickViewTitle').html('');
    $('#quickViewContent').html('');

    $('#quickviewDefault').addClass('quickview-auto-close-protection');
    $('#quickviewDefault').addClass('is-active');

    if(type == 'skillView'){

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
            breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in '+data.SkillName+', your proficiency bonus is is equal to your level ('+data.CharLevel+') plus '+extraBonus+'.">'+data.ProfNum+'</a>';
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

        return;
    }

    if(type == 'abilityScoreView'){
    
        $('#quickViewTitle').html(data.AbilityName);
        let qContent = $('#quickViewContent');

        let abilityDescription = null;

        if(data.AbilityName == 'Strength'){
            abilityDescription = "Strength measures your character’s physical power. Strength is important if your character plans to engage in hand-to-hand combat. Your Strength modifier gets added to melee damage rolls and determines how much your character can carry.";
        } else if(data.AbilityName == 'Dexterity'){
            abilityDescription = "Dexterity measures your character’s agility, balance, and reflexes. Dexterity is important if your character plans to make attacks with ranged weapons or use stealth to surprise foes. Your Dexterity modifier is also added to your character’s AC and Reflex saving throws.";
        } else if(data.AbilityName == 'Constitution'){
            abilityDescription = "Constitution measures your character’s overall health and stamina. Constitution is an important statistic for all characters, especially those who fight in close combat. Your Constitution modifier is added to your Hit Points and Fortitude saving throws.";
        } else if(data.AbilityName == 'Intelligence'){
            abilityDescription = "Intelligence measures how well your character can learn and reason. A high Intelligence allows your character to analyze situations and understand patterns, and it means they can become trained in additional skills and might be able to master additional languages.";
        } else if(data.AbilityName == 'Wisdom'){
            abilityDescription = "Wisdom measures your character’s common sense, awareness, and intuition. Your Wisdom modifier is added to your Perception and Will saving throws.";
        } else if(data.AbilityName == 'Charisma'){
            abilityDescription = "Charisma measures your character’s personal magnetism and strength of personality. A high Charisma score helps you influence the thoughts and moods of others. ";
        }

        qContent.append('<p><strong>Ability Score:</strong> '+data.AbilityScore+'</p>');
        qContent.append('<p><strong>Ability Modifier:</strong> '+signNumber(data.AbilityMod)+'</p>');
        qContent.append('<hr class="m-2">');
        qContent.append('<p>'+abilityDescription+'</p>');
        qContent.append('<hr class="mt-2 mb-3">');
        qContent.append('<p class="has-text-centered is-size-7"><strong>What is this all for?</strong></p>');
        qContent.append('<p class="has-text-centered is-size-7">Each ability represents a certain aspect of your character. The <a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="As you may have noticed, ability scores are only used to calculate your ability score modifiers in Pathfinder 2e. To be honest, they could easily be cut and removed from the system all together as all they really do is add unnecessary complexity. With that said, they\'re around for more traditional reasons. The concept of ability scores were in Pathfinder 1e and have existed in tabletop role-playing games for decades.">ability score</a> is used to calculate that ability\'s modifier. That modifer is used to dictate how good or bad your character is in that aspect.</p>');
        qContent.append('<hr class="m-2">');
        qContent.append('<p class="has-text-centered is-size-7"><strong>Calulating Ability Modifer from Score</strong></p>');
        qContent.append('<p class="has-text-centered is-size-7">To determine the ability modifier from its score, you must look at how far away it is from 10. For every 2 higher it is than 10, your modifier is that number greater. For example, the ability modifier of 16 is +3. If the score is odd, the modifier is the same of the score of one lower. So the ability modifier of 17 is still only +3. The same works in the opposite direction - the ability modifier of 8 is -1. The actual mathmatical formula for this is:</p>');
        qContent.append('<p class="has-text-centered is-size-7 is-italic">Modifier = roundDown((Score-10)/2)</p>');

        return;
    }

    if(type == 'heroPointsView'){
    
        $('#quickViewTitle').html('Hero Points');
        let qContent = $('#quickViewContent');

        qContent.append('<p>Your character usually begins each game session with 1 Hero Point, and you can gain more later by devising clever strategies or performing heroic deeds - something selfless, daring, or beyond normal expectations. The GM is in charge of awarding Hero Points and they have <a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="Some GMs may have additional ways to gain Hero Points, such as if a player is being helpful out of game by setting up the game table, bringing snacks for everyone, etc. For more roleplay-intensive groups, GMs may award Hero Points to players who get invested in their characters by bringing props and staying in character as much as possible.">their own rules</a> on how one gains Hero Points.</p>');
        qContent.append('<hr class="m-2">');
        qContent.append('<p class="has-text-centered is-size-6 is-italic">You can spend Hero Points on the following:</p>');
        qContent.append('<p class="has-text-centered is-size-7"><strong>Spend 1 Hero Point</strong></p>');
        qContent.append('<p class="has-text-centered is-size-7 mb-2">You can reroll any check. You must use the second result. This is a fortune effect (which means you can’t use more than 1 Hero Point on a check).</p>');
        qContent.append('<p class="has-text-centered is-size-7"><strong>Spend all your Hero Points</strong></p>');
        qContent.append('<p class="has-text-centered is-size-7">You avoid death. You must spend a minimum of 1 Hero Point to do this. You can do this when your dying condition would increase. You lose the dying condition entirely and stabilize with 0 Hit Points. You don’t gain the wounded condition or increase its value from losing the dying condition in this way, but if you already had that condition, you don’t lose it or decrease its value.</p>');

        return;
    }

    if(type == 'languageView'){
    
        $('#quickViewTitle').html(data.Language.name);
        let qContent = $('#quickViewContent');

        qContent.append('<p><strong>Speakers:</strong> '+data.Language.speakers+'</p>');
        qContent.append('<p><strong>Script:</strong> '+data.Language.script+'</p>');
        qContent.append('<hr class="m-2">');
        qContent.append('<p>'+data.Language.description+'</p>');

        let scriptClass = '';
        if(data.Language.script == 'Common'){
            scriptClass = 'font-common';
        } else if(data.Language.script == 'Iokharic'){
            scriptClass = 'font-iokharic';
        } else if(data.Language.script == 'Dethek'){
            scriptClass = 'font-dethek';
        } else if(data.Language.script == 'Rellanic'){
            scriptClass = 'font-rellanic';
        } else if(data.Language.script == 'Barazhad'){
            scriptClass = 'font-barazhad';
        } else if(data.Language.script == 'Enochian'){
            scriptClass = 'font-enochian';
        } else if(data.Language.script == 'Aklo'){
            scriptClass = 'font-aklo';
        } else if(data.Language.script == 'Gnomish'){
            scriptClass = 'font-gnomish';
        } else if(data.Language.script == 'Necril'){
            scriptClass = 'font-necril';
        } else if(data.Language.script == 'Druidic'){
            scriptClass = 'font-druidic';
        }

        if(scriptClass != ''){
            qContent.append('<hr class="m-2">');
            qContent.append('<input id="scriptDisplayArea" class="input is-medium" spellcheck="false" type="text" placeholder="Script Display Area">');
            $('#scriptDisplayArea').addClass(scriptClass);

        }

        return;
    }

    if(type == 'featView'){
    
        $('#quickViewTitle').html(data.FeatNameHTML);
        let qContent = $('#quickViewContent');

        let featTagsInnerHTML = '<div class="columns is-centered is-marginless"><div class="column is-10 is-paddingless"><div class="buttons is-marginless is-centered">';
        switch(data.Feat.rarity) {
        case 'UNCOMMON': featTagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-primary">Uncommon</button>';
            break;
        case 'RARE': featTagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-success">Rare</button>';
            break;
        case 'UNIQUE': featTagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-danger">Unique</button>';
            break;
        default: break;
        }
        for(const tag of data.Tags){
            featTagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+tag.description+'">'+tag.name+'</button>';
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
    
        featContentInnerHTML += '<div>'+processSheetText(data.Feat.description)+'</div>';
    
        if(data.Feat.special != null){
            featContentInnerHTML += '<div><p><span><strong>Special: </strong></span><span>'+data.Feat.special+'</span></p></div>';
        }

        qContent.append(featContentInnerHTML);

        return;
    }

    if(type == 'savingThrowView'){
    
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
            breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in '+data.ProfData.Name+' saving throws, your proficiency bonus is is equal to your level ('+data.CharLevel+') plus '+extraBonus+'.">'+data.ProfNum+'</a>';
        }

        breakDownInnerHTML += ' + ';

        let amalgBonus = data.TotalBonus - (data.AbilMod + data.ProfNum);
        breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+amalgamationBonusText+'">'+amalgBonus+'</a>';

        breakDownInnerHTML += '</p>';

        qContent.append(breakDownInnerHTML);

        return;
    }

    if(type == 'perceptionView'){
    
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
            breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="This is your proficiency bonus. Because you are '+profName+' in Perception, your proficiency bonus is is equal to your level ('+data.CharLevel+') plus '+extraBonus+'.">'+data.ProfNum+'</a>';
        }

        breakDownInnerHTML += ' + ';

        let amalgBonus = data.TotalBonus - (data.WisMod + data.ProfNum);
        breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+amalgamationBonusText+'">'+amalgBonus+'</a>';

        breakDownInnerHTML += '</p>';

        qContent.append(breakDownInnerHTML);

        let conditionalStatMap = getConditionalStatMap('PERCEPTION');
        if(conditionalStatMap != null){

            qContent.append('<hr class="m-2">');

            qContent.append('<p class="has-text-centered"><strong>Contitionals</strong></p>');
            
            for(const [condition, value] of conditionalStatMap.entries()){
                qContent.append('<p class="has-text-centered">'+value+' '+condition+'</p>');
            }

        }

        return;
    }

    if(type == 'invItemView'){

        let invItemName = data.InvItem.name;
        if(data.InvItem.name != data.Item.Item.name){
            invItemName += '<p class="is-inline pl-1 is-size-7 is-italic"> ( '+data.Item.Item.name+' )</p>';
        }
        $('#quickViewTitle').html(invItemName);
        let qContent = $('#quickViewContent');

        let invItemQtyInputID = 'invItemQtyInput'+data.InvItem.id;
        let invItemHPInputID = 'invItemHPInput'+data.InvItem.id;
        
        let invItemMoveSelectID = 'invItemMoveSelect'+data.InvItem.id;
        let invItemMoveButtonID = 'invItemMoveButton'+data.InvItem.id;

        let invItemRemoveButtonID = 'invItemRemoveButton'+data.InvItem.id;
        let invItemCustomizeButtonID = 'invItemCustomizeButton'+data.InvItem.id;

        let isShoddy = (data.InvItem.isShoddy == 1);
        let maxHP = (isShoddy) ? Math.floor(data.InvItem.hitPoints/2) : data.InvItem.hitPoints;
        let brokenThreshold = (isShoddy) ? Math.floor(data.InvItem.brokenThreshold/2) : data.InvItem.brokenThreshold;

        data.InvItem.currentHitPoints = (data.InvItem.currentHitPoints > maxHP) ? maxHP : data.InvItem.currentHitPoints;

        let isBroken = (data.InvItem.currentHitPoints <= brokenThreshold);

        let tagsInnerHTML = '';
        if(isBroken){
            tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-danger has-tooltip-bottom has-tooltip-multiline" data-tooltip="A broken object can’t be used for its normal function, nor does it grant bonuses - with the exception of armor. Broken armor still grants its item bonus to AC, but it also imparts a status penalty to AC depending on its category: -1 for broken light armor, -2 for broken medium armor, or -3 for broken heavy armor. A broken item still imposes penalties and limitations normally incurred by carrying, holding, or wearing it.">Broken</button>';
        }
        if(isShoddy){
            tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-warning has-tooltip-bottom has-tooltip-multiline" data-tooltip="Improvised or of dubious make, shoddy items are never available for purchase except for in the most desperate of communities. When available, a shoddy item usually costs half the Price of a standard item, though you can never sell one in any case. Attacks and checks involving a shoddy item take a –2 item penalty. This penalty also applies to any DCs that a shoddy item applies to (such as AC, for shoddy armor). A shoddy suit of armor also worsens the armor’s check penalty by 2. A shoddy item’s Hit Points and Broken Threshold are each half that of a normal item of its type.">Shoddy</button>';
        }

        let itemSize = data.InvItem.size;
        switch(itemSize) {
            case 'TINY': tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-link">Tiny</button>';
                break;
            case 'SMALL': tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-link">Small</button>';
                break;
            case 'LARGE': tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-link">Large</button>'; break;
            case 'HUGE': tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-link">Huge</button>'; break;
            case 'GARGANTUAN': tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-link">Gargantuan</button>';
                break;
            default: break;
        }

        let rarity = data.Item.Item.rarity;
        switch(rarity) {
            case 'UNCOMMON': tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-primary">Uncommon</button>';
                break;
            case 'RARE': tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-success">Rare</button>';
                break;
            case 'UNIQUE': tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-danger">Unique</button>';
                break;
            default: break;
        }
        for(const tagStruct of data.Item.TagArray){
            tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+tagStruct.Tag.description+'">'+tagStruct.Tag.name+' '+tagStruct.TagDetails+'</button>';
        }

        if(tagsInnerHTML != ''){
            qContent.append('<div class="columns is-centered is-marginless"><div class="column is-8 is-paddingless"><div class="buttons is-marginless is-centered">'+tagsInnerHTML+'</div></div></div>');
            qContent.append('<hr class="mb-2 mt-1">');
        }

        let price = getConvertedPriceForSize(data.InvItem.size, data.InvItem.price);
        price = getCoinToString(price);
        if(data.Item.Item.quantity > 1){
            price += ' for '+data.Item.Item.quantity;
        }

        let bulk = getConvertedBulkForSize(data.InvItem.size, data.InvItem.bulk);
        bulk = getBulkFromNumber(bulk);
        qContent.append('<p class="is-size-6"><strong>Price:</strong> '+price+'</p>');
        qContent.append('<p class="is-size-6"><strong>Bulk:</strong> '+bulk+'</p>');
        if(data.Item.Item.hands != 'NONE'){
            qContent.append('<p class="is-size-6"><strong>Hands:</strong> '+getHandsToString(data.Item.Item.hands)+'</p>');
        }

        qContent.append('<hr class="m-2">');

        if(data.Item.WeaponData != null){

            if(data.Item.WeaponData.isMelee == 1){
                
                let calcStruct = getAttackAndDamage(data.Item, data.InvItem, data.Data.StrMod, data.Data.DexMod);
    
                qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>Attack Bonus</strong></div><div class="tile is-child is-6"><strong>Damage</strong></div></div>');
                qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p class="pr-1">'+calcStruct.AttackBonus+'</p></div><div class="tile is-child is-6"><p>'+calcStruct.Damage+'</p></div></div>');
    
                qContent.append('<hr class="m-2">');
    
            }
            
            if(data.Item.WeaponData.isRanged == 1){
                
                let calcStruct = getAttackAndDamage(data.Item, data.InvItem, data.Data.StrMod, data.Data.DexMod);
    
                qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>Attack Bonus</strong></div><div class="tile is-child is-6"><strong>Damage</strong></div></div>');
                qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p class="pr-1">'+calcStruct.AttackBonus+'</p></div><div class="tile is-child is-6"><p>'+calcStruct.Damage+'</p></div></div>');
    
                qContent.append('<hr class="m-2">');
    
                let reload = data.Item.WeaponData.rangedReload;
                if(reload == 0){ reload = '-'; }
                let range = data.Item.WeaponData.rangedRange+" ft";
                qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>Range</strong></div><div class="tile is-child is-6"><strong>Reload</strong></div></div>');
                qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p>'+range+'</p></div><div class="tile is-child is-6"><p>'+reload+'</p></div></div>');
    
                qContent.append('<hr class="m-2">');
    
            }

        }
    
        if(data.Item.ArmorData != null){
            
            // Apply Shoddy to Armor
            let acBonus = data.Item.ArmorData.acBonus;
            acBonus += (isShoddy) ? -2 : 0;

            let armorCheckPenalty = data.Item.ArmorData.checkPenalty;
            armorCheckPenalty += (isShoddy) ? -2 : 0;
            //

            qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>AC Bonus</strong></div><div class="tile is-child is-6"><strong>Dex Cap</strong></div></div>');
            qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p>'+signNumber(acBonus)+'</p></div><div class="tile is-child is-6"><p>'+signNumber(data.Item.ArmorData.dexCap)+'</p></div></div>');

            qContent.append('<hr class="m-2">');

            let minStrength = (data.Item.ArmorData.minStrength == 0) ? '-' : data.Item.ArmorData.minStrength+'';
            let checkPenalty = (armorCheckPenalty == 0) ? '-' : armorCheckPenalty+'';
            let speedPenalty = (data.Item.ArmorData.speedPenalty == 0) ? '-' : data.Item.ArmorData.speedPenalty+' ft';
            qContent.append('<div class="tile text-center"><div class="tile is-child is-4"><strong>Strength</strong></div><div class="tile is-child is-4"><strong>Check Penalty</strong></div><div class="tile is-child is-4"><strong>Speed Penalty</strong></div></div>');
            qContent.append('<div class="tile text-center"><div class="tile is-child is-4"><p>'+minStrength+'</p></div><div class="tile is-child is-4"><p>'+checkPenalty+'</p></div><div class="tile is-child is-4"><p>'+speedPenalty+'</p></div></div>');

            qContent.append('<hr class="m-2">');
    
        }

        if(data.Item.ShieldData != null){

            let speedPenalty = (data.Item.ShieldData.speedPenalty == 0) ? '-' : data.Item.ShieldData.speedPenalty+' ft';
            qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>AC Bonus</strong></div><div class="tile is-child is-6"><strong>Speed Penalty</strong></div></div>');
            qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p>'+signNumber(data.Item.ShieldData.acBonus)+'</p></div><div class="tile is-child is-6"><p>'+speedPenalty+'</p></div></div>');
    
            qContent.append('<hr class="m-2">');
    
        }
    
        if(data.Item.StorageData != null){
            
            let maxBagBulk = data.Item.StorageData.maxBulkStorage;
            let bulkIgnored = data.Item.StorageData.bulkIgnored;
            let bulkIgnoredMessage = "-";
            if(bulkIgnored != 0.0){
                if(bulkIgnored == maxBagBulk){
                    bulkIgnoredMessage = "All Items";
                } else {
                    bulkIgnoredMessage = "First "+bulkIgnored+" Bulk of Items";
                }
            }
    
            qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>Bulk Storage</strong></div><div class="tile is-child is-6"><strong>Bulk Ignored</strong></div></div>');
            qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p>'+maxBagBulk+'</p></div><div class="tile is-child is-6"><p>'+bulkIgnoredMessage+'</p></div></div>');
    
            qContent.append('<hr class="m-2">');
        }

        qContent.append('<div><p>'+processSheetText(data.InvItem.description)+'</p></div>');

        qContent.append('<hr class="m-2">');

        if(data.Item.Item.hasQuantity == 1){
            qContent.append('<div class="field has-addons has-addons-centered"><p class="control"><a class="button is-static has-text-grey-lighter has-background-grey-darkest border-darker">Quantity</a></p><p class="control"><input id="'+invItemQtyInputID+'" class="input" type="number" min="1" max="9999999" value="'+data.InvItem.quantity+'"></p></div>');
        }

        if(data.Item.WeaponData != null){

            let weapGroup = null;
    
            if(data.Item.WeaponData.isMelee == 1){
                if(weapGroup == null){
                    weapGroup = capitalizeWord(data.Item.WeaponData.meleeWeaponType);
                }
            }

            if(data.Item.WeaponData.isRanged == 1){
                if(weapGroup == null){
                    weapGroup = capitalizeWord(data.Item.WeaponData.rangedWeaponType);
                }
            }

            let weapCategory = capitalizeWord(data.Item.WeaponData.category);
            qContent.append('<div class="tile is-child text-center"><p class="is-size-7"><strong>'+weapCategory+' Weapon - '+weapGroup+'</strong></p></div>');

            qContent.append('<hr class="m-2">');

        }

        if(data.Item.ArmorData != null){

            let armorTypeAndGroupListing = '';
            let armorCategory = capitalizeWord(data.Item.ArmorData.category);
            if(data.Item.ArmorData.armorType == 'N/A'){
                armorTypeAndGroupListing = (armorCategory == 'Unarmored') ? armorCategory : armorCategory+' Armor';
            } else {
                let armorGroup = capitalizeWord(data.Item.ArmorData.armorType);
                armorTypeAndGroupListing = (armorCategory == 'Unarmored') ? armorCategory+' - '+armorGroup : armorCategory+' Armor - '+armorGroup;
            }
            qContent.append('<div class="tile is-child text-center"><p class="is-size-7"><strong>'+armorTypeAndGroupListing+'</strong></p></div>');

            qContent.append('<hr class="m-2">');

        }

        qContent.append('<p class="has-text-centered is-size-7"><strong>Health</strong></p>');
        qContent.append('<div class="field has-addons has-addons-centered"><p class="control"><input id="'+invItemHPInputID+'" class="input is-small" type="number" min="0" max="'+maxHP+'" value="'+data.InvItem.currentHitPoints+'"></p><p class="control"><a class="button is-static is-small has-text-grey-light has-background-grey-darkest border-darker">/</a><p class="control"><a class="button is-static is-small has-text-grey-lighter has-background-grey-darker border-darker">'+maxHP+'</a></p></div>');
        qContent.append('<div class="columns is-centered is-marginless text-center"><div class="column is-5 is-paddingless"><p class="is-size-7"><strong>Hardness:</strong> '+data.InvItem.hardness+'</p></div><div class="column is-7 is-paddingless"><p class="is-size-7"><strong>Broken Threshold:</strong> '+brokenThreshold+'</p></div></div>');

        if(data.Item.WeaponData != null){

            qContent.append('<hr class="m-2">');

            displayRunesForItem(qContent, data.InvItem, data.RuneDataStruct, true);

        }

        if(data.Item.ArmorData != null){

            qContent.append('<hr class="m-2">');

            displayRunesForItem(qContent, data.InvItem, data.RuneDataStruct, false);

        }

        qContent.append('<hr class="mt-2 mb-3">');

        if(data.ItemIsStorage && !data.ItemIsStorageAndEmpty) {

        } else {

            qContent.append('<div class="field has-addons has-addons-centered"><div class="control"><div class="select is-small is-link"><select id="'+invItemMoveSelectID+'"></select></div></div><div class="control"><button id="'+invItemMoveButtonID+'" type="submit" class="button is-small is-link is-rounded is-outlined">Move</button></div></div>');
    
            $('#'+invItemMoveSelectID).append('<option value="Unstored">Unstored</option>');
            for(const bagInvItem of data.OpenBagInvItemArray){
                if(data.InvItem.id != bagInvItem.id) {
                    if(data.InvItem.bagInvItemID == bagInvItem.id){
                        $('#'+invItemMoveSelectID).append('<option value="'+bagInvItem.id+'" selected>'+bagInvItem.name+'</option>');
                    } else {
                        $('#'+invItemMoveSelectID).append('<option value="'+bagInvItem.id+'">'+bagInvItem.name+'</option>');
                    }
                }
            }
    
            $('#'+invItemMoveButtonID).click(function() {
                let bagItemID = $('#'+invItemMoveSelectID).val();
                if(bagItemID == 'Unstored') { bagItemID = null; }
                $(this).addClass('is-loading');
                socket.emit("requestInvItemMoveBag",
                    data.InvItem.id,
                    bagItemID,
                    data.InvItem.invID);
            });

        }

        qContent.append('<div class="buttons is-centered is-marginless"><a id="'+invItemCustomizeButtonID+'" class="button is-small is-primary is-rounded is-outlined">Customize</a><a id="'+invItemRemoveButtonID+'" class="button is-small is-danger is-rounded is-outlined">Remove</a></div>');

        $('#'+invItemRemoveButtonID).click(function() {
            $(this).addClass('is-loading');
            socket.emit("requestRemoveItemFromInv",
                data.InvItem.invID,
                data.InvItem.id);
        });

        $('#'+invItemCustomizeButtonID).click(function() {
            openQuickView('customizeItem', {
                Item: data.Item,
                InvItem: data.InvItem,
                PrevType : type,
                PrevData : data
            });
        });

        if(data.Item.Item.hasQuantity == 1){
            $('#'+invItemQtyInputID).blur(function() {
                let newQty = $(this).val();
                if(newQty != data.InvItem.quantity && newQty != ''){
                    if(newQty <= 9999999 && newQty >= 1) {
                        $(this).removeClass('is-danger');
                        socket.emit("requestInvItemQtyChange",
                            data.InvItem.id,
                            newQty,
                            data.InvItem.invID);
                    } else {
                        $(this).addClass('is-danger');
                    }
                }
            });
        }

        $('#'+invItemHPInputID).blur(function() {
            let newHP = $(this).val();
            if(newHP != data.InvItem.currentHitPoints && newHP != ''){
                if(newHP <= maxHP && newHP >= 0) {
                    $(this).removeClass('is-danger');
                    socket.emit("requestInvItemHPChange",
                        data.InvItem.id,
                        newHP,
                        data.InvItem.invID);
                } else {
                    $(this).addClass('is-danger');
                }
            }
        });

        return;
    }

    if(type == 'customizeItem'){

        $('#quickViewTitle').html("Customize Item");
        let qContent = $('#quickViewContent');

        qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Name</label></div><div class="field-body"><div class="field"><div class="control"><input id="customizeItemName" class="input" type="text" maxlength="32" value="'+data.InvItem.name+'"></div></div></div></div>');
        qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Price (cp)</label></div><div class="field-body"><div class="field"><div class="control"><input id="customizeItemPrice" class="input" type="number" min="0" max="99999999" value="'+data.InvItem.price+'"></div></div></div></div>');
        qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Bulk</label></div><div class="field-body"><div class="field"><div class="control"><input class="input" id="customizeItemBulk" type="number" min="0" max="100" step="0.1" value="'+data.InvItem.bulk+'"></div></div></div></div>');
        qContent.append('<div class="field"><label class="label">Description</label><div class="control"><textarea id="customizeItemDescription" class="textarea use-custom-scrollbar">'+data.InvItem.description+'</textarea></div></div>');
        qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Size</label></div><div class="field-body"><div class="field"><div class="control"><div class="select"><select id="customizeItemSize"><option value="TINY">Tiny</option><option value="SMALL">Small</option><option value="MEDIUM">Medium</option><option value="LARGE">Large</option><option value="HUGE">Huge</option><option value="GARGANTUAN">Gargantuan</option></select></div></div></div></div></div>');
        qContent.append('<div class="field is-horizontal"><div class="field-label"><label class="label">Shoddy</label></div><div class="field-body"><div class="field"><div class="control"><label class="checkbox"><input id="customizeItemShoddy" type="checkbox"></label></div></div></div></div>');

        qContent.append('<hr class="m-2 mb-4">');

        qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Max HP</label></div><div class="field-body"><div class="field"><div class="control"><input class="input" id="customizeItemHitPoints" type="number" min="1" max="99999" value="'+data.InvItem.hitPoints+'"></div></div></div></div>');
        qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">BT</label></div><div class="field-body"><div class="field"><div class="control"><input class="input" id="customizeItemBrokenThreshold" type="number" min="0" max="99999" value="'+data.InvItem.brokenThreshold+'"></div></div></div></div>');
        qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Hardness</label></div><div class="field-body"><div class="field"><div class="control"><input class="input" id="customizeItemHardness" type="number" min="0" max="99999" value="'+data.InvItem.hardness+'"></div></div></div></div>');

        qContent.append('<div class="buttons is-centered pt-2"><button id="customizeItemSaveButton" class="button is-link">Save Changes</button></div>');


        $('#customizeItemSize').val(data.InvItem.size);
        if(data.InvItem.isShoddy == 1){
            $('#customizeItemShoddy').prop('checked', true);
        }


        $('#customizeItemSaveButton').click(function(){

            let name = $('#customizeItemName').val();
            let price = parseInt($('#customizeItemPrice').val());
            let bulk = parseFloat($('#customizeItemBulk').val());
            let description = $('#customizeItemDescription').val();
            let size = $('#customizeItemSize').val();
            let isShoddy = ($('#customizeItemShoddy').prop('checked') == true) ? 1 : 0;
            let hitPoints = parseInt($('#customizeItemHitPoints').val());
            let brokenThreshold = parseInt($('#customizeItemBrokenThreshold').val());
            let hardness = parseInt($('#customizeItemHardness').val());

            let isValid = true;

            if(name == null || name == ''){
                $('#customizeItemName').addClass('is-danger');
                isValid = false;
            } else {
                $('#customizeItemName').removeClass('is-danger');
            }

            if(price == null || price > 99999999 || price < 0 || price % 1 != 0) {
                $('#customizeItemPrice').addClass('is-danger');
                isValid = false;
            } else {
                $('#customizeItemPrice').removeClass('is-danger');
            }

            if(bulk == null || bulk > 99 || bulk < 0) {
                console.log(bulk);
                $('#customizeItemBulk').addClass('is-danger');
                isValid = false;
            } else {
                $('#customizeItemBulk').removeClass('is-danger');
            }

            if(description == '') {
                description = '―';
            }

            if(hitPoints == null || hitPoints > 99999 || hitPoints < 1 || hitPoints % 1 != 0) {
                $('#customizeItemHitPoints').addClass('is-danger');
                isValid = false;
            } else {
                $('#customizeItemHitPoints').removeClass('is-danger');
            }

            if(brokenThreshold == null|| brokenThreshold > hitPoints || brokenThreshold < 0 || brokenThreshold % 1 != 0) {
                $('#customizeItemBrokenThreshold').addClass('is-danger');
                isValid = false;
            } else {
                $('#customizeItemBrokenThreshold').removeClass('is-danger');
            }

            if(hardness == null || hardness > 99999 || hardness < 0 || hardness % 1 != 0) {
                $('#customizeItemHardness').addClass('is-danger');
                isValid = false;
            } else {
                $('#customizeItemHardness').removeClass('is-danger');
            }


            if(isValid){
                socket.emit("requestCustomizeInvItem",
                    data.InvItem.id,
                    data.InvItem.invID,
                    {
                        name: name,
                        price: price,
                        bulk: bulk,
                        description: description,
                        size: size,
                        isShoddy: isShoddy,
                        hitPoints: hitPoints,
                        brokenThreshold: brokenThreshold,
                        hardness: hardness
                    });
            }

        });


        return;
    }

    if(type == 'addItemView'){

        $('#quickViewTitle').html("Add Items");
        let qContent = $('#quickViewContent');

        qContent.append('<div><p class="control has-icons-left"><input id="allItemSearch" class="input" type="text" placeholder="Search Items in Category"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div>');

        qContent.append('<div class="tabs is-small is-centered"><ul class="category-tabs"><li><a id="itemTabAll">All</a></li><li><a id="itemTabGeneral">General</a></li><li><a id="itemTabCombat">Combat</a></li><li><a id="itemTabStorage">Storage</a></li><li><a id="itemTabCurrency">Currency</a></li></ul></div><div id="addItemListSection" class="tile is-ancestor is-vertical"></div>');

        $('#itemTabAll').click(function(){
            changeItemCategoryTab('itemTabAll', data);
        });

        $('#itemTabGeneral').click(function(){
            changeItemCategoryTab('itemTabGeneral', data);
        });

        $('#itemTabCombat').click(function(){
            changeItemCategoryTab('itemTabCombat', data);
        });

        $('#itemTabStorage').click(function(){
            changeItemCategoryTab('itemTabStorage', data);
        });

        $('#itemTabCurrency').click(function(){
            changeItemCategoryTab('itemTabCurrency', data);
        });

        $('#itemTabAll').click();

        return;
    }

}



function changeItemCategoryTab(type, data){

    $('#addItemListSection').html('');

    $('#itemTabAll').parent().removeClass("is-active");
    $('#itemTabGeneral').parent().removeClass("is-active");
    $('#itemTabCombat').parent().removeClass("is-active");
    $('#itemTabStorage').parent().removeClass("is-active");
    $('#itemTabCurrency').parent().removeClass("is-active");

    $('#allItemSearch').off('change');

    let allItemSearch = $('#allItemSearch');
    let allItemSearchInput = null;
    if(allItemSearch.val() != ''){
        allItemSearchInput = allItemSearch.val().toLowerCase();
    }

    $('#allItemSearch').change(function(){
        changeItemCategoryTab(type, data);
    });

    
    $('#'+type).parent().addClass("is-active");

    for(const [itemID, itemDataStruct] of data.ItemMap.entries()){

        let willDisplay = false;

        let itemType = itemDataStruct.Item.itemType;
        if(type == 'itemTabAll') {
            willDisplay = true;
        } else if(type == 'itemTabGeneral') {
            if(itemType == 'GENERAL' || itemType == 'KIT' || itemType == 'INGREDIENT' || itemType == 'OTHER' || itemType == 'TOOL' || itemType == 'INSTRUMENT') {
                willDisplay = true;
            }
        } else if(type == 'itemTabCombat') {
            if(itemType == 'WEAPON' || itemType == 'ARMOR') {
                willDisplay = true;
            }
        } else if(type == 'itemTabStorage') {
            if(itemType == 'STORAGE') {
                willDisplay = true;
            }
        } else if(type == 'itemTabCurrency') {
            if(itemType == 'CURRENCY') {
                willDisplay = true;
            }
        }

        if(allItemSearchInput != null){
            let itemName = itemDataStruct.Item.name.toLowerCase();
            if(!itemName.includes(allItemSearchInput)){
                willDisplay = false;
            }
        }

        if(willDisplay){
            displayAddItem(itemID, itemDataStruct, data);
        }

    }

}

function displayAddItem(itemID, itemDataStruct, data){

    if(itemDataStruct.Item.hidden == 1){
        return;
    }

    let addItemViewItemClass = 'addItemViewItem'+itemID;
    let addItemAddItemID = 'addItemAddItem'+itemID;
    let addItemChevronItemID = 'addItemChevronItemID'+itemID;
    let addItemNameID = 'addItemName'+itemID;
    let addItemDetailsItemID = 'addItemDetailsItem'+itemID;

    let itemLevel = (itemDataStruct.Item.level == 0) ? "" : "Lvl "+itemDataStruct.Item.level;

    let itemName = itemDataStruct.Item.name;
    if(itemDataStruct.Item.quantity > 1){
        itemName += ' ('+itemDataStruct.Item.quantity+')';
    }

    $('#addItemListSection').append('<div class="tile is-parent is-paddingless border-bottom border-top border-darkerer has-background-black-like cursor-clickable"><div class="tile is-child is-7 '+addItemViewItemClass+'"><p id="'+addItemNameID+'" class="has-text-left mt-1 pl-3 has-text-grey-lighter">'+itemName+'</p></div><div class="tile is-child is-2"><p class="has-text-centered is-size-7 mt-2">'+itemLevel+'</p></div><div class="tile is-child"><button id="'+addItemAddItemID+'" class="button my-1 is-small is-success is-rounded">Add</button></div><div class="tile is-child is-1 '+addItemViewItemClass+'"><span class="icon has-text-grey mt-2"><i id="'+addItemChevronItemID+'" class="fas fa-chevron-down"></i></span></div></div><div id="'+addItemDetailsItemID+'" class="tile is-parent is-vertical is-paddingless border-bottom border-darkerer is-hidden p-2 text-center"></div>');

    let rarity = itemDataStruct.Item.rarity;
    let tagsInnerHTML = '';
    switch(rarity) {
      case 'UNCOMMON': tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-primary">Uncommon</button>';
        break;
      case 'RARE': tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-success">Rare</button>';
        break;
      case 'UNIQUE': tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-danger">Unique</button>';
        break;
      default: break;
    }
    for(const tagStruct of itemDataStruct.TagArray){
        tagsInnerHTML += '<button class="button is-marginless mr-2 mb-1 is-small is-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+tagStruct.Tag.description+'">'+tagStruct.Tag.name+' '+tagStruct.TagDetails+'</button>';
    }

    if(tagsInnerHTML != ''){
        $('#'+addItemDetailsItemID).append('<div class="buttons is-marginless is-centered">'+tagsInnerHTML+'</div>');
        $('#'+addItemDetailsItemID).append('<hr class="mb-2 mt-1">');
    }


    if(itemDataStruct.WeaponData != null){

        let weapGroup = null;
        if(itemDataStruct.WeaponData.isRanged == 1){
            weapGroup = capitalizeWord(itemDataStruct.WeaponData.rangedWeaponType);
        }
        if(itemDataStruct.WeaponData.isMelee == 1){
            weapGroup = capitalizeWord(itemDataStruct.WeaponData.meleeWeaponType);
        }

        let weapCategory = capitalizeWord(itemDataStruct.WeaponData.category);
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><p><strong>Category:</strong> '+weapCategory+'</p></div><div class="tile is-child is-6"><p><strong>Group:</strong> '+weapGroup+'</p></div></div>');

        $('#'+addItemDetailsItemID).append('<hr class="m-2">');

    }

    if(itemDataStruct.ArmorData != null){

        let armorCategory = capitalizeWord(itemDataStruct.ArmorData.category);
        let armorGroup = (itemDataStruct.ArmorData.armorType == 'N/A') ? '-' : capitalizeWord(itemDataStruct.ArmorData.armorType);
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><p><strong>Category:</strong> '+armorCategory+'</p></div><div class="tile is-child is-6"><p><strong>Group:</strong> '+armorGroup+'</p></div></div>');

        $('#'+addItemDetailsItemID).append('<hr class="m-2">');

    }


    let price = getCoinToString(itemDataStruct.Item.price);
    if(itemDataStruct.Item.quantity > 1){
        price += ' for '+itemDataStruct.Item.quantity;
    }
    $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-4"><strong>Price</strong></div><div class="tile is-child is-4"><strong>Bulk</strong></div><div class="tile is-child is-4"><strong>Hands</strong></div></div>');
    $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-4"><p>'+price+'</p></div><div class="tile is-child is-4"><p>'+getBulkFromNumber(itemDataStruct.Item.bulk)+'</p></div><div class="tile is-child is-4"><p>'+getHandsToString(itemDataStruct.Item.hands)+'</p></div></div>');
    
    $('#'+addItemDetailsItemID).append('<hr class="m-2">');

        
    if(itemDataStruct.WeaponData != null){

        if(itemDataStruct.WeaponData.isMelee == 1){

            let damage = itemDataStruct.WeaponData.diceNum+""+itemDataStruct.WeaponData.dieType+" "+itemDataStruct.WeaponData.damageType;

            $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child"><strong>Damage</strong></div></div>');
            $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child"><p>'+damage+'</p></div></div>');

            $('#'+addItemDetailsItemID).append('<hr class="m-2">');

        }

        if(itemDataStruct.WeaponData.isRanged == 1){

            let damage = itemDataStruct.WeaponData.diceNum+""+itemDataStruct.WeaponData.dieType+" "+itemDataStruct.WeaponData.damageType;

            $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child"><strong>Damage</strong></div></div>');
            $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child"><p>'+damage+'</p></div></div>');

            $('#'+addItemDetailsItemID).append('<hr class="m-2">');

            let reload = itemDataStruct.WeaponData.rangedReload;
            if(reload == 0){ reload = '-'; }
            let range = itemDataStruct.WeaponData.rangedRange+" ft";
            $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><strong>Range</strong></div><div class="tile is-child is-6"><strong>Reload</strong></div></div>');
            $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><p>'+range+'</p></div><div class="tile is-child is-6"><p>'+reload+'</p></div></div>');

            $('#'+addItemDetailsItemID).append('<hr class="m-2">');

        }

    }

    if(itemDataStruct.ArmorData != null){
        
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><strong>AC Bonus</strong></div><div class="tile is-child is-6"><strong>Dex Cap</strong></div></div>');
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><p>'+signNumber(itemDataStruct.ArmorData.acBonus)+'</p></div><div class="tile is-child is-6"><p>'+signNumber(itemDataStruct.ArmorData.dexCap)+'</p></div></div>');

        $('#'+addItemDetailsItemID).append('<hr class="m-2">');

        let minStrength = (itemDataStruct.ArmorData.minStrength == 0) ? '-' : itemDataStruct.ArmorData.minStrength+'';
        let checkPenalty = (itemDataStruct.ArmorData.checkPenalty == 0) ? '-' : itemDataStruct.ArmorData.checkPenalty+'';
        let speedPenalty = (itemDataStruct.ArmorData.speedPenalty == 0) ? '-' : itemDataStruct.ArmorData.speedPenalty+' ft';
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-4"><strong>Strength</strong></div><div class="tile is-child is-4"><strong>Check Penalty</strong></div><div class="tile is-child is-4"><strong>Speed Penalty</strong></div></div>');
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-4"><p>'+minStrength+'</p></div><div class="tile is-child is-4"><p>'+checkPenalty+'</p></div><div class="tile is-child is-4"><p>'+speedPenalty+'</p></div></div>');

        $('#'+addItemDetailsItemID).append('<hr class="m-2">');

    }

    if(itemDataStruct.ShieldData != null){

        let speedPenalty = (itemDataStruct.ShieldData.speedPenalty == 0) ? '-' : itemDataStruct.ShieldData.speedPenalty+' ft';
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><strong>AC Bonus</strong></div><div class="tile is-child is-6"><strong>Speed Penalty</strong></div></div>');
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><p>'+signNumber(itemDataStruct.ShieldData.acBonus)+'</p></div><div class="tile is-child is-6"><p>'+speedPenalty+'</p></div></div>');

        $('#'+addItemDetailsItemID).append('<hr class="m-2">');

    }

    if(itemDataStruct.StorageData != null){
        
        let maxBagBulk = itemDataStruct.StorageData.maxBulkStorage;
        let bulkIgnored = itemDataStruct.StorageData.bulkIgnored;
        let bulkIgnoredMessage = "-";
        if(bulkIgnored != 0.0){
            if(bulkIgnored == maxBagBulk){
                bulkIgnoredMessage = "All Items";
            } else {
                bulkIgnoredMessage = "First "+bulkIgnored+" Bulk of Items";
            }
        }

        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><strong>Bulk Storage</strong></div><div class="tile is-child is-6"><strong>Bulk Ignored</strong></div></div>');
        $('#'+addItemDetailsItemID).append('<div class="tile"><div class="tile is-child is-6"><p>'+maxBagBulk+'</p></div><div class="tile is-child is-6"><p>'+bulkIgnoredMessage+'</p></div></div>');

        $('#'+addItemDetailsItemID).append('<hr class="m-2">');
    }

    $('#'+addItemDetailsItemID).append('<p>'+processSheetText(itemDataStruct.Item.description)+'</p>');


    $('#'+addItemAddItemID).click(function(){
        $(this).addClass('is-loading');
        socket.emit("requestAddItemToInv",
            data.InvID,
            itemID,
            itemDataStruct.Item.quantity);
    });

    $('.'+addItemViewItemClass).click(function(){
        if($('#'+addItemDetailsItemID).is(":visible")){
            $('#'+addItemDetailsItemID).addClass('is-hidden');
            $('#'+addItemChevronItemID).removeClass('fa-chevron-up');
            $('#'+addItemChevronItemID).addClass('fa-chevron-down');
            $('#'+addItemNameID).removeClass('has-text-weight-bold')
        } else {
            $('#'+addItemDetailsItemID).removeClass('is-hidden');
            $('#'+addItemChevronItemID).removeClass('fa-chevron-down');
            $('#'+addItemChevronItemID).addClass('fa-chevron-up');
            $('#'+addItemNameID).addClass('has-text-weight-bold')
        }
    });

}