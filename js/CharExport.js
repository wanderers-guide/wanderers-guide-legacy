
const { Op } = require("sequelize");

const Inventory = require('../models/contentDB/Inventory');
const InvItem = require('../models/contentDB/InvItem');
const InvItemRune = require('../models/contentDB/InvItemRune');
const CharCondition = require('../models/contentDB/CharCondition');
const NoteField = require('../models/contentDB/NoteField');
const SpellBookSpell = require('../models/contentDB/SpellBookSpell');

const CharGathering = require('./CharGathering');

module.exports = class CharExport {

  static getExportData(charID){

    /*

      Need:
      > characters
      > inventories
      > invItems
      > invItemRunes
      > charDataMappings
      > charAnimalCompanions
      > charFamiliars
      > charConditions
      > noteFields
      > spellBookSpells

      Don't Need:
      > calculatedStats
      > accessTokens

    */

   InvItem.hasMany(InvItemRune, {foreignKey: 'invItemID'});
   InvItemRune.belongsTo(InvItem, {foreignKey: 'invItemID'});

    return CharGathering.getCharacter(charID)
    .then((character) => {
      return Inventory.findOne({ where: { id: character.inventoryID} })
      .then((inventory) => {
        return InvItem.findAll({ where: { invID: inventory.id}, include: [InvItemRune] })
        .then((invItems) => {
          return CharGathering.getAllMetadata(charID)
          .then((charMetaData) => {
            return CharGathering.getCharAnimalCompanions(charID)
            .then((charAnimalCompanions) => {
              return CharGathering.getCharFamiliars(charID)
              .then((charFamiliars) => {
                return CharCondition.findAll({ where: { charID: charID} })
                .then((charConditions) => {
                  return NoteField.findAll({ where: { charID: charID } })
                  .then(function(noteFields) {
                    return SpellBookSpell.findAll({ where: { charID: charID } })
                    .then(function(spellBookSpells) {
                      return {
                        character: character,
                        inventory: inventory,
                        invItems: invItems,
                        metaData: charMetaData,
                        animalCompanions: charAnimalCompanions,
                        familiars: charFamiliars,
                        conditions: charConditions,
                        noteFields: noteFields,
                        spellBookSpells: spellBookSpells,
                      };
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

};