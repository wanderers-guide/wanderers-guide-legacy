const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Background = db.define('backgrounds', {
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
  boostOne: {// Can either be "Anything" or "Dexterity,Strength"
    type: Sequelize.STRING
  },
  boostTwo: {// Can either be "Anything" or "Dexterity,Strength"
    type: Sequelize.STRING
  },
  code: {
    type: Sequelize.TEXT
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

module.exports = Background;