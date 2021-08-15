const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Book = db.define('books', {
  codeName: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  code: {
    type: Sequelize.TEXT
  },
});

module.exports = Book;