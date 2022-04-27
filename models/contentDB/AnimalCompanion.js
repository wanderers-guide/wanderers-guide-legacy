const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const AnimalCompanion = db.define('animalCompanions', {
  name: {
    type: Sequelize.STRING
  },
  rarity: {
    type: Sequelize.ENUM,
    values: ['COMMON', 'UNCOMMON', 'RARE', 'UNIQUE']
  },
  description: {
    type: Sequelize.TEXT
  },
  size: {
    type: Sequelize.ENUM,
    values: ['TINY', 'SMALL', 'SMALL-MED', 'MEDIUM', 'LARGE', 'MED-LARGE', 'HUGE', 'GARGANTUAN']
  },

  a1Name: {
    type: Sequelize.STRING
  },
  a1Type: {
    type: Sequelize.ENUM,
    values: ['MELEE', 'RANGED']
  },
  a1Actions: {
    type: Sequelize.ENUM,
    values: ['NONE', 'FREE_ACTION', 'REACTION', 'ACTION', 'TWO_ACTIONS', 'THREE_ACTIONS']
  },
  a1Tags: {
    type: Sequelize.STRING
  },
  a1DmgDie: {
    type: Sequelize.ENUM,
    values: ['', 'd2', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20']
  },
  a1DmgType: {
    type: Sequelize.STRING
  },

  a2Name: {
    type: Sequelize.STRING
  },
  a2Type: {
    type: Sequelize.ENUM,
    values: ['MELEE', 'RANGED']
  },
  a2Actions: {
    type: Sequelize.ENUM,
    values: ['NONE', 'FREE_ACTION', 'REACTION', 'ACTION', 'TWO_ACTIONS', 'THREE_ACTIONS']
  },
  a2Tags: {
    type: Sequelize.STRING
  },
  a2DmgDie: {
    type: Sequelize.ENUM,
    values: ['', 'd2', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20']
  },
  a2DmgType: {
    type: Sequelize.STRING
  },

  a3Name: {
    type: Sequelize.STRING
  },
  a3Type: {
    type: Sequelize.ENUM,
    values: ['MELEE', 'RANGED']
  },
  a3Actions: {
    type: Sequelize.ENUM,
    values: ['NONE', 'FREE_ACTION', 'REACTION', 'ACTION', 'TWO_ACTIONS', 'THREE_ACTIONS']
  },
  a3Tags: {
    type: Sequelize.STRING
  },
  a3DmgDie: {
    type: Sequelize.ENUM,
    values: ['', 'd2', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20']
  },
  a3DmgType: {
    type: Sequelize.STRING
  },

  modStr: {
    type: Sequelize.INTEGER
  },
  modDex: {
    type: Sequelize.INTEGER
  },
  modCon: {
    type: Sequelize.INTEGER
  },
  modInt: {
    type: Sequelize.INTEGER
  },
  modWis: {
    type: Sequelize.INTEGER
  },
  modCha: {
    type: Sequelize.INTEGER
  },

  hitPoints: {
    type: Sequelize.INTEGER
  },
  skills: {
    type: Sequelize.STRING
  },
  senses: {
    type: Sequelize.STRING
  },
  speeds: {
    type: Sequelize.STRING
  },
  special: {
    type: Sequelize.STRING
  },
  supportBenefit: {
    type: Sequelize.STRING
  },
  advancedManeuver: {
    type: Sequelize.STRING
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

module.exports = AnimalCompanion;