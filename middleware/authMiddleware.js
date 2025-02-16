const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/User');
const Blacklist = require('../models/blacklist');

const protect = asyncHandler(async(req,res,next)=>{
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const isBlackListed = await Blacklist.findOne({token})

      if(isBlackListed){
        res.status(401).json({message: "Not Authorised, token is blacklisted"})
        throw new Error("Not Authorised, token is blacklisted")
      }
      
      const decoded = jwt.verify(token, process.env.JWT_Secret)
      
      req.user = await User.findById(decoded.id).select('-password')
      
      next()
    } catch (error) {
      console.log(error);
      res.json({message: "Not Authorised"})
      throw new Error("Not authorised")
    }

    if(!token){
      console.log(error);
      res.json({message: "Not Authorised, no token"})
      throw new Error("Not authorised, no token")
    }
  }
})

module.exports = (protect)