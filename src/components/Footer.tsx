import { Link } from 'react-router-dom'
import { NAV_LINKS } from '../constants/navigation'

/** Site footer with quick links, contact info, social icons, and newsletter */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        {/* ---- Brand ---- */}
        <div className="footer-col">
          <h3>StitchCraft</h3>
          <p>Handmade fabric products crafted with care.</p>
          <div className="footer-newsletter">
            <input type="email" placeholder="Your email" aria-label="Email for newsletter" />
            <button type="button">Subscribe</button>
          </div>
        </div>

        {/* ---- Quick links ---- */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ---- Contact ---- */}
        <div className="footer-col">
          <h4>Contact</h4>
          <div className="footer-contact-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            <span>+216 99 726 805</span>
          </div>
          <div className="footer-contact-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>younesrekik347@gmail.com</span>
          </div>
        </div>

        {/* ---- Social ---- */}
        <div className="footer-col">
          <h4>Follow Us</h4>
          <div className="footer-social">
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a href="#" aria-label="Pinterest">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.087-.79-.166-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.776 0 3.143-1.873 3.143-4.577 0-2.394-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.78.744 2.28a.3.3 0 01.069.288c-.076.316-.245.995-.278 1.135-.044.183-.145.222-.335.134-1.249-.58-2.03-2.404-2.03-3.873 0-3.153 2.292-6.05 6.608-6.05 3.469 0 6.165 2.473 6.165 5.78 0 3.45-2.175 6.228-5.195 6.228-1.014 0-1.967-.527-2.294-1.15l-.625 2.383c-.226.87-.838 1.96-1.247 2.624a10 10 0 003.22.536c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} StitchCraft. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
