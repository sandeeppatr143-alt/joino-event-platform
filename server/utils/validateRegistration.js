function validateRegistration(payload = {}) {
  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const email = typeof payload.email === 'string' ? payload.email.trim() : ''
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : ''
  const eventName = typeof payload.eventName === 'string' ? payload.eventName.trim() : ''
  const eventVenue = typeof payload.eventVenue === 'string' ? payload.eventVenue.trim() : ''
  const eventTime = typeof payload.eventTime === 'string' ? payload.eventTime.trim() : ''
  const eventDate = typeof payload.eventDate === 'string' ? payload.eventDate.trim() : ''

  if (!name || !email || !phone || !eventName || !eventVenue || !eventTime || !eventDate) {
    return 'Name, email, phone, and event details are required.'
  }
  if (name.length > 100 || email.length > 254 || eventName.length > 150 || eventVenue.length > 250) {
    return 'One or more fields exceed the allowed length.'
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address.'
  if (!/^\d{10}$/.test(phone)) return 'Phone number must contain exactly 10 digits.'
  return null
}

module.exports = validateRegistration
