const mongoose = require('mongoose')

const progressSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    movie: {type: mongoose.Schema.Types.ObjectId, res: 'Movies', required: true},
    progress: {type: Number, required: true},
},
{
    timestamps: true
})

module.exports = mongoose.model('Progress', progressSchema);