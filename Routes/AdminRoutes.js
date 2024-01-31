const express = require("express")
const AdminRouter = express.Router();
const AdminController= require("../Controller/AdminController")



AdminRouter.get('/users',(AdminController.getAllusers))
AdminRouter.get('/posts',(AdminController.getAllposts))


module.exports = AdminRouter