
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
const CharTags = require('./CharTags');

function mapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v;
  }
  return obj;
}

module.exports = class CharExport {

  static getExportData(userID, charID){

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

    return CharGathering.getCharacter(userID, charID)
    .then((character) => {
      return Inventory.findOne({ where: { id: character.inventoryID} })
      .then((inventory) => {
        return InvItem.findAll({ where: { invID: inventory.id} })
        .then((invItems) => {
          return CharGathering.getAllMetadata(userID, charID)
          .then((charMetaData) => {
            return CharGathering.getCharAnimalCompanions(userID, charID)
            .then((charAnimalCompanions) => {
              return CharGathering.getCharFamiliars(userID, charID)
              .then((charFamiliars) => {
                return CharCondition.findAll({ where: { charID: charID} })
                .then((charConditions) => {
                  return NoteField.findAll({ where: { charID: charID } })
                  .then(function(noteFields) {
                    return SpellBookSpell.findAll({ where: { charID: charID } })
                    .then(function(spellBookSpells) {
                      return CharExport.getCharBuildData(userID, charID)
                      .then(function(charBuildData) {
                        return CharGathering.getCalculatedStats(userID, charID)
                        .then((calculatedStats) => {
                          return CharGathering.getFinalProfs(userID, charID)
                          .then((profMap) => {
                            return CharTags.getTags(charID).then((charTags) => {

                              return CharExport.processInvItems(userID, charID, character, invItems)
                              .then((p_invItems) => {
                                return CharExport.processSpellBookSpells(userID, charID, character, spellBookSpells)
                                .then((p_spellBookSpells) => {
                                  return CharExport.processConditions(userID, charID, character, charConditions)
                                  .then((p_charConditions) => {
                                    return CharExport.processBasicCharInfo(userID, charID, character)
                                    .then((p_character) => {
                              
                                      return {
                                        version: 3,
                                        character: p_character,
                                        charTraits: charTags,
                                        build: charBuildData,
                                        stats: calculatedStats,
                                        conditions: p_charConditions,
                                        profs: mapToObj(profMap),

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
      });
    });

  }

  static async getCharBuildData(userID, charID){

    let chosenBoosts = await CharGathering.getChoicesAbilityBonus(userID, charID);
    let chosenDomains = await CharGathering.getChoicesDomains(userID, charID);
    let chosenFeats = await CharGathering.getChoicesFeats(userID, charID);
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

  static async processInvItems(userID, charID, character, invItems){

    let allItems = await CharGathering.getAllItems(userID, character.enabledSources, character.enabledHomebrew, null, null);
    for(let invItem of invItems){
      let itemData = allItems.get(invItem.itemID);
      if(itemData == null) { itemData = { Item: {} }; }
      invItem.dataValues._itemOriginalName = itemData.Item.name;
    }

    return invItems;

  }

  static async processSpellBookSpells(userID, charID, character, spellBookSpells){

    let allSpells = await CharGathering.getAllSpells(userID, character.enabledSources, character.enabledHomebrew, null, null, null);
    for(let spellBookSpell of spellBookSpells){
      let spellData = allSpells.get(spellBookSpell.spellID);
      if(spellData == null) { spellData = { Spell: {} }; }
      spellBookSpell.dataValues._spellName = spellData.Spell.name;
    }

    return spellBookSpells;

  }

  static async processConditions(userID, charID, character, charConditions){

    let allConditions = await CharGathering.getAllConditions(userID);
    for(let charCondition of charConditions){
      let condition = allConditions.find(condition => {
        return charCondition.conditionID == condition.id;
      });
      if(condition == null) { condition = {}; }
      charCondition.dataValues._conditionName = condition.name;
    }

    return charConditions;

  }

  static async processBasicCharInfo(userID, charID, character){

    let cClass = await CharGathering.getClassBasic(userID, character);
    let background = await CharGathering.getBackground(userID, charID, character);
    let ancestry = await CharGathering.getAncestry(userID, charID, character);
    let heritage = await CharGathering.getHeritage(userID, charID, character);

    character.dataValues._class = cClass;
    character.dataValues._background = background;
    character.dataValues._ancestry = ancestry;
    character.dataValues._heritage = heritage;

    return character;

  }

};