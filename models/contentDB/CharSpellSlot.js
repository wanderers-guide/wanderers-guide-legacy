const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const CharSpellSlot = db.define('charSpellSlot', {
  charID: {
    type: Sequelize.INTEGER
  },
  cantrip: {
    type: Sequelize.STRING
  },
  firstLevel: {
    type: Sequelize.STRING
  },
  secondLevel: {
    type: Sequelize.STRING
  },
  thirdLevel: {
    type: Sequelize.STRING
  },
  fourthLevel: {
    type: Sequelize.STRING
  },
  fifthLevel: {
    type: Sequelize.STRING
  },
  sixthLevel: {
    type: Sequelize.STRING
  },
  seventhLevel: {
    type: Sequelize.STRING
  },
  eighthLevel: {
    type: Sequelize.STRING
  },
  ninthLevel: {
    type: Sequelize.STRING
  },
  tenthLevel: {
    type: Sequelize.STRING
  }
});

module.exports = CharSpellSlot;