
let socket = io();

let choiceStruct = null;

// ~~~~~~~~~~~~~~ // General - Run On Load // ~~~~~~~~~~~~~~ //
$(function () {

    // Change page
    $("#nextButton").click(function(){
        nextPage();
    });
    
    $("#prevButton").click(function(){
        prevPage();
    });

    // On load get all ancestries and feats
    socket.emit("requestBackgroundDetails",
        getCharIDFromURL());


});

// ~~~~~~~~~~~~~~ // Change Page // ~~~~~~~~~~~~~~ //

function nextPage() {
    // Hardcoded redirect
    window.location.href = window.location.href.replace("page3", "page4");
}

function prevPage() {
    // Hardcoded redirect
    window.location.href = window.location.href.replace("page3", "page2");
}


// ~~~~~~~~~~~~~~ // Processings // ~~~~~~~~~~~~~~ //

socket.on("returnBackgroundDetails", function(backgrounds, inChoiceStruct){

    choiceStruct = inChoiceStruct;

    // Background Selection //
    $('#selectBackground').change(function(event, triggerSave) {
        let backgroundID = $("#selectBackground option:selected").val();

        for(const background of backgrounds){
            if(backgroundID == background.id){

                displayCurrentBackground(background);

                // Save background
                if(triggerSave == null || triggerSave) {
                    $('#selectBackgroundControlShell').addClass("is-loading");
    
                    socket.emit("requestBackgroundChange",
                        getCharIDFromURL(),
                        backgroundID);
                }

                break;

            }
        }

    });


    // Display current background
    $('#selectBackground').trigger("change", [false]);

    // Activate boostSingleSelection() triggers
    $('.abilityBoost').trigger("change", [false]);

});


function displayCurrentBackground(background) {

    let backgroundDescription = $('#backgroundDescription');
    backgroundDescription.html('<p>'+background.description+'</p>');

    // Boosts //
    $('#backBoostSection').html('');
    processCode(
        'GIVE-ABILITY-BOOST-SINGLE='+background.boostOne+', GIVE-ABILITY-BOOST-SINGLE='+background.boostTwo,
        'Type-Background_Level-1_Code-OtherAbilityBoost',
        'backBoostSection');


    // Code //
    $('#backgroundCodeOutput').html('');
    processCode(
        background.code,
        'Type-Background_Level-1_Code-None',
        'backgroundCodeOutput');

}

socket.on("returnBackgroundChange", function(){
    $('#selectBackgroundControlShell').removeClass("is-loading");
});
