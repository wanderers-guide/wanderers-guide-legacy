
//--------------------- Processing Char Tags --------------------//
function processingCharTags(ascStatement, srcStruct, locationID){
    
    if(ascStatement.includes("GIVE-CHAR-TRAIT-NAME")){ // GIVE-CHAR-TRAIT-NAME=Elf
        let charTagName = ascStatement.split('=')[1];
        giveCharTag(srcStruct, charTagName);
    } else {
        displayError("Unknown statement (2-CharTrait): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Char Tag ///////////////////////////////////

function giveCharTag(srcStruct, charTagName){
    charTagName = capitalizeWord(charTagName);

    socket.emit("requestCharTagChange",
        getCharIDFromURL(),
        srcStruct,
        charTagName);

}

socket.on("returnCharTagChange", function(){
    statementComplete();
});