const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Extra = db.define('extras', {
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
  size: {
    type: Sequelize.ENUM,
    values: ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'HUGE', 'GARGANTUAN']
  },
  description: {
    type: Sequelize.TEXT
  },
  type: {
    type: Sequelize.STRING
  },
  contentSrc: {
    type: Sequelize.STRING
  },
  homebrewID: {
    type: Sequelize.INTEGER
  },
  isArchived: {
    type: Sequelize.INTEGER
  },
});

module.exports = Extra;