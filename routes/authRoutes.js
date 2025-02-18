const express = require('express')
const router = express.Router()
const {registerUser, loginUser, logoutUser, resetPassword, sendOTP, verifyOTP} = require('../controllers/userController')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.put('/resetPassword', resetPassword)
router.post('/sendOTP', sendOTP)
router.post('/verifyOTP', verifyOTP)

module.exports = router