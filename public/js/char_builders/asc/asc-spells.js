
//------------------------- Processing Spells ------------------------//
function processingSpells(ascStatement, srcStruct, locationID){

    if(ascStatement.includes("SET-SPELL-SLOTS")){// SET-SPELL-SLOTS=Bard:Three-Quarters/Full/Single-Set
        let data = ascStatement.split('=')[1];
        let segments = data.split(':');
        giveSpellCasting(srcStruct, segments[0], segments[1]);
    } else if(ascStatement.includes("GIVE-SPELL-SLOT")){// GIVE-SPELL-SLOT=Bard:10
        let data = ascStatement.split('=')[1];
        let segments = data.split(':');
        giveSpellSlot(srcStruct, segments[0], segments[1]);
    } else if(ascStatement.includes("GIVE-FOCUS-SPELL")){// GIVE-FOCUS-SPELL=Bard:Meld_Into_Stone
        let data = ascStatement.split('=')[1];
        let segments = data.split(':');
        giveFocusSpell(srcStruct, segments[0], segments[1]);
    } else if(ascStatement.includes("SET-SPELL-KEY-ABILITY")){// SET-SPELL-KEY-ABILITY=Bard:INT
        let data = ascStatement.split('=')[1]; //                 Will default to CHA if nothing is set
        let segments = data.split(':');
        setSpellKeyAbility(srcStruct, segments[0], segments[1]);
    } else if(ascStatement.includes("SET-SPELL-CASTING-TYPE")){
        let data = ascStatement.split('=')[1]; //                 Will default to PREPARED-LIST
        let segments = data.split(':');// SET-SPELL-CASTING-TYPE=Bard:PREPARED-LIST/PREPARED-BOOK/SPONTANEOUS-REPERTOIRE
        setSpellCastingType(srcStruct, segments[0], segments[1]);
    } else if(ascStatement.includes("SET-SPELL-TRADITION")){// SET-SPELL-TRADITION=Wizard:Primal/Divine/Occult/Arcane
        let data = ascStatement.split('=')[1];
        let segments = data.split(':');
        giveSpellList(srcStruct, segments[0], segments[1]);
    } else {
        displayError("Unknown statement (2-Spell): \'"+ascStatement+"\'");
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
    if(castingType === 'PREPARED-LIST' || castingType === 'PREPARED-BOOK' || castingType === 'SPONTANEOUS-REPERTOIRE') {
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

//////////////////////////////// Give Focus Spell ///////////////////////////////////
function giveFocusSpell(srcStruct, spellSRC, spellName){
    spellName = spellName.replace(/_/g," ");
    spellName = spellName.replace(/’/g,"'");
    socket.emit("requestFocusSpellChange",
        getCharIDFromURL(),
        srcStruct,
        spellSRC,
        spellName);
}

socket.on("returnFocusSpellChange", function(){
    statementComplete();
});