import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getRecentProducts } from '../firebase/services'
import type { Product } from '../types'

export default function Home() {
  const [recent, setRecent] = useState<Product[]>([])

  useEffect(() => {
    getRecentProducts(4).then(setRecent).catch(() => {})
  }, [])

  return (
    <>
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content container">
          <h1>Handcrafted with Love</h1>
          <p>Unique fabric accessories made just for you.</p>
          <Link to="/models" className="btn btn-primary">
            Browse Models
          </Link>
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">Recently Added</h2>
        <div className="product-grid">
          {recent.length > 0 ? (
            recent.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p className="text-muted">No products yet. Check back soon!</p>
          )}
        </div>
      </section>
    </>
  )
}
