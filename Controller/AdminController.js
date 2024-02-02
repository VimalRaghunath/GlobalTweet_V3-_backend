// const AdminSchema = require("../Model/AdminSchema")

const PostSchema = require("../Model/PostSchema");
const UserSchemaa = require("../Model/UserSchemaa");

module.exports = {
  // Admin to get all users [GET api/admin/users]----------------

  getAllusers: async (req, res) => {
    try {
      const users = await UserSchemaa.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Admin to get all posts [GET api/admin/posts]-------------------

  getAllposts: async (req, res) => {
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

  // Admin to block a user [PUT api/admin/block/:id]--------------------

  BlocktheUser: async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await UserSchemaa.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.isBlocked = true;
      await user.save();

      return res.status(200).json({ message: "User blocked successfully" });
    } catch (error) {
      console.error("Error blocking user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Unblock the user [PUT api/admin/unblock/:id]--------------------

  unblockUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await UserSchemaa.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.isBlocked = false;
      await user.save();

      return res.status(200).json({ message: "User unblocked successfully" });
    } catch (error) {
      console.error("Error unblocking user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // get blocked users [GET api/admin/users/blockedusers]--------------

  BlockedUsers: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await UserSchemaa.findById(userId).populate({
        path: "isBlocked",
        model: "User",
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isBlocked = user.isBlocked;

      return res.status(200).json({
        status: "success",
        message: "Blocked users are here",
        isBlocked: isBlocked,
      })

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error"})
    }
  },

  // Delete all the users [DELETE api/admin/users/:id]----------------

  deleteUser: async (req, res) => {
    const userId = req.params.id;
    try {
      await UserSchemaa.findByIdandDelete(userId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server error" });
    }
  },
};
