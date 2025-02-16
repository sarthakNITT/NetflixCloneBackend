const express = require('express')
const app = express()
const {connectDB} = require('./database/db')
require('dotenv').config();
const PORT = process.env.PORT || 5001;

const useRoutes = require('./routes/authRoutes')

app.use(express.json());

connectDB

app.use('/api/authenticate', useRoutes)

app.listen(PORT, ()=>{
  console.log(`Server is running on port: ${PORT}`);
})