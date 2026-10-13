require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const QRCode = require('qrcode')
const crypto = require('node:crypto')

const Submission = require('./models/Submission')
const generatePdfFromHtml = require('./services/pdfService')
const sendMail = require('./utils/mailer')
const validateRegistration = require('./utils/validateRegistration')

const app = express()
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('This origin is not allowed by the Joino API CORS policy.'))
  },
  methods: ['GET', 'POST'],
}))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false, limit: '1mb' }))

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character])
}

app.get('/health', (_req, res) => {
  res.json({ success: true, service: 'Joino API', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
})

app.post('/submit', async (req, res) => {
  const validationError = validateRegistration(req.body)
  if (validationError) return res.status(400).json({ success: false, message: validationError })
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database is not connected. Check MONGODB_URI and the MongoDB service.' })
  }

  const { name, email, phone, eventName, eventVenue, eventTime, eventDate } = req.body
  const formId = crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()
  const ticketData = { version: 1, formId, name: name.trim(), eventName: eventName.trim(), eventDate: eventDate.trim() }

  try {
    const qrCode = await QRCode.toDataURL(JSON.stringify(ticketData), { errorCorrectionLevel: 'M', margin: 1, width: 320 })
    const submission = new Submission({ name, email, phone, eventName, eventVenue, eventTime, eventDate, qrCode, formId })
    await submission.save()

    let emailSent = false
    let emailMessage = 'Email delivery is not configured or was unavailable.'
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const safeName = escapeHtml(name)
        const safeEmail = escapeHtml(email)
        const safeEvent = escapeHtml(eventName)
        const safeVenue = escapeHtml(eventVenue)
        const safeDate = escapeHtml(eventDate)
        const safeTime = escapeHtml(eventTime)
        const html = `
          <main style="font-family:Arial,sans-serif;max-width:620px;margin:24px auto;padding:28px;color:#1a302b;border:1px solid #e3ebe4;border-radius:16px">
            <p style="font-size:12px;letter-spacing:2px;color:#4a7d69">JOINO · REGISTRATION CONFIRMED</p>
            <h1 style="font-size:26px">You're on the list, ${safeName}.</h1>
            <p>Your registration has been created. Keep your QR ticket attached to this message.</p>
            <div style="padding:16px;background:#f0f7f1;border-radius:10px"><p><b>Event:</b> ${safeEvent}</p><p><b>Date:</b> ${safeDate}</p><p><b>Time:</b> ${safeTime}</p><p><b>Venue:</b> ${safeVenue}</p><p><b>Registration ID:</b> ${formId}</p><p><b>Email:</b> ${safeEmail}</p></div>
            <div style="text-align:center;margin-top:20px"><img src="${qrCode}" width="220" height="220" alt="Registration QR code" /></div>
            <p style="font-size:12px;color:#718079">Demo event details should be verified with the organizer before attending.</p>
          </main>`
        const pdfBuffer = await generatePdfFromHtml(html)
        emailSent = await sendMail(email, 'Joino registration confirmation', html, [{ filename: `joino-ticket-${formId}.pdf`, content: pdfBuffer }])
        emailMessage = emailSent ? 'Confirmation email sent.' : 'Registration created; email delivery is not enabled.'
      } catch (mailError) {
        console.error('Registration saved, but confirmation email failed:', mailError.message)
        emailMessage = 'Registration created; confirmation email could not be sent. Keep the QR code shown on screen.'
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Registration created successfully.',
      ticket: { formId, qrCode, name, email, eventName, eventVenue, eventTime, eventDate, emailSent, emailMessage },
    })
  } catch (error) {
    console.error('Registration creation failed:', error.message)
    return res.status(500).json({ success: false, message: 'Registration could not be saved. Please retry after checking the server logs.' })
  }
})

const PORT = Number(process.env.PORT) || 5000
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Joino database connected'))
    .catch((error) => console.error('MongoDB connection failed:', error.message))
} else {
  console.warn('MONGODB_URI is missing. The API starts, but registrations return 503 until MongoDB is configured.')
}

app.listen(PORT, () => console.log(`Joino API listening on port ${PORT}`))
