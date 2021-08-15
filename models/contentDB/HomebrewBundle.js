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
  code: {
    type: Sequelize.TEXT
  },
  hasKeys: {
    type: Sequelize.INTEGER
  },
  isPublished: {
    type: Sequelize.INTEGER
  },
  authorName: {
    type: Sequelize.STRING
  },
});

module.exports = HomebrewBundle;