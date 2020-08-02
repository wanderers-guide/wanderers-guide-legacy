/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

//------------------------- Processing Langs -------------------------//
function processingLangs(wscStatement, srcStruct, locationID){

    if(wscStatement.includes("GIVE-LANG-NAME")){ // GIVE-LANG-NAME=Elven
        let langName = wscStatement.split('=')[1];
        giveLangByName(srcStruct, langName);
    }
    else if(wscStatement.includes("GIVE-LANG-BONUS-ONLY")){// GIVE-LANG-BONUS-ONLY
        giveLang(srcStruct, locationID, true);
    }
    else if(wscStatement.includes("GIVE-LANG")){// GIVE-LANG
        giveLang(srcStruct, locationID, false);
    } else {
        displayError("Unknown statement (2-Lang): \'"+wscStatement+"\'");
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
    let langArray = wscChoiceStruct.LangArray;

    let savedLang = langArray.find(lang => {
        return hasSameSrc(lang, srcStruct);
    });

    let sortedLangMap = new Map([...wscLangMap.entries()].sort(
        function(a, b) {
            return a[1].IsBonus && !b[1].IsBonus ? -1 : 1;
        })
    );

    for(const [langID, langData] of sortedLangMap.entries()){

        if(savedLang != null && savedLang.value.id == langID) {
            if(bonusOnly && !langData.IsBonus){
                $('#'+selectLangID).append('<option value="'+langData.Lang.id+'" class="nonavailable-select-option" selected>'+langData.Lang.name+'</option>');
            } else {
                $('#'+selectLangID).append('<option value="'+langData.Lang.id+'" selected>'+langData.Lang.name+'</option>');
            }
        } else {
            if(bonusOnly && !langData.IsBonus){
                $('#'+selectLangID).append('<option value="'+langData.Lang.id+'" class="nonavailable-select-option">'+langData.Lang.name+'</option>');
            } else {
                $('#'+selectLangID).append('<option value="'+langData.Lang.id+'">'+langData.Lang.name+'</option>');
            }
        }

    }

    // On lang choice change
    $('#'+selectLangID).change(function(event, triggerSave) {
        
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

                let langArray = wscChoiceStruct.LangArray;
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

    });

    $('#'+selectLangID).trigger("change", [false]);

    statementComplete();

}

socket.on("returnLanguageChange", function(){
    selectorUpdated();
    socket.emit("requestWSCUpdateLangs", getCharIDFromURL());
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