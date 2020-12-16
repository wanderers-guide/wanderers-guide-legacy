/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

/* Constants */
const g_tagStringLengthMax = 620; // Hardcoded - Tag String Length Max

/* Object Funcs */
function objToMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}
function mapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    // Doesn't escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v;
  }
  return obj;
}

function cloneObj(obj){
  return JSON.parse(JSON.stringify(obj));
}

function hasSameSrc(dataStruct, srcStruct){
  return (dataStruct.sourceType == srcStruct.sourceType && dataStruct.sourceLevel == srcStruct.sourceLevel && dataStruct.sourceCode == srcStruct.sourceCode && dataStruct.sourceCodeSNum == srcStruct.sourceCodeSNum);
}

/* Content Sources */

const g_contentSources = [
  {TextName: 'Core Rulebook', CodeName: 'CRB', Link: 'https://paizo.com/products/btq01zp3?Pathfinder-Core-Rulebook'},
  {TextName: 'Advanced Player’s Guide', CodeName: 'ADV-PLAYER-GUIDE', Link: 'https://paizo.com/products/btq023ih?Pathfinder-Advanced-Players-Guide'},
  {TextName: 'Gamemastery Guide', CodeName: 'GM-GUIDE', Link: 'https://paizo.com/products/btq022c1?Pathfinder-Gamemastery-Guide'},
  {TextName: 'Secrets of Magic', CodeName: 'SECRETS-OF-MAGIC', Link: 'https://paizo.com/community/blog/v5748dyo6shd9'},
  {TextName: 'Lost Omens: Gods & Magic', CodeName: 'LOST-GOD-MAGIC', Link: ''},
  {TextName: 'Lost Omens: Character Guide', CodeName: 'LOST-CHAR-GUIDE', Link: 'https://paizo.com/products/btq01zt4?Pathfinder-Lost-Omens-Character-Guide'},
  {TextName: 'Lost Omens: Legends', CodeName: 'LOST-LEGENDS', Link: 'https://paizo.com/products/btq023gd?Pathfinder-Lost-Omens-Legends'},
  {TextName: 'Lost Omens: Pathfinder Society Guide', CodeName: 'LOST-SOCIETY-GUIDE', Link: 'https://paizo.com/products/btq0233q?Pathfinder-Lost-Omens-Pathfinder-Society-Guide'},
  {TextName: 'Lost Omens: World Guide', CodeName: 'LOST-WORLD-GUIDE', Link: 'https://paizo.com/products/btq01zoj?Pathfinder-Lost-Omens-World-Guide'},
  {TextName: 'Agents of Edgewatch', CodeName: 'AGENTS-OF-EDGEWATCH', Link: 'https://paizo.com/store/pathfinder/adventures/adventurePath/agentsOfEdgewatch'},
  {TextName: 'Age of Ashes', CodeName: 'AGE-OF-ASHES', Link: 'https://paizo.com/store/pathfinder/adventures/adventurePath/ageOfAshes'},
  {TextName: 'Extinction Curse', CodeName: 'EXTINCTION-CURSE', Link: 'https://paizo.com/store/pathfinder/adventures/adventurePath/extinctioncurse'},
  {TextName: 'The Fall of Plaguestone', CodeName: 'FALL-OF-PLAGUE', Link: 'https://paizo.com/products/btq01zoh?Pathfinder-Adventure-The-Fall-of-Plaguestone'},
  {TextName: 'The Slithering', CodeName: 'SLITHERING', Link: 'https://paizo.com/products/btq023hg?Pathfinder-Adventure-The-Slithering'},
  {TextName: 'Troubles in Otari', CodeName: 'TROUBLES-IN-OTARI', Link: 'https://paizo.com/products/btq026k1?Pathfinder-Adventure-Troubles-in-Otari'},
  {TextName: 'Bestiary', CodeName: 'BEST-1', Link: 'https://paizo.com/products/btq01zp4?Pathfinder-Bestiary'},
  {TextName: 'Bestiary 2', CodeName: 'BEST-2', Link: 'https://paizo.com/products/btq022yq?Pathfinder-Bestiary-2'},
  {TextName: 'Pathfinder Society', CodeName: 'PATH-SOCIETY', Link: 'https://paizo.com/pathfindersociety'},
];

const g_currentContentSource = 'CRB';

function getContentSourceTextName(codeName){
  let contentSourceData = g_contentSources.find(contentSourceData => {
    return contentSourceData.CodeName === codeName;
  });
  if(contentSourceData != null){
    return contentSourceData.TextName;
  } else {
    return null;
  }
}

function getContentSourceLink(codeName){
  let contentSourceData = g_contentSources.find(contentSourceData => {
    return contentSourceData.CodeName === codeName;
  });
  if(contentSourceData != null){
    return contentSourceData.Link;
  } else {
    return null;
  }
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
    case 'Free': return "ALL";
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
    case 'ALL': return "Free";
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

/* HTML */
function convertActionToHTML(actionsType){
  switch(actionsType) {
    case 'FREE_ACTION': return '<div class="is-paddingless is-inline is-1 p-1 pt-2 pl-2"><span class="pf-icon is-size-5-5">[free-action]</span></div>';
    case 'REACTION': return '<div class="is-paddingless is-inline is-1 p-1 pt-2 pl-2"><span class="pf-icon is-size-5-5">[reaction]</span></div>';
    case 'ACTION': return '<div class="is-paddingless is-inline is-1 p-1 pt-2 pl-2"><span class="pf-icon is-size-5-5">[one-action]</span></div>';
    case 'TWO_ACTIONS': return '<div class="is-paddingless is-inline is-1 p-1 pt-2 pl-2"><span class="pf-icon is-size-5-5">[two-actions]</span></div>';
    case 'THREE_ACTIONS': return '<div class="is-paddingless is-inline is-1 p-1 pt-2 pl-2"><span class="pf-icon is-size-5-5">[three-actions]</span></div>';
    default: return '';
  }
}

function convertRarityToHTML(rarityType, uniqueIsSpecial = false){
  switch(rarityType) {
    case 'UNCOMMON': return '<button style="z-index: 5;" class="button is-pulled-right is-paddingless px-2 is-marginless mr-3 mb-1 is-very-small is-uncommon">Uncommon</button>';
    case 'RARE': return '<button style="z-index: 5;" class="button is-pulled-right is-paddingless px-2 is-marginless mr-3 mb-1 is-very-small is-rare">Rare</button>';
    case 'UNIQUE': let uniqueText = (uniqueIsSpecial) ? 'Special' : 'Unique'; return '<button style="z-index: 5;" class="button is-pulled-right is-paddingless px-2 is-marginless mr-3 mb-1 is-very-small is-unique">'+uniqueText+'</button>';
    default: return '';
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

function evalString(s) { // Evaluates a string of basic math: '5 + 30 - 25.1 + 11'
  return (s.replace(/\s/g, '').match(/[+\-]?([0-9\.]+)/g) || [])
      .reduce(function(sum, value) {
          return parseFloat(sum) + parseFloat(value);
      });
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
  let multiplier = Math.pow(10, precision || 0);
  return Math.floor(value * multiplier) / multiplier;
}

function isSheetPage(){
  return typeof isSheetInit !== 'undefined';
}

function isBuilderPage(){
  return typeof isBuilderInit !== 'undefined';
}