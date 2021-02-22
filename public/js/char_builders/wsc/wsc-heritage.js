/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

//------------------------- Processing Heritage Effects -------------------------//
function processingHeritageEffects(wscStatement, srcStruct, locationID, sourceName){

  if(wscStatement.includes("GIVE-HERITAGE-EFFECTS-NAME")){ // GIVE-HERITAGE-EFFECTS-NAME=Ancient Elf
      let value = wscStatement.split('=')[1];
      giveHeritageEffectsByName(srcStruct, locationID, value, sourceName);
  } else {
      displayError("Unknown statement (2-HeritageEffects): \'"+wscStatement+"\'");
      statementComplete();
  }

}

function giveHeritageEffectsByName(srcStruct, locationID, heritageName, sourceName) {

  socket.emit("requestAddHeritageEffect",
      getCharIDFromURL(),
      srcStruct,
      heritageName,
      { locationID, sourceName });

}

socket.on("returnAddHeritageEffect", function(srcStruct, heritage, inputPacket){
  if(heritage == null) { statementComplete(); return; }

  let heritageLocationCodeID = inputPacket.locationID+'-heritageCode';

  $('#'+inputPacket.locationID).append('<div class="box lighter my-2"><span class="is-size-4 has-text-weight-semibold">'+heritage.name+'</span><div class="container ability-text-section">'+processText(heritage.description, false, null)+'</div><div id="'+heritageLocationCodeID+'"></div></div>');

  processCode(
    heritage.code,
    srcStruct,
    heritageLocationCodeID,
    inputPacket.sourceName);
  
  statementComplete();

});