const mongoose = require('mongoose')

const BlackListSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        expires: '30d',
        default: Date.now
    }
})

module.exports = mongoose.model('Blacklist', BlackListSchema)