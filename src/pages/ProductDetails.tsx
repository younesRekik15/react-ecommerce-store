import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import OrderForm from '../components/OrderForm'
import { getProductById } from '../firebase/services'
import { AVAILABILITY_LABELS } from '../constants/navigation'
import { usePageTitle } from '../hooks/usePageTitle'
import type { Product } from '../types'

/** Full product detail page with image gallery and customisation form */
export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [prevImageIdx, setPrevImageIdx] = useState<number | null>(null)

  usePageTitle(product?.name)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getProductById(id)
      .then((p) => {
        setProduct(p)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const prevImage = useCallback(() => {
    if (!product) return
    setPrevImageIdx(selectedImage)
    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }, [product, selectedImage])

  const nextImage = useCallback(() => {
    if (!product) return
    setPrevImageIdx(selectedImage)
    setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }, [product, selectedImage])

  /* ---- Keyboard navigation ---- */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [prevImage, nextImage])

  /* ---- Loading skeleton ---- */
  if (loading) {
    return (
      <div className="product-details container section">
        <div className="product-details-layout">
          <div className="product-gallery">
            <div className="skeleton" style={{ aspectRatio: '1 / 1', borderRadius: 'var(--radius-lg)' }} />
          </div>
          <div className="product-info">
            <div className="skeleton" style={{ height: 36, width: '70%', marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 80, width: '100%', marginBottom: 24 }} />
            <div className="skeleton" style={{ height: 24, width: '40%', marginBottom: 36 }} />
            <div className="skeleton" style={{ height: 200, width: '100%' }} />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return <div className="section container"><p>Product not found.</p></div>

  const imgCount = product.images.length

  return (
    <div className="product-details container section page-enter">
      <div className="product-details-layout">
        {/* ---- Image gallery ---- */}
        <div className="product-gallery">
          <div className="gallery-main">
            <div className="gallery-image-container">
              {prevImageIdx !== null && prevImageIdx !== selectedImage && (
                <img
                  key={`prev-${prevImageIdx}`}
                  src={product.images[prevImageIdx] || '/placeholder.svg'}
                  alt=""
                  className="leaving"
                />
              )}
              <img
                key={selectedImage}
                src={product.images[selectedImage] || '/placeholder.svg'}
                alt={product.name}
                className="entering"
              />
            </div>

            {imgCount > 1 && (
              <>
                <button
                  className="gallery-arrow gallery-arrow-prev"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  className="gallery-arrow gallery-arrow-next"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
                <span className="gallery-counter">
                  {selectedImage + 1} / {imgCount}
                </span>
              </>
            )}
          </div>

          {imgCount > 1 && (
            <div className="gallery-thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`thumb-btn ${i === selectedImage ? 'active' : ''}`}
                  onClick={() => {
                    setPrevImageIdx(selectedImage)
                    setSelectedImage(i)
                  }}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---- Product info + order form ---- */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>

          <div className="product-meta">
            <span
              className={`availability-badge ${product.availability === 'ready' ? 'ready' : 'made-on-request'}`}
            >
              {AVAILABILITY_LABELS[product.availability] ?? product.availability}
            </span>
            {product.estimatedProductionTime && (
              <span className="prod-time">Est. {product.estimatedProductionTime}</span>
            )}
          </div>

          <OrderForm product={product} />
        </div>
      </div>
    </div>
  )
}
