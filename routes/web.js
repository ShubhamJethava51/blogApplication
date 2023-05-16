const express = require("express");
const path = require("path");

const homeController = require("../app/http/controllers/homeController.js")
const blogController = require("../app/http/controllers/blogController.js")
const authController = require("../app/http/controllers/authController.js")

async function initRoutes(app){
    app.get("/", homeController().index);
    app.get("/login", authController().login);
    app.get("/logout", authController().logout);
    app.post("/createUser", await authController().postRegister)
    app.post("/loginUser", await authController().postLogin)

    app.post("/createBlog", blogController().createBlog);
    app.get("/myBlogs", blogController().allBlogs);
    app.get("/myBlogs/:id", blogController().singleBlog);
    // app.put("/updateBlog/:id", blogController().singleBlogUpdate)
    // app.post("/deleteBlog/:id", blogController().deleteBlog)

    
}

module.exports = initRoutes;