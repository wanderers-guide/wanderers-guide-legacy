
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

                          return CharExport.processInvItems(charID, character, invItems)
                          .then((p_invItems) => {
                            return CharExport.processSpellBookSpells(charID, character, spellBookSpells)
                            .then((p_spellBookSpells) => {
                              return CharExport.processConditions(charID, character, charConditions)
                              .then((p_charConditions) => {
                                return CharExport.processBasicCharInfo(charID, character)
                                .then((p_character) => {
                          
                                  return {
                                    version: 2,
                                    character: p_character,
                                    build: charBuildData,
                                    stats: calculatedStats,
                                    conditions: p_charConditions,

                                    inventory: inventory,
                                    invItems: p_invItems,
                                    spellBookSpells: p_spellBookSpells,
                                    animalCompanions: charAnimalCompanions,
                                    familiars: charFamiliars,
                                    noteFields: noteFields,

                                    metaData: charMetaData,
                                    
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

  static async processInvItems(charID, character, invItems){

    let allItems = await CharGathering.getAllItems(charID, character, null, null);
    for(let invItem of invItems){
      let itemData = allItems.get(invItem.itemID);
      if(itemData == null) { itemData = { Item: {} }; }
      invItem.dataValues._itemOriginalName = itemData.Item.name;
    }

    return invItems;

  }

  static async processSpellBookSpells(charID, character, spellBookSpells){

    let allSpells = await CharGathering.getAllSpells(charID, character, null, null, null);
    for(let spellBookSpell of spellBookSpells){
      let spellData = allSpells.get(spellBookSpell.spellID);
      if(spellData == null) { spellData = { Spell: {} }; }
      spellBookSpell.dataValues._spellName = spellData.Spell.name;
    }

    return spellBookSpells;

  }

  static async processConditions(charID, character, charConditions){

    let allConditions = await CharGathering.getAllConditions();
    for(let charCondition of charConditions){
      let condition = allConditions.find(condition => {
        return charCondition.conditionID == condition.id;
      });
      if(condition == null) { condition = {}; }
      charCondition.dataValues._conditionName = condition.name;
    }

    return charConditions;

  }

  static async processBasicCharInfo(charID, character){

    let cClass = await CharGathering.getClassBasic(character);
    let background = await CharGathering.getBackground(charID, character);
    let ancestry = await CharGathering.getAncestry(charID, character);
    let heritage = await CharGathering.getHeritage(charID, character);

    character.dataValues._class = cClass;
    character.dataValues._background = background;
    character.dataValues._ancestry = ancestry;
    character.dataValues._heritage = heritage;

    return character;

  }

};