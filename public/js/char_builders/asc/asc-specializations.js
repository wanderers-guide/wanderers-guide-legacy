
//--------------------- Processing Specializations --------------------//
function processingSpecializations(ascStatement, srcStruct, locationID){
    
    if(ascStatement.includes("GIVE-WEAPON-SPECIALIZATION")){ // GIVE-WEAPON-SPECIALIZATION
        giveWeaponSpecialization(srcStruct, 1);
    } else if(ascStatement.includes("GIVE-GREATER-WEAPON-SPECIALIZATION")){ // GIVE-GREATER-WEAPON-SPECIALIZATION
        giveWeaponSpecialization(srcStruct, 2);
    } else if(ascStatement.includes("GIVE-WEAPON-CRITICAL-SPECIALIZATION")){ // GIVE-WEAPON-CRITICAL-SPECIALIZATION=
        let weapName = ascStatement.split('=')[1];
        giveWeaponCriticalSpecialization(srcStruct, weapName);
    } else if(ascStatement.includes("GIVE-ARMOR-SPECIALIZATION")){ // GIVE-ARMOR-SPECIALIZATION=
        let armorName = ascStatement.split('=')[1];
        giveArmorSpecialization(srcStruct, armorName);
    } else {
        displayError("Unknown statement (2-Specialization): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Weapon Specialization ///////////////////////////////////
// GIVE-WEAPON-SPECIALIZATION
// GIVE-GREATER-WEAPON-SPECIALIZATION

function giveWeaponSpecialization(srcStruct, type){

    socket.emit("requestWeaponSpecializationChange",
        getCharIDFromURL(),
        srcStruct,
        type);

}

socket.on("returnWeaponSpecializationChange", function(){
    statementComplete();
});

//////////////////////////////// Give Armor Specialization ///////////////////////////////////
// GIVE-ARMOR-SPECIALIZATION=TRAIT~Dwarf
// GIVE-ARMOR-SPECIALIZATION=ARMOR~Leather
// GIVE-ARMOR-SPECIALIZATION=Light_Armor

function giveArmorSpecialization(srcStruct, armorName){

    socket.emit("requestArmorSpecializationChange",
        getCharIDFromURL(),
        srcStruct,
        armorName);

}

socket.on("returnArmorSpecializationChange", function(){
    statementComplete();
});

//////////////////////////////// Give Critical Specialization ///////////////////////////////////
// GIVE-WEAPON-CRITICAL-SPECIALIZATION=TRAIT~Dwarf
// GIVE-WEAPON-CRITICAL-SPECIALIZATION=WEAPON~Spear
// GIVE-WEAPON-CRITICAL-SPECIALIZATION=GROUP~Polearm
// GIVE-WEAPON-CRITICAL-SPECIALIZATION=Simple_Weapons


function giveWeaponCriticalSpecialization(srcStruct, weapName){

    socket.emit("requestWeaponCriticalSpecializationChange",
        getCharIDFromURL(),
        srcStruct,
        weapName);

}

socket.on("returnWeaponCriticalSpecializationChange", function(){
    statementComplete();
});