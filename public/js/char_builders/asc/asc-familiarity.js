
//--------------------- Processing Familiarities --------------------//
function processingFamiliarities(ascStatement, srcStruct, locationID){
    
    if(ascStatement.includes("GIVE-WEAPON-FAMILIARITY")){ // GIVE-WEAPON-FAMILIARITY=Goblin
        let trait = ascStatement.split('=')[1];
        giveWeaponFamiliarity(srcStruct, trait);
    } else {
        displayError("Unknown statement (2-Familiarity): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Weapon Familiarity ///////////////////////////////////

function giveWeaponFamiliarity(srcStruct, trait){

    socket.emit("requestWeaponFamiliarityChange",
        getCharIDFromURL(),
        srcStruct,
        trait);

}

socket.on("returnWeaponFamiliarityChange", function(){
    statementComplete();
});