/** Navigation link used in the navbar */
export interface NavLink {
  to: string
  label: string
}

/** Main navigation links rendered in the navbar */
export const NAV_LINKS: NavLink[] = [
  { to: '/', label: 'Home' },
  { to: '/models', label: 'Models' },
  { to: '/about', label: 'About' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/contact', label: 'Contact' },
]

/** Product categories used in the filter dropdown */
export const CATEGORIES: string[] = ['bags', 'pencil cases', 'purses', 'accessories']

/** Steps shown on the "How It Works" page */
export interface Step {
  icon: string
  title: string
  desc: string
}

export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    icon: '01',
    title: 'Browse',
    desc: 'Explore our collection of handmade fabric products and find the perfect piece.',
  },
  {
    icon: '02',
    title: 'Customize',
    desc: 'Select colors to make it uniquely yours.',
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

/** Print design options shown when a product supports printing */
export const PRINT_DESIGN_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'None' },
  { value: 'floral', label: 'Floral' },
  { value: 'geometric', label: 'Geometric' },
  { value: 'minimal', label: 'Minimal' },
]

/** Label overrides for availability enum values */
export const AVAILABILITY_LABELS: Record<string, string> = {
  ready: 'Ready',
  'made-on-request': 'Made on Request',
}
