/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

//------------------------- Processing Spells ------------------------//
function processingSpells(wscStatement, srcStruct, locationID){

    if(wscStatement.includes("SET-SPELL-SLOTS")){// SET-SPELL-SLOTS=Bard:Three-Quarters/Full/Single-Set
        let data = wscStatement.split('=')[1];
        let segments = data.split(':');
        giveSpellCasting(srcStruct, segments[0], segments[1]);
    } else if(wscStatement.includes("GIVE-SPELL-SLOT")){// GIVE-SPELL-SLOT=Bard:10
        let data = wscStatement.split('=')[1];
        let segments = data.split(':');
        giveSpellSlot(srcStruct, segments[0], segments[1]);
    } else if(wscStatement.includes("SET-SPELL-KEY-ABILITY")){// SET-SPELL-KEY-ABILITY=Bard:INT
        let data = wscStatement.split('=')[1]; //                 Will default to CHA if nothing is set
        let segments = data.split(':');
        setSpellKeyAbility(srcStruct, segments[0], segments[1]);
    } else if(wscStatement.includes("SET-SPELL-CASTING-TYPE")){
        let data = wscStatement.split('=')[1]; //                 Will default to PREPARED-LIST
        let segments = data.split(':');// SET-SPELL-CASTING-TYPE=Bard:PREPARED-LIST/PREPARED-BOOK/SPONTANEOUS-REPERTOIRE
        setSpellCastingType(srcStruct, segments[0], segments[1]);
    } else if(wscStatement.includes("SET-SPELL-TRADITION")){// SET-SPELL-TRADITION=Wizard:Primal/Divine/Occult/Arcane
        let data = wscStatement.split('=')[1];
        let segments = data.split(':');
        giveSpellList(srcStruct, segments[0], segments[1]);
    } else if(wscStatement.includes("ADD-SPELL-TO-LIST")){// ADD-SPELL-TO-LIST=Wizard:Meld_Into_Stone:3
        let data = wscStatement.split('=')[1];
        let segments = data.split(':');
        addSpellToSpellbook(srcStruct, segments[0], segments[1], segments[2]);
    } else {
        displayError("Unknown statement (2-Spell): \'"+wscStatement+"\'");
        statementComplete();
    }

}


//////////////////////////////// Set Spell Slots ///////////////////////////////////
function giveSpellCasting(srcStruct, spellSRC, spellcasting){
    socket.emit("requestSpellCastingSlotChange",
        getCharIDFromURL(),
        srcStruct,
        spellSRC,
        spellcasting);
}

function giveSpellSlot(srcStruct, spellSRC, spellSlot){
    socket.emit("requestSpellSlotChange",
        getCharIDFromURL(),
        srcStruct,
        spellSRC,
        spellSlot);
}

socket.on("returnSpellSlotChange", function(){
    statementComplete();
});

//////////////////////////////// Set Key Ability ///////////////////////////////////
function setSpellKeyAbility(srcStruct, spellSRC, abilityScore){
    if(getAllAbilityTypes().includes(lengthenAbilityType(abilityScore))){
        socket.emit("requestKeySpellAbilityChange",
            getCharIDFromURL(),
            srcStruct,
            spellSRC,
            abilityScore);
    } else {
        displayError("Cannot identify ability score (case sensitive): '"+abilityScore+"'!");
        statementComplete();
    }
}

socket.on("returnKeySpellAbilityChange", function(){
    statementComplete();
});

//////////////////////////////// Give Spell List ///////////////////////////////////
function giveSpellList(srcStruct, spellSRC, spellList){
    if(spellList === 'OCCULT' || spellList === 'ARCANE' || spellList === 'DIVINE' || spellList === 'PRIMAL') {
        socket.emit("requestSpellTraditionChange",
            getCharIDFromURL(),
            srcStruct,
            spellSRC,
            spellList);
    } else {
        displayError("Unknown Spell Tradition: \'"+spellList+"\'");
        statementComplete();
    }
}

socket.on("returnSpellListChange", function(){
    statementComplete();
});

//////////////////////////////// Set Casting Type ///////////////////////////////////
function setSpellCastingType(srcStruct, spellSRC, castingType){
    if(castingType === 'PREPARED-LIST' || castingType === 'PREPARED-BOOK' || castingType === 'PREPARED-FAMILIAR' || castingType === 'SPONTANEOUS-REPERTOIRE') {
        socket.emit("requestSpellCastingTypeChange",
            getCharIDFromURL(),
            srcStruct,
            spellSRC,
            castingType);
    } else {
        displayError("Unknown Spellcasting Type: \'"+castingType+"\'");
        statementComplete();
    }
}

socket.on("returnSpellCastingTypeChange", function(){
    statementComplete();
});


//////////////////////////////// Add Spell to Spellbook ///////////////////////////////////
function addSpellToSpellbook(srcStruct, spellSRC, spellName, spellLevel){
    spellName = spellName.replace(/_/g," ");
    socket.emit("requestBuilderSpellAddToSpellBook",
        getCharIDFromURL(),
        srcStruct,
        spellSRC,
        spellName,
        spellLevel);
}

socket.on("returnBuilderSpellAddToSpellBook", function(){
    statementComplete();
});