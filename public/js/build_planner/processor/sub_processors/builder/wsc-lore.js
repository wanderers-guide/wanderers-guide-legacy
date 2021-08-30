/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

//--------------------- Processing Lore --------------------//
function processingLore(wscStatement, srcStruct, locationID, sourceName){

    if(wscStatement.includes("GIVE-LORE=")){ // GIVE-LORE=Sailing
        let loreName = wscStatement.split('=')[1];
        giveLore(srcStruct, loreName, sourceName);
    } else if(wscStatement.includes("GIVE-LORE-CHOOSE-INCREASING")){ // GIVE-LORE-CHOOSE-INCREASING
        giveLoreChooseIncreasing(srcStruct, locationID, sourceName);
    } else if(wscStatement.includes("GIVE-LORE-CHOOSE")){ // GIVE-LORE-CHOOSE
        giveLoreChoose(srcStruct, locationID, sourceName);
    } else {
        displayError("Unknown statement (2-Lore): \'"+wscStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Lore Choose ///////////////////////////////////

function giveLoreChooseIncreasing(srcStruct, locationID, sourceName){
  // At 3rd, 7th, and 15th level automatically increase lore
  let charLevel = g_character.level;
  if(charLevel >= 15){
    giveLoreChoose(srcStruct, locationID, sourceName, 'L');
  } else if(charLevel >= 7){
    giveLoreChoose(srcStruct, locationID, sourceName, 'M');
  } else if(charLevel >= 3){
    giveLoreChoose(srcStruct, locationID, sourceName, 'E');
  } else {
    giveLoreChoose(srcStruct, locationID, sourceName, 'T');
  }
}

function giveLoreChoose(srcStruct, locationID, sourceName, prof='T'){

    let inputLoreID = "inputLore"+locationID+"-"+srcStruct.sourceCode+"-"+srcStruct.sourceCodeSNum;
    let inputLoreControlShell = inputLoreID+'ControlShell';

    // If ID already exists, just return. This is a temporary fix - this shouldn't be an issue in the first place.
    if($('#'+inputLoreID).length != 0) { statementComplete(); return; }

    $('#'+locationID).append('<div class="field is-grouped is-grouped-centered is-marginless mt-1"><div id="'+inputLoreControlShell+'" class="control"><input id="'+inputLoreID+'" class="input loreInput" type="text" maxlength="20" placeholder="Lore Type" autocomplete="off"></div></div>');

    // Set saved lore input data
    let savedLoreData = getDataSingle(DATA_SOURCE.LORE, srcStruct);

    $('#'+inputLoreID).change(function(event, isAutoLoad){
        isAutoLoad = (isAutoLoad == null) ? false : isAutoLoad;

        if($(this).val() == ''){

            $(this).removeClass("is-danger");
            $('#'+inputLoreControlShell).addClass("is-loading");

            deleteData(DATA_SOURCE.LORE, srcStruct);
            deleteData(DATA_SOURCE.PROFICIENCY, srcStruct);

            socket.emit("requestLoreChange",
                getCharIDFromURL(),
                srcStruct,
                null,
                { ControlShellID: inputLoreControlShell, isAutoLoad},
                prof,
                sourceName);

        } else {

            let validNameRegex = /^[A-Za-z0-9 \-_']+$/;
            if(validNameRegex.test($(this).val())) {
                $(this).removeClass("is-danger");

                $('#'+inputLoreControlShell).addClass("is-loading");

                let loreName = $(this).val().toUpperCase();

                setData(DATA_SOURCE.LORE, srcStruct,  loreName);
                setDataProficiencies(srcStruct, 'Skill', loreName+'_LORE', prof, sourceName);

                socket.emit("requestLoreChange",
                    getCharIDFromURL(),
                    srcStruct,
                    loreName,
                    { ControlShellID: inputLoreControlShell, isAutoLoad},
                    prof,
                    sourceName);

            } else {
                $(this).addClass("is-danger");
            }

        }

    });

    if(savedLoreData != null){
      $('#'+inputLoreID).val(capitalizeWords(savedLoreData.value));
    }
    $('#'+inputLoreID).trigger("change", [true]);

    statementComplete();

}

//////////////////////////////// Give Lore ///////////////////////////////////

function giveLore(srcStruct, loreName, sourceName){

  setData(DATA_SOURCE.LORE, srcStruct,  loreName);
  setDataProficiencies(srcStruct, 'Skill', loreName+'_LORE', 'T', sourceName);

  socket.emit("requestLoreChange",
      getCharIDFromURL(),
      srcStruct,
      loreName,
      null,
      'T',
      sourceName);

}

socket.on("returnLoreChange", function(srcStruct, loreName, inputPacket, prof){

    if(inputPacket != null){
        $('#'+inputPacket.ControlShellID).removeClass("is-loading");
    } else {
        statementComplete();
    }

    if(loreName != null){
        //skillsUpdateWSCChoiceStruct(srcStruct, loreName+'_LORE', prof);
    } else {
        //skillsUpdateWSCChoiceStruct(srcStruct, null, null);
    }
    if(inputPacket == null || inputPacket.isAutoLoad == null || !inputPacket.isAutoLoad) {
      updateSkillMap(true);
    }

});