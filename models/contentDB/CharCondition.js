const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const CharCondition = db.define('charConditions', {
  charID: {
    type: Sequelize.INTEGER,
  },
  conditionID: {
    type: Sequelize.INTEGER,
  },
  value: {
    type: Sequelize.INTEGER
  },
  sourceText: {
    type: Sequelize.STRING
  },
  parentID: {
    type: Sequelize.INTEGER
  },
});

module.exports = CharCondition;