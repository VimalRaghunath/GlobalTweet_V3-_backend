const mongoose = require("mongoose")

const FollowersSchema = new mongoose.Schema({
    userId: { type : mongoose.Schema.Types.ObjectId, ref: "User"}

})

module.exports = mongoose.model("Follower",FollowersSchema)