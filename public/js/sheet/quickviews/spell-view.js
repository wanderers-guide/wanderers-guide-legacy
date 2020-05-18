
function openSpellQuickview(data){

    let spellDataStruct = data.SpellDataStruct;
    let spellID = spellDataStruct.Spell.id;
    let spellName = spellDataStruct.Spell.name;

    if(data.SheetData != null){
        let spellLevel = (spellDataStruct.Spell.level == 0) ? "Cantrip" : "Lvl "+data.SheetData.Slot.slotLevel;
        spellName += '<sup class="is-inline ml-2 is-size-7 is-italic">'+spellLevel+'</sup>';
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
                spellID);
            $('#quickviewDefault').removeClass('is-active');
        });
    }

    if(data.SpellSlotData != null){ // Clear from SpellSlots //

        qContent.append('<button id="spellClearSpellSlotBtn" class="button is-small is-danger is-outlined is-rounded is-fullwidth"><span>Clear Slot</span></button>');
        
        qContent.append('<hr class="m-2">');

        $('#spellClearSpellSlotBtn').click(function(){
            updateSpellSlot(null, data.SpellSlotData.Slot, data.SpellSlotData.SpellSRC, data.SpellSlotData.Data);
            $('#quickviewDefault').removeClass('is-active');
        });
    }

    if(data.SheetData != null){ // View and Cast from Sheet //
        
        let spellBook = g_spellBookArray.find(spellBook => {
            return spellBook.SpellSRC === data.SheetData.Slot.SpellSRC;
        });

        let spellAttack, spellDC = 0;
        if(spellBook.SpellList === 'ARCANE'){
            spellAttack = data.SheetData.Data.ArcaneSpellAttack;
            spellDC = data.SheetData.Data.ArcaneSpellDC;
        } else if(spellBook.SpellList === 'DIVINE'){
            spellAttack = data.SheetData.Data.DivineSpellAttack;
            spellDC = data.SheetData.Data.DivineSpellDC;
        } else if(spellBook.SpellList === 'OCCULT'){
            spellAttack = data.SheetData.Data.OccultSpellAttack;
            spellDC = data.SheetData.Data.OccultSpellDC;
        } else if(spellBook.SpellList === 'ARCANE'){
            spellAttack = data.SheetData.Data.PrimalSpellAttack;
            spellDC = data.SheetData.Data.PrimalSpellDC;
        }

        let abilityMod = getMod(getStatTotal('SCORE_'+data.SheetData.Slot.keyAbility));
        spellAttack += abilityMod;
        spellDC += abilityMod;

        spellAttack = signNumber(spellAttack);
        spellDC += 10;

        if(data.SheetData.Slot.used){
            qContent.append('<button id="spellUnCastSpellBtn" class="button is-small is-info is-rounded is-outlined is-fullwidth mb-2"><span>Recover</span></button>');
        } else {
            qContent.append('<button id="spellCastSpellBtn" class="button is-small is-info is-rounded is-fullwidth mb-2"><span>Cast Spell</span></button>');
        }

        qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><strong>Attack</strong></div><div class="tile is-child is-6"><strong>DC</strong></div></div>');
        qContent.append('<div class="tile text-center"><div class="tile is-child is-6"><p class="pr-1">'+spellAttack+'</p></div><div class="tile is-child is-6"><p>'+spellDC+'</p></div></div>');

        qContent.append('<hr class="m-2">');

        $('#spellCastSpellBtn').click(function(){
            if(spellDataStruct.Spell.level == 0) {
                $('#quickviewDefault').removeClass('is-active');
            } else {
                data.SheetData.Slot.used = true;
                socket.emit("requestSpellSlotUpdate",
                    getCharIDFromURL(),
                    data.SheetData.Slot);
                let spellSlotsArray = g_spellSlotsMap.get(spellBook.SpellSRC);
                if(spellSlotsArray != null){
                    spellSlotsArray = updateSlotUsed(spellSlotsArray, data.SheetData.Slot.slotID, true);
                }
                g_spellSlotsMap.set(spellBook.SpellSRC, spellSlotsArray);
                $('#quickviewDefault').removeClass('is-active');
                prepDisplayOfSpellsAndSlots();
            }
        });

        $('#spellUnCastSpellBtn').click(function(){
            data.SheetData.Slot.used = false;
            socket.emit("requestSpellSlotUpdate",
                getCharIDFromURL(),
                data.SheetData.Slot);
            let spellSlotsArray = g_spellSlotsMap.get(spellBook.SpellSRC);
            if(spellSlotsArray != null){
                spellSlotsArray = updateSlotUsed(spellSlotsArray, data.SheetData.Slot.slotID, false);
            }
            g_spellSlotsMap.set(spellBook.SpellSRC, spellSlotsArray);
            $('#quickviewDefault').removeClass('is-active');
            prepDisplayOfSpellsAndSlots();
        });


    }

    let rarity = spellDataStruct.Spell.rarity;
    let tagsInnerHTML = '';
    switch(rarity) {
    case 'UNCOMMON': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-small is-primary">Uncommon</button>';
        break;
    case 'RARE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-small is-success">Rare</button>';
        break;
    case 'UNIQUE': tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-small is-danger">Unique</button>';
        break;
    default: break;
    }
    for(const tag of spellDataStruct.Tags){
        tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-small is-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+tag.description+'">'+tag.name+'</button>';
    }

    if(tagsInnerHTML != ''){
        qContent.append('<div class="buttons is-marginless is-centered">'+tagsInnerHTML+'</div>');
        qContent.append('<hr class="mb-2 mt-1">');
    }

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
    switch(spellDataStruct.Spell.cast) {
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

    qContent.append(processText(spellDataStruct.Spell.description, true, true, 'MEDIUM'));

    if(spellDataStruct.Spell.heightenedOneVal != null || spellDataStruct.Spell.heightenedTwoVal != null || spellDataStruct.Spell.heightenedThreeVal != null) {

        qContent.append('<hr class="m-2">');

        if(spellDataStruct.Spell.heightenedOneVal != null){
            let hText = '<strong>Heightened ('+getHeightenedTextFromCodeName(spellDataStruct.Spell.heightenedOneVal)+')</strong> '+spellDataStruct.Spell.heightenedOneText;
            qContent.append('<div class="negative-indent">'+processText(hText, true, true, 'MEDIUM')+'</div>');
        }

        if(spellDataStruct.Spell.heightenedTwoVal != null){
            let hText = '<strong>Heightened ('+getHeightenedTextFromCodeName(spellDataStruct.Spell.heightenedTwoVal)+')</strong> '+spellDataStruct.Spell.heightenedTwoText;
            qContent.append('<div class="negative-indent">'+processText(hText, true, true, 'MEDIUM')+'</div>');
        }

        if(spellDataStruct.Spell.heightenedThreeVal != null){
            let hText = '<strong>Heightened ('+getHeightenedTextFromCodeName(spellDataStruct.Spell.heightenedThreeVal)+')</strong> '+spellDataStruct.Spell.heightenedThreeText;
            qContent.append('<div class="negative-indent">'+processText(hText, true, true, 'MEDIUM')+'</div>');
        }

    }

}