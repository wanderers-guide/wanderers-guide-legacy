const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Background = db.define('backgrounds', {
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  boostOne: {// Can either be "Anything" or "Dexterity,Strength"
    type: Sequelize.STRING
  },
  boostTwo: {// Can either be "Anything" or "Dexterity,Strength"
    type: Sequelize.STRING
  },
  code: {
    type: Sequelize.TEXT
  }
});

module.exports = Background;