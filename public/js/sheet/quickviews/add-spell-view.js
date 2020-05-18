

function openAddSpellQuickview(data){

    $('#quickViewTitle').html("Spell List");
    let qContent = $('#quickViewContent');

    qContent.append('<div class="tabs is-small is-centered is-marginless mb-1"><ul class="category-tabs"><li><a id="spellTraditionArcane">Arcane</a></li><li><a id="spellTraditionDivine">Divine</a></li><li><a id="spellTraditionOccult">Occult</a></li><li><a id="spellTraditionPrimal">Primal</a></li></ul></div>');

    qContent.append('<div class="mb-3"><p class="control has-icons-left"><input id="traditionSpellsSearch" class="input" type="text" placeholder="Search Spells in Tradition"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div>');

    qContent.append('<div id="traitionSpellListSection" class="tile is-ancestor is-vertical"></div>');

    $('#spellTraditionArcane').click(function(){
        changeSpellTraditionTab('spellTraditionArcane', 'arcane', data);
    });

    $('#spellTraditionDivine').click(function(){
        changeSpellTraditionTab('spellTraditionDivine', 'divine', data);
    });

    $('#spellTraditionOccult').click(function(){
        changeSpellTraditionTab('spellTraditionOccult', 'occult', data);
    });

    $('#spellTraditionPrimal').click(function(){
        changeSpellTraditionTab('spellTraditionPrimal', 'primal', data);
    });

    let spellList = data.SpellBook.SpellList.toUpperCase();
    if(spellList === 'ARCANE'){
        $('#spellTraditionArcane').click();
    } else if(spellList === 'DIVINE'){
        $('#spellTraditionDivine').click();
    } else if(spellList === 'OCCULT'){
        $('#spellTraditionOccult').click();
    } else if(spellList === 'PRIMAL'){
        $('#spellTraditionPrimal').click();
    }

}






function changeSpellTraditionTab(type, traditionName, data){

    $('#traitionSpellListSection').html('');

    $('#spellTraditionArcane').parent().removeClass("is-active");
    $('#spellTraditionDivine').parent().removeClass("is-active");
    $('#spellTraditionOccult').parent().removeClass("is-active");
    $('#spellTraditionPrimal').parent().removeClass("is-active");
    $('#'+type).parent().addClass("is-active");

    let traditionSpellsSearch = $('#traditionSpellsSearch');
    let traditionSpellsSearchInput = null;
    if(traditionSpellsSearch.val() != ''){
        traditionSpellsSearchInput = traditionSpellsSearch.val().toLowerCase();
        traditionSpellsSearch.addClass('is-info');
    } else {
        traditionSpellsSearch.removeClass('is-info');
    }

    $('#traditionSpellsSearch').off('change');
    $('#traditionSpellsSearch').change(function(){
        changeSpellTraditionTab(type, traditionName, data);
    });

    for(const [spellID, spellDataStruct] of data.Data.SpellMap.entries()){

        let willDisplay = false;

        let spellTraditions = JSON.parse(spellDataStruct.Spell.traditions);
        if(spellTraditions.includes(traditionName)){
            willDisplay = true;
        }


        if(traditionSpellsSearchInput != null){
            let spellName = spellDataStruct.Spell.name.toLowerCase();
            if(!spellName.includes(traditionSpellsSearchInput)){
                willDisplay = false;
            }
        }

        if(willDisplay){
            displayAddSpell(spellDataStruct, data);
        }

    }
}

function displayAddSpell(spellDataStruct, data){

    if(spellDataStruct.Spell.isArchived == 1){
        return;
    }

    let spellID = spellDataStruct.Spell.id;
    let spellLevel = (spellDataStruct.Spell.level == 0) ? "Cantrip" : "Lvl "+spellDataStruct.Spell.level;
    let spellName = spellDataStruct.Spell.name;

    let spellTradViewClass = 'addSpellFromTraditionViewSpell'+spellID;
    let spellTradAddSpellBtnWrapperID = 'addSpellBtnWrapper'+spellID;
    let spellTradAddSpellID = 'addSpellFromTraditionAddSpell'+spellID;
    let spellTradChevronSpellID = 'addSpellFromTraditionChevronSpellID'+spellID;
    let spellTradNameID = 'addSpellFromTraditionName'+spellID;
    let spellTradDetailsSpellID = 'addSpellFromTraditionDetailsSpell'+spellID;

    $('#traitionSpellListSection').append('<div class="tile is-parent is-paddingless border-bottom border-additems has-background-black-like cursor-clickable"><div class="tile is-child is-7 '+spellTradViewClass+'"><p id="'+spellTradNameID+'" class="has-text-left mt-1 pl-3 has-text-grey-lighter">'+spellName+'</p></div><div class="tile is-child is-2"><p class="has-text-centered is-size-7 mt-2">'+spellLevel+'</p></div><div id="'+spellTradAddSpellBtnWrapperID+'" class="tile is-child"></div><div class="tile is-child is-1 '+spellTradViewClass+'"><span class="icon has-text-grey mt-2"><i id="'+spellTradChevronSpellID+'" class="fas fa-chevron-down"></i></span></div></div><div id="'+spellTradDetailsSpellID+'" class="tile is-parent is-vertical is-paddingless border-bottom border-additems is-hidden p-2 text-center"></div>');

    let spellDetails = $('#'+spellTradDetailsSpellID);

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
        spellDetails.append('<div class="buttons is-marginless is-centered">'+tagsInnerHTML+'</div>');
        spellDetails.append('<hr class="mb-2 mt-1">');
    }

    // Traditions
    let traditionsString = '';
    let spellTraditions = JSON.parse(spellDataStruct.Spell.traditions);
    for(let tradition of spellTraditions){
        traditionsString += tradition+', ';
    }
    traditionsString = traditionsString.slice(0, -2);// Trim off that last ', '
    spellDetails.append('<div class="tile"><div class="tile is-child"><p class="text-left"><strong>Traditions</strong> '+traditionsString+'</p></div></div>');

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

    spellDetails.append('<div class="tile"><div class="tile is-child"><p class="text-left"><strong>Cast</strong> '+castActions+' '+componentsString+'</p></div></div>');

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

    spellDetails.append('<div class="tile"><div class="tile is-child"><p class="text-left negative-indent">'+ctrString+'</p></div></div>');


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

    spellDetails.append('<div class="tile"><div class="tile is-child"><p class="text-left negative-indent">'+ratString+'</p></div></div>');

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

    spellDetails.append('<div class="tile"><div class="tile is-child"><p class="text-left negative-indent">'+sdString+'</p></div></div>');

    spellDetails.append('<hr class="m-2">');

    spellDetails.append(processText(spellDataStruct.Spell.description, true, true, 'MEDIUM'));

    if(spellDataStruct.Spell.heightenedOneVal != null || spellDataStruct.Spell.heightenedTwoVal != null || spellDataStruct.Spell.heightenedThreeVal != null) {

        spellDetails.append('<hr class="m-2">');

        if(spellDataStruct.Spell.heightenedOneVal != null){
            let hText = '<strong>Heightened ('+getHeightenedTextFromCodeName(spellDataStruct.Spell.heightenedOneVal)+')</strong> '+spellDataStruct.Spell.heightenedOneText;
            spellDetails.append('<div class="negative-indent">'+processText(hText, true, true, 'MEDIUM')+'</div>');
        }

        if(spellDataStruct.Spell.heightenedTwoVal != null){
            let hText = '<strong>Heightened ('+getHeightenedTextFromCodeName(spellDataStruct.Spell.heightenedTwoVal)+')</strong> '+spellDataStruct.Spell.heightenedTwoText;
            spellDetails.append('<div class="negative-indent">'+processText(hText, true, true, 'MEDIUM')+'</div>');
        }

        if(spellDataStruct.Spell.heightenedThreeVal != null){
            let hText = '<strong>Heightened ('+getHeightenedTextFromCodeName(spellDataStruct.Spell.heightenedThreeVal)+')</strong> '+spellDataStruct.Spell.heightenedThreeText;
            spellDetails.append('<div class="negative-indent">'+processText(hText, true, true, 'MEDIUM')+'</div>');
        }

    }

    if(data.SpellBook.SpellBook.includes(spellDataStruct.Spell.id)) {
        $('#'+spellTradAddSpellBtnWrapperID).html('<button class="button my-1 is-small is-primary is-rounded">Added</button>');
    } else {
        $('#'+spellTradAddSpellBtnWrapperID).html('<button id="'+spellTradAddSpellID+'" class="button my-1 is-small is-success is-rounded">Add</button>');
    }

    $('#'+spellTradAddSpellID).click(function(){
        prev_spellSRC = data.SpellBook.SpellSRC;
        prev_spellData = data.Data;
        socket.emit("requestSpellAddToSpellBook",
            getCharIDFromURL(),
            data.SpellBook.SpellSRC,
            spellDataStruct.Spell.id);
        data.SpellBook.SpellBook.push(spellDataStruct.Spell.id);
        $('#'+spellTradAddSpellBtnWrapperID).html('<button class="button my-1 is-small is-primary is-rounded">Added</button>');
    });

    $('.'+spellTradViewClass).click(function(){
        if($('#'+spellTradDetailsSpellID).is(":visible")){
            $('#'+spellTradDetailsSpellID).addClass('is-hidden');
            $('#'+spellTradChevronSpellID).removeClass('fa-chevron-up');
            $('#'+spellTradChevronSpellID).addClass('fa-chevron-down');
            $('#'+spellTradNameID).removeClass('has-text-weight-bold');
        } else {
            $('#'+spellTradDetailsSpellID).removeClass('is-hidden');
            $('#'+spellTradChevronSpellID).removeClass('fa-chevron-down');
            $('#'+spellTradChevronSpellID).addClass('fa-chevron-up');
            $('#'+spellTradNameID).addClass('has-text-weight-bold');
        }
    });

}