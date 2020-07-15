
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
let g_expr_level, g_expr_profMap, g_expr_heritage, g_expr_classAbilityArray, g_expr_featArray = null;

function initExpressionProcessor(expDataStruct){

    g_expr_level = expDataStruct.ChoiceStruct.Level;
    g_expr_profMap = objToMap(expDataStruct.ChoiceStruct.FinalProfObject);
    g_expr_heritage = expDataStruct.ChoiceStruct.Heritage;

    if(expDataStruct.ChoiceStruct.ClassDetails != null){
        g_expr_classAbilityArray = [];
        if(expDataStruct.ChoiceStruct.ClassDetails.Abilities != null){
            for(let classAbility of expDataStruct.ChoiceStruct.ClassDetails.Abilities){
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
        }
    }

    if(expDataStruct.ChoiceStruct.FeatArray != null){
        g_expr_featArray = [];
        for(let feat of expDataStruct.ChoiceStruct.FeatArray){
            if(feat.value != null){
                g_expr_featArray.push(feat.value.name.toUpperCase());
            }
        }
    }

    hasInit = true;

}

function updateExpressionProcessor(expDataStruct){
    initExpressionProcessor(expDataStruct);
}


function testExpr(wscCode){
    if(!hasInit) {
        displayError("Expression Processor has not been init!");
        return null;
    }

    // IF(*){*} or IF(*){*}ELSE{*}
    let rMatchIf = wscCode.match(/^\s*IF\s*\((.*?)\)\s*\{(.*?)\}\s*$/);
    let rMatchIfElse = wscCode.match(/^\s*IF\s*\((.*?)\)\s*\{(.*?)\}\s*ELSE\s*\{(.*?)\}\s*$/);
    if(rMatchIf == null && rMatchIfElse == null) { return wscCode; }

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
    }

    if(expression.includes('HAS-LEVEL')){ // HAS-LEVEL==13
        return expHasLevel(expression, statement, elseStatement);
    }

    if(expression.includes('HAS-HERITAGE')){ // HAS-HERITAGE==Treedweller
        return expHasHeritage(expression, statement, elseStatement);
    }

    if(expression.includes('HAS-CLASS-ABILITY')){ // HAS-CLASS-ABILITY==Cloistered Cleric
        return expHasClassAbility(expression, statement, elseStatement);
    }

    if(expression.includes('HAS-FEAT')){ // HAS-FEAT==Specialty Crafting
        return expHasFeat(expression, statement, elseStatement);
    }

    if(expression.includes('HAS-PROF')){ // HAS-PROF==Arcana:T
        return expHasProf(expression, statement, elseStatement);
    }

    displayError("Unknown expression: \'"+expression+"\'");
    return null;
}

function expHasLevel(expression, statement, elseStatement){
    if(expression.includes('==')){
        let level = parseInt(expression.split('==')[1]);
        if(!isNaN(level)){
            if(g_expr_level == level){
                return statement;
            } else {
                return elseStatement;
            }
        }
    } else if(expression.includes('>=')){
        let level = parseInt(expression.split('>=')[1]);
        if(!isNaN(level)){
            if(g_expr_level >= level){
                return statement;
            } else {
                return elseStatement;
            }
        }
    } else if(expression.includes('<=')){
        let level = parseInt(expression.split('<=')[1]);
        if(!isNaN(level)){
            if(g_expr_level <= level){
                return statement;
            } else {
                return elseStatement;
            }
        }
    } else if(expression.includes('!=')){
        let level = parseInt(expression.split('!=')[1]);
        if(!isNaN(level)){
            if(g_expr_level != level){
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

function expHasFeat(expression, statement, elseStatement){
    if(expression.includes('==')){
        let featName = expression.split('==')[1].toUpperCase();
        featName = featName.replace(/_/g," ");
        if(g_expr_featArray.includes(featName)){
            return statement;
        } else {
            return elseStatement;
        }
    } else if(expression.includes('!=')){
        let featName = expression.split('!=')[1].toUpperCase();
        featName = featName.replace(/_/g," ");
        if(!g_expr_featArray.includes(featName)){
            return statement;
        } else {
            return elseStatement;
        }
    }
}

function expHasProf(expression, statement, elseStatement){
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

    for(const [profMapName, profMapData] of g_expr_profMap.entries()){
        if(profData == null){
            let tempSkillName = profMapData.Name.toUpperCase();
            tempSkillName = tempSkillName.replace(/_|\s+/g,"");
            if(tempSkillName === profName && expHasProfNumUpsCompare(profMapData.NumUps, boolOp, numUps)) {
                return statement;
            }
        } else {
            if(profMapData.Name === profData.Name && expHasProfNumUpsCompare(profMapData.NumUps, boolOp, numUps)){
                return statement;
            }
        }
    }
    
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

