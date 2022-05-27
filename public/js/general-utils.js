/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

/* Constants */
const g_tagStringLengthMax = 620; // Hardcoded - Tag String Length Max
const g_conditionStringLengthMax = 450; // Hardcoded - Condition String Length Max

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
  if(obj == null){ return null; }
  return JSON.parse(JSON.stringify(obj));
}

function hasSameSrc(dataStruct, srcStruct){
  if(dataStruct == null || srcStruct == null) { return false; }
  return (dataStruct.sourceType == srcStruct.sourceType && dataStruct.sourceLevel == srcStruct.sourceLevel && dataStruct.sourceCode == srcStruct.sourceCode && dataStruct.sourceCodeSNum == srcStruct.sourceCodeSNum);
}

function hasSameSrcIterate(dataStruct, srcStructArray){
  if(srcStructArray == null) { return false; }
  for(let srcStruct of srcStructArray){
    if(hasSameSrc(dataStruct, srcStruct)){ return true; }
  }
  return false;
}

function hasSameSrcAnySNum(dataStruct, srcStruct){
  if(dataStruct == null || srcStruct == null) { return false; }
  return (dataStruct.sourceType == srcStruct.sourceType && dataStruct.sourceLevel == srcStruct.sourceLevel && dataStruct.sourceCode == srcStruct.sourceCode);
}

function srcStructToCompositeKey(srcStruct){
  return `${srcStruct.sourceType}:::${srcStruct.sourceLevel}:::${srcStruct.sourceCode}:::${srcStruct.sourceCodeSNum}`;
}

function parameterizeSrcStruct(in_source, in_srcStruct){
  return {
    source: in_source+'',
    sourceType: in_srcStruct.sourceType+'',
    sourceLevel: in_srcStruct.sourceLevel+'',
    sourceCode: in_srcStruct.sourceCode+'',
    sourceCodeSNum: in_srcStruct.sourceCodeSNum+'',
  };
}

/* Content Sources */

const g_contentSources = [
  {TextName: 'Core Rulebook', CodeName: 'CRB', Link: 'https://paizo.com/products/btq01zp3?Pathfinder-Core-Rulebook'},
  {TextName: 'Advanced Player’s Guide', CodeName: 'ADV-PLAYER-GUIDE', Link: 'https://paizo.com/products/btq023ih?Pathfinder-Advanced-Players-Guide'},
  {TextName: 'Gamemastery Guide', CodeName: 'GM-GUIDE', Link: 'https://paizo.com/products/btq022c1?Pathfinder-Gamemastery-Guide'},
  {TextName: 'Secrets of Magic', CodeName: 'SECRETS-OF-MAGIC', Link: 'https://paizo.com/products/btq026l5?Pathfinder-Secrets-of-Magic'},
  {TextName: 'Guns & Gears', CodeName: 'GUNS-AND-GEARS', Link: 'https://paizo.com/products/btq026mw?Pathfinder-Guns-Gears'},
  {TextName: 'Dark Archive', CodeName: 'DARK-ARCHIVE', Link: 'https://downloads.paizo.com/PZO2111+Dark+Archive+Class+Playtest.pdf'},
  {TextName: 'Book of the Dead', CodeName: 'BOOK-OF-DEAD', Link: 'https://paizo.com/products/btq02c0j'},
  {TextName: 'Lost Omens: Ancestry Guide', CodeName: 'LOST-ANCESTRY-GUIDE', Link: 'https://paizo.com/products/btq026k5?Pathfinder-Lost-Omens-Ancestry-Guide' },
  {TextName: 'Lost Omens: Character Guide', CodeName: 'LOST-CHAR-GUIDE', Link: 'https://paizo.com/products/btq01zt4?Pathfinder-Lost-Omens-Character-Guide'},
  {TextName: 'Lost Omens: City of Absalom', CodeName: 'LOST-CITY-ABSALOM', Link: 'https://paizo.com/products/btq02ap2'},
  {TextName: 'Lost Omens: Gods & Magic', CodeName: 'LOST-GOD-MAGIC', Link: 'https://paizo.com/products/btq021wf?Pathfinder-Lost-Omens-Gods-Magic'},
  {TextName: 'Lost Omens: Grand Bazaar', CodeName: 'LOST-GRAND-BAZAAR', Link: 'https://paizo.com/products/btq029xo?Pathfinder-Lost-Omens-The-Grand-Bazaar'},
  {TextName: 'Lost Omens: Knights of Lastwall', CodeName: 'LOST-KNIGHTS-WALL', Link: 'https://paizo.com/products/btq02ajm?Pathfinder-Lost-Omens-Knights-of-Lastwall'},
  {TextName: 'Lost Omens: Legends', CodeName: 'LOST-LEGENDS', Link: 'https://paizo.com/products/btq023gd?Pathfinder-Lost-Omens-Legends'},
  {TextName: 'Lost Omens: Monsters of Myth', CodeName: 'LOST-MONSTERS-MYTH', Link: 'https://paizo.com/products/btq02aoy'},
  {TextName: 'Lost Omens: The Mwangi Expanse', CodeName: 'LOST-MWANGI', Link: 'https://paizo.com/products/btq027ot?Pathfinder-Lost-Omens-The-Mwangi-Expanse'},
  {TextName: 'Lost Omens: Pathfinder Society Guide', CodeName: 'LOST-SOCIETY-GUIDE', Link: 'https://paizo.com/products/btq0233q?Pathfinder-Lost-Omens-Pathfinder-Society-Guide'},
  {TextName: 'Lost Omens: World Guide', CodeName: 'LOST-WORLD-GUIDE', Link: 'https://paizo.com/products/btq01zoj?Pathfinder-Lost-Omens-World-Guide'},
  {TextName: 'Abomination Vaults', CodeName: 'ABOMINATION-VAULTS', Link: 'https://paizo.com/store/pathfinder/adventures/adventurePath/abominationVaults'},
  {TextName: 'Agents of Edgewatch', CodeName: 'AGENTS-OF-EDGEWATCH', Link: 'https://paizo.com/store/pathfinder/adventures/adventurePath/agentsOfEdgewatch'},
  {TextName: 'Age of Ashes', CodeName: 'AGE-OF-ASHES', Link: 'https://paizo.com/store/pathfinder/adventures/adventurePath/ageOfAshes'},
  {TextName: 'Extinction Curse', CodeName: 'EXTINCTION-CURSE', Link: 'https://paizo.com/store/pathfinder/adventures/adventurePath/extinctioncurse'},
  {TextName: 'The Fall of Plaguestone', CodeName: 'FALL-OF-PLAGUE', Link: 'https://paizo.com/products/btq01zoh?Pathfinder-Adventure-The-Fall-of-Plaguestone'},
  {TextName: 'Fists of the Ruby Phoenix', CodeName: 'FIST-PHOENIX', Link: 'https://paizo.com/store/pathfinder/adventures/adventurePath/fistsOfTheRubyPhoenix'},
  {TextName: 'Malevolence', CodeName: 'MALEVOLENCE', Link: 'https://paizo.com/products/btq027qf?Pathfinder-Adventure-Malevolence'},
  {TextName: 'Night of the Gray Death', CodeName: 'NIGHT-GRAY-DEATH', Link: 'https://paizo.com/products/btq02alp?Pathfinder-Adventure-Night-of-the-Gray-Death'},
  {TextName: 'Outlaws of Alkenstar', CodeName: 'OUTLAWS-ALKENSTAR', Link: 'https://paizo.com/store/pathfinder/adventures/adventurePath/outlawsOfAlkenstar'},
  {TextName: 'Quest for the Frozen Flame', CodeName: 'QUEST-FROZEN-FLAME', Link: 'https://paizo.com/store/pathfinder/adventures/adventurePath/questForTheFrozenFlame'},
  {TextName: 'The Slithering', CodeName: 'SLITHERING', Link: 'https://paizo.com/products/btq023hg?Pathfinder-Adventure-The-Slithering'},
  {TextName: 'Strength of Thousands', CodeName: 'STRENGTH-THOUSANDS', Link: 'https://paizo.com/store/pathfinder/adventures/adventurePath/strengthOfThousands'},
  {TextName: 'Threshold of Knowledge', CodeName: 'THRESHOLD-KNOWLEDGE', Link: 'https://paizo.com/products/btq02apx?Pathfinder-Adventure-Threshold-of-Knowledge'},
  {TextName: 'Troubles in Otari', CodeName: 'TROUBLES-IN-OTARI', Link: 'https://paizo.com/products/btq026k1?Pathfinder-Adventure-Troubles-in-Otari'},
  {TextName: 'Bestiary', CodeName: 'BEST-1', Link: 'https://paizo.com/products/btq01zp4?Pathfinder-Bestiary'},
  {TextName: 'Bestiary 2', CodeName: 'BEST-2', Link: 'https://paizo.com/products/btq022yq?Pathfinder-Bestiary-2'},
  {TextName: 'Bestiary 3', CodeName: 'BEST-3', Link: 'https://paizo.com/products/btq027mn?Pathfinder-Bestiary-3'},
  {TextName: 'Pathfinder Society', CodeName: 'PATH-SOCIETY', Link: 'https://paizo.com/pathfindersociety'},
];

const g_currentContentSource = 'LOST-KNIGHTS-WALL';
const g_hiddenFromBrowseContentSources = ['LOST-KNIGHTS-WALL'];// TODO - Temp solution

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

function isContentSourceReleased(codeName){
  let contentSourceData = g_contentSources.find(contentSourceData => {
    return contentSourceData.CodeName === codeName;
  });
  if(contentSourceData != null){
    return (contentSourceData.Unreleased == null) ? true : !contentSourceData.Unreleased;
  } else {
    return false;
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
    case 'Anything': return "ALL";
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
function profToNumUp(prof, noUP=false){
  if(noUP) { if(prof == 'UP') { prof = ''; } }
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

function getBonusFromProfName(profName) {
  switch(profName) {
    case 'Untrained': return 0;
    case 'Trained': return 2;
    case 'Expert': return 4;
    case 'Master': return 6;
    case 'Legendary': return 8;
    default: return -1;
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
    case "UP": return "Increase";
    case "DOWN": return "Decrease";
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

function getBetterProf(prof1, prof2){
  let profNumber1 = profToNumUp(prof1, true);
  let profNumber2 = profToNumUp(prof2, true);
  return (profNumber1 > profNumber2) ? prof1 : prof2;
}

function getUpAmt(profType){
  if(profType == "UP"){
      return 1;
  }
  if(profType == "DOWN"){
      return -1;
  }
  return 0;
}

function getProfNumber(numUps, charLevel) {
  if(typeof gOption_hasProfWithoutLevel !== 'undefined' && gOption_hasProfWithoutLevel){
    switch(numUps) {
      case 0:
          return -2;
      case 1:
          return 2;
      case 2:
          return 4;
      case 3:
          return 6;
      case 4:
          return 8;
      default:
          return 0;
    }
  } else {
    switch(numUps) {
      case 0:
          return 0;
      case 1:
          return charLevel+2;
      case 2:
          return charLevel+4;
      case 3:
          return charLevel+6;
      case 4:
          return charLevel+8;
      default:
          return 0;
    }
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

function convertRarityToHTML(rarityType, uniqueIsSpecial = false, size='is-very-small'){
  switch(rarityType) {
    case 'UNCOMMON': return '<button style="z-index: 5;" class="button is-pulled-right is-paddingless px-2 is-marginless mr-3 mb-1 '+size+' is-uncommon">Uncommon</button>';
    case 'RARE': return '<button style="z-index: 5;" class="button is-pulled-right is-paddingless px-2 is-marginless mr-3 mb-1 '+size+' is-rare">Rare</button>';
    case 'UNIQUE': let uniqueText = (uniqueIsSpecial) ? 'Special' : 'Unique'; return '<button style="z-index: 5;" class="button is-pulled-right is-paddingless px-2 is-marginless mr-3 mb-1 '+size+' is-unique">'+uniqueText+'</button>';
    default: return '';
  }
}

function convertRarityToIconHTML(rarityType, uniqueIsSpecial = false, size='is-size-7-5'){
  switch(rarityType) { //
    case 'UNCOMMON': return '<span style="z-index: 5;" class="'+size+' px-1 py-1 pos-absolute pos-l-0 pos-t-2 is-bold is-uncommon">U</span>';
    case 'RARE': return '<span style="z-index: 5;" class="'+size+' px-1 py-1 pos-absolute pos-l-0 pos-t-2 is-bold is-rare">R</span>';
    case 'UNIQUE': let uniqueTextLetter = (uniqueIsSpecial) ? 'S' : 'U'; return '<span style="z-index: 5;" class="'+size+' px-1 py-1 pos-absolute pos-l-0 pos-t-2 is-bold is-unique">'+uniqueTextLetter+'</span>';
    default: return '<span style="z-index: 5;" class="'+size+' px-1 py-1 pos-absolute pos-l-0 pos-t-2 is-bold"> </span>';
  }
}

function getImportantTraitIcon(trait){
  if(trait.isImportant == 1){
    return `<sup style="position: absolute; top: 1px; right: 1px;"><i class="fad fa-exclamation-circle"></i></sup>`;
  } else {
    return ``;
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

function numToRepetitionWord(num){
  switch(num) {
    case 1: return "";
    case 2: return "Twice";
    case 3: return "Three Times";
    case 4: return "Four Times";
    case 5: return "Five Times";
    default: return num+" Times";
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

function getMod(abilScore) {
  let mod = Math.floor((abilScore-10)/2);
  return mod;
}

function round(value, precision) {
  let multiplier = Math.pow(10, precision || 0);
  return Math.floor(value * multiplier) / multiplier;
}

function isOverflown(jQueryElement){
  let element = jQueryElement[0];
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}
function hasGreaterHeight(jQueryElement, pixelHeight){
  let element = jQueryElement[0];
  return element.clientHeight > pixelHeight;
}
function hasGreaterWidth(jQueryElement, pixelWidth){
  let element = jQueryElement[0];
  return element.clientWidth > pixelWidth;
}

function isMobileView(){
  return window.matchMedia("screen and (max-width: 768px)").matches;
}
function isTabletView(){
  return window.matchMedia("screen and (min-width : 769px) and (max-width : 1023px)").matches;
}

function isSheetPage(){
  return typeof isSheetInit !== 'undefined';
}

function isBuilderPage(){
  return typeof isBuilderInit !== 'undefined';
}