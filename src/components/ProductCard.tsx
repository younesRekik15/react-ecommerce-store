import { Link } from 'react-router-dom'
import type { Product } from '../types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <Link to={`/models/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          loading="lazy"
        />
        <span
          className={`availability-badge ${product.availability === 'ready' ? 'ready' : 'made-on-request'}`}
        >
          {product.availability === 'ready' ? 'Ready' : 'Made on Request'}
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
