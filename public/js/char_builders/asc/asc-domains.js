
//--------------------- Processing Domains --------------------//
function processingDomains(ascStatement, srcStruct, locationID){

    if(ascStatement.includes("GIVE-DOMAIN-ADVANCEMENT")){ // GIVE-DOMAIN-ADVANCEMENT=Cleric
        let spellSRC = ascStatement.split('=')[1];
        giveDomainAdvancement(srcStruct, locationID, spellSRC);
    } else if(ascStatement.includes("GIVE-DOMAIN")){ // GIVE-DOMAIN=Cleric
        let spellSRC = ascStatement.split('=')[1];
        giveDomain(srcStruct, locationID, spellSRC);
    } else {
        displayError("Unknown statement (2-Domain): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Domain ///////////////////////////////////

function giveDomain(srcStruct, locationID, spellSRC){

    let selectID = "selectDomain"+locationID+srcStruct.sourceCodeSNum;
    let selectControlShellClass = selectID+'ControlShell';
    let descriptionID = "selectDomainDescription"+locationID+srcStruct.sourceCodeSNum;

    $('#'+locationID).append('<div class="field mt-1"><div class="select '+selectControlShellClass+'"><select id="'+selectID+'"></select></div></div>');

    $('#'+locationID).append('<div id="'+descriptionID+'"></div>');

    $('#'+selectID).append('<option value="chooseDefault">Choose a Domain</option>');
    $('#'+selectID).append('<hr class="dropdown-divider"></hr>');

    // Set saved domain choice
    let savedDomainData = ascChoiceStruct.DomainArray.find(domain => {
        return hasSameSrc(domain, srcStruct);
    });

    console.log(ascChoiceStruct);
    console.log(savedDomainData);

    for(const domain of ascChoiceStruct.AllDomains){

        if(savedDomainData != null && savedDomainData.value.id == domain.id) {
            $('#'+selectID).append('<option value="'+domain.id+'" selected>'+domain.name+'</option>');
        } else {
            $('#'+selectID).append('<option value="'+domain.id+'">'+domain.name+'</option>');
        }

    }

    // On select change
    $('#'+selectID).change(function(event, triggerSave) {
        
        if(!($(this).is(":hidden"))) {

            if($(this).val() == "chooseDefault"){

                $('.'+selectControlShellClass).addClass("is-info");

                $('#'+descriptionID).html('');

                socket.emit("requestDomainChange",
                    getCharIDFromURL(),
                    srcStruct,
                    null);

            } else {

                $('.'+selectControlShellClass).removeClass("is-info");

                let domainID = $(this).val();
                let domain = ascChoiceStruct.AllDomains.find(domain => {
                    return domain.id == domainID;
                });

                $('#'+descriptionID).html(processText(domain.description, false));

                socket.emit("requestDomainChange",
                    getCharIDFromURL(),
                    srcStruct,
                    {Domain: domain, SpellSRC: spellSRC});
                
            }

            $(this).blur();

        }

    });

    $('#'+selectID).trigger("change", [false]);

    statementComplete();

}

socket.on("returnDomainChange", function(){
    selectorUpdated();
    socket.emit("requestASCUpdateChoices", getCharIDFromURL(), 'DOMAINS');
});


//////////////////////////////// Give Domain Advancement ///////////////////////////////////

function giveDomainAdvancement(srcStruct, locationID, spellSRC){

    let selectID = "selectDomainAdvancement"+locationID+srcStruct.sourceCodeSNum;
    let selectControlShellClass = selectID+'ControlShell';
    let descriptionID = "selectDomainAdvancementDescription"+locationID+srcStruct.sourceCodeSNum;

    $('#'+locationID).append('<div class="field mt-1"><div class="select '+selectControlShellClass+'"><select id="'+selectID+'"></select></div></div>');

    $('#'+locationID).append('<div id="'+descriptionID+'"></div>');

    $('#'+selectID).append('<option value="chooseDefault">Choose a Domain</option>');
    $('#'+selectID).append('<hr class="dropdown-divider"></hr>');

    // Set saved domain choice
    let savedDomainData = ascChoiceStruct.AdvancedDomainArray.find(domainAdvanced => {
        return hasSameSrc(domainAdvanced, srcStruct);
    });

    for(const domainData of ascChoiceStruct.DomainArray){

        if(savedDomainData != null && savedDomainData.value.id == domainData.value.id) {
            $('#'+selectID).append('<option value="'+domainData.value.id+'" selected>'+domainData.value.name+'</option>');
        } else {
            $('#'+selectID).append('<option value="'+domainData.value.id+'">'+domainData.value.name+'</option>');
        }

    }

    // On select change
    $('#'+selectID).change(function(event, triggerSave) {
        
        if(!($(this).is(":hidden"))) {

            if($(this).val() == "chooseDefault"){

                $('.'+selectControlShellClass).addClass("is-info");

                $('#'+descriptionID).html('');

                socket.emit("requestDomainAdvancementChange",
                    getCharIDFromURL(),
                    srcStruct,
                    null);

            } else {

                $('.'+selectControlShellClass).removeClass("is-info");

                let domainID = $(this).val();
                let domain = ascChoiceStruct.AllDomains.find(domain => {
                    return domain.id == domainID;
                });

                $('#'+descriptionID).html(processText(domain.description, false));

                socket.emit("requestDomainAdvancementChange",
                    getCharIDFromURL(),
                    srcStruct,
                    {Domain: domain, SpellSRC: spellSRC});
                
            }

            $(this).blur();

        }

    });

    $('#'+selectID).trigger("change", [false]);

    statementComplete();

}

socket.on("returnDomainAdvancementChange", function(){
    selectorUpdated();
});