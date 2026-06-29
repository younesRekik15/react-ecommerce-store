/** Static "About Us" page describing the brand story and mission */
export default function About() {
  return (
    <div className="about-page container section page-enter">
      <h1 className="section-title">About Us</h1>

      <div className="about-content">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            StitchCraft was born from a passion for handmade craftsmanship and a love for
            unique, functional art. Every piece is carefully designed and stitched by hand,
            combining traditional techniques with modern aesthetics.
          </p>

          <h2>The Process</h2>
          <p>
            From selecting the finest fabrics to the final stitch, each product goes through
            a meticulous handmade process. We believe in quality over quantity, creating
            pieces that are built to last.
          </p>

          <h2>Our Mission</h2>
          <p>
            We create sustainable, handmade fabric accessories that bring joy to everyday
            life. Every purchase supports local craftsmanship and helps preserve traditional
            skills.
          </p>

          <div className="pull-quote">
            Every stitch tells a story of tradition, care, and creativity.
          </div>
        </div>

        <div className="about-image-area">
          <span className="about-image-label">Workshop</span>
        </div>
      </div>
    </div>
  )
}
