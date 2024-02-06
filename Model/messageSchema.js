const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({

    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: { type: String, require: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat'},
    
    // receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    // timestamp: { type: Date, default: Date.now }

}, { timestamps: true,  })

module.exports = mongoose.model("Message",messageSchema)