const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const InnateSpellCasting = db.define("innateSpellCastings", {
  innateSpellID: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  timesCast: {
    type: Sequelize.INTEGER,
  },
});

module.exports = InnateSpellCasting;
