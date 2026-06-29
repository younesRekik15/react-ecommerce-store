import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../constants/navigation'

/** Sticky navigation bar with mobile hamburger toggle */
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  /* Close drawer on route change */
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner container">
          <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
            <span className="navbar-logo-mark">S</span>
            StitchCraft
          </Link>

          {/* ---- Hamburger toggle ---- */}
          <button
            className={`navbar-toggle ${open ? 'open' : ''}`}
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>

          {/* ---- Nav links ---- */}
          <ul className={`navbar-links ${open ? 'visible' : ''}`}>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ---- Mobile overlay ---- */}
      <div
        className={`navbar-overlay ${open ? 'visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
    </>
  )
}
