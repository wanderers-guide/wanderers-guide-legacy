
function toVar_setDataProficiencies(srcStruct, tTo, prof, sourceName){

  let varName = profConversion_convertOldNameToVarName(tTo);
  variables_addRank(varName, prof, sourceName, srcStructToCompositeKey(srcStruct));

}

function toVar_removeDataProficiencies(srcStruct){

  toVar_removeData(srcStructToCompositeKey(srcStruct), VAR_TYPE.PROFICIENCY);

}

///

function toVar_setDataAbilityBonus(srcStruct, ability, bonus){
  
  if(bonus == 'Boost'){
    variables_addToBonuses('SCORE_'+ability, 2, srcStructToCompositeKey(srcStruct), 'Metadata');
  } else if(bonus == 'Flaw'){
    variables_addToBonuses('SCORE_'+ability, -2, srcStructToCompositeKey(srcStruct), 'Metadata');
  } else {
    variables_addToBonuses('SCORE_'+ability, parseInt(bonus), srcStructToCompositeKey(srcStruct), 'Metadata');
  }

}

function toVar_removeDataAbilityBonus(srcStruct){

  toVar_removeData(srcStructToCompositeKey(srcStruct), VAR_TYPE.ABILITY_SCORE);

}

///

function toVar_setDataResistances(srcStruct, value){

  variables_addToExtras(VARIABLE.RESISTANCES, value, srcStructToCompositeKey(srcStruct), 'Metadata');

}

function toVar_removeDataResistances(srcStruct){

  variables_removeFromExtras(VARIABLE.RESISTANCES, srcStructToCompositeKey(srcStruct));

}

///

function toVar_setDataWeaknesses(srcStruct, value){

  variables_addToExtras(VARIABLE.WEAKNESSES, value, srcStructToCompositeKey(srcStruct), 'Metadata');

}

function toVar_removeDataWeaknesses(srcStruct){

  variables_removeFromExtras(VARIABLE.WEAKNESSES, srcStructToCompositeKey(srcStruct));

}

///

function toVar_setDataLanguages(srcStruct, value){

  variables_addToExtras(VARIABLE.LANGUAGES, value, srcStructToCompositeKey(srcStruct), 'Metadata');

}

function toVar_removeDataLanguages(srcStruct){

  variables_removeFromExtras(VARIABLE.LANGUAGES, srcStructToCompositeKey(srcStruct));

}

///

function toVar_removeData(srcStruct, varType){

  for(let [varName, varData] of g_variableMap.entries()){
    if(varData.Type == varType){
      
      if(varType == VAR_TYPE.INTEGER){
        varData.Bonuses.delete(srcStructToCompositeKey(srcStruct));
      } else if(varType == VAR_TYPE.STRING){
        varData.Extras.delete(srcStructToCompositeKey(srcStruct));
      } else if(varType == VAR_TYPE.ABILITY_SCORE){
        varData.Value.Bonuses.delete(srcStructToCompositeKey(srcStruct));
      } else if(varType == VAR_TYPE.LIST){
        displayError("Remove Data Var: Unsupported variable type \'"+varType+"\'!");
        return;
      } else if(varType == VAR_TYPE.PROFICIENCY){
        varData.Value.RankHistory.delete(srcStructToCompositeKey(srcStruct));
      } else {
        displayError("Remove Data Var: Unknown variable type \'"+varType+"\'!");
        return;
      }

    }
  }

}