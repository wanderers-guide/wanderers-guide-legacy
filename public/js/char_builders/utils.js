/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function getCharIDFromURL(){
    let spl1 = window.location.pathname.split("builder/");
    let spl2 = spl1[1].split("/page");

    return spl2[0];
}

function objToMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
}

function hashCode(str) {
  return str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

function cloneObj(obj){
  return JSON.parse(JSON.stringify(obj));
}

function hasSameSrc(dataStruct, srcStruct){
  return (dataStruct.sourceType === srcStruct.sourceType && dataStruct.sourceLevel === srcStruct.sourceLevel && dataStruct.sourceCode === srcStruct.sourceCode && dataStruct.sourceCodeSNum === srcStruct.sourceCodeSNum);
}

function capitalizeWord(word){
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function capitalizeWords(str){
  if(str == null){ return null;}
  return str.toLowerCase().replace(/(?:^|\s|["([{_-])+\S/g, match => match.toUpperCase());
}

function getAllAbilityTypes() {
  return ['Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma'];
}

function signNumber(number) {
  return number < 0 ? `${number}` : `+${number}`;
}

function getMod(abilScore) {
  let mod = Math.floor((abilScore-10)/2);
  return mod;
}

function shortenAbilityType(longType) {
  switch(longType) {
    case 'Strength':
      return "STR";
    case 'Dexterity':
      return "DEX";
    case 'Constitution':
      return "CON";
    case 'Intelligence':
      return "INT";
    case 'Wisdom':
      return "WIS";
    case 'Charisma':
      return "CHA";
    default:
      return null;
  }
}

function lengthenAbilityType(shortType) {
  switch(shortType) {
    case 'STR':
      return "Strength";
    case 'DEX':
      return "Dexterity";
    case 'CON':
      return "Constitution";
    case 'INT':
      return "Intelligence";
    case 'WIS':
      return "Wisdom";
    case 'CHA':
      return "Charisma";
    default:
      return null;
  }
}

function abilityLevelDisplay(level){
  switch(level) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return level+"th";
  }
}

function numUpToProf(numUp){
  switch(numUp) {
    case 0:
      return "U";
    case 1:
      return "T";
    case 2:
      return "E";
    case 3:
      return "M";
    case 4:
      return "L";
    default:
      return "?";
  }
}

function profToNumUp(prof){
  switch(prof) {
    case "U":
      return 0;
    case "T":
      return 1;
    case "E":
      return 2;
    case "M":
      return 3;
    case "L":
      return 4;
    case "UP":
      return 10;
    default:
      return -1;
  }
}

function profToWord(prof){
  switch(prof) {
    case "UNTRAINED":
      return "Untrained";
    case "U":
      return "Untrained";
    case "TRAINED":
      return "Trained";
    case "T":
      return "Trained";
    case "EXPERT":
      return "Expert";
    case "E":
      return "Expert";
    case "MASTER":
        return "Master";
    case "M":
        return "Master";
    case "LEGENDARY":
      return "Legendary";
    case "L":
      return "Legendary";
    default:
      return "Unknown";
  }
}

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