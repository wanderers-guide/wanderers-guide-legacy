const Sequelize = require("sequelize");
const keys = require("../keys");

module.exports = new Sequelize(
  keys.contentDB.DbName,
  keys.cloudSQL.Username,
  keys.cloudSQL.Password,
  {
    host: keys.cloudSQL.Host,
    dialect: "mysql",
    port: keys.cloudSQL.Port,
    operatorsAliases: "0",
    logging: false, // console.log // false
    benchmark: true,
    dialectOptions: {
      socketPath: keys.cloudSQL.Instance,
      multipleStatements: true,
    },
    pool: {
      max: 90,
      min: 0,
      idle: 10000,
    },
    define: {
      "charset": "utf8mb4",
      "collate": "utf8mb4_unicode_ci"
    }
  },
);

/*
module.exports =  new Sequelize('mysql://doadmin:'+keys.cloudSQL.Password+'@db-mysql-sfo2-63519-do-user-7330312-0.a.db.ondigitalocean.com:25060/'+keys.contentDB.DbName+'?', {
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
});*/
