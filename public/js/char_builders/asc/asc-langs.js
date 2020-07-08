
//------------------------- Processing Langs -------------------------//
function initLangProcessing(ascStatement, srcStruct, locationID) {
    if(ascLangMap == null) {
        //console.log("Did not find valid langMap :(");
        socket.emit("requestASCLangs",
                getCharIDFromURL(),
                ascStatement,
                srcStruct,
                locationID);
    } else {
        //console.log("> Found a valid langMap!");
        processingLangs(ascStatement, srcStruct, locationID);
    }
}

socket.on("returnASCLangs", function(ascStatement, srcStruct, locationID, langObject){
    let langMap = objToMap(langObject);
    //console.log("Setting langMap to new one...");
    ascLangMap = new Map([...langMap.entries()].sort(
        function(a, b) {
            return a[1].Lang.name > b[1].Lang.name ? 1 : -1;
        })
    );
    processingLangs(ascStatement, srcStruct, locationID);
});

function processingLangs(ascStatement, srcStruct, locationID){

    if(ascStatement.includes("GIVE-LANG-NAME")){ // GIVE-LANG-NAME=Elven
        let langName = ascStatement.split('=')[1];
        giveLangByName(srcStruct, langName);
    }
    else if(ascStatement.includes("GIVE-LANG-BONUS-ONLY")){// GIVE-LANG-BONUS-ONLY
        giveLang(srcStruct, locationID, true);
    }
    else if(ascStatement.includes("GIVE-LANG")){// GIVE-LANG
        giveLang(srcStruct, locationID, false);
    } else {
        displayError("Unknown statement (2-Lang): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Lang ///////////////////////////////////

function giveLang(srcStruct, locationID, bonusOnly){

    let selectLangID = "selectLang"+locationID+"-"+srcStruct.sourceCodeSNum;
    let selectLangControlShellClass = selectLangID+'ControlShell';
    let langDescriptionID = selectLangID+"Description";

    $('#'+locationID).append('<div class="field is-grouped is-grouped-centered is-marginless"><div class="select '+selectLangControlShellClass+'"><select id="'+selectLangID+'" class="selectLang"></select></div></div>');

    $('#'+locationID).append('<div class="columns is-centered is-marginless pb-2"><div id="'+langDescriptionID+'" class="column is-8 is-paddingless"></div></div>');

    $('#'+selectLangID).append('<option value="chooseDefault">Choose a Language</option>');
    $('#'+selectLangID).append('<hr class="dropdown-divider"></hr>');

    // Set saved prof choices to savedProfData
    let langArray = ascChoiceStruct.LangArray;

    let savedLang = langArray.find(lang => {
        return hasSameSrc(lang, srcStruct);
    });

    for(const [langID, langData] of ascLangMap.entries()){
        
        if(bonusOnly){

            if(langData.IsBonus) {

                if(savedLang != null && savedLang.value.id == langID) {
                    $('#'+selectLangID).append('<option value="'+langData.Lang.id+'" selected>'+langData.Lang.name+'</option>');
                } else {
                    $('#'+selectLangID).append('<option value="'+langData.Lang.id+'">'+langData.Lang.name+'</option>');
                }

            }

        } else {

            if(savedLang != null && savedLang.value.id == langID) {
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

                socket.emit("requestLanguageChange",
                    getCharIDFromURL(),
                    srcStruct,
                    null);

            } else {

                $('.'+selectLangControlShellClass).removeClass("is-danger");
                $('.'+selectLangControlShellClass).removeClass("is-info");

                let langID = $(this).val();

                // Save lang
                if(triggerSave == null || triggerSave) {

                    let langArray = ascChoiceStruct.LangArray;
                    if(!hasDuplicateLang(langArray, langID)) {

                        $('#'+langDescriptionID).html('');

                        socket.emit("requestLanguageChange",
                            getCharIDFromURL(),
                            srcStruct,
                            langID);

                    } else {
                        $('.'+selectLangControlShellClass).addClass("is-danger");

                        $('#'+langDescriptionID).html('<p class="help is-danger text-center">You already know this language!</p>');

                    }
                
                } else {

                    $('#'+langDescriptionID).html('');

                    socket.emit("requestLanguageChange",
                        getCharIDFromURL(),
                        srcStruct,
                        langID);

                }
                
            }

            $(this).blur();

        }

    });

    $('#'+selectLangID).trigger("change", [false]);

    statementComplete();

}

socket.on("returnLanguageChange", function(){
    selectorUpdated();
    socket.emit("requestASCUpdateLangs", getCharIDFromURL());
});

//////////////////////////////// Give Lang (by Lang Name) ///////////////////////////////////

function giveLangByName(srcStruct, langName){

    socket.emit("requestLanguageChangeByName",
        getCharIDFromURL(),
        srcStruct,
        langName);

}

socket.on("returnLanguageChangeByName", function(){
    statementComplete();
});