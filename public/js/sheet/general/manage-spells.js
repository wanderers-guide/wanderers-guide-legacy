
let prev_spellSRC, prev_spellData = null;

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    $('#manageSpellsModalBackground').click(function(){
        closeManageSpellsModal();
    });
    $('#manageSpellsModalCloseButton').click(function(){
        closeManageSpellsModal();
    });

});

function openManageSpellsModal(data){

    $('#manageSpellsTabs').html('');
    for(let spellBook of g_spellBookArray) {
        let spellSRCTabID = 'spellSRCTab'+spellBook.SpellSRC.replace(/\s/g, "_");
        $('#manageSpellsTabs').append('<li id="'+spellSRCTabID+'" class="spellSRCTabs"><a>'+spellBook.SpellSRC+'</a></li>');

        $('#'+spellSRCTabID).click(function(){
            $('.spellSRCTabs').removeClass('is-active');
            $('#'+spellSRCTabID).addClass('is-active');
            openSpellSRCTab(spellBook.SpellSRC, data);
            $('#manageSpellsSlots').scrollTop(0);
        });

    }

    $("#manageSpellsTabs").children(":first").trigger("click");


    $('#manageSpellsModalDefault').addClass('is-active');
    $('html').addClass('is-clipped');

}

function closeManageSpellsModal(){

    $('#spellsTab').trigger("click", [true]);

    $('#manageSpellsModalDefault').removeClass('is-active');
    $('html').removeClass('is-clipped');

}



// Socket.IO Spellbook Update //
socket.on("returnSpellBookUpdated", function(spellBookStruct){
    for (let i = 0; i < g_spellBookArray.length; i++) {
        let spellBook = g_spellBookArray[i];
        if(spellBook.SpellSRC === spellBookStruct.SpellSRC){
            g_spellBookArray[i] = spellBookStruct;
        }
    }

    if(prev_spellSRC != null && prev_spellData != null){
        openSpellSRCTab(prev_spellSRC, prev_spellData);
        prev_spellSRC = null; prev_spellData = null;
    }
});



function openSpellSRCTab(spellSRC, data){

    let spellBook = g_spellBookArray.find(spellBook => {
        return spellBook.SpellSRC === spellSRC;
    });
    spellBook.SpellBook = removeAllNullSpells(spellBook.SpellBook);
    spellBook.SpellBook = spellBook.SpellBook.sort(
        function(a, b) {
            let aStruct = data.SpellMap.get(a.SpellID+"");
            let bStruct = data.SpellMap.get(b.SpellID+"");
            if (a.SpellLevel === b.SpellLevel) {
                // Name is only important when levels are the same
                return aStruct.Spell.name > bStruct.Spell.name ? 1 : -1;
            }
            return a.SpellLevel - b.SpellLevel;
        }
    );

    $('#manageSpellsOpenSpellListsBtn').off('click');
    $('#manageSpellsOpenSpellListsBtn').click(function(){
        openQuickView('addSpellView', {
            SpellBook: spellBook,
            Data: data,
        });
    });

    if(spellBook.SpellCastingType === 'SPONTANEOUS-REPERTOIRE') {
        displaySpellSpontaneous(spellBook, data);
        displaySpellSlotsSpontaneous(spellSRC, data);
    } else {
        displaySpellBookPrepared(spellBook, data);
        displaySpellSlotsPrepared(spellSRC, data);
    }

    if(spellBook.SpellCastingType === 'PREPARED-BOOK'){
        $('#manageSpellsListName').html('<p class="is-size-5 has-text-centered has-tooltip-multiline has-tooltip-bottom" data-tooltip="All the spells you know how to prepare and cast are kept in your spellbook. Your spellbook starts with 10 common cantrips and five common 1st-level spells. At every additional level, you add two more spells to your book. You may also come across spells in your adventures which you can add to your book as well.">Spellbook</p>');
    } else if(spellBook.SpellCastingType === 'PREPARED-LIST'){
        $('#manageSpellsListName').html('<p class="is-size-5 has-text-centered has-tooltip-multiline has-tooltip-bottom" data-tooltip="You know how to prepare and cast all common spells from your tradition\'s spell list ('+capitalizeWord(spellBook.SpellList)+'). Add the appropriate spells to your spell list accordingly.">Spell List</p>');
    } else if(spellBook.SpellCastingType === 'SPONTANEOUS-REPERTOIRE'){
        $('#manageSpellsListName').html('<p class="is-size-5 has-text-centered has-tooltip-multiline has-tooltip-bottom" data-tooltip="Your spell repertoire is the collection of spells you know how to cast and at which level. Each time you gain new spell slots, add that many spells of that level to your spell repertoire and you may also switch out an old spell for a different one of the same level.">Spell Repertoire</p>');
    }

}




function displaySpellSpontaneous(spellBook, data) {

    let spellBookSearch = $('#manageSpellsSpellBookSearch');
    let spellBookSearchInput = null;
    if(spellBookSearch.val() != ''){
        spellBookSearchInput = spellBookSearch.val().toLowerCase();
        spellBookSearch.addClass('is-info');
    } else {
        spellBookSearch.removeClass('is-info');
    }

    $('#manageSpellsSpellBookSearch').off('change');
    $('#manageSpellsSpellBookSearch').change(function(){
        displaySpellSpontaneous(spellBook, data);
    });


    $('#manageSpellsSpellBook').html('');
    let spellListingCount = 0;
    for(let spellData of spellBook.SpellBook) {

        let spellDataStruct = data.SpellMap.get(spellData.SpellID+"");

        // Filter Thru Search //
        let willDisplay = true;
        if(spellBookSearchInput != null){
            let spellName = spellDataStruct.Spell.name.toLowerCase();
            if(!spellName.includes(spellBookSearchInput)){
                willDisplay = false;
            }
        }

        if(!willDisplay){continue;}
        // Display Spell in SpellBook //

        let spellName = spellDataStruct.Spell.name;
        if(spellDataStruct.Spell.isArchived === 1){
            spellName += '<em class="pl-1">(archived)</em>';
        }

        let spellBookListingID = "spellBookListing"+spellListingCount;
        let spellLevel = (spellData.SpellLevel == 0) ? "Cantrip" : "Lvl "+spellData.SpellLevel;

        $('#manageSpellsSpellBook').append('<div id="'+spellBookListingID+'" class="border-bottom border-dark-lighter cursor-clickable has-background-black-ter" name="'+spellDataStruct.Spell.id+'" style="z-index: 40; border-radius: 5px;"><span class="is-size-6 has-text-grey-light ml-3 mr-1">'+spellName+'</span><span class="is-size-7 has-text-grey-light is-pulled-right ml-1 mr-3">('+spellLevel+')</span></div>');
        
        $('#'+spellBookListingID).click(function(){
            openQuickView('spellView', {
                SpellDataStruct: spellDataStruct,
                SRCTabData: {SpellSRC: spellBook.SpellSRC, SpellLevel: spellData.SpellLevel, Data: data},
            });
        });

        $('#'+spellBookListingID).mouseenter(function(){
            $(this).addClass('has-background-grey-darker');
        });
        $('#'+spellBookListingID).mouseleave(function(){
            $(this).removeClass('has-background-grey-darker');
        });

        //$('#'+spellBookListingID).draggable({ opacity: 0.8, helper: "clone", revert: true });

        spellListingCount++;
    }

    if(spellBook.SpellBook.length == 0){
        $('#manageSpellsSpellBook').append('<p class="is-size-7 has-text-centered is-italic pt-2">You have no spells!</p>');
    }

}

function displaySpellSlotsSpontaneous(spellSRC, data) {

    let spellSlotArray = data.SpellSlotsMap.get(spellSRC);
    let spellSlotMap = new Map();
    for(let spellSlot of spellSlotArray){
        let spellSlotMapArray = [];
        if(spellSlotMap.has(spellSlot.slotLevel)){
            spellSlotMapArray = spellSlotMap.get(spellSlot.slotLevel);
        }
        spellSlotMapArray.push(spellSlot);
        spellSlotMap.set(spellSlot.slotLevel, spellSlotMapArray);
    }

    $('#manageSpellsSlots').html('');
    for(const [level, slotArray] of spellSlotMap){
        let sortedSlotArray = slotArray.sort(
            function(a, b) {
                return (a.used && !b.used) ? -1 : 1;
            }
        );

        let sectionName = (level == 0) ? 'Cantrips' : 'Level '+level;
        $('#manageSpellsSlots').append('<p class="is-size-5 has-text-grey-kinda-light has-text-weight-bold text-left pl-5">'+sectionName+'</p>');
        $('#manageSpellsSlots').append('<hr class="hr-highlighted" style="margin-top:-0.5em; margin-bottom:0em;">');

        let spellSlotsButtonsID = 'spellManagerSlotsButtons'+level;
        $('#manageSpellsSlots').append('<div id="'+spellSlotsButtonsID+'" class="text-center mt-3"></div>');
        if(level != 0) {
            
            for(let slot of sortedSlotArray){
                if(slot.used) {
                    $('#'+spellSlotsButtonsID).append('<span class="icon is-medium has-text-info mx-2 has-tooltip-bottom" data-tooltip="Consumed Slot"><i class="fas fa-2x fa-square"></i></span>');
                } else {
                    $('#'+spellSlotsButtonsID).append('<span class="icon is-medium has-text-info mx-2 has-tooltip-bottom" data-tooltip="Available Slot"><i class="far fa-2x fa-square"></i></span>');
                }
            }
            $('#'+spellSlotsButtonsID).append('<p class="is-size-5 is-italic">'+sortedSlotArray.length+' Spell Slots</p>');

        } else {
            for(let slot of sortedSlotArray){
                $('#'+spellSlotsButtonsID).append('<span class="icon is-medium has-text-info mx-2"><i class="fas fa-2x fa-dot-circle"></i></span>');
            }
            $('#'+spellSlotsButtonsID).append('<p class="is-size-5 is-italic">'+sortedSlotArray.length+' Cantrips</p>');
        }

    }

}






function displaySpellBookPrepared(spellBook, data) {

    let spellBookSearch = $('#manageSpellsSpellBookSearch');
    let spellBookSearchInput = null;
    if(spellBookSearch.val() != ''){
        spellBookSearchInput = spellBookSearch.val().toLowerCase();
        spellBookSearch.addClass('is-info');
    } else {
        spellBookSearch.removeClass('is-info');
    }

    $('#manageSpellsSpellBookSearch').off('change');
    $('#manageSpellsSpellBookSearch').change(function(){
        displaySpellBookPrepared(spellBook, data);
    });


    $('#manageSpellsSpellBook').html('');
    let spellListingCount = 0;
    for(let spellData of spellBook.SpellBook) {

        let spellDataStruct = data.SpellMap.get(spellData.SpellID+"");

        // Filter Thru Search //
        let willDisplay = true;
        if(spellBookSearchInput != null){
            let spellName = spellDataStruct.Spell.name.toLowerCase();
            if(!spellName.includes(spellBookSearchInput)){
                willDisplay = false;
            }
        }

        if(!willDisplay){continue;}
        // Display Spell in SpellBook //

        let spellName = spellDataStruct.Spell.name;
        if(spellDataStruct.Spell.isArchived === 1){
            spellName += '<em class="pl-1">(archived)</em>';
        }

        let spellBookListingID = "spellBookListing"+spellListingCount;
        let spellLevel = (spellDataStruct.Spell.level == 0) ? "Cantrip" : "Lvl "+spellDataStruct.Spell.level;

        $('#manageSpellsSpellBook').append('<div id="'+spellBookListingID+'" class="border-bottom border-dark-lighter cursor-clickable has-background-black-ter" name="'+spellDataStruct.Spell.id+'" style="z-index: 40; border-radius: 5px;"><span class="is-size-6 has-text-grey-light ml-3 mr-1">'+spellName+'</span><span class="is-size-7 has-text-grey-light is-pulled-right ml-1 mr-3">('+spellLevel+')</span></div>');
        
        $('#'+spellBookListingID).click(function(){
            openQuickView('spellView', {
                SpellDataStruct: spellDataStruct,
                SRCTabData: {SpellSRC: spellBook.SpellSRC, SpellLevel: spellData.SpellLevel, Data: data},
            });
        });

        $('#'+spellBookListingID).mouseenter(function(){
            $(this).addClass('has-background-grey-darker');
        });
        $('#'+spellBookListingID).mouseleave(function(){
            $(this).removeClass('has-background-grey-darker');
        });

        $('#'+spellBookListingID).draggable({ opacity: 0.8, helper: "clone", revert: true });

        spellListingCount++;
    }

    if(spellBook.SpellBook.length == 0){
        $('#manageSpellsSpellBook').append('<p class="is-size-7 has-text-centered is-italic pt-2">You have no spells!</p>');
    }

}

function displaySpellSlotsPrepared(spellSRC, data) {

    let spellSlotArray = data.SpellSlotsMap.get(spellSRC);
    let spellSlotMap = new Map();
    for(let spellSlot of spellSlotArray){
        let spellSlotMapArray = [];
        if(spellSlotMap.has(spellSlot.slotLevel)){
            spellSlotMapArray = spellSlotMap.get(spellSlot.slotLevel);
        }
        spellSlotMapArray.push(spellSlot);
        spellSlotMap.set(spellSlot.slotLevel, spellSlotMapArray);
    }

    $('#manageSpellsSlots').html('');
    for(const [level, slotArray] of spellSlotMap){

        let sectionName = (level == 0) ? 'Cantrips' : 'Level '+level;
        $('#manageSpellsSlots').append('<p class="is-size-5 has-text-grey-kinda-light has-text-weight-bold text-left pl-5">'+sectionName+'</p>');
        $('#manageSpellsSlots').append('<hr class="hr-highlighted" style="margin-top:-0.5em; margin-bottom:0em;">');

        let spellSlotsButtonsID = 'spellManagerSlotsButtons'+level;
        $('#manageSpellsSlots').append('<div id="'+spellSlotsButtonsID+'" class="buttons is-centered mt-1"></div>');
        for(let slot of slotArray){
            let spellManagerSlotID = 'spellManagerSlot'+slot.slotID;
            let spellDataStruct = data.SpellMap.get(slot.spellID+"");
            if(spellDataStruct != null) {
                $('#'+spellSlotsButtonsID).append('<p id="'+spellManagerSlotID+'" class="button is-filled-spell-slot">'+spellDataStruct.Spell.name+'</p>');

                $('#'+spellManagerSlotID).click(function(){
                    openQuickView('spellView', {
                        SpellDataStruct: spellDataStruct,
                        SpellSlotData: {Slot: slot, SpellSRC: spellSRC, Data: data},
                    });
                });

            } else {
                $('#'+spellSlotsButtonsID).append('<a id="'+spellManagerSlotID+'" class="button is-static is-empty-spell-slot">Empty</a>');
            }

            $("#"+spellManagerSlotID).droppable({
                tolerance: "pointer",
                drop: function(event, ui) {
                    updateSpellSlot($(ui.draggable).attr('name'), slot, spellSRC, data);
                }
            });
            
        }

    }

}

function slotCanTakeSpell(spellDataStruct, slot){
    if(spellDataStruct.Spell.level > slot.slotLevel){
        return false;
    }
    if(spellDataStruct.Spell.level == 0 && slot.slotLevel != 0){
        return false;
    }

    return true;

}

function updateSpellSlot(spellID, slot, spellSRC, data){
    if(spellID != null) {
        let spellDataStruct = data.SpellMap.get(spellID+"");
        if(!slotCanTakeSpell(spellDataStruct, slot)){
            return;
        }
    }

    // Update Data Struct to Add Spell to Slot
    slot.spellID = spellID;
    socket.emit("requestSpellSlotUpdate",
        getCharIDFromURL(),
        slot);

    
    let spellSlotsArray = g_spellSlotsMap.get(spellSRC);
    if(spellSlotsArray != null){
        spellSlotsArray = updateSlotSpellID(spellSlotsArray, slot.slotID, spellID);
    }
    g_spellSlotsMap.set(spellSRC, spellSlotsArray);
    data.SpellSlotsMap = g_spellSlotsMap;

    openSpellSRCTab(spellSRC, data);

}

function updateSlotSpellID(spellSlotsArray, slotID, spellID) {
    for(let slot of spellSlotsArray){
        if(slot.slotID == slotID){
            slot.spellID = spellID;
            return spellSlotsArray;
        }
    }
    return spellSlotsArray;
}

function updateSlotUsed(spellSlotsArray, slotID, used) {
    for(let slot of spellSlotsArray){
        if(slot.slotID == slotID){
            slot.used = used;
            return spellSlotsArray;
        }
    }
    return spellSlotsArray;
}

function removeAllNullSpells(spellBook) {
    for(let i = spellBook.length - 1; i >= 0; i--) {
        if(spellBook[i] === null) {
            spellBook.splice(i, 1);
        }
    }
    return spellBook;
}