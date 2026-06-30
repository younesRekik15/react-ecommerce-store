import { usePageTitle } from '../hooks/usePageTitle'

export default function Terms() {
  usePageTitle('Terms of Service')
  return (
    <div className="legal-page container section">
      <h1>Terms of Service</h1>
      <p className="legal-date">Last updated: June 2026</p>

      <h2>Orders</h2>
      <p>
        By submitting an order request, you agree to provide accurate and complete
        information. Orders are reviewed manually, and we will contact you to confirm
        details, finalize pricing, and arrange delivery. No payment is collected
        through this website.
      </p>

      <h2>Customization</h2>
      <p>
        Customization options (colors, patterns, accessories, prints) are subject to
        material availability. We will discuss any limitations with you during the
        confirmation call before production begins.
      </p>

      <h2>Production & Delivery</h2>
      <p>
        Estimated production times are provided as guidelines and may vary depending
        on order complexity and current workload. We will keep you informed of any
        changes to the estimated timeline.
      </p>

      <h2>Returns & Exchanges</h2>
      <p>
        Since each product is handmade and often made to order, we carefully inspect
        every item before shipping. If you receive a defective or incorrect item,
        please contact us within 7 days of delivery to arrange a resolution.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All designs, patterns, and product images displayed on this website are the
        intellectual property of StitchCraft. They may not be reproduced or used
        without prior written permission.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        StitchCraft shall not be liable for any indirect, incidental, or consequential
        damages arising from the use of this website or the products purchased through
        it.
      </p>

      <h2>Contact</h2>
      <p>
        For any questions regarding these terms, please visit our
        <a href="/contact"> contact page</a> or email us at younesrekik347@gmail.com.
      </p>
    </div>
  )
}
