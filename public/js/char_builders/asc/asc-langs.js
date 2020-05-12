
//------------------------- Processing Langs -------------------------//
function initLangProcessing(ascStatement, srcID, locationID, statementNum) {
    if(ascLangMap == null) {
        //console.log("Did not find valid langMap :(");
        socket.emit("requestASCLangs",
                getCharIDFromURL(),
                ascStatement,
                srcID,
                locationID,
                statementNum);
    } else {
        //console.log("> Found a valid langMap!");
        processingLangs(ascStatement, srcID, locationID, statementNum);
    }
}

socket.on("returnASCLangs", function(ascStatement, srcID, locationID, statementNum, langObject){
    let langMap = objToMap(langObject);
    //console.log("Setting langMap to new one...");
    ascLangMap = langMap;
    processingLangs(ascStatement, srcID, locationID, statementNum);
});

function processingLangs(ascStatement, srcID, locationID, statementNum){

    if(ascStatement.includes("GIVE-LANG-NAME")){ // GIVE-LANG-NAME=Elven
        let langName = ascStatement.split('=')[1];
        giveLangByName(srcID, langName);
    }
    else if(ascStatement.includes("GIVE-LANG-BONUS-ONLY")){// GIVE-LANG-BONUS-ONLY
        giveLang(srcID, locationID, statementNum, true);
    }
    else if(ascStatement.includes("GIVE-LANG")){// GIVE-LANG
        giveLang(srcID, locationID, statementNum, false);
    } else {
        displayError("Unknown statement (2): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Lang ///////////////////////////////////

function giveLang(srcID, locationID, statementNum, bonusOnly){

    let selectLangID = "selectLang"+locationID+statementNum;
    let selectLangControlShellClass = selectLangID+'ControlShell';
    let langDescriptionID = selectLangID+"Description";

    $('#'+locationID).append('<div class="field"><div class="select '+selectLangControlShellClass+'"><select id="'+selectLangID+'" class="selectLang"></select></div></div>');

    $('#'+locationID).append('<div class="columns is-centered"><div id="'+langDescriptionID+'" class="column is-8"></div></div>');

    $('#'+selectLangID).append('<option value="chooseDefault">Choose a Language</option>');
    $('#'+selectLangID).append('<hr class="dropdown-divider"></hr>');

    // Set saved prof choices to savedProfData
    let langChoiceMap = objToMap(ascChoiceStruct.LangObject);
    let langArray = langChoiceMap.get(srcID);
    let savedLang = null;
    if(langArray != null && langArray[0] != null){
        savedLang = langArray[0];
    }

    for(const [langID, langData] of ascLangMap.entries()){
        
        if(bonusOnly){

            if(langData.IsBonus) {

                if(savedLang != null && savedLang.id == langID) {
                    $('#'+selectLangID).append('<option value="'+langData.Lang.id+'" selected>'+langData.Lang.name+'</option>');
                } else {
                    $('#'+selectLangID).append('<option value="'+langData.Lang.id+'">'+langData.Lang.name+'</option>');
                }

            }

        } else {

            if(savedLang != null && savedLang.id == langID) {
                $('#'+selectLangID).append('<option value="'+langData.Lang.id+'" selected>'+langData.Lang.name+'</option>');
            } else {
                $('#'+selectLangID).append('<option value="'+langData.Lang.id+'">'+langData.Lang.name+'</option>');
            }

        }

    }

    // On lang choice change
    $('#'+selectLangID).change(function(event, triggerSave) {
        
        if(!($(this).is(":hidden"))) {

            if($(this).val() == "chooseDefault"){
                
                $('.'+selectLangControlShellClass).removeClass("is-danger");
                $('.'+selectLangControlShellClass).addClass("is-info");

                socket.emit("requestLanguagesChange",
                    getCharIDFromURL(),
                    srcID,
                    [null]);

            } else {

                $('.'+selectLangControlShellClass).removeClass("is-info");

                let langID = $(this).val();
                let lang = ascLangMap.get(langID).Lang;

                // Save lang
                if(triggerSave == null || triggerSave) {

                    let langChoiceMap = objToMap(ascChoiceStruct.LangObject);
                    if(!hasDuplicateLang(langChoiceMap, langID)) {
                        $('.'+selectLangControlShellClass).removeClass("is-danger");

                        $('#'+langDescriptionID).html('');

                        socket.emit("requestLanguagesChange",
                            getCharIDFromURL(),
                            srcID,
                            [langID]);

                    } else {
                        $('.'+selectLangControlShellClass).addClass("is-danger");

                        $('#'+langDescriptionID).html('<p class="help is-danger">You already know this language!</p>');

                    }
                
                } else {

                    $('#'+langDescriptionID).html('');

                }
                
            }

        }

    });

    $('#'+selectLangID).trigger("change", [false]);

    statementComplete();

}

socket.on("returnLanguagesChange", function(){
    socket.emit("requestASCUpdateLangs", getCharIDFromURL());
});

//////////////////////////////// Give Lang (by Lang Name) ///////////////////////////////////

function giveLangByName(srcID, langName){

    socket.emit("requestLanguagesChangeByName",
        getCharIDFromURL(),
        srcID,
        langName);

}

socket.on("returnLanguagesChangeByName", function(){
    statementComplete();
});