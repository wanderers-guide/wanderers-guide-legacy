
//------------------------- Processing Resistances ------------------------//
function processingResistances(ascStatement, srcStruct, locationID){

    if(ascStatement.includes("GIVE-RESISTANCE")){// GIVE-RESISTANCE=cold:HALF_LEVEL/LEVEL/3
        let data = ascStatement.split('=')[1];
        let segments = data.split(':');
        giveResistance(srcStruct, segments[0], segments[1]);
    } else if(ascStatement.includes("GIVE-WEAKNESS")){// GIVE-WEAKNESS=cold:HALF_LEVEL/LEVEL/3
        let data = ascStatement.split('=')[1];
        let segments = data.split(':');
        giveVulnerability(srcStruct, segments[0], segments[1]);
    } else {
        displayError("Unknown statement (2-Resist/Weak): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Resistance ///////////////////////////////////
function giveResistance(srcStruct, resistType, resistAmount){
    if(resistAmount === 'HALF_LEVEL' || resistAmount === 'LEVEL' || !isNaN(parseInt(resistAmount))){
        socket.emit("requestResistanceChange",
            getCharIDFromURL(),
            srcStruct,
            resistType,
            resistAmount);
    } else {
        displayError("Invalid Resistance Amount '"+resistAmount+"'!");
        statementComplete();
    }
}

socket.on("returnResistanceChange", function(){
    statementComplete();
});

//////////////////////////////// Give Vulnerability ///////////////////////////////////
function giveVulnerability(srcStruct, vulnerableType, vulnerableAmount){
    if(vulnerableAmount === 'HALF_LEVEL' || vulnerableAmount === 'LEVEL' || !isNaN(parseInt(vulnerableAmount))){
        socket.emit("requestVulnerabilityChange",
            getCharIDFromURL(),
            srcStruct,
            vulnerableType,
            vulnerableAmount);
    } else {
        displayError("Invalid Vulnerability Amount '"+vulnerableAmount+"'!");
        statementComplete();
    }
}

socket.on("returnVulnerabilityChange", function(){
    statementComplete();
});