/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function displayFeat(locationID, feat){
  $('#'+locationID).html('<div class="" style=""><div class="">'+processText('(feat: '+feat.Feat.name+')', false)+'</div><div id="'+locationID+'Code" class="pt-1"></div></div>');
}


function displaySpell(locationID, spell){
  $('#'+locationID).html('<div class="">'+processText('(feat: '+spell.Spell.name+')', false)+'</div>');
}