    const { number } = require("@hapi/joi")
    const mongoose = require("mongoose")
    const bcrypt = require('bcryptjs')

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

    userSchema.pre("save", async function (next) {
        if (!this.modified) {
          next();
        }

       const salt = await bcrypt.genSalt(10);
       this.password = await bcrypt.hash(this.password, salt);
    })


    module.exports = mongoose.model("User",userSchema)