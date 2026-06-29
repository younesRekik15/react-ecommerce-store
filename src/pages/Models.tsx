import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../firebase/services'
import { CATEGORIES, AVAILABILITY_LABELS } from '../constants/navigation'
import type { Product, Availability } from '../types'

/** Catalogue page with search, category, and availability filters */
export default function Models() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [availability, setAvailability] = useState<Availability | ''>('')

  useEffect(() => {
    getProducts().then(setProducts).catch((err) => console.error('Models:', err))
  }, [])

  /** Apply client-side filters */
  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (category && p.category !== category) return false
    if (availability && p.availability !== availability) return false
    return true
  })

  const hasFilters = search || category || availability

  return (
    <div className="models-page container section page-enter">
      <h1 className="section-title">Models</h1>

      {/* ---- Filters ---- */}
      <div className="filters">
        <div className="search-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
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
          {Object.entries(AVAILABILITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* ---- Active filter chips ---- */}
      {hasFilters && (
        <div className="filter-chips">
          {search && (
            <button className="filter-chip" onClick={() => setSearch('')}>
              Search: "{search}"
              <span className="filter-chip-remove">&times;</span>
            </button>
          )}
          {category && (
            <button className="filter-chip" onClick={() => setCategory('')}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
              <span className="filter-chip-remove">&times;</span>
            </button>
          )}
          {availability && (
            <button className="filter-chip" onClick={() => setAvailability('')}>
              {AVAILABILITY_LABELS[availability] ?? availability}
              <span className="filter-chip-remove">&times;</span>
            </button>
          )}
        </div>
      )}

      {/* ---- Result count ---- */}
      <p className="result-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>

      {/* ---- Product grid or empty state ---- */}
      <div className="product-grid">
        {filtered.length > 0 ? (
          filtered.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M8 11h6" />
            </svg>
            <p className="text-muted">No products match your criteria.</p>
            <button className="btn btn-outline" onClick={() => { setSearch(''); setCategory(''); setAvailability('') }}>
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
