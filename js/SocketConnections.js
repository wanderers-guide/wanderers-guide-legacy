
const CharGathering = require('./CharGathering');
const CharSaving = require('./CharSaving');
const CharContentSources = require('./CharContentSources');
const CharSpells = require('./CharSpells');
const CharTags = require('./CharTags');
const CharDataMapping = require('./CharDataMapping');
const CharDataMappingExt = require('./CharDataMappingExt');
const AuthCheck = require('./AuthCheck');
const GeneralGathering = require('./GeneralGathering');
const HomebrewGathering = require('./HomebrewGathering');
const AdminCreation = require('./AdminCreation');
const HomebrewCreation = require('./HomebrewCreation');
const ClientAPI = require('./ClientAPI');
const CharStateUtils = require('./CharStateUtils');
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
              socket.emit('returnCharacterSheetInfo', charInfo, false);
            });
          } else {
            CharGathering.getCharacter(charID).then((character) => {
              if(CharStateUtils.isPublic(character)){
                CharGathering.getCharacterInfo(charID).then((charInfo) => {
                  socket.emit('returnCharacterSheetInfo', charInfo, true);
                });
              }
            });
          }
        });
      });

      socket.on('requestFinalProfsAndSkills', function(charID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getFinalProfs(charID).then((profMap) => {
              CharGathering.getAllSkills(charID).then((skillObject) => {
                socket.emit('requestFinalProfsAndSkills', mapToObj(profMap), skillObject);
              });
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

      socket.on('requestNotesFieldSave', function(charID, notesData, notesFieldControlShellID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveNoteField(charID, notesData, notesData.placeholderText, notesData.text)
            .then((result) => {
              socket.emit('returnNotesFieldSave', notesFieldControlShellID);
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

      socket.on('requestInvUpdate', function(charID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharacter(charID).then((character) => {
              CharGathering.getInventory(character.inventoryID).then((invStruct) => {
                socket.emit('returnInvUpdate', invStruct);
              });
            });
          }
        });
      });

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
            CharSaving.addItemToInv(invID, itemID, quantity).then((invItem) => {
              CharGathering.getInventory(invID).then((invStruct) => {
                CharGathering.getItem(itemID).then((item) => {
                  socket.emit('returnAddItemToInv', item, invItem, invStruct);
                });
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
    
      socket.on('requestInvItemMoveBag', function(invItemID, bagInvItemID, isDropped){
        AuthCheck.ownsInvItem(socket, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(invItemID).then((invID) => {
              CharSaving.saveInvItemToNewBag(invItemID, bagInvItemID, isDropped).then(() => {
                CharGathering.getInventory(invID).then((invStruct) => {
                  socket.emit('returnInvItemMoveBag', invItemID, invStruct);
                });
              });
            });
          }
        });
      });

      socket.on('requestAddItemToBag', function(itemID, quantity, bagInvItemID){
        AuthCheck.ownsInvItem(socket, bagInvItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(bagInvItemID).then((invID) => {
              CharSaving.addItemToInv(invID, itemID, quantity).then((invItem) => {
                CharSaving.saveInvItemToNewBag(invItem.id, bagInvItemID, 0).then(() => {
                  socket.emit('returnAddItemToBag');
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

      socket.on('requestInvItemInvestChange', function(invItemID, isInvested){
        AuthCheck.ownsInvItem(socket, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(invItemID).then((invID) => {
              CharSaving.saveInvItemInvest(invItemID, isInvested).then(() => {
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

      socket.on('requestConditionChange', function(charID, conditionID, value, sourceText, parentID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.replaceCondition(charID, conditionID, value, sourceText, parentID).then((result) => {
              CharGathering.getAllCharConditions(charID)
              .then((conditionsObject) => {
                socket.emit('returnUpdateConditionsMap', conditionsObject, true);
              });
            });
          }
        });
      });

      socket.on('requestConditionRemove', function(charID, conditionID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.removeCondition(charID, conditionID).then((didRemove) => {
              CharGathering.getAllCharConditions(charID)
              .then((conditionsObject) => {
                socket.emit('returnUpdateConditionsMap', conditionsObject, didRemove);
              });
            });
          }
        });
      });

    });

  }


  static sheetSpells(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestSpellAddToSpellBook', function(charID, spellSRC, spellID, spellLevel){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.addToSpellBook(charID, spellSRC, spellID, spellLevel).then((result) => {
              CharSpells.getSpellBook(charID, spellSRC, false).then((spellBookStruct) => {
                socket.emit('returnSpellBookUpdated', spellBookStruct);
              });
            });
          }
        });
      });

      socket.on('requestSpellRemoveFromSpellBook', function(charID, spellSRC, spellID, spellLevel){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.removeFromSpellBook(charID, spellSRC, spellID, spellLevel).then((result) => {
              CharSpells.getSpellBook(charID, spellSRC, false).then((spellBookStruct) => {
                socket.emit('returnSpellBookUpdated', spellBookStruct);
              });
            });
          }
        });
      });

      socket.on('requestSpellBookUpdate', function(charID, spellSRC){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.getSpellBook(charID, spellSRC, false).then((spellBookStruct) => {
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

      socket.on('requestInnateSpellCastingUpdate', function(innateSpell, timesCast){
        if(innateSpell != null) {
          AuthCheck.ownsCharacter(socket, innateSpell.charID).then((ownsChar) => {
            if(ownsChar){
              CharSaving.saveInnateSpellCastings(innateSpell, timesCast).then((result) => {
                socket.emit('returnInnateSpellCastingUpdate');
              });
            }
          });
        }
      });

      
      socket.on('requestFocusSpellUpdate', function(charID, srcStruct, spellSRC, spellID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setData(charID, 'focusSpell', srcStruct, spellSRC+"="+spellID)
            .then((result) => {
              socket.emit('returnFocusSpellUpdate');
            });
          }
        });
      });
      socket.on('requestFocusPointUpdate', function(charID, srcStruct, unused){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setData(charID, 'focusPoint', srcStruct, unused)
            .then((result) => {
              socket.emit('returnFocusPointUpdate');
            });
          }
        });
      });

    });

  }


  static sheetCompanions(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestAddAnimalCompanion', function(charID, animalCompID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.addAnimalCompanion(charID, animalCompID).then((charAnimalComp) => {
              socket.emit('returnAddAnimalCompanion', charAnimalComp);
            });
          }
        });
      });

      socket.on('requestUpdateAnimalCompanion', function(charID, charAnimalCompID, updateValues){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.updateAnimalCompanion(charID, charAnimalCompID, updateValues).then(() => {
              socket.emit('returnUpdateAnimalCompanion');
            });
          }
        });
      });

      socket.on('requestRemoveAnimalCompanion', function(charID, charAnimalCompID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.deleteAnimalCompanion(charID, charAnimalCompID).then(() => {
              socket.emit('returnRemoveAnimalCompanion', charAnimalCompID);
            });
          }
        });
      });



      socket.on('requestAddFamiliar', function(charID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.addFamiliar(charID).then((charFamiliar) => {
              socket.emit('returnAddFamiliar', charFamiliar);
            });
          }
        });
      });

      socket.on('requestAddSpecificFamiliar', function(charID, specificStruct){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.addSpecificFamiliar(charID, specificStruct).then((charFamiliar) => {
              socket.emit('returnAddFamiliar', charFamiliar);
            });
          }
        });
      });

      socket.on('requestUpdateFamiliar', function(charID, charFamiliarID, updateValues){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.updateFamiliar(charID, charFamiliarID, updateValues).then(() => {
              socket.emit('returnUpdateFamiliar');
            });
          }
        });
      });

      socket.on('requestRemoveFamiliar', function(charID, charFamiliarID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.deleteFamiliar(charID, charFamiliarID).then(() => {
              socket.emit('returnRemoveFamiliar', charFamiliarID);
            });
          }
        });
      });

    });

  }
  

  static builderBasics(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestCharacterDetails', function(charID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharacter(charID).then((character) => {
              ClientAPI.getClientsWhoAccess(charID).then((clientsWithAccess) => {
                socket.emit('returnCharacterDetails', character, clientsWithAccess);
              });
            });
          }
        });
      });

      socket.on('requestCharacterRemoveClientAccess', function(charID, clientID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            ClientAPI.removeAccessToken(charID, clientID).then((result) => {
              ClientAPI.getClientsWhoAccess(charID).then((clientsWithAccess) => {
                socket.emit('returnCharacterRemoveClientAccess', clientsWithAccess);
              });
            });
          }
        });
      });

      socket.on('requestNameChange', function(charID, name){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            let validNameRegex = /^[^@#$%^*~=\/\\]+$/;
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

      socket.on('requestCharacterOptionChange', function(charID, optionName, value){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveCharacterOption(charID, optionName, value).then((result) => {
              socket.emit('returnCharacterOptionChange');
            });
          }
        });
      });

      socket.on('requestCharacterSourceChange', function(charID, sourceName, isAdd){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(isAdd) {
              CharContentSources.addSource(charID, sourceName).then((result) => {
                socket.emit('returnCharacterSourceChange');
              });
            } else {
              CharContentSources.removeSource(charID, sourceName).then((result) => {
                socket.emit('returnCharacterSourceChange');
              });
            }
          }
        });
      });

    });
    
  }

  static builderAncestry(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestAncestryDetails', function(charID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllAncestries(charID, false).then((ancestriesObject) => {
              CharGathering.getAllUniHeritages(charID).then((uniHeritageArray) => {
                CharGathering.getCharChoices(charID).then((choiceStruct) => {
                  CharGathering.getBuilderCore(charID).then((coreDataStruct) => {
                    socket.emit('returnAncestryDetails', coreDataStruct, ancestriesObject, uniHeritageArray, choiceStruct);
                  });
                });
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

      socket.on('requestHeritageChange', function(charID, heritageID, isUniversal){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveHeritage(charID, heritageID, isUniversal).then((result) => {
              return CharTags.getTags(charID)
              .then((charTagsArray) => {
                socket.emit('returnHeritageChange', heritageID, isUniversal, charTagsArray);
              });
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
            CharGathering.getAllBackgrounds(charID).then((backgrounds) => {
              CharGathering.getCharChoices(charID).then((choiceStruct) => {
                CharGathering.getBuilderCore(charID).then((coreDataStruct) => {
                  socket.emit('returnBackgroundDetails', coreDataStruct, backgrounds, choiceStruct);
                });
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
            CharGathering.getAllClasses(charID).then((classObject) => {
              CharGathering.getCharChoices(charID).then((choiceStruct) => {
                CharGathering.getBuilderCore(charID).then((coreDataStruct) => {
                  socket.emit('returnClassDetails', coreDataStruct, classObject, choiceStruct);
                });
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
              CharGathering.getClass(charID, character.classID).then((classDetails) => {
                CharGathering.getAncestry(character.ancestryID).then((ancestry) => {
                  CharGathering.getCharChoices(charID).then((choiceStruct) => {
                    CharGathering.getBuilderCore(charID).then((coreDataStruct) => {
                      socket.emit('returnFinalizeDetails', coreDataStruct, character, classDetails.Class, ancestry, choiceStruct);
                    });
                  });
                });
              });
            });
          }
        });
      });

      socket.on('requestLangsAndTrainingsClear', function(charID, srcStruct){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.deleteData(charID, 'languages', srcStruct)
            .then((result) => {
              CharDataMapping.deleteData(charID, 'proficiencies', srcStruct)
              .then((result) => {
                socket.emit('returnLangsAndTrainingsClear', srcStruct);
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

      socket.on('requestAbilityBonusChange', function(charID, srcStruct, abilityBonusStruct){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(abilityBonusStruct == null){
              CharDataMapping.deleteData(charID, 'abilityBonus', srcStruct)
              .then((result) => {
                socket.emit('returnAbilityBonusChange');
              });
            } else {
              CharDataMappingExt.setDataAbilityBonus(charID, srcStruct, abilityBonusStruct.Ability, abilityBonusStruct.Bonus)
              .then((result) => {
                socket.emit('returnAbilityBonusChange');
              });
            }
          }
        });
      });
    
      socket.on('requestClassChoiceChange', function(charID, srcStruct, classChoiceStruct){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(classChoiceStruct == null){
              CharDataMapping.deleteData(charID, 'classChoice', srcStruct)
              .then((result) => {
                socket.emit('returnClassChoiceChange', srcStruct, null, null);
              });
            } else {
              CharDataMappingExt.setDataClassChoice(charID, srcStruct, classChoiceStruct.SelectorID, classChoiceStruct.OptionID)
              .then((result) => {
                socket.emit('returnClassChoiceChange', srcStruct, classChoiceStruct.SelectorID, classChoiceStruct.OptionID);
              });
            }
          }
        });
      });
    
      socket.on('requestProficiencyChange', function(charID, profChangePacket, profStruct){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            let srcStruct = profChangePacket.srcStruct;
            if(profStruct == null){
              CharDataMapping.deleteData(charID, 'proficiencies', srcStruct)
              .then((result) => {
                socket.emit('returnProficiencyChange', profChangePacket);
              });
            } else {
              CharDataMappingExt.setDataProficiencies(charID, srcStruct, profStruct.For, profStruct.To, profStruct.Prof)
              .then((result) => {
                socket.emit('returnProficiencyChange', profChangePacket);
              });
            }
          }
        });
      });
    
      socket.on('requestFeatChange', function(charID, featChangePacket){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            let srcStruct = featChangePacket.srcStruct;
            if(featChangePacket.featID == null){
              CharDataMapping.deleteData(charID, 'chosenFeats', srcStruct)
              .then((result) => {
                socket.emit('returnFeatChange', featChangePacket);
              });
            } else {
              CharDataMapping.setData(charID, 'chosenFeats', srcStruct, featChangePacket.featID)
              .then((result) => {
                socket.emit('returnFeatChange', featChangePacket);
              });
            }
          }
        });
      });
    
      socket.on('requestLanguageChange', function(charID, srcStruct, langID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(langID == null){
              CharDataMapping.deleteData(charID, 'languages', srcStruct)
              .then((result) => {
                socket.emit('returnLanguageChange');
              });
            } else {
              CharDataMapping.setData(charID, 'languages', srcStruct, langID)
              .then((result) => {
                socket.emit('returnLanguageChange');
              });
            }
          }
        });
      });

      socket.on('requestSensesChange', function(charID, srcStruct, senseID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(senseID == null){
              CharDataMapping.deleteData(charID, 'senses', srcStruct)
              .then((result) => {
                socket.emit('returnSensesChange');
              });
            } else {
              CharDataMapping.setData(charID, 'senses', srcStruct, senseID)
              .then((result) => {
                socket.emit('returnSensesChange');
              });
            }
          }
        });
      });

      socket.on('requestPhysicalFeaturesChange', function(charID, srcStruct, physicalFeatureID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(physicalFeatureID == null){
              CharDataMapping.deleteData(charID, 'phyFeats', srcStruct)
              .then((result) => {
                socket.emit('returnPhysicalFeaturesChange');
              });
            } else {
              CharDataMapping.setData(charID, 'phyFeats', srcStruct, physicalFeatureID)
              .then((result) => {
                socket.emit('returnPhysicalFeaturesChange');
              });
            }
          }
        });
      });

      socket.on('requestDomainChange', function(charID, srcStruct, domain){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(domain == null || domain.Domain == null){
              CharDataMapping.deleteData(charID, 'domains', srcStruct)
              .then((result) => {
                socket.emit('returnDomainChange');
              });
            } else {
              CharDataMapping.setData(charID, 'domains', srcStruct, domain.Domain.id)
              .then((result) => {
                CharDataMapping.setData(charID, 'focusSpell', srcStruct, 
                    domain.SpellSRC+"="+domain.Domain.initialSpellID)
                .then((result) => {
                  socket.emit('returnDomainChange');
                });
              });
            }
          }
        });
      });

      socket.on('requestDomainAdvancementChange', function(charID, srcStruct, domain){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(domain == null || domain.Domain == null){
              CharDataMapping.deleteData(charID, 'advancedDomains', srcStruct)
              .then((result) => {
                socket.emit('returnDomainAdvancementChange');
              });
            } else {
              CharDataMapping.setData(charID, 'advancedDomains', srcStruct, domain.Domain.id)
              .then((result) => {
                CharDataMapping.setData(charID, 'focusSpell', srcStruct, 
                    domain.SpellSRC+"="+domain.Domain.advancedSpellID)
                .then((result) => {
                  socket.emit('returnDomainAdvancementChange');
                });
              });
            }
          }
        });
      });

    });
    
  }

  static builderGeneralProcessing(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestLoreChange', function(charID, srcStruct, loreName, inputPacket=null){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(loreName == null){
              CharDataMapping.deleteData(charID, 'loreCategories', srcStruct)
              .then((result) => {
                CharDataMapping.deleteData(charID, 'proficiencies', srcStruct)
                .then((result) => {
                  socket.emit('returnLoreChange', srcStruct, loreName, inputPacket);
                });
              });
            } else {
              CharDataMapping.setData(charID, 'loreCategories', srcStruct, loreName)
              .then((result) => {
                CharDataMappingExt.setDataProficiencies(charID, srcStruct, 'Skill', loreName+'_LORE', 'T')
                .then((result) => {
                  socket.emit('returnLoreChange', srcStruct, loreName, inputPacket);
                });
              });
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestWeaponFamiliarityChange', function(charID, srcStruct, trait){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setData(charID, 'weaponFamiliarity', srcStruct, trait)
            .then((result) => {
              socket.emit('returnWeaponFamiliarityChange');
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestWeaponSpecializationChange', function(charID, srcStruct, type){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(type === 1 || type === 2 || type === 3) {
              CharDataMapping.setData(charID, 'weaponSpecialization', srcStruct, type)
              .then((result) => {
                socket.emit('returnWeaponSpecializationChange');
              });
            } else {
              socket.emit('returnWSCStatementFailure', 'Invalid weapon specialization type \"'+type+'\"');
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestArmorSpecializationChange', function(charID, srcStruct, weapName){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setData(charID, 'armorSpecialization', srcStruct, weapName)
            .then((result) => {
              socket.emit('returnArmorSpecializationChange');
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestWeaponCriticalSpecializationChange', function(charID, srcStruct, weapName){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setData(charID, 'weaponCriticalSpecialization', srcStruct, weapName)
            .then((result) => {
              socket.emit('returnWeaponCriticalSpecializationChange');
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestSpeedChange', function(charID, srcStruct, speedType, speedAmt){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            let amount = parseInt(speedAmt);
            if(!isNaN(amount) || speedAmt === 'LAND_SPEED') {
              CharDataMappingExt.setDataOtherSpeed(charID, srcStruct, speedType, speedAmt)
              .then((result) => {
                socket.emit('returnSpeedChange');
              });
            } else {
              socket.emit('returnWSCStatementFailure', 'Invalid Speed Amount \"'+speedAmt+'\"');
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestCharTagChange', function(charID, srcStruct, charTag){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharTags.setTag(charID, srcStruct, charTag)
            .then((result) => {
              return CharTags.getTags(charID)
              .then((charTagsArray) => {
                socket.emit('returnCharTagChange', charTagsArray);
              });
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestFeatChangeByName', function(charID, featChangePacket){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getFeatByName(featChangePacket.featName)
            .then((feat) => {
              if(feat != null){
                let srcStruct = featChangePacket.srcStruct;
                CharDataMapping.setData(charID, 'chosenFeats', srcStruct, feat.id)
                .then((result) => {
                  socket.emit('returnFeatChangeByName', featChangePacket);
                });
              } else {
                socket.emit('returnWSCStatementFailure', 'Cannot find feat \"'+featChangePacket.featName+'\"');
              }
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestLanguageChangeByName', function(charID, srcStruct, langName){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getLanguageByName(langName)
            .then((language) => {
              if(language != null){
                CharDataMapping.setData(charID, 'languages', srcStruct, language.id)
                .then((result) => {
                  socket.emit('returnLanguageChangeByName');
                });
              } else {
                socket.emit('returnWSCStatementFailure', 'Cannot find language \"'+langName+'\"');
              }
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestSensesChangeByName', function(charID, srcStruct, senseName){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getSenseTypeByName(senseName)
            .then((senseType) => {
              if(senseType != null){
                CharDataMapping.setData(charID, 'senses', srcStruct, senseType.id)
                .then((result) => {
                  socket.emit('returnSensesChangeByName');
                });
              } else {
                socket.emit('returnWSCStatementFailure', 'Cannot find sense \"'+senseName+'\"');
              }
            });
          }
        });
      });

      socket.on('requestPhysicalFeaturesChangeByName', function(charID, srcStruct, physicalFeatureName){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.gePhyFeatByName(physicalFeatureName)
            .then((physicalFeature) => {
              if(physicalFeature != null){
                CharDataMapping.setData(charID, 'phyFeats', srcStruct, physicalFeature.id)
                .then((result) => {
                  socket.emit('returnPhysicalFeaturesChangeByName');
                });
              } else {
                socket.emit('returnWSCStatementFailure', 'Cannot find physical feature \"'+physicalFeatureName+'\"');
              }
            });
          }
        });
      });

      // Give Spell Slots //
      socket.on('requestSpellCastingSlotChange', function(charID, srcStruct, spellSRC, spellcasting){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.setSpellCasting(charID, srcStruct, spellSRC, spellcasting)
            .then((spellSlots) => {
              if(spellSlots != null){
                socket.emit('returnSpellSlotChange');
              } else {
                socket.emit('returnWSCStatementFailure', 'Invalid Spellcasting \"'+spellcasting+'\"');
              }
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestSpellSlotChange', function(charID, srcStruct, spellSRC, spellSlot){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.setSpellSlot(charID, srcStruct, spellSRC, spellSlot)
            .then((spellSlot) => {
              if(spellSlot != null){
                socket.emit('returnSpellSlotChange');
              } else {
                socket.emit('returnWSCStatementFailure', 'Invalid Spell Slot \"'+spellSlot+'\"');
              }
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      // Set Key Ability for Spell SRC //
      socket.on('requestKeySpellAbilityChange', function(charID, srcStruct, spellSRC, abilityScore){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setData(charID, 'spellKeyAbilities', srcStruct, spellSRC+"="+abilityScore)
            .then((result) => {
              socket.emit('returnKeySpellAbilityChange');
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      // Set Spellcasting Type for Spell SRC //
      socket.on('requestSpellCastingTypeChange', function(charID, srcStruct, spellSRC, castingType){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setData(charID, 'spellCastingType', srcStruct, spellSRC+"="+castingType)
            .then((result) => {
              socket.emit('returnSpellCastingTypeChange');
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      // Set Tradition for Spell SRC //
      socket.on('requestSpellTraditionChange', function(charID, srcStruct, spellSRC, spellList){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(spellList == 'OCCULT' || spellList == 'ARCANE' || spellList == 'DIVINE' || spellList == 'PRIMAL') {
              CharDataMapping.setData(charID, 'spellLists', srcStruct, spellSRC+"="+spellList)
              .then((result) => {
                socket.emit('returnSpellListChange');
              });
            } else {
              socket.emit('returnWSCStatementFailure', 'Invalid Spell Tradition \"'+spellList+'\"');
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      // Add Spell to Spellbook for Spell SRC //
      socket.on('requestBuilderSpellAddToSpellBook', function(charID, srcStruct, spellSRC, spellName, spellLevel){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            let sLevel = parseInt(spellLevel);
            if(!isNaN(sLevel)) {
              CharGathering.getSpellByName(spellName)
              .then((spell) => {
                if(spell != null){
                  if(spell.level <= sLevel) {
                    CharSpells.addToSpellBookFromBuilder(charID, spellSRC, spell.id, sLevel, srcStruct)
                    .then((result) => {
                      socket.emit('returnBuilderSpellAddToSpellBook');
                    });
                  } else {
                    socket.emit('returnWSCStatementFailure', 'Spell level cannot be lower than minimum spell level!');
                  }
                } else {
                  socket.emit('returnWSCStatementFailure', 'Invalid Spell \"'+spellName+'\"');
                }
              });
            } else {
              socket.emit('returnWSCStatementFailure', 'Invalid Parameters \"'+spellLevel+'\"');
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      // Innate Spell //
      socket.on('requestInnateSpellChange', function(charID, srcStruct, spellName, spellLevel, spellTradition, timesPerDay){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(spellTradition == 'OCCULT' || spellTradition == 'ARCANE' || spellTradition == 'DIVINE' || spellTradition == 'PRIMAL') {
              let tPd = parseInt(timesPerDay);
              let sLevel = parseInt(spellLevel);
              if(!isNaN(tPd) && !isNaN(sLevel)) {
                CharGathering.getSpellByName(spellName)
                .then((spell) => {
                  if(spell != null){
                    if(spell.level <= sLevel) {
                      CharDataMappingExt.setDataInnateSpell(charID, srcStruct, spell.id, sLevel, spellTradition, tPd)
                      .then((result) => {
                        socket.emit('returnInnateSpellChange');
                      });
                    } else {
                      socket.emit('returnWSCStatementFailure', 'Spell level cannot be lower than minimum spell level!');
                    }
                  } else {
                    socket.emit('returnWSCStatementFailure', 'Invalid Spell \"'+spellName+'\"');
                  }
                });
              } else {
                socket.emit('returnWSCStatementFailure', 'Invalid Parameters \"'+timesPerDay+'\" and / or \"'+spellLevel+'\"');
              }
            } else {
              socket.emit('returnWSCStatementFailure', 'Invalid Spell Tradition \"'+spellTradition+'\"');
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      // Focus Spell //
      socket.on('requestFocusSpellChange', function(charID, srcStruct, spellSRC, spellName){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getSpellByName(spellName)
            .then((spell) => {
              if(spell != null){
                if(spell.isFocusSpell === 1){
                  CharDataMapping.setData(charID, 'focusSpell', srcStruct, spellSRC+"="+spell.id)
                  .then((result) => {
                    socket.emit('returnFocusSpellChange');
                  });
                } else {
                  socket.emit('returnWSCStatementFailure', '\"'+spellName+'\" is not a focus spell!');
                }
              } else {
                socket.emit('returnWSCStatementFailure', 'Invalid Spell \"'+spellName+'\"');
              }
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestFocusPointChange', function(charID, srcStruct){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setData(charID, 'focusPoint', srcStruct, '1')
            .then((result) => {
              socket.emit('returnFocusPointChange');
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      // Resistances //
      socket.on('requestResistanceChange', function(charID, srcStruct, resistType, resistAmount){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMappingExt.setDataResistance(charID, srcStruct, resistType, resistAmount)
            .then((result) => {
              socket.emit('returnResistanceChange');
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestVulnerabilityChange', function(charID, srcStruct, vulnerableType, vulnerableAmount){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMappingExt.setDataVulnerability(charID, srcStruct, vulnerableType, vulnerableAmount)
            .then((result) => {
              socket.emit('returnVulnerabilityChange');
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestNotesFieldChange', function(charID, srcStruct, placeholderText, locationID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.getDataSingle(charID, 'notesField', srcStruct)
            .then((notesData) => {
              if(notesData == null) {
                CharSaving.saveNoteField(charID, srcStruct, placeholderText, null)
                .then((newNotesData) => {
                  socket.emit('returnNotesFieldChange', newNotesData, locationID);
                });
              } else {
                CharGathering.getNoteField(charID, notesData)
                .then((newNotesData) => {
                  socket.emit('returnNotesFieldChange', newNotesData, locationID);
                });
              }
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestNotesFieldDelete', function(charID, srcStruct){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.deleteData(charID, 'notesField', srcStruct)
            .then((result) => {
              socket.emit('returnNotesFieldDelete', srcStruct);
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });
      

    });

  }

  static builderWSC(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestWSCChoices', function(charID, wscCode, srcStruct, locationID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharChoices(charID).then((choiceStruct) => {
              socket.emit('returnWSCChoices', wscCode, srcStruct, locationID, choiceStruct);
            });
          }
        });
      });


      socket.on('requestWSCMapsInit', function(charID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllFeats(charID).then((featsObject) => {
              CharGathering.getAllLanguages(charID).then((langsObject) => {
                CharGathering.getAllSpells(charID).then((spellMap) => {
                  CharGathering.getAllArchetypes(charID).then((archetypesArray) => {
                    socket.emit('returnWSCUpdateFeats', featsObject);
                    socket.emit('returnWSCUpdateLangs', langsObject);
                    socket.emit('returnWSCUpdateSpells', mapToObj(spellMap));
                    socket.emit('returnWSCUpdateArchetypes', archetypesArray);
                    socket.emit('returnWSCMapsInit');
                  });
                });
              });
            });
          }
        });
      });
    
      socket.on('requestWSCUpdateChoices', function(charID, updateType){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(updateType == 'ABILITY-BOOSTS'){
              CharGathering.getChoicesAbilityBonus(charID).then((bonusDataArray) => {
                socket.emit('returnWSCUpdateChoices', 'ABILITY-BOOSTS', bonusDataArray);
              });
            } else if(updateType == 'FEATS'){
              CharGathering.getChoicesFeats(charID).then((featDataArray) => {
                socket.emit('returnWSCUpdateChoices', 'FEATS', featDataArray);
              });
            } else if(updateType == 'DOMAINS'){
              CharGathering.getChoicesDomains(charID).then((domainDataArray) => {
                socket.emit('returnWSCUpdateChoices', 'DOMAINS', domainDataArray);
              });
            } else {
              socket.emit('returnWSCUpdateChoices', null, null);
            }
          }
        });
      });

      socket.on('requestWSCAbilityBonusChange', function(charID, srcStruct, abilityBonusStruct, selectBoostControlShellClass){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(abilityBonusStruct == null){
              CharDataMapping.deleteData(charID, 'abilityBonus', srcStruct)
              .then((result) => {
                socket.emit('returnWSCAbilityBonusChange', selectBoostControlShellClass);
              });
            } else {
              CharDataMappingExt.setDataAbilityBonus(charID, srcStruct, abilityBonusStruct.Ability, abilityBonusStruct.Bonus)
              .then((result) => {
                socket.emit('returnWSCAbilityBonusChange', selectBoostControlShellClass);
              });
            }
          }
        });
      });

      socket.on('requestWSCInnateSpellChange', function(charID, srcStruct, innateSpellStruct, selectControlShellClass){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(innateSpellStruct == null){
              CharDataMapping.deleteData(charID, 'innateSpell', srcStruct)
              .then((result) => {
                socket.emit('returnWSCInnateSpellChange', selectControlShellClass);
              });
            } else {
              CharGathering.getSpellByName(innateSpellStruct.name)
              .then((spell) => {
                if(spell != null){
                  CharDataMappingExt.setDataInnateSpell(charID, srcStruct, spell.id, innateSpellStruct.level, innateSpellStruct.tradition, innateSpellStruct.tPd)
                  .then((result) => {
                    socket.emit('returnWSCInnateSpellChange', selectControlShellClass);
                  });
                }
              });
            }
          }
        });
      });

      socket.on('requestWSCCharTagChange', function(charID, srcStruct, charTag, selectControlShellClass){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharTags.setTag(charID, srcStruct, charTag)
            .then((result) => {
              return CharTags.getTags(charID)
              .then((charTagsArray) => {
                socket.emit('returnWSCCharTagChange', charTagsArray, selectControlShellClass);
              });
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestWSCSrcStructDataClear', function(charID, srcStruct){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.deleteDataBySourceStruct(charID, srcStruct)
            .then((result) => {
              CharGathering.getCharChoices(charID)
              .then((choiceStruct) => {
                socket.emit('returnWSCSrcStructDataClear', choiceStruct);
              });
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
            AdminCreation.addAncestry(data).then((result) => {
              socket.emit('returnAdminCompleteAncestry');
            });
          }
        });
      });

      socket.on('requestAdminUpdateAncestry', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.ancestryID != null) {
              AdminCreation.archiveAncestry(data.ancestryID, true).then((result) => {
                AdminCreation.addAncestry(data).then((result) => {
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
            AdminCreation.deleteAncestry(ancestryID).then((result) => {
              socket.emit('returnAdminRemoveAncestry');
            });
          }
        });
      });

      socket.on('requestAdminAncestryDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllAncestries(true).then((ancestriesObject) => {
              GeneralGathering.getAllFeats().then((featsObject) => {
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
            AdminCreation.addFeat(data).then((result) => {
              socket.emit('returnAdminCompleteFeat');
            });
          }
        });
      });

      socket.on('requestAdminUpdateFeat', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.featID != null) {
              AdminCreation.archiveFeat(data.featID, true).then((result) => {
                AdminCreation.addFeat(data).then((result) => {
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
            AdminCreation.deleteFeat(featID).then((result) => {
              socket.emit('returnAdminRemoveFeat');
            });
          }
        });
      });

      socket.on('requestAdminFeatDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllFeats().then((featsObject) => {
              socket.emit('returnAdminFeatDetails', featsObject);
            });
          }
        });
      });

      socket.on('requestAdminFeatDetailsPlus', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllFeats().then((featsObject) => {
              GeneralGathering.getAllClasses().then((classObject) => {
                GeneralGathering.getAllAncestries(true).then((ancestriesObject) => {
                  GeneralGathering.getAllUniHeritages().then((uniHeritageArray) => {
                    socket.emit('returnAdminFeatDetailsPlus', featsObject, classObject, ancestriesObject, uniHeritageArray);
                  });
                });
              });
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddItem', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addItem(data).then((result) => {
              socket.emit('returnAdminCompleteItem');
            });
          }
        });
      });

      socket.on('requestAdminUpdateItem', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.itemID != null) {
              AdminCreation.archiveItem(data.itemID, true).then((result) => {
                AdminCreation.addItem(data).then((result) => {
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
            AdminCreation.deleteItem(itemID).then((result) => {
              socket.emit('returnAdminRemoveItem');
            });
          }
        });
      });

      socket.on('requestAdminItemDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllItems().then((itemMap) => {
              socket.emit('returnAdminItemDetails', mapToObj(itemMap));
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddSpell', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addSpell(data).then((result) => {
              socket.emit('returnAdminCompleteSpell');
            });
          }
        });
      });

      socket.on('requestAdminUpdateSpell', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.spellID != null) {
              AdminCreation.archiveSpell(data.spellID, true).then((result) => {
                AdminCreation.addSpell(data).then((result) => {
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
            AdminCreation.deleteSpell(spellID).then((result) => {
              socket.emit('returnAdminRemoveSpell');
            });
          }
        });
      });

      socket.on('requestAdminSpellDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllSpells().then((spellMap) => {
              socket.emit('returnAdminSpellDetails', mapToObj(spellMap));
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddClass', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addClass(data).then((result) => {
              socket.emit('returnAdminCompleteClass');
            });
          }
        });
      });

      socket.on('requestAdminUpdateClass', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.classID != null) {
              AdminCreation.archiveClass(data.classID, true).then((result) => {
                AdminCreation.addClass(data).then((result) => {
                  socket.emit('returnAdminCompleteClass');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestAdminRemoveClass', function(classID){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteClass(classID).then((result) => {
              socket.emit('returnAdminRemoveClass');
            });
          }
        });
      });

      socket.on('requestAdminClassDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllClasses().then((classObject) => {
              GeneralGathering.getAllFeats().then((featsObject) => {
                socket.emit('returnAdminClassDetails', classObject, featsObject);
              });
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddBackground', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addBackground(data).then((result) => {
              socket.emit('returnAdminCompleteBackground');
            });
          }
        });
      });

      socket.on('requestAdminUpdateBackground', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.backgroundID != null) {
              AdminCreation.archiveBackground(data.backgroundID, true).then((result) => {
                AdminCreation.addBackground(data).then((result) => {
                  socket.emit('returnAdminCompleteBackground');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestAdminRemoveBackground', function(backgroundID){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteBackground(backgroundID).then((result) => {
              socket.emit('returnAdminRemoveBackground');
            });
          }
        });
      });

      socket.on('requestAdminBackgroundDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllBackgrounds().then((backgrounds) => {
              socket.emit('returnAdminBackgroundDetails', backgrounds);
            });
          }
        });
      });
      

      ////

      socket.on('requestAdminAddArchetype', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addArchetype(data).then((result) => {
              socket.emit('returnAdminCompleteArchetype');
            });
          }
        });
      });

      socket.on('requestAdminUpdateArchetype', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.archetypeID != null) {
              AdminCreation.archiveArchetype(data.archetypeID, true).then((result) => {
                AdminCreation.addArchetype(data).then((result) => {
                  socket.emit('returnAdminCompleteArchetype');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestAdminRemoveArchetype', function(archetypeID){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteArchetype(archetypeID).then((result) => {
              socket.emit('returnAdminRemoveArchetype');
            });
          }
        });
      });

      socket.on('requestAdminArchetypeDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllArchetypes().then((archetypeArray) => {
              GeneralGathering.getAllFeats().then((featsObject) => {
                socket.emit('returnAdminArchetypeDetails', archetypeArray, featsObject);
              });
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddUniHeritage', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addUniHeritage(data).then((result) => {
              socket.emit('returnAdminCompleteUniHeritage');
            });
          }
        });
      });

      socket.on('requestAdminUpdateUniHeritage', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.uniHeritageID != null) {
              AdminCreation.archiveUniHeritage(data.uniHeritageID, true).then((result) => {
                AdminCreation.addUniHeritage(data).then((result) => {
                  socket.emit('returnAdminCompleteUniHeritage');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestAdminRemoveUniHeritage', function(uniHeritageID){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteUniHeritage(uniHeritageID).then((result) => {
              socket.emit('returnAdminRemoveUniHeritage');
            });
          }
        });
      });

      socket.on('requestAdminUniHeritageDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllUniHeritages().then((uniHeritageArray) => {
              GeneralGathering.getAllFeats().then((featsObject) => {
                socket.emit('returnAdminUniHeritageDetails', uniHeritageArray, featsObject);
              });
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddHeritage', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addHeritage(null, data).then((result) => {
              socket.emit('returnAdminCompleteHeritage');
            });
          }
        });
      });

      socket.on('requestAdminUpdateHeritage', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.heritageID != null) {
              AdminCreation.archiveHeritage(data.heritageID, true).then((result) => {
                AdminCreation.addHeritage(null, data).then((result) => {
                  socket.emit('returnAdminCompleteHeritage');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestAdminRemoveHeritage', function(heritageID){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteHeritage(heritageID).then((result) => {
              socket.emit('returnAdminRemoveHeritage');
            });
          }
        });
      });

      socket.on('requestAdminHeritageDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllHeritages().then((heritageArray) => {
              GeneralGathering.getAllAncestriesBasic().then((ancestryArray) => {
                socket.emit('returnAdminHeritageDetails', heritageArray, ancestryArray);
              });
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddClassFeature', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addClassFeature(data).then((result) => {
              socket.emit('returnAdminCompleteClassFeature');
            });
          }
        });
      });

      socket.on('requestAdminUpdateClassFeature', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.classFeatureID != null) {
              AdminCreation.archiveClassFeature(data.classFeatureID, true).then((result) => {
                AdminCreation.addClassFeature(data).then((result) => {
                  socket.emit('returnAdminCompleteClassFeature');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestAdminRemoveClassFeature', function(classFeatureID){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteClassFeature(classFeatureID).then((result) => {
              socket.emit('returnAdminRemoveClassFeature');
            });
          }
        });
      });

    });
  }

  static appAPI(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestAllAPIClients', function(){
        ClientAPI.getAllClients(socket).then((apiClients) => {
          socket.emit('returnAllAPIClients', apiClients);
        });
      });

      socket.on('requestAPIClientAdd', function(clientData){
        ClientAPI.addClient(socket, clientData).then((apiClient) => {
          ClientAPI.getAllClients(socket).then((allAPIClients) => {
            socket.emit('returnAPIClientAdd', apiClient, allAPIClients);
          });
        });
      });

      socket.on('requestAPIClientDelete', function(clientData){
        ClientAPI.deleteClient(socket, clientData).then((result) => {
          ClientAPI.getAllClients(socket).then((allAPIClients) => {
            socket.emit('returnAPIClientDelete', allAPIClients);
          });
        });
      });

      socket.on('requestAPIClientUpdate', function(clientData){
        ClientAPI.updateClient(socket, clientData).then((result) => {
          ClientAPI.getAllClients(socket).then((allAPIClients) => {
            socket.emit('returnAPIClientUpdate', allAPIClients);
          });
        });
      });

      socket.on('requestAPIClientRefreshKey', function(clientData){
        ClientAPI.refreshAPIKey(socket, clientData).then((result) => {
          ClientAPI.getAllClients(socket).then((allAPIClients) => {
            socket.emit('returnAPIClientRefreshKey', allAPIClients);
          });
        });
      });

      // Request Access //
      socket.on('requestAPIRequestAccess', function(clientID, charID, accessRights){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            ClientAPI.getRequestAccessData(clientID, charID, accessRights).then((accessData) => {
              socket.emit('returnAPIRequestAccess', accessData);
            });
          }
        });
      });

    });
    
  }

  static browse(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestBrowseAncestries', function(){
        GeneralGathering.getAllAncestries(true).then((ancestriesObject) => {
          socket.emit('returnBrowseAncestries', ancestriesObject);
        });
      });

      socket.on('requestBrowse', function(){
        GeneralGathering.getAllFeats().then((featsObject) => {
          GeneralGathering.getAllSkills().then((skillObject) => {
            GeneralGathering.getAllItems().then((itemMap) => {
              GeneralGathering.getAllSpells().then((spellMap) => {
                GeneralGathering.getAllLanguages().then((allLanguages) => {
                  GeneralGathering.getAllConditions().then((allConditions) => {
                    GeneralGathering.getAllTags().then((allTags) => {
                      GeneralGathering.getAllClassesBasic().then((classes) => {
                        GeneralGathering.getAllAncestriesBasic().then((ancestries) => {
                          GeneralGathering.getAllArchetypes().then((archetypes) => {
                            GeneralGathering.getAllBackgrounds().then((backgrounds) => {
                              GeneralGathering.getAllUniHeritages().then((uniHeritages) => {
                                socket.emit('returnBrowse', featsObject, skillObject, mapToObj(itemMap), mapToObj(spellMap), allLanguages, allConditions, allTags, classes, ancestries, archetypes, backgrounds, uniHeritages);
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });

      /// General Gathering ///

      socket.on('requestGeneralClass', function(classID){
        GeneralGathering.getClass(classID).then((classStruct) => {
          socket.emit('returnGeneralClass', classStruct);
        });
      });

      socket.on('requestGeneralAncestry', function(ancestryID){
        GeneralGathering.getAncestry(ancestryID).then((ancestryStruct) => {
          socket.emit('returnGeneralAncestry', ancestryStruct);
        });
      });

      socket.on('requestGeneralArchetype', function(archetypeID){
        GeneralGathering.getArchetype(archetypeID).then((archetypeStruct) => {
          socket.emit('returnGeneralArchetype', archetypeStruct);
        });
      });

      socket.on('requestGeneralBackground', function(backgroundID){
        GeneralGathering.getBackground(backgroundID).then((backgroundStruct) => {
          socket.emit('returnGeneralBackground', backgroundStruct);
        });
      });

      socket.on('requestGeneralUniHeritage', function(uniHeritageID){
        GeneralGathering.getUniHeritage(uniHeritageID).then((uniHeritageStruct) => {
          socket.emit('returnGeneralUniHeritage', uniHeritageStruct);
        });
      });

    });
    
  }


  static homebrewGeneral(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){

      socket.on('requestHomebrewBundles', function(){
        AuthCheck.getHomebrewBundles(socket).then((homebrewBundles) => {
          socket.emit('returnHomebrewBundles', homebrewBundles);
        });
      });
      
      socket.on('requestBundleContents', function(homebrewID){
        HomebrewGathering.getAllClasses(homebrewID).then((classes) => {
          // Include the rest
          socket.emit('returnBundleContents', classes);
        });
      });

    });

  }


  static homebrewBuilder(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){



      ///

      socket.on('requestHomebrewAddClass', function(homebrewID, data){
        AuthCheck.canEditHomebrew(socket, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.addClass(homebrewID, data).then((result) => {
              socket.emit('returnHomebrewAddClass');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUpdateClass', function(homebrewID, data){
        AuthCheck.canEditHomebrew(socket, homebrewID).then((canEdit) => {
          if(canEdit){
            if(data != null && data.classID != null) {
              HomebrewCreation.deleteClass(homebrewID, data.classID).then((result) => {
                HomebrewCreation.addClass(homebrewID, data).then((result) => {
                  socket.emit('returnHomebrewUpdateClass');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestHomebrewRemoveClass', function(homebrewID, classID){
        AuthCheck.canEditHomebrew(socket, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.deleteClass(homebrewID, classID).then((result) => {
              socket.emit('returnHomebrewRemoveClass');
            });
          }
        });
      });
  
      socket.on('requestHomebrewClassDetails', function(homebrewID){
        AuthCheck.canEditHomebrew(socket, homebrewID).then((canEdit) => {
          if(canEdit){
            GeneralGathering.getAllClasses().then((classObject) => {
              GeneralGathering.getAllFeats().then((featsObject) => {
                socket.emit('returnHomebrewClassDetails', classObject, featsObject);
              });
            });
          }
        });
      });

    });

  }

};