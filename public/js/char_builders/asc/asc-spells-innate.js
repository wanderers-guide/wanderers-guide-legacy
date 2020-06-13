
//------------------------- Processing Innate Spells -------------------------//
function initInnateSpellProcessing(ascStatement, srcStruct, locationID){
    if(ascSpellMap == null) {
        //console.log("Did not find valid spellMap :(");
        socket.emit("requestASCSpells",
                getCharIDFromURL(),
                ascStatement,
                srcStruct,
                locationID);
    } else {
        //console.log("> Found a valid spellMap!");
        processingInnateSpells(ascStatement, srcStruct, locationID);
    }
}

socket.on("returnASCSpells", function(ascStatement, srcStruct, locationID, spellObject){
    let spellsMap = objToMap(spellObject);
    spellsMap = new Map([...spellsMap.entries()].sort(
        function(a, b) {
            if (a[1].Spell.level === b[1].Spell.level) {
                // Name is only important when levels are the same
                return a[1].Spell.name > b[1].Spell.name ? 1 : -1;
            }
            return b[1].Spell.level - a[1].Spell.level;
        })
    );
    //console.log("Setting spellMap to new one...");
    ascSpellMap = spellsMap;
    processingInnateSpells(ascStatement, srcStruct, locationID);
});


function processingInnateSpells(ascStatement, srcStruct, locationID){

    if(ascStatement.includes("GIVE-INNATE-SPELL")){// GIVE-INNATE-SPELL=3:divine:1
        let data = ascStatement.split('=')[1]; // Set cast times per day to 0 to cast an unlimited number
        let segments = data.split(':');// For cantrips just do: GIVE-INNATE-SPELL=Daze:0:divine:0
        giveInnateSpell(srcStruct, locationID, segments[0], segments[1], segments[2], segments[3]);
    } else if(ascStatement.includes("GIVE-INNATE-SPELL-NAME")){// GIVE-INNATE-SPELL-NAME=Meld_Into_Stone:3:divine:1
        let data = ascStatement.split('=')[1]; // Set cast times per day to 0 to cast an unlimited number
        let segments = data.split(':');// For cantrips just do: GIVE-INNATE-SPELL=Daze:0:divine:0
        giveInnateSpellByName(srcStruct, segments[0], segments[1], segments[2], segments[3]);
    } else {
        displayError("Unknown statement (2-SpellInnate): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Innate Spell ///////////////////////////////////
function giveInnateSpell(srcStruct, locationID, spellLevel, spellTradition, timesPerDay){
    if(spellTradition != null){
        if(spellTradition === 'OCCULT' || spellTradition === 'ARCANE' || spellTradition === 'DIVINE' || spellTradition === 'PRIMAL') {
            if(!isNaN(parseInt(spellLevel))) {
                displayInnateSpellChoice(srcStruct, locationID, spellLevel, spellTradition, timesPerDay);
            } else {
                displayError("Spell Level is Not a Number: \'"+spellLevel+"\'");
                statementComplete();
            }
        } else {
            displayError("Unknown Spell Tradition: \'"+spellTradition+"\'");
            statementComplete();
        }
    } else {
        displayError("Invalid Spell Tradition");
        statementComplete();
    }
}

function displayInnateSpellChoice(srcStruct, locationID, spellLevel, spellTradition, timesPerDay){

    let selectionName = (spellLevel == 0) ? 'Choose a Cantrip' : 'Choose a Level '+spellLevel+' Spell';
    let selectSpellID = "selectInnateSpell"+locationID+srcStruct.sourceCodeSNum;
    let descriptionSpellID = "descriptionInnateSpell"+locationID+srcStruct.sourceCodeSNum;
    let selectSpellControlShellClass = selectSpellID+'ControlShell';

    $('#'+locationID).append('<div class="field"><div class="select '+selectSpellControlShellClass+'"><select id="'+selectSpellID+'" class="selectFeat"></select></div><div id="'+descriptionSpellID+'"></div></div>');

    $('#'+selectSpellID).append('<option value="chooseDefault">'+selectionName+'</option>');

    let triggerChange = false;
    // Set saved spell choices

    let innateSpellArray = ascChoiceStruct.InnateSpellArray;
    
    let innateSpellData = innateSpellArray.find(innateSpellData => {
        return hasSameSrc(innateSpellData, srcStruct);
    });

    let selectedSpell = null;
    if(innateSpellData != null){
        selectedSpell = innateSpellData;
        triggerChange = true;
    }

    for(const [spellID, spellData] of ascSpellMap.entries()){
        if(spellData.Spell.level != spellLevel){ continue; }
        if(!spellData.Spell.traditions.includes(spellTradition.toLowerCase())){ continue; }

        let spellName = spellData.Spell.name;
        if(spellData.Spell.isArchived === 1){
            if(selectedSpell != null && selectedSpell.SpellID == spellData.Spell.id){
                spellName += ' - Archived';
            } else {
                continue;
            }
        }

        $('#'+selectSpellID).append('<option value="'+spellData.Spell.id+'">'+spellName+'</option>');

    }

    if(selectedSpell != null){
        $('#'+selectSpellID).val(selectedSpell.SpellID);
        if ($('#'+selectSpellID).val() != selectedSpell.SpellID){
            $('#'+selectSpellID).val($("#"+selectSpellID+" option:first").val());
            $('#'+selectSpellID).parent().addClass("is-info");
        }
    }

    // On feat choice change
    $('#'+selectSpellID).change(function(event, triggerSave) {

        if(!($(this).is(":hidden"))) {

            let spellID = $(this).val();
            let spell = ascSpellMap.get(spellID+"");

            if($(this).val() == "chooseDefault" || spell == null){
                $('.'+selectSpellControlShellClass).addClass("is-info");

                // Display nothing
                $('#'+descriptionSpellID).html('');

                socket.emit("requestASCInnateSpellChange",
                    getCharIDFromURL(),
                    srcStruct,
                    null,
                    selectSpellControlShellClass);

            } else {
                $('.'+selectSpellControlShellClass).removeClass("is-info");

                // Display spell
                displaySpell(descriptionSpellID, spell);

                // Save spell
                if(triggerSave == null || triggerSave) {
                    $('.'+selectSpellControlShellClass).addClass("is-loading");
                    socket.emit("requestASCInnateSpellChange",
                        getCharIDFromURL(),
                        srcStruct,
                        {name: spell.Spell.name, level: spell.Spell.level, tradition: spellTradition, tPd: timesPerDay},
                        selectSpellControlShellClass);
                }

            }
        }
    });

    $('#'+selectSpellID).trigger("change", [triggerChange]);

    statementComplete();

}


socket.on("returnASCInnateSpellChange", function(selectControlShellClass){
    if(selectControlShellClass != null) {
        $('.'+selectControlShellClass).removeClass("is-loading");
        $('.'+selectControlShellClass+'>select').blur();
    }
    selectorUpdated();
});


//////////////////////////////// Give Innate Spell by Name ///////////////////////////////////
function giveInnateSpellByName(srcStruct, spellName, spellLevel, spellTradition, timesPerDay){
    if(spellTradition != null){
        spellName = spellName.replace(/_/g," ");
        if(spellTradition === 'OCCULT' || spellTradition === 'ARCANE' || spellTradition === 'DIVINE' || spellTradition === 'PRIMAL') {
            socket.emit("requestInnateSpellChange",
                getCharIDFromURL(),
                srcStruct,
                spellName,
                spellLevel,
                spellTradition,
                timesPerDay);
        } else {
            displayError("Unknown Spell Tradition: \'"+spellTradition+"\'");
            statementComplete();
        }
    } else {
        displayError("Invalid Spell Tradition");
        statementComplete();
    }
}

socket.on("returnInnateSpellChange", function(){
    statementComplete();
});