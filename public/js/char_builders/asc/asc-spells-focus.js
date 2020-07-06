
//------------------------- Processing Focus Spells ------------------------//
function processingFocusSpells(ascStatement, srcStruct, locationID){

     if(ascStatement.includes("GIVE-FOCUS-SPELL")){// GIVE-FOCUS-SPELL=Bard:Meld_Into_Stone
        let data = ascStatement.split('=')[1];
        let segments = data.split(':');
        giveFocusSpell(srcStruct, segments[0], segments[1]);
    } else if(ascStatement.includes("GIVE-FOCUS-POINT")){// GIVE-FOCUS-POINT
        giveFocusPoint(srcStruct);
    } else {
        displayError("Unknown statement (2-SpellFocus): \'"+ascStatement+"\'");
        statementComplete();
    }

}

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

//////////////////////////////// Give Focus Point ///////////////////////////////////
function giveFocusPoint(srcStruct){
    socket.emit("requestFocusPointChange",
        getCharIDFromURL(),
        srcStruct);
}

socket.on("returnFocusPointChange", function(){
    statementComplete();
});