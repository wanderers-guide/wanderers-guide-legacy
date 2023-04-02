const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const BuildDataMapping = db.define("buildDataMappings", {
  buildID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  source: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  sourceType: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  sourceLevel: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  sourceCode: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  sourceCodeSNum: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  value: {
    type: Sequelize.STRING,
  },
});

module.exports = BuildDataMapping;
