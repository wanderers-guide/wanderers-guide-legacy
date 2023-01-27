const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const Build = db.define("builds", {
  userID: {
    type: Sequelize.INTEGER,
  },
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
  },
  contactInfo: {
    type: Sequelize.STRING,
  },
  isPublished: {
    type: Sequelize.INTEGER,
  },
  authorName: {
    type: Sequelize.STRING,
  },
  artworkURL: {
    type: Sequelize.STRING,
  },
  finalStatsJSON: {
    type: Sequelize.TEXT,
  },
  ancestryID: {
    type: Sequelize.INTEGER,
  },
  heritageID: {
    type: Sequelize.INTEGER,
  },
  uniHeritageID: {
    type: Sequelize.INTEGER,
  },
  backgroundID: {
    type: Sequelize.INTEGER,
  },
  classID: {
    type: Sequelize.INTEGER,
  },
  classID_2: {
    type: Sequelize.INTEGER,
  },
  customCode: {
    type: Sequelize.STRING,
  },
  // Character Options //
  optionCustomCodeBlock: {
    type: Sequelize.INTEGER,
  },
  optionClassArchetypes: {
    type: Sequelize.INTEGER,
  },
  // Character Variants //
  variantFreeArchetype: {
    type: Sequelize.INTEGER,
  },
  variantAncestryParagon: {
    type: Sequelize.INTEGER,
  },
  variantStamina: {
    type: Sequelize.INTEGER,
  },
  variantGradualAbilityBoosts: {
    type: Sequelize.INTEGER,
  },
  // Build Enabled Sources //
  enabledSources: {
    type: Sequelize.STRING,
  },
  // Build Enabled Homebrew //
  enabledHomebrew: {
    type: Sequelize.STRING,
  },
});

module.exports = Build;
