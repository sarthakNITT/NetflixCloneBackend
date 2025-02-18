require('dotenv').config()
const twilio = require('twilio')
const nodemail = require('nodemailer')

const transporter = nodemail.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

module.exports = {transporter, twilioClient}