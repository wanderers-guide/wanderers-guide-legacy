
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

        let validNameRegex = /^[A-Za-z0-9 ,]+$/;
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

    $("#optionAutoHeightenSpells").change(function(){
        let optionTypeValue = (this.checked) ? 1 : 0;
        socket.emit("requestCharacterOptionChange", 
            getCharIDFromURL(), 
            'optionAutoHeightenSpells',
            optionTypeValue);
    });
    $("#optionAutoHeightenSpells").prop('checked', (character.optionAutoHeightenSpells === 1));

    $("#optionProficiencyWithoutLevel").change(function(){
        let optionTypeValue = (this.checked) ? 1 : 0;
        socket.emit("requestCharacterOptionChange", 
            getCharIDFromURL(), 
            'optionProfWithoutLevel',
            optionTypeValue);
    });
    $("#optionProficiencyWithoutLevel").prop('checked', (character.optionProfWithoutLevel === 1));
    
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

socket.on("returnCharacterOptionChange", function() {
    $(".optionSwitch").blur();
});