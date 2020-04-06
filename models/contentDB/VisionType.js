const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const VisionType = db.define('visionTypes', {
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  }
});

module.exports = VisionType;