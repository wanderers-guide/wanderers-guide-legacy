
const Character = require('../models/contentDB/Character');
const Spell = require('../models/contentDB/Spell');
const SpellBookSpell = require('../models/contentDB/SpellBookSpell');

const CharDataStoring = require('./CharDataStoring');

// Hardcoded Spell Slots for Casting Type
function getSpellSlots(spellcasting){
    let SID = getRandomSID();
    if(spellcasting === 'THREE-QUARTERS'){
        return {
            cantrip: [
                {slotID: SID+1, used: false, spellID: null, level_lock: 1},
                {slotID: SID+2, used: false, spellID: null, level_lock: 1},
                {slotID: SID+3, used: false, spellID: null, level_lock: 1},
                {slotID: SID+4, used: false, spellID: null, level_lock: 1},
                {slotID: SID+5, used: false, spellID: null, level_lock: 1},
            ],
            firstLevel: [
                {slotID: SID+6, used: false, spellID: null, level_lock: 1},
                {slotID: SID+7, used: false, spellID: null, level_lock: 1},
                {slotID: SID+8, used: false, spellID: null, level_lock: 2},
            ],
            secondLevel: [
                {slotID: SID+9, used: false, spellID: null, level_lock: 3},
                {slotID: SID+10, used: false, spellID: null, level_lock: 3},
                {slotID: SID+11, used: false, spellID: null, level_lock: 4},
            ],
            thirdLevel: [
                {slotID: SID+12, used: false, spellID: null, level_lock: 5},
                {slotID: SID+13, used: false, spellID: null, level_lock: 5},
                {slotID: SID+14, used: false, spellID: null, level_lock: 6},
            ],
            fourthLevel: [
                {slotID: SID+15, used: false, spellID: null, level_lock: 7},
                {slotID: SID+16, used: false, spellID: null, level_lock: 7},
                {slotID: SID+17, used: false, spellID: null, level_lock: 8},
            ],
            fifthLevel: [
                {slotID: SID+18, used: false, spellID: null, level_lock: 9},
                {slotID: SID+19, used: false, spellID: null, level_lock: 9},
                {slotID: SID+20, used: false, spellID: null, level_lock: 10},
            ],
            sixthLevel: [
                {slotID: SID+21, used: false, spellID: null, level_lock: 11},
                {slotID: SID+22, used: false, spellID: null, level_lock: 11},
                {slotID: SID+23, used: false, spellID: null, level_lock: 12},
            ],
            seventhLevel: [
                {slotID: SID+24, used: false, spellID: null, level_lock: 13},
                {slotID: SID+25, used: false, spellID: null, level_lock: 13},
                {slotID: SID+26, used: false, spellID: null, level_lock: 14},
            ],
            eighthLevel: [
                {slotID: SID+27, used: false, spellID: null, level_lock: 15},
                {slotID: SID+28, used: false, spellID: null, level_lock: 15},
                {slotID: SID+29, used: false, spellID: null, level_lock: 16},
            ],
            ninthLevel: [
                {slotID: SID+30, used: false, spellID: null, level_lock: 17},
                {slotID: SID+31, used: false, spellID: null, level_lock: 17},
                {slotID: SID+32, used: false, spellID: null, level_lock: 18},
            ],
            tenthLevel: []
        };
    } else if(spellcasting === 'FULL'){
        return {
            cantrip: [
                {slotID: SID+1, used: false, spellID: null, level_lock: 1},
                {slotID: SID+2, used: false, spellID: null, level_lock: 1},
                {slotID: SID+3, used: false, spellID: null, level_lock: 1},
                {slotID: SID+4, used: false, spellID: null, level_lock: 1},
                {slotID: SID+5, used: false, spellID: null, level_lock: 1},
            ],
            firstLevel: [
                {slotID: SID+6, used: false, spellID: null, level_lock: 1},
                {slotID: SID+7, used: false, spellID: null, level_lock: 1},
                {slotID: SID+8, used: false, spellID: null, level_lock: 1},
                {slotID: SID+9, used: false, spellID: null, level_lock: 2},
            ],
            secondLevel: [
                {slotID: SID+10, used: false, spellID: null, level_lock: 3},
                {slotID: SID+11, used: false, spellID: null, level_lock: 3},
                {slotID: SID+12, used: false, spellID: null, level_lock: 3},
                {slotID: SID+13, used: false, spellID: null, level_lock: 4},
            ],
            thirdLevel: [
                {slotID: SID+14, used: false, spellID: null, level_lock: 5},
                {slotID: SID+15, used: false, spellID: null, level_lock: 5},
                {slotID: SID+16, used: false, spellID: null, level_lock: 5},
                {slotID: SID+17, used: false, spellID: null, level_lock: 6},
            ],
            fourthLevel: [
                {slotID: SID+18, used: false, spellID: null, level_lock: 7},
                {slotID: SID+19, used: false, spellID: null, level_lock: 7},
                {slotID: SID+20, used: false, spellID: null, level_lock: 7},
                {slotID: SID+21, used: false, spellID: null, level_lock: 8},
            ],
            fifthLevel: [
                {slotID: SID+22, used: false, spellID: null, level_lock: 9},
                {slotID: SID+23, used: false, spellID: null, level_lock: 9},
                {slotID: SID+24, used: false, spellID: null, level_lock: 9},
                {slotID: SID+25, used: false, spellID: null, level_lock: 10},
            ],
            sixthLevel: [
                {slotID: SID+26, used: false, spellID: null, level_lock: 11},
                {slotID: SID+27, used: false, spellID: null, level_lock: 11},
                {slotID: SID+28, used: false, spellID: null, level_lock: 11},
                {slotID: SID+29, used: false, spellID: null, level_lock: 12},
            ],
            seventhLevel: [
                {slotID: SID+30, used: false, spellID: null, level_lock: 13},
                {slotID: SID+31, used: false, spellID: null, level_lock: 13},
                {slotID: SID+32, used: false, spellID: null, level_lock: 13},
                {slotID: SID+33, used: false, spellID: null, level_lock: 14},
            ],
            eighthLevel: [
                {slotID: SID+34, used: false, spellID: null, level_lock: 15},
                {slotID: SID+35, used: false, spellID: null, level_lock: 15},
                {slotID: SID+36, used: false, spellID: null, level_lock: 15},
                {slotID: SID+37, used: false, spellID: null, level_lock: 16},
            ],
            ninthLevel: [
                {slotID: SID+38, used: false, spellID: null, level_lock: 17},
                {slotID: SID+39, used: false, spellID: null, level_lock: 17},
                {slotID: SID+40, used: false, spellID: null, level_lock: 17},
                {slotID: SID+41, used: false, spellID: null, level_lock: 18},
            ],
            tenthLevel: []
        };
    } else {
        return null;
    }
}

function levelToRowName(spellLevel){
    spellLevel = parseInt(spellLevel);
    switch(spellLevel){
        case 0: return 'cantrip';
        case 1: return 'firstLevel';
        case 2: return 'secondLevel';
        case 3: return 'thirdLevel';
        case 4: return 'fourthLevel';
        case 5: return 'fifthLevel';
        case 6: return 'sixthLevel';
        case 7: return 'seventhLevel';
        case 8: return 'eighthLevel';
        case 9: return 'ninthLevel';
        case 10: return 'tenthLevel';
        default: return null;
    }
}

function rowNameToLevel(rowName){
    switch(rowName){
        case 'cantrip': return 0;
        case 'firstLevel': return 1;
        case 'secondLevel': return 2;
        case 'thirdLevel': return 3;
        case 'fourthLevel': return 4;
        case 'fifthLevel': return 5;
        case 'sixthLevel': return 6;
        case 'seventhLevel': return 7;
        case 'eighthLevel': return 8;
        case 'ninthLevel': return 9;
        case 'tenthLevel': return 10;
        default: return null;
    }
}

function objToMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
}

function hashCode(str) {
    return str.split('').reduce((prevHash, currVal) =>
      (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

function getRandomSID() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

function getKeyAbilityFromSpellSRC(spellKeyAbilitiesDataMap, spellSRC){
    spellSRC = spellSRC+"=";
    for(const [srcID, spellKeyAbilitiesDataArray] of spellKeyAbilitiesDataMap.entries()){
        for(const spellKeyAbilitiesData of spellKeyAbilitiesDataArray){
            if(spellKeyAbilitiesData.includes(spellSRC)){
                return spellKeyAbilitiesData.replace(spellSRC, '');
            }
        }
    }
    return 'CHA';
}

module.exports = class CharSpells {

    static removeFromSpellBook(charID, spellSRC, spellID){
        return SpellBookSpell.destroy({ // Delete SpellBookSpell
            where: {
                charID: charID,
                spellSRC: spellSRC,
                spellID: spellID,
            },
            limit: 1,
        }).then((result) => {
            return;
        });
    }

    static addToSpellBook(charID, spellSRC, spellID){
        return SpellBookSpell.create({ // Create SpellBookSpell
            spellSRC: spellSRC,
            charID: charID,
            spellID: spellID,
        }).then(spellBookSpell => {
            return spellBookSpell;
        });
    }

    static getSpellBook(charID, spellSRC){
        return SpellBookSpell.findAll({
            where: {
                charID: charID,
                spellSRC: spellSRC,
            }
        }).then((spellBookSpells) => {
            return CharSpells.getSpellList(charID, spellSRC)
            .then((spellList) => {
                let spellBookArray = [];
                for(let spellBookSpell of spellBookSpells){
                    spellBookArray.push(spellBookSpell.spellID);
                }
                return {SpellSRC: spellSRC, SpellBook: spellBookArray, SpellList: spellList};
            });
        });
    }

    static getSpellList(charID, spellSRC) {
        return CharDataStoring.getBasicData(charID, "GET_ALL", 'dataSpellLists', null)
        .then((spellListsData) => {
            let spellListsDataMap = objToMap(spellListsData);
            for(const [srcID, spellListsDataArray] of spellListsDataMap.entries()){
                for(const spellListsData of spellListsDataArray){
                    let spellListsDataParts = spellListsData.split('=');
                    if(spellSRC === spellListsDataParts[0]){
                        return spellListsDataParts[1];
                    }
                }
            }
            return 'Arcane';
        });
    }

    // Used to actually add a set of spell slots to character data
    static setSpellCasting(charID, srcID, spellSRC, spellcasting){
        spellcasting = spellcasting.toUpperCase();
        let spellSlots = getSpellSlots(spellcasting);
        return CharDataStoring.replaceBasicData(charID, srcID, [spellSRC+"="+JSON.stringify(spellSlots)], 'dataSpellSlots')
        .then((result) => {
          return spellSlots;
        });
    }

    // Used to actually add a spell slot to character data
    static setSpellSlot(charID, srcID, spellSRC, slotLevel){
        let rowName = levelToRowName(slotLevel);
        if(rowName == null) {return null;}
        let spellSlot = {};
        spellSlot[rowName] = [{slotID: hashCode(srcID), used: false, spellID: null, level_lock: -1}];
        return CharDataStoring.replaceBasicData(charID, srcID, [spellSRC+"="+JSON.stringify(spellSlot)], 'dataSpellSlots')
        .then((result) => {
          return spellSlot;
        });
    }

    static changeSpellSlot(charID, updateSlotObject){
        return CharDataStoring.getBasicData(charID, "GET_ALL", 'dataSpellSlots', null)
        .then((spellSlotsData) => {
            let spellSlotsDataMap = objToMap(spellSlotsData);

            // Build outline of Spell Slot object data
            let spellSlotEntry = {
                slotID: updateSlotObject.slotID,
                used: updateSlotObject.used,
                spellID: updateSlotObject.spellID,
                level_lock: updateSlotObject.level_lock,
            };
            let updatedSpellSlotJSON = JSON.stringify(spellSlotEntry);

            // Regex which will manually replace spell slot directly through JSON
            let spellSlotRegex = '(\{\"slotID\"\:'+updateSlotObject.slotID+'\,.+?\})';
            let re = new RegExp(spellSlotRegex, 'g');

            // Update the spell slot data
            let updateSpellSlotsPromises = [];
            for(const [srcID, spellSlotsDataArray] of spellSlotsDataMap.entries()){
                let slotNewDataArray = [];
                for(const spellSlotsData of spellSlotsDataArray){
                    slotNewDataArray.push(spellSlotsData.replace(re, updatedSpellSlotJSON));
                }
                let newPromise = CharDataStoring.replaceBasicData(charID, srcID, slotNewDataArray, 'dataSpellSlots');
                updateSpellSlotsPromises.push(newPromise);
            }
            return Promise.all(updateSpellSlotsPromises)
            .then(function(result) {
                return;
            });
        });
    }

    static getSpellSlots(charID){
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return CharDataStoring.getBasicData(charID, "GET_ALL", 'dataSpellSlots', null)
            .then((spellSlotsData) => {
                let spellSlotsDataMap = objToMap(spellSlotsData);
                return CharDataStoring.getBasicData(charID, "GET_ALL", 'dataSpellKeyAbilities', null)
                .then((spellKeyAbilitiesData) => {
                    let spellKeyAbilitiesDataMap = objToMap(spellKeyAbilitiesData);

                    let spellSlotsMap = new Map();
                    let loopCount = 0;
                    for(const [srcID, spellSlotsDataArray] of spellSlotsDataMap.entries()){
                        for(const spellSlotsData of spellSlotsDataArray){

                            let spellSlotsDataParts = spellSlotsData.split('=');
                            let spellSRC = spellSlotsDataParts[0];
                            let keyAbility = getKeyAbilityFromSpellSRC(spellKeyAbilitiesDataMap, spellSRC);
                                
                            let spellSlots = JSON.parse(spellSlotsDataParts[1]);
                            for(let [levelRowName, slotsArray] of Object.entries(spellSlots)) {
                                let slotLevel = rowNameToLevel(levelRowName);
                                for(const slotData of slotsArray){
                                    if(slotData.level_lock <= character.level) {

                                        let spellSlotArray = [];
                                        if(spellSlotsMap.has(spellSRC)){
                                            spellSlotArray = spellSlotsMap.get(spellSRC);
                                        }

                                        spellSlotArray.push({
                                            slotID: slotData.slotID,
                                            slotLevel: slotLevel,
                                            keyAbility: keyAbility,
                                            used: slotData.used,
                                            spellID: slotData.spellID,
                                            level_lock: slotData.level_lock,
                                        });

                                        spellSlotsMap.set(spellSRC, spellSlotArray);
                                            
                                        loopCount++;

                                    }
                                }
                            }

                        }
                    }
                    console.log("SPELL SLOT LOOP COUNT: "+loopCount+" ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~!");
                    return spellSlotsMap;
                });
            });
        });
    }


};