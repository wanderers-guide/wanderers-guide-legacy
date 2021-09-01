const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const ClassArchetype = db.define('classArchetypes', {
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  replacementCodeJSON: {
    type: Sequelize.STRING
  },
  dedicationFeatName: {
    type: Sequelize.STRING
  },
  contentSrc: {
    type: Sequelize.STRING
  },
  homebrewID: {
    type: Sequelize.INTEGER
  }
});

module.exports = ClassArchetype;