import { useMemo, useState } from 'react'
import axios from 'axios'
import { ArrowUpRight, CalendarDays, CheckCircle2, Clock3, MapPin, QrCode, ShieldCheck, Ticket } from './Icons.jsx'
import SupportAssistant from './SupportAssistant.jsx'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

// Clearly marked sample listings so the demo doesn't imply these are real events.
const eventOptions = [
  { id: 'ai-build-night', name: 'AI & Full-Stack Build Night', category: 'AI / SOFTWARE', date: '07 Nov 2026', venue: 'Startup Odisha Hub, Bhubaneswar', time: '10:00 AM – 1:00 PM', color: 'mint', description: 'Prototype a useful AI-powered feature with other builders.' },
  { id: 'embedded-vlsi', name: 'Embedded Systems & VLSI Forum', category: 'HARDWARE / VLSI', date: '14 Nov 2026', venue: 'Innovation Lab, Bhubaneswar', time: '2:00 PM – 5:00 PM', color: 'lavender', description: 'Explore digital design, verification, and edge-computing ideas.' },
  { id: 'open-source-clinic', name: 'Open Source Project Clinic', category: 'COMMUNITY', date: '21 Nov 2026', venue: 'CoWork Studio, Bhubaneswar', time: '11:00 AM – 2:00 PM', color: 'peach', description: 'Get practical feedback on GitHub repositories and project demos.' },
]

const initialForm = { name: '', email: '', phone: '', eventName: '', eventVenue: '', eventTime: '', eventDate: '' }

function EventForm() {
  const [selectedEventId, setSelectedEventId] = useState(eventOptions[0].id)
  const [formData, setFormData] = useState({ ...initialForm, eventName: eventOptions[0].name, eventVenue: eventOptions[0].venue, eventTime: eventOptions[0].time, eventDate: eventOptions[0].date })
  const [ticket, setTicket] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const selectedEvent = useMemo(() => eventOptions.find((event) => event.id === selectedEventId) || eventOptions[0], [selectedEventId])

  const handleFieldChange = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))

  const chooseEvent = (event) => {
    setSelectedEventId(event.id)
    setFormData((current) => ({ ...current, eventName: event.name, eventVenue: event.venue, eventTime: event.time, eventDate: event.date }))
    setTicket(null)
    setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Enter your name, email, and phone number to continue.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      setErrorMessage('Enter a valid email address.')
      return
    }
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      setErrorMessage('Enter a 10-digit phone number.')
      return
    }

    setSubmitting(true)
    try {
      const { data } = await axios.post(`${API_BASE_URL}/submit`, {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      }, { timeout: 20000 })
      setTicket(data.ticket || { formId: data.formId, qrCode: data.qrCode, ...formData, message: data.message, emailSent: data.emailSent })
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Registration could not be completed. Check that the backend and database are running, then try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="joino-shell">
      <header className="topbar">
        <a href="#top" className="brand" aria-label="Joino home"><span className="brand-mark"><Ticket size={22} /></span><span>joino<span className="brand-dot">.</span></span></a>
        <div className="topbar-right"><span className="secure-label"><ShieldCheck size={15} /> Simple, secure registration</span><a href="#register" className="topbar-link">Register <ArrowUpRight size={16} /></a></div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT IDEA STARTS HERE</p>
            <h1>Find your people.<br /><span>Make something happen.</span></h1>
            <p className="hero-description">A cleaner way to register for workshops, tech meetups, and community sessions. Choose a session, reserve your spot, and keep your QR ticket close.</p>
            <div className="hero-meta"><span><CalendarDays size={17} /> Curated demo events</span><span><QrCode size={17} /> QR ticket confirmation</span></div>
          </div>
          <div className="hero-note"><span className="note-top">BUILT FOR PEOPLE WHO BUILD</span><div className="note-orbit"><span>J</span><i /><b /></div><p>Learn together.<br />Build in public.</p><small>Sample events · Bhubaneswar, Odisha</small></div>
        </section>

        <section className="events-section" aria-labelledby="events-title">
          <div className="section-heading"><div><p className="eyebrow dark">THE LINEUP</p><h2 id="events-title">Pick your next room.</h2></div><p>Choose a demo listing to see its details<br className="desktop-break" /> and register below.</p></div>
          <div className="event-grid">
            {eventOptions.map((event, index) => (
              <button type="button" key={event.id} className={`event-card ${event.color} ${selectedEventId === event.id ? 'is-selected' : ''}`} onClick={() => chooseEvent(event)} aria-pressed={selectedEventId === event.id}>
                <div className="event-card-top"><span className="event-category">{event.category}</span><span className="event-number">0{index + 1}</span></div>
                <h3>{event.name}</h3><p>{event.description}</p>
                <div className="event-details"><span><CalendarDays size={15} /> {event.date}</span><span><MapPin size={15} /> {event.venue}</span><span><Clock3 size={15} /> {event.time}</span></div>
                <div className="event-select">{selectedEventId === event.id ? 'Selected' : 'Select event'} <ArrowUpRight size={16} /></div>
              </button>
            ))}
          </div>
          <p className="demo-disclaimer">These listings are illustrative demo events. Replace them with verified event details before public launch.</p>
        </section>

        <section id="register" className="register-section">
          <div className="register-intro"><p className="eyebrow dark">SAVE YOUR SPOT</p><h2>One form.<br /><span>Your ticket, sorted.</span></h2><p>Submit your details to create a registration record and unique QR code. Email delivery is optional and depends on server mail settings.</p><div className="selected-summary"><span className="summary-icon"><Ticket size={20} /></span><div><small>YOUR SELECTED EVENT</small><strong>{selectedEvent.name}</strong><span>{selectedEvent.date} · {selectedEvent.time}</span></div></div></div>
          <div className="form-panel">
            {!ticket ? <form className="registration-form" onSubmit={handleSubmit} noValidate>
              <div className="form-heading"><span>REGISTRATION FORM</span><span className="required-note">* Required</span></div>
              <label>Full name <em>*</em><input name="name" autoComplete="name" value={formData.name} onChange={handleFieldChange} placeholder="Your name" required maxLength={100} /></label>
              <label>Email address <em>*</em><input name="email" type="email" autoComplete="email" value={formData.email} onChange={handleFieldChange} placeholder="you@example.com" required maxLength={254} /></label>
              <label>Phone number <em>*</em><input name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" value={formData.phone} onChange={handleFieldChange} placeholder="10-digit mobile number" required maxLength={10} /></label>
              <div className="privacy-hint"><ShieldCheck size={17} /><span>Use a valid email for confirmation. Your details are sent to the configured project backend.</span></div>
              {errorMessage && <p role="alert" className="form-error">{errorMessage}</p>}
              <button className="submit-button" type="submit" disabled={submitting}>{submitting ? 'Creating your ticket…' : 'Confirm registration'} <ArrowUpRight size={18} /></button>
              <p className="form-footnote">By registering, you confirm the details above are accurate.</p>
            </form> : <div className="ticket-success" role="status"><div className="success-icon"><CheckCircle2 size={30} /></div><p className="eyebrow dark">YOU'RE ON THE LIST</p><h3>Registration created.</h3><p className="success-copy">Your Joino demo ticket is ready. Keep the QR code and registration ID for your records.</p>{ticket.qrCode && <img className="ticket-qr" src={ticket.qrCode} alt="Registration QR code" />}<div className="ticket-id"><span>REGISTRATION ID</span><strong>{ticket.formId || 'Created'}</strong></div><div className="ticket-event"><strong>{formData.eventName}</strong><span>{formData.eventDate} · {formData.eventVenue}</span></div><p className="email-state">{ticket.emailMessage || (ticket.emailSent ? 'Confirmation email sent.' : 'Email delivery is not configured or was unavailable; the registration record was still created.')}</p><button type="button" className="submit-button" onClick={() => { setTicket(null); setFormData({ ...initialForm, eventName: selectedEvent.name, eventVenue: selectedEvent.venue, eventTime: selectedEvent.time, eventDate: selectedEvent.date }); }}>Register another attendee <ArrowUpRight size={18} /></button></div>}
          </div>
        </section>
      </main>

      <footer className="joino-footer"><a href="#top" className="brand"><span className="brand-mark"><Ticket size={19} /></span><span>joino<span className="brand-dot">.</span></span></a><p>Designed and customized by <strong>Sandeep Patra</strong></p><span>React · Express · MongoDB · QR tickets</span></footer>
      <SupportAssistant />
    </div>
  )
}

export default EventForm
