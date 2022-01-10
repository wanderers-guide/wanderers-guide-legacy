/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

//--------------------- Processing Domains --------------------//
function processingDomains(wscStatement, srcStruct, locationID, extraData){

    if(wscStatement.includes("GIVE-DOMAIN-ADVANCEMENT=")){ // GIVE-DOMAIN-ADVANCEMENT=Cleric
        let spellSRC = wscStatement.split('=')[1];
        giveDomainAdvancement(srcStruct, locationID, spellSRC, extraData);
    } else if(wscStatement.includes("GIVE-DOMAIN=")){ // GIVE-DOMAIN=Cleric
        let spellSRC = wscStatement.split('=')[1];
        giveDomain(srcStruct, locationID, spellSRC, extraData);
    } else {
        displayError("Unknown statement (2-Domain): \'"+wscStatement+"\'");
        statementComplete('Domain - Unknown Statement');
    }

}

//////////////////////////////// Give Domain ///////////////////////////////////

function giveDomain(srcStruct, locationID, spellSRC, extraData){

    let selectID = "selectDomain-"+locationID+"-"+srcStruct.sourceCode+"-"+srcStruct.sourceCodeSNum;
    let selectControlShellClass = selectID+'ControlShell';
    let descriptionID = "selectDomainDescription-"+locationID+"-"+srcStruct.sourceCode+"-"+srcStruct.sourceCodeSNum;

    const selectionTagInfo = getTagFromData(srcStruct, extraData.sourceName, 'Unselected Domain', 'UNSELECTED');

    $('#'+locationID).append('<div class="field is-grouped is-grouped-centered is-marginless my-1"><div class="select '+selectControlShellClass+'" data-selection-info="'+selectionTagInfo+'"><select id="'+selectID+'"></select></div></div>');

    $('#'+locationID).append('<div id="'+descriptionID+'"></div>');

    $('#'+selectID).append('<option value="chooseDefault">Choose a Domain</option>');
    $('#'+selectID).append('<optgroup label="──────────"></optgroup>');

    // Set saved domain choice
    let savedDomainData = getDataSingle(DATA_SOURCE.DOMAIN, srcStruct);

    for(const domain of g_domains){

        if(savedDomainData != null && savedDomainData.value.id == domain.id) {
            $('#'+selectID).append('<option value="'+domain.id+'" selected>'+domain.name+'</option>');
        } else {
            $('#'+selectID).append('<option value="'+domain.id+'">'+domain.name+'</option>');
        }

    }

    // On select change
    $('#'+selectID).change(function(event, triggerSave) {
        
        if($(this).val() == "chooseDefault"){

            $('.'+selectControlShellClass).addClass("is-info");

            $('#'+descriptionID).html('');

            deleteData(DATA_SOURCE.DOMAIN, srcStruct);

            socket.emit("requestDomainChange",
                getCharIDFromURL(),
                srcStruct,
                null);

        } else {

            $('.'+selectControlShellClass).removeClass("is-info");

            let domainID = $(this).val();
            let domain = g_domains.find(domain => {
                return domain.id == domainID;
            });

            $('#'+descriptionID).html(processText(domain.description, false, null));

            setData(DATA_SOURCE.DOMAIN, srcStruct, domain.id);
            setData(DATA_SOURCE.FOCUS_SPELL, srcStruct, spellSRC+"="+domain.initialSpellID);

            socket.emit("requestDomainChange",
                getCharIDFromURL(),
                srcStruct,
                {Domain: domain, SpellSRC: spellSRC});
            
        }

        $(this).blur();

    });

    $('#'+selectID).trigger("change", [false]);

    statementComplete('Domain - Display');

}

socket.on("returnDomainChange", function(){
    selectorUpdated();
});


//////////////////////////////// Give Domain Advancement ///////////////////////////////////

function giveDomainAdvancement(srcStruct, locationID, spellSRC, extraData){

    let selectID = "selectDomainAdvancement-"+locationID+"-"+srcStruct.sourceCode+"-"+srcStruct.sourceCodeSNum;
    let selectControlShellClass = selectID+'ControlShell';
    let descriptionID = "selectDomainAdvancementDescription-"+locationID+"-"+srcStruct.sourceCode+"-"+srcStruct.sourceCodeSNum;

    const selectionTagInfo = getTagFromData(srcStruct, extraData.sourceName, 'Unselected Domain Advancement', 'UNSELECTED');

    $('#'+locationID).append('<div class="field is-grouped is-grouped-centered is-marginless my-1"><div class="select '+selectControlShellClass+'" data-selection-info="'+selectionTagInfo+'"><select id="'+selectID+'"></select></div></div>');

    $('#'+locationID).append('<div id="'+descriptionID+'"></div>');

    $('#'+selectID).append('<option value="chooseDefault">Choose a Domain</option>');
    $('#'+selectID).append('<optgroup label="──────────"></optgroup>');

    // Set saved domain choice
    const savedDomainData = getDataSingle(DATA_SOURCE.ADVANCED_DOMAIN, srcStruct);

    for(const domainData of getDataAll(DATA_SOURCE.DOMAIN)){

        let domain = g_domains.find(domain => {
          return domain.id == domainData.value;
        });

        if(savedDomainData != null && savedDomainData.value == domainData.value) {
            $('#'+selectID).append('<option value="'+domainData.value+'" selected>'+domain.name+'</option>');
        } else {
            $('#'+selectID).append('<option value="'+domainData.value+'">'+domain.name+'</option>');
        }

    }

    // On select change
    $('#'+selectID).change(function(event, triggerSave) {
        
        if($(this).val() == "chooseDefault"){

            $('.'+selectControlShellClass).addClass("is-info");

            $('#'+descriptionID).html('');

            deleteData(DATA_SOURCE.ADVANCED_DOMAIN, srcStruct);

            socket.emit("requestDomainAdvancementChange",
                getCharIDFromURL(),
                srcStruct,
                null);

        } else {

            $('.'+selectControlShellClass).removeClass("is-info");

            let domainID = $(this).val();
            let domain = g_domains.find(domain => {
                return domain.id == domainID;
            });

            $('#'+descriptionID).html(processText(domain.description, false, null));

            setData(DATA_SOURCE.ADVANCED_DOMAIN, srcStruct, domain.id);
            setData(DATA_SOURCE.FOCUS_SPELL, srcStruct, spellSRC+"="+domain.advancedSpellID);

            socket.emit("requestDomainAdvancementChange",
                getCharIDFromURL(),
                srcStruct,
                {Domain: domain, SpellSRC: spellSRC});
            
        }

        $(this).blur();

    });

    $('#'+selectID).trigger("change", [false]);

    statementComplete('Domain - Advancement Display');

}

socket.on("returnDomainAdvancementChange", function(){
    selectorUpdated();
});