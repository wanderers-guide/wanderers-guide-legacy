
//--------------------- Processing Notes --------------------//
function processingNotes(ascStatement, srcStruct, locationID){

    if(ascStatement.includes("GIVE-NOTES-FIELD")){ // GIVE-NOTES-FIELD=Placeholder Text
        let placeholderText = ascStatement.split('=')[1]; // - Displays notes field for feats and class abilities
        giveNotesField(srcStruct, placeholderText);
    } else {
        displayError("Unknown statement (2-Notes): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Notes Field ///////////////////////////////////

function giveNotesField(srcStruct, placeholderText){
    placeholderText = capitalizeWord(placeholderText);

    socket.emit("requestNotesFieldChange",
        getCharIDFromURL(),
        srcStruct,
        placeholderText);

}

socket.on("returnNotesFieldChange", function(){
    statementComplete();
});