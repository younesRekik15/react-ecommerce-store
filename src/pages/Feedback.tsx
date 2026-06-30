import { useSearchParams, Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

/** Feedback page shown after an order is submitted (success / failure) */
export default function Feedback() {
  usePageTitle('Order Submitted')
  const [params] = useSearchParams()
  const success = params.get('status') === 'success'

  return (
    <div className="feedback-page container section page-enter">
      <div className={`feedback-card ${success ? 'success' : 'failure'}`}>
        <div className="feedback-icon">
          {success ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </div>
        <h1>{success ? 'Order Request Submitted!' : 'Something Went Wrong'}</h1>
        <p>
          {success
            ? 'Thank you! We have received your order request. We will contact you by phone to confirm the details and finalize your order.'
            : 'We were unable to process your order request. Please try again or contact us directly.'}
        </p>
        <div className="feedback-actions">
          {!success && (
            <Link to="/models" className="btn btn-secondary">
              Try Again
            </Link>
          )}
          <Link to="/" className="btn btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
