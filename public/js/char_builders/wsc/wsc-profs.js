/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

//--------------------- Processing Lore --------------------//
function processingProf(wscStatement, srcStruct, locationID, sourceName){

    if(wscStatement.includes("GIVE-PROF-INCREASE-IN")){// GIVE-PROF-INCREASE-IN=Arcana
        let profName = wscStatement.split('=')[1];
        giveProfIncrease(srcStruct, profName, locationID, sourceName);
    } else if(wscStatement.includes("GIVE-PROF-IN")){// GIVE-PROF-IN=Arcana:T
        let data = wscStatement.split('=')[1];
        let segments = data.split(':');
        giveProf(srcStruct, segments[0], segments[1], locationID, sourceName);
    } else {
        displayError("Unknown statement (2-Prof): \'"+wscStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Prof ///////////////////////////////////

function giveProfIncrease(srcStruct, profName, locationID, sourceName){
    giveInProf(srcStruct, profName, 'UP', locationID, sourceName);
}

function giveProf(srcStruct, profName, prof, locationID, sourceName){
    if(prof === 'T'){
        giveProfSkillTraining(srcStruct, profName, prof, locationID, sourceName);
    } else {
        giveInProf(srcStruct, profName, prof, locationID, sourceName);
    }
}

function giveProfSkillTraining(srcStruct, profName, prof, locationID, sourceName){

    let adjProfName = profName.replace(/_|\s+/g,"");
    let profProperName = null;
    let profCategory = null;

    let profData = g_profConversionMap.get(adjProfName);
    if(profData != null){
        profProperName = profData.Name;
        profCategory = profData.Category;
    }

    let numUps = profToNumUp(prof);
    if(numUps === -1){
        displayError("Not a proficiency type: \'"+prof+"\'");
        statementComplete();
        return;
    }

    if(profCategory === 'Skill'){
        
        for(const [profMapName, profDataArray] of g_profMap.entries()){
            const finalProfData = getFinalProf(profDataArray);
            let tempSkillName = finalProfData.Name.toUpperCase();
            tempSkillName = tempSkillName.replace(/_|\s+/g,"");
            if(adjProfName === tempSkillName && finalProfData.NumUps >= numUps){

                if(!hasSameSrcIterate(srcStruct, profDataArray)){
                    processCode(
                        'GIVE-SKILL='+prof,
                        srcStruct,
                        locationID,
                        sourceName);
                    window.setTimeout(() => {
                      $('#'+locationID).append('<p class="help is-info is-italic">You are already trained in '+finalProfData.Name+' which means you can select a new skill to become trained in instead.</p>');
                    }, 100);
                    statementComplete();
                    return;
                }

            }
        }

        skillsUpdateWSCChoiceStruct(srcStruct, profProperName, prof);
        socket.emit("requestProficiencyChange",
            getCharIDFromURL(),
            {srcStruct, isSkill : true, isStatement : true},
            { For : profCategory, To : profProperName, Prof : prof, SourceName : sourceName });
        displayProfChange(locationID, prof, profProperName);
        return;

    } else {
        giveInProf(srcStruct, profName, prof, locationID, sourceName);
        return;
    }

}

function giveInProf(srcStruct, profName, prof, locationID, sourceName){

    let profProperName = null;
    let profCategory = null;

    if(profName.startsWith('LORE~')){
        profName = profName.replace(/LORE\~/g,'');
        profProperName = profName.replace(/\s+/g,'_').toUpperCase()+'_LORE';
        profCategory = 'Skill';
    }

    if(profName.startsWith('WEAPON~')){
        profName = profName.replace(/WEAPON\~/g,'');
        profProperName = profName.replace(/\s+/g,'_').toUpperCase();
        profCategory = 'Attack';
    }

    if(profName.startsWith('ARMOR~')){
        profName = profName.replace(/ARMOR\~/g,'');
        profProperName = profName.replace(/\s+/g,'_').toUpperCase();
        profCategory = 'Defense';
    }

    profName = profName.replace(/_|\s+/g,'');
    let profData = g_profConversionMap.get(profName);
    if(profData != null){
        profProperName = profData.Name;
        profCategory = profData.Category;
    }

    let isSkill = false;
    if(profCategory === 'Skill'){
        isSkill = true;
    }

    if(profProperName != null && profCategory != null){
        if(isSkill){
            skillsUpdateWSCChoiceStruct(srcStruct, profProperName, prof);
        }
        socket.emit("requestProficiencyChange",
            getCharIDFromURL(),
            {srcStruct, isSkill : isSkill, isStatement : true},
            { For : profCategory, To : profProperName, Prof : prof, SourceName : sourceName });
        displayProfChange(locationID, prof, profProperName);
    } else {
        displayError("Unknown proficiency: \'"+profName+"\'");
        statementComplete();
    }

}

function displayProfChange(locationID, prof, profName){
  if(locationID == 'profSkillsCode') { return; }// Skip for init skill profs from class
  window.setTimeout(() => {
    let innerHTML = '<p class="help is-info"><span class="is-bold">Proficiency Change:</span><span class="is-italic"> You become '+profToWord(prof).toLowerCase()+' in '+profName.toLowerCase().replace(/_/g,' ').replace('class dc', 'your class DC').replace('spellattacks', ' spell attacks').replace('spelldcs', ' spell DCs')+'.</span></p>';
    if($('#'+locationID).html() != null && !$('#'+locationID).html().includes(innerHTML)) { $('#'+locationID).append(innerHTML); }
  }, 100);
}