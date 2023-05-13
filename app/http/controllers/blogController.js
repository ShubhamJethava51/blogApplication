const multer = require('multer');
const path = require('path');
const mysql_con = require('../../config/db_config');

const multerStorage = multer.diskStorage({
  //setting up storage for multer
    destination: (req, res, cb)=>{
      cb(null, path.join(__dirname, "../../../public/img/"))
    },

  //file name
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  //telling multer, what field to be expected as image field
  const upload = multer({
    storage: multerStorage,
  }).single("image");


function blogController(){
    return{
        async createBlog(req, res){
          //check if user is logged in if not give error
          if(!req.cookies.user){res.json({error: "User not logged in."})}
          else
          {
            await upload(req, res, (err)=>{
              
              //if there is error in uploading image
                if(err) req.send(err);

                //image, title or description validation
                else if(!req.file || (!req.body.title||req.body.title == "") || (!req.body.description||req.body.description == "")){
                  res.json({error: "Title, Description or Image is not valid."})
                }
                else{
                  //everything goes as planned
                    mysql_con.query(`INSERT INTO blogs (title, description, image, uid) VALUES('${req.body.title}', '${req.body.description}', '${req.file.originalname}', ${req.cookies.user.uid})`, (err, result)=>{
                    if(err) throw err
                    //if row got inserted
                    else if(result.affectedRows>0){
                      res.json({inserted: result.affectedRows, message: "Blog created successfully!"});
                    }
                  // res.json({file:req.file, body: req.body});
                  })
                }
            })
          }
        },
        async allBlogs(req, res){
          //check if user is logged in if not give error
          if(!req.cookies.user){res.json({error: "User not logged in."})}
          else
          {
            await mysql_con.query(`SELECT * FROM blogs where uid = ${req.cookies.user.uid}`, (err, result)=>{
              if(err) throw err
              else if(result.length>0){
                res.json(result);
              }
              else{
                res.json({error: "No blogs found."});
              }
            })
          }
        },
        async singleBlog(req, res){
          //check if user is logged in if not give error
          if(!req.cookies.user){res.json({error: "User not logged in."})}
          else
          {
            await mysql_con.query(`SELECT * FROM blogs WHERE id = ${req.params.id}`, (err, result)=>{
              if(err) throw err
                else if(result.length>0){
                  res.json(result);
                }
                else{
                  res.json({error: "No blog found."});
                }
            })
          }
        }
    }
}

module.exports = blogController;