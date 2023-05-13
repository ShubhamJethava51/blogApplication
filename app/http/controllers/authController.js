const mysql_con = require("../../config/db_config");
const bcrypt = require("bcryptjs");

function authController(){
    return{
        logout(req, res){
            if(req.cookies.user){
                res.clearCookie("user");
                res.end("User has been logged out.")
            }
            else{
                res.json({error: "User not logged in."})
            }
        },

        login(req,res){
            if(!req.cookies.user){
                res.json({error: "No user."})
            }
            else{
                res.send(req.cookies)
            }
        },

        //on post request from register form
        postRegister(req, res){
            if(req.cookies.user){
                res.json({error: "User already logged in."})
            }else{

                //get email and password as "Npassword" (password is going to be used to store hashed password)
                const {email, password:Npassword} = req.body;
    
                //check if any field is missing or empty
                if(!email || !Npassword || email=="" || Npassword==""){
                    res.json({error: "Please enter your email and password"});
                }else{
                    //check if user already registered with the email
                    mysql_con.query(`SELECT email FROM users WHERE email = "${email}"`, async (err, result)=>{
                        if(err) throw err
                        else if(result.length>0){
                            //if user exist then give error
                            res.json({error: "User already registered with this email", userCount: result.length});
                        }
                        else{
                            //hash password (encrypt it)
                            const password = await bcrypt.hash(Npassword, 8);
                            /* bcrypt.compare(Npassword, password, (err, success)=>{
                                    res.json({"s": success});
                                });
                            console.log(password);
                            */
    
                            //insert into user table
                            mysql_con.query(`INSERT INTO users (email, password) VALUES("${email}", "${password}")`, (err, result)=>{
                                if(err) throw err
                                else if(result){
                                    //user got registered
                                    res.json({message: "User created successfully"});
                                }else{
                                    //some error
                                    res.json({error: "Something got wrong"});
                                }
                            })
                        }
                    })
                }
            }
        },
        postLogin(req, res){
            if(req.cookies.user){
                res.json({error: "User already logged in."})
            }else{
                const {email, password} = req.body;
                if(!email || !password || email=="" || password==""){
                    res.json({error: "Please enter your email and password"});
                }else{
                    //check if user already registered with the email
                    mysql_con.query(`SELECT * FROM users WHERE email = "${email}"`, async (err, result)=>{
                        if(err) throw err
                        else if(result.length>0){
                            //if user exist then check if password is valid
                            bcrypt.compare(password, result[0].password, (err, success)=>{
                                if(success){
                                    delete result[0].password;
                                    res.cookie("user", {...result[0]}, {maxAge: 1000 * 60 * 60 * 24});
                                    res.json({success: "Login Successful!"});
                                }
                                else if(err){
                                    res.json({error: `Something went wrong. ${err}`});
                                }
                                else{
                                    res.json({error: "Invalid E-mail or Password."});
                                }
                            });
                        }else{
                            //user doesn't exist
                            res.json({error: "Invalid E-mail or Password."})
                        }
                    })
                }
            }
        }
    }
}

module.exports = authController;