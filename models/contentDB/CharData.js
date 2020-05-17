const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const CharData = db.define('charDatas', {
  charTags: {
    type: Sequelize.STRING
  },
  dataAbilityBonus: {
    type: Sequelize.TEXT
  },
  dataLanguages: {
    type: Sequelize.TEXT
  },
  dataChosenFeats: {
    type: Sequelize.TEXT
  },
  dataAbilityChoices: {
    type: Sequelize.TEXT
  },
  dataProficiencies: {
    type: Sequelize.TEXT
  },
  dataLoreCategories: {
    type: Sequelize.TEXT
  },
  dataSpellLists: {
    type: Sequelize.TEXT
  },
  dataSpellSlots: {
    type: Sequelize.TEXT
  },
  dataSpellKeyAbilities: {
    type: Sequelize.TEXT
  },
  dataSenses: {
    type: Sequelize.TEXT
  },
  dataPhysicalFeatures: {
    type: Sequelize.TEXT
  },
  dataSpecializations: {
    type: Sequelize.TEXT
  }
});

module.exports = CharData;