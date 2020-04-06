const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const FeatTag = db.define('featTags', {
  featID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  tagID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  }
});

module.exports = FeatTag;