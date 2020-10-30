const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const ClassAbility = db.define('classAbilities', {
  classID: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  level: {
    type: Sequelize.INTEGER
  },
  description: {
    type: Sequelize.TEXT
  },
  code: {
    type: Sequelize.TEXT
  },
  selectType: {
    type: Sequelize.ENUM,
    values: ['NONE', 'SELECTOR', 'SELECT_OPTION']
  },
  selectOptionFor: {
    type: Sequelize.INTEGER
  },
  displayInSheet: {
    type: Sequelize.INTEGER
  },
  indivClassName: {
    type: Sequelize.STRING
  },
  indivClassAbilName: {
    type: Sequelize.STRING
  },
  isArchived: {
    type: Sequelize.INTEGER
  },
  contentSrc: {
    type: Sequelize.STRING
  },
  homebrewID: {
    type: Sequelize.INTEGER
  },
});

module.exports = ClassAbility;