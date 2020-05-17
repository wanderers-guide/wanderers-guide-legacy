
//------------------------- Processing Spells ------------------------//
function processingSpells(ascStatement, srcID, locationID, statementNum){

    if(ascStatement.includes("GIVE-SPELL-SLOTS")){// GIVE-SPELL-SLOTS=Three-Quarters/Full:Bard
        let data = ascStatement.split('=')[1];
        let segments = data.split(':');
        giveSpellCasting(srcID, statementNum, segments[0], segments[1]);
    } else if(ascStatement.includes("GIVE-SPELL-SLOT")){// GIVE-SPELL-SLOT=10:Bard
        let data = ascStatement.split('=')[1];
        let segments = data.split(':');
        giveSpellSlot(srcID, statementNum, segments[0], segments[1]);
    } else if(ascStatement.includes("SET-SPELL-KEY-ABILITY")){// SET-SPELL-KEY-ABILITY=Bard:INT
        let data = ascStatement.split('=')[1]; //                 Will default to CHA if nothing is set
        let segments = data.split(':');
        setSpellKeyAbility(srcID, statementNum, segments[0], segments[1]);
    } else if(ascStatement.includes("SET-SPELL-LIST")){// SET-SPELL-LIST=Wizard:Primal/Divine/Occult/Arcane
        let data = ascStatement.split('=')[1];
        let segments = data.split(':');
        giveSpellList(srcID, statementNum, segments[0], segments[1]);
    } else {
        displayError("Unknown statement (2): \'"+ascStatement+"\'");
        statementComplete();
    }

}


//////////////////////////////// Give Spell Slots ///////////////////////////////////
function giveSpellCasting(srcID, statementNum, spellcasting, spellSRC){
    console.log('GOT HEREEE '+spellSRC+" "+spellcasting);
    socket.emit("requestSpellCastingChange",
        getCharIDFromURL(),
        srcID+statementNum,
        spellSRC,
        spellcasting);
}

function giveSpellSlot(srcID, statementNum, spellSlot, spellSRC){
    socket.emit("requestSpellSlotChange",
        getCharIDFromURL(),
        srcID+statementNum,
        spellSRC,
        spellSlot);
}

socket.on("returnSpellSlotChange", function(){
    statementComplete();
});

//////////////////////////////// Set Key Ability ///////////////////////////////////
function setSpellKeyAbility(srcID, statementNum, spellSRC, abilityScore){
    if(getAllAbilityTypes().includes(lengthenAbilityType(abilityScore))){
        socket.emit("requestKeySpellAbilityChange",
            getCharIDFromURL(),
            srcID+statementNum,
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
function giveSpellList(srcID, statementNum, spellSRC, spellList){
    let spellLiUp = spellList.toUpperCase();
    if(spellLiUp == 'OCCULT' || spellLiUp == 'ARCANE' || spellLiUp == 'DIVINE' || spellLiUp == 'PRIMAL') {
        socket.emit("requestSpellTraditionChange",
            getCharIDFromURL(),
            srcID+statementNum,
            spellSRC,
            spellLiUp);
    } else {
        displayError("Unknown Spell Tradition: \'"+spellList+"\'");
        statementComplete();
    }
}

socket.on("returnSpellListChange", function(){
    statementComplete();
});