const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const Armor = db.define("armors", {
  itemID: {
    type: Sequelize.INTEGER,
  },
  profName: {
    type: Sequelize.STRING,
  },
  acBonus: {
    type: Sequelize.INTEGER,
  },
  dexCap: {
    type: Sequelize.INTEGER,
  },
  checkPenalty: {
    type: Sequelize.INTEGER,
  },
  speedPenalty: {
    type: Sequelize.INTEGER,
  },
  minStrength: {
    type: Sequelize.INTEGER,
  },
  armorType: {
    type: Sequelize.ENUM,
    values: ["N/A", "CLOTH", "LEATHER", "COMPOSITE", "CHAIN", "PLATE"],
  },
  category: {
    type: Sequelize.ENUM,
    values: ["UNARMORED", "LIGHT", "MEDIUM", "HEAVY"],
  },
});

module.exports = Armor;
