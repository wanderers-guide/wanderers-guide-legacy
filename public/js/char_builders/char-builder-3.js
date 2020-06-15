
let socket = io();

let choiceStruct = null;
let g_background = null;

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

        let background = backgrounds.find(background => {
            return background.id == backgroundID;
        });

        if(backgroundID != "chooseDefault" && background != null){
            $('.background-content').removeClass("is-hidden");
            $('#selectBackgroundControlShell').removeClass("is-info");

            // Save background
            if(triggerSave == null || triggerSave) {
                $('#selectBackgroundControlShell').addClass("is-loading");
                
                g_background = background;
                socket.emit("requestBackgroundChange",
                    getCharIDFromURL(),
                    backgroundID);
            } else {
                displayCurrentBackground(background);
            }

        } else {
            $('.background-content').addClass("is-hidden");
            $('#selectBackgroundControlShell').addClass("is-info");

            // Delete background, set to null
            g_background = null;
            socket.emit("requestBackgroundChange",
                getCharIDFromURL(),
                null);
        }

    });


    // Display current background
    $('#selectBackground').trigger("change", [false]);

    // Activate boostSingleSelection() triggers
    $('.abilityBoost').trigger("change", [false]);

});

socket.on("returnBackgroundChange", function(choiceStruct){
    $('#selectBackgroundControlShell').removeClass("is-loading");

    if(g_background != null){
        injectASCChoiceStruct(choiceStruct);
        displayCurrentBackground(g_background);
    } else {
        finishLoadingPage();
    }
    
});


function displayCurrentBackground(background) {
    g_background = null;
    $('#selectBackground').blur();
    

    let backgroundDescription = $('#backgroundDescription');
    backgroundDescription.html('<p>'+background.description+'</p>');

    // Code - Run General Code before Boosts Code, it's more likely to be delaying //
    $('#backgroundCodeOutput').html('');
    let srcStruct = {
        sourceType: 'background',
        sourceLevel: 1,
        sourceCode: 'background',
        sourceCodeSNum: 'a',
    };
    processCode(
        background.code,
        srcStruct,
        'backgroundCodeOutput');

    // Boosts //
    $('#backBoostSection').html('');
    // No need for a process clear because it will be going to AbilityBoost data every time.
    let boostSrcStruct = {
        sourceType: 'background',
        sourceLevel: 1,
        sourceCode: 'boost-choose',
        sourceCodeSNum: 'a',
    };
    processCode(
        'GIVE-ABILITY-BOOST-SINGLE='+background.boostOne+'\n GIVE-ABILITY-BOOST-SINGLE='+background.boostTwo,
        boostSrcStruct,
        'backBoostSection');

}

function finishLoadingPage() {
    // Turn off page loading
    $('.pageloader').addClass("fadeout");
}

function selectorUpdated() {

}