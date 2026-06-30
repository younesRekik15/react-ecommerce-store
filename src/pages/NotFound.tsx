import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Page Not Found')
  return (
    <div className="not-found-page container section">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  )
}
