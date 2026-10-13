const test = require('node:test')
const assert = require('node:assert/strict')
const validateRegistration = require('./validateRegistration')

const validRegistration = {
  name: 'Sandeep Demo', email: 'attendee@example.com', phone: '9876543210',
  eventName: 'AI & Full-Stack Build Night', eventVenue: 'Bhubaneswar', eventTime: '10:00 AM – 1:00 PM', eventDate: '07 Nov 2026',
}

test('accepts a complete valid registration', () => assert.equal(validateRegistration(validRegistration), null))
test('rejects missing event and attendee fields', () => assert.match(validateRegistration({}), /required/i))
test('rejects malformed email', () => assert.match(validateRegistration({ ...validRegistration, email: 'not-an-email' }), /email/i))
test('rejects non-10-digit phone values', () => assert.match(validateRegistration({ ...validRegistration, phone: '1234' }), /10 digits/i))
test('rejects overlong display fields', () => assert.match(validateRegistration({ ...validRegistration, name: 'x'.repeat(101) }), /length/i))
