/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

//--------------------- Processing Physical Features --------------------//
function processingPhysicalFeatures(wscStatement, srcStruct, locationID, extraData){
    
    if(wscStatement.includes("GIVE-PHYSICAL-FEATURE-NAME")){ // GIVE-PHYSICAL-FEATURE-NAME=Tusks
        let phyFeatName = wscStatement.split('=')[1];
        givePhysicalFeature(srcStruct, phyFeatName);
    } else {
        displayError("Unknown statement (2-PhyFeat): \'"+wscStatement+"\'");
        statementComplete('PhyFeat - Unknown Statement');
    }

}

//////////////////////////////// Give Physical Feature ///////////////////////////////////

function givePhysicalFeature(srcStruct, phyFeatName){

  let phyFeat = g_allPhyFeats.find(phyFeat => {
    return phyFeat.name == phyFeatName;
  });
  if(phyFeat != null){
    setDataOnly(DATA_SOURCE.PHYSICAL_FEATURE, srcStruct, phyFeat.id);
  }

  if(g_char_id != null){
    socket.emit("requestPhysicalFeaturesChangeByName",
        g_char_id,
        srcStruct,
        phyFeatName);
  } else {
    saveBuildMetaData();
  }

  statementComplete('PhyFeat - Add By Name');

}
