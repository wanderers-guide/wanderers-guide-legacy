const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const Inventory = db.define("inventories", {
  equippedArmorInvItemID: {
    type: Sequelize.INTEGER,
  },
  equippedShieldInvItemID: {
    type: Sequelize.INTEGER,
  },
  equippedArmorCategory: {
    type: Sequelize.ENUM,
    values: ["UNARMORED", "LIGHT", "MEDIUM", "HEAVY"],
  },
});

module.exports = Inventory;
