const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Tag = db.define('tags', {
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  isArchived: {
    type: Sequelize.INTEGER
  }
});

module.exports = Tag;