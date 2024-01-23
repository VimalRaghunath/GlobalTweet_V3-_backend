const bcrypt = require("bcrypt");
const { joiUserValidationSchema } = require("../Model/ValidationSchema");
const jwt = require("jsonwebtoken");
const UserSchemaa = require("../Model/UserSchemaa");
const PostSchema = require("../Model/PostSchema");
const { joiPostValidationSchema } = require("../Model/ValidationSchema");
const messageSchema = require("../Model/messageSchema");
const comment = require("../Model/CommentSchema");
const CommentSchema = require("../Model/CommentSchema");

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
      return res.status(200).json({
        status: "user_success",
        message: "user Signin successful",
        data: token,
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
      // console.log(req.body);

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
      // if (error.name === 'ValidationError') {
      //   const errors = Object.values(error.errors).map((err) => err.message);
      //   return res.status(400).json({
      //     status: 'error',
      //     message: 'Validation failed',
      //     errors: errors,
      //   });
      // }

      // console.error('Error creating post:', error);
      // res.status(500).json({
      //   status: 'error',
      //   message: 'Internal server error',
      // });
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
    // console.log(post);
    if (!post) {
      return res.status(404).json({ error: "No Posts Found" });
    }
    res.status(200).json({
      status: "success",
      message: "post successfully fetched",
      data: post,
    });
  },

  // explore/search option [GET api/user/explore]--------------------

  Explore: async (req, res) => {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
      }

      const regex = new RegExp(query, "i");

      const results = await Tweet.find({ text: regex });

      res.status(200).json({
        status: "success",
        message: "Search successful",
        data: results,
      });
    } catch (error) {
      console.error("Error in explore:", error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
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
      // else {
      //   const user = await UserSchemaa.findById(userId).populate('comments');
      //   res.json(user.comments);
      // }
    } catch (error) {
      console.error("Error handling user comments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // comment getting [GET api/user/getcomment]--------------------------


getComment: async (req, res) => {
  const postId = req.params.id;

  try {
    const posts = await PostSchema.findById(postId).
    populate({
      path: 'comments',
      populate: {
        path: 'userId', 
        model:'User',
      },
    });

  console.log(posts);
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
      console.log(userId,"47");
      const loggedInUserId = req.user;
      console.log(loggedInUserId)

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
      const { userId } = req.params;
      const { id: loggedInUserId } = req.user;
      
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

  // messsages showing in profile [GET api/user/messages]---------------

  


};
