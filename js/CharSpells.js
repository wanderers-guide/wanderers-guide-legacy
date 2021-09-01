
const Character = require('../models/contentDB/Character');
const Spell = require('../models/contentDB/Spell');
const SpellBookSpell = require('../models/contentDB/SpellBookSpell');

const CharDataMapping = require('./CharDataMapping');

// Hardcoded Spell Slots for Casting Type
function getSpellSlots(SID, spellcasting){
    if(spellcasting === 'THREE-QUARTERS'){
        return {
            cantrip: [
                {slotID: SID+1, used: false, spellID: null, type: '', level_lock: 1},
                {slotID: SID+2, used: false, spellID: null, type: '', level_lock: 1},
                {slotID: SID+3, used: false, spellID: null, type: '', level_lock: 1},
                {slotID: SID+4, used: false, spellID: null, type: '', level_lock: 1},
                {slotID: SID+5, used: false, spellID: null, type: '', level_lock: 1},
            ],
            firstLevel: [
                {slotID: SID+6, used: false, spellID: null, type: '', level_lock: 1},
                {slotID: SID+7, used: false, spellID: null, type: '', level_lock: 1},
                {slotID: SID+8, used: false, spellID: null, type: '', level_lock: 2},
            ],
            secondLevel: [
                {slotID: SID+9, used: false, spellID: null, type: '', level_lock: 3},
                {slotID: SID+10, used: false, spellID: null, type: '', level_lock: 3},
                {slotID: SID+11, used: false, spellID: null, type: '', level_lock: 4},
            ],
            thirdLevel: [
                {slotID: SID+12, used: false, spellID: null, type: '', level_lock: 5},
                {slotID: SID+13, used: false, spellID: null, type: '', level_lock: 5},
                {slotID: SID+14, used: false, spellID: null, type: '', level_lock: 6},
            ],
            fourthLevel: [
                {slotID: SID+15, used: false, spellID: null, type: '', level_lock: 7},
                {slotID: SID+16, used: false, spellID: null, type: '', level_lock: 7},
                {slotID: SID+17, used: false, spellID: null, type: '', level_lock: 8},
            ],
            fifthLevel: [
                {slotID: SID+18, used: false, spellID: null, type: '', level_lock: 9},
                {slotID: SID+19, used: false, spellID: null, type: '', level_lock: 9},
                {slotID: SID+20, used: false, spellID: null, type: '', level_lock: 10},
            ],
            sixthLevel: [
                {slotID: SID+21, used: false, spellID: null, type: '', level_lock: 11},
                {slotID: SID+22, used: false, spellID: null, type: '', level_lock: 11},
                {slotID: SID+23, used: false, spellID: null, type: '', level_lock: 12},
            ],
            seventhLevel: [
                {slotID: SID+24, used: false, spellID: null, type: '', level_lock: 13},
                {slotID: SID+25, used: false, spellID: null, type: '', level_lock: 13},
                {slotID: SID+26, used: false, spellID: null, type: '', level_lock: 14},
            ],
            eighthLevel: [
                {slotID: SID+27, used: false, spellID: null, type: '', level_lock: 15},
                {slotID: SID+28, used: false, spellID: null, type: '', level_lock: 15},
                {slotID: SID+29, used: false, spellID: null, type: '', level_lock: 16},
            ],
            ninthLevel: [
                {slotID: SID+30, used: false, spellID: null, type: '', level_lock: 17},
                {slotID: SID+31, used: false, spellID: null, type: '', level_lock: 17},
                {slotID: SID+32, used: false, spellID: null, type: '', level_lock: 18},
            ],
            tenthLevel: []
        };
    } else if(spellcasting === 'FULL'){
        return {
            cantrip: [
                {slotID: SID+1, used: false, spellID: null, type: '', level_lock: 1},
                {slotID: SID+2, used: false, spellID: null, type: '', level_lock: 1},
                {slotID: SID+3, used: false, spellID: null, type: '', level_lock: 1},
                {slotID: SID+4, used: false, spellID: null, type: '', level_lock: 1},
                {slotID: SID+5, used: false, spellID: null, type: '', level_lock: 1},
            ],
            firstLevel: [
                {slotID: SID+6, used: false, spellID: null, type: '', level_lock: 1},
                {slotID: SID+7, used: false, spellID: null, type: '', level_lock: 1},
                {slotID: SID+8, used: false, spellID: null, type: '', level_lock: 1},
                {slotID: SID+9, used: false, spellID: null, type: '', level_lock: 2},
            ],
            secondLevel: [
                {slotID: SID+10, used: false, spellID: null, type: '', level_lock: 3},
                {slotID: SID+11, used: false, spellID: null, type: '', level_lock: 3},
                {slotID: SID+12, used: false, spellID: null, type: '', level_lock: 3},
                {slotID: SID+13, used: false, spellID: null, type: '', level_lock: 4},
            ],
            thirdLevel: [
                {slotID: SID+14, used: false, spellID: null, type: '', level_lock: 5},
                {slotID: SID+15, used: false, spellID: null, type: '', level_lock: 5},
                {slotID: SID+16, used: false, spellID: null, type: '', level_lock: 5},
                {slotID: SID+17, used: false, spellID: null, type: '', level_lock: 6},
            ],
            fourthLevel: [
                {slotID: SID+18, used: false, spellID: null, type: '', level_lock: 7},
                {slotID: SID+19, used: false, spellID: null, type: '', level_lock: 7},
                {slotID: SID+20, used: false, spellID: null, type: '', level_lock: 7},
                {slotID: SID+21, used: false, spellID: null, type: '', level_lock: 8},
            ],
            fifthLevel: [
                {slotID: SID+22, used: false, spellID: null, type: '', level_lock: 9},
                {slotID: SID+23, used: false, spellID: null, type: '', level_lock: 9},
                {slotID: SID+24, used: false, spellID: null, type: '', level_lock: 9},
                {slotID: SID+25, used: false, spellID: null, type: '', level_lock: 10},
            ],
            sixthLevel: [
                {slotID: SID+26, used: false, spellID: null, type: '', level_lock: 11},
                {slotID: SID+27, used: false, spellID: null, type: '', level_lock: 11},
                {slotID: SID+28, used: false, spellID: null, type: '', level_lock: 11},
                {slotID: SID+29, used: false, spellID: null, type: '', level_lock: 12},
            ],
            seventhLevel: [
                {slotID: SID+30, used: false, spellID: null, type: '', level_lock: 13},
                {slotID: SID+31, used: false, spellID: null, type: '', level_lock: 13},
                {slotID: SID+32, used: false, spellID: null, type: '', level_lock: 13},
                {slotID: SID+33, used: false, spellID: null, type: '', level_lock: 14},
            ],
            eighthLevel: [
                {slotID: SID+34, used: false, spellID: null, type: '', level_lock: 15},
                {slotID: SID+35, used: false, spellID: null, type: '', level_lock: 15},
                {slotID: SID+36, used: false, spellID: null, type: '', level_lock: 15},
                {slotID: SID+37, used: false, spellID: null, type: '', level_lock: 16},
            ],
            ninthLevel: [
                {slotID: SID+38, used: false, spellID: null, type: '', level_lock: 17},
                {slotID: SID+39, used: false, spellID: null, type: '', level_lock: 17},
                {slotID: SID+40, used: false, spellID: null, type: '', level_lock: 17},
                {slotID: SID+41, used: false, spellID: null, type: '', level_lock: 18},
            ],
            tenthLevel: []
        };
    } else if(spellcasting === 'REDUCED'){
      return {
          cantrip: [
              {slotID: SID+1, used: false, spellID: null, type: '', level_lock: 1},
              {slotID: SID+2, used: false, spellID: null, type: '', level_lock: 1},
              {slotID: SID+3, used: false, spellID: null, type: '', level_lock: 1},
              {slotID: SID+4, used: false, spellID: null, type: '', level_lock: 2},
              {slotID: SID+5, used: false, spellID: null, type: '', level_lock: 4},
          ],
          firstLevel: [
              {slotID: SID+6, used: false, spellID: null, type: '', level_lock: 1},
              {slotID: SID+7, used: false, spellID: null, type: '', level_lock: 1},
          ],
          secondLevel: [
              {slotID: SID+8, used: false, spellID: null, type: '', level_lock: 3},
              {slotID: SID+9, used: false, spellID: null, type: '', level_lock: 3},
          ],
          thirdLevel: [
              {slotID: SID+10, used: false, spellID: null, type: '', level_lock: 5},
              {slotID: SID+11, used: false, spellID: null, type: '', level_lock: 5},
          ],
          fourthLevel: [
              {slotID: SID+12, used: false, spellID: null, type: '', level_lock: 7},
              {slotID: SID+13, used: false, spellID: null, type: '', level_lock: 7},
          ],
          fifthLevel: [
              {slotID: SID+14, used: false, spellID: null, type: '', level_lock: 9},
              {slotID: SID+15, used: false, spellID: null, type: '', level_lock: 9},
          ],
          sixthLevel: [
              {slotID: SID+16, used: false, spellID: null, type: '', level_lock: 11},
              {slotID: SID+17, used: false, spellID: null, type: '', level_lock: 11},
          ],
          seventhLevel: [
              {slotID: SID+18, used: false, spellID: null, type: '', level_lock: 13},
              {slotID: SID+19, used: false, spellID: null, type: '', level_lock: 13},
          ],
          eighthLevel: [
              {slotID: SID+20, used: false, spellID: null, type: '', level_lock: 15},
              {slotID: SID+21, used: false, spellID: null, type: '', level_lock: 15},
          ],
          ninthLevel: [
              {slotID: SID+22, used: false, spellID: null, type: '', level_lock: 17},
              {slotID: SID+23, used: false, spellID: null, type: '', level_lock: 17},
          ],
          tenthLevel: []
      };
  } else if(spellcasting === 'PARTIAL'){
      return {
          cantrip: [
              {slotID: SID+1, used: false, spellID: null, type: '', level_lock: 1},
              {slotID: SID+2, used: false, spellID: null, type: '', level_lock: 1},
              {slotID: SID+3, used: false, spellID: null, type: '', level_lock: 1},
              {slotID: SID+4, used: false, spellID: null, type: '', level_lock: 1},
              {slotID: SID+5, used: false, spellID: null, type: '', level_lock: 1},
          ],
          firstLevel: [
              {slotID: SID+6, used: false, spellID: null, type: '', level_lock: 1, level_cutoff: 5},
              {slotID: SID+7, used: false, spellID: null, type: '', level_lock: 2, level_cutoff: 5},
          ],
          secondLevel: [
              {slotID: SID+8, used: false, spellID: null, type: '', level_lock: 3, level_cutoff: 7},
              {slotID: SID+9, used: false, spellID: null, type: '', level_lock: 4, level_cutoff: 7},
          ],
          thirdLevel: [
              {slotID: SID+10, used: false, spellID: null, type: '', level_lock: 5, level_cutoff: 9},
              {slotID: SID+11, used: false, spellID: null, type: '', level_lock: 5, level_cutoff: 9},
          ],
          fourthLevel: [
              {slotID: SID+12, used: false, spellID: null, type: '', level_lock: 7, level_cutoff: 11},
              {slotID: SID+13, used: false, spellID: null, type: '', level_lock: 7, level_cutoff: 11},
          ],
          fifthLevel: [
              {slotID: SID+14, used: false, spellID: null, type: '', level_lock: 9, level_cutoff: 13},
              {slotID: SID+15, used: false, spellID: null, type: '', level_lock: 9, level_cutoff: 13},
          ],
          sixthLevel: [
              {slotID: SID+16, used: false, spellID: null, type: '', level_lock: 11, level_cutoff: 15},
              {slotID: SID+17, used: false, spellID: null, type: '', level_lock: 11, level_cutoff: 15},
          ],
          seventhLevel: [
              {slotID: SID+18, used: false, spellID: null, type: '', level_lock: 13, level_cutoff: 17},
              {slotID: SID+19, used: false, spellID: null, type: '', level_lock: 13, level_cutoff: 17},
          ],
          eighthLevel: [
              {slotID: SID+20, used: false, spellID: null, type: '', level_lock: 15},
              {slotID: SID+21, used: false, spellID: null, type: '', level_lock: 15},
          ],
          ninthLevel: [
              {slotID: SID+22, used: false, spellID: null, type: '', level_lock: 17},
              {slotID: SID+23, used: false, spellID: null, type: '', level_lock: 17},
          ],
          tenthLevel: []
      };
  } else if(spellcasting === 'SINGLE-SET'){
        return {
            cantrip: [
                {slotID: SID+1, used: false, spellID: null, type: '', level_lock: 1},
            ],
            firstLevel: [
                {slotID: SID+2, used: false, spellID: null, type: '', level_lock: 1},
            ],
            secondLevel: [
                {slotID: SID+3, used: false, spellID: null, type: '', level_lock: 3},
            ],
            thirdLevel: [
                {slotID: SID+4, used: false, spellID: null, type: '', level_lock: 5},
            ],
            fourthLevel: [
                {slotID: SID+5, used: false, spellID: null, type: '', level_lock: 7},
            ],
            fifthLevel: [
                {slotID: SID+6, used: false, spellID: null, type: '', level_lock: 9},
            ],
            sixthLevel: [
                {slotID: SID+7, used: false, spellID: null, type: '', level_lock: 11},
            ],
            seventhLevel: [
                {slotID: SID+8, used: false, spellID: null, type: '', level_lock: 13},
            ],
            eighthLevel: [
                {slotID: SID+9, used: false, spellID: null, type: '', level_lock: 15},
            ],
            ninthLevel: [
                {slotID: SID+10, used: false, spellID: null, type: '', level_lock: 17},
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

function getRandomSID() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

function findSIDFromSlotData(spellSlotDataArray) {
  if(spellSlotDataArray.length == 0) { return null; }
  return JSON.parse(spellSlotDataArray[0]).slotID - 1;
}

function getKeyAbilityFromSpellSRC(spellKeyAbilityDataArray, spellSRC){
    spellSRC = spellSRC+"=";
    for(const spellKeyAbilityData of spellKeyAbilityDataArray){
        if(spellKeyAbilityData.value.includes(spellSRC)){
            return spellKeyAbilityData.value.replace(spellSRC, '');
        }
    }
    return 'CHA';
}

function srcStructToCode(charID, source, srcStruct) {
    if(srcStruct == null){ return -1; }
    return hashCode(charID+'-'+source+'-'+srcStruct.sourceType+'-'+srcStruct.sourceLevel+'-'+srcStruct.sourceCode+'-'+srcStruct.sourceCodeSNum);
}

function hashCode(str) {
    return str.split('').reduce((prevHash, currVal) =>
      (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

module.exports = class CharSpells {

    static removeFromSpellBook(charID, spellSRC, spellID, spellLevel){
        return SpellBookSpell.destroy({ // Delete SpellBookSpell
            where: {
                charID: charID,
                spellSRC: spellSRC,
                spellID: spellID,
                spellLevel: spellLevel,
            },
            limit: 1,
        }).then((result) => {
            return;
        });
    }

    static addToSpellBook(charID, spellSRC, spellID, spellLevel, spellType, noDuplicates=false){
        let createSpellBookSpell = function(charID, spellSRC, spellID, spellLevel) {
            return SpellBookSpell.create({ // Create SpellBookSpell
                spellSRC: spellSRC,
                charID: charID,
                spellID: spellID,
                spellLevel: spellLevel,
                spellType: spellType,
            }).then(spellBookSpell => {
                return spellBookSpell;
            }).catch(function(err) {
                return null;
            });
        };
        if(noDuplicates) {
            return SpellBookSpell.findOne({
                where: {
                    spellSRC: spellSRC,
                    charID: charID,
                    spellID: spellID,
                    spellLevel: spellLevel,
                }
            }).then((spellBookSpell) => {
                if(spellBookSpell == null){
                    return createSpellBookSpell(charID, spellSRC, spellID, spellLevel);
                } else {
                    return null;
                }
            });
        } else {
            return createSpellBookSpell(charID, spellSRC, spellID, spellLevel);
        }
    }


    static addToSpellBookFromBuilder(charID, spellSRC, spellID, spellLevel, srcStruct, spellType=null){
        let srcStructHashed = srcStructToCode(charID, 'Spell', srcStruct);
        return SpellBookSpell.destroy({
            where: {
                charID: charID,
                srcStructHashed: srcStructHashed,
            },
        }).then((result) => {
            return SpellBookSpell.create({
                spellSRC: spellSRC,
                charID: charID,
                spellID: spellID,
                spellLevel: spellLevel,
                spellType: spellType,
                srcStructHashed: srcStructHashed,
            }).then(spellBookSpell => {
                return spellBookSpell;
            }).catch(function(err) {
                return null;
            });
        });
    }

    static getSpellBook(charID, spellSRC, isFocus){
        return SpellBookSpell.findAll({
            where: {
                charID: charID,
                spellSRC: spellSRC,
            }
        }).then((spellBookSpells) => {
            return CharSpells.getSpellList(charID, spellSRC)
            .then((spellList) => {
                return CharSpells.getSpellCastingType(charID, spellSRC)
                .then((spellCastingType) => {
                    return CharDataMapping.getDataAll(charID, 'spellKeyAbilities', null)
                    .then((spellKeyAbilityDataArray) => {
                        let keyAbility = getKeyAbilityFromSpellSRC(spellKeyAbilityDataArray, spellSRC);
                        let spellBookArray = [];
                        for(let spellBookSpell of spellBookSpells){
                          if(spellBookSpell.spellType == null) { spellBookSpell.spellType = 'R:0,G:0,B:0'; }
                          spellBookArray.push({
                            SpellBookSpellID: spellBookSpell.id,
                            SpellID: spellBookSpell.spellID,
                            SpellLevel: spellBookSpell.spellLevel,
                            SpellType: spellBookSpell.spellType,
                          });
                        }
                        return {
                            SpellSRC: spellSRC,
                            SpellBook: spellBookArray,
                            SpellList: spellList,
                            SpellCastingType: spellCastingType,
                            SpellKeyAbility: keyAbility,
                            IsFocus: isFocus,
                        };
                    });
                });
            });
        });
    }

    static changeSpellBookSpellType(charID, spellBookSpellID, spellType) {
      let updateValues = { spellType: spellType };
      return SpellBookSpell.update(updateValues, { where: { id: spellBookSpellID, charID: charID, } })
      .then((result) => {
        return;
      });
    }

    static getSpellList(charID, spellSRC) {
        return CharDataMapping.getDataAll(charID, 'spellLists', null)
        .then((spellListDataArray) => {
            for(const spellListData of spellListDataArray){
                let spellListsDataParts = spellListData.value.split('=');
                if(spellSRC === spellListsDataParts[0]){
                    return spellListsDataParts[1];
                }
            }
            return 'Arcane';
        });
    }

    static getSpellCastingType(charID, spellSRC) {
        return CharDataMapping.getDataAll(charID, 'spellCastingType', null)
        .then((spellCTypeDataArray) => {
            for(const spellCTypeData of spellCTypeDataArray){
                let spellCTypeDataParts = spellCTypeData.value.split('=');
                if(spellSRC === spellCTypeDataParts[0]){
                    return spellCTypeDataParts[1];
                }
            }
            return 'PREPARED-LIST';
        });
    }

    static getFocusSpells(charID) {
        return CharDataMapping.getDataAll(charID, 'focusSpell', null)
        .then((focusSpellDataArray) => {
            let focusSpellMap = new Map();
            for(let focusSpellData of focusSpellDataArray){
                let focusSpellDataParts = focusSpellData.value.split('=');
                let focusSpellArray = [];
                if(focusSpellMap.has(focusSpellDataParts[0])){
                    focusSpellArray = focusSpellMap.get(focusSpellDataParts[0]);
                }
                focusSpellData.SpellID = focusSpellDataParts[1];
                focusSpellArray.push(focusSpellData);
                focusSpellMap.set(focusSpellDataParts[0], focusSpellArray);
            }
            return focusSpellMap;
        });
    }

    static getFocusPoints(charID) {
        return CharDataMapping.getDataAll(charID, 'focusPoint', null)
        .then((focusPointDataArray) => {
            return focusPointDataArray;
        });
    }

    // Actually adds a set of spell slots to character data
    static setSpellCasting(charID, srcStruct, spellSRC, spellcasting){
        spellcasting = spellcasting.toUpperCase();

        return CharDataMapping.getDataSingle(charID, 'spellSlots', srcStruct)
        .then((oldSpellSlotsData) => {

          const newSID = getRandomSID();
          let spellSlots = getSpellSlots(newSID, spellcasting);

          // Transfer old data to new spellSlots data
          if(oldSpellSlotsData != null && oldSpellSlotsData.value != null){

            // Regex which will extract spell slot data from JSON
            const oldSpellSlotDataArray = [...oldSpellSlotsData.value.match(/\{\"slotID\"\:.+?\}/g)];
            const oldSID = findSIDFromSlotData(oldSpellSlotDataArray);

            for(let spellLevel in spellSlots) {
              for(let slotData of spellSlots[spellLevel]) {

                // Get old slot data by comparing relative SIDs 
                let oldSlotDataJSON = oldSpellSlotDataArray.find(oldSlotData => {
                  return (JSON.parse(oldSlotData).slotID - oldSID) == slotData.slotID - newSID;
                });

                if(oldSlotDataJSON != null) {
                  let oldSlotData = JSON.parse(oldSlotDataJSON);
                  
                  slotData.used = oldSlotData.used;
                  slotData.spellID = oldSlotData.spellID;
                  slotData.type = oldSlotData.type;

                }

              }
            }
          }

          return CharDataMapping.setData(charID, 'spellSlots', srcStruct, spellSRC+"="+JSON.stringify(spellSlots))
          .then((result) => {
            return spellSlots;
          });

        });
    }

    // Actually adds a spell slot to character data
    static setSpellSlot(charID, srcStruct, spellSRC, slotLevel, slotType=''){
        let rowName = levelToRowName(slotLevel);
        if(rowName == null) {return null;}

        let spellSlot = {};
        let spellSlotSubData = {
          slotID: getRandomSID(),
          used: false,
          spellID: null,
          type: slotType,
          level_lock: -1};
        spellSlot[rowName] = [spellSlotSubData];

        return CharDataMapping.getDataSingle(charID, 'spellSlots', srcStruct)
        .then((spellSlotData) => {
          // If slot data doesn't already exist or if it does exist and is a slot different level,
          if(spellSlotData == null || (spellSlotData.value != null && !spellSlotData.value.includes(`"${rowName}":`))){
            return CharDataMapping.setData(charID, 'spellSlots', srcStruct, spellSRC+"="+JSON.stringify(spellSlot))
            .then((result) => {
              spellSlotSubData.slotLevel = parseInt(slotLevel);
              spellSlotSubData.srcStruct = srcStruct;
              return spellSlotSubData;
            });
          } else {
            return false; // Returns not null but not the spellslot either.
          }
        });
    }

    static changeSpellSlot(charID, updateSlotObject){
        return CharDataMapping.getDataAll(charID, 'spellSlots', null)
        .then((spellSlotDataArray) => {

            // Build outline of Spell Slot object data
            let spellSlotEntry = {
                slotID: updateSlotObject.slotID,
                used: updateSlotObject.used,
                spellID: updateSlotObject.spellID,
                type: updateSlotObject.type,
                level_lock: updateSlotObject.level_lock,
            };
            if(updateSlotObject.level_cutoff != null){
              spellSlotEntry.level_cutoff = updateSlotObject.level_cutoff;
            }
            let updatedSpellSlotJSON = JSON.stringify(spellSlotEntry);

            // Regex which will manually replace spell slot directly through JSON
            // TODO: might need to double escape these. Since the string will remove the escapes before regex applies
            let spellSlotRegex = '(\{\"slotID\"\:'+updateSlotObject.slotID+'\,.+?\})';
            let re = new RegExp(spellSlotRegex, 'g');

            // Update the spell slot data
            let updateSpellSlotsPromises = [];
            for(const spellSlotData of spellSlotDataArray){
                let newSpellSlotDataValue = spellSlotData.value.replace(re, updatedSpellSlotJSON);
                if(newSpellSlotDataValue != spellSlotData.value) {
                    let srcStruct = {
                        sourceType: spellSlotData.sourceType,
                        sourceLevel: spellSlotData.sourceLevel,
                        sourceCode: spellSlotData.sourceCode,
                        sourceCodeSNum: spellSlotData.sourceCodeSNum,
                    };
                    let newPromise = CharDataMapping.setData(charID, 'spellSlots', srcStruct, newSpellSlotDataValue);
                    updateSpellSlotsPromises.push(newPromise);
                }
            }
            return Promise.all(updateSpellSlotsPromises)
            .then(function(result) {
                return;
            });

        });
    }

    static getSpellSlotMap(charID){
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return CharDataMapping.getDataAll(charID, 'spellSlots', null)
            .then((spellSlotDataArray) => {
                let spellSlotsMap = new Map();
                for(const spellSlotData of spellSlotDataArray){

                    let spellSlotsDataParts = spellSlotData.value.split('=');
                    let spellSRC = spellSlotsDataParts[0];
                        
                    let spellSlots = JSON.parse(spellSlotsDataParts[1]);
                    for(let [levelRowName, slotsArray] of Object.entries(spellSlots)) {
                        let slotLevel = rowNameToLevel(levelRowName);
                        for(const slotData of slotsArray){
                            if(slotData.level_lock <= character.level && (slotData.level_cutoff == null || slotData.level_cutoff > character.level)) {

                                let spellSlotArray = [];
                                if(spellSlotsMap.has(spellSRC)){
                                    spellSlotArray = spellSlotsMap.get(spellSRC);
                                }
                                
                                let srcStruct = spellSlotData;
                                srcStruct.value = null;

                                let spellSlotEntry = {
                                  slotID: slotData.slotID,
                                  slotLevel: slotLevel,
                                  used: slotData.used,
                                  spellID: slotData.spellID,
                                  type: slotData.type,
                                  level_lock: slotData.level_lock,
                                  srcStruct: srcStruct,
                                };
                                if(slotData.level_cutoff != null){
                                  spellSlotEntry.level_cutoff = slotData.level_cutoff;
                                }

                                spellSlotArray.push(spellSlotEntry);

                                spellSlotsMap.set(spellSRC, spellSlotArray);

                            }
                        }
                    }

                }
                return spellSlotsMap;
            });
        });
    }


};