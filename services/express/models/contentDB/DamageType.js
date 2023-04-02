const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const DamageType = db.define("damageTypes", {
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
  },
});

module.exports = DamageType;
