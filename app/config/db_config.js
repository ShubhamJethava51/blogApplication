const dotenv = require('dotenv').config();
const mysql = require('mysql');

const mysql_con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
})

module.exports = mysql_con;