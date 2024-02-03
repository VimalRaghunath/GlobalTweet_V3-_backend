const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String },
  description: { type: String },
  image: { type: String },
  category: { type: String },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  tweet: { type: String },

  // Date:{type:Date,default:Date.now}
},{ timestamps: true });

module.exports = mongoose.model("Post", PostSchema);
