const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Feat = db.define('feats', {
  name: {
    type: Sequelize.STRING
  },
  actions: {
    type: Sequelize.ENUM,
    values: ['NONE', 'FREE_ACTION', 'REACTION', 'ACTION', 'TWO_ACTIONS', 'THREE_ACTIONS']
  },
  level: {
    type: Sequelize.INTEGER
  },
  rarity: {
    type: Sequelize.ENUM,
    values: ['COMMON', 'UNCOMMON', 'RARE', 'UNIQUE']
  },
  prerequisites: {
    type: Sequelize.STRING
  },
  frequency: {
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
  description: {
    type: Sequelize.TEXT
  },
  special: {
    type: Sequelize.STRING
  },
  canSelectMultiple: {
    type: Sequelize.INTEGER
  },
  isDefault: { // If the action is given by default or not. Ex: Strike is default, AoO is not
    type: Sequelize.INTEGER
  },
  skillID: { // If it is a skill action, what skill the action is for.
    type: Sequelize.INTEGER
  },
  minProf: { // Used for default actions that require a min prof to use: NULL, 'U', 'T', 'E', 'M', 'L'
    type: Sequelize.STRING
  },
  code: {
    type: Sequelize.TEXT
  },
  isCore: {
    type: Sequelize.INTEGER
  },
  genericType: {
    type: Sequelize.ENUM,
    values: ['GENERAL-FEAT', 'SKILL-FEAT', 'CLASS-FEAT', 'ANCESTRY-FEAT', 'ARCHETYPE-FEAT', 'BASIC-ACTION', 'SKILL-ACTION']
  },
  genTypeName: {
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

module.exports = Feat;