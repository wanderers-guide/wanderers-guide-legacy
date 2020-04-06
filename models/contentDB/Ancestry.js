const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Ancestry = db.define('ancestries', {
  name: {
    type: Sequelize.STRING
  },
  hitPoints: {
    type: Sequelize.INTEGER
  },
  size: {
    type: Sequelize.ENUM,
    values: ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'HUGE', 'GARGANTUAN']
  },
  speed: {
    type: Sequelize.INTEGER
  },
  description: {
    type: Sequelize.TEXT
  },
  visionTypeID: {
    type: Sequelize.INTEGER
  }
});

module.exports = Ancestry;