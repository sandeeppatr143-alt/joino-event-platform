const nodemailer = require('nodemailer')

async function sendMail(to, subject, htmlContent, attachments = []) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return false
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  })
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html: htmlContent, attachments })
  return true
}

module.exports = sendMail
