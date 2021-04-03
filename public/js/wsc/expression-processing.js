/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_profConversionMap = new Map();

g_profConversionMap.set('LIGHTARMOR', {Name: 'Light_Armor', Category: 'Defense'});
g_profConversionMap.set('MEDIUMARMOR', {Name: 'Medium_Armor', Category: 'Defense'});
g_profConversionMap.set('HEAVYARMOR', {Name: 'Heavy_Armor', Category: 'Defense'});
g_profConversionMap.set('UNARMOREDDEFENSE', {Name: 'Unarmored_Defense', Category: 'Defense'});

g_profConversionMap.set('SIMPLEWEAPONS', {Name: 'Simple_Weapons', Category: 'Attack'});
g_profConversionMap.set('MARTIALWEAPONS', {Name: 'Martial_Weapons', Category: 'Attack'});
g_profConversionMap.set('ADVANCEDWEAPONS', {Name: 'Advanced_Weapons', Category: 'Attack'});
g_profConversionMap.set('UNARMEDATTACKS', {Name: 'Unarmed_Attacks', Category: 'Attack'});

g_profConversionMap.set('FORTITUDE', {Name: 'Fortitude', Category: 'Save'});
g_profConversionMap.set('REFLEX', {Name: 'Reflex', Category: 'Save'});
g_profConversionMap.set('WILL', {Name: 'Will', Category: 'Save'});

g_profConversionMap.set('PERCEPTION', {Name: 'Perception', Category: 'Perception'});

g_profConversionMap.set('CLASSDC', {Name: 'Class_DC', Category: 'Class_DC'});

g_profConversionMap.set('ARCANESPELLATTACKS', {Name: 'ArcaneSpellAttacks', Category: 'SpellAttack'});
g_profConversionMap.set('OCCULTSPELLATTACKS', {Name: 'OccultSpellAttacks', Category: 'SpellAttack'});
g_profConversionMap.set('PRIMALSPELLATTACKS', {Name: 'PrimalSpellAttacks', Category: 'SpellAttack'});
g_profConversionMap.set('DIVINESPELLATTACKS', {Name: 'DivineSpellAttacks', Category: 'SpellAttack'});

g_profConversionMap.set('ARCANESPELLDCS', {Name: 'ArcaneSpellDCs', Category: 'SpellDC'});
g_profConversionMap.set('OCCULTSPELLDCS', {Name: 'OccultSpellDCs', Category: 'SpellDC'});
g_profConversionMap.set('PRIMALSPELLDCS', {Name: 'PrimalSpellDCs', Category: 'SpellDC'});
g_profConversionMap.set('DIVINESPELLDCS', {Name: 'DivineSpellDCs', Category: 'SpellDC'});

g_profConversionMap.set('ARCANESPELLDC', {Name: 'ArcaneSpellDCs', Category: 'SpellDC'});
g_profConversionMap.set('OCCULTSPELLDC', {Name: 'OccultSpellDCs', Category: 'SpellDC'});
g_profConversionMap.set('PRIMALSPELLDC', {Name: 'PrimalSpellDCs', Category: 'SpellDC'});
g_profConversionMap.set('DIVINESPELLDC', {Name: 'DivineSpellDCs', Category: 'SpellDC'});

g_profConversionMap.set('ACROBATICS', {Name: 'Acrobatics', Category: 'Skill'});
g_profConversionMap.set('ARCANA', {Name: 'Arcana', Category: 'Skill'});
g_profConversionMap.set('ATHLETICS', {Name: 'Athletics', Category: 'Skill'});
g_profConversionMap.set('CRAFTING', {Name: 'Crafting', Category: 'Skill'});
g_profConversionMap.set('DECEPTION', {Name: 'Deception', Category: 'Skill'});
g_profConversionMap.set('DIPLOMACY', {Name: 'Diplomacy', Category: 'Skill'});
g_profConversionMap.set('INTIMIDATION', {Name: 'Intimidation', Category: 'Skill'});
g_profConversionMap.set('MEDICINE', {Name: 'Medicine', Category: 'Skill'});
g_profConversionMap.set('NATURE', {Name: 'Nature', Category: 'Skill'});
g_profConversionMap.set('OCCULTISM', {Name: 'Occultism', Category: 'Skill'});
g_profConversionMap.set('PERFORMANCE', {Name: 'Performance', Category: 'Skill'});
g_profConversionMap.set('RELIGION', {Name: 'Religion', Category: 'Skill'});
g_profConversionMap.set('SOCIETY', {Name: 'Society', Category: 'Skill'});
g_profConversionMap.set('STEALTH', {Name: 'Stealth', Category: 'Skill'});
g_profConversionMap.set('SURVIVAL', {Name: 'Survival', Category: 'Skill'});
g_profConversionMap.set('THIEVERY', {Name: 'Thievery', Category: 'Skill'});

let hasInit = false;
let g_expr_level, g_expr_focusPoints, g_expr_profMap, g_expr_senseArray,
        g_expr_heritage, g_expr_classAbilityArray, g_expr_featDataMap, g_expr_featNameArray = null;

function initExpressionProcessor(expDataStruct){

    g_expr_level = expDataStruct.ChoiceStruct.Character.level;
    g_expr_profMap = objToMap(expDataStruct.ChoiceStruct.ProfObject);
    g_expr_heritage = expDataStruct.ChoiceStruct.Heritage;
    g_expr_focusPoints = expDataStruct.ChoiceStruct.FocusPointArray.length;
    g_expr_senseArray = expDataStruct.ChoiceStruct.SenseArray;

    if(expDataStruct.ChoiceStruct.ClassDetails != null){
        g_expr_classAbilityArray = [];
        if(expDataStruct.ChoiceStruct.ClassDetails.Abilities != null){
            for(let classAbility of expDataStruct.ChoiceStruct.ClassDetails.Abilities){
                if(classAbility.level == -1) {continue;}
                if(classAbility.level <= g_expr_level) {
                    if(classAbility.selectType != 'SELECT_OPTION'){
                        g_expr_classAbilityArray.push(classAbility.name.toUpperCase());
                    } else {
                        let choiceData = expDataStruct.ChoiceStruct.ChoiceArray.find(choiceData => {
                            return classAbility.id == choiceData.OptionID;
                        });
                        if(choiceData != null){
                            g_expr_classAbilityArray.push(classAbility.name.toUpperCase());
                        }
                    }
                }
            }
            for(let classAbility of expDataStruct.ChoiceStruct.ExtraClassFeaturesArray){
              if(classAbility.value.name != null){
                g_expr_classAbilityArray.push(classAbility.value.name.toUpperCase());
              }
            }
        }
    }

    if(expDataStruct.ChoiceStruct.FeatArray != null){
      g_expr_featNameArray = [];
      g_expr_featDataMap = new Map();
      for(let feat of expDataStruct.ChoiceStruct.FeatArray){
        if(feat.value != null){
          let featName = feat.value.name.toUpperCase();
          g_expr_featNameArray.push(featName);
          g_expr_featDataMap.set(featName, feat);
        }
      }
    }

    hasInit = true;

}

function updateExpressionProcessor(expDataStruct){
    initExpressionProcessor(expDataStruct);
}


function testExpr(wscCode, srcStruct=null){
    if(!hasInit) {
        displayError("Expression Processor has not been init!");
        return null;
    }

    // IF(*){*} or IF(*){*}ELSE{*}
    let rMatchIf = wscCode.match(/^\s*IF\s*\((.*?)\)\s*\{(.*?)\}\s*$/);
    let rMatchIfElse = wscCode.match(/^\s*IF\s*\((.*?)\)\s*\{(.*?)\}\s*ELSE\s*\{(.*?)\}\s*$/);
    let rMatchIfSheet = wscCode.match(/^\s*IF-SHEET\s*\((.*?)\)\s*\{(.*?)\}\s*$/);
    if(rMatchIf == null && rMatchIfElse == null && rMatchIfSheet == null) { return wscCode; }

    let expression;
    let statement;
    let elseStatement;
    if(rMatchIfElse != null){
        expression = rMatchIfElse[1];
        statement = rMatchIfElse[2];
        elseStatement = rMatchIfElse[3];
    } else if(rMatchIf != null){
        expression = rMatchIf[1];
        statement = rMatchIf[2];
        elseStatement = null;
    } else if(rMatchIfSheet != null){
        expression = rMatchIfSheet[1];
        statement = rMatchIfSheet[2];
        elseStatement = null;
        // If not on the character sheet, treat expression as true
        if(!isSheetPage()){ return statement; }
    }


    if(expression.includes(' && ')){
        let expParts = expression.split(' && ');
        
        let allTrue = true;
        for(let expPart of expParts){
            let resultStatement = expHandleExpression(expPart, statement, elseStatement, srcStruct);
            if(resultStatement != statement){
                allTrue = false;
            }
        }

        if(allTrue) {
            return statement;
        } else {
            return elseStatement;
        }
        
    } else {

        let result = expHandleExpression(expression, statement, elseStatement, srcStruct);
        if(result != -1){
            return result;
        } else {
            displayError("Unknown expression: \'"+expression+"\'");
            return null;
        }

    }

}

function expHandleExpression(expression, statement, elseStatement, srcStruct){

    if(expression.includes('HAS-LEVEL')){ // HAS-LEVEL==13
        return expHasLevel(expression, statement, elseStatement);
    }

    if(expression.includes('HAS-FOCUS-POINTS')){ // HAS-FOCUS-POINTS==3
        return expHasFocusPoints(expression, statement, elseStatement);
    }

    if(expression.includes('HAS-HERITAGE')){ // HAS-HERITAGE==Treedweller
        return expHasHeritage(expression, statement, elseStatement);
    }

    if(expression.includes('HAS-CLASS-ABILITY')){ // HAS-CLASS-ABILITY==Cloistered Cleric
        return expHasClassAbility(expression, statement, elseStatement);
    }

    if(expression.includes('HAS-FEAT')){ // HAS-FEAT==Specialty Crafting
        return expHasFeat(expression, statement, elseStatement, srcStruct);
    }

    if(expression.includes('HAS-PROF')){ // HAS-PROF==Arcana:T
        return expHasProf(expression, statement, elseStatement, srcStruct);
    }

    if(expression.includes('HAS-VISION')){ // HAS-VISION==Darkvision
        return expHasVision(expression, statement, elseStatement, srcStruct);
    }

    /* Sheet-Only Expressions */
    if(expression.includes('IS-UNARMORED')){ // IS-UNARMORED
      return expIsUnarmored(expression, statement, elseStatement);
    }

    if(expression.includes('IS-TOGGLED')){ // IS-TOGGLED==Rage
      return expIsToggled(expression, statement, elseStatement);
    }

    return -1;

}

function expHasLevel(expression, statement, elseStatement){
    return expHasNumberCompare(g_expr_level, expression, statement, elseStatement);
}

function expHasFocusPoints(expression, statement, elseStatement){
    return expHasNumberCompare(g_expr_focusPoints, expression, statement, elseStatement);
}

function expHasNumberCompare(charVarNumber, expression, statement, elseStatement){
    if(expression.includes('==')){
        let number = parseInt(expression.split('==')[1]);
        if(!isNaN(number)){
            if(charVarNumber == number){
                return statement;
            } else {
                return elseStatement;
            }
        }
    } else if(expression.includes('>=')){
        let number = parseInt(expression.split('>=')[1]);
        if(!isNaN(number)){
            if(charVarNumber >= number){
                return statement;
            } else {
                return elseStatement;
            }
        }
    } else if(expression.includes('<=')){
        let number = parseInt(expression.split('<=')[1]);
        if(!isNaN(number)){
            if(charVarNumber <= number){
                return statement;
            } else {
                return elseStatement;
            }
        }
    } else if(expression.includes('!=')){
        let number = parseInt(expression.split('!=')[1]);
        if(!isNaN(number)){
            if(charVarNumber != number){
                return statement;
            } else {
                return elseStatement;
            }
        }
    }
    return null;
}

function expHasHeritage(expression, statement, elseStatement){
    if(g_expr_heritage == null) { return elseStatement; }
    if(expression.includes('==')){
        let heritageName = expression.split('==')[1].toUpperCase();
        let currentHeritageName = g_expr_heritage.name.toUpperCase();
        if(currentHeritageName.startsWith(heritageName)){
            return statement;
        } else {
            return elseStatement;
        }
    } else if(expression.includes('!=')){
        let heritageName = expression.split('!=')[1].toUpperCase();
        let currentHeritageName = g_expr_heritage.name.toUpperCase();
        if(!currentHeritageName.startsWith(heritageName)){
            return statement;
        } else {
            return elseStatement;
        }
    }
}

function expHasClassAbility(expression, statement, elseStatement){
    if(expression.includes('==')){
        let classAbilityName = expression.split('==')[1].toUpperCase();
        classAbilityName = classAbilityName.replace(/_/g," ");
        if(g_expr_classAbilityArray.includes(classAbilityName)){
            return statement;
        } else {
            return elseStatement;
        }
    } else if(expression.includes('!=')){
        let classAbilityName = expression.split('!=')[1].toUpperCase();
        classAbilityName = classAbilityName.replace(/_/g," ");
        if(!g_expr_classAbilityArray.includes(classAbilityName)){
            return statement;
        } else {
            return elseStatement;
        }
    }
}

function expHasFeat(expression, statement, elseStatement, srcStruct){
    if(expression.includes('==')){
        let featName = expression.split('==')[1].toUpperCase();
        featName = featName.replace(/_/g," ");
        if(g_expr_featNameArray.includes(featName) && !hasSameSrc(srcStruct, g_expr_featDataMap.get(featName))){
            return statement;
        } else {
            return elseStatement;
        }
    } else if(expression.includes('!=')){
        let featName = expression.split('!=')[1].toUpperCase();
        featName = featName.replace(/_/g," ");
        if(!g_expr_featNameArray.includes(featName)){
            return statement;
        } else {
            return elseStatement;
        }
    }
}

function expHasVision(expression, statement, elseStatement, srcStruct){
    if(expression.includes('==')){
        let visionName = expression.split('==')[1].toUpperCase();
        visionName = visionName.replace(/_/g," ");
        let vision = g_expr_senseArray.find(senseData => {
            if(senseData.value != null && !hasSameSrc(srcStruct, senseData)){
                return visionName === senseData.value.name.toUpperCase();
            } else {
                return false;
            }
        });
        if(vision != null){
            return statement;
        } else {
            return elseStatement;
        }
    } else if(expression.includes('!=')){
        let visionName = expression.split('!=')[1].toUpperCase();
        visionName = visionName.replace(/_/g," ");
        let vision = g_expr_senseArray.find(senseData => {
            if(senseData.value != null && !hasSameSrc(srcStruct, senseData)){
                return visionName === senseData.value.name.toUpperCase();
            } else {
                return false;
            }
        });
        if(vision == null){
            return statement;
        } else {
            return elseStatement;
        }
    }
}

function expHasProf(expression, statement, elseStatement, srcStruct){
    let data;
    let boolOp;
    if(expression.includes('==')){
        data = expression.split('==')[1];
        boolOp = 'EQUALS';
    } else if(expression.includes('>=')){
        data = expression.split('>=')[1];
        boolOp = 'GREATER-EQUALS';
    } else if(expression.includes('<=')){
        data = expression.split('<=')[1];
        boolOp = 'LESSER-EQUALS';
    } else if(expression.includes('!=')){
        data = expression.split('!=')[1];
        boolOp = 'NOT-EQUALS';
    } else {
        return null;
    }

    let segments = data.split(':');

    let profName = segments[0];
    let profType = segments[1];

    profName = profName.replace(/_|\s+/g,"");
    let profData = g_profConversionMap.get(profName);

    let numUps = profToNumUp(profType);
    if(numUps === -1){return null;}

    let foundProf = false;
    for(const [profMapName, profMapDataArray] of g_expr_profMap.entries()){
        const finalProfData = getFinalProf(cleanProfDataArrayOfStatementProfs(profMapDataArray, srcStruct));
        if(finalProfData == null) { continue; }
        if(profData == null){
            let tempSkillName = finalProfData.Name.toUpperCase();
            tempSkillName = tempSkillName.replace(/_|\s+/g,"");
            if(tempSkillName === profName.toUpperCase()) {
              foundProf = true;
              if(expHasProfNumUpsCompare(finalProfData.NumUps, boolOp, numUps)) {
                return statement;
              }
            }
        } else {
            if(finalProfData.Name === profData.Name) {
              foundProf = true;
              if (expHasProfNumUpsCompare(finalProfData.NumUps, boolOp, numUps)){
                return statement;
              }
            }
        }
    }
    if(numUps === 0 && !foundProf){ return statement; }
    
    return elseStatement;
}

function expHasProfNumUpsCompare(numUpsOne, boolOp, numUpsTwo){
    switch(boolOp) {
        case 'EQUALS': return numUpsOne == numUpsTwo;
        case 'NOT-EQUALS': return numUpsOne != numUpsTwo;
        case 'GREATER-EQUALS': return numUpsOne >= numUpsTwo;
        case 'LESSER-EQUALS': return numUpsOne <= numUpsTwo;
        default: return false;
    }
}

function cleanProfDataArrayOfStatementProfs(profDataArray, srcStruct){
  if(srcStruct == null) {return profDataArray;}
  let newProfDataArray = [];
  for(let profData of profDataArray) {
    if(!hasSameSrc(srcStruct, profData)){
      newProfDataArray.push(profData);
    }
  }
  return newProfDataArray;
}


/*~ Sheet-Only Expressions ~*/

function expIsUnarmored(expression, statement, elseStatement) {
  if (typeof g_equippedArmorInvItemID !== 'undefined') {
    return (g_equippedArmorInvItemID == null) ? statement : elseStatement;
  } else {
    return null;
  }
}

function expIsToggled(expression, statement, elseStatement) {
  if(!isSheetPage()) { return null; }
  if(expression.includes('==')){
    let sheetStateName = expression.split('==')[1].toUpperCase();
    let sheetState = getSheetStateByName(sheetStateName);
    if(sheetState != null){
      return (isSheetStateActive(sheetState.id)) ? statement : elseStatement;
    } else {
      displayError("Cannot find toggleable '"+sheetStateName+"'!");
      return null;
    }
  } else if(expression.includes('!=')){
    let sheetStateName = expression.split('!=')[1].toUpperCase();
    let sheetState = getSheetStateByName(sheetStateName);
    if(sheetState != null){
      return (isSheetStateActive(sheetState.id)) ? elseStatement : statement;
    } else {
      displayError("Cannot find toggleable '"+sheetStateName+"'!");
      return null;
    }
  }
}