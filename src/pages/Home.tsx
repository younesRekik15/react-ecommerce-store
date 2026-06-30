import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getRecentProducts } from '../firebase/services'
import { usePageTitle } from '../hooks/usePageTitle'
import type { Product } from '../types'

/** Landing page — hero banner + recently added products */
export default function Home() {
  usePageTitle('Handmade Fabric Products')
  const [recent, setRecent] = useState<Product[]>([])

  useEffect(() => {
    getRecentProducts(4).then(setRecent).catch((err) => console.error('Home:', err))
  }, [])

  return (
    <>
      {/* ---- Hero ---- */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Sewn by Hand, Made for You</h1>
          <p>Handcrafted fabric accessories — bags, pencil cases, and kitchen essentials. Every piece made on a home sewing machine.</p>
          <Link to="/models" className="btn btn-primary">
            Browse Models
          </Link>
        </div>
      </section>

      {/* ---- Recently added ---- */}
      <section className="section container page-enter">
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
