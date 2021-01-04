const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const User = db.define('users', {
  googleID: {
    type: Sequelize.STRING,
  },
  username: {
    type: Sequelize.STRING
  },
  thumbnail: {
    type: Sequelize.STRING
  },
  isPatreonSupporter: {
    type: Sequelize.TINYINT
  },
  isPatreonMember: {
    type: Sequelize.TINYINT
  },
  isPatreonLegend: {
    type: Sequelize.TINYINT
  },
  isAdmin: {
    type: Sequelize.TINYINT
  },
  isDeveloper: {
    type: Sequelize.TINYINT
  },
  patreonUserID: {
    type: Sequelize.INTEGER
  },
  patreonFullName: {
    type: Sequelize.STRING
  },
  patreonEmail: {
    type: Sequelize.STRING
  },
  patreonAccessToken: {
    type: Sequelize.STRING
  }
});

module.exports = User;