const mongoose = require("mongoose")

const FollowSchema = new mongoose.Schema({
    userId: { type : mongoose.Schema.Types.ObjectId, ref: "User"}

})

module.exports = mongoose.model("Follow",FollowSchema)