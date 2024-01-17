const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({

    userId: { type : mongoose.Schema.Types.ObjectId, ref: "User"},
    postId:{ type : mongoose.Schema.Types.ObjectId, ref: "User"},
    text: { type: String, required: true },

},{ timestamps: true })

module.exports = mongoose.model("Comment",CommentSchema)