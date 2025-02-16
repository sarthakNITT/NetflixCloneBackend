const express = require('express')
const router = express.Router()
const {registerUser, loginUser, logoutUser, resetPassword} = require('../controllers/userController')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.put('/resetPassword', resetPassword)

module.exports = router