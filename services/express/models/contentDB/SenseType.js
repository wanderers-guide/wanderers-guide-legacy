const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const SenseType = db.define("senseTypes", {
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
  },
  isVisionType: {
    type: Sequelize.INTEGER,
  },
  visionPrecedence: {
    type: Sequelize.INTEGER,
  },
});

module.exports = SenseType;
