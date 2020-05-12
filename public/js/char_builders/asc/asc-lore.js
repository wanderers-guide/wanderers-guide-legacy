
//--------------------- Processing Lore --------------------//
function processingLore(ascStatement, srcID, locationID, statementNum){

    if(ascStatement.includes("GIVE-LORE")){ // GIVE-LORE=Sailing
        let loreName = ascStatement.split('=')[1];
        giveLore(srcID, loreName);
    } else {
        displayError("Unknown statement (2): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Lore ///////////////////////////////////

function giveLore(srcID, loreName){

    socket.emit("requestLoreChange",
        getCharIDFromURL(),
        srcID,
        loreName);

}

socket.on("returnLoreChange", function(){
    statementComplete();
});