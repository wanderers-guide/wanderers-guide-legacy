const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const CharFamiliar = db.define("charFamiliars", {
  charID: {
    type: Sequelize.INTEGER,
  },
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
  },
  imageURL: {
    type: Sequelize.STRING,
  },
  currentHP: {
    type: Sequelize.INTEGER,
  },
  abilitiesJSON: {
    type: Sequelize.STRING,
  },
  specificType: {
    type: Sequelize.STRING,
  },
});

module.exports = CharFamiliar;
