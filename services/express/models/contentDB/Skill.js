const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const Skill = db.define("skills", {
  name: {
    type: Sequelize.STRING,
  },
  ability: {
    type: Sequelize.ENUM,
    values: ["STR", "DEX", "CON", "INT", "WIS", "CHA"],
  },
  description: {
    type: Sequelize.TEXT,
  },
});

module.exports = Skill;
