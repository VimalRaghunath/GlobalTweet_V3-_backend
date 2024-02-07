const bcrypt = require("bcrypt");
const { joiUserValidationSchema } = require("../Model/ValidationSchema");
const jwt = require("jsonwebtoken");
const UserSchemaa = require("../Model/UserSchemaa");
const PostSchema = require("../Model/PostSchema");
const { joiPostValidationSchema } = require("../Model/ValidationSchema");
const messageSchema = require("../Model/ChatSchema");
const comment = require("../Model/CommentSchema");
const CommentSchema = require("../Model/CommentSchema");
const ChatSchema = require("../Model/ChatSchema");
const { result, error } = require("@hapi/joi/lib/base");
const { json } = require("express");

module.exports = {
  //create a user with name,email,mobile,username,password (POST api/user/createanaccount)--------------

  createuser: async (req, res) => {
    const { value, error } = joiUserValidationSchema.validate(req.body);

    if (error) {
      return res.json(error.message);
    }

    const { name, email, mobile, username, password } = value;

    const existingUser = await UserSchemaa.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message:
          "This Username is already Exists. Please choose a different one.",
      });
    }

    await UserSchemaa.create({
      name,
      email,
      mobile,
      username,
      password,
    });
    res.status(200).json({
      status: "success",
      message: "user registration done",
    });
  },

  // user signin using username,password [POST api/user/ ]-----------------

  signin: async (req, res) => {
    const { value, error } = joiUserValidationSchema.validate(req.body);

    if (error) {
      return res.json(error.message);
    }

    const { email, password } = value;

    const User = await UserSchemaa.findOne({ email, password });

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email: email },
        process.env.ADMIN_ACCESS_TOKEN_SECRET
      );
      return res.status(200).json({
        status: "admin_success",
        message: "admin Signin successful",
        data: token,
      });
    }

    if (User) {
      const token = jwt.sign(
        { id: User._id },
        process.env.USER_ACCESS_TOKEN_SECRET
      );
      const { password, ...rest } = User._doc;
      return res.status(200).json({
        status: "user_success",
        message: "user Signin successful",
        data: token,
        rest,
      });
    } else {
      return res.status(404).json({ error: "user not found" });
    }
  },

  // Signin using email [POST api/user/googlesignin]

  // post: async (req, res) => {
  //   const { title, description, image, category,likes} = req.body;
  //   console.log(image);
  //   console.log(res.token);
  //   const User = await PostSchema.create({
  //     userId: res.token,
  //     title: title,
  //     description: description,
  //     image: image,
  //     category: category,
  //     likes:likes

  //   });
  //   res.status(201).json({
  //     status: "success",
  //     message: "Post added successfully",
  //     data: User,
  //   });
  // },

  // create Post/feed of users [POST api/user/newpost]--------------------

  post: async (req, res) => {
    try {
      const { title, description, image, category, likes, comment } = req.body;

      const userPost = await PostSchema.create({
        userId: res.token,
        title: title,
        description: description,
        image: image,
        category: category,
        likes: likes,
        comment: comment,
      });

      res.status(201).json({
        status: "success",
        message: "Post added successfully",
        data: userPost,
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  // user Profile using username,password [GET api/user/profile ]-----------------

  profile: async (req, res) => {
    const userprofile = await UserSchemaa.findOne({ _id: res.token });
    const user = await PostSchema.find({});
    if (userprofile) {
      res.status(200).json({ userpro: userprofile, usersspro: user });
    } else {
      res.status(403).json("user not found");
    }
  },

  // showing all posts in the home to the user [GET api/user/post]---------------------------

  getAllPost: async (req, res) => {
    const post = await PostSchema.find().populate("userId");
    if (!post) {
      return res.status(404).json({ error: "No Posts Found" });
    }
    return res.status(200).json({
      status: "success",
      message: "post successfully fetched",
      data: post,
    });
  },

  // showing posts in specific profile [GET api/user/profile/:id]----------------------------

  profileposts: async (req, res) => {
    const userprofile = await UserSchemaa.findOne({ _id: res.token });

    if (!userprofile) {
      res.status(404).json({ status: "error", message: "user not found" });
    }

    const post = await PostSchema.find({ userId: res.token });
    if (!post) {
      return res.status(404).json({ error: "No Posts Found" });
    }
    res.status(200).json({
      status: "success",
      message: "post successfully fetched",
      data: post,
    });
  },

  // explore/search option [GET api/user?explore]--------------------

  Explore: async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await UserSchemaa.find(keyword).find({
      _id: { $ne: res.user },
    });
    res.send(users);
  },

  // Editprofile of user [PUT api/user/editprofile]------------------------

  Editprofile: async (req, res) => {
    const { name, username, Bio } = req.body;
    const editprofile = UserSchemaa.findOne({ _id: res.token });
    if (editprofile) {
      await UserSchemaa.findByIdAndUpdate(res.token, {
        $set: {
          username: username,
          name: name,
          bio: Bio,
        },
      });
      res.status(200).json("Successful");
    } else {
      res.status(404).json("error");
    }
  },

  EditAvatar: async (req, res) => {
    const { avatar, id } = req.body;

    const editavatar = UserSchemaa.findOne({ _id: id });
    if (editavatar) {
      await UserSchemaa.findByIdAndUpdate(id, {
        $set: {
          Avatar: avatar,
        },
      });
      res.status(200).json("Avatar Succesful");
    } else {
      res.status(404).json("error");
    }
  },

  // Getallusers in follow section [GET api/user/allusers]

  Getallusers: async (req, res) => {
    const allusers = await UserSchemaa.find();

    res.json(allusers);
  },

  // get user by Id  [GET api/user/getuserbyid]

  getUserById: async (req, res) => {
    const userId = req.params.id;

    const userById = await UserSchemaa.findById(userId);
    if (!userById) {
      return res.status(400).json({
        status: "error",
        message: "cant find user",
      });
    } else {
      return res.status(200).json(userById);
    }
  },

  // Editcoverphoto in profile section [PUT api/user/editcoverphoto]

  Editcoverphoto: async (req, res) => {
    const { coverpic, id } = req.body;
    const Editcover = UserSchemaa.findOne({ _id: id });
    if (Editcover) {
      await UserSchemaa.findByIdAndUpdate(id, {
        $set: {
          CoverPic: coverpic,
        },
      });
      res.status(200).json("CoverPhoto Successfull");
    } else {
      res.status(404).json("error");
    }
  },

  // showing posts of other users in their profile [GET api/user/allpostsbyid]

  AllpostsById: async (req, res) => {
    userId = req.params.id;

    const post = await PostSchema.find({ userId: userId });

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    } else {
      return res.status(200).json(post);
    }
  },

  // like section [POST api/user/like/:id]------------------------

  setLike: async (req, res) => {
    const { userId, postId } = req.body;

    // Check if the post exists-------------------

    const post = await PostSchema.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const liked = post.likes.includes(userId);

    if (liked) {
      // User already liked the post, so dislike it-------------

      const updatedPost = await PostSchema.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true } // Return the updated document
      );

      res.json({ message: "disliked", updatedPost });
    } else {
      // User didn't like the post, so like it-----------------

      const updatedPost = await PostSchema.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      );

      res.json({ message: "liked", updatedPost });
    }
  },

  // comment section [POST api/user/comment/]---------------------

  setComment: async (req, res) => {
    try {
      const { userId, text, postId } = req.body;
      if (text) {
        const user = await UserSchemaa.findById(userId);

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const newComment = new comment({ userId, text, postId });
        await newComment.save();

        user.comments.push(newComment._id);
        await user.save();

        const post = await PostSchema.findById(postId);
        post.comments.push(newComment._id);
        await post.save();

        res.json(newComment);
      }
    } catch (error) {
      console.error("Error handling user comments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // comment getting [GET api/user/getcomment]--------------------------

  getComment: async (req, res) => {
    const postId = req.params.id;

    try {
      const posts = await PostSchema.findById(postId).populate({
        path: "comments",
        populate: {
          path: "userId",
          model: "User",
        },
      });

      if (!posts) {
        return res.status(404).json({ error: "No Posts Found" });
      }

      return res.status(200).json({
        status: "success",
        message: "post successfully fetched",
        data: posts,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // follow the user [POST api/user/follow/:id]--------------------

  followUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const loggedInUserId = res.token;

      if (userId === loggedInUserId) {
        return res.status(400).json({ error: "Cannot follow yourself" });
      }

      const userToFollow = await UserSchemaa.findById(userId);
      const loggedInUser = await UserSchemaa.findById(loggedInUserId);

      if (!userToFollow) {
        return res.status(404).json({ error: "No such users" });
      }

      if (!loggedInUser) {
        return res.status(404).json({ error: "user not found" });
      }

      // Check if already following-----------------

      if (loggedInUser.following.includes(userId)) {
        return res.status(400).json({ error: "Already following this user" });
      }

      // Update following array for logged-in user------------

      loggedInUser.following.push(userId);
      await loggedInUser.save();

      // Update followers array for the user to follow---------

      userToFollow.followers.push(loggedInUserId);
      await userToFollow.save();

      res
        .status(200)
        .json({ status: "success", message: "User followed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //unfollow the user [POST api/user/unfollow/:id]--------------------

  unfollowUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const loggedInUserId = res.token;

      if (userId === loggedInUserId) {
        return res.status(400).json({ error: "Cannot unfollow yourself" });
      }

      const userToUnfollow = await UserSchemaa.findById(userId);

      const loggedInUser = await UserSchemaa.findById(loggedInUserId);

      if (!userToUnfollow || !loggedInUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if already unfollowed

      if (!loggedInUser.following.includes(userId)) {
        return res.status(400).json({ error: "Not following this user" });
      }

      // Update following array for logged-in user

      loggedInUser.following = loggedInUser.following.filter(
        (id) => id !== userId
      );
      await loggedInUser.save();

      // Update followers array for the user to unfollow

      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id !== loggedInUserId
      );
      await userToUnfollow.save();

      res
        .status(200)
        .json({ status: "success", message: "User unfollowed successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // followers count [GET api/user/followerscount/:userId]----------------

  getFollowersCount: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await UserSchemaa.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ count: user.followers.length });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // following count [GET api/user/followingcount/:userId]----------------

  getFollowingCount: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await UserSchemaa.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ count: user.following.length });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // get all followers [GET api/user/followers]------------------

  getFollowers: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await UserSchemaa.findById(userId).populate({
        path: "followers",
        model: "User",
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const followers = user.followers;

      return res.status(200).json({
        status: "success",
        message: "Followers are here",
        followers: followers,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // get following [GET api/user/following]-------------------

  getFollowing: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await UserSchemaa.findById(userId).populate({
        path: "following",
        model: "User",
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const following = user.following;

      return res.status(200).json({
        status: "success",
        message: "Following users are here",
        following: following,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // chat [POST api/user/chat]---------------

  ChatUser: async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }
    var isChat = await ChatSchema.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: res.user } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    isChat = await UserSchemaa.populate(isChat, {
      path: "latestMessage.sender",
      select: "name image email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [res.user, userId],
      };
      try {
        const createdChat = await ChatSchema.create(chatData);

        const fullChat = await ChatSchema.findOne({
          _id: createdChat._id,
        }).populate("users", "-password");
        res.status(200).send(fullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  },

  //fetching all of the chats for that particular user [GET api/user/chat/fetchchats]-----------

  fetchChats: async (req, res) => {
    try {
      ChatSchema.find({ users: { $elemMatch: { $eq: res.user } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await UserSchemaa.populate(results, {
            path: "latestMessage.sender",
            select: "name image email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  },

  // creating group chats [POST api/user/chat/group]----------------

  createGroupChats: async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res
        .status(400)
        .send("moe than 2 users are required to form a group chat");
    }
    users.push(req.users);

    try {
      const groupChat = await ChatSchema.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });
      const fullGroupChat = await ChatSchema.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new error(error.message);
    }
  },

  //Rename the group [PUT api/user/chat/rename]------------------

  renameGroup: async (req, res) => {

    const { chatId, chatName } = req.body;

    const updatedChat = await ChatSchema.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404);
      throw new error("Chat not found");
    } else {
      res.json(updatedChat);
    }
  },
  

  //add to the group [PUT api/user/chat/groupadd]---------------

  addToGroup: async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await ChatSchema.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
        
      },
      { new: true }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404);
      throw new error("Chat not found");
    } else {
      res.json(added);
    }
  },


  // remove from the group [PUT api/user/chat/groupremove]

  removeFromGroup: async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await ChatSchema.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
        
      },
      { new: true }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!removed) {
      res.status(404);
      throw new error("Chat not found");
    } else {
      res.json(removed);
    }
  },

};
