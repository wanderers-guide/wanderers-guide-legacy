/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_hiddenFeatNames = [];
let g_concealedFeatNames = [];
let g_overrideFeatLevelMap = new Map();

function processMiscFeatStatements(code){
  if(code == null) {return;}

  let allStatements = code.split(/\n/);

  let success = allStatements.length > 0;
  for(let statementRaw of allStatements){
    // Test/Check Statement for Expressions //
    let wscStatement = testExpr(statementRaw);
    if(wscStatement == null) {continue;}
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    let wscStatementUpper = wscStatement.toUpperCase();

    if(wscStatementUpper.includes("UNHIDE-FEAT-NAME=")){ // UNHIDE-FEAT-NAME=Counterspell

      let featName = wscStatementUpper.split('=')[1];
      removeHidden(featName);
      g_featMap = updateFeatMapWithMiscs(g_featMap);

      continue;
    }
    
    if(wscStatementUpper.includes("HIDE-FEAT-NAME=")){ // HIDE-FEAT-NAME=Counterspell

      let featName = wscStatementUpper.split('=')[1];
      g_hiddenFeatNames.push(featName.toUpperCase());
      g_featMap = updateFeatMapWithMiscs(g_featMap);

      continue;
    }
    
    if(wscStatementUpper.includes("OVERRIDE-FEAT-LEVEL=")){ // OVERRIDE-FEAT-LEVEL=Counterspell:2

      let data = wscStatementUpper.split('=')[1];
      let dataParts = data.split(':');
      g_overrideFeatLevelMap.set(dataParts[0].toUpperCase(),parseInt(dataParts[1]));
      g_featMap = updateFeatMapWithMiscs(g_featMap);

      continue;
    }

    if(wscStatementUpper.includes("SHEET-CONCEAL-FEAT-NAME=")){ // SHEET-CONCEAL-FEAT-NAME=Counterspell

      let featName = wscStatementUpper.split('=')[1];
      g_concealedFeatNames.push(featName.toUpperCase());

      continue;
    }

    // Could not identify wsc statement
    success = false;
  }
  return success;
}

// For new processor
function runMiscFeatStatements(wscStatement, wscStatementUpper){

  if(wscStatementUpper.startsWith("UNHIDE-FEAT-NAME=")){ // UNHIDE-FEAT-NAME=Counterspell

    let featName = wscStatementUpper.split('=')[1];
    removeHidden(featName);
    g_featMap = updateFeatMapWithMiscs(g_featMap);

    return PROCESS_RETURN.NEXT;
  }
  
  if(wscStatementUpper.startsWith("HIDE-FEAT-NAME=")){ // HIDE-FEAT-NAME=Counterspell

    let featName = wscStatementUpper.split('=')[1];
    g_hiddenFeatNames.push(featName.toUpperCase());
    g_featMap = updateFeatMapWithMiscs(g_featMap);

    return PROCESS_RETURN.NEXT;
  }
  
  if(wscStatementUpper.startsWith("OVERRIDE-FEAT-LEVEL=")){ // OVERRIDE-FEAT-LEVEL=Counterspell:2

    let data = wscStatementUpper.split('=')[1];
    let dataParts = data.split(':');
    g_overrideFeatLevelMap.set(dataParts[0].toUpperCase(),parseInt(dataParts[1]));
    g_featMap = updateFeatMapWithMiscs(g_featMap);

    return PROCESS_RETURN.NEXT;
  }

  if(wscStatementUpper.startsWith("SHEET-CONCEAL-FEAT-NAME=")){ // SHEET-CONCEAL-FEAT-NAME=Counterspell

    let featName = wscStatementUpper.split('=')[1];
    g_concealedFeatNames.push(featName.toUpperCase());

    return PROCESS_RETURN.NEXT;
  }

  return PROCESS_RETURN.UNKNOWN;
}

function isFeatConcealed(featName){
  return g_concealedFeatNames.includes(featName.toUpperCase());
}

function isFeatHidden(featName){
  return g_hiddenFeatNames.includes(featName.toUpperCase());
}

function removeHidden(featName){
  const index = g_hiddenFeatNames.indexOf(featName.toUpperCase());
  if (index > -1) {
    g_hiddenFeatNames.splice(index, 1);
  }
}

function getFeatLevelOverride(featName){
  return g_overrideFeatLevelMap.get(featName.toUpperCase());
}

function updateFeatMapWithMiscs(featMap){
  let newFeatMap = new Map();
  for(const [featID, featStruct] of featMap.entries()){
    if(featStruct.Feat != null){
      if(!isFeatHidden(featStruct.Feat.name)){
        let newFeatStruct = featStruct;
        let newLevel = getFeatLevelOverride(featStruct.Feat.name);
        if(newLevel != null){
          newFeatStruct.Feat.level = newLevel;
        }
        newFeatMap.set(featID, newFeatStruct);
      }
    } else {
      newFeatMap.set(featID, featStruct);
    }
  }
  return newFeatMap;
}