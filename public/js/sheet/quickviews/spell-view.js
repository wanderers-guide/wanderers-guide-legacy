
const g_tagStringLengthMax = 620; // Hardcoded - Tag String Length Max

function openSpellQuickview(data){
    addBackFunctionality(data);

    let spellDataStruct = data.SpellDataStruct;
    let spellID = spellDataStruct.Spell.id;
    let spellName = spellDataStruct.Spell.name;
    let spellHeightenLevel = null;

    let sheetSpellType = null;
    if(data.SheetData != null){
        if(data.SheetData.Slot != null) {
            sheetSpellType = 'CORE';
        } else if(data.SheetData.InnateSpell != null){
            sheetSpellType = 'INNATE';
        } else if(data.SheetData.FocusSpell != null){
            sheetSpellType = 'FOCUS';
        }
    }

    if(data.SheetData != null){
        let spellLevel = (spellDataStruct.Spell.level === 0) ? "Cantrip" : "Lvl "+spellDataStruct.Spell.level;
        let spellHeightened = null;
        if(sheetSpellType === 'CORE'){
            spellHeightened = data.SheetData.Slot.slotLevel;
        } else if(sheetSpellType === 'INNATE'){
            spellHeightened = data.SheetData.InnateSpell.SpellLevel;
        } else if(sheetSpellType === 'FOCUS'){
            let focusHeightened = Math.ceil(g_character.level/2);
            spellHeightened = (focusHeightened > spellDataStruct.Spell.level) ? focusHeightened : spellDataStruct.Spell.level;
        }
        if(spellDataStruct.Spell.level === 0) {
            let cantripHeightened = Math.ceil(g_character.level/2);
            spellHeightened = (spellHeightened > cantripHeightened) ? spellHeightened : cantripHeightened;
        }
        if(spellHeightened === null || spellDataStruct.Spell.level == spellHeightened || 
                (spellDataStruct.Spell.level === 0 && spellHeightened == 1)) {
            spellName += '<sup class="is-inline ml-2 is-size-7 is-italic">'+spellLevel+'</sup>';
            spellHeightenLevel = -1;
        } else {
            spellName += '<sup class="is-inline ml-2 is-size-7 is-italic">'+spellLevel+'<span class="icon" style="font-size: 0.8em;"><i class="fas fa-caret-right"></i></span>'+spellHeightened+'</sup>';
            spellHeightenLevel = spellHeightened;
        }
    }

    if(data.SRCTabData != null){
        let spellLevel = (data.SRCTabData.SpellLevel === 0) ? "Cantrip" : "Lvl "+data.SRCTabData.SpellLevel;
        spellName += '<sup class="is-inline ml-2 is-size-7 is-italic">'+spellLevel+'</sup>';
    }

    if(spellDataStruct.Spell.isArchived === 1){
        spellName += '<em class="pl-1">(archived)</em>';
    }

    $('#quickViewTitle').html(spellName);
    let qContent = $('#quickViewContent');

    if(data.SRCTabData != null){ // Remove from SpellBook //

        qContent.append('<button id="spellRemoveFromSpellBookBtn" class="button is-small is-danger is-outlined is-rounded is-fullwidth"><span>Remove Spell</span></button>');
        
        qContent.append('<hr class="m-2">');

        $('#spellRemoveFromSpellBookBtn').click(function(){
            prev_spellSRC = data.SRCTabData.SpellSRC;
            prev_spellData = data.SRCTabData.Data;
            socket.emit("requestSpellRemoveFromSpellBook",
                getCharIDFromURL(),
                data.SRCTabData.SpellSRC,
                spellID,
                data.SRCTabData.SpellLevel);
            closeQuickView();
        });
    }

    if(data.SpellSlotData != null){ // Clear from SpellSlots //

        qContent.append('<button id="spellClearSpellSlotBtn" class="button is-small is-danger is-outlined is-rounded is-fullwidth"><span>Clear Slot</span></button>');
        
        qContent.append('<hr class="m-2">');

        $('#spellClearSpellSlotBtn').click(function(){
            updateSpellSlot(null, data.SpellSlotData.Slot, data.SpellSlotData.SpellSRC, data.SpellSlotData.Data);
            closeQuickView();
        });
    }

    let spellTradition = null;
    let spellKeyAbility = null;
    if(data.SheetData != null){ // View and Cast from Sheet //

        let spellSRC = null;
        let spellUsed = null;
        if(sheetSpellType === 'CORE') {
            let spellBook = g_spellBookArray.find(spellBook => {
                return spellBook.SpellSRC === data.SheetData.Slot.SpellSRC;
            });
            spellTradition = spellBook.SpellList;
            spellSRC = spellBook.SpellSRC;
            spellKeyAbility = spellBook.SpellKeyAbility;
            spellUsed = data.SheetData.Slot.used;
        } else if(sheetSpellType === 'FOCUS') {
            let spellBook = g_spellBookArray.find(spellBook => {
                return spellBook.SpellSRC === data.SheetData.FocusSpell.SpellSRC;
            });
            spellTradition = spellBook.SpellList;
            spellSRC = spellBook.SpellSRC;
            spellKeyAbility = spellBook.SpellKeyAbility;
            spellUsed = !g_focusOpenPoint;
        } else if(sheetSpellType === 'INNATE') {
            spellTradition = data.SheetData.InnateSpell.SpellTradition;
            spellKeyAbility = data.SheetData.InnateSpell.KeyAbility;
        }

        $('#quickViewTitleRight').html('<span class="pr-2">'+capitalizeWord(spellTradition)+'</span>');

        let spellAttack, spellDC = 0;
        if(spellTradition === 'ARCANE'){
            spellAttack = data.SheetData.Data.ArcaneSpellAttack;
            spellDC = data.SheetData.Data.ArcaneSpellDC;
        } else if(spellTradition === 'DIVINE'){
            spellAttack = data.SheetData.Data.DivineSpellAttack;
            spellDC = data.SheetData.Data.DivineSpellDC;
        } else if(spellTradition === 'OCCULT'){
            spellAttack = data.SheetData.Data.OccultSpellAttack;
            spellDC = data.SheetData.Data.OccultSpellDC;
        } else if(spellTradition === 'PRIMAL'){
            spellAttack = data.SheetData.Data.PrimalSpellAttack;
            spellDC = data.SheetData.Data.PrimalSpellDC;
        }

        /*
            "You're always trained in spell attack rolls and spell DCs
            for your innate spells, even if you aren't otherwise trained
            in spell attack rolls or spell DCs. If your proficiency in
            spell attack rolls or spell DCs is expert or better, apply
            that proficiency to your innate spells, too."
        */
        if(sheetSpellType === 'INNATE'){
            let trainingProf = getProfNumber(1, g_character.level);
            spellAttack = (trainingProf > spellAttack) ? trainingProf : spellAttack;
            spellDC = (trainingProf > spellDC) ? trainingProf : spellDC;
        }

        let abilityMod = getModOfValue(spellKeyAbility);
        spellAttack += abilityMod;
        spellDC += abilityMod;

        spellAttack = signNumber(spellAttack);
        spellDC += 10;

        if(sheetSpellType === 'CORE' || sheetSpellType === 'FOCUS') {
            if(spellUsed){
                qContent.append('<button id="spellUnCastSpellBtn" class="button is-small is-info is-rounded is-outlined is-fullwidth mb-2"><span>Recover</span></button>');
            } else {
                qContent.append('<button id="spellCastSpellBtn" class="button is-small is-info is-rounded is-fullwidth mb-2"><span>Cast Spell</span></button>');
            }
        }

        qContent.append('<div class="columns is-mobile is-marginless text-center"><div class="column is-paddingless is-6"><strong>Attack</strong></div><div class="column is-paddingless is-6"><strong>DC</strong></div></div>');
        qContent.append('<div class="columns is-mobile is-marginless text-center"><div class="column is-paddingless is-6"><p class="pr-1">'+spellAttack+'</p></div><div class="column is-paddingless is-6"><p>'+spellDC+'</p></div></div>');

        qContent.append('<hr class="m-2">');

        if(sheetSpellType === 'CORE') {
            $('#spellCastSpellBtn').click(function(){
                if(spellDataStruct.Spell.level == 0) {
                    closeQuickView();
                } else {
                    data.SheetData.Slot.used = true;
                    socket.emit("requestSpellSlotUpdate",
                        getCharIDFromURL(),
                        data.SheetData.Slot);
                    let spellSlotsArray = g_spellSlotsMap.get(spellSRC);
                    if(spellSlotsArray != null){
                        spellSlotsArray = updateSlotUsed(spellSlotsArray, data.SheetData.Slot.slotID, true);
                    }
                    g_spellSlotsMap.set(spellSRC, spellSlotsArray);
                    closeQuickView();
                    prepDisplayOfSpellsAndSlots();
                }
            });
    
            $('#spellUnCastSpellBtn').click(function(){
                data.SheetData.Slot.used = false;
                socket.emit("requestSpellSlotUpdate",
                    getCharIDFromURL(),
                    data.SheetData.Slot);
                let spellSlotsArray = g_spellSlotsMap.get(spellSRC);
                if(spellSlotsArray != null){
                    spellSlotsArray = updateSlotUsed(spellSlotsArray, data.SheetData.Slot.slotID, false);
                }
                g_spellSlotsMap.set(spellSRC, spellSlotsArray);
                closeQuickView();
                prepDisplayOfSpellsAndSlots();
            });
        }

        if(sheetSpellType === 'FOCUS') {
            $('#spellCastSpellBtn').click(function(){
                if(spellDataStruct.Spell.level != 0) {
                    displayFocusCastingsSet('ADD');
                }
                closeQuickView();
            });
    
            $('#spellUnCastSpellBtn').click(function(){
                displayFocusCastingsSet('REMOVE');
                closeQuickView();
            });
        }

    }

    let rarity = spellDataStruct.Spell.rarity;
    let tagsInnerHTML = '';
    switch(rarity) {
    case 'UNCOMMON': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-primary">Uncommon</button>';
        break;
    case 'RARE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-success">Rare</button>';
        break;
    case 'UNIQUE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-danger">Unique</button>';
        break;
    default: break;
    }

    spellDataStruct.Tags = spellDataStruct.Tags.sort(
        function(a, b) {
            return a.name > b.name ? 1 : -1;
        }
    );
    for(const tag of spellDataStruct.Tags){
        let tagDescription = tag.description;
        if(tagDescription.length > g_tagStringLengthMax){
            tagDescription = tagDescription.substring(0, g_tagStringLengthMax);
            tagDescription += '...';
        }
        tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-info has-tooltip-bottom has-tooltip-multiline tagButton" data-tooltip="'+tagDescription+'">'+tag.name+'</button>';
    }

    if(tagsInnerHTML != ''){
        qContent.append('<div class="buttons is-marginless is-centered">'+tagsInnerHTML+'</div>');
        qContent.append('<hr class="mb-2 mt-1">');
    }

    $('.tagButton').click(function(){
        let tagName = $(this).text();
        let tagArray = spellDataStruct.Tags;
        openQuickView('tagView', {
            TagName : tagName,
            TagArray : tagArray,
            _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
        });
    });

    // Traditions
    if(data.SheetData == null){
        let traditionsString = '';
        let spellTraditions = JSON.parse(spellDataStruct.Spell.traditions);
        for(let tradition of spellTraditions){
            traditionsString += tradition+', ';
        }
        traditionsString = traditionsString.slice(0, -2);// Trim off that last ', '
        qContent.append('<div class="tile"><div class="tile is-child"><p class="text-left"><strong>Traditions</strong> '+traditionsString+'</p></div></div>');
    }

    // Cast
    let castActions = null;
    let wrapComponents = false;
    switch(spellDataStruct.Spell.cast) {
        case 'FREE_ACTION': castActions = '<span class="pf-icon">[free-action]</span>'; break;
        case 'REACTION': castActions = '<span class="pf-icon">[reaction]</span>'; break;
        case 'ACTION': castActions = '<span class="pf-icon">[one-action]</span>'; break;
        case 'TWO_ACTIONS': castActions = '<span class="pf-icon">[two-actions]</span>'; break;
        case 'THREE_ACTIONS': castActions = '<span class="pf-icon">[three-actions]</span>'; break;
        case 'ONE_TO_THREE_ACTIONS': castActions = '<span class="pf-icon">[one-action]</span><span> to </span><span class="pf-icon">[three-actions]</span>'; break;
        case 'ONE_TO_TWO_ACTIONS': castActions = '<span class="pf-icon">[one-action]</span><span> to </span><span class="pf-icon">[two-actions]</span>'; break;
        case 'TWO_TO_THREE_ACTIONS': castActions = '<span class="pf-icon">[two-actions]</span><span> to </span><span class="pf-icon">[three-actions]</span>'; break;
        case 'ONE_MINUTE': castActions = '<span>1 minute</span>'; wrapComponents = true; break;
        case 'FIVE_MINUTES': castActions = '<span>5 minutes</span>'; wrapComponents = true; break;
        case 'TEN_MINUTES': castActions = '<span>10 minutes</span>'; wrapComponents = true; break;
        case 'ONE_HOUR': castActions = '<span>1 hour</span>'; wrapComponents = true; break;
        case 'EIGHT_HOURS': castActions = '<span>8 hours</span>'; wrapComponents = true; break;
        case 'ONE_DAY': castActions = '<span>24 hours</span>'; wrapComponents = true; break;
        default: break;
    }

    let componentsString = '';
    let spellComponents = JSON.parse(spellDataStruct.Spell.castingComponents);
    for(let components of spellComponents){
        componentsString += components+', ';
    }
    componentsString = componentsString.slice(0, -2);// Trim off that last ', '
    if(wrapComponents && componentsString != ''){
        componentsString = '('+componentsString+')';
    }

    qContent.append('<div class="tile"><div class="tile is-child"><p class="text-left"><strong>Cast</strong> '+castActions+' '+componentsString+'</p></div></div>');

    // Cost // Trigger // Requirements // 
    let ctrString = '';

    let spellCost = '';
    if(spellDataStruct.Spell.cost != null){
        spellCost = '<strong>Cost</strong> '+spellDataStruct.Spell.cost+'; ';
    }
    ctrString += spellCost;

    let spellTrigger = '';
    if(spellDataStruct.Spell.trigger != null){
        spellTrigger = '<strong>Trigger</strong> '+spellDataStruct.Spell.trigger+'; ';
    }
    ctrString += spellTrigger;

    let spellRequirements = '';
    if(spellDataStruct.Spell.requirements != null){
        spellRequirements = '<strong>Requirements</strong> '+spellDataStruct.Spell.requirements+'; ';
    }
    ctrString += spellRequirements;
    ctrString = ctrString.slice(0, -2);// Trim off that last '; '

    qContent.append('<div class="tile"><div class="tile is-child"><p class="text-left negative-indent">'+ctrString+'</p></div></div>');


    // Range // Area // Targets //
    let ratString = '';

    let spellRange = '';
    if(spellDataStruct.Spell.range != null){
        spellRange = '<strong>Range</strong> '+spellDataStruct.Spell.range+'; ';
    }
    ratString += spellRange;

    let spellArea = '';
    if(spellDataStruct.Spell.area != null){
        spellArea = '<strong>Area</strong> '+spellDataStruct.Spell.area+'; ';
    }
    ratString += spellArea;

    let spellTargets = '';
    if(spellDataStruct.Spell.targets != null){
        spellTargets = '<strong>Targets</strong> '+spellDataStruct.Spell.targets+'; ';
    }
    ratString += spellTargets;
    ratString = ratString.slice(0, -2);// Trim off that last '; '

    qContent.append('<div class="tile"><div class="tile is-child"><p class="text-left negative-indent">'+ratString+'</p></div></div>');

    // Saving Throw // Duration //
    let sdString = '';

    let savingThrowType = null;
    switch(spellDataStruct.Spell.savingThrow) {
        case 'FORT': savingThrowType = 'Fortitude'; break;
        case 'REFLEX': savingThrowType = 'Reflex'; break;
        case 'WILL': savingThrowType = 'Will'; break;
        case 'BASIC_FORT': savingThrowType = 'basic Fortitude'; break;
        case 'BASIC_REFLEX': savingThrowType = 'basic Reflex'; break;
        case 'BASIC_WILL': savingThrowType = 'basic Will'; break;
        default: break;
    }
    if(savingThrowType != null){
        sdString += '<strong>Saving Throw</strong> '+savingThrowType+'; ';
    }

    let spellDuration = '';
    if(spellDataStruct.Spell.duration != null){
        spellDuration = '<strong>Duration</strong> '+spellDataStruct.Spell.duration+'; ';
    }
    sdString += spellDuration;
    sdString = sdString.slice(0, -2);// Trim off that last '; '

    qContent.append('<div class="tile"><div class="tile is-child"><p class="text-left negative-indent">'+sdString+'</p></div></div>');

    qContent.append('<hr class="m-2">');

    let spellDescription = spellDataStruct.Spell.description;
    if(spellKeyAbility != null){
        spellDescription = spellViewTextProcessor(spellDescription, spellKeyAbility);
    }
    qContent.append(processText(spellDescription, true, true, 'MEDIUM'));

    if(spellDataStruct.Spell.heightenedOneVal != null || spellDataStruct.Spell.heightenedTwoVal != null || spellDataStruct.Spell.heightenedThreeVal != null) {

        if(!gOption_hasAutoHeightenSpells || spellHeightenLevel == null){

            qContent.append('<hr class="m-2">');

            if(spellDataStruct.Spell.heightenedOneVal != null){
                let heightenedTextName = getHeightenedTextFromCodeName(spellDataStruct.Spell.heightenedOneVal);
                let hText;
                if(heightenedTextName === "CUSTOM"){
                    hText = '<strong>Heightened</strong> '+spellDataStruct.Spell.heightenedOneText;
                } else {
                    hText = '<strong>Heightened ('+heightenedTextName+')</strong> '+spellDataStruct.Spell.heightenedOneText;
                }
                if(spellKeyAbility != null){
                    hText = spellViewTextProcessor(hText, spellKeyAbility);
                }
                qContent.append('<div class="negative-indent">'+processText(hText, true, true, 'MEDIUM')+'</div>');
            }
    
            if(spellDataStruct.Spell.heightenedTwoVal != null){
                let hText = '<strong>Heightened ('+getHeightenedTextFromCodeName(spellDataStruct.Spell.heightenedTwoVal)+')</strong> '+spellDataStruct.Spell.heightenedTwoText;
                if(spellKeyAbility != null){
                    hText = spellViewTextProcessor(hText, spellKeyAbility);
                }
                qContent.append('<div class="negative-indent">'+processText(hText, true, true, 'MEDIUM')+'</div>');
            }
    
            if(spellDataStruct.Spell.heightenedThreeVal != null){
                let hText = '<strong>Heightened ('+getHeightenedTextFromCodeName(spellDataStruct.Spell.heightenedThreeVal)+')</strong> '+spellDataStruct.Spell.heightenedThreeText;
                if(spellKeyAbility != null){
                    hText = spellViewTextProcessor(hText, spellKeyAbility);
                }
                qContent.append('<div class="negative-indent">'+processText(hText, true, true, 'MEDIUM')+'</div>');
            }
    
            if(spellDataStruct.Spell.heightenedFourVal != null){
                let hText = '<strong>Heightened ('+getHeightenedTextFromCodeName(spellDataStruct.Spell.heightenedFourVal)+')</strong> '+spellDataStruct.Spell.heightenedFourText;
                if(spellKeyAbility != null){
                    hText = spellViewTextProcessor(hText, spellKeyAbility);
                }
                qContent.append('<div class="negative-indent">'+processText(hText, true, true, 'MEDIUM')+'</div>');
            }

        } else {
            if(spellHeightenLevel != -1){

                let qContentToAdd = '<hr class="m-2">';

                let hText = '<div><p><strong>Heightened</strong></p></div>';

                let heightenedOneCount = getHeightenedCount(spellDataStruct.Spell.level, spellHeightenLevel, spellDataStruct.Spell.heightenedOneVal);
                hText += getAutoHeightenedSpellText(heightenedOneCount, spellDataStruct.Spell.heightenedOneText);

                let heightenedTwoCount = getHeightenedCount(spellDataStruct.Spell.level, spellHeightenLevel, spellDataStruct.Spell.heightenedTwoVal);
                hText += getAutoHeightenedSpellText(heightenedTwoCount, spellDataStruct.Spell.heightenedTwoText);

                let heightenedThreeCount = getHeightenedCount(spellDataStruct.Spell.level, spellHeightenLevel, spellDataStruct.Spell.heightenedThreeVal);
                hText += getAutoHeightenedSpellText(heightenedThreeCount, spellDataStruct.Spell.heightenedThreeText);

                let heightenedFourCount = getHeightenedCount(spellDataStruct.Spell.level, spellHeightenLevel, spellDataStruct.Spell.heightenedFourVal);
                hText += getAutoHeightenedSpellText(heightenedFourCount, spellDataStruct.Spell.heightenedFourText);

                if(spellKeyAbility != null){
                    hText = spellViewTextProcessor(hText, spellKeyAbility);
                }
                qContentToAdd += '<div class="negative-indent">'+processText(hText, true, true, 'MEDIUM')+'</div>';

                if(heightenedOneCount > 0 || heightenedTwoCount > 0 || heightenedThreeCount > 0 || heightenedFourCount > 0){
                    qContent.append(qContentToAdd);
                }

            }
        }

    }

}


function spellViewTextProcessor(text, spellKeyAbility){

    text = text.replace('equal to your spellcasting ability modifier', '{'+spellKeyAbility+'_MOD|'+lengthenAbilityType(spellKeyAbility)+' Modifier}');
    text = text.replace('your spellcasting ability modifier', '{'+spellKeyAbility+'_MOD|'+lengthenAbilityType(spellKeyAbility)+' Modifier}');

    return text;
}

let g_tempAutoHeightenCount = null;
function getAutoHeightenedSpellText(hCount, hText){
    if(hCount <= 0){ return ''; }
    g_tempAutoHeightenCount = hCount;

    let text = hText;
    text = text.replace(/by (\d+)d(\d+)([ .]|$)/g, handleSpellAutoHeightenedIncrease);
    text = text.replace(/by (\d+)d(\d+)\+(\d+)([ .]|$)/g, handleSpellAutoHeightenedIncreaseBonus);        

    if(text === hText){
        text = '';
        for (let i = 0; i < hCount; i++) {
            text += '~ : '+hText;
        }
    } else {
        text = '~ : '+text;
    }

    g_tempAutoHeightenCount = null;
    return text;

}

function handleSpellAutoHeightenedIncrease(match, dieAmount, dieType, endingChar){
    dieAmount = dieAmount*g_tempAutoHeightenCount;
    return 'by '+dieAmount+'d'+dieType+''+endingChar;
}

function handleSpellAutoHeightenedIncreaseBonus(match, dieAmount, dieType, bonusAmount, endingChar){
    dieAmount = dieAmount*g_tempAutoHeightenCount;
    bonusAmount = bonusAmount*g_tempAutoHeightenCount;
    return 'by '+dieAmount+'d'+dieType+'+'+bonusAmount+''+endingChar;
}