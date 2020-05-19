

function openSpellTab(data) {

    $('#tabContent').append('<div class="tabs is-small is-centered is-marginless"><ul><li><a id="spellsTabCore">Core</a></li><li><a id="spellsTabFocus">Focus</a></li><li><a id="spellsTabInnate">Innate</a></li></ul></div>');

    $('#tabContent').append('<div id="spellsTabContent"></div>');

    $('#spellsTabCore').click(function(){
        changeSpellsTab('spellsTabCore');
    });

    $('#spellsTabFocus').click(function(){
        changeSpellsTab('spellsTabFocus');
    });

    $('#spellsTabInnate').click(function(){
        changeSpellsTab('spellsTabInnate');
    });

    if(g_spellBookArray.length != 0){
        $('#spellsTabCore').click(function(){
            changeSpellsTab('spellsTabCore');
        });
    } else {
        $('#spellsTabCore').addClass('is-hidden');
    }

    if(g_spellBookArray.length != 0){
        $('#spellsTabCore').click();
    } else {
        $('#spellsTabFocus').click();
    }

}

// Spells Tabs //
function changeSpellsTab(type){

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
function displaySpellsCore() {

    $('#spellsTabContent').append('<div class="columns is-mobile is-marginless"><div class="column is-9"><p class="control has-icons-left"><input id="spellsSearch" class="input" type="text" placeholder="Search Spells"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div><div class="column is-3"><button id="manageSpellsBtn" class="button is-info is-rounded">Manage Spells</button></div></div><div id="spellsCoreContent" class="use-custom-scrollbar" style="height: 535px; max-height: 535px; overflow-y: auto;"></div>');
        
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
    if(spellsSearchInput != null){
        if(spellsSearchInput === 'cantrip' || spellsSearchInput === 'cantrips') {
            console.log(spellSlotMap.get(0));
            displaySpellsInLevel(0, spellSlotMap.get(0), data, null);
            return;
        } else {
            const foundStruct = spellsSearchInput.match(/^(level|lvl) ([0-9]|10)\s*$/);
            if(foundStruct != null){
                let level = parseInt(foundStruct[2]);
                displaySpellsInLevel(level, spellSlotMap.get(level), data, null);
                return;
            }
        }
    }

    for(const [level, slotArray] of spellSlotMap){
        displaySpellsInLevel(level, slotArray, data, spellsSearchInput);
    }

}


function displaySpellsInLevel(level, slotArray, data, spellsSearchInput) {
    if(slotArray == null) {return;}

    let sectionName = (level == 0) ? 'Cantrips' : 'Level '+level;
    let spellListSectionID = 'spellTabListSectionByLevel'+level;
    $('#spellsCoreContent').append('<div id="'+spellListSectionID+'"></div>');

    let didDisplayALevel = false;
    let spellsInnerHTML = '';
    for(let slot of slotArray){
        let spellSlotID = 'spellSlot'+slot.slotID;
        
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
            let spellName = (slot.used) ? '<s class="has-text-grey-light">-'+spellDataStruct.Spell.name+'-</s>' : '<strong class="has-text-grey-light">'+spellDataStruct.Spell.name+'</strong>';

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
                tagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-small is-info">'+tag.name+'</button>';
            }
            tagsInnerHTML += '</div>';

            $('#spellsCoreContent').append('<div id="'+spellSlotID+'" class="columns is-mobile is-marginless cursor-clickable"><div class="column is-5 is-paddingless"><p class="has-text-left pl-3 pt-1">'+spellName+'</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light pt-1">'+spellCast+'</p></div><div class="column is-1 is-paddingless"><p class="text-center has-text-grey-light pt-1">'+spellRange+'</p></div><div class="column is-5 is-paddingless"><p class="text-center has-text-grey-light">'+tagsInnerHTML+'</p></div></div>');

            $('#'+spellSlotID).click(function(){
                openQuickView('spellView', {
                    SpellDataStruct: spellDataStruct,
                    SheetData: {Slot: slot, Data: data},
                });
            });

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
        $('#'+spellListSectionID).append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">'+sectionName+'</p>');
        $('#'+spellListSectionID).append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');
        $('#'+spellListSectionID).append('<div class="columns is-mobile pt-1 is-marginless"><div class="column is-5 is-paddingless"><p class="has-text-left pl-3"><strong class="has-text-grey-light"><u>Name</u></strong></p></div><div class="column is-1 is-paddingless"><p class="text-center"><strong class="has-text-grey-light"><u>Cast</u></strong></p></div><div class="column is-1 is-paddingless"><p class="text-center"><strong class="has-text-grey-light"><u>Range</u></strong></p></div><div class="column is-5 is-paddingless"><p class="text-center"><strong class="has-text-grey-light"><u>Traits</u></strong></p></div></div>');
    }

}




// Focus Spells //
function displaySpellsFocus() {



}




// Innate Spells //
function displaySpellsInnate() {

    

}