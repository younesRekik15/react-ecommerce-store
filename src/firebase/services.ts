import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from './config'
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../constants/cloudinary'
import type { Product, OrderRequest, ContactMessage } from '../types'

/* ---- Collection references ---- */
const productsRef = collection(db, 'products')
const ordersRef = collection(db, 'orders')
const contactsRef = collection(db, 'contacts')

/** Fetch all products, newest first */
export async function getProducts(): Promise<Product[]> {
  const q = query(productsRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product))
}

/** Fetch the `n` most recent products */
export async function getRecentProducts(n: number = 4): Promise<Product[]> {
  const q = query(productsRef, orderBy('createdAt', 'desc'), limit(n))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product))
}

/** Fetch a single product by its Firestore document ID */
export async function getProductById(id: string): Promise<Product | null> {
  const snapshot = await getDoc(doc(db, 'products', id))
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as Product
}

/** Submit a new order request (without id / createdAt — those are generated server-side) */
export async function submitOrderRequest(
  data: Omit<OrderRequest, 'id' | 'createdAt'>,
): Promise<string> {
  const docRef = await addDoc(ordersRef, { ...data, createdAt: Timestamp.now() })
  return docRef.id
}

/** Submit a contact message (without id / createdAt) */
export async function submitContactMessage(
  data: Omit<ContactMessage, 'id' | 'createdAt'>,
): Promise<string> {
  const docRef = await addDoc(contactsRef, { ...data, createdAt: Timestamp.now() })
  return docRef.id
}

/** Upload an image to Cloudinary and return its secure URL */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || 'Cloudinary upload failed')
  }

  const data = await res.json()
  return data.secure_url as string
}

/** Add a new product to the catalogue */
export async function addProduct(
  data: Omit<Product, 'id' | 'createdAt'>,
): Promise<string> {
  const docRef = await addDoc(productsRef, { ...data, createdAt: serverTimestamp() })
  return docRef.id
}

/** Update an existing product */
export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, 'id' | 'createdAt'>>,
): Promise<void> {
  await updateDoc(doc(db, 'products', id), data)
}

/** Delete a product */
export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id))
}

/** Fetch all order requests, newest first */
export async function getOrders(): Promise<OrderRequest[]> {
  const q = query(ordersRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as OrderRequest))
}

/** Update the status of an order */
export async function updateOrderStatus(
  id: string,
  status: OrderRequest['status'],
): Promise<void> {
  await updateDoc(doc(db, 'orders', id), { status })
}

/** Fetch all contact messages, newest first */
export async function getContactMessages(): Promise<ContactMessage[]> {
  const q = query(contactsRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessage))
}

/** Mark a contact message as read */
export async function markContactRead(id: string): Promise<void> {
  await updateDoc(doc(db, 'contacts', id), { status: 'read' })
}
