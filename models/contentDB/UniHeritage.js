const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const UniHeritage = db.define('uniHeritages', {
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  tagID: {
    type: Sequelize.INTEGER
  },
  code: {
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

module.exports = UniHeritage;