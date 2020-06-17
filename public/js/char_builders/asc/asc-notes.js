
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

socket.on("returnNotesFieldChange", function(notesDataValue, srcStruct, placeholderText, locationID){
    statementComplete();

    let notesData = srcStruct;
    notesData.value = notesDataValue;
    let notesText;
    if(notesDataValue != null){
        let notesDataSections = notesDataValue.split(',,,');
        placeholderText = notesDataSections[0];
        notesText = notesDataSections[1];
    } else {
        notesData.value = placeholderText+',,,';
        notesText = '';
    }

    let notesFieldID = getCharIDFromURL()+'-'+srcStruct.source+'-'+srcStruct.sourceType+'-'+srcStruct.sourceLevel+'-'+srcStruct.sourceCode+'-'+srcStruct.sourceCodeSNum;
    let notesFieldControlShellID = notesFieldID+'ControlShell';
    $('#'+locationID).append('<div id="'+notesFieldControlShellID+'" class="control mt-1 mx-5 px-5"><textarea id="'+notesFieldID+'" class="textarea use-custom-scrollbar" rows="2" spellcheck="false" maxlength="3000" placeholder="'+placeholderText+'">'+notesText+'</textarea></div>');

    $("#"+notesFieldID).blur(function(){
        let notesDataNewValue = placeholderText+',,,'+$(this).val();
        if(notesData.value != notesDataNewValue) {

            $("#"+notesFieldControlShellID).addClass("is-loading");
            
            notesData.value = notesDataNewValue;

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