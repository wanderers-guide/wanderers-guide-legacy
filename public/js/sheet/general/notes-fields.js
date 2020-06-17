
function displayNotesField(qContent, srcStruct, rows=4){

    let notesData = getNotesData(srcStruct);
    if(notesData == null){return;}

    let notesDataSections = notesData.value.split(',,,');
    let placeholderText = notesDataSections[0];
    let notesText = notesDataSections[1];

    let notesFieldID = notesData.charID+'-'+notesData.source+'-'+notesData.sourceType+'-'+notesData.sourceLevel+'-'+notesData.sourceCode+'-'+notesData.sourceCodeSNum;
    let notesFieldControlShellID = notesFieldID+'ControlShell';
    qContent.append('<div id="'+notesFieldControlShellID+'" class="control mt-1 mx-1"><textarea id="'+notesFieldID+'" class="textarea use-custom-scrollbar" rows="'+rows+'" spellcheck="false" maxlength="3000" placeholder="'+placeholderText+'">'+notesText+'</textarea></div>');

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

function getNotesData(srcStruct){
    for(let notesData of g_notesFields) {
        // Checks if the note field statement's parent is the input srcStruct
        if(srcStruct.sourceCode === notesData.sourceCode){
            let sNum = notesData.sourceCodeSNum.substr(1); // Remove first char
            if(srcStruct.sourceCodeSNum === sNum) {
                return notesData;
            }
        }
    }
    return null;
}

socket.on("returnNotesFieldSave", function(notesFieldControlShellID){
    $("#"+notesFieldControlShellID).removeClass("is-loading");
});