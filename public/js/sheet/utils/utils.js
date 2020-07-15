
function getCharIDFromURL(){
    return window.location.pathname.split("characters/")[1];
}

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
  return str.toLowerCase().replace(/(?:^|\s|["([{])+\S/g, match => match.toUpperCase());
}
  
function signNumber(number) {
    return number < 0 ? `${number}` : `+${number}`;
}
  
function getMod(abilScore) {
    let mod = Math.floor((abilScore-10)/2);
    return mod;
}

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.floor(value * multiplier) / multiplier;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

function doesntHaveItemHealth(invItem){
  return (invItem.hitPoints == 0);
}

function rankLevel(level){
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
  
function getProfLetterFromNumUps(numUps) {
    switch(numUps) {
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
            return null;
    }
}

function getProfNameFromNumUps(numUps) {
    switch(numUps) {
        case 0:
            return "Untrained";
        case 1:
            return "Trained";
        case 2:
            return "Expert";
        case 3:
            return "Master";
        case 4:
            return "Legendary";
        default:
            return null;
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


function getBulkFromNumber(bulkNumber){
  switch(bulkNumber) {
    case 0:
        return "-";
    case 0.1:
        return "L";
    default:
        return ""+bulkNumber;
  }
}

function getHandsToString(hands){
  switch(hands) {
    case "NONE":
        return "-";
    case "ONE":
        return "1";
    case "ONE_PLUS":
      return "1+";
    case "TWO":
      return "2";
    default:
        return hands;
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

///////

function getCoinToString(price) {

  if(price == 0){return "-";}

  let priceObj = {Value: price};
  let cStr = ""; let sStr = ""; let gStr = ""; let pStr = "";

  if(price == 10){
    sStr = processSilver(priceObj);
  } else if(price == 100){
    gStr = processGold(priceObj);
  } else if(price == 1000){
    pStr = processPlatinum(priceObj);
  } else {
    if(price < 100) { // 99 or less
      cStr = processCopper(priceObj);
    } else if(100 <= price && price < 1000) { // 100 thru 999
      sStr = processSilver(priceObj);
      cStr = processCopper(priceObj);
    } else if(1000 <= price && price < 999999) { // 1000 thru 999,999
      gStr = processGold(priceObj);
      sStr = processSilver(priceObj);
      cStr = processCopper(priceObj);
    } else { // 1,000,000 or greater
      pStr = processPlatinum(priceObj);
      gStr = processGold(priceObj);
      sStr = processSilver(priceObj);
      cStr = processCopper(priceObj);
    }
  }

  let str = numberWithCommas(pStr);
  if(str != "" && gStr != ""){str += ", ";}
  str += numberWithCommas(gStr);
  if(str != "" && sStr != ""){str += ", ";}
  str += sStr;
  if(str != "" && cStr != ""){str += ", ";}
  str += cStr;

  return str;

}

function processCopper(priceObj) {
  if(priceObj.Value == 0){return "";}
  let copperCount = Math.floor(priceObj.Value / 1);
  priceObj.Value -= copperCount;
  return copperCount+" cp";
}

function processSilver(priceObj) {
  if(priceObj.Value == 0){return "";}
  let silverCount = Math.floor(priceObj.Value / 10);
  priceObj.Value -= silverCount*10;
  return silverCount+" sp";
}

function processGold(priceObj) {
  if(priceObj.Value == 0){return "";}
  let goldCount = Math.floor(priceObj.Value / 100);
  priceObj.Value -= goldCount*100;
  return goldCount+" gp";
}

function processPlatinum(priceObj) {
  if(priceObj.Value == 0){return "";}
  let platinumCount = Math.floor(priceObj.Value / 1000);
  priceObj.Value -= platinumCount*1000;
  return platinumCount+" pp";
}

////////

function getConvertedBulkForSize(size, bulk){
  switch(size) {
    case "TINY":
      if(bulk == 0) {
        bulk = 0;
      } else if(bulk <= 0.1){
        bulk = 0;
      } else {
        bulk = bulk/2;
        if(bulk < 1){
          bulk = 0.1;
        }
      }
      return bulk;
    case "SMALL":
      return bulk;
    case "MEDIUM":
      return bulk;
    case "LARGE":
      if(bulk == 0) {
        bulk = 0.1;
      } else if(bulk <= 0.1){
        bulk = 1;
      } else {
        bulk = bulk*2;
      }
      return bulk;
    case "HUGE":
      if(bulk == 0) {
        bulk = 1;
      } else if(bulk <= 0.1){
        bulk = 2;
      } else {
        bulk = bulk*4;
      }
      return bulk;
    case "GARGANTUAN":
      if(bulk == 0) {
        bulk = 2;
      } else if(bulk <= 0.1){
        bulk = 4;
      } else {
        bulk = bulk*8;
      }
      return bulk;
    default:
      return bulk;
  }
}

function getConvertedPriceForSize(size, price){
  switch(size) {
    case "TINY":
      return price;
    case "SMALL":
      return price;
    case "MEDIUM":
      return price;
    case "LARGE":
      return price*2;
    case "HUGE":
      return price*4;
    case "GARGANTUAN":
      return price*8;
    default:
      return price;
  }
}