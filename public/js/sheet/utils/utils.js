/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function getCharIDFromURL(){
    return window.location.pathname.split("characters/")[1];
}
  
function getMod(abilScore) {
    let mod = Math.floor((abilScore-10)/2);
    return mod;
}

function getBulmaTextColorFromCurrentHP(currentHP, maxHP) {
  if(currentHP >= maxHP*0.8){
    return "has-text-success";
  } else if(currentHP >= maxHP*0.5){
    return "has-text-warning";
  } else {
    return "has-text-danger";
  }
}


function getProfNumber(numUps, charLevel) {
    if(gOption_hasProfWithoutLevel){
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

function dieTypeToNum(dieType){
  switch(dieType) {
    case '':
      return 1;
    case 'd2':
      return 2;
    case 'd4':
      return 4;
    case 'd6':
      return 6;
    case 'd8':
      return 8;
    case 'd10':
      return 10;
    case 'd12':
      return 12;
    case 'd20':
      return 20;
    default:
      return 0;
  }
}

function getHeightenedTextFromCodeName(codeName){
  switch(codeName) {
    case "PLUS_ONE": return "+1";
    case "PLUS_TWO": return "+2";
    case "PLUS_THREE": return "+3";
    case "PLUS_FOUR": return "+4";
    case "LEVEL_2": return "2nd";
    case "LEVEL_3": return "3rd";
    case "LEVEL_4": return "4th";
    case "LEVEL_5": return "5th";
    case "LEVEL_6": return "6th";
    case "LEVEL_7": return "7th";
    case "LEVEL_8": return "8th";
    case "LEVEL_9": return "9th";
    case "LEVEL_10": return "10th";
    case "CUSTOM": return "CUSTOM";
    default: return codeName;
  }
}

function getHeightenedCount(spellLevel, spellHeightenLevel, heightenName){
  if(spellLevel === 0){ spellLevel = 1; } // Cantrips are treated as 1st level
  switch(heightenName) {
    case "PLUS_ONE": return Math.floor(spellHeightenLevel-spellLevel);
    case "PLUS_TWO": return Math.floor((spellHeightenLevel-spellLevel)/2);
    case "PLUS_THREE": return Math.floor((spellHeightenLevel-spellLevel)/3);
    case "PLUS_FOUR": return Math.floor((spellHeightenLevel-spellLevel)/4);
    case "LEVEL_2": return (spellHeightenLevel >= 2) ? 1 : 0;
    case "LEVEL_3": return (spellHeightenLevel >= 3) ? 1 : 0;
    case "LEVEL_4": return (spellHeightenLevel >= 4) ? 1 : 0;
    case "LEVEL_5": return (spellHeightenLevel >= 5) ? 1 : 0;
    case "LEVEL_6": return (spellHeightenLevel >= 6) ? 1 : 0;
    case "LEVEL_7": return (spellHeightenLevel >= 7) ? 1 : 0;
    case "LEVEL_8": return (spellHeightenLevel >= 8) ? 1 : 0;
    case "LEVEL_9": return (spellHeightenLevel >= 9) ? 1 : 0;
    case "LEVEL_10": return (spellHeightenLevel >= 10) ? 1 : 0;
    case "CUSTOM": return 1;
    default: return 0;
  }
}
