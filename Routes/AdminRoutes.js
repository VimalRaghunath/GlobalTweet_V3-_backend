const express = require("express")
const AdminRouter = express.Router();
const AdminController= require("../Controller/AdminController")



AdminRouter.get('/users',(AdminController.getAllusers))
AdminRouter.get('/posts',(AdminController.getAllposts))
AdminRouter.get('/block/:id',(AdminController.BlocktheUser))
AdminRouter.get('/unblock/:id',(AdminController.unblockUser))


module.exports = AdminRouter