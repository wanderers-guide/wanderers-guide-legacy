const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const Archetype = db.define("archetypes", {
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
  },
  dedicationFeatID: {
    type: Sequelize.INTEGER,
  },
  isMulticlass: {
    type: Sequelize.INTEGER,
  },
  tagID: {
    type: Sequelize.INTEGER,
  },
  isArchived: {
    type: Sequelize.INTEGER,
  },
  contentSrc: {
    type: Sequelize.STRING,
  },
  homebrewID: {
    type: Sequelize.INTEGER,
  },
  version: {
    type: Sequelize.STRING,
  },
});

module.exports = Archetype;
