
function openNotesTab(data) {

    let notesAreaID = "notesArea";
    let notesAreaControlShellID = "notesAreaControlShell";

    $('#tabContent').html('<div id="'+notesAreaControlShellID+'" class="control mt-3"><textarea id="'+notesAreaID+'" class="textarea has-fixed-size use-custom-scrollbar" rows="24" spellcheck="false" placeholder="Feel free to write notes here about your character, campaign, or anything else you\'d like!"></textarea></div>');

    $("#"+notesAreaID).val(data.Character.notes);

    $("#"+notesAreaID).blur(function(){
        if(data.Character.notes != $(this).val()) {

            $("#"+notesAreaControlShellID).addClass("is-loading");

            socket.emit("requestNotesSave",
                getCharIDFromURL(),
                $(this).val());
            
            data.Character.notes = $(this).val();

        }
    });

}

socket.on("returnNotesSave", function(){
    $("#notesAreaControlShell").removeClass("is-loading");
    $('#notesArea').blur();
});