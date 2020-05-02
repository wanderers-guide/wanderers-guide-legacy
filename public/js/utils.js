
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

function capitalizeWord(word){
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
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
    case "Up":
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
      if(!($(this).is(":hidden")) && $(this).val() != "chooseDefault"){
          optionValArray.push($(this).val());
      }
  });
  return (new Set(optionValArray)).size !== optionValArray.length;
}

function hasDuplicateFeat(featChoiceMap, featID){
  for(const [dataSrc, featDataArray] of featChoiceMap.entries()){
    for(const feat of featDataArray){
        if(feat.id == featID) {
            return true;
        }
    }
  }
  return false;
}

function hasDuplicateLang(langChoiceMap, langID){
  for(const [dataSrc, langDataArray] of langChoiceMap.entries()){
    for(const lang of langDataArray){
        if(lang.id == langID) {
            return true;
        }
    }
  }
  return false;
}

