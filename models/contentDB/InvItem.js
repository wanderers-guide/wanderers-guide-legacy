const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const InvItem = db.define('invItems', {
  invID: {
    type: Sequelize.INTEGER,
  },
  itemID: {
    type: Sequelize.INTEGER,
  },
  name: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.INTEGER
  },
  bulk: {
    type: Sequelize.DOUBLE
  },
  description: {
    type: Sequelize.TEXT
  },
  size: {
    type: Sequelize.ENUM,
    values: ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'HUGE', 'GARGANTUAN']
  },
  quantity: {
    type: Sequelize.INTEGER
  },
  isShoddy: {
    type: Sequelize.INTEGER
  },
  isDropped: {
    type: Sequelize.INTEGER
  },
  currentHitPoints: {
    type: Sequelize.INTEGER
  },
  hitPoints: {
    type: Sequelize.INTEGER
  },
  materialType: {
    type: Sequelize.STRING
  },
  brokenThreshold: {
    type: Sequelize.INTEGER
  },
  hardness: {
    type: Sequelize.INTEGER
  },
  code: {
    type: Sequelize.STRING
  },
  itemTags: {
    type: Sequelize.STRING
  },
  isInvested: {
    type: Sequelize.INTEGER
  },
  bagInvItemID: {
    type: Sequelize.INTEGER
  },
  itemIsWeapon: {
    type: Sequelize.INTEGER
  },
  itemWeaponDieType: {
    type: Sequelize.ENUM,
    values: ['', 'd2', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'NONE']
  },
  itemWeaponDamageType: {
    type: Sequelize.STRING
  },
  itemWeaponRange: {
    type: Sequelize.INTEGER
  },
  itemWeaponReload: {
    type: Sequelize.INTEGER
  },
  itemIsStorage: {
    type: Sequelize.INTEGER
  },
  itemStorageMaxBulk: {
    type: Sequelize.DOUBLE
  },
  fundRuneID: {
    type: Sequelize.INTEGER,
  },
  fundPotencyRuneID: {
    type: Sequelize.INTEGER,
  },
  propRune1ID: {
    type: Sequelize.INTEGER,
  },
  propRune2ID: {
    type: Sequelize.INTEGER,
  },
  propRune3ID: {
    type: Sequelize.INTEGER,
  },
  propRune4ID: {
    type: Sequelize.INTEGER,
  },
});

module.exports = InvItem;