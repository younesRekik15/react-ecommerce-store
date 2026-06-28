import { useState } from 'react'
import { submitContactMessage } from '../firebase/services'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
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
    <div className="contact-page container section">
      <h1 className="section-title">Contact Us</h1>

      <div className="contact-layout">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            Have a question or a custom request? We'd love to hear from you.
          </p>
          <ul>
            <li><strong>Phone:</strong> +212 6XX XXX XXX</li>
            <li><strong>Email:</strong> hello@stitchcraft.ma</li>
            <li><strong>Hours:</strong> Mon - Sat, 9 AM - 6 PM</li>
          </ul>
        </div>

        <div className="contact-form-wrapper">
          {sent ? (
            <div className="success-message">
              <span className="success-icon">&#10003;</span>
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
                <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
