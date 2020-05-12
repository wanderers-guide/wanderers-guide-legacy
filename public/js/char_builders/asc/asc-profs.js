
//--------------------- Processing Lore --------------------//
function processingProf(ascStatement, srcID, locationID, statementNum){

    if(ascStatement.includes("GIVE-PROF-INCREASE-IN")){// GIVE-PROF-INCREASE-IN=Arcana
        let profName = ascStatement.split('=')[1];
        giveProfIncrease(srcID, profName, statementNum);
    } else if(ascStatement.includes("GIVE-PROF-IN")){// GIVE-PROF-IN=Arcana:T
        let data = ascStatement.split('=')[1];
        let segments = data.split(':');
        giveProf(srcID, segments[0], segments[1], statementNum);
    } else {
        displayError("Unknown statement (2): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Prof ///////////////////////////////////

function giveProfIncrease(srcID, profName, statementNum){
    giveInProf(srcID, profName, 'Up', statementNum);
}

function giveProf(srcID, profName, prof, statementNum){
    giveInProf(srcID, profName, prof, statementNum);
}

function giveInProf(srcID, profName, prof, statementNum){

    let defenseProfNames = ['Light_Armor','Medium_Armor','Heavy_Armor','Unarmored_Defense'];
    let attackProfNames = ['Simple_Weapons','Martial_Weapons','Advanced_Weapons','Unarmed_Attacks'];
    let saveProfNames = ['Fortitude','Reflex','Will'];
    let perceptionProfNames = ['Perception'];
    let spellAttackProfNames = ['ArcaneSpellAttacks','OccultSpellAttacks','PrimalSpellAttacks','DivineSpellAttacks'];
    let spellDCsProfNames = ['ArcaneSpellDCs','OccultSpellDCs','PrimalSpellDCs','DivineSpellDCs'];

    let isSkill = false;
    let profCategory = null;
    if(defenseProfNames.includes(profName)){
        profCategory = 'Defense';
    } else if(attackProfNames.includes(profName)){
        profCategory = 'Attack';
    } else if(saveProfNames.includes(profName)){
        profCategory = 'Save';
    } else if(perceptionProfNames.includes(profName)){
        profCategory = 'Perception';
    } else if(spellAttackProfNames.includes(profName)){
        profCategory = 'SpellAttack';
    } else if(spellDCsProfNames.includes(profName)){
        profCategory = 'SpellDC';
    } else {
        profCategory = 'Skill';
        isSkill = true;
    }

    socket.emit("requestProficiencyChange",
        getCharIDFromURL(),
        {srcID : srcID+statementNum, isSkill : isSkill, isStatement : true},
        [{ For : profCategory, To : profName, Prof : prof }]);

}