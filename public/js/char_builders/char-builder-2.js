
let socket = io();

let choiceStruct = null;

let g_ancestry = null;
let g_ancestryForHeritage = null;

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

    // Populate Ancestry Selector
    let selectAncestry = $('#selectAncestry');
    selectAncestry.append('<option value="chooseDefault" name="chooseDefault">Choose an Ancestry</option>');
    selectAncestry.append('<hr class="dropdown-divider"></hr>');
    for(const [key, value] of ancestryMap.entries()){
        let currentAncestryID = $('#selectAncestry').attr('name');
        if(value.Ancestry.id == currentAncestryID){
            if(value.Ancestry.isArchived == 0){
                selectAncestry.append('<option value="'+value.Ancestry.id+'" selected>'+value.Ancestry.name+'</option>');
            } else {
                selectAncestry.append('<option value="'+value.Ancestry.id+'" selected>'+value.Ancestry.name+' (archived)</option>');
            }
        } else if(value.Ancestry.isArchived == 0){
            selectAncestry.append('<option value="'+value.Ancestry.id+'">'+value.Ancestry.name+'</option>');
        }
    }
    

    // Ancestry Selection //
    selectAncestry.change(function(event, triggerSave) {
        let ancestryID = $("#selectAncestry option:selected").val();
        if(ancestryID != "chooseDefault"){
            $('.ancestry-content').removeClass("is-hidden");
            $('#selectAncestryControlShell').removeClass("is-info");
    
            // Save ancestry
            if(triggerSave == null || triggerSave) {
                $('#selectAncestryControlShell').addClass("is-loading");
    
                g_ancestry = ancestryMap.get(ancestryID);
                socket.emit("requestAncestryChange",
                    getCharIDFromURL(),
                    ancestryID);
                
            } else {
                displayCurrentAncestry(ancestryMap.get(ancestryID), false);
            }

        } else {
            $('.ancestry-content').addClass("is-hidden");
            $('#selectAncestryControlShell').addClass("is-info");

            // Delete ancestry, set to null
            g_ancestry = null;
            socket.emit("requestAncestryChange",
                getCharIDFromURL(),
                null);
        }

    });

    // Heritage Selection //
    $('#selectHeritage').change(function(event, triggerSave) {
        let heritageID = $(this).val();
        let ancestryID = $("#selectAncestry option:selected").val();

        if(ancestryID != "chooseDefault" && heritageID != "chooseDefault"){
            $('#selectHeritageControlShell').removeClass("is-info");

            // Save heritage
            if(triggerSave == null || triggerSave) {
                $('#selectHeritageControlShell').addClass("is-loading");
    
                g_ancestryForHeritage = ancestryMap.get(ancestryID);
                socket.emit("requestHeritageChange",
                    getCharIDFromURL(),
                    heritageID);
                
            } else {
                displayCurrentHeritage(ancestryMap.get(ancestryID), heritageID);
            }

        } else {
            $('#selectHeritageControlShell').addClass("is-info");

            g_ancestryForHeritage = null;
            socket.emit("requestHeritageChange",
                    getCharIDFromURL(),
                    null);
            
        }

    });


    // Display current ancestry
    $('#selectAncestry').trigger("change", [false]);

});

socket.on("returnAncestryChange", function(inChoiceStruct){
    $('#selectAncestryControlShell').removeClass("is-loading");
    choiceStruct = inChoiceStruct;

    if(g_ancestry != null){
        injectASCChoiceStruct(choiceStruct);
        displayCurrentAncestry(g_ancestry, true);
    } else {
        finishLoadingPage();
    }

});

socket.on("returnHeritageChange", function(heritageID){
    $('#selectHeritageControlShell').removeClass("is-loading");

    displayCurrentHeritage(g_ancestryForHeritage, heritageID);

});


function displayCurrentAncestry(ancestryStruct, saving) {
    g_ancestry = null;
    $('#selectAncestry').blur();

    let charLevel = choiceStruct.Level;
    let charHeritage = choiceStruct.Heritage;


    if(ancestryStruct.Ancestry.isArchived == 1){
        $('#isArchivedMessage').removeClass('is-hidden');
    } else {
        $('#isArchivedMessage').addClass('is-hidden');
    }


    let ancestryDescription = $('#ancestryDescription');

    ancestryDescription.html(processText(ancestryStruct.Ancestry.description, false));



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
    ancestrySpeed.append(ancestryStruct.Ancestry.speed+" ft");

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
    ancestryLanguages.append('and <a class="has-text-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="You will get to select an additional number of languages equal your Intelligence modifer in the Finalize step. The following are the options you will be able to choose from: '+bonusLangs+'">more*</a>');

    if(saving){
        let langCount = 0;
        for(let langID of langIDArray){
            let srcStruct = {
                sourceType: 'ancestry',
                sourceLevel: 1,
                sourceCode: 'inits-'+langCount,
                sourceCodeSNum: 'a',
            };
            socket.emit("requestLanguageChange",
                getCharIDFromURL(),
                srcStruct,
                langID);
            langCount++;
        }
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Senses ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    let ancestrySenses = $('#ancestrySenses');
    ancestrySenses.html('');
    let senseIDArray = [];
    if(ancestryStruct.VisionSense != null){
        ancestrySenses.append('<a class="has-text-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+ancestryStruct.VisionSense.description+'">'+ancestryStruct.VisionSense.name+'</a>');
        senseIDArray.push(ancestryStruct.VisionSense.id);
        if(ancestryStruct.AdditionalSense != null){
            ancestrySenses.append(' and ');
        }
    }
    if(ancestryStruct.AdditionalSense != null){
        ancestrySenses.append('<a class="has-text-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+ancestryStruct.AdditionalSense.description+'">'+ancestryStruct.AdditionalSense.name+'</a>');
        senseIDArray.push(ancestryStruct.AdditionalSense.id);
    }

    if(saving){
        let senseCount = 0;
        for(let senseID of senseIDArray){
            let srcStruct = {
                sourceType: 'ancestry',
                sourceLevel: 1,
                sourceCode: 'inits-'+senseCount,
                sourceCodeSNum: 'a',
            };
            socket.emit("requestSensesChange",
                getCharIDFromURL(),
                srcStruct,
                senseID);
            senseCount++;
        }
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Physical Features ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    
    $('#physicalFeatureOneCodeOutput').addClass('is-hidden');
    $('#physicalFeatureTwoCodeOutput').addClass('is-hidden');


    if(ancestryStruct.PhysicalFeatureOne != null || ancestryStruct.PhysicalFeatureTwo != null) {
        $('#sectionPhysicalFeatures').removeClass('is-hidden');

        let ancestryPhysicalFeatures = $('#ancestryPhysicalFeatures');
        ancestryPhysicalFeatures.html('');
        let physicalFeatureIDArray = [];
        if(ancestryStruct.PhysicalFeatureOne != null){
            ancestryPhysicalFeatures.append('<a class="has-text-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+ancestryStruct.PhysicalFeatureOne.description+'">'+ancestryStruct.PhysicalFeatureOne.name+'</a>');
            physicalFeatureIDArray.push(ancestryStruct.PhysicalFeatureOne.id);
            if(ancestryStruct.PhysicalFeatureTwo != null){
                ancestryPhysicalFeatures.append(' and ');
            }

            let srcStruct = {
                sourceType: 'ancestry',
                sourceLevel: 1,
                sourceCode: 'inits-phyFeat-1',
                sourceCodeSNum: 'a',
            };
            processCode(
                ancestryStruct.PhysicalFeatureOne.code,
                srcStruct,
                'physicalFeatureOneCodeOutput');
            if(ancestryStruct.PhysicalFeatureOne.code != null){
                $('#physicalFeatureOneCodeOutput').removeClass('is-hidden');
            }
        }

        if(ancestryStruct.PhysicalFeatureTwo != null){
            ancestryPhysicalFeatures.append('<a class="has-text-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+ancestryStruct.PhysicalFeatureTwo.description+'">'+ancestryStruct.PhysicalFeatureTwo.name+'</a>');
            physicalFeatureIDArray.push(ancestryStruct.PhysicalFeatureTwo.id);

            let srcStruct = {
                sourceType: 'ancestry',
                sourceLevel: 1,
                sourceCode: 'inits-phyFeat-2',
                sourceCodeSNum: 'a',
            };
            processCode(
                ancestryStruct.PhysicalFeatureTwo.code,
                srcStruct,
                'physicalFeatureTwoCodeOutput');
            if(ancestryStruct.PhysicalFeatureTwo.code != null){
                $('#physicalFeatureTwoCodeOutput').removeClass('is-hidden');
            }
        }
    
        if(saving){
            let phyFeatCount = 0;
            for(let physicalFeatureID of physicalFeatureIDArray){
                let srcStruct = {
                    sourceType: 'ancestry',
                    sourceLevel: 1,
                    sourceCode: 'inits-'+phyFeatCount,
                    sourceCodeSNum: 'a',
                };
                socket.emit("requestPhysicalFeaturesChange",
                    getCharIDFromURL(),
                    srcStruct,
                    physicalFeatureID);
                phyFeatCount++;
            }
        }

    } else {
        $('#sectionPhysicalFeatures').addClass('is-hidden');
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    // Boosts //

    let boostChooseCount = 0;
    let boostNonChooseList = [];
    for(const boost of ancestryStruct.Boosts) {
        if(boost == "Anything") {
            boostChooseCount++;
        } else {
            boostNonChooseList.push(boost);
        }
    }
    let boostsNonChoose = $('#boostsNonChoose');
    let boostsNonChooseInnerHTML = '';
    let boostNonChooseCount = 0;
    for(const boostNonChoose of boostNonChooseList) {
        boostsNonChooseInnerHTML += ' <span class="button is-medium">'+boostNonChoose+'</span>';
        $(".abilityBoost option[value='"+boostNonChoose+"']").remove();

        if(saving){
            socket.emit("requestAbilityBonusChange",
                getCharIDFromURL(),
                {sourceType: 'ancestry', sourceLevel: 1, sourceCode: 'boost-nonChoose-'+boostNonChooseCount, sourceCodeSNum: 'a'},
                {Ability : shortenAbilityType(boostNonChoose), Bonus : "Boost"});
        }
        boostNonChooseCount++;

    }
    boostsNonChoose.html(boostsNonChooseInnerHTML);


    let boostChooseString = '';
    for(let ability of getAllAbilityTypes()){
        console.log(boostNonChooseList);
        console.log(ability);
        if(!boostNonChooseList.includes(ability)){
            boostChooseString += shortenAbilityType(ability)+',';
        }
    }

    $('#boostsChoose').html('');
    let srcStruct = {
        sourceType: 'ancestry',
        sourceLevel: 1,
        sourceCode: 'boost-choose',
        sourceCodeSNum: 'a',
    };
    let boostChooseCodeStr = '';
    for(let i = 0; i < boostChooseCount; i++) {
        boostChooseCodeStr += 'GIVE-ABILITY-BOOST-SINGLE='+boostChooseString+', ';
    }
    if(boostChooseCodeStr != ''){
        processCode(
            boostChooseCodeStr,
            srcStruct,
            'boostsChoose');
    }


    // Flaws //
    let flawNonChooseList = [];
    for(const flaw of ancestryStruct.Flaws) {
        if(flaw == "Anything") {
            
        } else {
            flawNonChooseList.push(flaw);
        }
    }
    let flawsNonChoose = $('#flawsNonChoose');
    let flawsNonChooseInnerHTML = '';
    let flawNonChooseCount = 0;
    for(const flawNonChoose of flawNonChooseList) {
        flawsNonChooseInnerHTML += ' <span class="button is-medium">'+flawNonChoose+'</span>';
        $(".abilityBoost option[value='"+flawNonChoose+"']").remove();

        if(saving){
            socket.emit("requestAbilityBonusChange",
                getCharIDFromURL(),
                {sourceType: 'ancestry', sourceLevel: 1, sourceCode: 'flaw-nonChoose-'+flawNonChooseCount, sourceCodeSNum: 'a',},
                {Ability : shortenAbilityType(flawNonChoose), Bonus : "Flaw"});
        }
        flawNonChooseCount++;
    }
    flawsNonChoose.html(flawsNonChooseInnerHTML);




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
    $('#selectHeritage').blur();


    if(heritageID != "chooseDefault" && ancestryStruct != null){
        
        let heritage = ancestryStruct.Heritages.find(heritage => {
            return heritage.id == heritageID;
        });
    
        let heritageDescription = $('#heritageDescription');
        heritageDescription.html(processText(heritage.description, false));
        heritageDescription.removeClass('is-hidden');

        $('#heritageCodeOutput').html('');

        let srcStruct = {
            sourceType: 'ancestry',
            sourceLevel: 1,
            sourceCode: 'heritage',
            sourceCodeSNum: 'a',
        };
        processCode(
            heritage.code,
            srcStruct,
            'heritageCodeOutput');

    } else {

        let heritageDescription = $('#heritageDescription');
        heritageDescription.html('');
        heritageDescription.addClass('is-hidden');
        $('#heritageCodeOutput').html('');

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

    $('#ancestryFeats').append('<article class="message"><div class="message-header"><p class="is-size-4 has-text-grey-light has-text-weight-semibold">Ancestry Feat</p><span class="has-text-weight-bold">Lvl '+featLevel+'</span></div><div class="message-body"><div class="columns is-centered"><div id="'+locationID+'" class="column is-paddingless is-8"></div></div></div></article>');


    return { LocationID : locationID, Level : featLevel };

}


function finishLoadingPage() {
    // Turn off page loading
    $('.pageloader').addClass("fadeout");
}

function selectorUpdated() {

}