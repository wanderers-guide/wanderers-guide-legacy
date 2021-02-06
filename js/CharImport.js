
const { Op } = require("sequelize");

const User = require('../models/contentDB/User');
const Inventory = require('../models/contentDB/Inventory');
const Character = require('../models/contentDB/Character');
const InvItem = require('../models/contentDB/InvItem');
const NoteField = require('../models/contentDB/NoteField');
const CharDataMapping = require('../models/contentDB/CharDataMapping');
const CharAnimalCompanion = require('../models/contentDB/CharAnimalCompanion');
const CharFamiliar = require('../models/contentDB/CharFamiliar');
const CharCondition = require('../models/contentDB/CharCondition');
const SpellBookSpell = require('../models/contentDB/SpellBookSpell');

const CharStateUtils = require('./CharStateUtils');

function srcStructToCode(charID, source, srcStruct) {
  if(srcStruct == null){ return -1; }
  return hashCode(charID+'-'+source+'-'+srcStruct.sourceType+'-'+srcStruct.sourceLevel+'-'+srcStruct.sourceCode+'-'+srcStruct.sourceCodeSNum);
}

function hashCode(str) {
  return str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

// Returns UserID or -1 if not logged in.
function getUserID(socket){
  if(socket.request.session.passport != null){
      return socket.request.session.passport.user;
  } else {
      return -1;
  }
}

module.exports = class CharImport {

  static importData(socket, charExportData) {

    return User.findOne({ where: { id: getUserID(socket)} })
    .then((user) => {
      if(user == null) { return; }
      return Character.findAll({ where: { userID: user.id} })
      .then((characters) => {
        if(CharStateUtils.canMakeCharacter(user, characters)){
          return CharImport.processImport(user.id, charExportData);
        }
      });
    });

  }

  static processImport(userID, charExportData){
    charExportData.character.userID = userID;// User ID is current user.

    try {

      // Inventory
      delete charExportData.inventory.id;
      return Inventory.create(charExportData.inventory)
      .then(inventory => {

        // Character
        delete charExportData.character.id;
        charExportData.character.inventoryID = inventory.id;
        return Character.create(charExportData.character)
        .then(character => {
          
          // Inv Items
          let invItemPromises = [];
          for(let invItem of charExportData.invItems) {
            delete invItem.id;
            invItem.invID = inventory.id;
            invItemPromises.push(InvItem.create(invItem));
          }
          return Promise.all(invItemPromises)
          .then(function(result) {

            // Note Fields
            let noteFieldPromises = [];

            // Generate a new ID based off of char metadata.
            for(const metaData of charExportData.metaData) {
              if(metaData.source == 'notesField') {
                let oldNoteFieldID = srcStructToCode(metaData.charID, metaData.source, metaData);
                let noteField = charExportData.noteFields.find(noteField => {
                  return noteField.id == oldNoteFieldID;
                });
                if(noteField != null){
                  noteField.id = srcStructToCode(character.id, metaData.source, metaData);
                  noteFieldPromises.push(NoteField.create(noteField));
                }
              }
            }

            return Promise.all(noteFieldPromises)
            .then(function(result) {

              // Meta Data
              let metaDataPromises = [];
              for(let metaData of charExportData.metaData) {
                metaData.charID = character.id;
                metaDataPromises.push(CharDataMapping.create(metaData));
              }
              return Promise.all(metaDataPromises)
              .then(function(result) {
                  
                // Animal Companions
                let animalCompPromises = [];
                for(let animalCompanion of charExportData.animalCompanions) {
                  delete animalCompanion.id;
                  animalCompanion.charID = character.id;
                  animalCompPromises.push(CharAnimalCompanion.create(animalCompanion));
                }
                return Promise.all(animalCompPromises)
                .then(function(result) {

                  // Familiars
                  let familiarPromises = [];
                  for(let familiar of charExportData.familiars) {
                    delete familiar.id;
                    familiar.charID = character.id;
                    familiarPromises.push(CharFamiliar.create(familiar));
                  }
                  return Promise.all(familiarPromises)
                  .then(function(result) {

                    // Conditions
                    let conditionPromises = [];
                    for(let condition of charExportData.conditions) {
                      delete condition.id;
                      condition.charID = character.id;
                      conditionPromises.push(CharCondition.create(condition));
                    }
                    return Promise.all(conditionPromises)
                    .then(function(result) {

                      // Spell Book Spells
                      let spellBookSpellPromises = [];
                      for(let spellBookSpell of charExportData.spellBookSpells) {
                        delete spellBookSpell.id;
                        spellBookSpell.charID = character.id;
                        spellBookSpellPromises.push(SpellBookSpell.create(spellBookSpell));
                      }
                      return Promise.all(spellBookSpellPromises)
                      .then(function(result) {

                        return true;

                      });

                    });

                  });

                });

              });

            });

          });

        });
      });

    } catch (err) {
      console.error(err);
      return false;
    }


  }

};