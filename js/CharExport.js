
const { Op } = require("sequelize");

const Inventory = require('../models/contentDB/Inventory');
const InvItem = require('../models/contentDB/InvItem');
const CharCondition = require('../models/contentDB/CharCondition');
const NoteField = require('../models/contentDB/NoteField');
const SpellBookSpell = require('../models/contentDB/SpellBookSpell');
const Language = require("../models/contentDB/Language");
const SenseType = require("../models/contentDB/SenseType");

const CharGathering = require('./CharGathering');
const CharDataMapping = require('./CharDataMapping');
const CharDataMappingExt = require('./CharDataMappingExt');

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
      > calculatedStats

      Don't Need:
      > accessTokens

    */

    return CharGathering.getCharacter(charID)
    .then((character) => {
      return Inventory.findOne({ where: { id: character.inventoryID} })
      .then((inventory) => {
        return InvItem.findAll({ where: { invID: inventory.id} })
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
                      return CharExport.getCharBuildData(charID)
                      .then(function(charBuildData) {
                        return CharGathering.getCalculatedStats(charID)
                        .then((calculatedStats) => {
                          return {
                            version: 2,
                            character: character,
                            build: charBuildData,
                            stats: calculatedStats,
                            metaData: charMetaData,

                            inventory: inventory,
                            invItems: invItems,
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
      });
    });

  }

  static async getCharBuildData(charID){

    let chosenBoosts = await CharGathering.getChoicesAbilityBonus(charID);
    let chosenDomains = await CharGathering.getChoicesDomains(charID);
    let chosenFeats = await CharGathering.getChoicesFeats(charID);
    let chosenLangs = await CharDataMapping.getDataAll(charID, 'languages', Language);
    let chosenSenses = await CharDataMapping.getDataAll(charID, 'senses', SenseType);
    let chosenProfs = await CharDataMappingExt.getDataAllProficiencies(charID);

    return {
      boosts: chosenBoosts,
      domains: chosenDomains,
      feats: chosenFeats,
      languages: chosenLangs,
      proficiencies: chosenProfs,
      senses: chosenSenses,
    };

  }

};