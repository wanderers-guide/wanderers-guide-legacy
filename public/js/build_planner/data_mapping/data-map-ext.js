

function setDataProficiencies(srcStruct, fFor, tTo, prof, sourceName){
  
  toVar_setDataProficiencies(srcStruct, tTo, prof, sourceName);

  let value = fFor+getSeparator()+tTo+getSeparator()+prof+getSeparator()+sourceName;
  return setData(DATA_SOURCE.PROFICIENCY, srcStruct, value);
}

function getDataAllProficiencies(){
  let dataArray = getDataAll(DATA_SOURCE.PROFICIENCY);
  for(let data of dataArray){
    let vParts = data.value.split(getSeparator());
    data.For = vParts[0];
    data.To = vParts[1];
    data.Prof = vParts[2];
    if(vParts.length == 4){ data.SourceName = vParts[3]; } else { data.SourceName = 'Unknown'; }
  }
  return dataArray;
}

//

function setDataAbilityBonus(srcStruct, ability, bonus){
  
  toVar_setDataAbilityBonus(srcStruct, ability, bonus);

  let value = ability+getSeparator()+bonus;
  return setData(DATA_SOURCE.ABILITY_BONUS, srcStruct, value);
}

function getDataSingleAbilityBonus(srcStruct){
  let dataValue = getDataSingle(DATA_SOURCE.ABILITY_BONUS, srcStruct);
  if(dataValue != null && dataValue.value != null) {
    let vParts = dataValue.value.split(getSeparator());
    return { Ability: vParts[0], Bonus: vParts[1] };
  } else {
    return null;
  }
}

function getDataAllAbilityBonus(){
  let dataArray = getDataAll(DATA_SOURCE.ABILITY_BONUS);
  for(let data of dataArray){
    let vParts = data.value.split(getSeparator());
    data.Ability = vParts[0];
    data.Bonus = vParts[1];
  }
  return dataArray;
}

//

function setDataClassChoice(srcStruct, selectorID, optionID){
  let value = selectorID+getSeparator()+optionID;
  return setData(DATA_SOURCE.CLASS_FEATURE_CHOICE, srcStruct, value);
}

function getDataAllClassChoice(){
  let dataArray = getDataAll(DATA_SOURCE.CLASS_FEATURE_CHOICE);
  for(let data of dataArray){
    let vParts = data.value.split(getSeparator());
    data.SelectorID = vParts[0];
    data.OptionID = vParts[1];
  }
  return dataArray;
}

//

function setDataInnateSpell(srcStruct, spellID, spellLevel, spellTradition, timesPerDay){
  let value = spellID+getSeparator()+spellLevel+getSeparator()+spellTradition+getSeparator()+timesPerDay+getSeparator()+'CHA';
      /*
          "You use your Charisma modifier as your spellcasting ability
          modifier for innate spells unless otherwise specified."
      */
  return setData(DATA_SOURCE.INNATE_SPELL, srcStruct, value);
}

function getDataAllInnateSpell(){
  let dataArray = getDataAll(DATA_SOURCE.INNATE_SPELL);
  for(let data of dataArray){
    let vParts = data.value.split(getSeparator());
    data.SpellID = vParts[0];
    data.SpellLevel = vParts[1];
    data.SpellTradition = vParts[2];
    data.TimesPerDay = vParts[3];
    data.KeyAbility = vParts[4];
  }
  return dataArray;
}

//

function setDataResistance(srcStruct, resistType, resistAmount){
  let value = resistType+getSeparator()+resistAmount;

  toVar_setDataResistances(srcStruct, value);

  return setData(DATA_SOURCE.RESISTANCE, srcStruct, value);
}

function getDataAllResistance(){
  let dataArray = getDataAll(DATA_SOURCE.RESISTANCE);
  for(let data of dataArray){
    let vParts = data.value.split(getSeparator());
    data.Type = vParts[0];
    data.Amount = vParts[1];
  }
  return dataArray;
}


function setDataVulnerability(srcStruct, vulnerableType, vulnerableAmount){
  let value = vulnerableType+getSeparator()+vulnerableAmount;

  toVar_setDataWeaknesses(srcStruct, value);

  return setData(DATA_SOURCE.WEAKNESS, srcStruct, value);
}

function getDataAllVulnerability(){
  let dataArray = getDataAll(DATA_SOURCE.WEAKNESS);
  for(let data of dataArray){
    let vParts = data.value.split(getSeparator());
    data.Type = vParts[0];
    data.Amount = vParts[1];
  }
  return dataArray;
}


function setDataOtherSpeed(srcStruct, speedType, speedAmount){
  let value = speedType+getSeparator()+speedAmount;
  return setData(DATA_SOURCE.OTHER_SPEED, srcStruct, value);
}

function getDataAllOtherSpeed(){
  let dataArray = getDataAll(DATA_SOURCE.OTHER_SPEED);
  for(let data of dataArray){
    let vParts = data.value.split(getSeparator());
    data.Type = vParts[0];
    data.Amount = vParts[1];
  }
  return dataArray;
}


function getSeparator(){
  return ':::';
}