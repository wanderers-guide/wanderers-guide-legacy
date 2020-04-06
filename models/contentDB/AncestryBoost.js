const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const AncestryBoost = db.define('ancestryBoosts', {
  ancestryID: {
    type: Sequelize.INTEGER
  },
  boostedAbility: {
    type: Sequelize.ENUM,
    values: ['Anything','Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma']
  }
});

module.exports = AncestryBoost;