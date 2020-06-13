const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Weapon = db.define('weapons', {
  itemID: {
    type: Sequelize.INTEGER
  },
  diceNum: {
    type: Sequelize.INTEGER
  },
  dieType: {
    type: Sequelize.ENUM,
    values: ['', 'd2', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20']
  },
  damageType: {
    type: Sequelize.STRING
  },
  category: {
    type: Sequelize.ENUM,
    values: ['UNARMED', 'SIMPLE', 'MARTIAL', 'ADVANCED']
  },
  isMelee: {
    type: Sequelize.TINYINT
  },
  meleeWeaponType: {
    type: Sequelize.ENUM,
    values: ['SWORD', 'AXE', 'CLUB', 'FLAIL', 'POLEARM', 'PICK', 'KNIFE', 'SHIELD', 'HAMMER', 'SPEAR', 'BRAWLING', 'BOMB']
  },
  isRanged: {
    type: Sequelize.TINYINT
  },
  rangedWeaponType: {
    type: Sequelize.ENUM,
    values: ['DART', 'BOW', 'SLING']
  },
  rangedRange: {
    type: Sequelize.INTEGER
  },
  rangedReload: {
    type: Sequelize.INTEGER
  }
});

module.exports = Weapon;