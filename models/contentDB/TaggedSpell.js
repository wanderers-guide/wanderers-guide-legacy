const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const TaggedSpell = db.define("taggedSpells", {
  spellID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  tagID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
});

module.exports = TaggedSpell;
