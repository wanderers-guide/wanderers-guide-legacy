/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

// ~~~~~~~~~~~~~~ // Processings // ~~~~~~~~~~~~~~ //

function loadFinalizePage(character, cClass, ancestry) {

    let strScore = g_abilMap.get("STR");
    $("#strScore").html(strScore);
    $("#strMod").html(signNumber(getMod(strScore)));

    let dexScore = g_abilMap.get("DEX");
    $("#dexScore").html(dexScore);
    $("#dexMod").html(signNumber(getMod(dexScore)));

    let conScore = g_abilMap.get("CON");
    $("#conScore").html(conScore);
    $("#conMod").html(signNumber(getMod(conScore)));

    let intScore = g_abilMap.get("INT");
    $("#intScore").html(intScore);
    $("#intMod").html(signNumber(getMod(intScore)));

    let wisScore = g_abilMap.get("WIS");
    $("#wisScore").html(wisScore);
    $("#wisMod").html(signNumber(getMod(wisScore)));

    let chaScore = g_abilMap.get("CHA");
    $("#chaScore").html(chaScore);
    $("#chaMod").html(signNumber(getMod(chaScore)));

    if(character.classID != null && character.ancestryID != null){

        let srcStruct = {
            sourceType: 'class',
            sourceLevel: 1,
            sourceCode: 'inits-bonus',
            sourceCodeSNum: 'a',
        };
        
        socket.emit("requestLangsAndTrainingsClear",
            getCharIDFromURL(),
            srcStruct,
            {Character: character, SkillLocationID: 'skillSelection', LangLocationID: 'langSelection'});

    } else {

        $("#missing-class-message").removeClass("is-hidden");
        $(".finalize-content").addClass("is-hidden");
        finishLoadingPage();

        runCustomCodeBlock(character);

    }

    if (character.name == null || character.ancestryID == null || character.backgroundID == null || character.classID == null) {

        $("#goToCharBigButton").removeClass("has-text-info");
        $("#goToCharBigButton").addClass("has-text-danger");
        $("#goToCharBigButton").addClass("has-tooltip-left");

        let infoNeeded = '';
        if(character.name == null) {
            infoNeeded += "- Name\n";
            $("#basics-step").removeClass("is-link");
            $("#basics-step").addClass("is-danger");
        }
        if(character.ancestryID == null) {
            infoNeeded += "- Ancestry\n";
            $("#ancestry-step").removeClass("is-link");
            $("#ancestry-step").addClass("is-danger");
        }
        if(character.backgroundID == null) {
            infoNeeded += "- Background\n";
            $("#background-step").removeClass("is-link");
            $("#background-step").addClass("is-danger");
        }
        if(character.classID == null) {
            infoNeeded += "- Class\n";
            $("#class-step").removeClass("is-link");
            $("#class-step").addClass("is-danger");
        }

        $("#goToCharBigButton").attr("data-tooltip", "Character Incomplete\n"+infoNeeded);

    } else {
        $("#goToCharBigButton").removeClass("has-text-danger");
        $("#goToCharBigButton").addClass("has-text-info");
        $("#goToCharBigButton").removeClass("has-tooltip-left");
        $("#goToCharBigButton").attr("data-tooltip", null);
    }

}

function selectorUpdated() {

}


socket.on("returnLangsAndTrainingsClear", function(srcStruct, data){

    $(".finalize-content").removeClass("is-hidden");
    
    if(wscChoiceStruct.ClassDetails.Class != null){
      let giveSkillTrainingCode = '';
      for (let i = 0; i < getMod(g_abilMap.get("INT"))+wscChoiceStruct.ClassDetails.Class.tSkillsMore; i++) {
          giveSkillTrainingCode += 'GIVE-SKILL=T\n';
      }
      
      processCode(
          giveSkillTrainingCode,
          srcStruct,
          data.SkillLocationID,
          'Final - Skill Training');
    }

    if(wscChoiceStruct.Ancestry != null){
      let giveLanguageCode = '';
      let additionalLangs = getMod(g_abilMap.get("INT"));
      if(wscChoiceStruct.Ancestry.name == 'Human'){ additionalLangs++; } // Hardcoded - ancestry named Human gains +1 langs. 
      for (let i = 0; i < additionalLangs; i++) {
          giveLanguageCode += 'GIVE-LANG-BONUS-ONLY\n';
      }
      
      processCode(
          giveLanguageCode,
          srcStruct,
          data.LangLocationID,
          'Final - Languages');
    }

    if(data.Character != null){
      runCustomCodeBlock(data.Character);
    }

});

function runCustomCodeBlock(character) {

  // Custom Code Block Option - Results //
  if(character.optionCustomCodeBlock === 1){
    $('#custom-code-block-results-section').removeClass('is-hidden');
    let customCodeSrcStruct = {
      sourceType: 'custom-code',
      sourceLevel: 0,
      sourceCode: 'custom-code',
      sourceCodeSNum: 'a',
    };
    processCode(
      character.customCode,
      customCodeSrcStruct,
      'custom-code-block-results-container',
      'Custom Code Block');
  } else {
    socket.emit("requestCustomCodeBlockDataClear",
        getCharIDFromURL());
  }

}