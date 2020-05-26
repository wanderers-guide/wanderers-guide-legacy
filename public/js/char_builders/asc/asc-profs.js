
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
        displayError("Unknown statement (2): \'"+ascStatement+"\'");
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

    let isSkill = false;
    let profCategory = null;
    let profProperName = null;
    let profData = g_profConversionMap.get(profName);

    if(profData != null){
        profProperName = profData.Name;
        profCategory = profData.Category;
    } else {
        isSkill = true;
        profProperName = profName;
        profCategory = 'Skill';
    }

    socket.emit("requestProficiencyChange",
        getCharIDFromURL(),
        {srcStruct, isSkill : isSkill, isStatement : true},
        { For : profCategory, To : profProperName, Prof : prof });

}