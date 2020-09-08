const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Character = db.define('characters', {
  userID: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  level: {
    type: Sequelize.INTEGER
  },
  experience: {
    type: Sequelize.INTEGER
  },
  currentHealth: {
    type: Sequelize.INTEGER
  },
  tempHealth: {
    type: Sequelize.INTEGER
  },
  heroPoints: {
    type: Sequelize.INTEGER
  },
  ancestryID: {
    type: Sequelize.INTEGER
  },
  heritageID: {
    type: Sequelize.INTEGER
  },
  uniHeritageID: {
    type: Sequelize.INTEGER
  },
  backgroundID: {
    type: Sequelize.INTEGER
  },
  classID: {
    type: Sequelize.INTEGER
  },
  inventoryID: {
    type: Sequelize.INTEGER
  },
  notes: {
    type: Sequelize.TEXT
  },
  details: {
    type: Sequelize.TEXT
  },
  dataID: {
    type: Sequelize.INTEGER
  },
  // Character Options //
  optionAutoDetectPreReqs: {
    type: Sequelize.INTEGER
  },
  optionAutoHeightenSpells: {
    type: Sequelize.INTEGER
  },
  optionPublicCharacter: {
    type: Sequelize.INTEGER
  },
  // Character Variants //
  variantProfWithoutLevel: {
    type: Sequelize.INTEGER
  },
  variantFreeArchetype: {
    type: Sequelize.INTEGER
  },
  variantAncestryParagon: {
    type: Sequelize.INTEGER
  },
  // Character Enabled Sources //
  enabledSources: {
    type: Sequelize.STRING
  },
});

module.exports = Character;