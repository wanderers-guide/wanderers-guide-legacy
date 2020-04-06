const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Shield = db.define('shields', {
  itemID: {
    type: Sequelize.INTEGER
  },
  acBonus: {
    type: Sequelize.INTEGER
  },
  speedPenalty: {
    type: Sequelize.INTEGER
  }
});

module.exports = Shield;