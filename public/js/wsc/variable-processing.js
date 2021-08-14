/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

const variableProcessingDebug = true;
const variableRegex = /^[\w]+$/;

/*
  (Variable_Name) -> ({ Type: Array, Value: [], })
  Types: INTEGER, STRING, ABILITY-SCORE, LIST, PROFICIENCY
*/

let g_variableMap = new Map();

function processVariables(wscCode){
  if(wscCode == null) {return;}

  let wscStatements = wscCode.split(/\n/);
  const statementRegex = /([^=]+)=([^:]+):(.+)/;

  let newWscStatements = [];

  for(let wscStatementRaw of wscStatements) {

    // Replace variable names with their values //
    wscStatementRaw = handleVariableText(wscStatementRaw);

    // Test/Check Statement for Expressions //
    let wscStatement = testExpr(wscStatementRaw);
    if(wscStatement == null) {continue;}
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
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
        if(variableTypeUpper == 'INTEGER'){

          if(variableProcessingDebug) { console.log(`Defining new variable: '${variableName}' as 'INTEGER'`); }
          g_variableMap.set(variableName, { Type: 'INTEGER', Value: 0 });

          continue;
        } else if(variableTypeUpper == 'STRING'){

          if(variableProcessingDebug) { console.log(`Defining new variable: '${variableName}' as 'STRING'`); }
          g_variableMap.set(variableName, { Type: 'STRING', Value: '' });

          continue;
        } else if(variableTypeUpper == 'ABILITY-SCORE'){

          if(variableProcessingDebug) { console.log(`Defining new variable: '${variableName}' as 'ABILITY-SCORE'`); }
          g_variableMap.set(variableName, { Type: 'ABILITY-SCORE', Value: { Score: 0 } });

          continue;
        } else if(variableTypeUpper == 'LIST'){

          if(variableProcessingDebug) { console.log(`Defining new variable: '${variableName}' as 'LIST'`); }
          g_variableMap.set(variableName, { Type: 'LIST', Value: [] });

          continue;
        } else if(variableTypeUpper.startsWith('PROFICIENCY')){
          const typeMatch = variableType.trim().match(/^PROFICIENCY\((.+)\)$/im);
          if(typeMatch != null){
            const abilityScoreVariableName = typeMatch[1];

            // TODO - Check if 
            let abilityScoreVariable = g_variableMap.get(abilityScoreVariableName);
            if(abilityScoreVariable != null && abilityScoreVariable.Type == 'ABILITY-SCORE'){

              if(variableProcessingDebug) { console.log(`Defining new variable: '${variableName}' as 'PROFICIENCY'`); }
              g_variableMap.set(variableName, { Type: 'PROFICIENCY', Value: { AbilityScore: '', Rank: 'U' } });

            } else {
              displayError("Variable Processing: Could not find \'"+abilityScoreVariableName+"\' as an ABILITY-SCORE variable!");
              continue;
            }
          } else {
            displayError("Variable Processing: \'"+variableType+"\' does not follow the following format: PROFICIENCY(Ability Score Variable Name)!");
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
        
        console.log(getVariableValue(varText.substring(lastBrace.Index+1, i)));
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

function getVariableValue(variableStr){

  if(variableStr.includes('.')){
    // Variable with .

    let parts = variableStr.split('.');

    let variable = g_variableMap.get(parts[0]);
    if(variable == null){
      displayError("Variable Processing (2-1): Unknown variable \'"+variableStr+"\'!");
      return 'Error';
    }

    return getVariableValueFromMethod(variable, parts[0], parts[1]);

  } else if(variableStr.match(/^[0-9 \-+\/^*]+$/) != null) {
    // Just math

    try {
      return parseInt(math.evaluate(variableStr));
    } catch (err){
      displayError("Variable Processing (2-0): Error doing math \'"+variableStr+"\'!");
      console.error(err);
      return 'Error';
    }

  } else if(variableStr.match(variableRegex) != null) {
    // Variable

    let variable = g_variableMap.get(variableStr);
    if(variable == null){
      displayError("Variable Processing (2-2): Unknown variable \'"+variableStr+"\'!");
      return 'Error';
    }

    return getVariableValueFromMethod(variable, variableStr, 'GET_VALUE');

  }

}

function getVariableValueFromMethod(variable, varName, method) {
  let methodUpper = method.toUpperCase();

  if(variable.Type == 'INTEGER'){

    if(methodUpper == 'GET_VALUE'){
      return variable.Value;
    } else {
      displayError("Variable Processing: Unknown getting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
      return 'Error';
    }

  } else if(variable.Type == 'STRING'){

    if(methodUpper == 'GET_VALUE'){
      return variable.Value;
    } else {
      displayError("Variable Processing: Unknown getting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
      return 'Error';
    }

  } else if(variable.Type == 'PROFICIENCY'){

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

  } else if(variable.Type == 'ABILITY-SCORE'){

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

  } else if(variable.Type == 'LIST'){

    if(methodUpper == 'GET_LENGTH'){
      return variable.Value.length;
    } else if(methodUpper.match(/^GET_INDEX_(\d+)$/)){
      let digit = parseInt(methodUpper.replace('GET_INDEX_', ''));
      return variable.Value[digit];
    } else if(methodUpper == 'GET_VALUE'){
      return '['+variable.Value+']';
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

  if(variable.Type == 'INTEGER'){

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

  } else if(variable.Type == 'STRING'){

    if(methodUpper == 'SET_VALUE'){
      if(typeof value === 'string') {
        variable.Value = value;
      } else {
        displayError("Variable Processing (set): The value \'"+value+"\' for \'"+varName+"\' is not a string!");
      }
    } else {
      displayError("Variable Processing: Unknown setting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
    }

  } else if(variable.Type == 'PROFICIENCY'){

    if(methodUpper == 'SET_ABILITY'){
      variable.Value.AbilityScore = value; // TODO - Confirm is ability score
    } else if(methodUpper == 'SET_VALUE'){
      variable.Value.Rank = value; // TODO - confirm is valid rank
    } else {
      displayError("Variable Processing: Unknown setting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
    }

  } else if(variable.Type == 'ABILITY-SCORE'){

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

  } else if(variable.Type == 'LIST'){

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
          displayError("Variable Processing (set): The value \'"+value+"\' for \'"+varName+"\' is not a list!");
        }
      } catch(err){
        displayError("Variable Processing (set): The value \'"+value+"\' for \'"+varName+"\' is not a list!");
      }
    } else {
      displayError("Variable Processing: Unknown setting method \'"+method+"\' for variable \'"+varName+"\' ("+variable.Type+")!");
    }

  } else {
    displayError("Variable Processing: Unknown variable type \'"+variable.Type+"\'!");
  }

}