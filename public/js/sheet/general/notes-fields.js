
function displayNotesField(qContent, sourceCode){

    let notesData = getNotesData(sourceCode);
    if(notesData == null){return;}

    let notesDataSections = notesData.value.split(',,,');
    let placeholderText = notesDataSections[0];
    let notesText = notesDataSections[1];

    let notesFieldID = notesData.charID+'-'+notesData.source+'-'+notesData.sourceType+'-'+notesData.sourceLevel+'-'+notesData.sourceCode+'-'+notesData.sourceCodeSNum;
    let notesFieldControlShellID = notesFieldID+'ControlShell';
    qContent.append('<div id="'+notesFieldControlShellID+'" class="control mt-1 mx-1"><textarea id="'+notesFieldID+'" class="textarea use-custom-scrollbar" rows="4" spellcheck="false" maxlength="3000" placeholder="'+placeholderText+'">'+notesText+'</textarea></div>');

    $("#"+notesFieldID).blur(function(){
        let notesDataValue = placeholderText+',,,'+$(this).val();
        if(notesData.value != notesDataValue) {

            $("#"+notesFieldControlShellID).addClass("is-loading");
            
            notesData.value = notesDataValue;

            socket.emit("requestNotesFieldSave",
                getCharIDFromURL(),
                notesData,
                notesFieldControlShellID);

        }
    });

}

function getNotesData(sourceCode){
    for(let notesData of g_notesFields) {
        if(sourceCode == notesData.sourceCode){
            return notesData;
        }
    }
    return null;
}

socket.on("returnNotesFieldSave", function(notesFieldControlShellID){
    $("#"+notesFieldControlShellID).removeClass("is-loading");
});