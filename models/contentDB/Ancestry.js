const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Ancestry = db.define('ancestries', {
  name: {
    type: Sequelize.STRING
  },
  rarity: {
    type: Sequelize.ENUM,
    values: ['COMMON', 'UNCOMMON', 'RARE', 'UNIQUE']
  },
  hitPoints: {
    type: Sequelize.INTEGER
  },
  size: {
    type: Sequelize.ENUM,
    values: ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'HUGE', 'GARGANTUAN']
  },
  speed: {
    type: Sequelize.INTEGER
  },
  description: {
    type: Sequelize.TEXT
  },
  visionSenseID: {
    type: Sequelize.INTEGER
  },
  additionalSenseID: {
    type: Sequelize.INTEGER
  },
  physicalFeatureOneID: {
    type: Sequelize.INTEGER
  },
  physicalFeatureTwoID: {
    type: Sequelize.INTEGER
  },
  tagID: {
    type: Sequelize.INTEGER
  },
  artworkURL: {
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

module.exports = Ancestry;