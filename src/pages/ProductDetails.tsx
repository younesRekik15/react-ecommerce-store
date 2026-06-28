import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById, submitOrderRequest } from '../firebase/services'
import type { Product } from '../types'

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  const [color, setColor] = useState('')
  const [stitching, setStitching] = useState('')
  const [accessories, setAccessories] = useState<string[]>([])
  const [printDesign, setPrintDesign] = useState('')
  const [customImage, setCustomImage] = useState<File | null>(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    getProductById(id)
      .then((p) => {
        setProduct(p)
        if (p) {
          setColor(p.colors[0] || '')
          setStitching(p.stitchingPatterns[0] || '')
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  function toggleAccessory(a: string) {
    setAccessories((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product || !name || !phone) return
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

  if (loading) return <div className="section container"><p>Loading...</p></div>
  if (!product) return <div className="section container"><p>Product not found.</p></div>

  return (
    <div className="product-details container section">
      <div className="product-details-layout">
        <div className="product-gallery">
          <div className="gallery-main">
            <img
              src={product.images[selectedImage] || '/placeholder.svg'}
              alt={product.name}
            />
          </div>
          {product.images.length > 1 && (
            <div className="gallery-thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`thumb-btn ${i === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>

          <div className="product-meta">
            <span
              className={`availability-badge ${product.availability === 'ready' ? 'ready' : 'made-on-request'}`}
            >
              {product.availability === 'ready' ? 'Ready' : 'Made on Request'}
            </span>
            {product.estimatedProductionTime && (
              <span className="prod-time">Est. {product.estimatedProductionTime}</span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="order-form">
            {product.colors.length > 0 && (
              <div className="form-group">
                <label>Color</label>
                <div className="color-options">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`color-btn ${color === c ? 'active' : ''}`}
                      onClick={() => setColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

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

            {product.printingOptions && (
              <>
                <div className="form-group">
                  <label>Print Design</label>
                  <select value={printDesign} onChange={(e) => setPrintDesign(e.target.value)}>
                    <option value="">None</option>
                    <option value="floral">Floral</option>
                    <option value="geometric">Geometric</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Upload Custom Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCustomImage(e.target.files?.[0] || null)}
                  />
                  <small>Subject to approval</small>
                </div>
              </>
            )}

            <div className="order-summary">
              <h4>Order Summary</h4>
              <p>Product: {product.name}</p>
              {color && <p>Color: {color}</p>}
              {stitching && <p>Stitching: {stitching}</p>}
              {accessories.length > 0 && <p>Accessories: {accessories.join(', ')}</p>}
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
                <input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
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
        </div>
      </div>
    </div>
  )
}
