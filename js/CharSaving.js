
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Character = require('../models/contentDB/Character');
const Ancestry = require('../models/contentDB/Ancestry');
const NoteField = require('../models/contentDB/NoteField');
const Item = require('../models/contentDB/Item');
const TaggedItem = require('../models/contentDB/TaggedItem');
const Weapon = require('../models/contentDB/Weapon');
const Storage = require('../models/contentDB/Storage');
const Inventory = require('../models/contentDB/Inventory');
const InvItem = require('../models/contentDB/InvItem');
const CharCondition = require('../models/contentDB/CharCondition');
const InnateSpellCasting = require('../models/contentDB/InnateSpellCasting');
const AnimalCompanion = require('../models/contentDB/AnimalCompanion');
const CharAnimalCompanion = require('../models/contentDB/CharAnimalCompanion');
const CharFamiliar = require('../models/contentDB/CharFamiliar');
const CalculatedStat = require('../models/contentDB/CalculatedStat');

const CharDataMapping = require('./CharDataMapping');
const CharDataMappingExt = require('./CharDataMappingExt');

const CharStateUtils = require('../js/CharStateUtils');

const CharTags = require('./CharTags');

function srcStructToCode(charID, source, srcStruct) {
    if(srcStruct == null){ return -1; }
    return hashCode(charID+'-'+source+'-'+srcStruct.sourceType+'-'+srcStruct.sourceLevel+'-'+srcStruct.sourceCode+'-'+srcStruct.sourceCodeSNum);
}

function hashCode(str) {
    return str.split('').reduce((prevHash, currVal) =>
      (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

function isPotencyRune(runeID){ // Hardcoded - Fund Runes IDs
  return runeID == 20 || runeID == 27 || runeID == 31 || runeID == 25 || runeID == 28 || runeID == 32 || runeID == 112 || runeID == 113;
}

module.exports = class CharSaving {

    ///

    static updateCalculatedStats(charID, calcStatsStruct) {
      return CalculatedStat.upsert({
        charID: charID,
        maxHP: calcStatsStruct.maxHP,
        maxStamina: calcStatsStruct.maxStamina,
        maxResolve: calcStatsStruct.maxResolve,
        totalClassDC: calcStatsStruct.totalClassDC,
        totalSpeed: calcStatsStruct.totalSpeed,
        totalAC: calcStatsStruct.totalAC,
        totalPerception: calcStatsStruct.totalPerception,
        totalSkills: JSON.stringify(calcStatsStruct.totalSkills),
        totalSaves: JSON.stringify(calcStatsStruct.totalSaves),
        totalAbilityScores: JSON.stringify(calcStatsStruct.totalAbilityScores),
        weapons: JSON.stringify(calcStatsStruct.weapons),
        conditions: JSON.stringify(calcStatsStruct.conditions),
        generalInfo: JSON.stringify(calcStatsStruct.generalInfo),
      }).then((result) => {
        return;
      });
    }

    ///

    static createNewCharacter(user, build=null){

      let defaultOptions;
      if(build != null){
        defaultOptions = {
          buildID: build.id,

          ancestryID: build.ancestryID,
          heritageID: build.heritageID,
          uniHeritageID: build.uniHeritageID,
          backgroundID: build.backgroundID,
          classID: build.classID,
          classID_2: build.classID_2,

          customCode: build.customCode,
          optionCustomCodeBlock: build.optionCustomCodeBlock,
          optionClassArchetypes: build.optionClassArchetypes,
          variantFreeArchetype: build.variantFreeArchetype,
          variantAncestryParagon: build.variantAncestryParagon,
          variantStamina: build.variantStamina,
          variantGradualAbilityBoosts: build.variantGradualAbilityBoosts,

          enabledSources: build.enabledSources,
          enabledHomebrew: build.enabledHomebrew,
        };
      } else {
        defaultOptions = {
          buildID: null,

          ancestryID: null,
          heritageID: null,
          uniHeritageID: null,
          backgroundID: null,
          classID: null,
          classID_2: null,

          customCode: null,
          optionCustomCodeBlock: 0,
          optionClassArchetypes: 1,
          variantFreeArchetype: 0,
          variantAncestryParagon: 0,
          variantStamina: 0,
          variantGradualAbilityBoosts: 0,

          enabledSources: '["CRB","ADV-PLAYER-GUIDE","GM-GUIDE"]',
          enabledHomebrew: '[null]',
        };
      }

      return Character.findAll({ where: { userID: user.id } })
      .then((characters) => {

        if(CharStateUtils.canMakeCharacter(user, characters)){

            return Inventory.create({
            }).then(inventory => { // -- Hardcoded Item IDs for Small Pouch and Silver
                return CharSaving.addItemToInv(inventory.id, 84, 1) // Give Small Pouch
                .then(pouchInvItem => {
                    return CharSaving.saveInvItemCustomize(pouchInvItem.id, {
                        name: 'Coin Pouch',
                        price: 0,
                        bulk: pouchInvItem.bulk,
                        description: 'A small, simple pouch used to hold coins.',
                        size: pouchInvItem.size,
                        isShoddy: pouchInvItem.isShoddy,
                        hitPoints: pouchInvItem.hitPoints,
                        brokenThreshold: pouchInvItem.brokenThreshold,
                        hardness: pouchInvItem.hardness,
                        code: pouchInvItem.code,
                    }).then(result => {
                        return CharSaving.addItemToInv(inventory.id, 23, 150) // Give starting 150 silver
                        .then(silverInvItem => {
                            return CharSaving.saveInvItemToNewBag(silverInvItem.id, pouchInvItem.id, 0) // Put silver in pouch
                            .then(result => {
                                return Character.create({
                                    name: "Unnamed Character",
                                    level: 1,
                                    userID: user.id,
                                    inventoryID: inventory.id,


                                    buildID: defaultOptions.buildID,

                                    ancestryID: defaultOptions.ancestryID,
                                    heritageID: defaultOptions.heritageID,
                                    uniHeritageID: defaultOptions.uniHeritageID,
                                    backgroundID: defaultOptions.backgroundID,
                                    classID: defaultOptions.classID,
                                    classID_2: defaultOptions.classID_2,

                                    customCode: defaultOptions.customCode,
                                    optionCustomCodeBlock: defaultOptions.optionCustomCodeBlock,
                                    optionClassArchetypes: defaultOptions.optionClassArchetypes,
                                    variantFreeArchetype: defaultOptions.variantFreeArchetype,
                                    variantAncestryParagon: defaultOptions.variantAncestryParagon,
                                    variantStamina: defaultOptions.variantStamina,
                                    variantGradualAbilityBoosts: defaultOptions.variantGradualAbilityBoosts,

                                    enabledSources: defaultOptions.enabledSources,
                                    enabledHomebrew: defaultOptions.enabledHomebrew,

                                }).then(character => {
                                  return character;
                                }).catch(err => console.error(err));
                            });
                        });
                    });
                });
            });

        }
        return null;
      });

    }

    ///

    static saveExp(charID, newExp) {
        let updateValues = { experience: newExp };
        return Character.update(updateValues, { where: { id: charID } })
        .then((result) => {
            return;
        });
    }

    static saveCurrentHitPoints(charID, currentHealth) {
        let updateValues = { currentHealth: currentHealth };
        return Character.update(updateValues, { where: { id: charID } })
        .then((result) => {
            return;
        });
    }
    static saveTempHitPoints(charID, tempHealth) {
        let updateValues = { tempHealth: tempHealth };
        return Character.update(updateValues, { where: { id: charID } })
        .then((result) => {
            return;
        });
    }

    static saveCurrentStaminaPoints(charID, currentStamina) {
        let updateValues = { currentStamina: currentStamina };
        return Character.update(updateValues, { where: { id: charID } })
        .then((result) => {
            return;
        });
    }
    static saveCurrentResolvePoints(charID, currentResolve) {
        let updateValues = { currentResolve: currentResolve };
        return Character.update(updateValues, { where: { id: charID } })
        .then((result) => {
            return;
        });
    }

    static saveNotes(charID, notes) {
        let updateValues = { notes: notes };
        return Character.update(updateValues, { where: { id: charID } })
        .then((result) => {
            return;
        });
    }

    static saveInfoJSON(charID, infoJSON) {
      let updateValues = { infoJSON: infoJSON };
      return Character.update(updateValues, { where: { id: charID } })
      .then((result) => {
        return;
      });
    }

    static saveRollHistory(charID, rollHistoryJSON) {
      let updateValues = { rollHistoryJSON: rollHistoryJSON };
      return Character.update(updateValues, { where: { id: charID } })
      .then((result) => {
        return;
      });
    }

    static saveDetails(charID, details) {
        let updateValues = { details: details };
        return Character.update(updateValues, { where: { id: charID } })
        .then((result) => {
            return;
        });
    }

    static saveCustomCode(charID, code) {
      let updateValues = { customCode: code };
      return Character.update(updateValues, { where: { id: charID } })
      .then((result) => {
          return;
      });
    }
    
    static saveHeroPoints(charID, heroPoints) {
        let updateValues = { heroPoints: heroPoints };
        return Character.update(updateValues, { where: { id: charID } })
        .then((result) => {
            return;
        });
    }

    static replaceCondition(charID, conditionID, value, sourceText, parentID) {
        return CharCondition.upsert({
            charID: charID,
            conditionID: conditionID,
            value: value,
            sourceText : sourceText,
            parentID : parentID,
        }).then((result) => {
            return;
        });
    }

    static removeCondition(charID, conditionID) {
        return CharCondition.destroy({
            where: {
                charID: charID,
                conditionID: conditionID
            }
        }).then((result) => {
            return result != 0;
        });
    }

    static addPropRune(invItemID, propRuneID, propRuneSlot) {
        let updateValues = new Object;
        updateValues['propRune'+propRuneSlot+'ID'] = propRuneID;
        return InvItem.update(updateValues, { where: { id: invItemID} })
        .then((result) => {
            return;
        });
    }

    static removePropRune(invItemID, propRuneSlot) {
        let updateValues = new Object;
        updateValues['propRune'+propRuneSlot+'ID'] = null;
        return InvItem.update(updateValues, { where: { id: invItemID} })
        .then((result) => {
            return;
        });
    }

    static addFundRune(invItemID, fundRuneID) {
        if(isPotencyRune(fundRuneID)){
          return InvItem.update({ fundPotencyRuneID: fundRuneID }, { where: { id: invItemID} });
        } else {
          return InvItem.update({ fundRuneID: fundRuneID }, { where: { id: invItemID} });
        }
    }

    static removeFundRune(invItemID, fundRuneID) {

        return InvItem.findOne({ where: { id: invItemID} })
        .then((invItem) => {

            if(invItem.fundRuneID == fundRuneID){

                let updateValues = {
                    fundRuneID: null
                };
                return InvItem.update(updateValues, { where: { id: invItemID} })
                .then((result) => {
                    return;
                });

            } else if(invItem.fundPotencyRuneID == fundRuneID){

                let updateValues = {
                    fundPotencyRuneID: null,
                    propRune1ID: null,
                    propRune2ID: null,
                    propRune3ID: null,
                    propRune4ID: null
                };
                return InvItem.update(updateValues, { where: { id: invItemID} })
                .then((result) => {
                    return;
                });

            } else {
                return;
            }

        });
        
    }

    static updateInventory(invID, equippedArmorInvItemID, equippedShieldInvItemID, equippedArmorCategory=null) {
        let updateValues = {
            equippedArmorInvItemID: equippedArmorInvItemID,
            equippedShieldInvItemID: equippedShieldInvItemID,
            equippedArmorCategory: equippedArmorCategory,
        };
        return Inventory.update(updateValues, { where: { id: invID} })
        .then((result) => {
            return;
        });
    }

    static addItemToInv(invID, itemID, quantity) {
        return Item.findOne({ where: { id: itemID } })
        .then((chosenItem) => {
            return Weapon.findOne({ where: { itemID: chosenItem.id } })
            .then((chosenWeapon) => {
              return Storage.findOne({ where: { itemID: chosenItem.id } })
              .then((chosenStorage) => {

                let isWeapon = 0;
                let dieType, damageType, range, reload = null;
                let atkBonus = 0; let dmgBonus = 0;
                if(chosenWeapon != null){
                  isWeapon = 1;
                  dieType = chosenWeapon.dieType;
                  damageType = chosenWeapon.damageType;
                  range = chosenWeapon.rangedRange;
                  reload = chosenWeapon.rangedReload;
                }

                let isStorage = 0;
                let maxBulkStorage = null;
                if(chosenStorage != null){
                  isStorage = 1;
                  maxBulkStorage = chosenStorage.maxBulkStorage;
                }

                return InvItem.create({
                    invID: invID,
                    itemID: chosenItem.id,
                    name: chosenItem.name,
                    price: chosenItem.price,
                    bulk: chosenItem.bulk,
                    description: chosenItem.description,
                    size: chosenItem.size,
                    quantity: quantity,
                    isShoddy: chosenItem.isShoddy,
                    currentHitPoints: chosenItem.hitPoints,
                    materialType: chosenItem.materialType,
                    hitPoints: chosenItem.hitPoints,
                    brokenThreshold: chosenItem.brokenThreshold,
                    hardness: chosenItem.hardness,
                    code: chosenItem.code,
                    itemTags: null,

                    itemIsWeapon: isWeapon,
                    itemWeaponDieType: dieType,
                    itemWeaponDamageType: damageType,
                    itemWeaponRange: range,
                    itemWeaponReload: reload,
                    itemWeaponAtkBonus: atkBonus,
                    itemWeaponDmgBonus: dmgBonus,

                    itemIsStorage: isStorage,
                    itemStorageMaxBulk: maxBulkStorage,

                }).then((invItem) => {
                    return invItem;
                });

              });
            });
        });
    }

    static removeInvItemFromInv(invItemID) {
        return InvItem.destroy({ where: { id: invItemID } })
        .then((result) => {
            return;
        });
    }

    static saveInvItemToNewBag(invItemID, bagItemID, isDropped) {
        let updateValues = { bagInvItemID: bagItemID, isDropped: isDropped };
        return InvItem.update(updateValues, { where: { id: invItemID } })
        .then((result) => {
            return;
        });
    }

    static saveInvItemQty(invItemID, newQty) {
        let updateValues = { quantity: newQty };
        return InvItem.update(updateValues, { where: { id: invItemID } })
        .then((result) => {
            return;
        });
    }

    static saveInvItemInvest(invItemID, isInvested) {
        let updateValues = { isInvested: isInvested };
        return InvItem.update(updateValues, { where: { id: invItemID } })
        .then((result) => {
            return;
        });
    }

    static saveInvItemHitPoints(invItemID, newHP) {
        let updateValues = { currentHitPoints: newHP };
        return InvItem.update(updateValues, { where: { id: invItemID } })
        .then((result) => {
            return;
        });
    }

    static saveInvItemCustomize(invItemID, inUpdateValues) {
        let updateValues = {
            name: inUpdateValues.name,
            price: inUpdateValues.price,
            bulk: inUpdateValues.bulk,
            description: inUpdateValues.description,
            size: inUpdateValues.size,
            isShoddy: inUpdateValues.isShoddy,
            materialType: inUpdateValues.materialType,
            hitPoints: inUpdateValues.hitPoints,
            brokenThreshold: inUpdateValues.brokenThreshold,
            hardness: inUpdateValues.hardness,
            code: inUpdateValues.code,
            itemTags: inUpdateValues.itemTagsData,

            itemWeaponDieType: inUpdateValues.weaponDieType,
            itemWeaponDamageType: inUpdateValues.weaponDamageType,
            itemWeaponRange: inUpdateValues.weaponRange,
            itemWeaponReload: inUpdateValues.weaponReload,
            itemWeaponAtkBonus: inUpdateValues.weaponAtkBonus,
            itemWeaponDmgBonus: inUpdateValues.weaponDmgBonus,

            itemStorageMaxBulk: inUpdateValues.storageMaxBulk,
        };
        return InvItem.update(updateValues, { where: { id: invItemID } })
        .then((result) => {
            return;
        });
    }

    static saveInnateSpellCastings(innateSpell, timesCastStr) {

        let timesCast = parseInt(timesCastStr);
        if(!isNaN(timesCast) && timesCast >= 0 && timesCast <= innateSpell.TimesPerDay) {

            let castingID = innateSpell.charID+':'+innateSpell.source+':'+innateSpell.sourceType+':'+innateSpell.sourceLevel+':'+innateSpell.sourceCode+':'+innateSpell.sourceCodeSNum+':'+innateSpell.SpellID+':'+innateSpell.SpellLevel+':'+innateSpell.SpellTradition+':'+innateSpell.TimesPerDay;
            let charUpVals = { timesCast: timesCast };
            
            return InnateSpellCasting.update(charUpVals, { where: { innateSpellID: castingID } })
            .then((result) => {
                return;
            });

        }

    }


    static addAnimalCompanion(charID, animalCompID) {
        return AnimalCompanion.findOne({ where: { id: animalCompID } })
        .then((animalComp) => {
            return CharAnimalCompanion.create({
                charID: charID,
                animalCompanionID: animalComp.id,
                age: 'YOUNG',
                specialization: 'NONE',
                name: animalComp.name,
                description: animalComp.description,
                imageURL: '',
                currentHP: -1,
            }).then((charAnimalComp) => {
                return charAnimalComp;
            });
        });
    }

    static deleteAnimalCompanion(charID, charAnimalCompID) {
        return CharAnimalCompanion.destroy({
            where: {
                id: charAnimalCompID,
                charID: charID
            }
        }).then((result) => {
            return;
        });
    }

    static updateAnimalCompanion(charID, charAnimalCompID, inUpdateValues) {
        let updateValues = {
            name: inUpdateValues.Name,
            description: inUpdateValues.Description,
            imageURL: inUpdateValues.ImageURL,
            currentHP: inUpdateValues.CurrentHealth,
            age: inUpdateValues.Age,
            specialization: inUpdateValues.Specialization,
        };
        return CharAnimalCompanion.update(updateValues, {
            where: {
                id: charAnimalCompID,
                charID: charID
            }
        }).then((result) => {
            return;
        });
    }



    static addSpecificFamiliar(charID, specificStruct) {
      return CharFamiliar.create({
        charID: charID,
        name: specificStruct.Name,
        description: specificStruct.Description,
        imageURL: '',
        currentHP: -1,
        abilitiesJSON: specificStruct.AbilsJSON,
        specificType: specificStruct.SpecificType,
      }).then((charFamiliar) => {
          return charFamiliar;
      });
    }

    static addFamiliar(charID) {
      return CharFamiliar.create({
        charID: charID,
        name: 'Familiar',
        description: '',
        imageURL: '',
        currentHP: -1,
      }).then((charFamiliar) => {
          return charFamiliar;
      });
    }

    static deleteFamiliar(charID, charFamiliarID) {
        return CharFamiliar.destroy({
            where: {
                id: charFamiliarID,
                charID: charID
            }
        }).then((result) => {
            return;
        });
    }

    static updateFamiliar(charID, charFamiliarID, inUpdateValues) {
        let updateValues = {
            name: inUpdateValues.Name,
            description: inUpdateValues.Description,
            imageURL: inUpdateValues.ImageURL,
            currentHP: inUpdateValues.CurrentHealth,
            abilitiesJSON: inUpdateValues.AbilitiesJSON,
        };
        return CharFamiliar.update(updateValues, {
            where: {
                id: charFamiliarID,
                charID: charID
            }
        }).then((result) => {
            return;
        });
    }


    static saveName(charID, name) {

        let charUpVals = {name: name };

        // Update char name
        return Character.update(charUpVals, { where: { id: charID } })
        .then((result) => {
            return;
        });

    }

    static saveLevel(charID, newLevel) {

        newLevel = parseInt(newLevel);
        let charUpVals = {level: newLevel };

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            let oldLevel = character.level;

            // Update char level
            return Character.update(charUpVals, { where: { id: charID } })
            .then((result) => {
                
                if(oldLevel > newLevel){
                    return CharDataMapping.deleteDataByGreaterThanSourceLevel(charID, newLevel)
                    .then((result) => {
                        return;
                    });
                } else {
                    return;
                }

            });
        });

    }

    static saveBuilderType(charID, builderType) {

      let charUpVals = { builderByLevel: ((builderType == 'by-level') ? 1 : 0) };

      // Update char builder type
      return Character.update(charUpVals, { where: { id: charID } })
      .then((result) => {
          return;
      });

    }

    static saveCharacterOption(charID, optionName, value) {

        let charUpVals = null;
        if(optionName === 'optionPublicCharacter'){
          charUpVals = {
            optionPublicCharacter: value
          };
        } else if(optionName === 'optionAutoDetectPreReqs'){
          charUpVals = {
            optionAutoDetectPreReqs: value
          };
        } else if(optionName === 'optionAutoHeightenSpells'){
          charUpVals = {
            optionAutoHeightenSpells: value
          };
        } else if(optionName === 'optionCustomCodeBlock'){
          charUpVals = {
            optionCustomCodeBlock: value
          };
        } else if(optionName === 'optionDiceRoller'){
          charUpVals = {
            optionDiceRoller: value
          };
        } else if(optionName === 'optionClassArchetypes'){
          charUpVals = {
            optionClassArchetypes: value
          };
        } else if(optionName === 'optionIgnoreBulk'){
          charUpVals = {
            optionIgnoreBulk: value
          };
        } else if(optionName === 'variantProfWithoutLevel'){
          charUpVals = {
            variantProfWithoutLevel: value
          };
        } else if(optionName === 'variantFreeArchetype'){
          charUpVals = {
            variantFreeArchetype: value
          };
        } else if(optionName === 'variantGradualAbilityBoosts'){
          charUpVals = {
            variantGradualAbilityBoosts: value
          };
        } else if(optionName === 'variantAncestryParagon'){
          charUpVals = {
            variantAncestryParagon: value
          };
        } else if(optionName === 'variantStamina'){
          charUpVals = {
            variantStamina: value
          };
        } else if(optionName === 'variantAutoBonusProgression'){
          charUpVals = {
            variantAutoBonusProgression: value
          };
        }

        if(charUpVals != null){
            return Character.update(charUpVals, { where: { id: charID } })
            .then((result) => {
                return;
            });
        } else {
            return Promise.resolve();
        }

    }

    static saveNoteField(charID, srcStruct, placeholderText, text) {
        let noteFieldID = srcStructToCode(charID, 'notesField', srcStruct);
        let upsertVals;
        if(text == null){
            upsertVals = {
                id: noteFieldID,
                charID: charID,
                placeholderText: placeholderText,
            };
        } else {
            upsertVals = {
                id: noteFieldID,
                charID: charID,
                placeholderText: placeholderText,
                text: text,
            };
        }
        return NoteField.upsert(upsertVals).then((result) => {
            return NoteField.findOne({ where: { id: noteFieldID} })
            .then((noteField) => {
                return CharDataMapping.setData(charID, 'notesField', srcStruct, 'StoredNoteField')
                .then((result) => {
                    srcStruct.value = 'StoredNoteField';
                    srcStruct.placeholderText = noteField.placeholderText;
                    srcStruct.text = noteField.text;
                    return srcStruct;
                });
            });
        });
    }

    static saveAbilityScores(charID, abilSTR, abilDEX, abilCON, abilINT, abilWIS, abilCHA) {

        let JSONBonusArray = JSON.stringify([
            abilSTR-10,
            abilDEX-10,
            abilCON-10,
            abilINT-10,
            abilWIS-10,
            abilCHA-10,
        ]);

        let srcStruct = {
            sourceType: 'other',
            sourceLevel: 1,
            sourceCode: 'none',
            sourceCodeSNum: 'a',
        };
        return CharDataMappingExt.setDataAbilityBonus(charID, srcStruct, 'ALL', JSONBonusArray)
        .then((result) => {
            return;
        });

    }

    static saveHeritage(charID, heritageID, isUniversal) {

        let charUpVals;
        if(isUniversal) {
            charUpVals = {
                uniHeritageID: heritageID,
                heritageID: null,
            };
        } else {
            charUpVals = {
                uniHeritageID: null,
                heritageID: heritageID,
            };
        }
        
        return Character.update(charUpVals, { where: { id: charID } })
        .then((result) => {
            return CharDataMapping.deleteDataBySourceCode(charID, 'heritage')
            .then((result) => {
                return;
            });
        });

    }

    static saveAncestry(charID, ancestryID) {

        let srcStruct = {
          sourceType: 'ancestry',
          sourceLevel: 1,
          sourceCode: 'defaultTag',
          sourceCodeSNum: 'a',
        };
        let charUpVals = {
            ancestryID: ancestryID,
            heritageID: null,
            uniHeritageID: null,
        };

        return CharDataMapping.deleteDataBySourceType(charID, 'ancestry')
        .then((result) => {
            return Character.update(charUpVals, { where: { id: charID } })
            .then((result) => {
                return Ancestry.findOne({ where: { id: ancestryID } })
                .then((newAncestry) => {
                    let newAncestryName = (newAncestry != null) ? newAncestry.name : '';
                    return CharTags.setTag(charID, srcStruct, newAncestryName).then((result) => {
                        return;
                    });
                });
            });
        });

    }

    static saveBackground(charID, backgroundID) {

        let charUpVals = {backgroundID: backgroundID };
        
        return Character.update(charUpVals, { where: { id: charID } })
        .then((result) => {
            return CharDataMapping.deleteDataBySourceType(charID, 'background')
            .then((result) => {
                return;
            });
        });

    }


    static saveClass(charID, classID, classNum) {

        if(classNum == 1){

          let charUpVals = {classID: classID };

          return Character.update(charUpVals, { where: { id: charID } })
          .then((result) => {
              return CharDataMapping.deleteDataBySourceType(charID, 'class')
              .then((result) => {
                  return;
              });
          });

        } else if(classNum == 2){

          let charUpVals = {classID_2: classID };

          return Character.update(charUpVals, { where: { id: charID } })
          .then((result) => {
              return CharDataMapping.deleteDataBySourceType(charID, 'class_2')
              .then((result) => {
                  return;
              });
          });

        } else {
          return Promise.resolve();
        }

    }



};