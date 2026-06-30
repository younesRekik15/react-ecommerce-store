import { useState, useEffect } from 'react'
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'
import { getProducts, addProduct, updateProduct, deleteProduct, uploadImage } from '../firebase/services'
import type { Product, Availability } from '../types'

interface ProductForm {
  name: string
  description: string
  category: string
  images: string[]
  availability: Availability
  estimatedProductionTime: string
  colors: string[]
  stitchingPatterns: string[]
  optionalAccessories: string[]
  printingOptions: boolean
}

const emptyForm: ProductForm = {
  name: '',
  description: '',
  category: '',
  images: [],
  availability: 'made-on-request',
  estimatedProductionTime: '',
  colors: [],
  stitchingPatterns: [],
  optionalAccessories: [],
  printingOptions: false,
}

export default function Admin() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    if (user) loadProducts()
  }, [user])

  useEffect(() => {
    if (!error && !success) return
    const t = setTimeout(() => { setError(''); setSuccess('') }, 5000)
    return () => clearTimeout(t)
  }, [error, success])

  async function loadProducts() {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch {
      setError('Failed to load products')
    }
  }

  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Login failed')
      }
    }
  }

  async function handleLogout() {
    await signOut(auth)
    setForm(emptyForm)
    setEditingId(null)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleArrayField(name: 'colors' | 'stitchingPatterns' | 'optionalAccessories', value: string) {
    setForm((prev) => ({ ...prev, [name]: value.split('\n').map((s) => s.trim()).filter(Boolean) }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        const url = await uploadImage(file)
        urls.push(url)
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }))
    } catch {
      setError('Image upload failed')
    }
    setUploading(false)
  }

  function removeImage(idx: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      const data = {
        ...form,
        estimatedProductionTime: form.estimatedProductionTime || null,
      }
      if (editingId) {
        await updateProduct(editingId, data)
        setSuccess('Product updated')
      } else {
        await addProduct(data)
        setSuccess('Product added')
      }
      setForm(emptyForm)
      setEditingId(null)
      await loadProducts()
    } catch (err: any) {
      setError(err.message || 'Failed to save product')
    }
    setSaving(false)
  }

  function handleEdit(product: Product) {
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      images: product.images,
      availability: product.availability,
      estimatedProductionTime: product.estimatedProductionTime || '',
      colors: product.colors,
      stitchingPatterns: product.stitchingPatterns,
      optionalAccessories: product.optionalAccessories,
      printingOptions: product.printingOptions,
    })
    setEditingId(product.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      setSuccess('Product deleted')
      await loadProducts()
    } catch {
      setError('Failed to delete product')
    }
  }

  /* ---- Login screen ---- */
  if (loading) {
    return <div className="admin-page"><div className="admin-loading">Loading...</div></div>
  }

  if (!user) {
    return (
      <div className="admin-page">
        <div className="admin-login-card">
          <h1>Admin Login</h1>
          <p className="admin-login-sub">Sign in with your Google account to manage products.</p>
          <button className="admin-btn admin-btn-google" onClick={handleGoogleLogin}>
            <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.7 5-6.4 8-11.3 8-3.7 0-7.2-1.5-9.7-4.1s-4-6-4-9.9 1.5-7.2 4-9.9S20.3 8 24 8c3.3 0 6.3 1.3 8.6 3.4l5.6-5.7C34.4 2.2 29.5 0 24 0 14.5 0 6.6 5.5 2.9 13.4 1.1 17 .1 21.4.1 26s1 9 2.9 12.6C6.6 46.5 14.5 52 24 52c5.3 0 10.2-1.6 14.1-4.7 4.3-3.4 7.1-8.4 8.1-14.1.4-2 .6-4.1.6-6.2 0-1.1-.1-2.2-.2-3.9z"/>
              <path fill="#FF3D00" d="M2.9 13.4L9.6 18.4c1.8-4.7 6.1-8.2 11.1-9.6C25.1 7.4 30 8.7 33.6 12l5.6-5.7C34.4 2.2 29.5 0 24 0 14.5 0 6.6 5.5 2.9 13.4z"/>
              <path fill="#4CAF50" d="M24 52c5.3 0 10.2-1.6 14.1-4.7 3.7-2.9 6.2-6.9 7.6-11.3l-8.3-5.4c-2.1 3.2-5.7 5.3-10.1 5.3-4.8 0-9.1-3.1-10.6-7.8l-9.5 5.1c2.6 5.1 8.1 8.8 14.5 8.8 3.3 0 6.3-.9 9-2.5z"/>
              <path fill="#1976D2" d="M46.1 21.2c.3 1.6.5 3.2.5 4.8 0 3.9-.8 7.7-2.4 11.1-1.4 3.1-3.5 5.8-6.1 7.9l-8.3-5.4c1.7-1.1 3.1-2.7 4-4.6l-9.7-5.9v-8l20.9-12.6c1.1 2.9 1.8 6 1.9 9.3-.1.3-.1.7-.1 1z"/>
            </svg>
            Sign in with Google
          </button>
          {error && <p className="admin-error">{error}</p>}
        </div>
      </div>
    )
  }

  /* ---- Dashboard ---- */
  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-header-right">
          <span className="admin-email">{user.email}</span>
          <button className="admin-btn admin-btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="admin-main">
        {error && <p className="admin-error">{error}</p>}
        {success && <p className="admin-success">{success}</p>}

        {/* ---- Form ---- */}
        <form className="admin-form" onSubmit={handleSave}>
          <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="admin-field">
              <label>Category</label>
              <input name="category" value={form.category} onChange={handleChange} required />
            </div>
            <div className="admin-field admin-field-full">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} required />
            </div>
            <div className="admin-field">
              <label>Availability</label>
              <select name="availability" value={form.availability} onChange={handleChange}>
                <option value="ready">Ready</option>
                <option value="made-on-request">Made on Request</option>
              </select>
            </div>
            <div className="admin-field">
              <label>Est. Production Time</label>
              <input name="estimatedProductionTime" value={form.estimatedProductionTime} onChange={handleChange} placeholder="e.g. 1-2 weeks" />
            </div>
            <div className="admin-field">
              <label>Printing Option</label>
              <label className="admin-check-label">
                <input type="checkbox" checked={form.printingOptions} onChange={(e) => setForm((prev) => ({ ...prev, printingOptions: e.target.checked }))} />
                Available
              </label>
            </div>
            <div className="admin-field admin-field-full">
              <label>Colors (one per line)</label>
              <textarea value={form.colors.join('\n')} onChange={(e) => handleArrayField('colors', e.target.value)} rows={3} />
            </div>
            <div className="admin-field admin-field-full">
              <label>Stitching Patterns (one per line)</label>
              <textarea value={form.stitchingPatterns.join('\n')} onChange={(e) => handleArrayField('stitchingPatterns', e.target.value)} rows={3} />
            </div>
            <div className="admin-field admin-field-full">
              <label>Optional Accessories (one per line)</label>
              <textarea value={form.optionalAccessories.join('\n')} onChange={(e) => handleArrayField('optionalAccessories', e.target.value)} rows={3} />
            </div>

            <div className="admin-field admin-field-full">
              <label>Images</label>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
              {uploading && <p className="admin-muted">Uploading...</p>}
              {form.images.length > 0 && (
                <div className="admin-image-list">
                  {form.images.map((url, i) => (
                    <div key={i} className="admin-image-item">
                      <img src={url} alt="" />
                      <button type="button" className="admin-btn-remove" onClick={() => removeImage(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="admin-form-actions">
            {editingId && (
              <button type="button" className="admin-btn admin-btn-secondary" onClick={handleCancelEdit}>Cancel</button>
            )}
            <button type="submit" className="admin-btn" disabled={saving || uploading}>
              {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>

        {/* ---- Product List ---- */}
        <div className="admin-list">
          <h2>Products ({products.length})</h2>
          {products.map((p) => (
            <div key={p.id} className="admin-list-item">
              <div className="admin-list-item-info">
                {p.images[0] && <img src={p.images[0]} alt="" className="admin-thumb" />}
                <div>
                  <strong>{p.name}</strong>
                  <span className="admin-muted">{p.category} — {p.availability}</span>
                </div>
              </div>
              <div className="admin-list-item-actions">
                <button className="admin-btn admin-btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
