const Sequelize = require('sequelize');
const keys = require('../keys');

module.exports =  new Sequelize(keys.backgroundDB.DbName, keys.cloudSQL.Username, keys.cloudSQL.Password, {
  host: keys.cloudSQL.Host,
  dialect: 'mysql',
  operatorsAliases: '0',
  logging: false,
  dialectOptions: {
    socketPath: keys.cloudSQL.Instance,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});