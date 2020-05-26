
//------------------------- Processing Spells ------------------------//
function processingInnateSpells(ascStatement, srcStruct, locationID){

    if(ascStatement.includes("GIVE-INNATE-SPELL")){// GIVE-INNATE-SPELL=Meld_Into_Stone:3:divine:1
        let data = ascStatement.split('=')[1]; // Set cast times per day to 0 to cast an unlimited number
        let segments = data.split(':');// For cantrips just do: GIVE-INNATE-SPELL=Daze:0:divine:0
        giveInnateSpell(srcStruct, segments[0], segments[1], segments[2], segments[3]);
    } else {
        displayError("Unknown statement (2): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Innate Spell ///////////////////////////////////
function giveInnateSpell(srcStruct, spellName, spellLevel, spellTradition, timesPerDay){
    if(spellTradition != null){
        spellName = spellName.replace(/_/g," ");
        if(spellTradition === 'OCCULT' || spellTradition === 'ARCANE' || spellTradition === 'DIVINE' || spellTradition === 'PRIMAL') {
            socket.emit("requestInnateSpellChange",
                getCharIDFromURL(),
                srcStruct,
                spellName,
                spellLevel,
                spellTradition,
                timesPerDay);
        } else {
            displayError("Unknown Spell Tradition: \'"+spellTradition+"\'");
            statementComplete();
        }
    } else {
        displayError("Invalid Spell Tradition");
        statementComplete();
    }
}

socket.on("returnInnateSpellChange", function(){
    statementComplete();
});