
const CharGathering = require('./CharGathering');
const CharSaving = require('./CharSaving');
const CharContentSources = require('./CharContentSources');
const CharContentHomebrew = require('./CharContentHomebrew');
const CharSpells = require('./CharSpells');
const CharTags = require('./CharTags');
const CharDataMapping = require('./CharDataMapping');
const CharDataMappingExt = require('./CharDataMappingExt');
const CharExport = require('./CharExport');
const CharImport = require('./CharImport');
const AuthCheck = require('./AuthCheck');
const GeneralGathering = require('./GeneralGathering');
const HomebrewGathering = require('./HomebrewGathering');
const AdminCreation = require('./AdminCreation');
const HomebrewCreation = require('./HomebrewCreation');
const ClientAPI = require('./ClientAPI');
const CharStateUtils = require('./CharStateUtils');
const GeneralUtils = require('./GeneralUtils');
const UserHomebrew = require('./UserHomebrew');
const BuildsGathering = require('./BuildsGathering');
const BuildsSaving = require('./BuildsSaving');

const CharSheetLoad = require('./loading/Load_CharSheet');
const CharChoicesLoad = require('./loading/Load_CharChoices');
const BuilderCoreLoad = require('./loading/Load_BuilderCore');
const SearchLoad = require('./loading/Load_Search');
const PlannerCoreLoad = require('./loading/Load_PlannerCore');
const NewBuilderCoreLoad = require('./loading/Load_NewBuilderCore');

const { Prisma, MemCache } = require('./PrismaConnection');

const HomeBackReport = require('../models/backgroundDB/HomeBackReport');
const User = require('../models/contentDB/User');
const { truncate } = require('lodash');

function mapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v;
  }
  return obj;
}

// Returns UserID or -1 if not logged in.
function getUserID(socket){
  if(socket.request.session.passport != null && socket.request.session.passport.user != null){
      return socket.request.session.passport.user;
  } else {
      return -1;
  }
}

module.exports = class SocketConnections {

  static basicConnection(io) {

    io.on('connection', function(socket){
      //const userID = getUserID(socket);

      /*
      socket.onAny((event, ...args) => {
        if(!AuthCheck.isLoggedIn(userID)){
          socket.emit('userNotLoggedIn', {});
        }
      });
      */

    });

  }

  static sheetGeneral(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){
      const userID = getUserID(socket);

      socket.on('requestCharacterSheetInfo', function(charID){
        AuthCheck.getPermissions(userID).then((perms) => {
          AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
            if(ownsChar){
              CharSheetLoad(socket, charID).then((charInfo) => {
                socket.emit('returnCharacterSheetInfo', charInfo, perms, false);
              });
            } else {
              CharGathering.getCharacter(userID, charID).then((character) => {
                if(CharStateUtils.isPublic(character)){
                  CharSheetLoad(socket, charID, character).then((charInfo) => {
                    socket.emit('returnCharacterSheetInfo', charInfo, perms, true);
                  });
                } else {
                  socket.emit('returnErrorMessage', 'Incorrect Auth - No access to this character.');
                }
              });
            }
          });
        });
      });

      socket.on('requestProfsAndSkills', function(charID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getProfs(userID, charID).then((profMap) => {
              CharGathering.getAllSkills(userID, charID).then((skillObject) => {
                socket.emit('returnProfsAndSkills', mapToObj(profMap), skillObject);
              });
            });
          }
        });
      });

      socket.on('requestUpdateCalculatedStats', function(charID, calcStatsStruct){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.updateCalculatedStats(charID, calcStatsStruct).then((result) => {
              socket.emit('returnUpdateCalculatedStats');
            });
          }
        });
      });

      socket.on('requestNotesSave', function(charID, notes){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveNotes(charID, notes).then((result) => {
              socket.emit('returnNotesSave');
            });
          }
        });
      });

      socket.on('requestCharInfoSave', function(charID, infoJSON){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveInfoJSON(charID, infoJSON).then((result) => {
              socket.emit('returnCharInfoSave');
            });
          }
        });
      });

      socket.on('requestDetailsSave', function(charID, details){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveDetails(charID, details).then((result) => {
              socket.emit('returnDetailsSave');
            });
          }
        });
      });

      socket.on('requestNotesFieldSave', function(charID, notesData, notesFieldControlShellID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveNoteField(charID, notesData, notesData.placeholderText, notesData.text)
            .then((result) => {
              socket.emit('returnNotesFieldSave', notesFieldControlShellID);
            });
          }
        });
      });
    
      socket.on('requestExperienceSave', function(charID, newExp){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveExp(charID, newExp).then((result) => {
              // Return nothing
            });
          }
        });
      });
    
      socket.on('requestCurrentHitPointsSave', function(charID, currentHealth){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveCurrentHitPoints(charID, currentHealth).then((result) => {
              // Return nothing
            });
          }
        });
      });
      socket.on('requestTempHitPointsSave', function(charID, tempHealth){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveTempHitPoints(charID, tempHealth).then((result) => {
              // Return nothing
            });
          }
        });
      });

      socket.on('requestCurrentStaminaPointsSave', function(charID, currentStamina){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveCurrentStaminaPoints(charID, currentStamina).then((result) => {
              // Return nothing
            });
          }
        });
      });
      socket.on('requestCurrentResolvePointsSave', function(charID, currentResolve){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveCurrentResolvePoints(charID, currentResolve).then((result) => {
              // Return nothing
            });
          }
        });
      });
    
      socket.on('requestHeroPointsSave', function(charID, heroPoints){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveHeroPoints(charID, heroPoints).then((result) => {
              socket.emit('returnHeroPointsSave');
            });
          }
        });
      });

      socket.on('requestRollHistorySave', function(charID, rollHistoryJSON){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveRollHistory(charID, rollHistoryJSON).then((result) => {
              socket.emit('returnRollHistorySave');
            });
          }
        });
      });

    });
    
  }

  static sheetItems(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){
      const userID = getUserID(socket);

      socket.on('requestInvUpdate', function(charID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharacter(userID, charID).then((character) => {
              CharGathering.getInventory(userID, character.inventoryID).then((invStruct) => {
                socket.emit('returnInvUpdate', invStruct);
              });
            });
          }
        });
      });

      socket.on('requestAddPropertyRune', function(invItemID, propRuneID, propRuneSlot){
        AuthCheck.ownsInvItem(userID, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(userID, invItemID).then((invID) => {
              CharSaving.addPropRune(invItemID, propRuneID, propRuneSlot).then(() => {
                CharGathering.getInventory(userID, invID).then((invStruct) => {
                  socket.emit('returnInvItemUpdated', invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestRemovePropertyRune', function(invItemID, propRuneSlot){
        AuthCheck.ownsInvItem(userID, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(userID, invItemID).then((invID) => {
              CharSaving.removePropRune(invItemID, propRuneSlot).then(() => {
                CharGathering.getInventory(userID, invID).then((invStruct) => {
                  socket.emit('returnInvItemUpdated', invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestAddFundamentalRune', function(invItemID, fundRuneID){
        AuthCheck.ownsInvItem(userID, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(userID, invItemID).then((invID) => {
              CharSaving.addFundRune(invItemID, fundRuneID).then(() => {
                CharGathering.getInventory(userID, invID).then((invStruct) => {
                  socket.emit('returnAddFundamentalRune', invItemID, invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestRemoveFundamentalRune', function(invItemID, fundRuneID){
        AuthCheck.ownsInvItem(userID, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(userID, invItemID).then((invID) => {
              CharSaving.removeFundRune(invItemID, fundRuneID).then(() => {
                CharGathering.getInventory(userID, invID).then((invStruct) => {
                  socket.emit('returnInvItemUpdated', invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestUpdateInventory', function(invID, equippedArmorInvItemID, equippedShieldInvItemID, equippedArmorCategory){
        AuthCheck.ownsInv(userID, invID).then((ownsInv) => {
          if(ownsInv){
            CharSaving.updateInventory(invID, equippedArmorInvItemID, equippedShieldInvItemID, equippedArmorCategory).then(() => {
              // Return nothing
            });
          }
        });
      });
    
      socket.on('requestAddItemToInv', function(charID, invID, itemID, quantity){
        AuthCheck.ownsInv(userID, invID).then((ownsInv) => {
          if(ownsInv){
            CharSaving.addItemToInv(invID, itemID, quantity).then((invItem) => {
              CharGathering.getInventory(userID, invID).then((invStruct) => {
                CharGathering.getItem(userID, charID, itemID).then((item) => {
                  socket.emit('returnAddItemToInv', item, invItem, invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestRemoveItemFromInv', function(invItemID){
        AuthCheck.ownsInvItem(userID, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(userID, invItemID).then((invID) => {
              CharSaving.removeInvItemFromInv(invItemID).then(() => {
                CharGathering.getInventory(userID, invID).then((invStruct) => {
                  socket.emit('returnRemoveItemFromInv', invItemID, invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestInvItemMoveBag', function(invItemID, bagInvItemID, isDropped){
        AuthCheck.ownsInvItem(userID, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(userID, invItemID).then((invID) => {
              CharSaving.saveInvItemToNewBag(invItemID, bagInvItemID, isDropped).then(() => {
                CharGathering.getInventory(userID, invID).then((invStruct) => {
                  socket.emit('returnInvItemMoveBag', invItemID, invStruct);
                });
              });
            });
          }
        });
      });

      socket.on('requestAddItemToBag', function(itemID, quantity, bagInvItemID){
        AuthCheck.ownsInvItem(userID, bagInvItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(userID, bagInvItemID).then((invID) => {
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
        AuthCheck.ownsInvItem(userID, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(userID, invItemID).then((invID) => {
              CharSaving.saveInvItemQty(invItemID, newQty).then(() => {
                CharGathering.getInventory(userID, invID).then((invStruct) => {
                  socket.emit('returnInvItemUpdated', invStruct);
                });
              });
            });
          }
        });
      });
    
      socket.on('requestInvItemHPChange', function(invItemID, newHP){
        AuthCheck.ownsInvItem(userID, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(userID, invItemID).then((invID) => {
              CharSaving.saveInvItemHitPoints(invItemID, newHP).then(() => {
                CharGathering.getInventory(userID, invID).then((invStruct) => {
                  socket.emit('returnInvItemUpdated', invStruct);
                });
              });
            });
          }
        });
      });

      socket.on('requestInvItemInvestChange', function(invItemID, isInvested){
        AuthCheck.ownsInvItem(userID, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(userID, invItemID).then((invID) => {
              CharSaving.saveInvItemInvest(invItemID, isInvested).then(() => {
                CharGathering.getInventory(userID, invID).then((invStruct) => {
                  socket.emit('returnInvItemUpdated', invStruct);
                });
              });
            });
          }
        });
      });

      socket.on('requestCustomizeInvItem', function(invItemID, updateValues){
        AuthCheck.ownsInvItem(userID, invItemID).then((ownsItem) => {
          if(ownsItem){
            CharGathering.getInvIDFromInvItemID(userID, invItemID).then((invID) => {
              CharSaving.saveInvItemCustomize(invItemID, updateValues).then(() => {
                CharGathering.getInventory(userID, invID).then((invStruct) => {
                  socket.emit('returnInvItemUpdated', invStruct);
                });
              });
            });
          }
        });
      });


      socket.on('requestAddItemCustomizeToInv', function(charID, invID, itemID, updateValues){
        AuthCheck.ownsInv(userID, invID).then((ownsInv) => {
          if(ownsInv){
            CharSaving.addItemToInv(invID, itemID, updateValues.quantity).then((invItem) => {
              CharSaving.saveInvItemCustomize(invItem.id, updateValues).then(() => {
                CharGathering.getInventory(userID, invID).then((invStruct) => {
                  CharGathering.getItem(userID, charID, itemID).then((item) => {
                    socket.emit('returnAddItemToInv', item, invItem, invStruct);
                  });
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
      const userID = getUserID(socket);

      socket.on('requestConditionChange', function(charID, conditionID, value, sourceText, parentID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.replaceCondition(charID, conditionID, value, sourceText, parentID).then((result) => {
              CharGathering.getAllCharConditions(userID, charID)
              .then((conditionsObject) => {
                socket.emit('returnUpdateConditionsMap', conditionsObject, true);
              });
            });
          }
        });
      });

      socket.on('requestConditionRemove', function(charID, conditionID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.removeCondition(charID, conditionID).then((didRemove) => {
              CharGathering.getAllCharConditions(userID, charID)
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
      const userID = getUserID(socket);

      socket.on('requestSpellAddToSpellBook', function(charID, spellSRC, spellID, spellLevel, spellType){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.addToSpellBook(charID, spellSRC, spellID, spellLevel, spellType, true).then((result) => {
              CharSpells.getSpellBook(charID, spellSRC, false).then((spellBookStruct) => {
                socket.emit('returnSpellBookUpdated', spellBookStruct);
              });
            });
          }
        });
      });

      socket.on('requestSpellRemoveFromSpellBook', function(charID, spellSRC, spellID, spellLevel){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.getSpellBook(charID, spellSRC, false).then((spellBookStruct) => {
              socket.emit('returnSpellBookUpdated', spellBookStruct);
            });
          }
        });
      });

      socket.on('requestSpellTypeUpdate', function(charID, spellBookSpellID, spellType){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.changeSpellBookSpellType(charID, spellBookSpellID, spellType).then((result) => {
              socket.emit('returnSpellTypeUpdate');
            });
          }
        });
      });

      socket.on('requestSpellSlotUpdate', function(charID, updateSlotObject){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.changeSpellSlot(charID, updateSlotObject).then((result) => {
              socket.emit('returnSpellSlotUpdate');
            });
          }
        });
      });

      socket.on('requestInnateSpellCastingUpdate', function(innateSpell, timesCast){
        if(innateSpell != null) {
          AuthCheck.ownsCharacter(userID, innateSpell.charID).then((ownsChar) => {
            if(ownsChar){
              CharSaving.saveInnateSpellCastings(innateSpell, timesCast).then((result) => {
                socket.emit('returnInnateSpellCastingUpdate');
              });
            }
          });
        }
      });

      
      socket.on('requestFocusSpellUpdate', function(charID, srcStruct, spellSRC, spellID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setData(charID, 'focusSpell', srcStruct, spellSRC+"="+spellID)
            .then((result) => {
              socket.emit('returnFocusSpellUpdate');
            });
          }
        });
      });
      socket.on('requestFocusPointUpdate', function(charID, srcStruct, unused){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
      const userID = getUserID(socket);

      socket.on('requestAddAnimalCompanion', function(charID, animalCompID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.addAnimalCompanion(charID, animalCompID).then((charAnimalComp) => {
              socket.emit('returnAddAnimalCompanion', charAnimalComp);
            });
          }
        });
      });

      socket.on('requestUpdateAnimalCompanion', function(charID, charAnimalCompID, updateValues){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.updateAnimalCompanion(charID, charAnimalCompID, updateValues).then(() => {
              socket.emit('returnUpdateAnimalCompanion');
            });
          }
        });
      });

      socket.on('requestRemoveAnimalCompanion', function(charID, charAnimalCompID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.deleteAnimalCompanion(charID, charAnimalCompID).then(() => {
              socket.emit('returnRemoveAnimalCompanion', charAnimalCompID);
            });
          }
        });
      });



      socket.on('requestAddFamiliar', function(charID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.addFamiliar(charID).then((charFamiliar) => {
              socket.emit('returnAddFamiliar', charFamiliar);
            });
          }
        });
      });

      socket.on('requestAddSpecificFamiliar', function(charID, specificStruct){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.addSpecificFamiliar(charID, specificStruct).then((charFamiliar) => {
              socket.emit('returnAddFamiliar', charFamiliar);
            });
          }
        });
      });

      socket.on('requestUpdateFamiliar', function(charID, charFamiliarID, updateValues){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.updateFamiliar(charID, charFamiliarID, updateValues).then(() => {
              socket.emit('returnUpdateFamiliar');
            });
          }
        });
      });

      socket.on('requestRemoveFamiliar', function(charID, charFamiliarID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
      const userID = getUserID(socket);

      socket.on('requestCharacterDetails', function(charID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharacter(userID, charID).then((character) => {
              BuildsGathering.getBuildInfo(character.buildID).then((buildInfo) => {
                ClientAPI.getClientsWhoAccess(charID).then((clientsWithAccess) => {
                  UserHomebrew.getCollectedHomebrewBundles(userID).then((hBundles) => {
                    UserHomebrew.getIncompleteHomebrewBundles(userID).then((progessBundles) => {
                      socket.emit('returnCharacterDetails', character, buildInfo, clientsWithAccess, hBundles, progessBundles);
                    });
                  });
                });
              });
            });
          }
        });
      });

      socket.on('requestCharacterRemoveClientAccess', function(charID, clientID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveLevel(charID, charLevel).then((result) => {
              socket.emit('returnLevelChange');
            });
          }
        });
      });

      socket.on('requestBuilderTypeChange', function(charID, builderType){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveBuilderType(charID, builderType).then((result) => {
              socket.emit('returnBuilderTypeChange');
            });
          }
        });
      });
    
      socket.on('requestAbilityScoreChange', function(charID, abilSTR, abilDEX, abilCON, abilINT, abilWIS, abilCHA){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveAbilityScores(charID, abilSTR, abilDEX, abilCON, abilINT, abilWIS, abilCHA)
            .then((result) => {
              socket.emit('returnAbilityScoreChange');
            });
          }
        });
      });

      socket.on('requestCharacterOptionChange', function(charID, optionName, value){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveCharacterOption(charID, optionName, value).then((result) => {

              if(optionName == 'variantAncestryParagon') {
                // Hardcoded - Clear ancestry feats for Ancestry Paragon variant
                CharDataMapping.deleteDataBySourceAndType(charID, 'chosenFeats', 'ancestry')
                .then((result) => {
                  socket.emit('returnCharacterOptionChange');
                });
              } else if(optionName == 'variantGradualAbilityBoosts') {
                // Hardcoded - Clear class ability boosts for Gradual Ability Boosts variant
                CharDataMapping.deleteDataBySourceAndType(charID, 'abilityBonus', 'class')
                .then((result) => {
                  // Also clear unselectedData for class
                  CharDataMapping.deleteDataBySourceAndType(charID, 'unselectedData', 'class')
                  .then((result) => {
                    socket.emit('returnCharacterOptionChange');
                  });
                });
              } else {
                socket.emit('returnCharacterOptionChange');
              }
            });
          }
        });
      });

      socket.on('requestCharacterSourceChange', function(charID, sourceName, isAdd){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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

      socket.on('requestCharacterSetSources', function(charID, contentSourceArray){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharContentSources.setSources(charID, contentSourceArray).then((result) => {
              socket.emit('returnCharacterSetSources');
            });
          }
        });
      });

      socket.on('requestCharacterHomebrewChange', function(charID, homebrewID, isAdd){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(isAdd) {
              CharContentHomebrew.addHomebrewBundle(userID, charID, homebrewID).then((result) => {
                socket.emit('returnCharacterHomebrewChange');
              });
            } else {
              CharContentHomebrew.removeHomebrewBundle(charID, homebrewID).then((result) => {
                socket.emit('returnCharacterHomebrewChange');
              });
            }
          }
        });
      });

      socket.on('requestCharacterCustomCodeBlockChange', function(charID, code){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveCustomCode(charID, code).then((result) => {
              socket.emit('returnCharacterCustomCodeBlockChange');
            });
          }
        });
      });

    });
    
  }

  static builderAncestry(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){
      const userID = getUserID(socket);

      socket.on('requestBuilderPageAncestry', function(charID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharacter(userID, charID).then((character) => {
              CharGathering.getAllAncestries(userID, character.enabledSources, character.enabledHomebrew, false).then((ancestriesObject) => {
                CharGathering.getAllUniHeritages(userID, charID).then((uniHeritageArray) => {
                  socket.emit('returnBuilderPageAncestry', ancestriesObject, uniHeritageArray);
                });
              });
            });
          } else {
            socket.emit('returnErrorMessage', 'Incorrect Auth - No access to this character.');
          }
        });
      });

      socket.on('requestAncestryChange', function(charID, ancestryID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveAncestry(charID, ancestryID).then((result) => {
              socket.emit('returnAncestryChange');
            });
          }
        });
      });

      socket.on('requestHeritageChange', function(charID, heritageID, isUniversal){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
      const userID = getUserID(socket);

      socket.on('requestBuilderPageBackground', function(charID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharacter(userID, charID).then((character) => {
              CharGathering.getAllBackgrounds(userID, character.enabledSources, character.enabledHomebrew).then((backgrounds) => {
                socket.emit('returnBuilderPageBackground', backgrounds);
              });
            });
          } else {
            socket.emit('returnErrorMessage', 'Incorrect Auth - No access to this character.');
          }
        });
      });

      socket.on('requestBackgroundChange', function(charID, backgroundID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveBackground(charID, backgroundID).then((result) => {
              socket.emit('returnBackgroundChange');
            });
          }
        });
      });

    });
    
  }

  static builderClass(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){
      const userID = getUserID(socket);

      socket.on('requestBuilderPageClass', function(charID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharacter(userID, charID).then((character) => {
              CharGathering.getAllClasses(userID, character.enabledSources, character.enabledHomebrew).then((classObject) => {
                socket.emit('returnBuilderPageClass', classObject);
              });
            });
          } else {
            socket.emit('returnErrorMessage', 'Incorrect Auth - No access to this character.');
          }
        });
      });

      socket.on('requestBuilderPageClass2', function(charID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharacter(userID, charID).then((character) => {
              CharGathering.getAllClasses(userID, character.enabledSources, character.enabledHomebrew).then((classObject) => {
                socket.emit('returnBuilderPageClass2', classObject);
              });
            });
          } else {
            socket.emit('returnErrorMessage', 'Incorrect Auth - No access to this character.');
          }
        });
      });

      socket.on('requestClassChange', function(charID, classID, classNum){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveClass(charID, classID, classNum).then((result) => {
              socket.emit('returnClassChange', classNum);
            });
          }
        });
      });

    });
    
  }

  
  static builderFinalize(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){
      const userID = getUserID(socket);

      socket.on('requestBuilderPageFinalize', function(charID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharacter(userID, charID).then((character) => {
              CharGathering.getAllUnselectedData(userID, charID).then((unselectedDataArray) => {
                socket.emit('returnBuilderPageFinalize', character, unselectedDataArray);
              });
            });
          } else {
            socket.emit('returnErrorMessage', 'Incorrect Auth - No access to this character.');
          }
        });
      });

      socket.on('requestLangsAndTrainingsClear', function(charID, profSrcStruct, langSrcStruct, data){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.deleteData(charID, 'languages', langSrcStruct)
            .then((result) => {
              CharDataMapping.deleteData(charID, 'proficiencies', profSrcStruct)
              .then((result) => {
                socket.emit('returnLangsAndTrainingsClear', profSrcStruct, langSrcStruct, data);
              });
            });
          }
        });
      });

      socket.on('requestCustomCodeBlockDataClear', function(charID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.deleteDataBySourceType(charID, 'custom-code')
            .then((result) => {
              socket.emit('returnCustomCodeBlockDataClear');
            });
          }
        });
      });

    });
    
  }

  static builderGeneral(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){
      const userID = getUserID(socket);

      socket.on('requestCharBuilderDetails', function(charID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharacter(userID, charID).then((character) => {
              BuilderCoreLoad(socket, charID, character).then((bStruct) => {
                socket.emit('returnCharBuilderDetails', character, bStruct.builderCore, bStruct.choiceStruct);
              });
            });
          } else {
            socket.emit('returnErrorMessage', 'Incorrect Auth - No access to this character.');
          }
        });
      });

      socket.on('requestUnselectedDataChange', function(charID, srcStruct, unselectedData, deleteOnly=true){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(unselectedData == null){
              if(deleteOnly){
                CharDataMapping.deleteDataOnly(charID, 'unselectedData', srcStruct)
                .then((result) => {
                  socket.emit('returnUnselectedDataChange', unselectedData);
                });
              } else {
                CharDataMapping.deleteData(charID, 'unselectedData', srcStruct)
                .then((result) => {
                  socket.emit('returnUnselectedDataChange', unselectedData);
                });
              }
            } else {
              CharDataMapping.setDataOnly(charID, 'unselectedData', srcStruct, unselectedData)
              .then((result) => {
                socket.emit('returnUnselectedDataChange', unselectedData);
              });
            }
          }
        });
      });

      socket.on('requestUnselectedDataClear', function(charID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.deleteDataBySourceType(charID, 'unselectedData')
            .then((result) => {
              socket.emit('returnUnselectedDataClear');
            });
          }
        });
      });

      socket.on('requestAbilityBonusChange', function(charID, srcStruct, abilityBonusStruct){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
    
      socket.on('requestClassChoiceChange', function(charID, srcStruct, classChoiceStruct, deleteSelfData=true){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(classChoiceStruct == null){
              CharDataMapping.deleteData(charID, 'classChoice', srcStruct)
              .then((result) => {
                socket.emit('returnClassChoiceChange', srcStruct, null, null);
              });
            } else {
              CharDataMappingExt.setDataClassChoice(charID, srcStruct, classChoiceStruct.SelectorID, classChoiceStruct.OptionID, deleteSelfData)
              .then((result) => {
                socket.emit('returnClassChoiceChange', srcStruct, classChoiceStruct.SelectorID, classChoiceStruct.OptionID);
              });
            }
          }
        });
      });
    
      socket.on('requestProficiencyChange', function(charID, profChangePacket, profStruct){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            let srcStruct = profChangePacket.srcStruct;
            profChangePacket.profStruct = profStruct;
            if(profStruct == null){
              CharDataMapping.deleteData(charID, 'proficiencies', srcStruct)
              .then((result) => {
                socket.emit('returnProficiencyChange', profChangePacket);
              });
            } else {
              CharDataMappingExt.setDataProficiencies(charID, srcStruct, profStruct.For, profStruct.To, profStruct.Prof, profStruct.SourceName)
              .then((result) => {
                socket.emit('returnProficiencyChange', profChangePacket);
              });
            }
          }
        });
      });
    
      socket.on('requestFeatChange', function(charID, featChangePacket){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            let srcStruct = featChangePacket.srcStruct;
            if(featChangePacket.featID == null){
              CharDataMapping.deleteData(charID, 'chosenFeats', srcStruct)
              .then((result) => {
                socket.emit('returnFeatChange', featChangePacket);
              });
            } else {
              let deleteSelfData = featChangePacket.deleteSelfData;
              if(deleteSelfData == null) { deleteSelfData = true; }

              CharDataMapping.setData(charID, 'chosenFeats', srcStruct, featChangePacket.featID, deleteSelfData)
              .then((result) => {
                socket.emit('returnFeatChange', featChangePacket);
              });
            }
          }
        });
      });
    
      socket.on('requestLanguageChange', function(charID, srcStruct, langID, deleteSelfData=true){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(langID == null){
              CharDataMapping.deleteData(charID, 'languages', srcStruct)
              .then((result) => {
                socket.emit('returnLanguageChange');
              });
            } else {
              CharDataMapping.setData(charID, 'languages', srcStruct, langID, deleteSelfData)
              .then((result) => {
                socket.emit('returnLanguageChange');
              });
            }
          }
        });
      });

      socket.on('requestSensesChange', function(charID, srcStruct, senseID, deleteSelfData=true){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(senseID == null){
              CharDataMapping.deleteData(charID, 'senses', srcStruct)
              .then((result) => {
                socket.emit('returnSensesChange');
              });
            } else {
              CharDataMapping.setData(charID, 'senses', srcStruct, senseID, deleteSelfData)
              .then((result) => {
                socket.emit('returnSensesChange');
              });
            }
          }
        });
      });

      socket.on('requestPhysicalFeaturesChange', function(charID, srcStruct, physicalFeatureID, deleteSelfData=true){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(physicalFeatureID == null){
              CharDataMapping.deleteData(charID, 'phyFeats', srcStruct)
              .then((result) => {
                socket.emit('returnPhysicalFeaturesChange');
              });
            } else {
              CharDataMapping.setData(charID, 'phyFeats', srcStruct, physicalFeatureID, deleteSelfData)
              .then((result) => {
                socket.emit('returnPhysicalFeaturesChange');
              });
            }
          }
        });
      });

      socket.on('requestDomainChange', function(charID, srcStruct, domain){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
                    domain.SpellSRC+"="+domain.Domain.initialSpellID, false)
                .then((result) => {
                  socket.emit('returnDomainChange');
                });
              });
            }
          }
        });
      });

      socket.on('requestDomainAdvancementChange', function(charID, srcStruct, domain){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
                    domain.SpellSRC+"="+domain.Domain.advancedSpellID, false)
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
      const userID = getUserID(socket);

      socket.on('requestLoreChange', function(charID, srcStruct, loreName, inputPacket, prof, sourceName){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            let profChangePacket = {
              srcStruct: srcStruct,
              profStruct: null,
            };
            if(loreName == null){
              CharDataMapping.deleteData(charID, 'loreCategories', srcStruct)
              .then((result) => {
                CharDataMapping.deleteData(charID, 'proficiencies', srcStruct)
                .then((result) => {
                  socket.emit('returnProficiencyChange', profChangePacket);
                  socket.emit('returnLoreChange', srcStruct, loreName, inputPacket, prof);
                });
              });
            } else {
              profChangePacket.profStruct = { For: 'Skill', To: loreName+'_LORE', Prof: prof, SourceName: sourceName };
              CharDataMapping.setData(charID, 'loreCategories', srcStruct, loreName)
              .then((result) => {
                CharDataMappingExt.setDataProficiencies(charID, srcStruct, 
                  profChangePacket.profStruct.For,
                  profChangePacket.profStruct.To,
                  profChangePacket.profStruct.Prof,
                  profChangePacket.profStruct.SourceName,
                  false)
                .then((result) => {
                  socket.emit('returnProficiencyChange', profChangePacket);
                  socket.emit('returnLoreChange', srcStruct, loreName, inputPacket, prof);
                });
              });
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestAddClassFeature', function(charID, srcStruct, featureName, inputPacket){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(featureName == null){

              CharDataMapping.deleteData(charID, 'classAbilityExtra', srcStruct)
              .then((result) => {
                socket.emit('returnAddClassFeature', srcStruct, null, inputPacket);
              });

            } else {
              CharGathering.getClassFeatureByName(userID, charID, featureName)
              .then((classFeature) => {
                if(classFeature != null){

                  CharDataMapping.setData(charID, 'classAbilityExtra', srcStruct, classFeature.id)
                  .then((result) => {
                    if(classFeature.selectType == 'SELECTOR'){
                      CharGathering.getCharacter(userID, charID).then((character) => {
                        CharGathering.getAllClassFeatureOptions(userID, character.enabledSources, character.enabledHomebrew)
                        .then((allOptions) => {
                          socket.emit('returnAddClassFeature', srcStruct, classFeature, allOptions, inputPacket);
                        });
                      });
                    } else {
                      socket.emit('returnAddClassFeature', srcStruct, classFeature, null, inputPacket);
                    }
                  });

                } else {
                  socket.emit('returnWSCStatementFailure', 'Unknown Class Feature \"'+featureName+'\"');
                }
              });
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestClassArchetypeChange', function(charID, srcStruct, classArchetypeID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(classArchetypeID == null){
              CharDataMapping.deleteData(charID, 'classArchetypeChoice', srcStruct)
              .then((result) => {
                socket.emit('returnClassArchetypeChange');
              });
            } else {
              CharDataMapping.setData(charID, 'classArchetypeChoice', srcStruct, classArchetypeID)
              .then((result) => {
                socket.emit('returnClassArchetypeChange');
              });
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestSCFSChange', function(charID, srcStruct, classFeatureID, inputPacket){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(classFeatureID == null){
              CharDataMapping.deleteData(charID, 'scfs', srcStruct)
              .then((result) => {
                socket.emit('returnSCFSChange', inputPacket);
              });
            } else {
              CharDataMapping.setData(charID, 'scfs', srcStruct, classFeatureID)
              .then((result) => {
                socket.emit('returnSCFSChange', inputPacket);
              });
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestFindClassFeatureForSCFS', function(charID, featureName, inputPacket){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){

            CharGathering.getClassFeatureByName(userID, charID, featureName)
            .then((classFeature) => {
              if(classFeature != null){

                if(classFeature.selectType == 'SELECTOR'){
                  CharGathering.getCharacter(userID, charID).then((character) => {
                    CharGathering.getAllClassFeatureOptions(userID, character.enabledSources, character.enabledHomebrew)
                    .then((allOptions) => {
                      socket.emit('returnFindClassFeatureForSCFS', classFeature, allOptions, inputPacket);
                    });
                  });
                } else {
                  socket.emit('returnWSCStatementFailure', 'Class Feature must have selection options for a SCFS!');
                }

              } else {
                socket.emit('returnWSCStatementFailure', 'Unknown Class Feature \"'+featureName+'\"');
              }
            });

          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestAddHeritageEffect', function(charID, srcStruct, heritageName, inputPacket){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getHeritageByName(userID, charID, heritageName)
            .then((heritage) => {
              if(heritage != null){
                socket.emit('returnAddHeritageEffect', srcStruct, heritage, inputPacket);
              } else {
                socket.emit('returnWSCStatementFailure', 'Unknown Heritage \"'+heritageName+'\"');
              }
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestHeritageEffectsChange', function(charID, srcStruct, heritageID, deleteSelfData=true){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(heritageID == null){
              CharDataMapping.deleteData(charID, 'heritageExtra', srcStruct)
              .then((result) => {
                socket.emit('returnHeritageEffectsChange');
              });
            } else {
              CharDataMapping.setData(charID, 'heritageExtra', srcStruct, heritageID, deleteSelfData)
              .then((result) => {
                socket.emit('returnHeritageEffectsChange');
              });
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestFindHeritagesFromAncestryName', function(charID, srcStruct, ancestryName, inputPacket){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getHeritagesByAncestryName(userID, charID, ancestryName)
            .then((heritages) => {
              if(heritages != null){
                socket.emit('returnFindHeritagesFromAncestryName', srcStruct, heritages, inputPacket);
              } else {
                socket.emit('returnWSCStatementFailure', 'Unknown Ancestry \"'+ancestryName+'\"');
              }
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestWeaponFamiliarityChange', function(charID, srcStruct, trait){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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

      socket.on('requestArmorSpecializationChange', function(charID, srcStruct, armorName){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setData(charID, 'armorSpecialization', srcStruct, armorName)
            .then((result) => {
              socket.emit('returnArmorSpecializationChange');
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestWeaponCriticalSpecializationChange', function(charID, srcStruct, weapName){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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

      socket.on('requestFeatChangeByID', function(charID, featChangePacket){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(featChangePacket.feat != null && featChangePacket.feat.Feat != null){
              let srcStruct = featChangePacket.srcStruct;
              CharDataMapping.setDataOnly(charID, 'chosenFeats', srcStruct, featChangePacket.feat.Feat.id)
              .then((result) => {
                socket.emit('returnFeatChangeByID', featChangePacket);
              });
            } else {
              socket.emit('returnWSCStatementFailure', 'Cannot find feat passed to FeatChangeByID');
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestLanguageChangeByID', function(charID, srcStruct, langID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setDataOnly(charID, 'languages', srcStruct, langID)
            .then((result) => {
              socket.emit('returnLanguageChangeByID');
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestSensesChangeByID', function(charID, srcStruct, senseID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setDataOnly(charID, 'senses', srcStruct, senseID)
            .then((result) => {
              socket.emit('returnSensesChangeByID');
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestPhysicalFeaturesChangeByID', function(charID, srcStruct, phyFeatID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setDataOnly(charID, 'phyFeats', srcStruct, phyFeatID)
            .then((result) => {
              socket.emit('returnPhysicalFeaturesChangeByID');
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      // Give Spell Slots //
      socket.on('requestSpellCastingSlotChange', function(charID, srcStruct, spellSRC, spellcasting, reduceSlotsByOne=false){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.setSpellCasting(charID, srcStruct, spellSRC, spellcasting, reduceSlotsByOne)
            .then((spellSlots) => {
              if(spellSlots != null){
                socket.emit('returnSpellCastingSlotChange', spellSRC, spellSlots);
              } else {
                socket.emit('returnWSCStatementFailure', 'Invalid Spellcasting \"'+spellcasting+'\"');
              }
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestSpellSlotChange', function(charID, srcStruct, spellSRC, spellLevel, slotType=''){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(spellLevel != null){
              CharSpells.setSpellSlot(charID, srcStruct, spellSRC, spellLevel, slotType)
              .then((spellSlot) => {
                if(spellSlot != null){
                  socket.emit('returnSpellSlotChange', spellSRC, spellSlot);
                } else {
                  socket.emit('returnWSCStatementFailure', 'Invalid Spell Slot \"'+spellLevel+'\"');
                }
              });
            } else {
              CharDataMapping.deleteData(charID, 'spellSlots', srcStruct)
              .then((result) => {
                socket.emit('returnSpellSlotChange', spellSRC, null);
              });
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      // Set Key Ability for Spell SRC //
      socket.on('requestKeySpellAbilityChange', function(charID, srcStruct, spellSRC, abilityScore){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
      socket.on('requestBuilderSpellAddToSpellBook', function(charID, srcStruct, spellSRC, spellName, spellLevel, spellType=null){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            let sLevel = parseInt(spellLevel);
            if(!isNaN(sLevel)) {
              CharGathering.getSpellByName(userID, charID, spellName)
              .then((spell) => {
                if(spell != null){
                  if(spell.level <= sLevel) {
                    CharSpells.addToSpellBookFromBuilder(charID, spellSRC, spell.id, sLevel, srcStruct, spellType)
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
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(spellTradition == 'OCCULT' || spellTradition == 'ARCANE' || spellTradition == 'DIVINE' || spellTradition == 'PRIMAL') {
              let tPd = parseInt(timesPerDay);
              let sLevel = parseInt(spellLevel);
              if(!isNaN(tPd) && !isNaN(sLevel)) {
                CharGathering.getSpellByName(userID, charID, spellName)
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
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getSpellByName(userID, charID, spellName)
            .then((spell) => {
              if(spell != null){
                /* Ignore if spell is a focus spell or not. This is to support Psychic cantrips.
                if(spell.isFocusSpell === 1){} else {
                  socket.emit('returnWSCStatementFailure', '\"'+spellName+'\" is not a focus spell!');
                }*/
                CharDataMapping.setData(charID, 'focusSpell', srcStruct, spellSRC+"="+spell.id)
                .then((result) => {
                  socket.emit('returnFocusSpellChange');
                });
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
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(resistType == null || resistAmount == null){
              CharDataMapping.deleteData(charID, 'resistance', srcStruct)
              .then((result) => {
                let data = srcStruct;
                data.Added = false;
                socket.emit('returnResistanceChange', data);
              });
            } else {
              CharDataMappingExt.setDataResistance(charID, srcStruct, resistType, resistAmount)
              .then((result) => {
                let data = srcStruct;
                data.Type = resistType;
                data.Amount = resistAmount;
                data.Added = true;
                socket.emit('returnResistanceChange', data);
              });
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestVulnerabilityChange', function(charID, srcStruct, vulnerType, vulnerAmount){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(vulnerType == null || vulnerAmount == null){
              CharDataMapping.deleteData(charID, 'vulnerability', srcStruct)
              .then((result) => {
                let data = srcStruct;
                data.Added = false;
                socket.emit('returnVulnerabilityChange', data);
              });
            } else {
              CharDataMappingExt.setDataVulnerability(charID, srcStruct, vulnerType, vulnerAmount)
              .then((result) => {
                let data = srcStruct;
                data.Type = vulnerType;
                data.Amount = vulnerAmount;
                data.Added = true;
                socket.emit('returnVulnerabilityChange', data);
              });
            }
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestNotesFieldChange', function(charID, srcStruct, placeholderText, noteChangePacket){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.getDataSingle(charID, 'notesField', srcStruct)
            .then((notesData) => {
              if(notesData == null) {
                CharSaving.saveNoteField(charID, srcStruct, placeholderText, null)
                .then((newNotesData) => {
                  socket.emit('returnNotesFieldChange', newNotesData, noteChangePacket);
                });
              } else {
                CharGathering.getNoteField(userID, charID, notesData)
                .then((newNotesData) => {
                  socket.emit('returnNotesFieldChange', newNotesData, noteChangePacket);
                });
              }
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestNotesFieldDelete', function(charID, srcStruct){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
      const userID = getUserID(socket);

      socket.on('requestDataClearAtSrcStruct', function(charID, srcStruct){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.deleteDataBySourceStruct(charID, srcStruct)
            .then((result) => {
              socket.emit('returnDataClearAtSrcStruct', srcStruct);
            });
          }
        });
      });

      socket.on('requestMetaDataSetOnly', function(charID, source, srcStruct, value){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setDataOnly(charID, source, srcStruct, value)
            .then((result) => {
              socket.emit('returnMetaDataSetOnly');
            });
          }
        });
      });

      socket.on('requestWSCChoices', function(charID, wscCode, srcStruct, locationID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharChoicesLoad(socket, charID).then((choiceStruct) => {
              socket.emit('returnWSCChoices', wscCode, srcStruct, locationID, choiceStruct);
            });
          }
        });
      });


      socket.on('requestWSCMapsInit', function(charID){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharacter(userID, charID).then((character) => {
              CharGathering.getAllFeats(userID, character.enabledSources, character.enabledHomebrew).then((featsObject) => {
                CharGathering.getAllLanguages(userID, charID).then((langsObject) => {
                  CharGathering.getAllSpells(userID, character.enabledSources, character.enabledHomebrew).then((spellMap) => {
                    CharGathering.getAllArchetypes(userID, charID).then((archetypesArray) => {
                      socket.emit('returnWSCUpdateFeats', featsObject);
                      socket.emit('returnWSCUpdateLangs', langsObject);
                      socket.emit('returnWSCUpdateSpells', mapToObj(spellMap));
                      socket.emit('returnWSCUpdateArchetypes', archetypesArray);
                      socket.emit('returnWSCMapsInit');
                    });
                  });
                });
              });
            });
          }
        });
      });
    
      socket.on('requestWSCUpdateChoices', function(charID, updateType){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(updateType == 'ABILITY-BOOSTS'){
              CharGathering.getChoicesAbilityBonus(userID, charID).then((bonusDataArray) => {
                socket.emit('returnWSCUpdateChoices', 'ABILITY-BOOSTS', bonusDataArray);
              });
            } else if(updateType == 'FEATS'){
              CharGathering.getChoicesFeats(userID, charID).then((featDataArray) => {
                socket.emit('returnWSCUpdateChoices', 'FEATS', featDataArray);
              });
            } else if(updateType == 'DOMAINS'){
              CharGathering.getChoicesDomains(userID, charID).then((domainDataArray) => {
                socket.emit('returnWSCUpdateChoices', 'DOMAINS', domainDataArray);
              });
            } else {
              socket.emit('returnWSCUpdateChoices', null, null);
            }
          }
        });
      });

      socket.on('requestWSCAbilityBonusChange', function(charID, srcStruct, abilityBonusStruct, selectBoostControlShellClass){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            if(innateSpellStruct == null){
              CharDataMapping.deleteData(charID, 'innateSpell', srcStruct)
              .then((result) => {
                socket.emit('returnWSCInnateSpellChange', selectControlShellClass);
              });
            } else {
              CharGathering.getSpellByName(userID, charID, innateSpellStruct.name)
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

      socket.on('requestWSCCharTagChange', function(charID, srcStruct, charTag, selectControlShellClass, triggerReload){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharTags.setTag(charID, srcStruct, charTag)
            .then((result) => {
              return CharTags.getTags(charID)
              .then((charTagsArray) => {
                socket.emit('returnWSCCharTagChange', charTagsArray, selectControlShellClass, triggerReload);
              });
            });
          } else {
            socket.emit('returnWSCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestWSCSrcStructDataClear', function(charID, srcStruct){
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.deleteDataSNumChildren(charID, srcStruct)
            .then((result) => {
              socket.emit('returnWSCSrcStructDataClear');
            });
          }
        });
      });
      
    });
    
  }

  static charDataManagement(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){
      const userID = getUserID(socket);

      socket.on('requestCharImport', function(charExportData){
        CharImport.importData(socket, charExportData)
        .then((result) => {
          socket.emit('returnCharImport');
        });
      });

      socket.on('requestCharExport', function(charID){
        AuthCheck.canViewCharacter(userID, charID).then((canViewChar) => {
          if(canViewChar){
            CharExport.getExportData(userID, charID)
            .then((charExportData) => {
              socket.emit('returnCharExport', charExportData);
            });
          }
        });
      });

      socket.on('requestCharCopy', function(charID){
        AuthCheck.canViewCharacter(userID, charID).then((canViewChar) => {
          if(canViewChar){
            CharExport.getExportData(userID, charID)
            .then((charExportData) => {
              CharImport.importData(socket, JSON.parse(JSON.stringify(charExportData)))
              .then((result) => {
                socket.emit('returnCharCopy');
              });
            });
          }
        });
      });

      socket.on('requestCharExportPDFInfo', function(charID){
        AuthCheck.canViewCharacter(userID, charID).then((canViewChar) => {
          if(canViewChar){
            CharExport.getExportData(userID, charID)
            .then((charExportData) => {
              CharGathering.getCharacter(userID, charID).then((character) => {
                CharGathering.getAllFeats(userID, character.enabledSources, character.enabledHomebrew).then((featsObject) => {
                  socket.emit('returnCharExportPDFInfo', charExportData, { featsObject });
                });
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
      const userID = getUserID(socket);

      socket.on('requestBackgroundReport', function(backgroundID, email, message){
        if(message.length > 5 && GeneralUtils.validateEmail(email)) {
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

      socket.on('requestProfileNameChange', function(newName){
        if(GeneralUtils.validateProfileName(newName)) {
          if(userID != null){
            let updateValues = { username: newName };
            User.update(updateValues, { where: { id: userID } })
            .then((result) => {
              socket.emit('returnProfileNameChange', newName);
            });
          }
        }
      });

      socket.on('requestDeveloperStatusChange', function(developer){
        if(userID != null){
          let updateValues = { isDeveloper: ((developer) ? 1 : 0) };
          User.update(updateValues, { where: { id: userID } })
          .then((result) => {
            socket.emit('returnDeveloperStatusChange', developer);
          });
        }
      });

      socket.on('requestThemeStatusChange', function(lightMode){
        if(userID != null){
          let updateValues = { enabledLightMode: ((lightMode) ? 1 : 0) };
          User.update(updateValues, { where: { id: userID } })
          .then((result) => {
            socket.emit('returnThemeStatusChange', lightMode);
          });
        }
      });

    });
    
  }

  static adminPanel(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){
      const userID = getUserID(socket);

      socket.on('requestAdminAddAncestry', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addAncestry(data).then((result) => {
              socket.emit('returnAdminCompleteAncestry');
            });
          }
        });
      });

      socket.on('requestAdminUpdateAncestry', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
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
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteAncestry(ancestryID).then((result) => {
              socket.emit('returnAdminRemoveAncestry');
            });
          }
        });
      });

      socket.on('requestAdminAncestryDetails', function(){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllAncestries(userID, true).then((ancestriesObject) => {
              GeneralGathering.getAllFeats(userID, null, null, null, false).then((featsObject) => {
                socket.emit('returnAdminAncestryDetails', ancestriesObject, featsObject);
              });
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddFeat', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addFeat(data).then((result) => {
              socket.emit('returnAdminCompleteFeat');
            });
          }
        });
      });

      socket.on('requestAdminUpdateFeat', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
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
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteFeat(featID).then((result) => {
              socket.emit('returnAdminRemoveFeat');
            });
          }
        });
      });

      socket.on('requestAdminFeatDetails', function(){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllFeats(userID, null, null, null, false).then((featsObject) => {
              socket.emit('returnAdminFeatDetails', featsObject);
            });
          }
        });
      });

      socket.on('requestAdminFeatDetailsPlus', function(){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllFeats(userID, null, null, null, false).then((featsObject) => {
              GeneralGathering.getAllClasses(userID).then((classObject) => {
                GeneralGathering.getAllAncestries(userID, true).then((ancestriesObject) => {
                  GeneralGathering.getAllUniHeritages(userID).then((uniHeritageArray) => {
                    GeneralGathering.getAllArchetypes(userID).then((archetypeArray) => {
                      socket.emit('returnAdminFeatDetailsPlus', featsObject, classObject, ancestriesObject, uniHeritageArray, archetypeArray);
                    });
                  });
                });
              });
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddItem', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addItem(data).then((result) => {
              socket.emit('returnAdminCompleteItem');
            });
          }
        });
      });

      socket.on('requestAdminUpdateItem', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
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
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteItem(itemID).then((result) => {
              socket.emit('returnAdminRemoveItem');
            });
          }
        });
      });

      socket.on('requestAdminItemDetails', function(){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllItems(userID, null, null, null, false).then((itemMap) => {
              socket.emit('returnAdminItemDetails', mapToObj(itemMap));
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddSpell', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addSpell(data).then((result) => {
              socket.emit('returnAdminCompleteSpell');
            });
          }
        });
      });

      socket.on('requestAdminUpdateSpell', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
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
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteSpell(spellID).then((result) => {
              socket.emit('returnAdminRemoveSpell');
            });
          }
        });
      });

      socket.on('requestAdminSpellDetails', function(){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllSpells(userID, null, null, null, null, false).then((spellMap) => {
              socket.emit('returnAdminSpellDetails', mapToObj(spellMap));
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddClass', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addClass(data).then((result) => {
              socket.emit('returnAdminCompleteClass');
            });
          }
        });
      });

      socket.on('requestAdminUpdateClass', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
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
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteClass(classID).then((result) => {
              socket.emit('returnAdminRemoveClass');
            });
          }
        });
      });

      socket.on('requestAdminClassDetails', function(){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllClasses(userID).then((classObject) => {
              GeneralGathering.getAllFeats(userID, null, null, null, false).then((featsObject) => {
                socket.emit('returnAdminClassDetails', classObject, featsObject);
              });
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddBackground', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addBackground(data).then((result) => {
              socket.emit('returnAdminCompleteBackground');
            });
          }
        });
      });

      socket.on('requestAdminUpdateBackground', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
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
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteBackground(backgroundID).then((result) => {
              socket.emit('returnAdminRemoveBackground');
            });
          }
        });
      });

      socket.on('requestAdminBackgroundDetails', function(){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllBackgrounds(userID).then((backgrounds) => {
              socket.emit('returnAdminBackgroundDetails', backgrounds);
            });
          }
        });
      });
      

      ////

      socket.on('requestAdminAddArchetype', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addArchetype(data).then((result) => {
              socket.emit('returnAdminCompleteArchetype');
            });
          }
        });
      });

      socket.on('requestAdminUpdateArchetype', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
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
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteArchetype(archetypeID).then((result) => {
              socket.emit('returnAdminRemoveArchetype');
            });
          }
        });
      });

      socket.on('requestAdminArchetypeDetails', function(){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllArchetypes(userID).then((archetypeArray) => {
              GeneralGathering.getAllFeats(userID, null, null, null, false).then((featsObject) => {
                socket.emit('returnAdminArchetypeDetails', archetypeArray, featsObject);
              });
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddUniHeritage', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addUniHeritage(data).then((result) => {
              socket.emit('returnAdminCompleteUniHeritage');
            });
          }
        });
      });

      socket.on('requestAdminUpdateUniHeritage', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
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
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteUniHeritage(uniHeritageID).then((result) => {
              socket.emit('returnAdminRemoveUniHeritage');
            });
          }
        });
      });

      socket.on('requestAdminUniHeritageDetails', function(){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllUniHeritages(userID).then((uniHeritageArray) => {
              GeneralGathering.getAllFeats(userID, null, null, null, false).then((featsObject) => {
                socket.emit('returnAdminUniHeritageDetails', uniHeritageArray, featsObject);
              });
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddHeritage', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addHeritage(null, data).then((result) => {
              socket.emit('returnAdminCompleteHeritage');
            });
          }
        });
      });

      socket.on('requestAdminUpdateHeritage', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
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
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteHeritage(heritageID).then((result) => {
              socket.emit('returnAdminRemoveHeritage');
            });
          }
        });
      });

      socket.on('requestAdminHeritageDetails', function(){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllHeritages(userID).then((heritageArray) => {
              GeneralGathering.getAllAncestriesBasic(userID).then((ancestryArray) => {
                socket.emit('returnAdminHeritageDetails', heritageArray, ancestryArray);
              });
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddClassFeature', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addClassFeature(data).then((result) => {
              socket.emit('returnAdminCompleteClassFeature');
            });
          }
        });
      });

      socket.on('requestAdminUpdateClassFeature', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
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
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteClassFeature(classFeatureID).then((result) => {
              socket.emit('returnAdminRemoveClassFeature');
            });
          }
        });
      });

      ////

      socket.on('requestAdminAddExtra', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.addExtra(data).then((result) => {
              socket.emit('returnAdminCompleteExtra');
            });
          }
        });
      });

      socket.on('requestAdminUpdateExtra', function(data){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.extraID != null) {
              AdminCreation.archiveExtra(data.extraID, true).then((result) => {
                AdminCreation.addExtra(data).then((result) => {
                  socket.emit('returnAdminCompleteExtra');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestAdminRemoveExtra', function(extraID){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            AdminCreation.deleteExtra(extraID).then((result) => {
              socket.emit('returnAdminRemoveExtra');
            });
          }
        });
      });

      socket.on('requestAdminExtraDetails', function(){
        AuthCheck.isAdmin(userID).then((isAdmin) => {
          if(isAdmin){
            GeneralGathering.getAllExtras(userID, null, null, null, false).then((extraObj) => {
              socket.emit('returnAdminExtraDetails', extraObj);
            });
          }
        });
      });

    });
  }

  static appAPI(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){
      const userID = getUserID(socket);

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
        AuthCheck.ownsCharacter(userID, charID).then((ownsChar) => {
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
      const userID = getUserID(socket);

      socket.on('requestBrowse', function(){
        AuthCheck.isDeveloper(userID).then((isDeveloper) => {
          SearchLoad(socket).then((searchStruct) => {
            socket.emit('returnBrowse', isDeveloper, searchStruct);
          });
        });
      });

      /// General Gathering ///

      socket.on('requestGeneralClass', function(classID, homebrewID=null){
        if(homebrewID == null){
          GeneralGathering.getClass(userID, classID).then((classStruct) => {
            socket.emit('returnGeneralClass', classStruct);
          });
        } else {
          UserHomebrew.canAccessHomebrewBundle(userID, homebrewID).then((canAccess) => {
            if(canAccess){
              GeneralGathering.getClass(userID, classID, homebrewID).then((classStruct) => {
                socket.emit('returnGeneralClass', classStruct);
              });
            }
          });
        }
      });

      socket.on('requestGeneralAncestry', function(ancestryID, homebrewID=null){
        if(homebrewID == null){
          GeneralGathering.getAncestry(userID, ancestryID).then((ancestryStruct) => {
            socket.emit('returnGeneralAncestry', ancestryStruct);
          });
        } else {
          UserHomebrew.canAccessHomebrewBundle(userID, homebrewID).then((canAccess) => {
            if(canAccess){
              GeneralGathering.getAncestry(userID, ancestryID, homebrewID).then((ancestryStruct) => {
                socket.emit('returnGeneralAncestry', ancestryStruct);
              });
            }
          });
        }
      });

      socket.on('requestGeneralArchetype', function(archetypeID, homebrewID=null){
        if(homebrewID == null){
          GeneralGathering.getArchetype(userID, archetypeID).then((archetypeStruct) => {
            socket.emit('returnGeneralArchetype', archetypeStruct);
          });
        } else {
          UserHomebrew.canAccessHomebrewBundle(userID, homebrewID).then((canAccess) => {
            if(canAccess){
              GeneralGathering.getArchetype(userID, archetypeID, homebrewID).then((archetypeStruct) => {
                socket.emit('returnGeneralArchetype', archetypeStruct);
              });
            }
          });
        }
      });

      socket.on('requestGeneralBackground', function(backgroundID, homebrewID=null){
        if(homebrewID == null){
          GeneralGathering.getBackground(userID, backgroundID).then((backgroundStruct) => {
            socket.emit('returnGeneralBackground', backgroundStruct);
          });
        } else {
          UserHomebrew.canAccessHomebrewBundle(userID, homebrewID).then((canAccess) => {
            if(canAccess){
              GeneralGathering.getBackground(userID, backgroundID, homebrewID).then((backgroundStruct) => {
                socket.emit('returnGeneralBackground', backgroundStruct);
              });
            }
          });
        }
      });

      socket.on('requestGeneralUniHeritage', function(uniHeritageID, homebrewID=null){
        if(homebrewID == null){
          GeneralGathering.getUniHeritage(userID, uniHeritageID).then((uniHeritageStruct) => {
            socket.emit('returnGeneralUniHeritage', uniHeritageStruct);
          });
        } else {
          UserHomebrew.canAccessHomebrewBundle(userID, homebrewID).then((canAccess) => {
            if(canAccess){
              GeneralGathering.getUniHeritage(userID, uniHeritageID, homebrewID).then((uniHeritageStruct) => {
                socket.emit('returnGeneralUniHeritage', uniHeritageStruct);
              });
            }
          });
        }
      });

    });
    
  }

  static gmTools(io){

    // Socket.IO Connections
    io.on('connection', function(socket){
      const userID = getUserID(socket);

      socket.on('requestShopGeneratorDetails', function(){
        
        // Get enabledHomebrew as all collected homebrew and enabledSources as all sources
        CharContentHomebrew.getEnabledHomebrewForCollection(userID).then((enabledHomebrew) => {
          CharContentSources.getEnabledSourcesForAllBooks(userID).then((enabledSources) => {

            AuthCheck.isSupporter(userID).then((isSupporter) => {

              // Non-supporters can't use homebrew in shop gen
              if(!isSupporter) {
                enabledHomebrew = '[null]';
              }

              CharGathering.getAllItems(userID, enabledSources, enabledHomebrew).then((itemMap) => {
                CharGathering.getAllTags(userID, enabledHomebrew).then((traits) => {
  
                  socket.emit('returnShopGeneratorDetails', mapToObj(itemMap), traits, isSupporter);
  
                });
              });

            });

          });
        });

      });

    });

  }

  static buildPlanner(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){
      const userID = getUserID(socket);

      socket.on('requestPlannerCore', function(charID, buildID){

        // If in Character Builder or Builder Creator mode
        if(charID != null){

          // Repopulate unselectedData
          CharDataMapping.deleteDataBySource(charID, 'unselectedData')
          .then((result) => {
            
            NewBuilderCoreLoad(socket, charID, buildID).then((plannerStruct) => {
              // Get Character to get the character's buildID (if it has one)
              CharGathering.getCharacter(userID, charID).then((character) => {
                BuildsGathering.getBuildInfo(character.buildID).then((buildInfo) => {
                  socket.emit('returnPlannerCore', plannerStruct, buildInfo);
                });
              });
            });

          });

        } else {

          NewBuilderCoreLoad(socket, charID, buildID).then((plannerStruct) => {
            socket.emit('returnPlannerCore', plannerStruct, null);
          });

        }
      });

      socket.on('requestCreateCharacterFromBuild', function(buildID){
        User.findOne({ where: { id: userID } })
        .then((user) => {
          if(user != null){
            BuildsGathering.getBuild(buildID).then((build) => {
              CharSaving.createNewCharacter(user, build)
              .then((character) => {
                if(character != null){
                  socket.emit('returnCharacterCreatedFromBuild', character);
                } else {
                  socket.emit('returnCharacterFailedToCreateFromBuild');
                }
              });
            });
          }
        });
      });

      socket.on('requestPublishedBuilds', function(){
        BuildsGathering.findPublishedBuilds().then((builds) => {
          socket.emit('returnPublishedBuilds', builds);
        });
      });

      socket.on('requestTopPublishedBuilds', function(topNum){
        BuildsGathering.findTopPublishedBuilds(topNum).then((builds) => {
          socket.emit('returnTopPublishedBuilds', builds);
        });
      });

      socket.on('requestUserBuilds', function(){
        BuildsGathering.findUserBuilds(userID).then((builds) => {
          socket.emit('returnUserBuilds', builds);
        });
      });

      socket.on('requestBuildContents', function(buildID){
        AuthCheck.canViewBuild(userID, buildID).then((viewBuild) => {
          if(viewBuild){
            BuildsGathering.getBuildContents(userID, buildID).then((buildContents) => {
              socket.emit('returnBuildContents', buildContents);
            });
          }
        });
      });

      socket.on('requestBuildCreate', function(){
        BuildsSaving.createNewBuild(userID).then((build) => {
          socket.emit('returnBuildCreate', build);
        });
      });

      socket.on('requestBuildInfo', function(buildID){
        BuildsGathering.getBasicBuildInfo(userID, buildID).then((build) => {
          UserHomebrew.getCollectedHomebrewBundles(userID).then((hBundles) => {
            UserHomebrew.getIncompleteHomebrewBundles(userID).then((progessBundles) => {
              socket.emit('returnBuildInfo', build, hBundles, progessBundles);
            });
          });
        });
      });

      socket.on('requestBuildNameChange', function(buildID, name){
        AuthCheck.canEditBuild(userID, buildID).then((editBuild) => {
          if(editBuild){
            let validNameRegex = /^[^@#$%^*~=\/\\]+$/;
            if(validNameRegex.test(name)) {
              BuildsSaving.saveName(buildID, name).then((result) => {
                socket.emit('returnBuildNameChange');
              });
            }
          }
        });
      });

      socket.on('requestBuildDescriptionChange', function(buildID, description){
        AuthCheck.canEditBuild(userID, buildID).then((editBuild) => {
          if(editBuild){
            BuildsSaving.saveDescription(buildID, description).then((result) => {
              socket.emit('returnBuildDescriptionChange');
            });
          }
        });
      });

      socket.on('requestBuildContactInfoChange', function(buildID, contactInfo){
        AuthCheck.canEditBuild(userID, buildID).then((editBuild) => {
          if(editBuild){
            BuildsSaving.saveContactInfo(buildID, contactInfo).then((result) => {
              socket.emit('returnBuildContactInfoChange');
            });
          }
        });
      });

      socket.on('requestBuildArtworkURLChange', function(buildID, artworkURL){
        AuthCheck.canEditBuild(userID, buildID).then((editBuild) => {
          if(editBuild){
            BuildsSaving.saveArtworkURL(buildID, artworkURL).then((result) => {
              socket.emit('returnBuildArtworkURLChange');
            });
          }
        });
      });
      
      socket.on('requestBuildOptionChange', function(buildID, optionName, value){
        AuthCheck.canEditBuild(userID, buildID).then((editBuild) => {
          if(editBuild){
            BuildsSaving.saveOption(buildID, optionName, value).then((result) => {

              if(optionName == 'variantAncestryParagon' || optionName == 'variantGradualAbilityBoosts') {
                // Clear all meta data for Ancestry Paragon or Gradual Ability Boosts variant
                BuildsSaving.clearMetaData(buildID)
                .then((result) => {
                  socket.emit('returnBuildOptionChange');
                });
              } else {
                socket.emit('returnBuildOptionChange');
              }

            });
          }
        });
      });

      socket.on('requestBuildSourceChange', function(buildID, sourceName, isAdd){
        AuthCheck.canEditBuild(userID, buildID).then((editBuild) => {
          if(editBuild){
            if(isAdd) {
              BuildsSaving.addSource(buildID, sourceName).then((result) => {
                socket.emit('returnBuildSourceChange');
              });
            } else {
              BuildsSaving.removeSource(buildID, sourceName).then((result) => {
                socket.emit('returnBuildSourceChange');
              });
            }
          }
        });
      });

      socket.on('requestBuildSetSources', function(buildID, contentSourceArray){
        AuthCheck.canEditBuild(userID, buildID).then((editBuild) => {
          if(editBuild){
            BuildsSaving.setSources(buildID, contentSourceArray).then((result) => {
              socket.emit('returnBuildSetSources');
            });
          }
        });
      });

      socket.on('requestBuildHomebrewChange', function(buildID, homebrewID, isAdd){
        AuthCheck.canEditBuild(userID, buildID).then((editBuild) => {
          if(editBuild){
            if(isAdd) {
              BuildsSaving.addHomebrewBundle(userID, buildID, homebrewID).then((result) => {
                socket.emit('returnBuildHomebrewChange');
              });
            } else {
              BuildsSaving.removeHomebrewBundle(buildID, homebrewID).then((result) => {
                socket.emit('returnBuildHomebrewChange');
              });
            }
          }
        });
      });

      socket.on('requestBuildCustomCodeBlockChange', function(buildID, code){
        AuthCheck.canEditBuild(userID, buildID).then((editBuild) => {
          if(editBuild){
            BuildsSaving.saveCustomCode(buildID, code).then((result) => {
              socket.emit('returnBuildCustomCodeBlockChange');
            });
          }
        });
      });


      socket.on('requestBuildUpdateInfo', function(buildID, buildInfo){
        AuthCheck.canEditBuild(userID, buildID).then((editBuild) => {
          if(editBuild){
            BuildsSaving.updateInfo(buildID, buildInfo).then((result) => {
              socket.emit('returnBuildUpdateInfo');
            });
          }
        });
      });

      socket.on('requestBuildUpdateMetaData', function(buildID, metaDataObject){
        AuthCheck.canEditBuild(userID, buildID).then((editBuild) => {
          if(editBuild){
            BuildsSaving.updateMetaData(buildID, metaDataObject).then((result) => {
              socket.emit('returnBuildUpdateMetaData');
            });
          }
        });
      });

      socket.on('requestBuildUpdateFinalStats', function(buildID, finalStatistics){
        AuthCheck.canEditBuild(userID, buildID).then((editBuild) => {
          if(editBuild){
            BuildsSaving.updateFinalStats(buildID, finalStatistics).then((result) => {
              socket.emit('returnBuildUpdateFinalStats');
            });
          }
        });
      });

      socket.on('requestBuildPublish', function(buildID){
        AuthCheck.canEditBuild(userID, buildID).then((editBuild) => {
          if(editBuild){
            BuildsSaving.publishBuild(buildID).then((result) => {
              socket.emit('returnBuildPublish', buildID);
            });
          }
        });
      });

      socket.on('requestBuildUpdate', function(buildID){
        AuthCheck.ownsBuild(userID, buildID).then((ownsBuild) => {
          if(ownsBuild){
            BuildsSaving.updateBuild(buildID).then((result) => {
              socket.emit('returnBuildUpdate', buildID);
            });
          }
        });
      });

      socket.on('requestBuildDelete', function(buildID){
        AuthCheck.ownsBuild(userID, buildID).then((ownsBuild) => {
          if(ownsBuild){
            BuildsSaving.deleteBuild(buildID).then((result) => {
              socket.emit('returnBuildDelete', buildID);
            });
          }
        });
      });

    });

  }


  static homebrewGeneral(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){
      const userID = getUserID(socket);

      socket.on('requestPublishedHomebrewBundles', function(){
        UserHomebrew.findPublishedBundles().then((hBundles) => {
          socket.emit('returnPublishedHomebrewBundles', hBundles);
        });
      });

      socket.on('requestTopPublishedHomebrewBundles', function(topNum){
        UserHomebrew.findTopPublishedBundles(topNum).then((hBundles) => {
          socket.emit('returnTopPublishedHomebrewBundles', hBundles);
        });
      });

      socket.on('requestCollectedHomebrewBundles', function(){
        UserHomebrew.getCollectedHomebrewBundles(userID).then((hBundles) => {
          socket.emit('returnCollectedHomebrewBundles', hBundles);
        });
      });

      socket.on('requestHomebrewBundles', function(){
        UserHomebrew.getHomebrewBundles(userID).then((homebrewBundles) => {
          AuthCheck.isMember(userID).then((canMakeHomebrew) => {
            socket.emit('returnHomebrewBundles', homebrewBundles, canMakeHomebrew);
          });
        });
      });

      socket.on('requestHomebrewBundle', function(REQUEST_TYPE, homebrewID){
        UserHomebrew.getHomebrewBundle(userID, homebrewID).then((homebrewBundle) => {
          socket.emit('returnHomebrewBundle', REQUEST_TYPE, homebrewBundle);
        });
      });

      socket.on('requestHomebrewBundlesFromArray', function(homebrewArrayIDs){
        UserHomebrew.getHomebrewBundlesFromArray(userID, homebrewArrayIDs).then((hBundles) => {
          socket.emit('returnHomebrewBundlesFromArray', hBundles);
        });
      });

      socket.on('requestBundleCreate', function(){
        UserHomebrew.createHomebrewBundle(userID).then((homebrewBundle) => {
          socket.emit('returnBundleCreate', homebrewBundle);
        });
      });

      socket.on('requestBundleUpdate', function(homebrewID, updateValues){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            UserHomebrew.updateHomebrewBundle(userID, homebrewID, updateValues).then((homebrewBundle) => {
              socket.emit('returnBundleUpdate', homebrewBundle);
            });
          }
        });
      });

      socket.on('requestBundleDelete', function(homebrewID){
        UserHomebrew.deleteHomebrewBundle(userID, homebrewID).then((result) => {
          socket.emit('returnBundleDelete');
        });
      });
      
      socket.on('requestBundleContents', function(REQUEST_TYPE, homebrewID, keyCode='None'){

        UserHomebrew.getHomebrewBundle(userID, homebrewID).then((homebrewBundle) => {
          UserHomebrew.hasHomebrewBundle(userID, homebrewID).then((userHasBundle) => {
            UserHomebrew.ownsHomebrewBundle(userID, homebrewID).then((userOwnsBundle) => {
              UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
                if(REQUEST_TYPE == 'EDIT' && !canEdit) { return; }
                UserHomebrew.getValidKey(homebrewID, keyCode).then((bundleKey) => {

                  if(REQUEST_TYPE == 'VIEW' && homebrewBundle.hasKeys === 1 && !userHasBundle && bundleKey == null) {

                    socket.emit('returnBundleContents', 'REQUIRE-KEY', userHasBundle, userOwnsBundle, null, [], [], [], [], [], [], [], [], [], [], [], [], []);

                  } else {

                    GeneralGathering.getAllSkills(null).then((skillObject) => {
                      HomebrewGathering.getAllClasses(homebrewID).then((classes) => {
                        HomebrewGathering.getAllAncestries(homebrewID).then((ancestries) => {
                          HomebrewGathering.getAllArchetypes(homebrewID).then((archetypes) => {
                            HomebrewGathering.getAllBackgrounds(homebrewID).then((backgrounds) => {
                              HomebrewGathering.getAllClassFeatures(homebrewID).then((classFeatures) => {
                                HomebrewGathering.getAllFeats(homebrewID).then((feats) => {
                                  HomebrewGathering.getAllHeritages(homebrewID).then((heritages) => {
                                    HomebrewGathering.getAllUniHeritages(homebrewID).then((uniheritages) => {
                                      HomebrewGathering.getAllItems(homebrewID).then((items) => {
                                        HomebrewGathering.getAllSpells(homebrewID).then((spells) => {
                                          GeneralGathering.getAllTags(null, homebrewID).then((allTags) => {
                                            HomebrewGathering.getAllLanguages(homebrewID).then((languages) => {
                                              HomebrewGathering.getAllToggleables(homebrewID).then((toggleables) => {
                                                
              
                                                if(userOwnsBundle && REQUEST_TYPE === 'EDIT') {
                                                  console.log('Clearing cache of homebrewID '+homebrewID);
                                                  // Delete all data cached with the homebrewID
                                                  for(const cacheKey of MemCache.keys()){
                                                    if(cacheKey.includes('{"homebrewID":'+homebrewID+'}')){
                                                      MemCache.del(cacheKey);
                                                    }
                                                  }
                                                }
              
                                                socket.emit('returnBundleContents', REQUEST_TYPE, userHasBundle, userOwnsBundle, skillObject, allTags, classes, ancestries, archetypes, backgrounds, classFeatures, feats, heritages, uniheritages, items, spells, languages,toggleables);
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
                    });

                  }

                });
              });
            });
          });
        });
      });

      socket.on('requestBundlePublish', function(homebrewID){
        UserHomebrew.publishHomebrew(userID, homebrewID).then((isPublished) => {
          socket.emit('returnBundlePublish', isPublished);
        });
      });

      socket.on('requestBundleChangeCollection', function(homebrewID, toAdd, keyCode='None'){
        if(toAdd){
          if(keyCode.length > 50) {return;}
          UserHomebrew.addToHomebrewCollection(userID, homebrewID, keyCode).then((isSuccess) => {
            socket.emit('returnBundleChangeCollection', toAdd, isSuccess);
          });
        } else {
          UserHomebrew.removeFromHomebrewCollection(userID, homebrewID).then((isSuccess) => {
            socket.emit('returnBundleChangeCollection', toAdd, isSuccess);
          });
        }
      });

      socket.on('requestBundleUpdatePublished', function(homebrewID){
        UserHomebrew.updateBundle(userID, homebrewID).then((result) => {
          socket.emit('returnBundleUpdatePublished');
        });
      });

      // Key Management //

      socket.on('requestBundleKeys', function(homebrewID){
        UserHomebrew.getBundleKeys(userID, homebrewID).then((bundleKeys) => {
          socket.emit('returnBundleKeys', bundleKeys);
        });
      });

      socket.on('requestBundleAddKeys', function(homebrewID, amount, isOneTimeUse){
        UserHomebrew.addBundleKeys(userID, homebrewID, amount, isOneTimeUse).then((result) => {
          socket.emit('returnBundleAddKeys');
        });
      });

      socket.on('requestBundleRemoveKey', function(homebrewID, keyCode){
        UserHomebrew.removeBundleKey(userID, homebrewID, keyCode).then((result) => {
          socket.emit('returnBundleRemoveKey');
        });
      });

    });

  }


  static homebrewBuilder(io) {

    // Socket.IO Connections
    io.on('connection', function(socket){
      const userID = getUserID(socket);

      socket.on('requestHomebrewAddClass', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.addClass(homebrewID, data).then((result) => {
              socket.emit('returnHomebrewCompleteClass');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUpdateClass', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            if(data != null && data.classID != null) {
              HomebrewCreation.deleteClass(homebrewID, data.classID).then((result) => {
                HomebrewCreation.addClass(homebrewID, data).then((result) => {
                  socket.emit('returnHomebrewCompleteClass');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestHomebrewRemoveClass', function(homebrewID, classID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.deleteClass(homebrewID, classID).then((result) => {
              socket.emit('returnHomebrewRemoveContent');
            });
          }
        });
      });
  
      socket.on('requestHomebrewClassDetails', function(homebrewID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            GeneralGathering.getAllClasses(userID, homebrewID).then((classObject) => {
              GeneralGathering.getAllFeats(userID, homebrewID).then((featsObject) => {
                socket.emit('returnHomebrewClassDetails', classObject, featsObject);
              });
            });
          }
        });
      });

      ////

      socket.on('requestHomebrewAddAncestry', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.addAncestry(homebrewID, data).then((result) => {
              socket.emit('returnHomebrewCompleteAncestry');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUpdateAncestry', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            if(data != null && data.ancestryID != null) {
              HomebrewCreation.deleteAncestry(homebrewID, data.ancestryID).then((result) => {
                HomebrewCreation.addAncestry(homebrewID, data).then((result) => {
                  socket.emit('returnHomebrewCompleteAncestry');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestHomebrewRemoveAncestry', function(homebrewID, ancestryID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.deleteAncestry(homebrewID, ancestryID).then((result) => {
              socket.emit('returnHomebrewRemoveContent');
            });
          }
        });
      });
  
      socket.on('requestHomebrewAncestryDetails', function(homebrewID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            GeneralGathering.getAllAncestries(userID, true, homebrewID).then((ancestryObject) => {
              GeneralGathering.getAllFeats(userID, homebrewID).then((featsObject) => {
                socket.emit('returnHomebrewAncestryDetails', ancestryObject, featsObject);
              });
            });
          }
        });
      });

      ////

      socket.on('requestHomebrewAddArchetype', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.addArchetype(homebrewID, data).then((result) => {
              socket.emit('returnHomebrewCompleteArchetype');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUpdateArchetype', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            if(data != null && data.archetypeID != null) {
              HomebrewCreation.deleteArchetype(homebrewID, data.archetypeID).then((result) => {
                HomebrewCreation.addArchetype(homebrewID, data).then((result) => {
                  socket.emit('returnHomebrewCompleteArchetype');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestHomebrewRemoveArchetype', function(homebrewID, archetypeID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.deleteArchetype(homebrewID, archetypeID).then((result) => {
              socket.emit('returnHomebrewRemoveContent');
            });
          }
        });
      });
  
      socket.on('requestHomebrewArchetypeDetails', function(homebrewID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            GeneralGathering.getAllArchetypes(userID, homebrewID).then((archetypeArray) => {
              GeneralGathering.getAllFeats(userID, homebrewID).then((featsObject) => {
                socket.emit('returnHomebrewArchetypeDetails', archetypeArray, featsObject);
              });
            });
          }
        });
      });

      ///

      socket.on('requestHomebrewAddBackground', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.addBackground(homebrewID, data).then((result) => {
              socket.emit('returnHomebrewCompleteBackground');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUpdateBackground', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            if(data != null && data.backgroundID != null) {
              HomebrewCreation.deleteBackground(homebrewID, data.backgroundID).then((result) => {
                HomebrewCreation.addBackground(homebrewID, data).then((result) => {
                  socket.emit('returnHomebrewCompleteBackground');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestHomebrewRemoveBackground', function(homebrewID, backgroundID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.deleteBackground(homebrewID, backgroundID).then((result) => {
              socket.emit('returnHomebrewRemoveContent');
            });
          }
        });
      });
  
      socket.on('requestHomebrewBackgroundDetails', function(homebrewID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            GeneralGathering.getAllBackgrounds(userID, homebrewID).then((backgrounds) => {
              socket.emit('returnHomebrewBackgroundDetails', backgrounds);
            });
          }
        });
      });

      ////

      socket.on('requestHomebrewAddClassFeature', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.addClassFeature(homebrewID, data).then((result) => {
              socket.emit('returnHomebrewCompleteClassFeature');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUpdateClassFeature', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            if(data != null && data.classFeatureID != null) {
              HomebrewCreation.deleteClassFeature(homebrewID, data.classFeatureID).then((result) => {
                HomebrewCreation.addClassFeature(homebrewID, data).then((result) => {
                  socket.emit('returnHomebrewCompleteClassFeature');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestHomebrewRemoveClassFeature', function(homebrewID, classFeatureID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.deleteClassFeature(homebrewID, classFeatureID).then((result) => {
              socket.emit('returnHomebrewRemoveContent');
            });
          }
        });
      });

      ////

      socket.on('requestHomebrewAddFeat', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.addFeat(homebrewID, data).then((result) => {
              socket.emit('returnHomebrewCompleteFeat');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUpdateFeat', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            if(data != null && data.featID != null) {
              HomebrewCreation.deleteFeat(homebrewID, data.featID).then((result) => {
                HomebrewCreation.addFeat(homebrewID, data).then((result) => {
                  socket.emit('returnHomebrewCompleteFeat');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestHomebrewRemoveFeat', function(homebrewID, featID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.deleteFeat(homebrewID, featID).then((result) => {
              socket.emit('returnHomebrewRemoveContent');
            });
          }
        });
      });
  
      socket.on('requestHomebrewFeatDetailsPlus', function(homebrewID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            GeneralGathering.getAllFeats(userID, homebrewID).then((featsObject) => {
              GeneralGathering.getAllClasses(userID).then((classObject) => {
                GeneralGathering.getAllAncestries(userID, true).then((ancestriesObject) => {
                  GeneralGathering.getAllUniHeritages(userID).then((uniHeritageArray) => {
                    GeneralGathering.getAllArchetypes(userID).then((archetypeArray) => {
                      socket.emit('returnHomebrewFeatDetailsPlus', featsObject, classObject, ancestriesObject, uniHeritageArray, archetypeArray);
                    });
                  });
                });
              });
            });
          }
        });
      });

      ////

      socket.on('requestHomebrewAddHeritage', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.addHeritage(homebrewID, null, data).then((result) => {
              socket.emit('returnHomebrewCompleteHeritage');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUpdateHeritage', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            if(data != null && data.heritageID != null) {
              HomebrewCreation.deleteHeritage(homebrewID, data.heritageID).then((result) => {
                HomebrewCreation.addHeritage(homebrewID, null, data).then((result) => {
                  socket.emit('returnHomebrewCompleteHeritage');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestHomebrewRemoveHeritage', function(homebrewID, heritageID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.deleteHeritage(homebrewID, heritageID).then((result) => {
              socket.emit('returnHomebrewRemoveContent');
            });
          }
        });
      });
  
      socket.on('requestHomebrewHeritageDetails', function(homebrewID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            GeneralGathering.getAllHeritages(userID, homebrewID).then((heritages) => {
              GeneralGathering.getAllAncestriesBasic(userID).then((ancestries) => {
                socket.emit('returnHomebrewHeritageDetails', heritages, ancestries);
              });
            });
          }
        });
      });

      ////

      socket.on('requestHomebrewAddUniHeritage', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.addUniHeritage(homebrewID, data).then((result) => {
              socket.emit('returnHomebrewCompleteUniHeritage');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUpdateUniHeritage', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            if(data != null && data.uniHeritageID != null) {
              HomebrewCreation.deleteUniHeritage(homebrewID, data.uniHeritageID).then((result) => {
                HomebrewCreation.addUniHeritage(homebrewID, data).then((result) => {
                  socket.emit('returnHomebrewCompleteUniHeritage');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestHomebrewRemoveUniHeritage', function(homebrewID, uniHeritageID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.deleteUniHeritage(homebrewID, uniHeritageID).then((result) => {
              socket.emit('returnHomebrewRemoveContent');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUniHeritageDetails', function(homebrewID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            GeneralGathering.getAllUniHeritages(userID, homebrewID).then((uniheritages) => {
              GeneralGathering.getAllFeats(userID, homebrewID).then((featsObject) => {
                socket.emit('returnHomebrewUniHeritageDetails', uniheritages, featsObject);
              });
            });
          }
        });
      });

      ////

      socket.on('requestHomebrewAddItem', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.addItem(homebrewID, data).then((result) => {
              socket.emit('returnHomebrewCompleteItem');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUpdateItem', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            if(data != null && data.itemID != null) {
              HomebrewCreation.deleteItem(homebrewID, data.itemID).then((result) => {
                HomebrewCreation.addItem(homebrewID, data).then((result) => {
                  socket.emit('returnHomebrewCompleteItem');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestHomebrewRemoveItem', function(homebrewID, itemID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.deleteItem(homebrewID, itemID).then((result) => {
              socket.emit('returnHomebrewRemoveContent');
            });
          }
        });
      });
  
      socket.on('requestHomebrewItemDetails', function(homebrewID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            GeneralGathering.getAllItems(userID, homebrewID).then((itemMap) => {
              socket.emit('returnHomebrewItemDetails', mapToObj(itemMap));
            });
          }
        });
      });

      ////

      socket.on('requestHomebrewAddSpell', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.addSpell(homebrewID, data).then((result) => {
              socket.emit('returnHomebrewCompleteSpell');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUpdateSpell', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            if(data != null && data.spellID != null) {
              HomebrewCreation.deleteSpell(homebrewID, data.spellID).then((result) => {
                HomebrewCreation.addSpell(homebrewID, data).then((result) => {
                  socket.emit('returnHomebrewCompleteSpell');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestHomebrewRemoveSpell', function(homebrewID, spellID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.deleteSpell(homebrewID, spellID).then((result) => {
              socket.emit('returnHomebrewRemoveContent');
            });
          }
        });
      });
  
      socket.on('requestHomebrewSpellDetails', function(homebrewID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            GeneralGathering.getAllSpells(userID, homebrewID).then((spellMap) => {
              socket.emit('returnHomebrewSpellDetails', mapToObj(spellMap));
            });
          }
        });
      });

      ////

      socket.on('requestHomebrewAddLanguage', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.addLanguage(homebrewID, data).then((result) => {
              socket.emit('returnHomebrewCompleteLanguage');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUpdateLanguage', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            if(data != null && data.languageID != null) {
              HomebrewCreation.deleteLanguage(homebrewID, data.languageID).then((result) => {
                HomebrewCreation.addLanguage(homebrewID, data).then((result) => {
                  socket.emit('returnHomebrewCompleteLanguage');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestHomebrewRemoveLanguage', function(homebrewID, languageID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.deleteLanguage(homebrewID, languageID).then((result) => {
              socket.emit('returnHomebrewRemoveContent');
            });
          }
        });
      });
  
      socket.on('requestHomebrewLanguageDetails', function(homebrewID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            GeneralGathering.getAllLanguages(userID, homebrewID).then((languages) => {
              socket.emit('returnHomebrewLanguageDetails', languages);
            });
          }
        });
      });

      ////

      socket.on('requestHomebrewAddTrait', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.addTrait(homebrewID, data).then((result) => {
              socket.emit('returnHomebrewCompleteTrait');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUpdateTrait', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            if(data != null && data.traitID != null) {
              HomebrewCreation.deleteTrait(homebrewID, data.traitID).then((result) => {
                HomebrewCreation.addTrait(homebrewID, data).then((result) => {
                  socket.emit('returnHomebrewCompleteTrait');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestHomebrewRemoveTrait', function(homebrewID, traitID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.deleteTrait(homebrewID, traitID).then((result) => {
              socket.emit('returnHomebrewRemoveContent');
            });
          }
        });
      });
  
      socket.on('requestHomebrewTraitDetails', function(homebrewID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            GeneralGathering.getAllTags(userID, homebrewID).then((traits) => {
              socket.emit('returnHomebrewTraitDetails', traits);
            });
          }
        });
      });

      ////

      socket.on('requestHomebrewAddToggleable', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.addToggleable(homebrewID, data).then((result) => {
              socket.emit('returnHomebrewCompleteToggleable');
            });
          }
        });
      });
  
      socket.on('requestHomebrewUpdateToggleable', function(homebrewID, data){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            if(data != null && data.toggleableID != null) {
              HomebrewCreation.deleteToggleable(homebrewID, data.toggleableID).then((result) => {
                HomebrewCreation.addToggleable(homebrewID, data).then((result) => {
                  socket.emit('returnHomebrewCompleteToggleable');
                });
              });
            }
          }
        });
      });
    
      socket.on('requestHomebrewRemoveToggleable', function(homebrewID, toggleableID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            HomebrewCreation.deleteToggleable(homebrewID, toggleableID).then((result) => {
              socket.emit('returnHomebrewRemoveContent');
            });
          }
        });
      });
  
      socket.on('requestHomebrewToggleableDetails', function(homebrewID){
        UserHomebrew.canEditHomebrew(userID, homebrewID).then((canEdit) => {
          if(canEdit){
            GeneralGathering.getAllToggleables(userID, homebrewID).then((toggleables) => {
              socket.emit('returnHomebrewToggleableDetails', toggleables);
            });
          }
        });
      });

    });

  }

};