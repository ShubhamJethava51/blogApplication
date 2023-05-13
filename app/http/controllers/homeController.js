const mysql_con = require("../../config/db_config");

function homeController(){
    return{
        index(req, res){
            mysql_con.query("select name, population from city", async(err, result)=>{
                if(err) throw err;
                else if(result){
                    res.send(result);
                }
            })
        }
    }
}

module.exports = homeController;