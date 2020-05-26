
//--------------------- Processing Lore --------------------//
function processingLore(ascStatement, srcStruct, locationID){

    if(ascStatement.includes("GIVE-LORE")){ // GIVE-LORE=Sailing
        let loreName = ascStatement.split('=')[1];
        giveLore(srcStruct, loreName);
    } else {
        displayError("Unknown statement (2): \'"+ascStatement+"\'");
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