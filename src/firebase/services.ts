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
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './config'
import type { Product, OrderRequest, ContactMessage } from '../types'

const productsRef = collection(db, 'products')
const ordersRef = collection(db, 'orders')
const contactsRef = collection(db, 'contacts')

export async function getProducts(): Promise<Product[]> {
  const q = query(productsRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product))
}

export async function getRecentProducts(n: number = 4): Promise<Product[]> {
  const q = query(productsRef, orderBy('createdAt', 'desc'), limit(n))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product))
}

export async function getProductById(id: string): Promise<Product | null> {
  const snapshot = await getDoc(doc(db, 'products', id))
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as Product
}

export async function submitOrderRequest(
  data: Omit<OrderRequest, 'id' | 'createdAt'>
): Promise<string> {
  const docRef = await addDoc(ordersRef, {
    ...data,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export async function submitContactMessage(
  data: Omit<ContactMessage, 'id' | 'createdAt'>
): Promise<string> {
  const docRef = await addDoc(contactsRef, {
    ...data,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export async function uploadImage(file: File): Promise<string> {
  const storageRef = ref(storage, `custom-images/${Date.now()}_${file.name}`)
  const result = await uploadBytes(storageRef, file)
  return getDownloadURL(result.ref)
}
