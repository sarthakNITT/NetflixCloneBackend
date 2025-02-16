const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>console.log("Conntent to MongoDB"))
    .catch((err)=>console.error("Database connection error: ", err))

module.exports = {connectDB}