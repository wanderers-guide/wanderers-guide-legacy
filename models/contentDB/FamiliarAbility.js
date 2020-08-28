const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const FamiliarAbility = db.define('familiarAbilities', {
  name: {
    type: Sequelize.STRING
  },
  prerequisites: {
    type: Sequelize.STRING
  },
  requirements: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  code: {
    type: Sequelize.STRING
  },
  isMaster: {
    type: Sequelize.INTEGER
  },
  contentSrc: {
    type: Sequelize.STRING
  },
  homebrewID: {
    type: Sequelize.INTEGER
  }
});

module.exports = FamiliarAbility;