import { useEffect, useState } from 'react'
import { MessageCircle, Send, X } from './Icons.jsx'

const PROJECT_ID = import.meta.env.VITE_VOICEFLOW_PROJECT_ID?.trim()
const VERSION_ID = import.meta.env.VITE_VOICEFLOW_VERSION_ID || 'production'
const faq = [
  { keywords: ['register', 'sign up', 'join'], answer: 'Choose an event card, fill in your name, email, and 10-digit phone number, then select Confirm registration.' },
  { keywords: ['ticket', 'qr', 'code'], answer: 'After a successful registration, Joino displays a unique QR code and registration ID. Save them for your records.' },
  { keywords: ['email', 'confirmation'], answer: 'Email delivery is optional. The backend needs EMAIL_USER and EMAIL_PASS configured to send a confirmation.' },
  { keywords: ['event', 'date', 'venue', 'location', 'time'], answer: 'The cards show each demo event’s date, venue, and time. The current listings are illustrative and should be replaced with verified events before launch.' },
]

function SupportAssistant() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi! I can help with registrations, QR tickets, and confirmation emails.' }])

  useEffect(() => {
    if (!PROJECT_ID) return undefined
    const existing = document.querySelector('script[data-joino-voiceflow]')
    const script = existing || document.createElement('script')
    const init = () => {
      if (window.voiceflow?.chat?.load) {
        window.voiceflow.chat.load({ verify: { projectID: PROJECT_ID }, url: 'https://general-runtime.voiceflow.com', versionID: VERSION_ID })
      }
    }
    script.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs'
    script.type = 'text/javascript'
    script.async = true
    script.dataset.joinoVoiceflow = 'true'
    script.addEventListener('load', init)
    if (!existing) document.body.appendChild(script)
    else init()
    return () => script.removeEventListener('load', init)
  }, [])

  const answerQuestion = (event) => {
    event.preventDefault()
    const cleaned = question.trim()
    if (!cleaned) return
    const normalized = cleaned.toLowerCase()
    const match = faq.find((item) => item.keywords.some((keyword) => normalized.includes(keyword)))
    const response = match?.answer || 'I can help with event selection, registration steps, QR tickets, and confirmation email setup. Try asking about one of those topics.'
    setMessages((current) => [...current, { role: 'user', text: cleaned }, { role: 'assistant', text: response }])
    setQuestion('')
  }

  return <div className="support-widget">
    {!PROJECT_ID && open && <section className="support-panel" aria-label="Joino help assistant"><header><div><strong>Joino help</strong><small>Local FAQ assistant</small></div><button type="button" aria-label="Close help" onClick={() => setOpen(false)}><X size={19} /></button></header><div className="support-messages" aria-live="polite">{messages.map((message, index) => <p key={`${message.role}-${index}`} className={`support-message ${message.role}`}>{message.text}</p>)}</div><form onSubmit={answerQuestion} className="support-input"><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about tickets…" aria-label="Ask Joino a question" maxLength={300} /><button type="submit" aria-label="Send question"><Send size={16} /></button></form></section>}
    {!PROJECT_ID && <button type="button" className="support-launcher" onClick={() => setOpen((value) => !value)} aria-expanded={open}><MessageCircle size={19} /> Need help?</button>}
  </div>
}

export default SupportAssistant
