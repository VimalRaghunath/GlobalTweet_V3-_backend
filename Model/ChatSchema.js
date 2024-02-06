const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({

    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message'},
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    // sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    // receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    // content: { type: String, require: true },
    // timestamp: { type: Date, default: Date.now }
}, { timestamps: true,  })

module.exports = mongoose.model("Chat",ChatSchema)