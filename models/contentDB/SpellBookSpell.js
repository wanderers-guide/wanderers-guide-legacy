const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const SpellBookSpell = db.define("spellBookSpells", {
  spellSRC: {
    type: Sequelize.STRING,
  },
  charID: {
    type: Sequelize.INTEGER,
  },
  spellID: {
    type: Sequelize.INTEGER,
  },
  spellLevel: {
    type: Sequelize.INTEGER,
  },
  spellType: {
    type: Sequelize.STRING,
  },
  srcStructHashed: {
    type: Sequelize.INTEGER,
  },
});

module.exports = SpellBookSpell;
