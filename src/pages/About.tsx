import { usePageTitle } from '../hooks/usePageTitle'

/** About page — brand story, process, and mission */
export default function About() {
  usePageTitle('About Us')
  return (
    <div className="about-page container section page-enter">
      <h1 className="section-title">About Us</h1>

      <div className="about-content">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            I'm Younes, a sewist based in Tunisia. What started as watching YouTube
            creators like <strong>Miko Craft</strong> and <strong>Sewing Time</strong>
            quickly became a passion for making things with my own hands.
          </p>

          <h2>What I Make</h2>
          <p>
            Bags, pencil cases, stitched kitchen accessories — all made to order
            with your choice of fabric and colors.
          </p>

          <h2>The Process</h2>
          <p>
            From cutting the fabric to the final stitch, each piece is made start to
            finish on a home sewing machine, with care and attention to quality.
          </p>

          <div className="pull-quote">
            Made on a home sewing machine, one piece at a time.
          </div>
        </div>

        <div className="about-image-area">
          <span className="about-image-label">My Workspace</span>
        </div>
      </div>
    </div>
  )
}
