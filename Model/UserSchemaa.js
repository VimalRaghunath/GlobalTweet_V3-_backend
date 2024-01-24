    const { number } = require("@hapi/joi")
    const mongoose = require("mongoose")

    const userSchema = mongoose.Schema({
        name: { type: String, required: true},
        Avatar: String,
        coverphoto: String,
        email: { type: String, required: true},
        mobile: { type: Number, required: true},
        username: { type: String, required: true},
        password: { type: String, required: true},
        bio: { type: String },
        following: Array,
        followers: Array,
        isBlocked: { type: Boolean , default:false},
        isAdmin: { type: Boolean , default:false},
        comments: Array,

    })


    module.exports = mongoose.model("User",userSchema)