
const CharGathering = require('./CharGathering');
const CharSaving = require('./CharSaving');
const CharSpells = require('./CharSpells');
const CharTags = require('./CharTags');
const CharDataMapping = require('./CharDataMapping');
const CharDataMappingExt = require('./CharDataMappingExt');
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

      socket.on('requestFinalProfs', function(charID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getFinalProfs(charID).then((profMap) => {
              CharGathering.getAllSkills(charID).then((skillObject) => {
                socket.emit('returnFinalProfs', mapToObj(profMap), skillObject);
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
            CharDataMapping.setData(charID, 'notesField', notesData, notesData.value)
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
              CharGathering.getAllConditions(charID)
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
              CharGathering.getAllConditions(charID)
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
              CharSpells.getSpellBook(charID, spellSRC).then((spellBookStruct) => {
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

      socket.on('requestFocusSpellCastingUpdate', function(charID, srcStruct, spellSRC, spellID, used){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setData(charID, 'focusSpell', srcStruct, spellSRC+"="+spellID+"="+used)
            .then((result) => {
              socket.emit('returnFocusSpellCastingUpdate');
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
              socket.emit('returnCharacterDetails', character);
            });
          }
        });
      });

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

      socket.on('requestCharacterOptionChange', function(charID, optionName, value){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSaving.saveCharacterOption(charID, optionName, value).then((result) => {
              socket.emit('returnCharacterOptionChange');
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
              CharGathering.getClass(character.classID).then((classDetails) => {
                CharGathering.getAncestry(character.ancestryID).then((ancestry) => {
                  CharGathering.getAbilityScores(charID).then((abilObject) => {
                    socket.emit('returnFinalizeDetails', character, abilObject, classDetails.Class, ancestry);
                  });
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
                socket.emit('returnClassChoiceChange');
              });
            } else {
              CharDataMappingExt.setDataClassChoice(charID, srcStruct, classChoiceStruct.SelectorID, classChoiceStruct.OptionID)
              .then((result) => {
                socket.emit('returnClassChoiceChange');
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
    
      socket.on('requestFeatChange', function(charID, featChangePacket, selectFeatControlShellClass){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            let srcStruct = featChangePacket.srcStruct;
            if(featChangePacket.featID == null){
              CharDataMapping.deleteData(charID, 'chosenFeats', srcStruct)
              .then((result) => {
                socket.emit('returnFeatChange', featChangePacket, selectFeatControlShellClass);
              });
            } else {
              CharDataMapping.setData(charID, 'chosenFeats', srcStruct, featChangePacket.featID)
              .then((result) => {
                socket.emit('returnFeatChange', featChangePacket, selectFeatControlShellClass);
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
                    domain.SpellSRC+"="+domain.Domain.initialSpellID+"=0")
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
                    domain.SpellSRC+"="+domain.Domain.advancedSpellID+"=0")
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

      socket.on('requestLoreChange', function(charID, srcStruct, loreName){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(loreName == null){
              CharDataMapping.deleteData(charID, 'loreCategories', srcStruct)
              .then((result) => {
                socket.emit('returnLoreChange');
              });
            } else {
              CharDataMapping.setData(charID, 'loreCategories', srcStruct, loreName)
              .then((result) => {
                socket.emit('returnLoreChange');
              });
            }
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
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
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
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
              socket.emit('returnASCStatementFailure', 'Invalid weapon specialization type \"'+type+'\"');
            }
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
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
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
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
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestSpeedChange', function(charID, srcStruct, speedType, speedAmt){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            let amount = parseInt(speedAmt);
            if(!isNaN(amount) || speedAmt === 'LAND_SPEED') {
              CharDataMappingExt.setDataOtherSpeed(charID, srcStruct, speedType, amount)
              .then((result) => {
                socket.emit('returnSpeedChange');
              });
            } else {
              socket.emit('returnASCStatementFailure', 'Invalid Speed Amount \"'+speedAmt+'\"');
            }
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestCharTagChange', function(charID, srcStruct, charTag){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharTags.setTag(charID, srcStruct, charTag)
            .then((result) => {
              socket.emit('returnCharTagChange');
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
                let srcStruct = featChangePacket.srcStruct;
                CharDataMapping.setData(charID, 'chosenFeats', srcStruct, feat.id)
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
                socket.emit('returnASCStatementFailure', 'Cannot find language \"'+langName+'\"');
              }
            });
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
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
                socket.emit('returnASCStatementFailure', 'Cannot find sense \"'+senseName+'\"');
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
                socket.emit('returnASCStatementFailure', 'Cannot find physical feature \"'+physicalFeatureName+'\"');
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
                socket.emit('returnASCStatementFailure', 'Invalid Spellcasting \"'+spellcasting+'\"');
              }
            });
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestSpellSlotChange', function(charID, srcStruct, spellSRC, spellSlot){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharSpells.setSpellSlot(charID, srcStruct, spellSRC, spellSlot)
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
      socket.on('requestKeySpellAbilityChange', function(charID, srcStruct, spellSRC, abilityScore){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.setData(charID, 'spellKeyAbilities', srcStruct, spellSRC+"="+abilityScore)
            .then((result) => {
              socket.emit('returnKeySpellAbilityChange');
            });
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
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
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
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
              socket.emit('returnASCStatementFailure', 'Invalid Spell Tradition \"'+spellList+'\"');
            }
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
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
                      socket.emit('returnASCStatementFailure', 'Spell level cannot be lower than minimum spell level!');
                    }
                  } else {
                    socket.emit('returnASCStatementFailure', 'Invalid Spell \"'+spellName+'\"');
                  }
                });
              } else {
                socket.emit('returnASCStatementFailure', 'Invalid Parameters \"'+timesPerDay+'\" and \"'+spellLevel+'\"');
              }
            } else {
              socket.emit('returnASCStatementFailure', 'Invalid Spell Tradition \"'+spellTradition+'\"');
            }
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
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
                  CharDataMapping.setData(charID, 'focusSpell', srcStruct, spellSRC+"="+spell.id+"=0")
                  .then((result) => {
                    socket.emit('returnFocusSpellChange');
                  });
                } else {
                  socket.emit('returnASCStatementFailure', '\"'+spellName+'\" is not a focus spell!');
                }
              } else {
                socket.emit('returnASCStatementFailure', 'Invalid Spell \"'+spellName+'\"');
              }
            });
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      // Resistances //
      socket.on('requestResistanceChange', function(charID, srcStruct, resistType, resistAmount){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(resistAmount === 'HALF_LEVEL' || resistAmount === 'LEVEL' || !isNaN(parseInt(resistAmount))){
              CharDataMappingExt.setDataResistance(charID, srcStruct, resistType, resistAmount)
              .then((result) => {
                socket.emit('returnResistanceChange');
              });
            } else {
              socket.emit('returnASCStatementFailure', "Invalid Resistance Amount '"+resistAmount+"'!");
            }
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestVulnerabilityChange', function(charID, srcStruct, vulnerableType, vulnerableAmount){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(vulnerableAmount === 'HALF_LEVEL' || vulnerableAmount === 'LEVEL' || !isNaN(parseInt(vulnerableAmount))){
              CharDataMappingExt.setDataVulnerability(charID, srcStruct, vulnerableType, vulnerableAmount)
              .then((result) => {
                socket.emit('returnVulnerabilityChange');
              });
            } else {
              socket.emit('returnASCStatementFailure', "Invalid Vulnerability Amount '"+vulnerableAmount+"'!");
            }
          } else {
            socket.emit('returnASCStatementFailure', 'Incorrect Auth');
          }
        });
      });

      socket.on('requestNotesFieldChange', function(charID, srcStruct, placeholderText, locationID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharDataMapping.getDataSingle(charID, 'notesField', srcStruct)
            .then((notesData) => {
              if(notesData == null) {
                CharDataMapping.setData(charID, 'notesField', srcStruct, placeholderText+",,,")
                .then((result) => {
                  socket.emit('returnNotesFieldChange', notesData, srcStruct, placeholderText, locationID);
                });
              } else {
                socket.emit('returnNotesFieldChange', notesData, srcStruct, placeholderText, locationID);
              }
            });
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

      socket.on('requestASCChoices', function(charID, ascCode, srcStruct, locationID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getCharChoices(charID).then((choiceStruct) => {
              socket.emit('returnASCChoices', ascCode, srcStruct, locationID, choiceStruct);
            });
          }
        });
      });
    
      socket.on('requestASCFeats', function(charID, ascStatement, srcStruct, locationID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllFeats().then((featsObject) => {
              socket.emit('returnASCFeats', ascStatement, srcStruct, locationID, featsObject);
            });
          }
        });
      });
    
      socket.on('requestASCSkills', function(charID, ascStatement, srcStruct, locationID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllSkills(charID).then((skillsObject) => {
              socket.emit('returnASCSkills', ascStatement, srcStruct, locationID, skillsObject);
            });
          }
        });
      });
    
      socket.on('requestASCLangs', function(charID, ascStatement, srcStruct, locationID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllLanguages(charID).then((langsObject) => {
              socket.emit('returnASCLangs', ascStatement, srcStruct, locationID, langsObject);
            });
          }
        });
      });

      socket.on('requestASCSpells', function(charID, ascStatement, srcStruct, locationID){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            CharGathering.getAllSpells().then((spellMap) => {
              socket.emit('returnASCSpells', ascStatement, srcStruct, locationID, mapToObj(spellMap));
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
    
      socket.on('requestASCUpdateChoices', function(charID, updateType){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(updateType == 'ABILITY-BOOSTS'){
              CharGathering.getChoicesAbilityBonus(charID).then((bonusDataArray) => {
                socket.emit('returnASCUpdateChoices', 'ABILITY-BOOSTS', bonusDataArray);
              });
            } else if(updateType == 'FEATS'){
              CharGathering.getChoicesFeats(charID).then((featDataArray) => {
                socket.emit('returnASCUpdateChoices', 'FEATS', featDataArray);
              });
            } else if(updateType == 'DOMAINS'){
              CharGathering.getChoicesDomains(charID).then((domainDataArray) => {
                socket.emit('returnASCUpdateChoices', 'DOMAINS', domainDataArray);
              });
            } else {
              socket.emit('returnASCUpdateChoices', null, null);
            }
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

      socket.on('requestASCAbilityBonusChange', function(charID, srcStruct, abilityBonusStruct, selectBoostControlShellClass){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(abilityBonusStruct == null){
              CharDataMapping.deleteData(charID, 'abilityBonus', srcStruct)
              .then((result) => {
                socket.emit('returnASCAbilityBonusChange', selectBoostControlShellClass);
              });
            } else {
              CharDataMappingExt.setDataAbilityBonus(charID, srcStruct, abilityBonusStruct.Ability, abilityBonusStruct.Bonus)
              .then((result) => {
                socket.emit('returnASCAbilityBonusChange', selectBoostControlShellClass);
              });
            }
          }
        });
      });

      socket.on('requestASCInnateSpellChange', function(charID, srcStruct, innateSpellStruct, selectControlShellClass){
        AuthCheck.ownsCharacter(socket, charID).then((ownsChar) => {
          if(ownsChar){
            if(innateSpellStruct == null){
              CharDataMapping.deleteData(charID, 'innateSpell', srcStruct)
              .then((result) => {
                socket.emit('returnASCInnateSpellChange', selectControlShellClass);
              });
            } else {
              CharGathering.getSpellByName(innateSpellStruct.name)
              .then((spell) => {
                if(spell != null){
                  CharDataMappingExt.setDataInnateSpell(charID, srcStruct, spell.id, innateSpellStruct.level, innateSpellStruct.tradition, innateSpellStruct.tPd)
                  .then((result) => {
                    socket.emit('returnASCInnateSpellChange', selectControlShellClass);
                  });
                }
              });
            }
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

      ////

      socket.on('requestAdminAddClass', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            AdminUpdate.addClass(data).then((result) => {
              socket.emit('returnAdminCompleteClass');
            });
          }
        });
      });

      socket.on('requestAdminUpdateClass', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.classID != null) {
              AdminUpdate.archiveClass(data.classID, true).then((result) => {
                AdminUpdate.addClass(data).then((result) => {
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
            AdminUpdate.deleteClass(classID).then((result) => {
              socket.emit('returnAdminRemoveClass');
            });
          }
        });
      });

      socket.on('requestAdminClassDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            CharGathering.getAllClasses().then((classObject) => {
              CharGathering.getAllFeats().then((featsObject) => {
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
            AdminUpdate.addBackground(data).then((result) => {
              socket.emit('returnAdminCompleteBackground');
            });
          }
        });
      });

      socket.on('requestAdminUpdateBackground', function(data){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            if(data != null && data.backgroundID != null) {
              AdminUpdate.archiveBackground(data.backgroundID, true).then((result) => {
                AdminUpdate.addBackground(data).then((result) => {
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
            AdminUpdate.deleteBackground(backgroundID).then((result) => {
              socket.emit('returnAdminRemoveBackground');
            });
          }
        });
      });

      socket.on('requestAdminBackgroundDetails', function(){
        AuthCheck.isAdmin(socket).then((isAdmin) => {
          if(isAdmin){
            CharGathering.getAllBackgrounds().then((backgrounds) => {
              socket.emit('returnAdminBackgroundDetails', backgrounds);
            });
          }
        });
      });
      

    });
  }

};