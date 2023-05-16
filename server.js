const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const mysql_con = require("./app/config/db_config");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//mysql connection configuration
mysql_con.connect((err)=>{
    if(err) throw err
    else{
        console.log("Database connected!")
    }
})

//routing
require("./routes/web.js")(app)

//server configuration
app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
})