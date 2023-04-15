const Sequelize = require("sequelize");
const db = require("../../config/databases/content-database");

const CalculatedStat = db.define("calculatedStats", {
  charID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  maxHP: {
    type: Sequelize.INTEGER,
  },
  maxStamina: {
    type: Sequelize.INTEGER,
  },
  maxResolve: {
    type: Sequelize.INTEGER,
  },
  totalClassDC: {
    type: Sequelize.INTEGER,
  },
  classDCProfMod: {
    type: Sequelize.INTEGER,
  },
  totalSpeed: {
    type: Sequelize.INTEGER,
  },
  totalAC: {
    type: Sequelize.INTEGER,
  },
  totalPerception: {
    type: Sequelize.INTEGER,
  },
  perceptionProfMod: {
    type: Sequelize.INTEGER,
  },
  arcaneSpellProfMod: {
    type: Sequelize.INTEGER,
  },
  arcaneSpellAttack: {
    type: Sequelize.INTEGER,
  },
  arcaneSpellDC: {
    type: Sequelize.INTEGER,
  },
  divineSpellProfMod: {
    type: Sequelize.INTEGER,
  },
  divineSpellAttack: {
    type: Sequelize.INTEGER,
  },
  divineSpellDC: {
    type: Sequelize.INTEGER,
  },
  occultSpellProfMod: {
    type: Sequelize.INTEGER,
  },
  occultSpellAttack: {
    type: Sequelize.INTEGER,
  },
  occultSpellDC: {
    type: Sequelize.INTEGER,
  },
  primalSpellProfMod: {
    type: Sequelize.INTEGER,
  },
  primalSpellAttack: {
    type: Sequelize.INTEGER,
  },
  primalSpellDC: {
    type: Sequelize.INTEGER,
  },
  unarmedProfMod: {
    type: Sequelize.INTEGER,
  },
  simpleWeaponProfMod: {
    type: Sequelize.INTEGER,
  },
  martialWeaponProfMod: {
    type: Sequelize.INTEGER,
  },
  advancedWeaponProfMod: {
    type: Sequelize.INTEGER,
  },
  totalSkills: {
    type: Sequelize.TEXT,
  },
  totalSaves: {
    type: Sequelize.TEXT,
  },
  totalAbilityScores: {
    type: Sequelize.TEXT,
  },
  weapons: {
    type: Sequelize.TEXT,
  },
  conditions: {
    type: Sequelize.TEXT,
  },
  generalInfo: {
    type: Sequelize.TEXT,
  },
});

module.exports = CalculatedStat;
