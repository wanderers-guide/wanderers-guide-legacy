const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Ancestry = db.define('ancestries', {
  name: {
    type: Sequelize.STRING
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
  tagID: {
    type: Sequelize.INTEGER
  },
  isArchived: {
    type: Sequelize.INTEGER
  },
  version: {
    type: Sequelize.STRING
  }
});

module.exports = Ancestry;