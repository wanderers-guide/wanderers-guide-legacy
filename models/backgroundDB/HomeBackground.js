const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const HomeBackground = db.define('homeBackgrounds', {
  name: {
    type: Sequelize.STRING
  },
  artworkURL: {
    type: Sequelize.STRING
  },
  artistPage: {
    type: Sequelize.STRING
  }
});

module.exports = HomeBackground;