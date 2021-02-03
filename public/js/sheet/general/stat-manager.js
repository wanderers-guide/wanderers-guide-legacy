/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_statManagerMap = null;
let g_conditionalStatManagerMap = null;

// key(name) value([ {Source, Value}, {Source, Value} ])
/*
        Keys
        'SCORE_STR'
        'SAVE_FORT'

        Values
        'BASE' -> Number

        'PROF_BONUS' -> NumUps

        'USER_BONUS' -> Number
        'CIRCUM_BONUS' -> Number
        'STATUS_BONUS' -> Number
        'ITEM_BONUS' -> Number
        'OTHER-(SRC-NAME)_BONUS' -> Number

        'USER_PENALTY' -> Number
        'CIRCUM_PENALTY' -> Number
        'STATUS_PENALTY' -> Number
        'ITEM_PENALTY' -> Number
        'OTHER-(SRC-NAME)_PENALTY' -> Number

        'MODIFIER' -> 'STR'/'DEX'/'CON'/'INT'/'WIS'/'CHA'

*/

function initStats(){
    g_statManagerMap = new Map();
    g_conditionalStatManagerMap = new Map();
}

function addStat(statName, source, value){
    addStatAndSrc(statName, source, value, 'CORE');
}

function addStatAndSrc(statName, source, value, statSrc){
    statName = statName.replace(/\s/g, "_").toUpperCase();
    let statDataMap = g_statManagerMap.get(statName);
    if(statDataMap != null){
        let existingData = statDataMap.get(source);
        if(existingData != null){
            if(existingData.Value > value) {
                value = existingData.Value;
                statSrc = existingData.Src;
            }
        }
        statDataMap.set(source, {Value: value, Src: statSrc});
        g_statManagerMap.set(statName, statDataMap);
    } else {
        statDataMap = new Map();
        statDataMap.set(source, {Value: value, Src: statSrc});
        g_statManagerMap.set(statName, statDataMap);
    }
}

function removeStat(statName, source){
    statName = statName.replace(/\s/g, "_").toUpperCase();
    let statDataMap = g_statManagerMap.get(statName);
    if(statDataMap != null){
        statDataMap.delete(source);
    }
}

function removeStat(statName){
    statName = statName.replace(/\s/g, "_").toUpperCase();
    g_statManagerMap.delete(statName);
}

function getStat(statName, source){
    statName = statName.replace(/\s/g, "_").toUpperCase();
    let statDataMap = g_statManagerMap.get(statName);
    if(statDataMap != null){
        let value = statDataMap.get(source).Value;
        if(value === 'LAND_SPEED'){
            value = getStatTotal('SPEED');
        }
        return value;
    } else {
        return null;
    }
}

function getStatTotal(statName){
    statName = statName.replace(/\s/g, "_").toUpperCase();
    let total = null;
    let statDataMap = g_statManagerMap.get(statName);
    if(statDataMap != null){
        total = 0;
        for(let [source, valueData] of statDataMap){
            let value = valueData.Value;
            if(value === 'LAND_SPEED'){
                value = getStatTotal('SPEED');
            }
            if(source === 'PROF_BONUS'){
                total += getProfNumber(value, g_character.level);
            } else if(source === 'MODIFIER') {
                total += getModOfValue(value);
            } else {
                total += parseInt(value);
            }
        }
    }
    return total;
}

function getStatExtraBonuses(statName){
    statName = statName.replace(/\s/g, "_").toUpperCase();
    let extraBonuses = null;
    let statDataMap = g_statManagerMap.get(statName);
    if(statDataMap != null){
        extraBonuses = [];
        for(const [source, valueData] of statDataMap.entries()){
            if(source != 'PROF_BONUS' && source != 'MODIFIER' && source != 'BASE' && valueData.Value != 0){
                let cleanedSource = source.replace(/_/g, " ").toLowerCase();
                if(cleanedSource.startsWith('other-')){
                    if(cleanedSource.includes('bonus')){
                        cleanedSource = 'bonus';
                    } else if(cleanedSource.includes('penalty')){
                        cleanedSource = 'penalty';
                    }
                }
                let statSource = (valueData.Src == 'CORE') ? null : capitalizeWords(valueData.Src);
                if(statSource != null) {
                    extraBonuses.push(signNumber(valueData.Value)+' '+cleanedSource+' from '+statSource);
                } else {
                    extraBonuses.push(signNumber(valueData.Value)+' '+cleanedSource);
                }
            }
        }
    }
    return extraBonuses;
}

function getStatMap(statName){
    statName = statName.replace(/\s/g, "_").toUpperCase();
    return g_statManagerMap.get(statName);
}

function getModOfValue(valueModName){
    if(valueModName == null){ return 0; }
    valueModName = valueModName+''; // Convert to string, in case a num is passed
    valueModName = valueModName.toUpperCase();
    switch(valueModName) {
        case 'STR':
            return getMod(getStatTotal('SCORE_STR'));
        case 'DEX':
            return getMod(getStatTotal('SCORE_DEX'));
        case 'CON':
            return getMod(getStatTotal('SCORE_CON'));
        case 'INT':
            return getMod(getStatTotal('SCORE_INT'));
        case 'WIS':
            return getMod(getStatTotal('SCORE_WIS'));
        case 'CHA':
            return getMod(getStatTotal('SCORE_CHA'));
        default:
            return null;
    }
}


// Conditionals //

function addConditionalStat(statName, condition, value){
    statName = statName.replace(/\s/g, "_").toUpperCase();
    let statDataMap = g_conditionalStatManagerMap.get(statName);
    if(statDataMap != null){
        let existingDataValue = statDataMap.get(condition);
        if(existingDataValue != null){
            if(existingDataValue > value) {
                value = existingDataValue;
            }
        }
        statDataMap.set(condition, value);
        g_conditionalStatManagerMap.set(statName, statDataMap);
    } else {
        statDataMap = new Map();
        statDataMap.set(condition, value);
        g_conditionalStatManagerMap.set(statName, statDataMap);
    }
}

function removeConditionalStat(statName, condition){
    statName = statName.replace(/\s/g, "_").toUpperCase();
    let statDataMap = g_conditionalStatManagerMap.get(statName);
    if(statDataMap != null){
        statDataMap.delete(condition);
    }
}

function removeConditionalStat(statName){
    statName = statName.replace(/\s/g, "_").toUpperCase();
    g_conditionalStatManagerMap.delete(statName);
}

function getConditionalStat(statName, condition){
    statName = statName.replace(/\s/g, "_").toUpperCase();
    let statDataMap = g_conditionalStatManagerMap.get(statName);
    if(statDataMap != null){
        return statDataMap.get(condition);
    } else {
        return null;
    }
}

function getConditionalStatMap(statName){
    statName = statName.replace(/\s/g, "_").toUpperCase();
    return g_conditionalStatManagerMap.get(statName);
}

function hasConditionals(statName){
    statName = statName.replace(/\s/g, "_").toUpperCase();
    return g_conditionalStatManagerMap.get(statName) != null;
}