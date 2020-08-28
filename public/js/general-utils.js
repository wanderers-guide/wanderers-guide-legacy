/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

/* Object Funcs */
function objToMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

function cloneObj(obj){
  return JSON.parse(JSON.stringify(obj));
}

function hasSameSrc(dataStruct, srcStruct){
  return (dataStruct.sourceType == srcStruct.sourceType && dataStruct.sourceLevel == srcStruct.sourceLevel && dataStruct.sourceCode == srcStruct.sourceCode && dataStruct.sourceCodeSNum == srcStruct.sourceCodeSNum);
}

/* Capitalizing */
function capitalizeWord(word){
  if(word == null){ return null;}
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function capitalizeFirstLetterOfWord(word){
  if(word == null){ return null;}
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function capitalizeWords(str){
  if(str == null){ return null;}
  return str.toLowerCase().replace(/(?:^|\s|["([{_-])+\S/g, match => match.toUpperCase());
}

/* Ability Conversions */
function shortenAbilityType(longType) {
  switch(longType) {
    case 'Strength': return "STR";
    case 'Dexterity': return "DEX";
    case 'Constitution': return "CON";
    case 'Intelligence': return "INT";
    case 'Wisdom': return "WIS";
    case 'Charisma': return "CHA";
    default: return null;
  }
}

function lengthenAbilityType(shortType) {
  switch(shortType) {
    case 'STR': return "Strength";
    case 'DEX': return "Dexterity";
    case 'CON': return "Constitution";
    case 'INT': return "Intelligence";
    case 'WIS': return "Wisdom";
    case 'CHA': return "Charisma";
    default: return null;
  }
}

/* Prof Conversions */
function profToNumUp(prof){
  switch(prof) {
    case "U": return 0;
    case "T": return 1;
    case "E": return 2;
    case "M": return 3;
    case "L": return 4;
    case "UP": return 10;
    default: return -1;
  }
}
  
function getProfLetterFromNumUps(numUps) {
  switch(numUps) {
    case 0: return "U";
    case 1: return "T";
    case 2: return "E";
    case 3: return "M";
    case 4: return "L";
    default: return "?";
  }
}

function getProfNameFromNumUps(numUps) {
  switch(numUps) {
    case 0: return "Untrained";
    case 1: return "Trained";
    case 2: return "Expert";
    case 3: return "Master";
    case 4: return "Legendary";
    default: return "Unknown";
  }
}

function profToWord(prof){
  if(prof != null) {prof = prof.toUpperCase();}
  switch(prof) {
    case "UNTRAINED": return "Untrained";
    case "U": return "Untrained";
    case "TRAINED": return "Trained";
    case "T": return "Trained";
    case "EXPERT": return "Expert";
    case "E": return "Expert";
    case "MASTER": return "Master";
    case "M": return "Master";
    case "LEGENDARY": return "Legendary";
    case "L": return "Legendary";
    default: return "Unknown";
  }
}

function profToLetter(prof){
  if(prof != null) {prof = prof.toUpperCase();}
  switch(prof) {
    case "UNTRAINED": return "U";
    case "TRAINED": return "T";
    case "EXPERT": return "E";
    case "MASTER": return "M";
    case "LEGENDARY": return "L";
    default: return "?";
  }
}

/* Misc */
function hashCode(str) {
  return str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

function signNumber(number) {
  return number < 0 ? `${number}` : `+${number}`;
}

function rankLevel(level){
  switch(level) {
    case 1: return "1st";
    case 2: return "2nd";
    case 3: return "3rd";
    default: return level+"th";
  }
}

function selectOptionRarity(rarity){
  switch(rarity) {
    case 'UNCOMMON': return 'is-uncommon';
    case 'RARE': return 'is-rare';
    case 'UNIQUE': return 'is-unique';
    default: return '';
  }
}

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.floor(value * multiplier) / multiplier;
}

function isSheetPage(){
  return typeof isSheetInit !== 'undefined';
}

function isBuilderPage(){
  return typeof isBuilderInit !== 'undefined';
}