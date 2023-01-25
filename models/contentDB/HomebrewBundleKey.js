const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const HomebrewBundleKey = db.define("homebrewBundleKeys", {
  homebrewID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  keyCode: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  isOneTimeUse: {
    type: Sequelize.INTEGER,
  },
});

module.exports = HomebrewBundleKey;
