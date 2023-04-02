const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const AccessToken = db.define("accessTokens", {
  accessToken: {
    type: Sequelize.STRING,
  },
  clientID: {
    type: Sequelize.STRING,
  },
  charID: {
    type: Sequelize.INTEGER,
  },
  accessRights: {
    type: Sequelize.ENUM,
    values: ["READ-ONLY", "READ-UPDATE", "READ-UPDATE-ADD-DELETE"],
  },
});

module.exports = AccessToken;
