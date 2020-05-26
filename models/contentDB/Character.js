const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Character = db.define('characters', {
  userID: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  level: {
    type: Sequelize.INTEGER
  },
  experience: {
    type: Sequelize.INTEGER
  },
  currentHealth: {
    type: Sequelize.INTEGER
  },
  tempHealth: {
    type: Sequelize.INTEGER
  },
  heroPoints: {
    type: Sequelize.INTEGER
  },
  ancestryID: {
    type: Sequelize.INTEGER
  },
  heritageID: {
    type: Sequelize.INTEGER
  },
  backgroundID: {
    type: Sequelize.INTEGER
  },
  classID: {
    type: Sequelize.INTEGER
  },
  inventoryID: {
    type: Sequelize.INTEGER
  },
  charTags: {
    type: Sequelize.STRING
  },
  notes: {
    type: Sequelize.TEXT
  },
  details: {
    type: Sequelize.TEXT
  },
  dataID: {
    type: Sequelize.INTEGER
  }
});

module.exports = Character;