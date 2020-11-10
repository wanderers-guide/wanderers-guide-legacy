const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const AncestryLanguage = db.define('ancestryLanguages', {
  ancestryID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  langID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  isBonus: {
    type: Sequelize.TINYINT
  },
  homebrewID: {
    type: Sequelize.INTEGER
  },
});

module.exports = AncestryLanguage;