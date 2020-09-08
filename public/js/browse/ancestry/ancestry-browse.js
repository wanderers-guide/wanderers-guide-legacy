/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

  socket.emit("requestBrowseAncestries");

});

socket.on("returnBrowseAncestries", function(ancestriesObject) {
  
  let ancestriesMap = objToMap(ancestriesObject);

  for(const [ancestryID, ancestryData] of ancestriesMap.entries()){
    console.log(ancestryData);

    let name = ancestryData.Ancestry.name;
    let hitPoints = ancestryData.Ancestry.hitPoints;
    let size = capitalizeWords(ancestryData.Ancestry.size);
    let speed = ancestryData.Ancestry.speed+' ft.';
    let rarity = capitalizeWords(ancestryData.Ancestry.rarity);
    let contentSrc = getContentSourceTextName(ancestryData.Ancestry.contentSrc);

    let firstDescriptionSentence = getFirstSentence(ancestryData.Ancestry.description);

    $('#browsingList').append('<div class="columns"><div class="column">'+name+'</div><div class="column">'+hitPoints+'</div><div class="column">'+size+'</div><div class="column">'+speed+'</div><div class="column">'+rarity+'</div><div class="column">'+contentSrc+'</div></div><div><p>'+firstDescriptionSentence+'</p></div>');
  }

});