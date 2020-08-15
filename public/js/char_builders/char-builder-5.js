/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();
let isBuilderInit = false;

// Core Builder Data //
let g_abilMap = null;
let g_featMap = null;
let g_skillMap = null;
let g_itemMap = null;
let g_spellMap = null;
let g_allLanguages = null;
let g_allConditions = null;
let g_allTags = null;
// ~~~~~~~~~~~~~~~~~ //

// ~~~~~~~~~~~~~~ // General - Run On Load // ~~~~~~~~~~~~~~ //
$(function () {

    // Change page
    $("#prevButton").click(function(){
        prevPage();
    });    

    socket.emit("requestFinalizeDetails",
        getCharIDFromURL());


});

// ~~~~~~~~~~~~~~ // Change Page // ~~~~~~~~~~~~~~ //

function prevPage() {
    // Hardcoded redirect
    window.location.href = window.location.href.replace("page5", "page4");
}

// ~~~~~~~~~~~~~~ // Processings // ~~~~~~~~~~~~~~ //

socket.on("returnFinalizeDetails", function(coreDataStruct, character, cClass, ancestry, choiceStruct){
    isBuilderInit = true;

    // Core Builder Data //
    g_abilMap = objToMap(coreDataStruct.AbilObject);
    g_featMap = objToMap(coreDataStruct.FeatObject);
    g_skillMap = objToMap(coreDataStruct.SkillObject);
    g_itemMap = objToMap(coreDataStruct.ItemObject);
    g_spellMap = objToMap(coreDataStruct.SpellObject);
    g_allLanguages = coreDataStruct.AllLanguages;
    g_allConditions = coreDataStruct.AllConditions;
    g_allTags = coreDataStruct.AllTags;
    // ~~~~~~~~~~~~~~~~~ //

    injectWSCChoiceStruct(choiceStruct);

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
            {cClass, ancestry, intScore});

    } else {

        $("#missing-class-message").removeClass("is-hidden");
        $(".finalize-content").addClass("is-hidden");
        finishLoadingPage();

    }

    if (character.name == null || character.ancestryID == null || character.backgroundID == null || character.classID == null) {

        $("#goToCharButton").removeClass("is-success");
        $("#goToCharButton").addClass("is-danger");
        $("#goToCharButton").addClass("has-tooltip-bottom");

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

        $("#goToCharButton").attr("data-tooltip", "Character Incomplete\n"+infoNeeded);

    }

});

function finishLoadingPage() {
    // Turn off page loading
    $('.pageloader').addClass("fadeout");
}

function selectorUpdated() {

}


socket.on("returnLangsAndTrainingsClear", function(srcStruct, dataPacket){

    $(".finalize-content").removeClass("is-hidden");
        
    let giveSkillTrainingCode = '';
    for (let i = 0; i < getMod(dataPacket.intScore)+dataPacket.cClass.tSkillsMore; i++) {
        giveSkillTrainingCode += 'GIVE-SKILL=T\n';
    }

    $('#trainSkills').append('<div id="skillSelection"></div>');
    processCode(
        giveSkillTrainingCode,
        srcStruct,
        'skillSelection');

    let giveLanguageCode = '';
    let additionalLangs = getMod(dataPacket.intScore);
    if(dataPacket.ancestry.name == 'Human'){ additionalLangs++; } // Hardcoded - ancestry named Human gains +1 langs. 
    for (let i = 0; i < additionalLangs; i++) {
        giveLanguageCode += 'GIVE-LANG-BONUS-ONLY\n';
    }

    $('#learnLanguages').append('<div id="langSelection"></div>');
    processCode(
        giveLanguageCode,
        srcStruct,
        'langSelection');

});