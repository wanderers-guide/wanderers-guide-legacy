const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const HomebrewBundle = db.define('homebrewBundles', {
  userID: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  contactInfo: {
    type: Sequelize.STRING
  },
  isPublished: {
    type: Sequelize.INTEGER
  },
});

module.exports = HomebrewBundle;