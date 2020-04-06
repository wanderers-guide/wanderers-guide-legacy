const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const AncestryFlaw = db.define('ancestryFlaws', {
  ancestryID: {
    type: Sequelize.INTEGER
  },
  flawedAbility: {
    type: Sequelize.ENUM,
    values: ['Anything','Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma']
  }
});

module.exports = AncestryFlaw;