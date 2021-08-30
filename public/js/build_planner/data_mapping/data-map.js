

const DATA_SOURCE = {
  ABILITY_BONUS: 'abilityBonus',
  OTHER_SPEED: 'otherSpeeds',
  RESISTANCE: 'resistance',
  WEAKNESS: 'vulnerability',
  INNATE_SPELL: 'innateSpell',
  LANGUAGE: 'languages',
  CLASS_FEATURE_CHOICE: 'classChoice',
  PROFICIENCY: 'proficiencies',
  LORE: 'loreCategories',
  CHAR_TRAIT: 'charTag',
  UNSELECTED_DATA: 'unselectedData',
  FEAT_CHOICE: 'chosenFeats',
  EXTRA_CLASS_FEATURE: 'classAbilityExtra',
  EXTRA_HERITAGE: 'heritageExtra',
  DOMAIN: 'domains',
  ADVANCED_DOMAIN: 'advancedDomains',
  FOCUS_SPELL: 'focusSpell',
  FOCUS_POINT: 'focusPoint',
  NOTES_FIELD: 'notesField',
  PHYSICAL_FEATURE: 'phyFeats',
  SENSE: 'senses',
  WEAPON_SPECIAL: 'weaponSpecialization',
  ARMOR_SPECIAL: 'armorSpecialization',
  WEAPON_CRIT_SPECIAL: 'weaponCriticalSpecialization',
  WEAPON_FAMILIARITY: 'weaponFamiliarity',
  SCFS: 'scfs',
};

const g_dataMap = new Map();

function initDataMap(charMetaData){
  for(let metaData of charMetaData){
    let srcStruct = {
      source: metaData.source,
      sourceType: metaData.sourceType,
      sourceLevel: metaData.sourceLevel,
      sourceCode: metaData.sourceCode,
      sourceCodeSNum: metaData.sourceCodeSNum,
    };
    g_dataMap.set(JSON.stringify(srcStruct), metaData.value);
  }
}

function setData(in_source, in_srcStruct, in_value){
  let new_srcStruct = parameterizeSrcStruct(in_source, in_srcStruct);
  deleteDataSNumChildren(new_srcStruct);
  g_dataMap.set(JSON.stringify(new_srcStruct), in_value);
}

function getDataSingle(in_source, in_srcStruct){
  let new_srcStruct = parameterizeSrcStruct(in_source, in_srcStruct);
  new_srcStruct.value = cloneObj(g_dataMap.get(JSON.stringify(new_srcStruct)));
  return new_srcStruct;
}

function getDataAll(in_source){
  let dataArray = [];
  for(const [JSON_srcStruct, value] of g_dataMap.entries()){
    let newStruct = JSON.parse(JSON_srcStruct);
    if(newStruct.source == in_source){
      newStruct.value = value;
      dataArray.push(newStruct);
    }
  }
  return dataArray;
}

function parameterizeSrcStruct(in_source, in_srcStruct){
  return {
    source: in_source,
    sourceType: in_srcStruct.sourceType,
    sourceLevel: in_srcStruct.sourceLevel,
    sourceCode: in_srcStruct.sourceCode,
    sourceCodeSNum: in_srcStruct.sourceCodeSNum,
  };
}

// Delete Data //
function deleteVarDataFromSrcStruct(in_srcStruct){
  toVar_removeDataProficiencies(in_srcStruct);
  toVar_removeDataAbilityBonus(in_srcStruct);
  toVar_removeDataResistances(in_srcStruct);
  toVar_removeDataWeaknesses(in_srcStruct);
  toVar_removeDataLanguages(in_srcStruct);
}

function deleteData(in_source, in_srcStruct){
  deleteDataSNumChildren(in_srcStruct);
  deleteDataOnly(in_source, in_srcStruct);
}

function deleteDataOnly(in_source, in_srcStruct){
  g_dataMap.delete(JSON.stringify(parameterizeSrcStruct(in_source, in_srcStruct)));
  deleteVarDataFromSrcStruct(in_srcStruct);
}

function deleteDataBySourceStruct(in_srcStruct){
  deleteDataSNumChildren(in_srcStruct);
  for(const [JSON_srcStruct, value] of g_dataMap.entries()){
    let srcStruct = JSON.parse(JSON_srcStruct);
    if(srcStruct.sourceType == in_srcStruct.sourceType
        && srcStruct.sourceLevel == in_srcStruct.sourceLevel
        && srcStruct.sourceCode == in_srcStruct.sourceCode
        && srcStruct.sourceCodeSNum == in_srcStruct.sourceCodeSNum){
      g_dataMap.delete(JSON_srcStruct);
      deleteVarDataFromSrcStruct(srcStruct);
    }
  }
}

function deleteDataSNumChildren(in_srcStruct){
  for(const [JSON_srcStruct, value] of g_dataMap.entries()){
    let srcStruct = JSON.parse(JSON_srcStruct);
    if(srcStruct.sourceCodeSNum.endsWith(in_srcStruct.sourceCodeSNum)
        && srcStruct.sourceCodeSNum != in_srcStruct.sourceCodeSNum
        && srcStruct.sourceType == in_srcStruct.sourceType
        && srcStruct.sourceLevel == in_srcStruct.sourceLevel
        && srcStruct.sourceCode == in_srcStruct.sourceCode){
      g_dataMap.delete(JSON_srcStruct);
      deleteVarDataFromSrcStruct(srcStruct);
    }
  }
}

function deleteDataBySource(in_source){
  for(const [JSON_srcStruct, value] of g_dataMap.entries()){
    let srcStruct = JSON.parse(JSON_srcStruct);
    if(srcStruct.source == in_source){
      g_dataMap.delete(JSON_srcStruct);
      deleteVarDataFromSrcStruct(srcStruct);
    }
  }
}

function deleteDataBySourceType(in_sourceType){
  for(const [JSON_srcStruct, value] of g_dataMap.entries()){
    let srcStruct = JSON.parse(JSON_srcStruct);
    if(srcStruct.sourceType == in_sourceType){
      g_dataMap.delete(JSON_srcStruct);
      deleteVarDataFromSrcStruct(srcStruct);
    }
  }
}

function deleteDataBySourceAndType(in_source, in_sourceType){
  for(const [JSON_srcStruct, value] of g_dataMap.entries()){
    let srcStruct = JSON.parse(JSON_srcStruct);
    if(srcStruct.source == in_source && srcStruct.sourceType == in_sourceType){
      g_dataMap.delete(JSON_srcStruct);
      deleteVarDataFromSrcStruct(srcStruct);
    }
  }
}

function deleteDataByGreaterThanSourceLevel(in_level){
  for(const [JSON_srcStruct, value] of g_dataMap.entries()){
    let srcStruct = JSON.parse(JSON_srcStruct);
    if(srcStruct.sourceLevel > in_level){
      g_dataMap.delete(JSON_srcStruct);
      deleteVarDataFromSrcStruct(srcStruct);
    }
  }
}

function deleteDataBySourceCode(in_sourceCode){
  for(const [JSON_srcStruct, value] of g_dataMap.entries()){
    let srcStruct = JSON.parse(JSON_srcStruct);
    if(srcStruct.sourceCode == in_sourceCode){
      g_dataMap.delete(JSON_srcStruct);
      deleteVarDataFromSrcStruct(srcStruct);
    }
  }
}