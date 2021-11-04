/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

//------------------------- Processing Langs -------------------------//
function processingLangs(wscStatement, srcStruct, locationID, extraData){

    if(wscStatement.includes("GIVE-LANG-NAME")){ // GIVE-LANG-NAME=Elven
        let langName = wscStatement.split('=')[1];
        giveLangByName(srcStruct, langName, extraData);
    }
    else if(wscStatement.includes("GIVE-LANG-BONUS-ONLY")){// GIVE-LANG-BONUS-ONLY
        giveLang(srcStruct, locationID, extraData, true);
    }
    else if(wscStatement.includes("GIVE-LANG")){// GIVE-LANG
        giveLang(srcStruct, locationID, extraData, false);
    } else {
        displayError("Unknown statement (2-Lang): \'"+wscStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Lang ///////////////////////////////////

function giveLang(srcStruct, locationID, extraData, bonusOnly){

    let selectLangID = "selectLang"+locationID+"-"+srcStruct.sourceCode+"-"+srcStruct.sourceCodeSNum;
    let selectLangControlShellClass = selectLangID+'ControlShell';
    let langDescriptionID = selectLangID+"Description";

    // If ID already exists, just return. This is a temporary fix - this shouldn't be an issue in the first place.
    if($('#'+selectLangID).length != 0) { statementComplete(); return; }

    const selectionTagInfo = getTagFromData(srcStruct, extraData.sourceName, 'Unselected Language', 'UNSELECTED');

    $('#'+locationID).append('<div class="field is-grouped is-grouped-centered is-marginless my-1"><div class="select '+selectLangControlShellClass+'" data-selection-info="'+selectionTagInfo+'"><select id="'+selectLangID+'" class="selectLang"></select></div></div>');

    $('#'+locationID).append('<div class="columns is-centered is-marginless pb-2"><div id="'+langDescriptionID+'" class="column is-8 is-paddingless"></div></div>');

    $('#'+selectLangID).append('<option value="chooseDefault">Choose a Language</option>');
    $('#'+selectLangID).append('<optgroup label="──────────"></optgroup>');

    // Set saved prof choices to savedProfData
    let savedLang = getDataSingle(DATA_SOURCE.LANGUAGE, srcStruct);

    let sortedLangArray = g_allLanguages.sort(
      function(a, b) {
        return a.name > b.name ? 1 : -1;
      }
    );

    let isStillBonusLang = true;
    for(const lang of sortedLangArray){

        let langIsBonus = false;
        if(bonusOnly){
          let currentAncestry = getCharAncestry();
          if(currentAncestry != null){
            let bonusLang = currentAncestry.BonusLanguages.find(l => {
              return l.id == lang.id;
            });
            langIsBonus = (bonusLang != null);
          }
        }

        if(bonusOnly && !langIsBonus){
          if(isStillBonusLang){
            $('#'+selectLangID).append('<optgroup label="──────────"></optgroup>');
          }
          isStillBonusLang = false;
        }

        

        if(savedLang != null && savedLang.value != null && savedLang.value == lang.id) {
            if(bonusOnly && !langIsBonus){
                $('#'+selectLangID).append('<option value="'+lang.id+'" class="is-non-available-very" selected>'+lang.name+'</option>');
            } else {
                $('#'+selectLangID).append('<option value="'+lang.id+'" selected>'+lang.name+'</option>');
            }
        } else {
            if(bonusOnly && !langIsBonus){
                $('#'+selectLangID).append('<option value="'+lang.id+'" class="is-non-available-very">'+lang.name+'</option>');
            } else {
                $('#'+selectLangID).append('<option value="'+lang.id+'">'+lang.name+'</option>');
            }
        }

    }

    // On lang choice change
    $('#'+selectLangID).change(function(event, triggerSave) {
        
        if($(this).val() == "chooseDefault"){
                
            $('.'+selectLangControlShellClass).removeClass("is-danger");
            $('.'+selectLangControlShellClass).addClass("is-info");

            deleteData(DATA_SOURCE.LANGUAGE, srcStruct);
            
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

                if(!checkDuplicateLang(langID)) {

                    $('#'+langDescriptionID).html('');

                    setDataLanguage(srcStruct, langID);
                    
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

                setDataLanguage(srcStruct, langID);

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
});

function checkDuplicateLang(langID){
  for(const [key, data] of variables_getExtrasMap(VARIABLE.LANGUAGES).entries()){
    if(data.Value == langID){
      return true;
    }
  }
  return false;
}

//////////////////////////////// Give Lang (by Lang Name) ///////////////////////////////////

function giveLangByName(srcStruct, langName, extraData){

  console.log(langName);

  let language = g_allLanguages.find(language => {
    return language.name.toUpperCase() == langName.toUpperCase();
  });
  if(language != null){
    setDataLanguage(srcStruct, language.id);
  }

  socket.emit("requestLanguageChangeByName",
      getCharIDFromURL(),
      srcStruct,
      langName);

}

socket.on("returnLanguageChangeByName", function(){
    statementComplete();
});
