
//--------------------- Processing Physical Features --------------------//
function processingPhysicalFeatures(ascStatement, srcStruct, locationID){
    
    if(ascStatement.includes("GIVE-PHYSICAL-FEATURE-NAME")){ // GIVE-PHYSICAL-FEATURE-NAME=Tusks
        let phyFeatName = ascStatement.split('=')[1];
        givePhysicalFeature(srcStruct, phyFeatName);
    } else {
        displayError("Unknown statement (2-PhyFeat): \'"+ascStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Give Physical Feature ///////////////////////////////////

function givePhysicalFeature(srcStruct, phyFeatName){

    socket.emit("requestPhysicalFeaturesChangeByName",
        getCharIDFromURL(),
        srcStruct,
        phyFeatName);

}

socket.on("returnPhysicalFeaturesChangeByName", function(){
    statementComplete();
});