const mysql_con = require("../../config/db_config");

function homeController(){
    return{
        index(req, res){
            res.json({message: "You are at the ROOT!"})
        }
    }
}

module.exports = homeController;