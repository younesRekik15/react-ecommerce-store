/** Whether a product is ready to ship or made to order */
export type Availability = 'ready' | 'made-on-request'

/** A product / model listed in the catalogue */
export interface Product {
  id: string
  name: string
  description: string
  category: string
  images: string[]
  availability: Availability
  estimatedProductionTime: string | null
  colors: string[]
  printingOptions: boolean
  createdAt: Date
}

/** A customisation + customer-info bundle submitted as an order */
export interface OrderRequest {
  id?: string
  productId: string
  productName: string
  customerName: string
  phone: string
  email: string
  customization: {
    color: string
    printDesign: string | null
    customImage: string | null
  }
  message: string
  status: 'pending' | 'confirmed' | 'completed'
  createdAt: Date
}

/** A message submitted via the Contact form */
export interface ContactMessage {
  id?: string
  name: string
  email: string
  phone: string
  message: string
  status: 'new' | 'read'
  createdAt: Date
}
