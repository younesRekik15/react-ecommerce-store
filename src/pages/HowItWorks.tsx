const steps = [
  {
    icon: '01',
    title: 'Browse',
    desc: 'Explore our collection of handmade fabric products and find the perfect piece.',
  },
  {
    icon: '02',
    title: 'Customize',
    desc: 'Select colors, patterns, and accessories to make it uniquely yours.',
  },
  {
    icon: '03',
    title: 'Submit Order',
    desc: 'Fill in your details and submit your order request. No payment required yet.',
  },
  {
    icon: '04',
    title: 'Confirmation Call',
    desc: 'We will call you to confirm the details, finalize pricing, and arrange delivery.',
  },
]

export default function HowItWorks() {
  return (
    <div className="how-it-works container section">
      <h1 className="section-title">How It Works</h1>
      <p className="section-subtitle">
        Getting your custom handmade product is simple.
      </p>

      <div className="steps-grid">
        {steps.map((step, i) => (
          <div key={i} className="step-card">
            <div className="step-number">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
