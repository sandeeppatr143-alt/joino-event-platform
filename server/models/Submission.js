const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, match: /^\d{10}$/ },
    eventName: { type: String, required: true, trim: true, maxlength: 150 },
    eventVenue: { type: String, required: true, trim: true, maxlength: 250 },
    eventTime: { type: String, required: true, trim: true, maxlength: 100 },
    eventDate: { type: String, required: true, trim: true, maxlength: 50 },
    qrCode: { type: String, required: true },
    formId: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
)

submissionSchema.index({ email: 1, eventName: 1 })

module.exports = mongoose.model('Submission', submissionSchema)
