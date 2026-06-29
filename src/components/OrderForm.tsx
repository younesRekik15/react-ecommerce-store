import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitOrderRequest } from '../firebase/services'
import { PRINT_DESIGN_OPTIONS } from '../constants/navigation'
import ColorSwatches from './ColorSwatches'
import PhoneInput from './PhoneInput'
import type { Product } from '../types'

interface OrderFormProps {
  product: Product
}

/**
 * Customisation + customer-info form for placing an order request.
 * Submits the data via Firestore and navigates to the feedback page.
 */
export default function OrderForm({ product }: OrderFormProps) {
  const navigate = useNavigate()

  /* ---- Customisation state ---- */
  const [color, setColor] = useState(product.colors[0] || '')
  const [stitching, setStitching] = useState(product.stitchingPatterns[0] || '')
  const [accessories, setAccessories] = useState<string[]>([])
  const [printDesign, setPrintDesign] = useState('')
  const [customImage, setCustomImage] = useState<File | null>(null)

  /* ---- Customer info state ---- */
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+216 ')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  /** Toggle an optional accessory on / off */
  function toggleAccessory(accessory: string) {
    setAccessories((prev) =>
      prev.includes(accessory)
        ? prev.filter((x) => x !== accessory)
        : [...prev, accessory],
    )
  }

  /** Persist the order to Firestore and redirect to the feedback page */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone) return

    setSubmitting(true)
    try {
      await submitOrderRequest({
        productId: product.id,
        productName: product.name,
        customerName: name,
        phone,
        email,
        customization: {
          color,
          stitchingPattern: stitching,
          accessories,
          printDesign: printDesign || null,
          customImage: customImage ? customImage.name : null,
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
      {/* ---- Colour picker (swatches) ---- */}
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

      {/* ---- Stitching pattern ---- */}
      {product.stitchingPatterns.length > 0 && (
        <div className="form-group">
          <label>Stitching Pattern</label>
          <select value={stitching} onChange={(e) => setStitching(e.target.value)}>
            {product.stitchingPatterns.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* ---- Optional accessories ---- */}
      {product.optionalAccessories.length > 0 && (
        <div className="form-group">
          <label>Optional Accessories</label>
          {product.optionalAccessories.map((a) => (
            <label key={a} className="checkbox-label">
              <input
                type="checkbox"
                checked={accessories.includes(a)}
                onChange={() => toggleAccessory(a)}
              />
              {a}
            </label>
          ))}
        </div>
      )}

      {/* ---- Printing options ---- */}
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

      {/* ---- Order summary ---- */}
      <div className="order-summary">
        <h4>Order Summary</h4>
        <p>Product: {product.name}</p>
        {color && <p>Color: {color}</p>}
        {stitching && <p>Stitching: {stitching}</p>}
        {accessories.length > 0 && <p>Accessories: {accessories.join(', ')}</p>}
        {printDesign && <p>Print: {printDesign}</p>}
        {customImage && <p>Custom image uploaded</p>}
      </div>

      {/* ---- Customer information ---- */}
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
