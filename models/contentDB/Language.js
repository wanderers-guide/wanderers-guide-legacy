const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Language = db.define('languages', {
  name: {
    type: Sequelize.STRING,
  },
  speakers: {
    type: Sequelize.STRING,
  },
  script: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
  }
});

module.exports = Language;