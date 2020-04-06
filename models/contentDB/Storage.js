const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Storage = db.define('storages', {
  itemID: {
    type: Sequelize.INTEGER
  },
  maxBulkStorage: {
    type: Sequelize.DOUBLE
  },
  bulkIgnored: {
    type: Sequelize.DOUBLE
  },
  ignoreSelfBulkIfWearing: {
    type: Sequelize.INTEGER
  }
});

module.exports = Storage;