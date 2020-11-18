const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const CalculatedStat = db.define('calculatedStats', {
  charID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  maxHP: {
    type: Sequelize.INTEGER
  },
  totalClassDC: {
    type: Sequelize.INTEGER
  },
  totalSpeed: {
    type: Sequelize.INTEGER
  },
  totalAC: {
    type: Sequelize.INTEGER
  },
  totalPerception: {
    type: Sequelize.INTEGER
  },
  totalSkills: {
    type: Sequelize.STRING
  },
  totalSaves: {
    type: Sequelize.STRING
  },
  totalAbilityScores: {
    type: Sequelize.STRING
  },
  weapons: {
    type: Sequelize.STRING
  },
});

module.exports = CalculatedStat;