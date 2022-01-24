/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

//--------------------- Processing Senses --------------------//
function processingSenses(wscStatement, srcStruct, locationID, extraData){
    
    if(wscStatement.includes("GIVE-SENSE-NAME")){ // GIVE-SENSE-NAME=Darkvision
        let senseName = wscStatement.split('=')[1];
        giveSense(srcStruct, senseName);
    } else {
        displayError("Unknown statement (2-Sense): \'"+wscStatement+"\'");
        statementComplete('Sense - Unknown Statement');
    }

}

//////////////////////////////// Give Sense ///////////////////////////////////

function giveSense(srcStruct, senseName){
  if(senseName.trim() == ''){ return; }

  let sense = g_allSenses.find(sense => {
    return sense.name == senseName;
  });
  if(sense != null){
    setData(DATA_SOURCE.SENSE, srcStruct, sense.id);
  }

  if(g_char_id != null){
    socket.emit("requestSensesChangeByName",
        g_char_id,
        srcStruct,
        senseName);
  } else {
    saveBuildMetaData();
  }

}

socket.on("returnSensesChangeByName", function(){
  statementComplete('Sense - Add By Name');
});