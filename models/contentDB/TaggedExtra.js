const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const TaggedExtra = db.define('taggedExtras', {
  extraID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  tagID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  }
});

module.exports = TaggedExtra;