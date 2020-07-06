const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Spell = db.define('spells', {
  name: {
    type: Sequelize.STRING
  },
  level: {
    type: Sequelize.INTEGER
  },
  traditions: {
    type: Sequelize.STRING
  },
  cast: {
    type: Sequelize.STRING
  },
  castingComponents: {
    type: Sequelize.STRING
  },
  cost: {
    type: Sequelize.STRING
  },
  trigger: {
    type: Sequelize.STRING
  },
  requirements: {
    type: Sequelize.STRING
  },
  range: {
    type: Sequelize.STRING
  },
  area: {
    type: Sequelize.STRING
  },
  targets: {
    type: Sequelize.STRING
  },
  savingThrow: {
    type: Sequelize.ENUM,
    values: ['WILL', 'BASIC_WILL', 'FORT', 'BASIC_FORT', 'REFLEX', 'BASIC_REFLEX']
  },
  duration: {
    type: Sequelize.STRING
  },
  rarity: {
    type: Sequelize.ENUM,
    values: ['COMMON', 'UNCOMMON', 'RARE', 'UNIQUE']
  },
  description: {
    type: Sequelize.TEXT
  },
  heightenedOneVal: {
    type: Sequelize.STRING
  },
  heightenedOneText: {
    type: Sequelize.TEXT
  },
  heightenedTwoVal: {
    type: Sequelize.STRING
  },
  heightenedTwoText: {
    type: Sequelize.TEXT
  },
  heightenedThreeVal: {
    type: Sequelize.STRING
  },
  heightenedThreeText: {
    type: Sequelize.TEXT
  },
  heightenedFourVal: {
    type: Sequelize.STRING
  },
  heightenedFourText: {
    type: Sequelize.TEXT
  },
  isFocusSpell: {
    type: Sequelize.INTEGER
  },
  isArchived: {
    type: Sequelize.INTEGER
  },
  contentSrc: {
    type: Sequelize.STRING
  },
  homebrewID: {
    type: Sequelize.INTEGER
  },
  version: {
    type: Sequelize.STRING
  }
});

module.exports = Spell;