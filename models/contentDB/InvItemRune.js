const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const InvItemRune = db.define('invItemRunes', {
  invItemID: {
    type: Sequelize.INTEGER,
  },
  fundRuneID: {
    type: Sequelize.INTEGER,
  },
  fundPotencyRuneID: {
    type: Sequelize.INTEGER,
  },
  propRune1ID: {
    type: Sequelize.INTEGER,
  },
  propRune2ID: {
    type: Sequelize.INTEGER,
  },
  propRune3ID: {
    type: Sequelize.INTEGER,
  },
  propRune4ID: {
    type: Sequelize.INTEGER,
  },
});

module.exports = InvItemRune;