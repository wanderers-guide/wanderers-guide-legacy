const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const CharAnimalCompanion = db.define("charAnimalCompanions", {
  charID: {
    type: Sequelize.INTEGER,
  },
  animalCompanionID: {
    type: Sequelize.INTEGER,
  },
  age: {
    type: Sequelize.STRING,
  },
  specialization: {
    type: Sequelize.STRING,
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
});

module.exports = CharAnimalCompanion;
