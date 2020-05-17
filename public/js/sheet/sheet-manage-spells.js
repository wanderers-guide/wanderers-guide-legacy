
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

    console.log(data);

    $('#manageSpellsTabs').html('');
    for(let spellBook of g_spellBookArray) {
        let spellSRCTabID = 'spellSRCTab'+spellBook.SpellSRC.replace(/\s/g, "_");
        $('#manageSpellsTabs').append('<li id="'+spellSRCTabID+'" class="spellSRCTabs"><a>'+spellBook.SpellSRC+'</a></li>');

        $('#'+spellSRCTabID).click(function(){
            $('.spellSRCTabs').removeClass('is-active');
            $('#'+spellSRCTabID).addClass('is-active');
            openSpellSRCTab(spellBook.SpellSRC, data);
        });

    }

    $("#manageSpellsTabs").children(":first").trigger("click");


    $('#manageSpellsModalDefault').addClass('is-active');
    $('html').addClass('is-clipped');

}

function closeManageSpellsModal(){

    $('#manageSpellsModalDefault').removeClass('is-active');
    $('html').removeClass('is-clipped');

}



function openSpellSRCTab(spellSRC, data){

    let spellBook = g_spellBookArray.find(spellBook => {
        return spellBook.SpellSRC === spellSRC;
    });

    $('#manageSpellsOpenSpellListsBtn').click(function(){
        openQuickView('addSpellView', {
            SpellBook: spellBook,
            Data: data,
        });
    });

    $('#manageSpellsSpellBook').html('');
    let spellListingCount = 0;
    for(let spellID of spellBook.SpellBook) {
        let spellDataStruct = data.SpellMap.get(spellID+"");
        let spellBookListingID = "spellBookListing"+spellListingCount;

        $('#manageSpellsSpellBook').append('<div class="columns is-mobile"><div class="column is-1"><span class="icon has-text-danger"><i class="fas fa-lg fa-times"></i></span></div><div class="column is-11"><a id="'+spellBookListingID+'" class="button is-info" name="'+spellDataStruct.Spell.id+'" style="display: flex; overflow: hidden;">'+spellDataStruct.Spell.name+'</a></div></div>');

        $('#'+spellBookListingID).click(function(){
            openQuickView('spellView', {
                SpellDataStruct: spellDataStruct,
            });
        });

        $('#'+spellBookListingID).draggable({ opacity: 0.7, helper: "clone" });

        spellListingCount++;
    }

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
        $('#manageSpellsSlots').append('<p class="is-size-5 has-text-grey-light has-text-weight-bold text-left pl-5">'+sectionName+'</p>');
        $('#manageSpellsSlots').append('<hr class="hr-light" style="margin-top:-0.5em; margin-bottom:0em;">');

        let spellSlotsButtonsID = 'spellManagerSlotsButtons'+level;
        $('#manageSpellsSlots').append('<div id="'+spellSlotsButtonsID+'" class="buttons is-centered mt-1"></div>');
        for(let slot of slotArray){
            let spellManagerSlotID = 'spellManagerSlot'+slot.slotID;
            let spellDataStruct = data.SpellMap.get(slot.spellID+"");
            if(spellDataStruct != null) {
                $('#'+spellSlotsButtonsID).append('<a id="'+spellManagerSlotID+'" class="button is-info" style="display: flex; overflow: hidden;">'+spellDataStruct.Spell.name+'</a>');

                $('#'+spellManagerSlotID).click(function(){
                    openQuickView('spellView', {
                        SpellDataStruct: spellDataStruct,
                    });
                });

            } else {
                $('#'+spellSlotsButtonsID).append('<a id="'+spellManagerSlotID+'" class="button is-static" style="display: flex; overflow: hidden;">Empty</a>');
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

function updateSpellSlot(spellID, slot, spellSRC, data){

    slot.spellID = spellID;
    socket.emit("requestSpellSlotUpdate",
        getCharIDFromURL(),
        slot);

    
    let spellSlotsArray = g_spellSlotsMap.get(spellSRC);
    if(spellSlotsArray != null){
        spellSlotsArray = updateSlot(spellSlotsArray, slot.slotID, spellID);
    }
    g_spellSlotsMap.set(spellSRC, spellSlotsArray);
    data.SpellSlotsMap = g_spellSlotsMap;

    console.log(g_spellSlotsMap);
    console.log(data);

    openSpellSRCTab(spellSRC, data);

}

function updateSlot(spellSlotsArray, slotID, spellID) {
    for(let slot of spellSlotsArray){
        if(slot.slotID == slotID){
            slot.spellID = spellID;
            return spellSlotsArray;
        }
    }
    return spellSlotsArray;
}
