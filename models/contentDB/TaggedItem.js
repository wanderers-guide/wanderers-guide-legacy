const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const TaggedItem = db.define('taggedItems', {
  itemID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  tagID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  tagDetails: {
    type: Sequelize.STRING
  }
});

module.exports = TaggedItem;