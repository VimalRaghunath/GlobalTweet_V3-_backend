const express = require("express")
const AdminRouter = express.Router();
const AdminController= require("../Controller/AdminController")



AdminRouter.get('/users',(AdminController.getAllusers))
AdminRouter.get('/posts',(AdminController.getAllposts))
AdminRouter.put('/block/:id',(AdminController.BlocktheUser))
AdminRouter.put('/unblock/:id',(AdminController.unblockUser))
AdminRouter.get('/blockedusers',(AdminController.BlockedUsers))


module.exports = AdminRouter