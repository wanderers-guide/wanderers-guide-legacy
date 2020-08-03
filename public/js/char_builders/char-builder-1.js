/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

// ~~~~~~~~~~~~~~ // General - Run On Load // ~~~~~~~~~~~~~~ //
$(function () {

    // Change page
    $("#nextButton").click(function(){
        nextPage();
    });
    
    // On load get basic character info
    socket.emit("requestCharacterDetails",
        getCharIDFromURL());

});

// ~~~~~~~~~~~~~~ // Change Page // ~~~~~~~~~~~~~~ //

function nextPage() {
    // Hardcoded redirect
    window.location.href = window.location.href.replace("page1", "page2");
}

// ~~~~~~~~~~~~~~ // Processings // ~~~~~~~~~~~~~~ //

socket.on("returnCharacterDetails", function(character){

    // When character name changes, save name
    $("#charName").change(function(){

        let validNameRegex = /^[A-Za-z0-9 ,\-–&_.!?'"]+$/;
        if(validNameRegex.test($(this).val())) {
            $(this).removeClass("is-danger");
            $("#charNameSideIcon").addClass("is-hidden");

            $("#charNameControlShell").addClass("is-medium is-loading");
            socket.emit("requestNameChange",
                getCharIDFromURL(),
                $(this).val());

        } else {
            $(this).addClass("is-danger");
            $("#charNameSideIcon").removeClass("is-hidden");
        }

    });

    // When character level changes, save level
    $("#charLevel").change(function(){
        socket.emit("requestLevelChange",
            getCharIDFromURL(),
            $(this).val());
    });

    // When ability score changes, save them all
    $("#abilSTR").blur(function(){
        deployAbilityScoreChange();
    });
    $("#abilDEX").blur(function(){
        deployAbilityScoreChange();
    });
    $("#abilCON").blur(function(){
        deployAbilityScoreChange();
    });
    $("#abilINT").blur(function(){
        deployAbilityScoreChange();
    });
    $("#abilWIS").blur(function(){
        deployAbilityScoreChange();
    });
    $("#abilCHA").blur(function(){
        deployAbilityScoreChange();
    });

    handleCharacterOptions(character);

    // Turn off page loading
    $('.pageloader').addClass("fadeout");

});

function deployAbilityScoreChange(){

    let strVal = $('#abilSTR').val();
    let dexVal = $('#abilDEX').val();
    let conVal = $('#abilCON').val();
    let intVal = $('#abilINT').val();
    let wisVal = $('#abilWIS').val();
    let chaVal = $('#abilCHA').val();

    const MAX_VAL = 30;
    const MIN_VAL = 0;

    if(strVal <= MAX_VAL && dexVal <= MAX_VAL && conVal <= MAX_VAL && intVal <= MAX_VAL && wisVal <= MAX_VAL && chaVal <= MAX_VAL && strVal >= MIN_VAL && dexVal >= MIN_VAL && conVal >= MIN_VAL && intVal >= MIN_VAL && wisVal >= MIN_VAL && chaVal >= MIN_VAL) {
        
        $('.abilScoreSet').removeClass("is-danger");

        socket.emit("requestAbilityScoreChange", 
            getCharIDFromURL(), 
            strVal,
            dexVal,
            conVal,
            intVal,
            wisVal,
            chaVal);

    } else {
        $('.abilScoreSet').addClass("is-danger");
    }
}

function handleCharacterOptions(character) {

    // Content Sources //
    let contentSourceArray = JSON.parse(character.enabledSources);

    $("#contentSrc-CRB").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'CRB',
            this.checked);
    });
    $("#contentSrc-CRB").prop('checked', contentSourceArray.includes('CRB'));

    $("#contentSrc-ADV-PLAYER-GUIDE").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'ADV-PLAYER-GUIDE',
            this.checked);
    });
    $("#contentSrc-ADV-PLAYER-GUIDE").prop('checked', contentSourceArray.includes('ADV-PLAYER-GUIDE'));

    $("#contentSrc-GM-GUIDE").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'GM-GUIDE',
            this.checked);
    });
    $("#contentSrc-GM-GUIDE").prop('checked', contentSourceArray.includes('GM-GUIDE'));

    $("#contentSrc-LOST-CHAR-GUIDE").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'LOST-CHAR-GUIDE',
            this.checked);
    });
    $("#contentSrc-LOST-CHAR-GUIDE").prop('checked', contentSourceArray.includes('LOST-CHAR-GUIDE'));

    $("#contentSrc-LOST-GOD-MAGIC").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'LOST-GOD-MAGIC',
            this.checked);
    });
    $("#contentSrc-LOST-GOD-MAGIC").prop('checked', contentSourceArray.includes('LOST-GOD-MAGIC'));

    $("#contentSrc-LOST-WORLD-GUIDE").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'LOST-WORLD-GUIDE',
            this.checked);
    });
    $("#contentSrc-LOST-WORLD-GUIDE").prop('checked', contentSourceArray.includes('LOST-WORLD-GUIDE'));

    $("#contentSrc-AGE-OF-ASHES").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'AGE-OF-ASHES',
            this.checked);
    });
    $("#contentSrc-AGE-OF-ASHES").prop('checked', contentSourceArray.includes('AGE-OF-ASHES'));

    $("#contentSrc-EXTINCTION-CURSE").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'EXTINCTION-CURSE',
            this.checked);
    });
    $("#contentSrc-EXTINCTION-CURSE").prop('checked', contentSourceArray.includes('EXTINCTION-CURSE'));

    $("#contentSrc-FALL-OF-PLAGUE").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'FALL-OF-PLAGUE',
            this.checked);
    });
    $("#contentSrc-FALL-OF-PLAGUE").prop('checked', contentSourceArray.includes('FALL-OF-PLAGUE'));

    // Variants //
    $("#variantProficiencyWithoutLevel").change(function(){
        let optionTypeValue = (this.checked) ? 1 : 0;
        socket.emit("requestCharacterOptionChange", 
            getCharIDFromURL(), 
            'variantProfWithoutLevel',
            optionTypeValue);
    });
    $("#variantProficiencyWithoutLevel").prop('checked', (character.variantProfWithoutLevel === 1));

    // Options //
    $("#optionAutoHeightenSpells").change(function(){
        let optionTypeValue = (this.checked) ? 1 : 0;
        socket.emit("requestCharacterOptionChange", 
            getCharIDFromURL(), 
            'optionAutoHeightenSpells',
            optionTypeValue);
    });
    $("#optionAutoHeightenSpells").prop('checked', (character.optionAutoHeightenSpells === 1));
    
    
}


// ~~~~~~~~~~~~~~ // Processings // ~~~~~~~~~~~~~~ //

socket.on("returnNameChange", function() {
    $("#charNameControlShell").removeClass("is-medium is-loading");
});

socket.on("returnLevelChange", function() {
    $("#charLevel").blur();
});

socket.on("returnAbilityScoreChange", function() {
});

//

socket.on("returnCharacterSourceChange", function() {
    $(".optionSwitch").blur();
});

socket.on("returnCharacterOptionChange", function() {
    $(".optionSwitch").blur();
});