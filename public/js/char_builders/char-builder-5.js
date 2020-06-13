
let socket = io();

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

function goToChar() {
    // Hardcoded redirect
    if(window.location.href.includes("/page5?")) {
        window.location.href = window.location.href.replace(
            "builder/"+getCharIDFromURL()+"/page5?", getCharIDFromURL());
    } else {
        window.location.href = window.location.href.replace(
            "builder/"+getCharIDFromURL()+"/page5", getCharIDFromURL());
    }
}


// ~~~~~~~~~~~~~~ // Processings // ~~~~~~~~~~~~~~ //

socket.on("returnFinalizeDetails", function(character, abilObject, cClass){

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


    if(character.classID != null && character.ancestryID != null){
        $(".finalize-content").removeClass("is-hidden");
        
        let skillsSection = $('#trainSkills');
        for (let i = 0; i < getMod(intScore)+cClass.tSkillsMore; i++) {

            let skillsSectionID = "skillSelection"+i;
            
            skillsSection.append('<div id="'+skillsSectionID+'"></div>');
            
            // No need for a process clear because it will be going to Prof data every time.
            let srcStruct = {
                sourceType: 'class',
                sourceLevel: 1,
                sourceCode: 'inits-bonus-'+i,
                sourceCodeSNum: 'a',
            };
            processCode(
                'GIVE-SKILL-PROF=T',
                srcStruct,
                skillsSectionID);
            
        }

        let langsSection = $('#learnLanguages');
        for (let i = 0; i < getMod(intScore); i++) {

            let langSelectionID = "langSelection"+i;
            
            langsSection.append('<div id="'+langSelectionID+'"></div>');
            
            // No need for a process clear because it will be going to Languages data every time.
            let srcStruct = {
                sourceType: 'class',
                sourceLevel: 1,
                sourceCode: 'inits-bonus-'+i,
                sourceCodeSNum: 'a',
            };
            processCode(
                'GIVE-LANG-BONUS-ONLY',
                srcStruct,
                langSelectionID);
            
        }

    } else {

        $("#missing-class-message").removeClass("is-hidden");
        $(".finalize-content").addClass("is-hidden");
        finishLoadingPage();

    }

    if (character.name == null || character.ancestryID == null || character.heritageID == null || character.backgroundID == null || character.classID == null) {

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
        } else if (character.heritageID == null) {
            infoNeeded += "- Heritage\n";
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

    } else {
        // Go to Character Sheet
        $("#goToCharButton").click(function(){
            goToChar();
        });
    }

});

function finishLoadingPage() {
    // Turn off page loading
    $('.pageloader').addClass("fadeout");
}

function selectorUpdated() {

}
