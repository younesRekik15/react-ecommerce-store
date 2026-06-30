import { usePageTitle } from '../hooks/usePageTitle'

export default function Privacy() {
  usePageTitle('Privacy Policy')
  return (
    <div className="legal-page container section">
      <h1>Privacy Policy</h1>
      <p className="legal-date">Last updated: June 2026</p>

      <h2>Information We Collect</h2>
      <p>
        When you submit an order request or contact form on StitchCraft, we collect your
        name, email address, phone number, and any customization details you provide.
        This information is used solely to process your order and communicate with you.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        We use your information to respond to your inquiries, fulfil your order requests,
        and improve our products and services. We do not sell, rent, or share your
        personal data with third parties except as required by law.
      </p>

      <h2>Data Storage</h2>
      <p>
        Your data is stored securely using Firebase (Google Cloud Platform). We retain
        your information only as long as necessary to provide our services or comply with
        legal obligations.
      </p>

      <h2>Your Rights</h2>
      <p>
        You have the right to request access to, correction of, or deletion of your
        personal data. To exercise these rights, please contact us at
        younesrekik347@gmail.com.
      </p>

      <h2>Cookies</h2>
      <p>
        This website does not use cookies or tracking scripts beyond what is strictly
        necessary for the functioning of the site.
      </p>

      <h2>Contact</h2>
      <p>
        If you have any questions about this privacy policy, please reach out via our
        <a href="/contact"> contact page</a> or email us at younesrekik347@gmail.com.
      </p>
    </div>
  )
}
