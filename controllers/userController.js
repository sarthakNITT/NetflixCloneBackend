const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const blacklist = require('../models/blacklist')
require('dotenv').config()

const registerUser = asyncHandler(async(req,res)=>{
    const {email, number, password} = req.body;

    if(!email || !number || !password){
        console.error("Enter all the fiels");
        res.json({message: "All the fields are required"})
        throw new Error("All the fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{email: email}, {number: number}]
    })

    if(existingUser){
        if(existingUser.email === email){
            console.log("Account with this email id already exists");
            res.json({message: "Account with this email id already exists"})
            throw new Error("Account with this email id already exists")
        }else if(existingUser.number === number){
            console.log("Account with this number already exists");
            res.json({message: "Account with this number already exists"})
            throw new Error("Account with this number already exists")
        }
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        email, 
        number,
        password: hashPassword
    })

    if(user){
        return res.status(201).json({
            _id: user.id,
            email: user.email,
            number: user.number,
            token: generateToken(user._id)
        })
    }else{
        console.error("Invalid Credentials");
        res.json({message: "Invalid Credentials"})
        throw new Error("Invalid Credentials")
    }
})

const loginUser = asyncHandler(async(req,res)=>{
    const {email, password} = req.body;

    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))){
        return res.status(201).json({
            _id: user.id,
            email: user.email,
            number: user.number,
            token: generateToken(user._id)
        })
    }else{
        console.error("Invalid Credentials");
        res.json({message: "Invalid Credentials"})
        throw new Error("Invalid Credentials")
    }
})

const logoutUser = asyncHandler(async(req,res)=>{
    const token = req.headers.authorization.split(' ')[1]
    
    if(token!==User.token){
        res.status(400).json({message: "Invalid token"})
        console.log("Invalid token in authorisation");
        throw new Error("Invalid token")
    }

    const blacklistedToken = new blacklist({token})
    await blacklistedToken.save()
    res.status(200).json({message: "LogOut Successfully"})
})

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

const resetPassword = asyncHandler(async(req,res)=>{
    const {email, newpassword, confirmPassword} = req.body

    if(!email || !newpassword || !confirmPassword){
        console.error("All fields are required");
        res.status(400).json({message: "All fields are required"})
        throw new Error("All fields are required")
    }

    const user = await User.findOne({email})

    if(!user){
        console.error("User not found");
        return res.status(404).json({ message: "User not found" });
    }

    if(newpassword!==confirmPassword){
        console.error("Passwords do not match");
        return res.status(400).json({ message: "Passwords do not match" });
    }
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newpassword, salt)

    user.password = hashedPassword
    await user.save()

    console.log("Password updated successfully");
    res.status(200).json({ message: "Password updated successfully" });
})

module.exports = {registerUser, loginUser, logoutUser, resetPassword}