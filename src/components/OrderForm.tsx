import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitOrderRequest, uploadImage } from '../firebase/services'
import { PRINT_DESIGN_OPTIONS } from '../constants/navigation'
import ColorSwatches from './ColorSwatches'
import PhoneInput from './PhoneInput'
import type { Product } from '../types'

interface OrderFormProps {
  product: Product
}

export default function OrderForm({ product }: OrderFormProps) {
  const navigate = useNavigate()

  const [color, setColor] = useState(product.colors[0] || '')
  const [printDesign, setPrintDesign] = useState('')
  const [customImage, setCustomImage] = useState<File | null>(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+216 ')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone) return

    setSubmitting(true)
    try {
      let customImageUrl: string | null = null
      if (customImage) {
        customImageUrl = await uploadImage(customImage)
      }
      await submitOrderRequest({
        productId: product.id,
        productName: product.name,
        customerName: name,
        phone,
        email,
        customization: {
          color,
          printDesign: printDesign || null,
          customImage: customImageUrl,
        },
        message,
        status: 'pending',
      })
      navigate('/feedback?status=success')
    } catch {
      navigate('/feedback?status=failure')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="order-form">
      {product.colors.length > 0 && (
        <div className="form-group">
          <label>Color</label>
          <ColorSwatches
            colors={product.colors}
            selected={color}
            onChange={setColor}
          />
        </div>
      )}

      {product.printingOptions && (
        <>
          <div className="form-group">
            <label>Print Design</label>
            <select value={printDesign} onChange={(e) => setPrintDesign(e.target.value)}>
              {PRINT_DESIGN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Upload Custom Image</label>
            <label className="file-dropzone">
              <svg className="file-dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="file-dropzone-text">
                {customImage ? (
                  <>{customImage.name} <small>(click to change)</small></>
                ) : (
                  <><strong>Click to upload</strong> or drag &amp; drop</>
                )}
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCustomImage(e.target.files?.[0] || null)}
              />
            </label>
            <small>Subject to approval</small>
          </div>
        </>
      )}

      <div className="order-summary">
        <h4>Order Summary</h4>
        <p>Product: {product.name}</p>
        {color && <p>Color: {color}</p>}
        {printDesign && <p>Print: {printDesign}</p>}
        {customImage && <p>Custom image uploaded</p>}
      </div>

      <fieldset className="form-fieldset">
        <legend>Your Information</legend>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <PhoneInput
            id="phone"
            required
            value={phone}
            onChange={setPhone}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="message">Additional Notes</label>
          <textarea id="message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
      </fieldset>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Order Request'}
      </button>
    </form>
  )
}
