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
  isMember: {
    type: Sequelize.TINYINT
  },
  isAdmin: {
    type: Sequelize.TINYINT
  }
});

module.exports = User;