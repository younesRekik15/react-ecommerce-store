import { useSearchParams, Link } from 'react-router-dom'

export default function Feedback() {
  const [params] = useSearchParams()
  const success = params.get('status') === 'success'

  return (
    <div className="feedback-page container section">
      <div className={`feedback-card ${success ? 'success' : 'failure'}`}>
        <div className="feedback-icon">
          {success ? '&#10003;' : '&#10007;'}
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
