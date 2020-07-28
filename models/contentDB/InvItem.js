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
  isInvested: {
    type: Sequelize.INTEGER
  },
  bagInvItemID: {
    type: Sequelize.INTEGER
  },
  itemRuneData: { // Injected with object data in CharGathering
    type: Sequelize.INTEGER
  }
});

module.exports = InvItem;