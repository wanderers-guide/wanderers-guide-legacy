/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

//--------------------- Processing Lore --------------------//
function processingLore(wscStatement, srcStruct, locationID){

    if(wscStatement.includes("GIVE-LORE=")){ // GIVE-LORE=Sailing
        let loreName = wscStatement.split('=')[1];
        giveLore(srcStruct, loreName);
    } else if(wscStatement.includes("GIVE-LORE-CHOOSE")){ // GIVE-LORE-CHOOSE
        giveLoreChoose(srcStruct, locationID);
    } else {
        displayError("Unknown statement (2-Lore): \'"+wscStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Lore Choose ///////////////////////////////////

function giveLoreChoose(srcStruct, locationID){

    let inputLoreID = "inputLore"+locationID+"-"+srcStruct.sourceCodeSNum;
    let inputLoreControlShell = inputLoreID+'ControlShell';

    $('#'+locationID).append('<div class="field is-grouped is-grouped-centered is-marginless mt-1"><div id="'+inputLoreControlShell+'" class="control"><input id="'+inputLoreID+'" class="input loreInput" type="text" maxlength="20" placeholder="Lore Type"></div></div>');

    // Set saved lore input data
    let savedLoreData = wscChoiceStruct.LoreArray.find(loreData => {
        return hasSameSrc(loreData, srcStruct);
    });

    $('#'+inputLoreID).change(function(){

        if($(this).val() == ''){

            $(this).removeClass("is-danger");
            $('#'+inputLoreControlShell).addClass("is-loading");
            socket.emit("requestLoreChange",
                getCharIDFromURL(),
                srcStruct,
                null,
                { ControlShellID: inputLoreControlShell });

        } else {

            let validNameRegex = /^[A-Za-z0-9 \-_]+$/;
            if(validNameRegex.test($(this).val())) {
                $(this).removeClass("is-danger");

                $('#'+inputLoreControlShell).addClass("is-loading");
                socket.emit("requestLoreChange",
                    getCharIDFromURL(),
                    srcStruct,
                    $(this).val().toUpperCase(),
                    { ControlShellID: inputLoreControlShell });

            } else {
                $(this).addClass("is-danger");
            }

        }

    });

    if(savedLoreData != null){
        $('#'+inputLoreID).val(capitalizeWords(savedLoreData.value));
        $('#'+inputLoreID).trigger("change");
    }

    statementComplete();

}

//////////////////////////////// Give Lore ///////////////////////////////////

function giveLore(srcStruct, loreName){

    socket.emit("requestLoreChange",
        getCharIDFromURL(),
        srcStruct,
        loreName);

}

socket.on("returnLoreChange", function(srcStruct, loreName, inputPacket){
    if(inputPacket != null){
        $('#'+inputPacket.ControlShellID).removeClass("is-loading");
    } else {
        statementComplete();
    }

    skillsUpdateWSCChoiceStruct(srcStruct, loreName+'_LORE', 'T');

});