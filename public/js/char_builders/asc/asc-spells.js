
//------------------------- Processing Spells ------------------------//
function processingSpells(ascStatement, srcID, locationID, statementNum){

    if(ascStatement.includes("GIVE-SPELL-LIST-SPELL")){// GIVE-SPELL-LIST-SPELL=14
        let spellID = ascStatement.split('=')[1];
        giveSpellListSpell(srcID, statementNum, spellID);
    } else if(ascStatement.includes("GIVE-SPELL-LIST")){// GIVE-SPELL-LIST=Primal/Divine/Occult/Arcane
        let spellList = ascStatement.split('=')[1];
        giveSpellList(srcID, statementNum, spellList);
    } else {
        displayError("Unknown statement (2): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Spells ///////////////////////////////////
function giveSpellListSpell(srcID, statementNum, spellID){
    socket.emit("requestSpellListChangeSpell",
        getCharIDFromURL(),
        srcID+statementNum,
        spellID);
}

function giveSpellList(srcID, statementNum, spellList){
    let spellLiUp = spellList.toUpperCase();
    if(spellLiUp == 'OCCULT' || spellLiUp == 'ARCANE' || spellLiUp == 'DIVINE' || spellLiUp == 'PRIMAL') {
        socket.emit("requestSpellListChangeTradition",
            getCharIDFromURL(),
            srcID+statementNum,
            spellLiUp);
    } else {
        displayError("Unknown Spell Tradition: \'"+spellList+"\'");
        statementComplete();
    }
}

socket.on("returnSpellListChangeTradition", function(){
    statementComplete();
});