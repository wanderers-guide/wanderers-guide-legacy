
let socket = io();

// ~~~~~~~~~~~~~~ // General - Run On Load // ~~~~~~~~~~~~~~ //
$(function () {

    // Change page
    $("#prevButton").click(function(){
        prevPage();
    });

    // Go to Character
    $("#goToCharButton").click(function(){
        goToChar();
    });
    

    socket.emit("requestFinalizeDetails",
        getCharIDFromURL());


});

// ~~~~~~~~~~~~~~ // Change Page // ~~~~~~~~~~~~~~ //

function prevPage() {
    // Hardcoded redirect
    window.location.href = window.location.href.replace("page5", "page4");
}

function goToChar() {
    // Hardcoded redirect
    window.location.href = window.location.href.replace(
        "builder/"+getCharIDFromURL()+"/page5?", getCharIDFromURL());
}


// ~~~~~~~~~~~~~~ // Processings // ~~~~~~~~~~~~~~ //

socket.on("returnFinalizeDetails", function(abilObject, cClass, ancestLanguages){

    let abilMap = objToMap(abilObject);

    let strScore = abilMap.get("STR");
    $("#strScore").html(strScore);
    $("#strMod").html(signNumber(getMod(strScore)));

    let dexScore = abilMap.get("DEX");
    $("#dexScore").html(dexScore);
    $("#dexMod").html(signNumber(getMod(dexScore)));

    let conScore = abilMap.get("CON");
    $("#conScore").html(conScore);
    $("#conMod").html(signNumber(getMod(conScore)));

    let intScore = abilMap.get("INT");
    $("#intScore").html(intScore);
    $("#intMod").html(signNumber(getMod(intScore)));

    let wisScore = abilMap.get("WIS");
    $("#wisScore").html(wisScore);
    $("#wisMod").html(signNumber(getMod(wisScore)));

    let chaScore = abilMap.get("CHA");
    $("#chaScore").html(chaScore);
    $("#chaMod").html(signNumber(getMod(chaScore)));


    let skillsSection = $('#trainSkills');
    for (let i = 0; i < getMod(intScore)+cClass.tSkillsMore; i++) {

        let skillsSectionID = "skillSelection"+i;
        
        skillsSection.append('<div id="'+skillsSectionID+'"></div>');
        
        processCode(
            'GIVE-SKILL-PROF=T',
            'Type-Class_Level-1_Code-Other'+i,
            skillsSectionID);
        
    }

    let langsSection = $('#learnLanguages');
    for (let i = 0; i < getMod(intScore); i++) {

        let langSelectionID = "langSelection"+i;
        
        langsSection.append('<div id="'+langSelectionID+'"></div>');
        
        processCode(
            'GIVE-LANG-BONUS-ONLY',
            'Type-Ancestry_Level-1_Code-Other'+i,
            langSelectionID);
        
    }

});
