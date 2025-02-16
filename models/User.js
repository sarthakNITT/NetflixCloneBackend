const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Enter your email id"],
    unique: true
  },
  number: {
    type: String,
    required: [true, "Enter your phone number"],
    unique: true
  },
  password: {
    type: String,
    required: true
  }
},
{
  timestamps: true
})

module.exports = mongoose.model("User", userSchema);