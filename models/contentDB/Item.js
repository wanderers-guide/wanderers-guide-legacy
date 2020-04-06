const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Item = db.define('items', {
  name: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.INTEGER
  },
  bulk: {
    type: Sequelize.DOUBLE
  },
  level: {
    type: Sequelize.INTEGER
  },
  rarity: {
    type: Sequelize.ENUM,
    values: ['COMMON', 'UNCOMMON', 'RARE', 'UNIQUE']
  },
  description: {
    type: Sequelize.TEXT
  },
  itemType: {
    type: Sequelize.ENUM,
    values: ['GENERAL', 'STORAGE', 'TOOL', 'ARMOR', 'KIT', 'INGREDIENT', 'INSTRUMENT', 'OTHER', 'WEAPON', 'RUNE', 'CURRENCY']
  },
  craftRequirements: {
    type: Sequelize.STRING
  },
  hands: {
    type: Sequelize.ENUM,
    values: ['NONE', 'ONE', 'ONE_PLUS', 'TWO']
  },
  size: {
    type: Sequelize.ENUM,
    values: ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'HUGE', 'GARGANTUAN']
  },
  isShoddy: {
    type: Sequelize.INTEGER
  },
  hasQuantity: {
    type: Sequelize.INTEGER
  },
  quantity: {
    type: Sequelize.INTEGER
  },
  hitPoints: {
    type: Sequelize.INTEGER
  },
  brokenThreshold: {
    type: Sequelize.INTEGER
  },
  hardness: {
    type: Sequelize.INTEGER
  },
  hidden: {
    type: Sequelize.INTEGER
  },
  code: {
    type: Sequelize.TEXT
  }
});

module.exports = Item;