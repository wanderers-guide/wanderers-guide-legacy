/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

const variableProcessingDebug = false;
const variableRegex = /^[\w]+$/;

/*
  (Variable_Name) -> ({ Type: Array, Value: [], })
  Types: INTEGER, STRING, ABILITY_SCORE, LIST, PROFICIENCY
*/

let g_variableMap = new Map();

const VARIABLE = {
	SCORE_STR: 'SCORE_STR',
	SCORE_DEX: 'SCORE_DEX',
	SCORE_CON: 'SCORE_CON',
	SCORE_INT: 'SCORE_INT',
  SCORE_WIS: 'SCORE_WIS',
  SCORE_CHA: 'SCORE_CHA',
  SCORE_NONE: 'SCORE_NONE',

  SAVE_FORT: 'SAVE_FORT',
  SAVE_REFLEX: 'SAVE_REFLEX',
  SAVE_WILL: 'SAVE_WILL',

  SKILL_ACROBATICS: 'SKILL_ACROBATICS',
  SKILL_ARCANA: 'SKILL_ARCANA',
  SKILL_ATHLETICS: 'SKILL_ATHLETICS',
  SKILL_CRAFTING: 'SKILL_CRAFTING',
  SKILL_DECEPTION: 'SKILL_DECEPTION',
  SKILL_DIPLOMACY: 'SKILL_DIPLOMACY',
  SKILL_INTIMIDATION: 'SKILL_INTIMIDATION',
  SKILL_MEDICINE: 'SKILL_MEDICINE',
  SKILL_NATURE: 'SKILL_NATURE',
  SKILL_OCCULTISM: 'SKILL_OCCULTISM',
  SKILL_PERFORMANCE: 'SKILL_PERFORMANCE',
  SKILL_RELIGION: 'SKILL_RELIGION',
  SKILL_SOCIETY: 'SKILL_SOCIETY',
  SKILL_STEALTH: 'SKILL_STEALTH',
  SKILL_SURVIVAL: 'SKILL_SURVIVAL',
  SKILL_THIEVERY: 'SKILL_THIEVERY',
  SKILL_XXX_LORE: 'SKILL_XXX_LORE',

  ARCANE_SPELL_ATTACK: 'ARCANE_SPELL_ATTACK',
  DIVINE_SPELL_ATTACK: 'DIVINE_SPELL_ATTACK',
  OCCULT_SPELL_ATTACK: 'OCCULT_SPELL_ATTACK',
  PRIMAL_SPELL_ATTACK: 'PRIMAL_SPELL_ATTACK',

  ARCANE_SPELL_DC: 'ARCANE_SPELL_DC',
  DIVINE_SPELL_DC: 'DIVINE_SPELL_DC',
  OCCULT_SPELL_DC: 'OCCULT_SPELL_DC',
  PRIMAL_SPELL_DC: 'PRIMAL_SPELL_DC',

  LIGHT_ARMOR: 'LIGHT_ARMOR',
  MEDIUM_ARMOR: 'MEDIUM_ARMOR',
  HEAVY_ARMOR: 'HEAVY_ARMOR',
  UNARMORED_DEFENSE: 'UNARMORED_DEFENSE',

  SIMPLE_WEAPONS: 'SIMPLE_WEAPONS',
  MARTIAL_WEAPONS: 'MARTIAL_WEAPONS',
  ADVANCED_WEAPONS: 'ADVANCED_WEAPONS',
  UNARMED_ATTACKS: 'UNARMED_ATTACKS',

  PERCEPTION: 'PERCEPTION',
  CLASS_DC: 'CLASS_DC',

  MAX_HEALTH: 'MAX_HEALTH',
  MAX_HEALTH_BONUS_PER_LEVEL: 'MAX_HEALTH_BONUS_PER_LEVEL',
  HEALTH: 'HEALTH',
  TEMP_HEALTH: 'TEMP_HEALTH',

  AC: 'AC',
  ARMOR_CHECK_PENALTY: 'ARMOR_CHECK_PENALTY',
  ARMOR_SPEED_PENALTY: 'ARMOR_SPEED_PENALTY',
  DEX_CAP: 'DEX_CAP',

  SPEED: 'SPEED',
  SPEED_XXX: 'SPEED_XXX',

  BULK_LIMIT: 'BULK_LIMIT',
  INVEST_LIMIT: 'INVEST_LIMIT',

  ATTACKS: 'ATTACKS',
  ATTACKS_DMG_DICE: 'ATTACKS_DMG_DICE',
  ATTACKS_DMG_BONUS: 'ATTACKS_DMG_BONUS',

  MELEE_ATTACKS: 'MELEE_ATTACKS',
  MELEE_ATTACKS_DMG_DICE: 'MELEE_ATTACKS_DMG_DICE',
  MELEE_ATTACKS_DMG_BONUS: 'MELEE_ATTACKS_DMG_BONUS',
  AGILE_MELEE_ATTACKS_DMG_BONUS: 'AGILE_MELEE_ATTACKS_DMG_BONUS',
  NON_AGILE_MELEE_ATTACKS_DMG_BONUS: 'NON_AGILE_MELEE_ATTACKS_DMG_BONUS',

  RANGED_ATTACKS: 'RANGED_ATTACKS',
  RANGED_ATTACKS_DMG_DICE: 'RANGED_ATTACKS_DMG_DICE',
  RANGED_ATTACKS_DMG_BONUS: 'RANGED_ATTACKS_DMG_BONUS',

};

const VAR_TYPE = {
  INTEGER: 'INTEGER',
  STRING: 'STRING',
  ABILITY_SCORE: 'ABILITY_SCORE',
  LIST: 'LIST',
  PROFICIENCY: 'PROFICIENCY',
};

function initializeVariable(variableName, variableType, statSource, value){
  if(typeof g_statManagerMap === 'undefined') { return; }

  if(variableType == VAR_TYPE.INTEGER){
    g_variableMap.set(variableName, { Type: VAR_TYPE.INTEGER, Value: value });
  } else if(variableType == VAR_TYPE.STRING){
    g_variableMap.set(variableName, { Type: VAR_TYPE.STRING, Value: value });
  } else if(variableType == VAR_TYPE.ABILITY_SCORE){
    g_variableMap.set(variableName, { Type: VAR_TYPE.ABILITY_SCORE, Value: { Score: value } });
  } else if(variableType == VAR_TYPE.LIST){
    g_variableMap.set(variableName, { Type: VAR_TYPE.LIST, Value: value });
  } else if(variableType == VAR_TYPE.PROFICIENCY){
    displayError("Variable Initialization: For PROFICIENCY variables, use initializeVariableProf() instead!");
    return;
  } else {
    displayError("Variable Initialization: Unknown variable type \'"+variableType+"\'!");
    return;
  }

  // Add stat to stat manager
  if(statSource != null){
    addStat(variableName, statSource, value);
  }

}

function initializeVariableProf(variableName, abilityScoreName, numUps){
  g_variableMap.set(variableName, { Type: VAR_TYPE.PROFICIENCY, Value: { AbilityScore: abilityScoreName, Rank: getProfLetterFromNumUps(numUps) } });
}

function builderTempInitializeVariables(){

  if(variableProcessingDebug) { console.log(`Initializing predefined variables in builder.`); }

  // Ability Scores
  g_variableMap.set(VARIABLE.SCORE_STR, { Type: VAR_TYPE.ABILITY_SCORE, Value: { Score: 10 } });
  g_variableMap.set(VARIABLE.SCORE_DEX, { Type: VAR_TYPE.ABILITY_SCORE, Value: { Score: 10 } });
  g_variableMap.set(VARIABLE.SCORE_CON, { Type: VAR_TYPE.ABILITY_SCORE, Value: { Score: 10 } });
  g_variableMap.set(VARIABLE.SCORE_INT, { Type: VAR_TYPE.ABILITY_SCORE, Value: { Score: 10 } });
  g_variableMap.set(VARIABLE.SCORE_WIS, { Type: VAR_TYPE.ABILITY_SCORE, Value: { Score: 10 } });
  g_variableMap.set(VARIABLE.SCORE_CHA, { Type: VAR_TYPE.ABILITY_SCORE, Value: { Score: 10 } });
  g_variableMap.set(VARIABLE.SCORE_NONE, { Type: VAR_TYPE.ABILITY_SCORE, Value: { Score: 10 } });

  // Proficiencies
  for(const [variableName, data] of g_profConversionMap.entries()){
    if(data.AbilScore != null){
      g_variableMap.set(variableName, { Type: VAR_TYPE.PROFICIENCY, Value: { AbilityScore: 'SCORE_'+data.AbilScore, Rank: 'U' } });
    }
  }

}

///////////////

function processVariables(wscCode){
  if(wscCode == null) {return;}

  let wscStatements = wscCode.split(/\n/);
  const statementRegex = /([^=]+)=([^:]+):(.+)/;

  let newWscStatements = [];

  for(let wscStatementRaw of wscStatements) {

    // Test/Check Statement for Expressions //
    let wscStatement = testExpr(wscStatementRaw);
    if(wscStatement == null) {continue;}
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    // Replace variable names with their values //
    let processedWscStatement = handleVariableText(wscStatement);
    wscStatementRaw = wscStatementRaw.replace(wscStatement, processedWscStatement);
    wscStatement = processedWscStatement;
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    let wscStatementUpper = wscStatement.toUpperCase();

    if(wscStatementUpper.includes("DEFINE-VARIABLE=")){ // DEFINE-VARIABLE=Crembo:INTEGER
      const match = wscStatement.match(statementRegex);
      if(match != null){

        let variableName = match[2];
        if(variableName.match(variableRegex) == null){
          displayError("Variable Processing: Invalid variable name \'"+variableName+"\'! Only letters, numbers, and underscores are allowed.");
          continue;
        }
        if(g_variableMap.get(variableName) != null){
          displayError("Variable Processing: A variable with the name \'"+variableName+"\' already exists!");
          continue;
        }

        let variableType = match[3];

        let variableTypeUpper = variableType.toUpperCase();
        if(variableTypeUpper == VAR_TYPE.INTEGER){

          if(variableProcessingDebug) { console.log(`Defining new variable: '${variableName}' as '${VAR_TYPE.INTEGER}'`); }
          g_variableMap.set(variableName, { Type: VAR_TYPE.INTEGER, Value: 0 });

          continue;
        } else if(variableTypeUpper == VAR_TYPE.STRING){

          if(variableProcessingDebug) { console.log(`Defining new variable: '${variableName}' as '${VAR_TYPE.STRING}'`); }
          g_variableMap.set(variableName, { Type: VAR_TYPE.STRING, Value: '' });

          continue;
        } else if(variableTypeUpper == VAR_TYPE.ABILITY_SCORE){

          if(variableProcessingDebug) { console.log(`Defining new variable: '${variableName}' as '${VAR_TYPE.ABILITY_SCORE}'`); }
          g_variableMap.set(variableName, { Type: VAR_TYPE.ABILITY_SCORE, Value: { Score: 0 } });

          continue;
        } else if(variableTypeUpper == VAR_TYPE.LIST){

          if(variableProcessingDebug) { console.log(`Defining new variable: '${variableName}' as '${VAR_TYPE.LIST}'`); }
          g_variableMap.set(variableName, { Type: VAR_TYPE.LIST, Value: [] });

          continue;
        } else if(variableTypeUpper.startsWith(VAR_TYPE.PROFICIENCY)){
          const typeMatch = variableType.trim().match(/^PROFICIENCY\((.+)\)$/im);
          if(typeMatch != null){
            const abilityScoreVariableName = typeMatch[1];

            let abilityScoreVariable = g_variableMap.get(abilityScoreVariableName);
            if(abilityScoreVariable != null && abilityScoreVariable.Type == VAR_TYPE.ABILITY_SCORE){

              if(variableProcessingDebug) { console.log(`Defining new variable: '${variableName}' as '${VAR_TYPE.PROFICIENCY}'`); }
              g_variableMap.set(variableName, { Type: VAR_TYPE.PROFICIENCY, Value: { AbilityScore: abilityScoreVariableName, Rank: 'U' } });

            } else {
              displayError(`Variable Processing: Could not find \'${abilityScoreVariableName}\' as an ${VAR_TYPE.ABILITY_SCORE} variable!`);
              continue;
            }
          } else {
            displayError(`Variable Processing: \'${variableType}\' does not follow the following format: PROFICIENCY(Ability Score Variable Name)!`);
            continue;
          }
        } else {
          displayError("Variable Processing: \'"+variableType+"\' is not a valid variable type!");
          continue;
        }

        continue;
      }
    }
    
    if(wscStatementUpper.includes("SET-VARIABLE=")){ // SET-VARIABLE=Crembo:67
      const match = wscStatement.match(statementRegex);
      if(match != null){

        let variableStr = match[2];
        let value = match[3];

        let variableName = '';
        let methodName = '';
        if(variableStr.includes('.')){
          let parts = variableStr.split('.');
          variableName = parts[0];
          methodName = parts[1];
        } else {
          variableName = variableStr;
          methodName = 'SET_VALUE';
        }

        let variable = g_variableMap.get(variableName);
        if(variable == null){
          displayError("Variable Processing (set): Unknown variable \'"+variableName+"\'!");
          continue;
        }

        if(variableProcessingDebug) { console.log(`Setting variable: '${variableName}.${methodName}' to '${value}'`); }
        setVariableValueIntoMethod(variable, variableName, methodName, value);

        continue;
      }
    }

    newWscStatements.push(wscStatementRaw);

  }

  // Assemble new wscCode
  let newWscCode = '';
  for(const newWscStatement of newWscStatements){
    newWscCode += newWscStatement+'\n';
  }
  newWscCode = newWscCode.slice(0, -1); // Trim off that last '\n'

  return newWscCode;
}

function handleVariableText(varText){
  if(!varText.includes('{') || !varText.includes('}')) { return varText; }

  // Validate text //
  if(varText.split('{').length !== varText.split('}').length) {
    displayError("Variable Processing: Invalid syntax, braces mismatch! \'"+varText+"\'");
    return varText;
  }

  // Process text //
  let processTopLayerOfPyramid = function(){

    let lastBrace = null;
    for (let i = 0; i < varText.length; i++) {
      const char = varText.charAt(i);
  
      if(lastBrace != null && lastBrace.Type === '{' && char === '}'){
        
        return varText.replace(varText.substring(lastBrace.Index, i+1), getVariableValue(varText.substring(lastBrace.Index+1, i)));
  
      } else {
        if(char === '{' || char === '}'){
          lastBrace = { Type: char, Index: i };
        }
      }
  
    }

  };

  let count = 0;
  while(varText.includes('{')){
    varText = processTopLayerOfPyramid();

    count++;
    if(count > 100) {
      displayError("Variable Processing: Unsolvable, braces mismatch! \'"+varText+"\'");
      return varText;
    }
  }

  return varText;

}

function getVariableValue(variableStr, errorOnFailure=true){

  if(variableStr.includes('.')){
    // Variable with .

    let parts = variableStr.split('.');

    let variable = g_variableMap.get(parts[0]);
    if(variable == null){
      if(errorOnFailure){
        displayError("Variable Processing (2-1): Unknown variable \'"+variableStr+"\'!");
      }
      return 'Error';
    }

    return getVariableValueFromMethod(variable, parts[0], parts[1]);

  } else if(variableStr.match(/^[0-9 \-+\/^*]+$/) != null) {
    // Just math

    try {
      return parseInt(math.evaluate(variableStr));
    } catch (err){
      if(errorOnFailure){
        displayError("Variable Processing (2-0): Error doing math \'"+variableStr+"\'!");
      }
      console.error(err);
      return 'Error';
    }

  } else if(variableStr.match(variableRegex) != null) {
    // Variable

    let variable = g_variableMap.get(variableStr);
    if(variable == null){
      if(errorOnFailure){
        displayError("Variable Processing (2-2): Unknown variable \'"+variableStr+"\'!");
      }
      return 'Error';
    }

    return getVariableValueFromMethod(variable, variableStr, 'GET_VALUE');

  } else {
    // Doesn't match anything
    return 'Error';
  }

}

function getVariableValueFromMethod(variable, varName, method) {
  let methodUpper = method.toUpperCase();

  if(variable.Type == VAR_TYPE.INTEGER){

    if(methodUpper == 'GET_VALUE'){
      return variable.Value;
    } else {
      displayError("Variable Processing: Unknown getting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
      return 'Error';
    }

  } else if(variable.Type == VAR_TYPE.STRING){

    if(methodUpper == 'GET_VALUE'){
      return variable.Value;
    } else {
      displayError("Variable Processing: Unknown getting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
      return 'Error';
    }

  } else if(variable.Type == VAR_TYPE.PROFICIENCY){

    // TODO - Doesn't add char_level or account for level-less prof being enabled (untrained is -2)
    // temp solution
    let rankToValue = function(rank){
      if(rank == 'U'){ return 0; }
      if(rank == 'T'){ return 2; }
      if(rank == 'E'){ return 4; }
      if(rank == 'M'){ return 6; }
      if(rank == 'L'){ return 8; }
    };

    if(methodUpper == 'GET_TOTAL'){
      return rankToValue(variable.Value.Rank)+getMod(g_variableMap.get(variable.Value.AbilityScore).Value.Score);
    } else if(methodUpper == 'GET_BONUS_RANK'){
      return rankToValue(variable.Value.Rank);
    } else if(methodUpper == 'GET_BONUS_ABILITY'){
      return getMod(g_variableMap.get(variable.Value.AbilityScore).Value.Score);
    } else if(methodUpper == 'GET_ABILITY'){
      return variable.Value.AbilityScore;
    } else if(methodUpper == 'GET_VALUE'){
      return variable.Value.Rank;
    } else {
      displayError("Variable Processing: Unknown getting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
      return 'Error';
    }

  } else if(variable.Type == VAR_TYPE.ABILITY_SCORE){

    if(methodUpper == 'GET_MOD'){
      return getMod(variable.Value.Score);
    } else if(methodUpper == 'GET_SCORE'){
      return variable.Value.Score;
    } else if(methodUpper == 'GET_VALUE'){
      return variable.Value.Score;
    } else {
      displayError("Variable Processing: Unknown getting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
      return 'Error';
    }

  } else if(variable.Type == VAR_TYPE.LIST){

    if(methodUpper == 'GET_LENGTH'){
      return variable.Value.length;
    } else if(methodUpper.match(/^GET_INDEX_(\d+)$/)){
      let digit = parseInt(methodUpper.replace('GET_INDEX_', ''));
      return variable.Value[digit];
    } else if(methodUpper == 'GET_VALUE'){
      return ''+variable.Value;
    } else {
      displayError("Variable Processing: Unknown getting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
      return 'Error';
    }

  } else {
    displayError("Variable Processing: Unknown variable type \'"+variable.Type+"\'!");
    return 'Error';
  }

}

function setVariableValueIntoMethod(variable, varName, method, value) {
  let methodUpper = method.toUpperCase();

  if(variable.Type == VAR_TYPE.INTEGER){

    if(methodUpper == 'SET_VALUE'){
      let intValue = parseInt(value);
      if(typeof intValue === 'number' && intValue == value) {
        variable.Value = intValue;
      } else {
        displayError("Variable Processing (set): The value \'"+value+"\' for \'"+varName+"\' is not an integer!");
      }
    } else {
      displayError("Variable Processing: Unknown setting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
    }

  } else if(variable.Type == VAR_TYPE.STRING){

    if(methodUpper == 'SET_VALUE'){
      if(typeof value === 'string') {
        variable.Value = value;
      } else {
        displayError("Variable Processing (set): The value \'"+value+"\' for \'"+varName+"\' is not a string!");
      }
    } else {
      displayError("Variable Processing: Unknown setting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
    }

  } else if(variable.Type == VAR_TYPE.PROFICIENCY){

    if(methodUpper == 'SET_ABILITY'){
      let abilityScoreVariable = g_variableMap.get(value);
      if(abilityScoreVariable != null && abilityScoreVariable.Type == VAR_TYPE.ABILITY_SCORE){
        variable.Value.AbilityScore = value;
      } else {
        displayError(`Variable Processing (set): The value \'${value}\' for \'${varName}\' is not an ${VAR_TYPE.ABILITY_SCORE} variable!`);
      }
    } else if(methodUpper == 'SET_VALUE'){
      if(value == 'U' || value == 'T' || value == 'E' || value == 'M' || value == 'L'){
        variable.Value.Rank = value;
      } else {
        displayError("Variable Processing (set): The value \'"+value+"\' for \'"+varName+"\' is not a proficiency rank! (options: U, T, E, M, and L)");
      }
    } else {
      displayError("Variable Processing: Unknown setting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
    }

  } else if(variable.Type == VAR_TYPE.ABILITY_SCORE){

    if(methodUpper == 'SET_SCORE' || methodUpper == 'SET_VALUE'){
      let intValue = parseInt(value);
      if(typeof intValue === 'number' && intValue == value) {
        variable.Value.Score = intValue;
      } else {
        displayError("Variable Processing (set): The value \'"+value+"\' for \'"+varName+"\' is not an integer!");
      }
    } else {
      displayError("Variable Processing: Unknown setting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
    }

  } else if(variable.Type == VAR_TYPE.LIST){

    if(methodUpper == 'SET_INDEX_NEXT'){
      variable.Value.push(value);
    } else if(methodUpper.match(/^SET_INDEX_(\d+)$/)){
      let digit = parseInt(methodUpper.replace('SET_INDEX_', ''));
      variable.Value[digit] = value;
    } else if(methodUpper == 'SET_VALUE'){
      try {
        let newArray = JSON.parse(value);
        if(typeof newArray === 'object') {
          variable.Value = newArray;
        } else {
          displayError("Variable Processing (set-1): The value \'"+value+"\' for \'"+varName+"\' is not a list!");
        }
      } catch(err){
        displayError("Variable Processing (set-2): The value \'"+value+"\' for \'"+varName+"\' is not a list!");
        console.error(err);
      }
    } else {
      displayError("Variable Processing: Unknown setting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
    }

  } else {
    displayError("Variable Processing: Unknown variable type \'"+variable.Type+"\'!");
  }

}