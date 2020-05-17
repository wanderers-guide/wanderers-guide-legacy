const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const PhysicalFeature = db.define('physicalFeatures', {
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  code: {
    type: Sequelize.TEXT
  },
  itemWeaponID: {
    type: Sequelize.INTEGER
  },
  overrides: {
    type: Sequelize.INTEGER
  }
});

module.exports = PhysicalFeature;