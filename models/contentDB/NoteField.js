const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const NoteField = db.define('noteFields', {
  charID: {
    type: Sequelize.INTEGER
  },
  placeholderText: {
    type: Sequelize.TEXT
  },
  text: {
    type: Sequelize.TEXT
  }
});

module.exports = NoteField;