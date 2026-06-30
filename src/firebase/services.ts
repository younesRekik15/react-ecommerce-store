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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './config'
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

/** Upload a file to Firebase Storage and return its download URL */
export async function uploadImage(file: File): Promise<string> {
  const storageRef = ref(storage, `custom-images/${Date.now()}_${file.name}`)
  const result = await uploadBytes(storageRef, file)
  return getDownloadURL(result.ref)
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
