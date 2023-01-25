const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const APIClientApp = db.define("apiClientApps", {
  userID: {
    type: Sequelize.INTEGER,
  },
  clientID: {
    type: Sequelize.STRING,
  },
  apiKey: {
    type: Sequelize.STRING,
  },
  appName: {
    type: Sequelize.STRING,
  },
  redirectURI: {
    type: Sequelize.STRING,
  },
  companyName: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  iconURL: {
    type: Sequelize.STRING,
  },
  accessRights: {
    type: Sequelize.ENUM,
    values: ["READ-ONLY", "READ-UPDATE", "READ-UPDATE-ADD-DELETE"],
  },
});

module.exports = APIClientApp;
