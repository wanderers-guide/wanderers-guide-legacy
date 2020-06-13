
//--------------------- Processing Senses --------------------//
function processingSenses(ascStatement, srcStruct, locationID){
    
    if(ascStatement.includes("GIVE-SENSE-NAME")){ // GIVE-SENSE-NAME=Darkvision
        let senseName = ascStatement.split('=')[1];
        giveSense(srcStruct, senseName);
    } else {
        displayError("Unknown statement (2-Sense): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Sense ///////////////////////////////////

function giveSense(srcStruct, senseName){

    socket.emit("requestSensesChangeByName",
        getCharIDFromURL(),
        srcStruct,
        senseName);

}

socket.on("returnSensesChangeByName", function(){
    statementComplete();
});