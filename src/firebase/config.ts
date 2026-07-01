import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAaDrvd6nzCzw6fYYe_u-z19CoNgEhm-jA",
  authDomain: "stitchcraft-8d718.firebaseapp.com",
  projectId: "stitchcraft-8d718",
  storageBucket: "stitchcraft-8d718.firebasestorage.app",
  messagingSenderId: "264456624166",
  appId: "1:264456624166:web:00b26877b8c677398feee7",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
