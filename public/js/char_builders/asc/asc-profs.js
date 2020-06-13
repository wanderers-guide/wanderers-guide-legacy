
//--------------------- Processing Lore --------------------//
function processingProf(ascStatement, srcStruct, locationID){

    if(ascStatement.includes("GIVE-PROF-INCREASE-IN")){// GIVE-PROF-INCREASE-IN=Arcana
        let profName = ascStatement.split('=')[1];
        giveProfIncrease(srcStruct, profName);
    } else if(ascStatement.includes("GIVE-PROF-IN")){// GIVE-PROF-IN=Arcana:T
        let data = ascStatement.split('=')[1];
        let segments = data.split(':');
        giveProf(srcStruct, segments[0], segments[1]);
    } else {
        displayError("Unknown statement (2-Prof): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Prof ///////////////////////////////////

function giveProfIncrease(srcStruct, profName){
    giveInProf(srcStruct, profName, 'UP');
}

function giveProf(srcStruct, profName, prof){
    giveInProf(srcStruct, profName, prof);
}

function giveInProf(srcStruct, profName, prof){

    profName = profName.replace(/_|\s+/g,"");
    let profProperName = null;
    let profCategory = null;

    if(profName.startsWith('LORE~')){
        profName = profName.replace(/LORE\~/g,'');
        profProperName = profName+'_LORE';
        profCategory = 'Skill';
    }

    if(profName.startsWith('WEAPON~')){
        profName = profName.replace(/WEAPON\~/g,'');
        profProperName = profName;
        profCategory = 'Attack';
    }

    if(profName.startsWith('ARMOR~')){
        profName = profName.replace(/ARMOR\~/g,'');
        profProperName = profName;
        profCategory = 'Defense';
    }

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