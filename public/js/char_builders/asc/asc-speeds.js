
//--------------------- Processing Speeds --------------------//
function processingSpeeds(ascStatement, srcStruct, locationID){
    
    if(ascStatement.includes("GIVE-SPEED")){ // GIVE-SPEED=Swim:15
        let data = ascStatement.split('=')[1]; // GIVE-SPEED=Swim:LAND_SPEED
        let segments = data.split(':');
        giveSpeed(srcStruct, segments[0], segments[1]);
    } else {
        displayError("Unknown statement (2-Speed): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Speed ///////////////////////////////////

function giveSpeed(srcStruct, speedType, speedAmt){

    socket.emit("requestSpeedChange",
        getCharIDFromURL(),
        srcStruct,
        speedType,
        speedAmt);

}

socket.on("returnSpeedChange", function(){
    statementComplete();
});