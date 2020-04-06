const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Condition = db.define('conditions', {
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  hasValue: {
    type: Sequelize.INTEGER
  },
  code: {
    type: Sequelize.TEXT
  }
});

module.exports = Condition;