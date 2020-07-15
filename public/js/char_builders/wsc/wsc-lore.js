
//--------------------- Processing Lore --------------------//
function processingLore(wscStatement, srcStruct, locationID){

    if(wscStatement.includes("GIVE-LORE")){ // GIVE-LORE=Sailing
        let loreName = wscStatement.split('=')[1];
        giveLore(srcStruct, loreName);
    } else {
        displayError("Unknown statement (2-Lore): \'"+wscStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Lore ///////////////////////////////////

function giveLore(srcStruct, loreName){

    socket.emit("requestLoreChange",
        getCharIDFromURL(),
        srcStruct,
        loreName);

}

socket.on("returnLoreChange", function(){
    statementComplete();
});