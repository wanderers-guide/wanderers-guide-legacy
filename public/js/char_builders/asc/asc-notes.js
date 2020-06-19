
//--------------------- Processing Notes --------------------//
function processingNotes(ascStatement, srcStruct, locationID){

    if(ascStatement.includes("GIVE-NOTES-FIELD")){ // GIVE-NOTES-FIELD=Placeholder Text
        let placeholderText = ascStatement.split('=')[1]; // - Displays notes field for feats and class abilities
        giveNotesField(srcStruct, placeholderText, locationID);
    } else {
        displayError("Unknown statement (2-Notes): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Notes Field ///////////////////////////////////

function giveNotesField(srcStruct, placeholderText, locationID){
    placeholderText = capitalizeWord(placeholderText);

    socket.emit("requestNotesFieldChange",
        getCharIDFromURL(),
        srcStruct,
        placeholderText,
        locationID);

}

socket.on("returnNotesFieldChange", function(notesData, locationID){
    statementComplete();

    let placeholderText = notesData.placeholderText;
    let notesText = notesData.text;

    let notesFieldID = getCharIDFromURL()+'-'+notesData.source+'-'+notesData.sourceType+'-'+notesData.sourceLevel+'-'+notesData.sourceCode+'-'+notesData.sourceCodeSNum;
    let notesFieldControlShellID = notesFieldID+'ControlShell';
    $('#'+locationID).append('<div id="'+notesFieldControlShellID+'" class="control mt-1 mx-5 px-5"><textarea id="'+notesFieldID+'" class="textarea use-custom-scrollbar" rows="2" spellcheck="false" maxlength="3000" placeholder="'+placeholderText+'">'+notesText+'</textarea></div>');

    $("#"+notesFieldID).blur(function(){
        if(notesData.text != $(this).val()) {

            $("#"+notesFieldControlShellID).addClass("is-loading");
            
            notesData.text = $(this).val();

            socket.emit("requestNotesFieldSave",
                getCharIDFromURL(),
                notesData,
                notesFieldControlShellID);

        }
    });

});

socket.on("returnNotesFieldSave", function(notesFieldControlShellID){
    $("#"+notesFieldControlShellID).removeClass("is-loading");
});