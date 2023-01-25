const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const SheetState = db.define("sheetStates", {
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
  },
  code: {
    type: Sequelize.TEXT,
  },
  contentSrc: {
    type: Sequelize.STRING,
  },
  homebrewID: {
    type: Sequelize.INTEGER,
  },
});

module.exports = SheetState;
