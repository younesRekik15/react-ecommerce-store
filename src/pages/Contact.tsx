import { useState } from 'react'
import { submitContactMessage } from '../firebase/services'
import PhoneInput from '../components/PhoneInput'

/** Contact page with an inline form that submits messages to Firestore */
export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('+216 ')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await submitContactMessage({ name, email, phone, message })
      setSent(true)
    } catch {
      setError('Failed to send message. Please try again.')
    }
  }

  return (
    <div className="contact-page container section page-enter">
      <h1 className="section-title">Contact Us</h1>

      <div className="contact-layout">
        {/* ---- Contact details ---- */}
        <div className="contact-info-card">
          <h2>Get in Touch</h2>
          <p>Have a question or a custom request? We'd love to hear from you.</p>
          <div className="contact-info-list">
            <div className="contact-info-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span>+216 99 726 805</span>
            </div>
            <div className="contact-info-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>younesrekik347@gmail.com</span>
            </div>
            <div className="contact-info-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Mon – Sat, 9 AM – 6 PM</span>
            </div>
          </div>
        </div>

        {/* ---- Contact form ---- */}
        <div className="contact-form-wrapper">
          {sent ? (
            <div className="success-message">
              <span className="success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <h3>Message Sent!</h3>
              <p>We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <PhoneInput id="phone" value={phone} onChange={setPhone} />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea id="message" rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
              {error && <p className="error-text">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
