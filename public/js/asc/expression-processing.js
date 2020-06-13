
let g_profConversionMap = new Map();

g_profConversionMap.set('LIGHTARMOR', {Name: 'Light_Armor', Category: 'Defense'});
g_profConversionMap.set('MEDIUMARMOR', {Name: 'Medium_Armor', Category: 'Defense'});
g_profConversionMap.set('HEAVYARMOR', {Name: 'Heavy_Armor', Category: 'Defense'});
g_profConversionMap.set('UNARMOREDDEFENSE', {Name: 'Unarmored_Defense', Category: 'Defense'});

g_profConversionMap.set('SINGLEWEAPONS', {Name: 'Simple_Weapons', Category: 'Attack'});
g_profConversionMap.set('MARTIALWEAPONS', {Name: 'Martial_Weapons', Category: 'Attack'});
g_profConversionMap.set('ADVANCEDWEAPONS', {Name: 'Advanced_Weapons', Category: 'Attack'});
g_profConversionMap.set('UNARMEDATTACKS', {Name: 'Unarmed_Attacks', Category: 'Attack'});

g_profConversionMap.set('FORTITUDE', {Name: 'Fortitude', Category: 'Save'});
g_profConversionMap.set('REFLEX', {Name: 'Reflex', Category: 'Save'});
g_profConversionMap.set('WILL', {Name: 'Will', Category: 'Save'});

g_profConversionMap.set('PERCEPTION', {Name: 'Perception', Category: 'Perception'});

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
let g_expr_level, g_expr_profMap = null;

function initExpressionProcessor(level, finalProfObject){

    g_expr_level = level;
    g_expr_profMap = objToMap(finalProfObject);
    hasInit = true;

}

function updateExpressionProcessor(level, finalProfObject){
    initExpressionProcessor(level, finalProfObject);
}


function testExpr(ascCode){
    if(!hasInit) {
        displayError("Expression Processor has not been init!");
        return null;
    }

    // IF(*){*}
    let rMatch = ascCode.match(/^\s*IF\s*\((.*?)\)\s*\{(.+?)\}\s*$/);
    if(rMatch == null) { return ascCode; }
    let expression = rMatch[1];
    let statement = rMatch[2];

    if(expression.includes('HAS-LEVEL')){ // HAS-LEVEL=13
        return expHasLevel(expression, statement);
    }

    if(expression.includes('HAS-PROF')){ // HAS-PROF=Arcana:T
        return expHasProf(expression, statement);
    }

    displayError("Unknown expression: \'"+expression+"\'");
    return null;
}


function expHasLevel(expression, statement){
    let level = parseInt(expression.split('=')[1]);
    if(!isNaN(level) && g_expr_level >= level ){
        return statement;
    }
    return null;
}


function expHasProf(expression, statement){
    let data = expression.split('=')[1];
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
            if(tempSkillName === profName && profMapData.NumUps === numUps) {
                return statement;
            }
        } else {
            if(profMapData.Name === profData.Name && profMapData.NumUps === numUps){
                return statement;
            }
        }
    }
    
    return null;
}

