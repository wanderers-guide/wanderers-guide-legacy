
const CharGathering = require('./CharGathering');
const CharSaving = require('./CharSaving');
const CharSpells = require('./CharSpells');
const CharDataStoring = require('./CharDataStoring');
const AuthCheck = require('./AuthCheck');
const AdminUpdate = require('./AdminUpdate');
const GeneralUtils = require('./GeneralUtils');
const HomeBackReport = require('../models/backgroundDB/HomeBackReport');

function mapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v;
  }
  return obj;
}

module.exports = class SocketConnections {

  static sheetGeneral(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestCharacterSheetInfo', function(charID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharacterInfo(charID).then((charInfo) => {
              socket.emit('returnCharacterSheetInfo', charInfo);
            });
          }
        });
      });

      socket.on('requestNotesSave', function(charID, notes){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveNotes(charID, notes).then((result) => {
              socket.emit('returnNotesSave');
            });
          }
        });
      });

      socket.on('requestDetailsSave', function(charID, details){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveDetails(charID, details).then((result) => {
              socket.emit('returnDetailsSave');
            });
          }
        });
      });
    
      socket.on('requestExperienceSave', function(charID, newExp){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveExp(charID, newExp).then((result) => {
              // Return nothing
            });
          }
        });
      });
    
      socket.on('requestCurrentHitPointsSave', function(charID, currentHealth){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveCurrentHitPoints(charID, currentHealth).then((result) => {
              // Return nothing
            });
          }
        });
      });
    
      socket.on('requestTempHitPointsSave', function(charID, tempHealth){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveTempHitPoints(charID, tempHealth).then((result) => {
              // Return nothing
            });
          }
        });
      });
    
      socket.on('requestHeroPointsSave', function(charID, heroPoints){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveHeroPoints(charID, heroPoints).then((result) => {
              socket.emit('returnHeroPointsSave');
            });
          }
        });
      });

    });
    
  }

  static sheetItems(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestAddPropertyRune', function(invItemID, propRuneID, propRuneSlot){
        AuthCheck.ownsInvItem(socket, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(invItemID).then((invID) => {
              CharSaving.addPropRune(invItemID, propRuneID, propRuneSlot).then(() => {
                CharGathering.getInventory(invID).then((invStruct) => {
                  socket.emit('returnInvItemUpdated', invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestRemovePropertyRune', function(invItemID, propRuneSlot){
        AuthCheck.ownsInvItem(socket, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(invItemID).then((invID) => {
              CharSaving.removePropRune(invItemID, propRuneSlot).then(() => {
                CharGathering.getInventory(invID).then((invStruct) => {
                  socket.emit('returnInvItemUpdated', invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestAddFundamentalRune', function(invItemID, fundRuneID){
        AuthCheck.ownsInvItem(socket, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(invItemID).then((invID) => {
              CharSaving.addFundRune(invItemID, fundRuneID).then(() => {
                CharGathering.getInventory(invID).then((invStruct) => {
                  socket.emit('returnAddFundamentalRune', invItemID, invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestRemoveFundamentalRune', function(invItemID, fundRuneID){
        AuthCheck.ownsInvItem(socket, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(invItemID).then((invID) => {
              CharSaving.removeFundRune(invItemID, fundRuneID).then(() => {
                CharGathering.getInventory(invID).then((invStruct) => {
                  socket.emit('returnInvItemUpdated', invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestUpdateInventory', function(invID, equippedArmorInvItemID, equippedShieldInvItemID){
        AuthCheck.ownsInv(socket, invID).then((ownsInv) => {
          if(ownsInv){
            CharSaving.updateInventory(invID, equippedArmorInvItemID, equippedShieldInvItemID).then(() => {
              // Return nothing
            });
          }
        });
      });
    
      socket.on('requestAddItemToInv', function(invID, itemID, quantity){
        AuthCheck.ownsInv(socket, invID).then((ownsInv) => {
          if(ownsInv){
            CharSaving.addItemToInv(invID, itemID, quantity).then(() => {
              CharGathering.getInventory(invID).then((invStruct) => {
                socket.emit('returnAddItemToInv', itemID, invStruct);
              });
            });
          }
        });
      });
    
      socket.on('requestRemoveItemFromInv', function(invItemID){
        AuthCheck.ownsInvItem(socket, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(invItemID).then((invID) => {
              CharSaving.removeInvItemFromInv(invItemID).then(() => {
                CharGathering.getInventory(invID).then((invStruct) => {
                  socket.emit('returnRemoveItemFromInv', invItemID, invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestInvItemMoveBag', function(invItemID, bagItemID){
        AuthCheck.ownsInvItem(socket, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(invItemID).then((invID) => {
              CharSaving.saveInvItemToNewBag(invItemID, bagItemID).then(() => {
                CharGathering.getInventory(invID).then((invStruct) => {
                  socket.emit('returnInvItemMoveBag', invItemID, invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestInvItemQtyChange', function(invItemID, newQty){
        AuthCheck.ownsInvItem(socket, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(invItemID).then((invID) => {
              CharSaving.saveInvItemQty(invItemID, newQty).then(() => {
                CharGathering.getInventory(invID).then((invStruct) => {
                  socket.emit('returnInvItemUpdated', invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestInvItemHPChange', function(invItemID, newHP){
        AuthCheck.ownsInvItem(socket, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(invItemID).then((invID) => {
              CharSaving.saveInvItemHitPoints(invItemID, newHP).then(() => {
                CharGathering.getInventory(invID).then((invStruct) => {
                  socket.emit('returnInvItemUpdated', invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestCustomizeInvItem', function(invItemID, updateValues){
        AuthCheck.ownsInvItem(socket, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(invItemID).then((invID) => {
              CharSaving.saveInvItemCustomize(invItemID, updateValues).then(() => {
                CharGathering.getInventory(invID).then((invStruct) => {
                  socket.emit('returnInvItemUpdated', invStruct);
                });
              });
            });
          }
        });
      });

    });

  }

  static sheetConditions(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestAddCondition', function(charID, conditionID, value, sourceText, reloadCharSheet){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.addCondition(charID, conditionID, value, sourceText).then((result) => {
              socket.emit('returnUpdateConditionsMap', reloadCharSheet);
            });
          }
        });
      });
    
      socket.on('requestUpdateConditionValue', function(charID, conditionID, newValue, reloadCharSheet){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.updateConditionValue(charID, conditionID, newValue).then((result) => {
              socket.emit('returnUpdateConditionsMap', reloadCharSheet);
            });
          }
        });
      });
    
      socket.on('requestUpdateConditionActive', function(charID, conditionID, isActive, reloadCharSheet){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.updateConditionActive(charID, conditionID, isActive).then((result) => {
              socket.emit('returnUpdateConditionsMap', reloadCharSheet);
            });
          }
        });
      });
    
      socket.on('requestUpdateConditionActiveForArray', function(charID, conditionIDArray, isActive, reloadCharSheet){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.updateConditionActiveForArray(charID, conditionIDArray, isActive).then((result) => {
              socket.emit('returnUpdateConditionsMap', reloadCharSheet);
            });
          }
        });
      });
    
      socket.on('requestRemoveCondition', function(charID, conditionID, reloadCharSheet){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.removeCondition(charID, conditionID).then((result) => {
              socket.emit('returnUpdateConditionsMap', reloadCharSheet);
            });
          }
        });
      });

    });

  }


  static sheetSpells(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestSpellAddToSpellBook', function(charID, spellSRC, spellID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.addToSpellBook(charID, spellSRC, spellID).then((result) => {
              CharSpells.getSpellBook(charID, spellSRC).then((spellBookStruct) => {
                socket.emit('returnSpellBookUpdated', spellBookStruct);
              });
            });
          }
        });
      });

      socket.on('requestSpellRemoveFromSpellBook', function(charID, spellSRC, spellID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.removeFromSpellBook(charID, spellSRC, spellID).then((result) => {
              CharSpells.getSpellBook(charID, spellSRC).then((spellBookStruct) => {
                socket.emit('returnSpellBookUpdated', spellBookStruct);
              });
            });
          }
        });
      });

      socket.on('requestSpellBookUpdate', function(charID, spellSRC){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.getSpellBook(charID, spellSRC).then((spellBookStruct) => {
              socket.emit('returnSpellBookUpdated', spellBookStruct);
            });
          }
        });
      });

      socket.on('requestSpellSlotUpdate', function(charID, updateSlotObject){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.changeSpellSlot(charID, updateSlotObject).then((result) => {
              socket.emit('returnSpellSlotUpdate');
            });
          }
        });
      });

    });

  }
  

  static builderBasics(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestNameChange', function(charID, name){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            let validNameRegex = /^[A-Za-z0-9 ,]+$/;
            if(validNameRegex.test(name)) {
              CharSaving.saveName(charID, name).then((result) => {
                socket.emit('returnNameChange');
              });
            }
          }
        });
      });
    
      socket.on('requestLevelChange', function(charID, charLevel){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveLevel(charID, charLevel).then((result) => {
              socket.emit('returnLevelChange');
            });
          }
        });
      });
    
      socket.on('requestAbilityScoreChange', function(charID, abilSTR, abilDEX, abilCON, abilINT, abilWIS, abilCHA){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveAbilityScores(charID, abilSTR, abilDEX, abilCON, abilINT, abilWIS, abilCHA)
            .then((result) => {
              socket.emit('returnAbilityScoreChange');
            });
          }
        });
      });

      

    });
    
  }

  static builderAncestry(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestAncestryAndChoices', function(charID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllAncestries(false).then((ancestriesObject) => {
              CharGathering.getCharChoices(charID).then((choiceStruct) => {
                socket.emit('returnAncestryAndChoices', ancestriesObject, choiceStruct);
              });
            });
          }
        });
      });

      socket.on('requestAncestryChange', function(charID, ancestryID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveAncestry(charID, ancestryID).then((result) => {
              CharGathering.getCharChoices(charID).then((choiceStruct) => {
                socket.emit('returnAncestryChange', choiceStruct);
              });
            });
          }
        });
      });

      socket.on('requestHeritageChange', function(charID, heritageID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveHeritage(charID, heritageID).then((result) => {
              socket.emit('returnHeritageChange', heritageID);
            });
          }
        });
      });

    });
    
  }

  static builderBackground(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestBackgroundDetails', function(charID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllBackgrounds().then((backgrounds) => {
              CharGathering.getCharChoices(charID).then((choiceStruct) => {
                socket.emit('returnBackgroundDetails', backgrounds, choiceStruct);
              });
            });
          }
        });
      });

      socket.on('requestBackgroundChange', function(charID, backgroundID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveBackground(charID, backgroundID).then((result) => {
              CharGathering.getCharChoices(charID).then((choiceStruct) => {
                socket.emit('returnBackgroundChange', choiceStruct);
              });
            });
          }
        });
      });

    });
    
  }

  static builderClass(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestClassDetails', function(charID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllClasses().then((classObject) => {
              CharGathering.getCharChoices(charID).then((choiceStruct) => {
                socket.emit('returnClassDetails', classObject, choiceStruct);
              });
            });
          }
        });
      });

      socket.on('requestClassChange', function(charID, classID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveClass(charID, classID).then((result) => {
              CharGathering.getCharChoices(charID).then((choiceStruct) => {
                socket.emit('returnClassChange', choiceStruct);
              });
            });
          }
        });
      });

    });
    
  }

  
  static builderFinalize(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestFinalizeDetails', function(charID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharacter(charID).then((character) => {
              CharGathering.getClass(character.classID).then((cClass) => {
                CharGathering.getAbilityScores(charID).then((abilObject) => {
                  socket.emit('returnFinalizeDetails', character, abilObject, cClass);
                });
              });
            });
          }
        });
      });

    });
    
  }

  static builderGeneral(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){
    
      socket.on('requestAbilityBoostChange', function(charID, srcID, abilityBonusArray, selectBoostControlShellClass){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataStoring.replaceAbilityBonus(charID, srcID, abilityBonusArray)
            .then((result) => {
              socket.emit('returnAbilityBoostChange', selectBoostControlShellClass);
            });
          }
        });
      });

      socket.on('requestAbilityBonusChange', function(charID, srcID, abilityBonusArray){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataStoring.replaceAbilityBonus(charID, srcID, abilityBonusArray)
            .then((result) => {
              socket.emit('returnAbilityBonusChange');
            });
          }
        });
      });
    
      socket.on('requestSelectAbilityChange', function(charID, srcID, abilChangeArray){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataStoring.replaceAbilityChoice(charID, srcID, abilChangeArray)
            .then((result) => {
              socket.emit('returnSelectAbilityChange');
            });
          }
        });
      });
    
      socket.on('requestProficiencyChange', function(charID, profChangePacket, profArray){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataStoring.replaceProficiencies(charID, profChangePacket.srcID, profArray)
            .then((result) => {
              socket.emit('returnProficiencyChange', profChangePacket);
            });
          }
        });
      });
    
      socket.on('requestFeatChange', function(charID, featChangePacket, selectFeatControlShellClass){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataStoring.replaceBasicData(charID, featChangePacket.srcID, [featChangePacket.featID], 'dataChosenFeats')
            .then((result) => {
              socket.emit('returnFeatChange', featChangePacket, selectFeatControlShellClass);
            });
          }
        });
      });
    
      socket.on('requestLanguagesChange', function(charID, srcID, langIDArray){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataStoring.replaceBasicData(charID, srcID, langIDArray, 'dataLanguages')
            .then((result) => {
              socket.emit('returnLanguagesChange');
            });
          }
        });
      });

      socket.on('requestSensesChange', function(charID, srcID, senseIDArray){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataStoring.replaceBasicData(charID, srcID, senseIDArray, 'dataSenses')
            .then((result) => {
              socket.emit('returnSensesChange');
            });
          }
        });
      });

      socket.on('requestPhysicalFeaturesChange', function(charID, srcID, physicalFeatureIDArray){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataStoring.replaceBasicData(charID, srcID, physicalFeatureIDArray, 'dataPhysicalFeatures')
            .then((result) => {
              socket.emit('returnPhysicalFeaturesChange');
            });
          }
        });
      });

    });
    
  }

  static builderGeneralProcessing(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestLoreChange', function(charID, srcID, loreName){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataStoring.replaceBasicData(charID, srcID, [loreName], 'dataLoreCategories')
            .then((result) => {
              socket.emit('returnLoreChange');
            });
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestFeatChangeByName', function(charID, featChangePacket){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getFeatByName(featChangePacket.featName)
            .then((feat) => {
              if(feat != null){
                CharDataStoring.replaceBasicData(charID, featChangePacket.srcID, [feat.id], 'dataChosenFeats')
                .then((result) => {
                  socket.emit('returnFeatChange', featChangePacket, null);
                });
              } else {
                socket.emit('returnASCStatementFailure', 'Cannot find feat \"'+featChangePacket.featName+'\"');
              }
            });
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestLanguagesChangeByName', function(charID, srcID, langName){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getLanguageByName(langName)
            .then((language) => {
              if(language != null){
                CharDataStoring.replaceBasicData(charID, srcID, [language.id], 'dataLanguages')
                .then((result) => {
                  socket.emit('returnLanguagesChangeByName');
                });
              } else {
                socket.emit('returnASCStatementFailure', 'Cannot find language \"'+langName+'\"');
              }
            });
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      // Give Spell Slots //
      socket.on('requestSpellCastingChange', function(charID, srcID, spellSRC, spellcasting){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.setSpellCasting(charID, srcID, spellSRC, spellcasting)
            .then((spellSlots) => {
              if(spellSlots != null){
                socket.emit('returnSpellSlotChange');
              } else {
                socket.emit('returnASCStatementFailure', 'Invalid Spellcasting \"'+spellcasting+'\"');
              }
            });
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestSpellSlotChange', function(charID, srcID, spellSRC, spellSlot){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.setSpellSlot(charID, srcID, spellSRC, spellSlot)
            .then((spellSlot) => {
              if(spellSlots != null){
                socket.emit('returnSpellSlotChange');
              } else {
                socket.emit('returnASCStatementFailure', 'Invalid Spell Slot \"'+spellSlot+'\"');
              }
            });
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      // Set Key Ability for Spell SRC //
      socket.on('requestKeySpellAbilityChange', function(charID, srcID, spellSRC, abilityScore){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataStoring.replaceBasicData(charID, srcID, [spellSRC+"="+abilityScore], 'dataSpellKeyAbilities')
            .then((result) => {
              socket.emit('returnKeySpellAbilityChange');
            });
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      // Set Tradition for Spell SRC //
      socket.on('requestSpellTraditionChange', function(charID, srcID, spellSRC, spellList){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(spellList == 'OCCULT' || spellList == 'ARCANE' || spellList == 'DIVINE' || spellList == 'PRIMAL') {
              CharDataStoring.replaceBasicData(charID, srcID, [spellSRC+"="+spellList], 'dataSpellLists')
              .then((result) => {
                socket.emit('returnSpellListChange');
              });
            } else {
              socket.emit('returnASCStatementFailure', 'Invalid Spell Tradition \"'+spellList+'\"');
            }
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
          }
        });
      });

    });

  }

  static builderASC(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestASCChoices', function(charID, ascCode, srcID, locationID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharChoices(charID).then((choiceStruct) => {
              socket.emit('returnASCChoices', ascCode, srcID, locationID,
              choiceStruct);
            });
          }
        });
      });
    
      socket.on('requestASCFeats', function(charID, ascStatement, srcID, locationID, statementNum){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllFeats().then((featsObject) => {
              socket.emit('returnASCFeats', ascStatement, srcID, locationID, 
                    statementNum, featsObject);
            });
          }
        });
      });
    
      socket.on('requestASCSkills', function(charID, ascStatement, srcID, locationID, statementNum){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllSkills(charID).then((skillsObject) => {
              socket.emit('returnASCSkills', ascStatement, srcID, locationID, 
                    statementNum, skillsObject);
            });
          }
        });
      });
    
      socket.on('requestASCLangs', function(charID, ascStatement, srcID, locationID, statementNum){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllLanguages(charID).then((langsObject) => {
              socket.emit('returnASCLangs', ascStatement, srcID, locationID, 
                    statementNum, langsObject);
            });
          }
        });
      });
    
      socket.on('requestASCClassAbilities', function(charID, classAbilities){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllFeats().then((featsObject) => {
              CharGathering.getAllSkills(charID).then((skillsObject) => {
                CharGathering.getCharChoices(charID).then((choiceStruct) => {
                  socket.emit('returnASCClassAbilities', choiceStruct, 
                        featsObject, skillsObject, classAbilities);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestASCAncestryFeats', function(charID, ancestryFeatsLocs){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllFeats().then((featsObject) => {
              CharGathering.getAllSkills(charID).then((skillsObject) => {
                CharGathering.getCharChoices(charID).then((choiceStruct) => {
                  socket.emit('returnASCAncestryFeats', choiceStruct, 
                        featsObject, skillsObject, ancestryFeatsLocs);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestASCUpdateChoices', function(charID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharChoices(charID).then((choiceStruct) => {
              socket.emit('returnASCUpdateChoices', choiceStruct);
            });
          }
        });
      });
    
      socket.on('requestASCUpdateSkills', function(charID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllSkills(charID).then((skillsObject) => {
              socket.emit('returnASCUpdateSkills', skillsObject);
            });
          }
        });
      });

      socket.on('requestASCProcessClear', function(charID, srcID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.clearDataOfSrc(charID, srcID).then((result) => {
              socket.emit('returnASCProcessClear');
            });
          }
        });
      });

    });
    
  }

  static homePage(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestBackgroundReport', function(backgroundID, email, message){
        if(message.length > 5 && GeneralUtils.validateEmail(email)) {
          let userID = null;
          if(socket.request.session.passport != null){
            userID = socket.request.session.passport.user;
          }
          HomeBackReport.create({
            userID: userID,
            backgroundID: backgroundID,
            email: email,
            message: message
          }).then((result) => {
            socket.emit('returnBackgroundReport');
          });
        } else {
          socket.emit('returnBackgroundReport');
        }
      });

    });
    
  }

  static adminPanel(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestAdminAddAncestry', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminUpdate.addAncestry(data).then((result) => {
              socket.emit('returnAdminCompleteAncestry');
            });
          }
        });
      });

      socket.on('requestAdminUpdateAncestry', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.ancestryID != null) {
              AdminUpdate.archiveAncestry(data.ancestryID, true).then((result) => {
                AdminUpdate.addAncestry(data).then((result) => {
                  socket.emit('returnAdminCompleteAncestry');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestAdminRemoveAncestry', function(ancestryID){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminUpdate.deleteAncestry(ancestryID).then((result) => {
              socket.emit('returnAdminRemoveAncestry');
            });
          }
        });
      });

      socket.on('requestAdminAncestryDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            CharGathering.getAllAncestries(true).then((ancestriesObject) => {
              CharGathering.getAllFeats().then((featsObject) => {
                socket.emit('returnAdminAncestryDetails', ancestriesObject, featsObject);
              });
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddFeat', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminUpdate.addFeat(data).then((result) => {
              socket.emit('returnAdminCompleteFeat');
            });
          }
        });
      });

      socket.on('requestAdminUpdateFeat', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.featID != null) {
              AdminUpdate.archiveFeat(data.featID, true).then((result) => {
                AdminUpdate.addFeat(data).then((result) => {
                  socket.emit('returnAdminCompleteFeat');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestAdminRemoveFeat', function(featID){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminUpdate.deleteFeat(featID).then((result) => {
              socket.emit('returnAdminRemoveFeat');
            });
          }
        });
      });

      socket.on('requestAdminFeatDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            CharGathering.getAllFeats().then((featsObject) => {
              socket.emit('returnAdminFeatDetails', featsObject);
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddItem', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminUpdate.addItem(data).then((result) => {
              socket.emit('returnAdminCompleteItem');
            });
          }
        });
      });

      socket.on('requestAdminUpdateItem', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.itemID != null) {
              AdminUpdate.archiveItem(data.itemID, true).then((result) => {
                AdminUpdate.addItem(data).then((result) => {
                  socket.emit('returnAdminCompleteItem');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestAdminRemoveItem', function(itemID){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminUpdate.deleteItem(itemID).then((result) => {
              socket.emit('returnAdminRemoveItem');
            });
          }
        });
      });

      socket.on('requestAdminItemDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            CharGathering.getAllItems().then((itemMap) => {
              socket.emit('returnAdminItemDetails', mapToObj(itemMap));
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddSpell', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminUpdate.addSpell(data).then((result) => {
              socket.emit('returnAdminCompleteSpell');
            });
          }
        });
      });

      socket.on('requestAdminUpdateSpell', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.spellID != null) {
              AdminUpdate.archiveSpell(data.spellID, true).then((result) => {
                AdminUpdate.addSpell(data).then((result) => {
                  socket.emit('returnAdminCompleteSpell');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestAdminRemoveSpell', function(spellID){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminUpdate.deleteSpell(spellID).then((result) => {
              socket.emit('returnAdminRemoveSpell');
            });
          }
        });
      });

      socket.on('requestAdminSpellDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            CharGathering.getAllSpells().then((spellMap) => {
              socket.emit('returnAdminSpellDetails', mapToObj(spellMap));
            });
          }
        });
      });

    });
  }

};