export type Availability = 'ready' | 'made-on-request'

export interface Product {
  id: string
  name: string
  description: string
  category: string
  images: string[]
  availability: Availability
  estimatedProductionTime: string | null
  colors: string[]
  stitchingPatterns: string[]
  optionalAccessories: string[]
  printingOptions: boolean
  createdAt: Date
}

export interface OrderRequest {
  id?: string
  productId: string
  productName: string
  customerName: string
  phone: string
  email: string
  customization: {
    color: string
    stitchingPattern: string
    accessories: string[]
    printDesign: string | null
    customImage: string | null
  }
  message: string
  status: 'pending' | 'confirmed' | 'completed'
  createdAt: Date
}

export interface ContactMessage {
  id?: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: Date
}
