const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const UserHomebrewBundle = db.define("userHomebrewBundles", {
  userID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  homebrewID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
});

module.exports = UserHomebrewBundle;
