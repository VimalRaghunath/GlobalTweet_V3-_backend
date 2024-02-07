const express = require("express")
const UserRouter = express.Router();
const UserController = require("../Controller/UserController");
const Trycatch = require("../Middleware/tryCatchMiddleware");
const Auth = require("../Middleware/userAuthentication");



UserRouter.post('/createanaccount',Trycatch(UserController.createuser))
UserRouter.post('/',Trycatch(UserController.signin))
// UserRouter.post('/googlelogin',UserController.googlesignin)
UserRouter.get('/profile',Auth,UserController.profile)
UserRouter.post('/newpost',Auth,UserController.post)
UserRouter.get('/post',Trycatch(UserController.getAllPost))
UserRouter.get('/profileposts',Auth,UserController.profileposts)
UserRouter.get('/explore',Trycatch(UserController.Explore))
UserRouter.put('/editprofile',Trycatch(UserController.Editprofile))
UserRouter.put('/editavatar',Trycatch(UserController.EditAvatar))
UserRouter.get('/allusers',Trycatch(UserController.Getallusers))
UserRouter.put('/editcoverphoto',Trycatch(UserController.Editcoverphoto))
UserRouter.get('/getuserbyid/:id',Auth,(UserController.getUserById))
UserRouter.get('/allpostsbyid/:id',Trycatch(UserController.AllpostsById))
UserRouter.post('/like',Trycatch(UserController.setLike))
UserRouter.post('/comment',Trycatch(UserController.setComment))
UserRouter.get('/getcomment/:id',Trycatch(UserController.getComment))
UserRouter.post('/follow/:id',Auth,Trycatch(UserController.followUser))
UserRouter.post('/unfollow/:id',Auth,Trycatch(UserController.unfollowUser))
UserRouter.get('/followerscount/:id',Auth, UserController.getFollowersCount)
UserRouter.get('/followingcount/:id',Auth, UserController.getFollowingCount)
UserRouter.get('/followers/:id',Auth,Trycatch(UserController.getFollowers))
UserRouter.get('/following/:id',Auth,Trycatch(UserController.getFollowing))
UserRouter.post('/chat',Auth,Trycatch(UserController.ChatUser))
UserRouter.get('/chat/fetchchats',Auth,Trycatch(UserController.fetchChats))
UserRouter.post('/chat/group',Auth,Trycatch(UserController.createGroupChats))
UserRouter.put('/chat/rename',Auth,Trycatch(UserController.renameGroup))
UserRouter.put('/chat/groupadd',Auth,Trycatch(UserController.addToGroup))
UserRouter.put('/chat/groupremove',Auth,Trycatch(UserController.removeFromGroup))





module.exports = UserRouter