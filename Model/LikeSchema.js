const mongoose = require("mongoose")

const LikeSchema = new mongoose.Schema({
    userId: { type : mongoose.Schema.Types.ObjectId, ref: "User"},
    //post specifications,
    //post specifications,
    postId:{ type : mongoose.Schema.Types.ObjectId, ref: "User"}
})

module.exports = mongoose.model("Like",LikeSchema)