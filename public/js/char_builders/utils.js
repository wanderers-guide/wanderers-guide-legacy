/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function getCharIDFromURL(){
    let spl1 = window.location.pathname.split("builder/");
    let spl2 = spl1[1].split("/page");

    return spl2[0];
}

function getAllAbilityTypes() {
  return ['Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma'];
}

function getMod(abilScore) {
  let mod = Math.floor((abilScore-10)/2);
  return mod;
}

/* Duplicate Checking */
function hasDuplicateSelected(selectOptions) {
  let optionValArray = [];
  $(selectOptions).each(function() {
      if($(this).val() != "chooseDefault"){
          optionValArray.push($(this).val());
      }
  });
  return (new Set(optionValArray)).size !== optionValArray.length;
}

function hasDuplicateFeat(featArray, featID){
  for(const feat of featArray){
    if(feat.value != null && feat.value.id == featID) {
      return true;
    }
  }
  return false;
}

function hasDuplicateLang(langArray, langID){
  for(const lang of langArray){
    if(lang.value.id == langID) {
      return true;
    }
  }
  return false;
}

// WSC statement maximum: 26
function charIncrease(char){
  switch(char) {
    case 'a': return 'b';
    case 'b': return 'c';
    case 'c': return 'd';
    case 'd': return 'e';
    case 'e': return 'f';
    case 'f': return 'g';
    case 'g': return 'h';
    case 'h': return 'i';
    case 'i': return 'j';
    case 'j': return 'k';
    case 'k': return 'l';
    case 'l': return 'm';
    case 'm': return 'n';
    case 'n': return 'o';
    case 'o': return 'p';
    case 'p': return 'q';
    case 'q': return 'r';
    case 'r': return 's';
    case 's': return 't';
    case 't': return 'u';
    case 'u': return 'v';
    case 'v': return 'w';
    case 'w': return 'x';
    case 'x': return 'y';
    case 'y': return 'z';
    case 'z': return null;
    default: return null;
  }
}