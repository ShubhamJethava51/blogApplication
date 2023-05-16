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
            await mysql_con.query(`SELECT * FROM blogs WHERE id = ${req.params.id} AND uid = ${req.cookies.user.uid}`, (err, result)=>{
              if(err) throw err
                else if(result.length>0){
                  res.json(result);
                }
                else{
                  res.json({error: "No blog found."});
                }
            })
          }
        },
        singleBlogUpdate(req,res){
          if(!req.cookies.user){res.json({error: "User not logged in."})}
          else
          {
            mysql_con.query(`SELECT id FROM blogs WHERE id = ${req.params.id} AND uid = ${req.cookies.user.uid}`, (err, result)=>{
              //if blog which is being updated exist on current user's blog list
              if(err) req.send(err);
              else if(result.length>0){

                upload(req, res, (err)=>{
              
                  //if there is error in uploading image
                    if(err) req.send(err);
                    else if(!req.file){
                      //no file provided
                      if((!req.body.title) && (!req.body.description)){
                        //no information of blog is provided
                        res.json({error: "Nothing is changed"});
                      }
                      else{
                        //some info is changed
                        mysql_con.query(`UPDATE blogs SET ${(req.body.title && req.body.description)?`title = '${req.body.title}', description = '${req.body.description}'`: `${Object.keys(req.body)[0]} = '${Object.values(req.body)[0]}'`} WHERE id = ${req.params.id}`, (err, result)=>{
                          if(err) throw err
                            else if(result.affectedRows>0){
                              res.json({rowsUpdated: result.affectedRows});
                            }
                          })
                      }
                    }
                    else{
                      //file is provided
                      if((!req.body.title) && (!req.body.description)){
                        //no information of blog is provided
                        mysql_con.query(`UPDATE blogs SET image='${req.file.originalname}' WHERE id = ${req.params.id}`, (err, result)=>{
                          if(err) throw err
                            else if(result.affectedRows>0){
                              res.json({rowsUpdated: result.affectedRows});
                            }
                          })
                      }
                      else{
                        mysql_con.query(`UPDATE blogs SET image='${req.file.originalname}', ${(req.body.title && req.body.description)?`title = '${req.body.title}', description = '${req.body.description}'`: `${Object.keys(req.body)[0]} = '${Object.values(req.body)[0]}'`} WHERE id = ${req.params.id}`, (err, result)=>{
                          if(err) throw err
                            else if(result.affectedRows>0){
                              res.json({rowsUpdated: result.affectedRows});
                            }
                          }
                        )
                      }
                    }
                })  
              }
              else{
                res.json({error: 'Blog not found!'})
              }
            })
          }

        },
        deleteBlog(req, res){
          if(!req.cookies.user){res.json({error: "User not logged in."})}
          else
          {
            mysql_con.query(`SELECT id FROM blogs WHERE id = ${req.params.id} AND uid = ${req.cookies.user.uid}`, (err, result)=>{
              //if blog which is being deleted exist on current user's blog list
              if(err) req.send(err);
              else if(result.length>0){
                mysql_con.query(`DELETE FROM blogs where id = ${req.params.id}`, (err, result)=>{
                  if(err) req.send(err);
                  else if(result){
                    res.json({deletedRows: result.affectedRows, success: "Deleted blog successfully."})
                  }
                });
              }
              else{
                res.json({error: "Blog not found!"})
              }
            })
          }

        },

        // changeBlogActive(req, res){
        //   if(!req.cookies.user){res.json({error: "User not logged in."})}
        //   else
        //   {
        //     mysql_con.query(`SELECT id FROM blogs WHERE id = ${req.params.id} AND uid = ${req.cookies.user.uid}`, (err, result)=>{
        //       //if blog which is being changed active exist on current user's blog list
        //       if(err) req.send(err);
        //       else if(result.length>0){

        //       }
        //     })
        //   }
        // }
    }
}

module.exports = blogController;