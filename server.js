const express = require('express')
const app = express()
const {connectDB} = require('./database/db')
require('dotenv').config();
const PORT = process.env.PORT || 5001;

const useRoutes = require('./routes/authRoutes')
const watchlistRoutes = require('./routes/watchlistRoutes')
const moviesRoutes = require('./routes/moviesRoutes')
const progressRoutes = require('./routes/progressRoutes')

app.use(express.json());

connectDB

app.use('/api/auth', useRoutes)
app.use('/movies', moviesRoutes)
app.use('/watchlist', watchlistRoutes);
app.use('/progress', progressRoutes);

app.listen(PORT, ()=>{
  console.log(`Server is running on port: ${PORT}`);
})