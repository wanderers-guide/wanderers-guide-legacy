const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Domain = db.define('domains', {
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  initialSpellID: {
    type: Sequelize.INTEGER
  },
  advancedSpellID: {
    type: Sequelize.INTEGER
  },
  contentSrc: {
    type: Sequelize.STRING
  },
  homebrewID: {
    type: Sequelize.INTEGER
  }
});

module.exports = Domain;