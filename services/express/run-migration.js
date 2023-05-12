const mysql = require('mysql2')
require('dotenv').config()
const fs = require('fs')

const migrationScript = fs.readFileSync('WG-deb-db-1-28-23.sql', 'utf8')

const connection = mysql.createConnection({
  host: `${process.env.CLOUD_DB_HOST}`,
  user: `${process.env.CLOUD_SQL_USERNAME}`,
  password: `${process.env.CLOUD_SQL_PASSWORD}`
})

connection.query(migrationScript, (error, results, fields) => {
  if (error) {
    console.error(error.message)
    console.error(error.code)
  } else {
    console.log('Migration script executed successfully')
  }
})
