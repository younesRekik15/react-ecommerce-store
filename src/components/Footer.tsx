import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-col">
          <h3>StitchCraft</h3>
          <p>Handmade fabric products crafted with care.</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/models">Models</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <p>Phone: +212 6XX XXX XXX</p>
          <p>Email: hello@stitchcraft.ma</p>
        </div>

        <div className="footer-col">
          <h4>Follow Us</h4>
          <div className="footer-social">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Pinterest">PN</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} StitchCraft. All rights reserved.</p>
      </div>
    </footer>
  )
}
