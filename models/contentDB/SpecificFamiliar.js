const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const SpecificFamiliar = db.define('specificFamiliars', {
  specificType: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  alignment: {
    type: Sequelize.STRING
  },
  tagsJSON: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  numAbils: {
    type: Sequelize.INTEGER
  },
  abilsJSON: {
    type: Sequelize.STRING
  },
  extraAbils: {
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
  }
});

module.exports = SpecificFamiliar;