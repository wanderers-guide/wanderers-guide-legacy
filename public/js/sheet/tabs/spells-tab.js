/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openSpellTab(data) {

    $('#tabContent').append('<div id="spellsTabs" class="tabs is-centered is-marginless"><ul class="spell-tabs"><li><a id="spellsTabCore">Core</a></li><li><a id="spellsTabFocus">Focus</a></li><li><a id="spellsTabInnate">Innate</a></li></ul></div>');

    $('#tabContent').append('<div id="spellsTabContent"></div>');

    let sourceCount = 0;
    if(g_spellSlotsMap.size != 0){
        $('#spellsTabCore').click(function(){
            changeSpellsTab('spellsTabCore');
        });
        sourceCount++;
    } else {
        $('#spellsTabCore').addClass('is-hidden');
    }

    if(g_focusSpellMap.size != 0){
        $('#spellsTabFocus').click(function(){
            changeSpellsTab('spellsTabFocus');
        });
        sourceCount++;
    } else {
        $('#spellsTabFocus').addClass('is-hidden');
    }

    if(g_innateSpellArray.length != 0){
        $('#spellsTabInnate').click(function(){
            changeSpellsTab('spellsTabInnate');
        });
        sourceCount++;
    } else {
        $('#spellsTabInnate').addClass('is-hidden');
    }

    if(sourceCount === 1){
        $('#spellsTabs').addClass('is-hidden');
    }

    if(g_selectedSpellSubTabID == null){
        if(g_spellSlotsMap.size != 0){
            $('#spellsTabCore').click();
        } else if(g_focusSpellMap.size != 0){
            $('#spellsTabFocus').click();
        } else {
            $('#spellsTabInnate').click();
        }
    } else {
        $('#'+g_selectedSpellSubTabID).click();
    }

}

// Spells Tabs //
function changeSpellsTab(type){
    if(!g_selectedSubTabLock) {g_selectedSubTabID = type;}
    g_selectedSpellSubTabID = type;

    $('#spellsTabContent').html('');

    $('#spellsTabCore').parent().removeClass("is-active");
    $('#spellsTabFocus').parent().removeClass("is-active");
    $('#spellsTabInnate').parent().removeClass("is-active");

    $('#'+type).parent().addClass("is-active");

    switch(type) {
        case 'spellsTabCore': displaySpellsCore(); break;
        case 'spellsTabFocus': displaySpellsFocus(); break;
        case 'spellsTabInnate': displaySpellsInnate(); break;
        default: break;
    }

}


// Core Spells //
let g_hasCastingPrepared = false;
let g_hasCastingSpontaneous = false;

function displaySpellsCore() {

    $('#spellsTabContent').append('<div class="columns is-mobile is-marginless"><div class="column is-9"><p class="control has-icons-left"><input id="spellsSearch" class="input" type="text" placeholder="Search Spells"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div><div class="column is-3"><button id="manageSpellsBtn" class="button is-info is-rounded">Manage Spells</button></div></div><div id="spellsCoreContent" class="use-custom-scrollbar" style="height: 525px; max-height: 525px; overflow-y: auto;"></div>');
        
    prepDisplayOfSpellsAndSlots();

}


function prepDisplayOfSpellsAndSlots(){

    let data = {
        ArcaneSpellAttack : getStatTotal('ARCANE_SPELL_ATTACK'),
        OccultSpellAttack : getStatTotal('OCCULT_SPELL_ATTACK'),
        PrimalSpellAttack : getStatTotal('PRIMAL_SPELL_ATTACK'),
        DivineSpellAttack : getStatTotal('DIVINE_SPELL_ATTACK'),
        ArcaneSpellDC : getStatTotal('ARCANE_SPELL_DC'),
        OccultSpellDC : getStatTotal('OCCULT_SPELL_DC'),
        PrimalSpellDC : getStatTotal('PRIMAL_SPELL_DC'),
        DivineSpellDC : getStatTotal('DIVINE_SPELL_DC'),
        SpellSlotsMap : g_spellSlotsMap,
        SpellMap : g_spellMap,
    };

    $('#manageSpellsBtn').off('click');
    $('#manageSpellsBtn').click(function(){
        openManageSpellsModal(data);
    });


    // Reorganize SpellSlotMap to by Level //
    let spellSlotMap = new Map();
    for(const [spellSRC, spellSlotArray] of data.SpellSlotsMap.entries()){
        for(let spellSlot of spellSlotArray) {
            let spellSlotMapArray = [];
            if(spellSlotMap.has(spellSlot.slotLevel)){
                spellSlotMapArray = spellSlotMap.get(spellSlot.slotLevel);
            }
            spellSlot.SpellSRC = spellSRC;
            spellSlotMapArray.push(spellSlot);
            spellSlotMap.set(spellSlot.slotLevel, spellSlotMapArray);
        }
    }

    displaySpellsAndSlots(spellSlotMap, data);

}


function displaySpellsAndSlots(spellSlotMap, data){

    let spellsSearch = $('#spellsSearch');
    let spellsSearchInput = null;
    if(spellsSearch.val() != ''){
        spellsSearchInput = spellsSearch.val().toLowerCase();
        spellsSearch.addClass('is-info');
    } else {
        spellsSearch.removeClass('is-info');
    }

    $('#spellsSearch').off('change');
    $('#spellsSearch').change(function(){
        displaySpellsAndSlots(spellSlotMap, data);
    });
    
    $('#spellsCoreContent').html('');
    g_hasCastingPrepared = false;
    g_hasCastingSpontaneous = false;

    // Prepared //
    $('#spellsCoreContent').append('<p class="castingTypeTitle is-hidden is-size-3 is-family-secondary has-text-grey-light">Prepared</p>');
    if(spellsSearchInput != null){
        if(spellsSearchInput === 'cantrip' || spellsSearchInput === 'cantrips') {
            displaySpellsInLevelPrepared(0, spellSlotMap.get(0), data, null);
            return;
        } else {
            const foundStruct = spellsSearchInput.match(/^(level|lvl) ([0-9]|10)\s*$/);
            if(foundStruct != null){
                let level = parseInt(foundStruct[2]);
                displaySpellsInLevelPrepared(level, spellSlotMap.get(level), data, null);
                return;
            }
        }
    }
    for(const [level, slotArray] of spellSlotMap.entries()){
        displaySpellsInLevelPrepared(level, slotArray, data, spellsSearchInput);
    }

    // Spontaneous //
    $('#spellsCoreContent').append('<p class="castingTypeTitle is-hidden is-size-3 mt-3 is-family-secondary has-text-grey-light">Spontaneous</p>');
    if(spellsSearchInput != null){
        if(spellsSearchInput === 'cantrip' || spellsSearchInput === 'cantrips') {
            displaySpellsInLevelSpontaneous(0, spellSlotMap.get(0), data, null);
            return;
        } else {
            const foundStruct = spellsSearchInput.match(/^(level|lvl) ([0-9]|10)\s*$/);
            if(foundStruct != null){
                let level = parseInt(foundStruct[2]);
                displaySpellsInLevelSpontaneous(level, spellSlotMap.get(level), data, null);
                return;
            }
        }
    }
    for(const [level, slotArray] of spellSlotMap.entries()){
        displaySpellsInLevelSpontaneous(level, slotArray, data, spellsSearchInput);
    }

    // Distinguish prepared spells from spontaneous if the character has both
    if(g_hasCastingPrepared && g_hasCastingSpontaneous){
        $('.castingTypeTitle').removeClass('is-hidden');
    }

}


function displaySpellsInLevelPrepared(level, slotArray, data, spellsSearchInput) {
    if(slotArray == null) {return;}

    let sectionName = (level == 0) ? 'Cantrips' : 'Level '+level;
    let spellListSectionID = 'preparedSpellTabListSectionByLevel'+level;
    $('#spellsCoreContent').append('<div id="'+spellListSectionID+'"></div>');

    let didDisplayALevel = false;
    for(let slot of slotArray){

        let spellBook = g_spellBookArray.find(spellBook => {
            return spellBook.SpellSRC === slot.SpellSRC;
        });
        if(spellBook.SpellCastingType !== 'PREPARED-BOOK' &&
                spellBook.SpellCastingType !== 'PREPARED-FAMILIAR' &&
                spellBook.SpellCastingType !== 'PREPARED-LIST'){
            continue;
        }

        let spellSlotID = 'preparedSpellSlot'+slot.slotID;
        
        let spellDataStruct = data.SpellMap.get(slot.spellID+"");

        /// Filter Thru Search ///
        let willDisplay = true;
        if(spellsSearchInput != null){
            if(spellDataStruct != null) {
                let spellName = spellDataStruct.Spell.name.toLowerCase();
                if(!spellName.includes(spellsSearchInput)){
                    willDisplay = false;
                }
            } else {
                willDisplay = false;
            }
        }
        if(!willDisplay){continue;}
        didDisplayALevel = true;


        /// Display Spell Listing ///
        if(spellDataStruct != null) {
            
            // Name //
            let spellName = '<strong class="has-text-grey-light">'+spellDataStruct.Spell.name+'</strong>';

            if(spellDataStruct.Spell.isArchived === 1){
                spellName += '<em class="pl-1">(archived)</em>';
            }
            
            // Cast Actions //
            let spellCast = null;
            switch(spellDataStruct.Spell.cast) {
                case 'FREE_ACTION': spellCast = '<span class="pf-icon">[free-action]</span>'; break;
                case 'REACTION': spellCast = '<span class="pf-icon">[reaction]</span>'; break;
                case 'ACTION': spellCast = '<span class="pf-icon">[one-action]</span>'; break;
                case 'TWO_ACTIONS': spellCast = '<span class="pf-icon">[two-actions]</span>'; break;
                case 'THREE_ACTIONS': spellCast = '<span class="pf-icon">[three-actions]</span>'; break;
                case 'ONE_TO_THREE_ACTIONS': spellCast = '<span class="pf-icon">[one-action]</span><span> to </span><span class="pf-icon">[three-actions]</span>'; break;
                case 'ONE_TO_TWO_ACTIONS': spellCast = '<span class="pf-icon">[one-action]</span><span> to </span><span class="pf-icon">[two-actions]</span>'; break;
                case 'TWO_TO_THREE_ACTIONS': spellCast = '<span class="pf-icon">[two-actions]</span><span> to </span><span class="pf-icon">[three-actions]</span>'; break;
                default: spellCast = '<em>see spell</em>'; break;
            }

            // Range //
            let spellRange = (spellDataStruct.Spell.range != null) ? spellDataStruct.Spell.range : '-';

            // Tags //
            let tagsInnerHTML = '<div class="buttons is-marginless is-centered">';
            for(const tag of spellDataStruct.Tags){
                tagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-very-small is-info">'+tag.name+'</button>';
            }
            tagsInnerHTML += '</div>';

            $('#spellsCoreContent').append('<div id="'+spellSlotID+'" class="columns is-mobile is-marginless cursor-clickable"><div class="column is-5 is-paddingless"><p class="has-text-left pl-3 pt-1">'+spellName+'</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light pt-1">'+spellCast+'</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light pt-1">'+spellRange+'</p></div><div class="column is-5 is-paddingless"><p class="text-center has-text-grey-light">'+tagsInnerHTML+'</p></div></div>');

            $('#'+spellSlotID).click(function(){
                openQuickView('spellView', {
                    SpellDataStruct: spellDataStruct,
                    SheetData: {Slot: slot, Data: data},
                });
            });

            if(slot.used) {
                $('#'+spellSlotID).addClass('has-empty-slot-background');
                $('#'+spellSlotID).find(".has-text-grey-light").removeClass("has-text-grey-light").addClass("has-text-grey");
            }

        } else {
            $('#spellsCoreContent').append('<div id="'+spellSlotID+'" class="columns is-mobile is-marginless"><div class="column is-5 is-paddingless"><p class="has-text-left pl-4 has-text-grey-light">-</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light">-</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light">-</p></div><div class="column is-5 is-paddingless"><p class="text-center has-text-grey-light">-</p></div></div>');
        }

        $('#'+spellSlotID).mouseenter(function(){
            $(this).addClass('has-background-grey-darker');
        });
        $('#'+spellSlotID).mouseleave(function(){
            $(this).removeClass('has-background-grey-darker');
        });
        
    }

    if(didDisplayALevel){
        g_hasCastingPrepared = true;

        $('#'+spellListSectionID).append('<p class="is-size-5 has-text-grey-kinda-light has-text-weight-bold text-left pl-5">'+sectionName+'</p>');
        $('#'+spellListSectionID).append('<hr class="hr-highlighted" style="margin-top:-0.5em; margin-bottom:0em;">');
        $('#'+spellListSectionID).append('<div class="columns is-mobile pt-1 is-marginless"><div class="column is-5 is-paddingless"><p class="has-text-left pl-3"><strong class="has-text-grey-kinda-light"><u>Name</u></strong></p></div><div class="column is-1 is-paddingless"><p class="text-center"><strong class="has-text-grey-kinda-light"><u>Cast</u></strong></p></div><div class="column is-1 is-paddingless"><p class="text-center"><strong class="has-text-grey-kinda-light"><u>Range</u></strong></p></div><div class="column is-5 is-paddingless"><p class="text-center"><strong class="has-text-grey-kinda-light"><u>Traits</u></strong></p></div></div>');
    }

}



function displaySpellsInLevelSpontaneous(level, slotArray, data, spellsSearchInput) {
    if(slotArray == null) {return;}

    let filteredSlotArray = [];
    for(let slot of slotArray){
        let spellBook = g_spellBookArray.find(spellBook => {
            return spellBook.SpellSRC === slot.SpellSRC;
        });
        if(spellBook.SpellCastingType === 'SPONTANEOUS-REPERTOIRE'){
            filteredSlotArray.push(slot);
        }
    }
    filteredSlotArray = filteredSlotArray.sort(
        function(a, b) {
            return (a.used && !b.used) ? -1 : 1;
        }
    );

    // If a level has no spell slots, don't display anything for that level
    let hasSlotsAtLevel = (filteredSlotArray.length > 0);
    if(!hasSlotsAtLevel) {return;}

    let sectionName = (level == 0) ? 'Cantrips' : 'Level '+level;
    let spellListSectionID = 'spontaneousSpellTabListSectionByLevel'+level;
    $('#spellsCoreContent').append('<div id="'+spellListSectionID+'"></div>');

    let spellBookArray = [];
    for(let spellBook of g_spellBookArray){
        if(spellBook.SpellCastingType === 'SPONTANEOUS-REPERTOIRE' && !spellBook.IsFocus) {
            spellBookArray.push(spellBook);
        }
    }

    let spellListingSponClass = 'spellSponListingClass'+level;
    let spellListingCount = 0;
    let didDisplaySpellAtLevel = false;
    for(let spellBookData of spellBookArray) {
        for(let spellData of spellBookData.SpellBook){
            if(spellData.SpellLevel != level){continue;}

            let spellSponListingID = 'spellSponListing'+spellListingCount+'L'+level;

            let spellDataStruct = data.SpellMap.get(spellData.SpellID+"");

            /// Filter Thru Search ///
            let willDisplay = true;
            if(spellsSearchInput != null){
                if(spellDataStruct != null) {
                    let spellName = spellDataStruct.Spell.name.toLowerCase();
                    if(!spellName.includes(spellsSearchInput)){
                        willDisplay = false;
                    }
                } else {
                    willDisplay = false;
                }
            }
            if(!willDisplay){continue;}
            didDisplaySpellAtLevel = true;

            /// Display Spell Listing ///
            if(spellDataStruct != null) {
                
                // Name //
                let spellName = '<strong class="has-text-grey-light">'+spellDataStruct.Spell.name+'</strong>';

                if(spellDataStruct.Spell.isArchived === 1){
                    spellName += '<em class="pl-1">(archived)</em>';
                }
                
                // Cast Actions //
                let spellCast = null;
                switch(spellDataStruct.Spell.cast) {
                    case 'FREE_ACTION': spellCast = '<span class="pf-icon">[free-action]</span>'; break;
                    case 'REACTION': spellCast = '<span class="pf-icon">[reaction]</span>'; break;
                    case 'ACTION': spellCast = '<span class="pf-icon">[one-action]</span>'; break;
                    case 'TWO_ACTIONS': spellCast = '<span class="pf-icon">[two-actions]</span>'; break;
                    case 'THREE_ACTIONS': spellCast = '<span class="pf-icon">[three-actions]</span>'; break;
                    case 'ONE_TO_THREE_ACTIONS': spellCast = '<span class="pf-icon">[one-action]</span><span> to </span><span class="pf-icon">[three-actions]</span>'; break;
                    case 'ONE_TO_TWO_ACTIONS': spellCast = '<span class="pf-icon">[one-action]</span><span> to </span><span class="pf-icon">[two-actions]</span>'; break;
                    case 'TWO_TO_THREE_ACTIONS': spellCast = '<span class="pf-icon">[two-actions]</span><span> to </span><span class="pf-icon">[three-actions]</span>'; break;
                    default: spellCast = '<em>see spell</em>'; break;
                }

                // Range //
                let spellRange = (spellDataStruct.Spell.range != null) ? spellDataStruct.Spell.range : '-';

                // Tags //
                let tagsInnerHTML = '<div class="buttons is-marginless is-centered">';
                for(const tag of spellDataStruct.Tags){
                    tagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-very-small is-info">'+tag.name+'</button>';
                }
                tagsInnerHTML += '</div>';

                $('#spellsCoreContent').append('<div id="'+spellSponListingID+'" class="'+spellListingSponClass+' columns is-mobile is-marginless cursor-clickable"><div class="column is-5 is-paddingless"><p class="has-text-left pl-3 pt-1">'+spellName+'</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light pt-1">'+spellCast+'</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light pt-1">'+spellRange+'</p></div><div class="column is-5 is-paddingless"><p class="text-center has-text-grey-light">'+tagsInnerHTML+'</p></div></div>');

                let unusedSlot = filteredSlotArray.find(slot => {
                    return slot.used === false;
                });
                if(unusedSlot == null && filteredSlotArray.length > 0){
                    unusedSlot = filteredSlotArray[0];
                }
                if(unusedSlot != null){
                    $('#'+spellSponListingID).click(function(){
                        openQuickView('spellView', {
                            SpellDataStruct: spellDataStruct,
                            SheetData: {Slot: unusedSlot, Data: data},
                        });
                    });
                }

            } else {
                $('#spellsCoreContent').append('<div id="'+spellSponListingID+'" class="'+spellListingSponClass+' columns is-mobile is-marginless"><div class="column is-5 is-paddingless"><p class="has-text-left pl-4 has-text-grey-light">-</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light">-</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light">-</p></div><div class="column is-5 is-paddingless"><p class="text-center has-text-grey-light">-</p></div></div>');
            }

            $('#'+spellSponListingID).mouseenter(function(){
                $(this).addClass('has-background-grey-darker');
            });
            $('#'+spellSponListingID).mouseleave(function(){
                $(this).removeClass('has-background-grey-darker');
            });

            spellListingCount++;

        }
    }

    // Display Empty Slot Entry, If No Spells at Level //
    if(!didDisplaySpellAtLevel){
        let spellSponListingID = 'spellSponListingNoSpellsL'+level;
        $('#spellsCoreContent').append('<div id="'+spellSponListingID+'" class="'+spellListingSponClass+' spellSponListing columns is-mobile is-marginless"><div class="column is-5 is-paddingless"><p class="has-text-left pl-4 has-text-grey-light">-</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light">-</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light">-</p></div><div class="column is-5 is-paddingless"><p class="text-center has-text-grey-light">-</p></div></div>');
        $('#'+spellSponListingID).mouseenter(function(){
            $(this).addClass('has-background-grey-darker');
        });
        $('#'+spellSponListingID).mouseleave(function(){
            $(this).removeClass('has-background-grey-darker');
        });
    }

    // Display Casting Set //
    g_hasCastingSpontaneous = true;
    let spellSponCastingSetID = 'spellSponCastingSet'+level;
    $('#'+spellListSectionID).append('<p class="text-left pl-5"><span class="has-text-grey-kinda-light has-text-weight-bold is-size-5 pr-2">'+sectionName+'</span><span id="'+spellSponCastingSetID+'" class="is-unselectable cursor-clickable"></span></p>');
    $('#'+spellListSectionID).append('<hr class="hr-highlighted" style="margin-top:-0.5em; margin-bottom:0em;">');
    $('#'+spellListSectionID).append('<div class="columns is-mobile pt-1 is-marginless"><div class="column is-5 is-paddingless"><p class="has-text-left pl-3"><strong class="has-text-grey-kinda-light"><u>Name</u></strong></p></div><div class="column is-1 is-paddingless"><p class="text-center"><strong class="has-text-grey-kinda-light"><u>Cast</u></strong></p></div><div class="column is-1 is-paddingless"><p class="text-center"><strong class="has-text-grey-kinda-light"><u>Range</u></strong></p></div><div class="column is-5 is-paddingless"><p class="text-center"><strong class="has-text-grey-kinda-light"><u>Traits</u></strong></p></div></div>');
    if(level != 0){    
        displaySpontaneousCastingsSet(spellSponCastingSetID, filteredSlotArray, spellListingSponClass);
    }

}

function displaySpontaneousCastingsSet(locationID, slotsArray, spellListingSponClass){

    let castingButtonsClass = 'castingSpontaneousBtns'+locationID;
    let slotsUsedCount = 0;
    let spellCastingsHTML = '';
    for(let slot of slotsArray){
        if(slot.used){
            slotsUsedCount++;
            spellCastingsHTML += '<span name="'+slot.slotID+'" class="icon has-text-info '+castingButtonsClass+'"><i class="fas fa-lg fa-square"></i></span>';
        } else {
            spellCastingsHTML += '<span name="'+slot.slotID+'" class="icon has-text-info '+castingButtonsClass+'"><i class="far fa-lg fa-square"></i></span>';
        }
    }
    $('#'+locationID).html(spellCastingsHTML);

    if(slotsUsedCount === slotsArray.length) {
        $('.'+spellListingSponClass).addClass('has-empty-slot-background');
        $('.'+spellListingSponClass).find(".has-text-grey-light").removeClass("has-text-grey-light").addClass("has-text-grey");
    } else {
        $('.'+spellListingSponClass).removeClass('has-empty-slot-background');
        $('.'+spellListingSponClass).find(".has-text-grey").removeClass("has-text-grey").addClass("has-text-grey-light");
    }

    $('.'+castingButtonsClass).off('click');
    $('.'+castingButtonsClass).click(function(){
        event.stopImmediatePropagation();
        let slotID = $(this).attr('name');
        let slot = slotsArray.find(slot => {
            return slot.slotID == slotID;
        });

        slot.used = !slot.used;
        socket.emit("requestSpellSlotUpdate",
            getCharIDFromURL(),
            slot);
        let spellSlotsArray = g_spellSlotsMap.get(slot.SpellSRC);
        if(spellSlotsArray != null){
            spellSlotsArray = updateSlotUsed(spellSlotsArray, slot.slotID, slot.used);
        }
        g_spellSlotsMap.set(slot.SpellSRC, spellSlotsArray);
        closeQuickView();
        prepDisplayOfSpellsAndSlots();
    });

}





// Focus Spells //
let g_focusOpenPoint = false;

function displaySpellsFocus() {

    let data = {
        ArcaneSpellAttack : getStatTotal('ARCANE_SPELL_ATTACK'),
        OccultSpellAttack : getStatTotal('OCCULT_SPELL_ATTACK'),
        PrimalSpellAttack : getStatTotal('PRIMAL_SPELL_ATTACK'),
        DivineSpellAttack : getStatTotal('DIVINE_SPELL_ATTACK'),
        ArcaneSpellDC : getStatTotal('ARCANE_SPELL_DC'),
        OccultSpellDC : getStatTotal('OCCULT_SPELL_DC'),
        PrimalSpellDC : getStatTotal('PRIMAL_SPELL_DC'),
        DivineSpellDC : getStatTotal('DIVINE_SPELL_DC'),
    };

    $('#spellsTabContent').append('<div id="spellsFocusContent" class="use-custom-scrollbar" style="height: 595px; max-height: 595px; overflow-y: auto;"></div>');

    let isFirstLevel = true;
    let sourceCount = 0;
    let focusSpellCount = 0;
    for(const [spellSRC, focusSpellDataArray] of g_focusSpellMap.entries()){
        let prevLevel = -100;
        $('#spellsFocusContent').append('<p class="focusSpellSourceTitle is-hidden is-size-4 mt-3 is-family-secondary has-text-grey-light">'+capitalizeWord(spellSRC)+'</p>');

        let sortedFocusSpellDataArray = focusSpellDataArray.sort(
            function(a, b) {
                let aSpellData = g_spellMap.get(a.SpellID+"");
                let bSpellData = g_spellMap.get(b.SpellID+"");
                if(aSpellData == null || bSpellData == null){
                    return -1;
                } else {
                    if (aSpellData.Spell.level === bSpellData.Spell.level) {
                        // Name is only important when levels are the same
                        return aSpellData.Spell.name > bSpellData.Spell.name ? 1 : -1;
                    }
                    return aSpellData.Spell.level - bSpellData.Spell.level;
                }
            }
        );

        for(let focusSpellData of sortedFocusSpellDataArray){
            focusSpellData.SpellSRC = spellSRC;
            let spellDataStruct = g_spellMap.get(focusSpellData.SpellID+"");
            if(spellDataStruct == null) { continue; }
            
            if(spellDataStruct.Spell.level > prevLevel){
                let sectionName = (spellDataStruct.Spell.level == 0) ? 'Cantrips' : 'Level '+spellDataStruct.Spell.level;
                if(isFirstLevel){
                    $('#spellsFocusContent').append('<p class="text-left pl-5 pr-3"><span class="has-text-grey-kinda-light has-text-weight-bold is-size-5">'+sectionName+'</span><span id="focusPointsCastingSet" class="is-unselectable cursor-clickable"></span></p>');
                    isFirstLevel = false;
                } else {
                    $('#spellsFocusContent').append('<p class="is-size-5 has-text-grey-kinda-light has-text-weight-bold text-left pl-5 pt-2">'+sectionName+'</p>');
                }
                $('#spellsFocusContent').append('<hr class="hr-highlighted" style="margin-top:-0.5em; margin-bottom:0em;">');
                $('#spellsFocusContent').append('<div class="columns is-mobile pt-1 is-marginless"><div class="column is-5 is-paddingless"><p class="has-text-left pl-3"><strong class="has-text-grey-kinda-light"><u>Name</u></strong></p></div><div class="column is-1 is-paddingless"><p class="text-center"><strong class="has-text-grey-kinda-light"><u>Cast</u></strong></p></div><div class="column is-1 is-paddingless"><p class="text-center"><strong class="has-text-grey-kinda-light"><u>Range</u></strong></p></div><div class="column is-5 is-paddingless"><p class="text-center"><strong class="has-text-grey-kinda-light"><u>Traits</u></strong></p></div></div>');
            }

            let spellListingID = 'focusSpellListing'+focusSpellCount;
            
            // Name //
            let spellName = '<strong class="has-text-grey-light">'+spellDataStruct.Spell.name+'</strong>';

            if(spellDataStruct.Spell.isArchived === 1){
                spellName += '<em class="pl-1">(archived)</em>';
            }
            
            // Cast Actions //
            let spellCast = null;
            switch(spellDataStruct.Spell.cast) {
                case 'FREE_ACTION': spellCast = '<span class="pf-icon">[free-action]</span>'; break;
                case 'REACTION': spellCast = '<span class="pf-icon">[reaction]</span>'; break;
                case 'ACTION': spellCast = '<span class="pf-icon">[one-action]</span>'; break;
                case 'TWO_ACTIONS': spellCast = '<span class="pf-icon">[two-actions]</span>'; break;
                case 'THREE_ACTIONS': spellCast = '<span class="pf-icon">[three-actions]</span>'; break;
                case 'ONE_TO_THREE_ACTIONS': spellCast = '<span class="pf-icon">[one-action]</span><span> to </span><span class="pf-icon">[three-actions]</span>'; break;
                case 'ONE_TO_TWO_ACTIONS': spellCast = '<span class="pf-icon">[one-action]</span><span> to </span><span class="pf-icon">[two-actions]</span>'; break;
                case 'TWO_TO_THREE_ACTIONS': spellCast = '<span class="pf-icon">[two-actions]</span><span> to </span><span class="pf-icon">[three-actions]</span>'; break;
                default: spellCast = '<em>see spell</em>'; break;
            }

            // Range //
            let spellRange = (spellDataStruct.Spell.range != null) ? spellDataStruct.Spell.range : '-';

            // Tags //
            let tagsInnerHTML = '<div class="buttons is-marginless is-centered">';
            for(const tag of spellDataStruct.Tags){
                tagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-very-small is-info">'+tag.name+'</button>';
            }
            tagsInnerHTML += '</div>';

            let focusListingClass = (spellDataStruct.Spell.level != 0) ? 'focusSpellListingClass' : 'focusCantripListingClass';
            $('#spellsFocusContent').append('<div id="'+spellListingID+'" class="'+focusListingClass+' columns is-mobile is-marginless cursor-clickable"><div class="column is-5 is-paddingless"><p class="has-text-left pl-3 pt-1">'+spellName+'</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light pt-1">'+spellCast+'</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light pt-1">'+spellRange+'</p></div><div class="column is-5 is-paddingless"><p class="text-center has-text-grey-light">'+tagsInnerHTML+'</p></div></div>');

            
            $('#'+spellListingID).click(function(){
                openQuickView('spellView', {
                    SpellDataStruct: spellDataStruct,
                    SheetData: {FocusSpell: focusSpellData, Data: data},
                });
            });

            $('#'+spellListingID).mouseenter(function(){
                $(this).addClass('has-background-grey-darker');
            });
            $('#'+spellListingID).mouseleave(function(){
                $(this).removeClass('has-background-grey-darker');
            });

            prevLevel = spellDataStruct.Spell.level;
            focusSpellCount++;
        }
        sourceCount++;
    }

    if(sourceCount > 1){
        $('.focusSpellSourceTitle').removeClass('is-hidden');
    }

    displayFocusCastingsSet('NONE');

}

function displayFocusCastingsSet(changeType){

    let performedChange = false;
    for(let focusPointData of g_focusPointArray){
        if(changeType !== 'NONE' && !performedChange){
            if(changeType === 'ADD' && focusPointData.value == 1){
                focusPointData.value = 0;
                socket.emit("requestFocusPointUpdate",
                    getCharIDFromURL(),
                    focusPointData,
                    focusPointData.value);
                performedChange = true;
            } else if(changeType === 'REMOVE' && focusPointData.value == 0){
                focusPointData.value = 1;
                socket.emit("requestFocusPointUpdate",
                    getCharIDFromURL(),
                    focusPointData,
                    focusPointData.value);
                performedChange = true;
            }
        }
    }
    
    g_focusPointArray = g_focusPointArray.sort(
        function(a, b) {
            return (a.value == 0 && b.value == 1) ? 1 : -1;
        }
    );

    let pointsButtonsClass = 'castingFocusPointsBtns';
    
    g_focusOpenPoint = false;
    let spellCastingsHTML = '';
    for (let i = 0; i < g_focusPointArray.length; i++) {
        if(i < 3){
            let focusPointData = g_focusPointArray[i];
            if(focusPointData.value == 0) {
                spellCastingsHTML += '<span name="'+i+'" class="icon mt-1 is-pulled-right has-text-info '+pointsButtonsClass+'"><i class="fas fa-lg fa-square"></i></span>';
            } else {
                g_focusOpenPoint = true;
                spellCastingsHTML += '<span name="'+i+'" class="icon mt-1 is-pulled-right has-text-info '+pointsButtonsClass+'"><i class="far fa-lg fa-square"></i></span>';
            }
        }
    }
    $('#focusPointsCastingSet').html(spellCastingsHTML);

    
    if(g_focusOpenPoint) {
        $('.focusSpellListingClass').removeClass('has-empty-slot-background');
        $('.focusSpellListingClass').find(".has-text-grey").removeClass("has-text-grey").addClass("has-text-grey-light");
    } else {
        $('.focusSpellListingClass').addClass('has-empty-slot-background');
        $('.focusSpellListingClass').find(".has-text-grey-light").removeClass("has-text-grey-light").addClass("has-text-grey");
    }

    $('.'+pointsButtonsClass).off('click');
    $('.'+pointsButtonsClass).click(function(){
        event.stopImmediatePropagation();
        let focusPointData = g_focusPointArray[$(this).attr('name')];

        focusPointData.value = (focusPointData.value == 1) ? 0 : 1;
        socket.emit("requestFocusPointUpdate",
            getCharIDFromURL(),
            focusPointData,
            focusPointData.value);

        displayFocusCastingsSet('NONE');
    });

}




// Innate Spells //
function displaySpellsInnate() {

    let data = {
        ArcaneSpellAttack : getStatTotal('ARCANE_SPELL_ATTACK'),
        OccultSpellAttack : getStatTotal('OCCULT_SPELL_ATTACK'),
        PrimalSpellAttack : getStatTotal('PRIMAL_SPELL_ATTACK'),
        DivineSpellAttack : getStatTotal('DIVINE_SPELL_ATTACK'),
        ArcaneSpellDC : getStatTotal('ARCANE_SPELL_DC'),
        OccultSpellDC : getStatTotal('OCCULT_SPELL_DC'),
        PrimalSpellDC : getStatTotal('PRIMAL_SPELL_DC'),
        DivineSpellDC : getStatTotal('DIVINE_SPELL_DC'),
    };

    let spellMap = g_spellMap;
    let innateSpellArray = g_innateSpellArray;

    $('#spellsTabContent').html('');
    $('#spellsTabContent').append('<div id="spellsInnateContent" class="use-custom-scrollbar" style="height: 595px; max-height: 595px; overflow-y: auto;"></div>');

    let isFirstLevel = true;
    let prevLevel = -100;
    for (let spellIndex = 0; spellIndex < innateSpellArray.length; spellIndex++) {
        let innateSpell = innateSpellArray[spellIndex];

        if(innateSpell.SpellLevel > prevLevel){
            let sectionName = (innateSpell.SpellLevel == 0) ? 'Cantrips' : 'Level '+innateSpell.SpellLevel;
            if(isFirstLevel){
                $('#spellsInnateContent').append('<p class="is-size-5 has-text-grey-kinda-light has-text-weight-bold text-left pl-5">'+sectionName+'</p>');
                isFirstLevel = false;
            } else {
                $('#spellsInnateContent').append('<p class="is-size-5 has-text-grey-kinda-light has-text-weight-bold text-left pl-5 pt-2">'+sectionName+'</p>');
            }
            $('#spellsInnateContent').append('<hr class="hr-highlighted" style="margin-top:-0.5em; margin-bottom:0em;">');
            $('#spellsInnateContent').append('<div class="columns is-mobile pt-1 is-marginless"><div class="column is-4 is-paddingless"><p class="has-text-left pl-3"><strong class="has-text-grey-kinda-light"><u>Name</u></strong></p></div><div class="column is-2 is-paddingless"><p class="text-center"><strong class="has-text-grey-kinda-light"><u>Casts Per Day</u></strong></p></div><div class="column is-1 is-paddingless"><p class="text-center"><strong class="has-text-grey-kinda-light"><u>Cast</u></strong></p></div><div class="column is-1 is-paddingless"><p class="text-center"><strong class="has-text-grey-kinda-light"><u>Range</u></strong></p></div><div class="column is-4 is-paddingless"><p class="text-center"><strong class="has-text-grey-kinda-light"><u>Traits</u></strong></p></div></div>');
        }

        let spellDataStruct = spellMap.get(innateSpell.SpellID+"");

        /// Display Spell Listing ///
        if(spellDataStruct != null) {

            let spellListingID = 'innateSpellListing'+spellIndex;
            let spellCastingID = 'innateSpellCastings'+spellIndex;
            
            // Name //
            let spellName = '<strong class="has-text-grey-light">'+spellDataStruct.Spell.name+'</strong>';

            if(spellDataStruct.Spell.isArchived === 1){
                spellName += '<em class="pl-1">(archived)</em>';
            }
            
            // Cast Actions //
            let spellCast = null;
            switch(spellDataStruct.Spell.cast) {
                case 'FREE_ACTION': spellCast = '<span class="pf-icon">[free-action]</span>'; break;
                case 'REACTION': spellCast = '<span class="pf-icon">[reaction]</span>'; break;
                case 'ACTION': spellCast = '<span class="pf-icon">[one-action]</span>'; break;
                case 'TWO_ACTIONS': spellCast = '<span class="pf-icon">[two-actions]</span>'; break;
                case 'THREE_ACTIONS': spellCast = '<span class="pf-icon">[three-actions]</span>'; break;
                case 'ONE_TO_THREE_ACTIONS': spellCast = '<span class="pf-icon">[one-action]</span><span> to </span><span class="pf-icon">[three-actions]</span>'; break;
                case 'ONE_TO_TWO_ACTIONS': spellCast = '<span class="pf-icon">[one-action]</span><span> to </span><span class="pf-icon">[two-actions]</span>'; break;
                case 'TWO_TO_THREE_ACTIONS': spellCast = '<span class="pf-icon">[two-actions]</span><span> to </span><span class="pf-icon">[three-actions]</span>'; break;
                default: spellCast = '<em>see spell</em>'; break;
            }

            // Range //
            let spellRange = (spellDataStruct.Spell.range != null) ? spellDataStruct.Spell.range : '-';

            // Tags //
            let tagsInnerHTML = '<div class="buttons is-marginless is-centered">';
            for(const tag of spellDataStruct.Tags){
                tagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-very-small is-info">'+tag.name+'</button>';
            }
            tagsInnerHTML += '</div>';

            $('#spellsInnateContent').append('<div id="'+spellListingID+'" class="columns is-mobile is-marginless cursor-clickable"><div class="column is-4 is-paddingless"><p class="has-text-left pl-3 pt-1">'+spellName+'</p></div><div class="column is-2 is-paddingless"><p id="'+spellCastingID+'" class="text-center has-text-grey-light pt-1 is-unselectable"></p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light pt-1">'+spellCast+'</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light pt-1">'+spellRange+'</p></div><div class="column is-4 is-paddingless"><p class="text-center has-text-grey-light">'+tagsInnerHTML+'</p></div></div>');

            if(spellDataStruct.Spell.level == 0 || innateSpell.TimesPerDay == 0){
                $('#'+spellCastingID).html('Unlimited');
            } else {
                displayInnateCastingsSet(spellCastingID, innateSpell, spellIndex, spellListingID);
            }
            
            $('#'+spellListingID).click(function(){
                openQuickView('spellView', {
                    SpellDataStruct: spellDataStruct,
                    SheetData: {InnateSpell: innateSpell, Data: data},
                });
            });

            $('#'+spellListingID).mouseenter(function(){
                $(this).addClass('has-background-grey-darker');
            });
            $('#'+spellListingID).mouseleave(function(){
                $(this).removeClass('has-background-grey-darker');
            });

        }

        prevLevel = innateSpell.SpellLevel;
    }

}

function displayInnateCastingsSet(locationID, innateSpell, spellIndex, spellListingID){

    let castingButtonsClass = 'castingInnateBtns'+locationID;

    let spellCastingsHTML = '';
    for (let i = 0; i < innateSpell.TimesPerDay; i++) {
        if(innateSpell.TimesCast > i) {
            spellCastingsHTML += '<span class="icon has-text-info isInnateCast '+castingButtonsClass+'"><i class="fas fa-lg fa-square"></i></span>';
        } else {
            spellCastingsHTML += '<span class="icon has-text-info '+castingButtonsClass+'"><i class="far fa-lg fa-square"></i></span>';
        }
    }
    $('#'+locationID).html(spellCastingsHTML);

    if(innateSpell.TimesPerDay === innateSpell.TimesCast) {
        $('#'+spellListingID).addClass('has-empty-slot-background');
        $('#'+spellListingID).find(".has-text-grey-light").removeClass("has-text-grey-light").addClass("has-text-grey");
    } else {
        $('#'+spellListingID).removeClass('has-empty-slot-background');
        $('#'+spellListingID).find(".has-text-grey").removeClass("has-text-grey").addClass("has-text-grey-light");
    }

    $('.'+castingButtonsClass).off('click');
    $('.'+castingButtonsClass).click(function(){
        event.stopImmediatePropagation();
        let newTimesCast = null;
        if($(this).hasClass('isInnateCast')) {
            newTimesCast = innateSpell.TimesCast-1;
        } else {
            newTimesCast = innateSpell.TimesCast+1;
        }
        socket.emit("requestInnateSpellCastingUpdate",
            cloneObj(innateSpell),
            newTimesCast);
        innateSpell.TimesCast = newTimesCast;
        g_innateSpellArray[spellIndex] = innateSpell;
        displayInnateCastingsSet(locationID, innateSpell, spellIndex, spellListingID);
    });

}
