const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const HomeBackReport = db.define("homeBackReports", {
  userID: {
    type: Sequelize.INTEGER,
  },
  backgroundID: {
    type: Sequelize.INTEGER,
  },
  email: {
    type: Sequelize.STRING,
  },
  message: {
    type: Sequelize.STRING,
  },
});

module.exports = HomeBackReport;
