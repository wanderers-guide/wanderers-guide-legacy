const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Character = db.define('characters', {
  userID: {
    type: Sequelize.INTEGER
  },
  buildID: {
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
  classID_2: {
    type: Sequelize.INTEGER
  },
  inventoryID: {
    type: Sequelize.INTEGER
  },
  notes: {
    type: Sequelize.TEXT
  },
  infoJSON: {
    type: Sequelize.STRING
  },
  rollHistoryJSON: {
    type: Sequelize.STRING
  },
  details: {
    type: Sequelize.TEXT
  },
  customCode: {
    type: Sequelize.STRING
  },
  dataID: {
    type: Sequelize.INTEGER
  },
  currentStamina: {
    type: Sequelize.INTEGER
  },
  currentResolve: {
    type: Sequelize.INTEGER
  },
  builderByLevel: {
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
  optionCustomCodeBlock: {
    type: Sequelize.INTEGER
  },
  optionDiceRoller: {
    type: Sequelize.INTEGER
  },
  optionClassArchetypes: {
    type: Sequelize.INTEGER
  },
  optionIgnoreBulk: {
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
  variantStamina: {
    type: Sequelize.INTEGER
  },
  variantAutoBonusProgression: {
    type: Sequelize.INTEGER
  },
  variantGradualAbilityBoosts: {
    type: Sequelize.INTEGER
  },
  // Character Enabled Sources //
  enabledSources: {
    type: Sequelize.STRING
  },
  // Character Enabled Homebrew //
  enabledHomebrew: {
    type: Sequelize.STRING
  }
});

module.exports = Character;