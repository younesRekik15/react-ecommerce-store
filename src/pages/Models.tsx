import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../firebase/services'
import type { Product, Availability } from '../types'

const categories = ['bags', 'pencil cases', 'purses', 'accessories']

export default function Models() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [availability, setAvailability] = useState<Availability | ''>('')

  useEffect(() => {
    getProducts().then(setProducts).catch(() => {})
  }, [])

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (category && p.category !== category) return false
    if (availability && p.availability !== availability) return false
    return true
  })

  return (
    <div className="models-page container section">
      <h1 className="section-title">Models</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value as Availability | '')}
          className="filter-select"
        >
          <option value="">All Availability</option>
          <option value="ready">Ready</option>
          <option value="made-on-request">Made on Request</option>
        </select>
      </div>

      <div className="product-grid">
        {filtered.length > 0 ? (
          filtered.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p className="text-muted">No products match your criteria.</p>
        )}
      </div>
    </div>
  )
}
