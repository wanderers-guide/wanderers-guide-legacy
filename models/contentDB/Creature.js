const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Creature = db.define('creatures', {
  name: {
    type: Sequelize.STRING
  },
  level: {
    type: Sequelize.INTEGER
  },
  rarity: {
    type: Sequelize.ENUM,
    values: ['COMMON', 'UNCOMMON', 'RARE', 'UNIQUE']
  },
  alignment: {
    type: Sequelize.STRING
  },
  size: {
    type: Sequelize.ENUM,
    values: ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'HUGE', 'GARGANTUAN']
  },
  traitsJSON: {
    type: Sequelize.STRING
  },
  familyType: {
    type: Sequelize.STRING
  },

  perceptionBonus: {
    type: Sequelize.INTEGER
  },
  senses: {
    type: Sequelize.STRING
  },
  languagesJSON: {
    type: Sequelize.STRING
  },
  languagesCustom: {
    type: Sequelize.STRING
  },
  skillsJSON: {
    type: Sequelize.STRING
  },
  itemsJSON: {
    type: Sequelize.STRING
  },

  strMod: {
    type: Sequelize.INTEGER
  },
  dexMod: {
    type: Sequelize.INTEGER
  },
  conMod: {
    type: Sequelize.INTEGER
  },
  intMod: {
    type: Sequelize.INTEGER
  },
  wisMod: {
    type: Sequelize.INTEGER
  },
  chaMod: {
    type: Sequelize.INTEGER
  },
  interactionAbilitiesJSON: {
    type: Sequelize.TEXT
  },

  acValue: {
    type: Sequelize.INTEGER
  },
  fortBonus: {
    type: Sequelize.INTEGER
  },
  reflexBonus: {
    type: Sequelize.INTEGER
  },
  willBonus: {
    type: Sequelize.INTEGER
  },
  allSavesCustom: {
    type: Sequelize.STRING
  },

  hpMax: {
    type: Sequelize.INTEGER
  },
  hpDetails: {
    type: Sequelize.STRING
  },
  immunitiesJSON: {
    type: Sequelize.STRING
  },
  weaknessesJSON: {
    type: Sequelize.STRING
  },
  resistancesJSON: {
    type: Sequelize.STRING
  },

  defensiveAbilitiesJSON: {
    type: Sequelize.TEXT
  },
  speed: {
    type: Sequelize.INTEGER
  },
  otherSpeedsJSON: {
    type: Sequelize.STRING
  },

  attacksJSON: {
    type: Sequelize.STRING
  },
  spellcastingJSON: {
    type: Sequelize.STRING
  },
  offensiveAbilitiesJSON: {
    type: Sequelize.TEXT
  },

  flavorText: {
    type: Sequelize.TEXT
  },
  contentSrc: {
    type: Sequelize.STRING
  },
  homebrewID: {
    type: Sequelize.INTEGER
  },
});

module.exports = Creature;