/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/


function displaySpell(locationID, spell){
  $('#'+locationID).html('<div class="">'+processText('(feat: '+spell.Spell.name+')', false)+'</div>');
}