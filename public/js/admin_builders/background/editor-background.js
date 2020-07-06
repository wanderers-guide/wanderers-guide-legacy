
$(function () {

    socket.emit("requestAdminBackgroundDetails");

});

socket.on("returnAdminBackgroundDetails", function(backgrounds){
    
    let backgroundID = getBackgroundEditorIDFromURL();
    let background = backgrounds.find(background => {
        return background.id == backgroundID;
    });

    if(background == null){
        window.location.href = '/admin/manage/background';
        return;
    }

    $("#inputName").val(background.name);
    $("#inputVersion").val(background.version);
    $("#inputDescription").val(background.description);
    $("#inputCode").val(background.code);
    $("#inputContentSource").val(background.contentSrc);

    // Background Boost
    let boostArray = background.boostOne.split(',');
    for(let boost of boostArray){
        $('#inputBoosts option[value="'+boost+'"]').attr('selected','selected');
    }

    $("#updateButton").click(function(){
        $(this).unbind();
        finishBackground(true);
    });

});