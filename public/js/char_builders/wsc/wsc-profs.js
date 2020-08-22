/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

//--------------------- Processing Lore --------------------//
function processingProf(wscStatement, srcStruct, locationID){

    if(wscStatement.includes("GIVE-PROF-INCREASE-IN")){// GIVE-PROF-INCREASE-IN=Arcana
        let profName = wscStatement.split('=')[1];
        giveProfIncrease(srcStruct, profName);
    } else if(wscStatement.includes("GIVE-PROF-IN")){// GIVE-PROF-IN=Arcana:T
        let data = wscStatement.split('=')[1];
        let segments = data.split(':');
        giveProf(srcStruct, segments[0], segments[1], locationID);
    } else {
        displayError("Unknown statement (2-Prof): \'"+wscStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Prof ///////////////////////////////////

function giveProfIncrease(srcStruct, profName){
    giveInProf(srcStruct, profName, 'UP');
}

function giveProf(srcStruct, profName, prof, locationID){
    if(prof === 'T'){
        giveProfSkillTraining(srcStruct, profName, prof, locationID);
    } else {
        giveInProf(srcStruct, profName, prof);
    }
}

function giveProfSkillTraining(srcStruct, profName, prof, locationID){

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
        
        for(const [profMapName, profMapData] of g_profMap.entries()){
            let tempSkillName = profMapData.Name.toUpperCase();
            tempSkillName = tempSkillName.replace(/_|\s+/g,"");
            if(adjProfName === tempSkillName && profMapData.NumUps >= numUps){

                if(!hasSameSrc(srcStruct, profMapData.OriginalData)){
                    processCode(
                        'GIVE-SKILL='+prof,
                        srcStruct,
                        locationID);
                    statementComplete();
                    return;
                }

            }
        }

        socket.emit("requestProficiencyChange",
            getCharIDFromURL(),
            {srcStruct, isSkill : true, isStatement : true},
            { For : profCategory, To : profProperName, Prof : prof });
        return;

    } else {
        giveInProf(srcStruct, profName, prof);
        return;
    }

}

function giveInProf(srcStruct, profName, prof){

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
        socket.emit("requestProficiencyChange",
            getCharIDFromURL(),
            {srcStruct, isSkill : isSkill, isStatement : true},
            { For : profCategory, To : profProperName, Prof : prof });
    } else {
        displayError("Unknown proficiency: \'"+profName+"\'");
        statementComplete();
    }

}