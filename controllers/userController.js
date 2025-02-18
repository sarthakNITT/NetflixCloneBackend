const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const blacklist = require('../models/blacklist')
const {transporter, twilioClient} = require('../middleware/OTP')
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
    const {email, number, password, OTP} = req.body;

    if(!email && !number){
        res.status(400).json({message: "Either enter email or phone number"})
        console.log("Either enter email or phone number");
    }

    const user = await User.findOne({
        $or: [{email: email}, {number: number}]
    })

    if (!user) {
        console.log("User not found");
        return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (OTP) {
        if (!user.OTP || user.OTP !== OTP || new Date() > user.OTPExpires) {
            console.log("Invalid or Expired OTP");
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }

        user.OTP = null;
        user.OTPExpires = null;
        await user.save();

        const token = generateToken(user._id);
        console.log("Login successful via OTP");
        return res.status(200).json({
            _id: user.id,
            email: user.email,
            number: user.number,
            token
        });
    }

    if (!password) {
        console.log("Password is required for password login");
        return res.status(400).json({ message: "Password is required" });
    }

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

const sendOTP = asyncHandler(async(req,res)=>{
    const {email, number} = req.body

    if(!email && !number){
        res.status(400).json({message: "Either enter email or phone number"})
        console.log("Either enter email or phone number");
    }

    const user = await User.findOne({
        $or: [{email: email}, {number: number}]
    })

    if(!user){
        res.status(400).json({message: "Invalid Credentials"})
        console.log("Invalid Credentials");
    }

    const otp = Math.floor(10000 + Math.random()*900000).toString()

    const otpExpires = new Date(Date.now() + 10*60*1000)

    user.OTP = otp
    user.OTPExpires = otpExpires
    await user.save()

    try {
        if(email){
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Your OTP Code",
                text: `Your OTP code is: ${otp} Valid for 10 minutes`
            }
            await transporter.sendMail(mailOptions)
            console.log(`OTP is successfully send to the ${email}`);
        }
    
        if(number){
            await twilioClient.messages.create({
                body: `Your OTP code is: ${otp} Valid for 10 minutes`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: number
            })
            console.log(`OTP is successfully send to the ${number}`);
        }
    
        res.status(200).json({message: "OTP is successfully"})   
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
})

const verifyOTP = asyncHandler(async(req,res)=>{
    const {email, number, OTP} = req.body

    if(!email && !number){
        res.status(400).json({message: "Either enter email or phone number"})
        console.log("Either enter email or phone number");
    }

    if(!OTP){
        res.status(400).json({message: "PLease provide the OTP"})
        console.log("PLease provide the OTP");
    }

    const user = await User.findOne({
        $or: [{email: email}, {number: number}]
    })

    if(!user){
        console.log("User not found");
        return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (!user.OTP || user.OTP !== OTP || new Date() > user.OTPExpires) {
        res.status(400).json({message: "Invalid or Expired OTP"})
        console.log("Invalid or Expired Otp");
    }

    user.OTP = null
    user.OTPExpires = null
    await user.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({message: "OTP verified successfully", token})
    console.log("OTP verified successfully");
})

module.exports = {registerUser, loginUser, logoutUser, resetPassword, sendOTP, verifyOTP}