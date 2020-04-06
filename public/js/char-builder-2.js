
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


    boostSingleSelection();


    // On load get all ancestries and feats
    socket.emit("requestAncestryAndChoices",
        getCharIDFromURL());


});

// ~~~~~~~~~~~~~~ // Change Page // ~~~~~~~~~~~~~~ //

function nextPage() {
    // Hardcoded redirect
    window.location.href = window.location.href.replace("page2", "page3");
}

function prevPage() {
    // Hardcoded redirect
    window.location.href = window.location.href.replace("page2", "page1");
}


// ~~~~~~~~~~~~~~ // Processings // ~~~~~~~~~~~~~~ //

socket.on("returnAncestryAndChoices", function(ancestryObject, inChoiceStruct){

    choiceStruct = inChoiceStruct;
    let ancestryMap = objToMap(ancestryObject);

    // Ancestry Selection //
    $('#selectAncestry').change(function(event, triggerSave) {
        let ancestryID = $("#selectAncestry option:selected").val();

        if(ancestryID != "chooseDefault"){
    
            // Save ancestry
            if(triggerSave == null || triggerSave) {
                $('#selectAncestryControlShell').addClass("is-loading");
    
                socket.emit("requestAncestryChange",
                    getCharIDFromURL(),
                    { AncestryID : ancestryID, AncestryObject : ancestryObject });
                
            } else {
                displayCurrentAncestry(ancestryMap.get(ancestryID), false);
                activateHideSelects();
            }

        }

    });

    // Heritage Selection //
    $('#selectHeritage').change(function(event, triggerSave) {
        let heritageID = $(this).val();
        let ancestryID = $("#selectAncestry option:selected").val();

        console.log(heritageID);
        displayCurrentHeritage(ancestryMap.get(ancestryID), heritageID);

        if(ancestryID != "chooseDefault" && heritageID != "chooseDefault"){

            // Save heritage
            if(triggerSave == null || triggerSave) {
                $('#selectHeritageControlShell').addClass("is-loading");
    
                socket.emit("requestHeritageChange",
                    getCharIDFromURL(),
                    heritageID);
            }

        }

    });


    // Display current ancestry
    $('#selectAncestry').trigger("change", [false]);

    // Activate boostSingleSelection() triggers
    $('.abilityBoost').trigger("change", [false]);

});


function displayCurrentAncestry(ancestryStruct, saving) {

    let charLevel = choiceStruct.Level;
    let charHeritage = choiceStruct.Heritage;
    let bonusChoiceMap = objToMap(choiceStruct.BonusObject);

    let ancestryDescription = $('#ancestryDescription');

    ancestryDescription.html('<p>'+ancestryStruct.Ancestry.description+'</p>');



    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Hit Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    let ancestryHitPoints = $('#ancestryHitPoints');
    ancestryHitPoints.html('');
    ancestryHitPoints.append(ancestryStruct.Ancestry.hitPoints);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Size ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    let ancestrySize = $('#ancestrySize');
    ancestrySize.html('');
    ancestrySize.append(capitalizeWord(ancestryStruct.Ancestry.size));

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Speed ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    let ancestrySpeed = $('#ancestrySpeed');
    ancestrySpeed.html('');
    ancestrySpeed.append(ancestryStruct.Ancestry.speed+" feet");

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Languages ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    let ancestryLanguages = $('#ancestryLanguages');
    ancestryLanguages.html('');
    let langIDArray = [];
    for(const language of ancestryStruct.Languages) {
        ancestryLanguages.append(language.name+", ");
        langIDArray.push(language.id);
    }
    let bonusLangs = '';
    for(const bonusLang of ancestryStruct.BonusLanguages) {
        bonusLangs += bonusLang.name+", ";
    }
    bonusLangs = bonusLangs.substring(0, bonusLangs.length - 2);
    ancestryLanguages.append('and <a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="You will get to select an additional number of languages equal your Intelligence modifer in the Finalize step. The following are the options you will be able to choose from: '+bonusLangs+'">more*</a>');

    if(saving){
        socket.emit("requestLanguagesChange",
            getCharIDFromURL(),
            'Type-Ancestry_Level-1_Code-None',
            langIDArray);
    }

    clearAbilityBoostsAndFlaws();
    let abilBonusArray = [];

    // Boosts //

    let boostNum = 0;
    let boostNonChooseList = [];
    for(const boost of ancestryStruct.Boosts) {
        if(boost == "Anything") {
            boostNum++;

            let selectBoost = $('#selectBoost'+boostNum);
            selectBoost.html('');

            selectBoost.append('<option value="chooseDefault">Choose an Ability</option>');
            selectBoost.append('<hr class="dropdown-divider"></hr>');
            for(const abilityType of getAllAbilityTypes()){
                selectBoost.append('<option value="'+abilityType+'">'+abilityType+'</option>');
            }
            
        } else {
            boostNonChooseList.push(boost);
        }
    }
    let boostsNonChoose = $('#boostsNonChoose');
    let boostsNonChooseInnerHTML = '';
    for(const boostNonChoose of boostNonChooseList) {
        boostsNonChooseInnerHTML += ' <span class="button is-medium">'+boostNonChoose+'</span>';
        $(".abilityBoost option[value='"+boostNonChoose+"']").remove();
        abilBonusArray.push({ Ability : shortenAbilityType(boostNonChoose), Bonus : "Boost"});
    }
    boostsNonChoose.html(boostsNonChooseInnerHTML);

    // Flaws //
    let flawNum = 0;
    let flawNonChooseList = [];
    for(const flaw of ancestryStruct.Flaws) {
        if(flaw == "Anything") {
            flawNum++;

            let selectFlaw = $('#selectFlaw'+flawNum);
            selectFlaw.html('');

            selectFlaw.append('<option value="chooseDefault">Choose an Ability Flaw</option>');
            selectFlaw.append('<hr class="dropdown-divider"></hr>');
            for(const abilityType of getAllAbilityTypes()){
                selectFlaw.append('<option value="'+abilityType+'">'+abilityType+'</option>');
            }
            
        } else {
            flawNonChooseList.push(flaw);
        }
    }
    let flawsNonChoose = $('#flawsNonChoose');
    let flawsNonChooseInnerHTML = '';
    for(const flawNonChoose of flawNonChooseList) {
        flawsNonChooseInnerHTML += ' <span class="button is-medium">'+flawNonChoose+'</span>';
        $(".abilityBoost option[value='"+flawNonChoose+"']").remove();
        abilBonusArray.push({ Ability : shortenAbilityType(flawNonChoose), Bonus : "Flaw"});
    }
    flawsNonChoose.html(flawsNonChooseInnerHTML);


    if(saving){
        socket.emit("requestAbilityBonusChange",
            getCharIDFromURL(),
            'Type-Ancestry_Level-1_Code-Other0',
            abilBonusArray);
    }


    // Set saved bonus choices
    if(bonusChoiceMap.get('Type-Ancestry_Level-1_Code-None') != null){
        let savedBoostNum = 0;
        let savedFlawNum = 0;
        for(const bonus of bonusChoiceMap.get('Type-Ancestry_Level-1_Code-None')){
            if(bonus.Bonus == "Boost"){
                savedBoostNum++;
    
                let selectBoostID = '#selectBoost'+savedBoostNum;
                let longAbilityType = lengthenAbilityType(bonus.Ability);
        
                $(selectBoostID).val(longAbilityType);
                if ($(selectBoostID).val() != longAbilityType){
                    $(selectBoostID).val($(selectBoostID+" option:first").val());
                }
            } else if(bonus.Bonus == "Flaw"){
                savedFlawNum++;

                let selectFlawID = '#selectFlaw'+savedFlawNum;
                let longAbilityType = lengthenAbilityType(bonus.Ability);
        
                $(selectFlawID).val(longAbilityType);
                if ($(selectFlawID).val() != longAbilityType){
                    $(selectFlawID).val($(selectFlawID+" option:first").val());
                }
            }
        }
    }


    // Heritage
    let selectHeritage = $('#selectHeritage');
    selectHeritage.html('');

    selectHeritage.append('<option value="chooseDefault">Choose a Heritage</option>');
    selectHeritage.append('<hr class="dropdown-divider"></hr>');

    for(const heritage of ancestryStruct.Heritages){
        if(charHeritage != null && charHeritage.id == heritage.id) {
            selectHeritage.append('<option value="'+heritage.id+'" selected>'+heritage.name+'</option>');
        } else {
            selectHeritage.append('<option value="'+heritage.id+'">'+heritage.name+'</option>');
        }
    }


    // Ancestry Feats //
    createAncestryFeats(charLevel);


    // Display current heritage
    $('#selectHeritage').trigger("change", [false]);

}



function displayCurrentHeritage(ancestryStruct, heritageID) {

    if(heritageID != "chooseDefault"){
        
        let heritage = ancestryStruct.Heritages.find(heritage => {
            return heritage.id == heritageID;
        });
    
        let heritageDescription = $('#heritageDescription');
        heritageDescription.html('<p>'+heritage.description+'</p>');

    } else {

        let heritageDescription = $('#heritageDescription');
        heritageDescription.html('');

    }

}

function clearAbilityBoostsAndFlaws(){

    for(const abilityBoost of $('.abilityBoost')){
        $(abilityBoost).html('');
    }

    for(const abilityFlaw of $('.abilityFlaw')){
        $(abilityFlaw).html('');
    }

}

function boostSingleSelection(){

    let abilityBoosts = $('.abilityBoost');
    for(const abilityBoost of abilityBoosts){

        $(abilityBoost).change(function(event, triggerSave){

            if(hasDuplicateSelected($('.abilityBoost'))){
                $('.abilityBoostControlShell').addClass("is-danger");
            } else {
                $('.abilityBoostControlShell').removeClass("is-danger");

                // Save boosts
                if(triggerSave == null || triggerSave) {
                    $('.abilityBoostControlShell').addClass("is-loading");

                    let boostArray = [];
                    $(".abilityBoost").each(function() {
                        if(!($(this).is(":hidden")) && $(this).val() != "chooseDefault"){
                            boostArray.push(
                                { Ability : shortenAbilityType($(this).val()), Bonus : "Boost" });
                        }
                    });

                    socket.emit("requestAbilityBonusChange",
                        getCharIDFromURL(),
                        'Type-Ancestry_Level-1_Code-None',
                        boostArray);
                }

            }

        });

    }

}



function activateHideSelects(){

    // Activate "select-hide-if-empty"
    let hideSelects = $('.select-hide-if-empty');
    for(const hideSelect of hideSelects) {
        if(hideSelect.options.length <= 0){
            $(hideSelect).parent().hide();
        } else {
            $(hideSelect).parent().show();
        }
    }

}


function createAncestryFeats(charLevel){

    $('#ancestryFeats').html('');

    let ancestryFeatsLocs = [];

    if(charLevel >= 1){
        let locID = buildFeatStruct(1);
        ancestryFeatsLocs.push(locID);
    }
    if(charLevel >= 5){
        let locID = buildFeatStruct(5);
        ancestryFeatsLocs.push(locID);
    }
    if(charLevel >= 9){
        let locID = buildFeatStruct(9);
        ancestryFeatsLocs.push(locID);
    }
    if(charLevel >= 13){
        let locID = buildFeatStruct(13);
        ancestryFeatsLocs.push(locID);
    }
    if(charLevel >= 17){
        let locID = buildFeatStruct(17);
        ancestryFeatsLocs.push(locID);
    }

    processCode_AncestryAbilities(ancestryFeatsLocs);

}

function buildFeatStruct(featLevel) {

    let locationID = "descriptionFeat"+featLevel;

    $('#ancestryFeats').append('<article class="message is-dark"><div class="message-header"><p class="is-size-4 has-text-light has-text-weight-semibold">Ancestry Feat</p><span class="has-text-weight-bold">Lvl '+featLevel+'</span></div><div class="message-body"><div class="columns is-centered"><div id="'+locationID+'" class="column is-paddingless is-8"></div></div></div></article>');


    return { LocationID : locationID, Level : featLevel };

}


socket.on("returnAbilityBonusChange", function(){
    $('.abilityBoostControlShell').removeClass("is-loading");
});


socket.on("returnAncestryChange", function(inChoiceStruct, ancestryPacket){
    $('#selectAncestryControlShell').removeClass("is-loading");
    choiceStruct = inChoiceStruct;

    let ancestryMap = objToMap(ancestryPacket.AncestryObject);

    displayCurrentAncestry(ancestryMap.get(ancestryPacket.AncestryID), true);
    activateHideSelects();

});

socket.on("returnHeritageChange", function(){
    $('#selectHeritageControlShell').removeClass("is-loading");
});

socket.on("returnLanguagesChange", function(){
    console.log("Saved langs");
});
