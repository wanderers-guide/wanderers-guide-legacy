const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const ItemRune = db.define("itemRunes", {
  itemID: {
    type: Sequelize.INTEGER,
  },
  isFundamental: {
    type: Sequelize.INTEGER,
  },
  etchedType: {
    type: Sequelize.ENUM,
    values: ["WEAPON", "ARMOR"],
  },
});

module.exports = ItemRune;
