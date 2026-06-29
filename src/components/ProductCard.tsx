import { Link } from 'react-router-dom'
import { AVAILABILITY_LABELS } from '../constants/navigation'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
}

/** A single clickable card in the product grid, showing the first image, category, and availability */
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/models/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          loading="lazy"
        />
        <span className="category-chip">{product.category}</span>
        <span
          className={`availability-badge ${product.availability === 'ready' ? 'ready' : 'made-on-request'}`}
        >
          {AVAILABILITY_LABELS[product.availability] ?? product.availability}
        </span>
      </div>
      <div className="product-card-info">
        <h3>{product.name}</h3>
        {product.availability === 'made-on-request' && product.estimatedProductionTime && (
          <p className="prod-time">Est. {product.estimatedProductionTime}</p>
        )}
      </div>
    </Link>
  )
}
