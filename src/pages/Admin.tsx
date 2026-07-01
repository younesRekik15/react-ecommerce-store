import { useState, useEffect } from 'react'
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import { usePageTitle } from '../hooks/usePageTitle'
import { auth } from '../firebase/config'
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getOrders,
  updateOrderStatus,
  getContactMessages,
  markContactRead,
} from '../firebase/services'
import type { Product, Availability, OrderRequest, ContactMessage } from '../types'

interface ProductForm {
  name: string
  description: string
  category: string
  images: string[]
  availability: Availability
  estimatedProductionTime: string
  colors: string[]
  printingOptions: boolean
  printAreaPreview: string | null
}

const emptyForm: ProductForm = {
  name: '',
  description: '',
  category: '',
  images: [],
  availability: 'made-on-request',
  estimatedProductionTime: '',
  colors: [],
  printingOptions: false,
  printAreaPreview: null,
}

export default function Admin() {
  usePageTitle('Admin Panel')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ completed: number; total: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [colorInput, setColorInput] = useState('#222222')
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [previewUploading, setPreviewUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [tab, setTab] = useState<'products' | 'orders' | 'contacts'>('products')
  const [orders, setOrders] = useState<OrderRequest[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [statusFilter, setStatusFilter] = useState<OrderRequest['status'] | 'all'>('all')
  const [contacts, setContacts] = useState<ContactMessage[]>([])
  const [expandedContact, setExpandedContact] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!user) return
    loadProducts()
    loadOrders()
    loadContacts()
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

  async function loadOrders() {
    try {
      const data = await getOrders()
      setOrders(data)
    } catch {
      setError('Failed to load orders')
    }
  }

  async function handleStatusChange(id: string, status: OrderRequest['status']) {
    setUpdatingStatus(true)
    try {
      await updateOrderStatus(id, status)
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
      setSuccess(`Order marked as ${status}`)
    } catch {
      setError('Failed to update status')
    }
    setUpdatingStatus(false)
  }

  function toggleOrder(id: string) {
    setExpandedOrder((prev) => (prev === id ? null : id))
  }

  async function loadContacts() {
    try {
      const data = await getContactMessages()
      setContacts(data)
    } catch {
      setError('Failed to load messages')
    }
  }

  async function handleMarkRead(id: string) {
    try {
      await markContactRead(id)
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'read' } : c)))
      setSuccess('Message marked as read')
    } catch {
      setError('Failed to update message')
    }
  }

  function toggleContact(id: string) {
    setExpandedContact((prev) => (prev === id ? null : id))
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    const localPreviews = Array.from(files).map((f) => URL.createObjectURL(f))
    setPreviewUrls((prev) => [...prev, ...localPreviews])

    setUploading(true)
    const fileList = Array.from(files)
    setUploadProgress({ completed: 0, total: fileList.length })

    try {
      const results = new Array<string>(fileList.length)
      const promises = fileList.map((file, i) =>
        uploadImage(file).then((url) => {
          results[i] = url
          setUploadProgress((prev) => prev ? { ...prev, completed: prev.completed + 1 } : prev)
          return url
        }),
      )
      await Promise.all(promises)
      setForm((prev) => ({ ...prev, images: [...prev.images, ...results] }))
    } catch {
      setError('Image upload failed')
    }
    setUploadProgress(null)
    setUploading(false)
  }

  function addColor() {
    setForm((prev) => ({ ...prev, colors: [...prev.colors, colorInput] }))
  }

  function removeColor(idx: number) {
    setForm((prev) => ({ ...prev, colors: prev.colors.filter((_, i) => i !== idx) }))
  }

  function removeImage(idx: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
  }

  async function handlePreviewUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreviewUploading(true)
    try {
      const url = await uploadImage(file)
      setForm((prev) => ({ ...prev, printAreaPreview: url }))
    } catch {
      setError('Preview upload failed')
    }
    setPreviewUploading(false)
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
        printAreaPreview: form.printAreaPreview || null,
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
      printingOptions: product.printingOptions,
      printAreaPreview: product.printAreaPreview,
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

      {/* ---- Tabs ---- */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === 'products' ? 'admin-tab-active' : ''}`}
          onClick={() => setTab('products')}
        >
          Products ({products.length})
        </button>
        <button
          className={`admin-tab ${tab === 'orders' ? 'admin-tab-active' : ''}`}
          onClick={() => setTab('orders')}
        >
          Orders ({orders.length})
        </button>
        <button
          className={`admin-tab ${tab === 'contacts' ? 'admin-tab-active' : ''}`}
          onClick={() => setTab('contacts')}
        >
          Messages ({contacts.length})
        </button>
      </div>

      <main className="admin-main">
        {error && <p className="admin-error">{error}</p>}
        {success && <p className="admin-success">{success}</p>}

        {/* ---- Products Tab ---- */}
        {tab === 'products' && (
          <>
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
                  <select name="estimatedProductionTime" value={form.estimatedProductionTime} onChange={handleChange}>
                    <option value="">Not specified</option>
                    <option value="3-5 days">3-5 days</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2-3 weeks">2-3 weeks</option>
                    <option value="3-4 weeks">3-4 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Printing Option</label>
                  <label className="admin-check-label">
                    <input type="checkbox" checked={form.printingOptions} onChange={(e) => setForm((prev) => ({ ...prev, printingOptions: e.target.checked }))} />
                    Available
                  </label>
                </div>
                <div className="admin-field">
                  <label>Print Area Preview</label>
                  {form.printAreaPreview ? (
                    <div className="admin-preview-uploaded">
                      <img src={form.printAreaPreview} alt="" className="admin-preview-thumb" />
                      <button type="button" className="admin-btn admin-btn-sm" onClick={() => setForm((prev) => ({ ...prev, printAreaPreview: null }))}>Remove</button>
                    </div>
                  ) : (
                    <>
                      <input type="file" accept="image/*" onChange={handlePreviewUpload} disabled={previewUploading} />
                      {previewUploading && <p className="admin-muted">Uploading preview...</p>}
                    </>
                  )}
                </div>
                <div className="admin-field admin-field-full">
                  <label>Colors</label>
                  <div className="admin-color-picker-row">
                    <input type="color" value={colorInput} onChange={(e) => setColorInput(e.target.value)} />
                    <button type="button" className="admin-btn admin-btn-sm" onClick={addColor}>Add Color</button>
                  </div>
                  {form.colors.length > 0 && (
                    <div className="admin-color-list">
                      {form.colors.map((hex, i) => (
                        <div key={i} className="admin-color-item">
                          <span className="admin-color-swatch" style={{ backgroundColor: hex }} />
                          <span>{hex}</span>
                          <button type="button" className="admin-btn-remove" onClick={() => removeColor(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-field admin-field-full">
                  <label>Images</label>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
                  {uploading && uploadProgress && (
                    <div className="admin-upload-progress">
                      <div className="admin-upload-bar-track">
                        <div
                          className="admin-upload-bar-fill"
                          style={{ width: `${(uploadProgress.completed / uploadProgress.total) * 100}%` }}
                        />
                      </div>
                      <span className="admin-upload-count">
                        {uploadProgress.completed} / {uploadProgress.total}
                      </span>
                    </div>
                  )}
                  {previewUrls.length > 0 && (
                    <div className="admin-image-list">
                      {previewUrls.map((url, i) => (
                        <div key={i} className="admin-image-item">
                          <img src={url} alt="" />
                        </div>
                      ))}
                    </div>
                  )}
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
          </>
        )}

        {/* ---- Orders Tab ---- */}
        {tab === 'orders' && (
          <div className="admin-list">
            <div className="admin-list-header">
              <h2>Orders ({orders.length})</h2>
              <div className="admin-filter-group">
                {(['all', 'pending', 'confirmed', 'completed'] as const).map((s) => (
                  <button
                    key={s}
                    className={`admin-filter-btn ${statusFilter === s ? 'admin-filter-active' : ''}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {orders.length === 0 && <p className="admin-muted">No orders yet.</p>}
            {orders.filter((o) => statusFilter === 'all' || o.status === statusFilter).map((o) => (
              <div key={o.id} className="admin-order-item">
                <button className="admin-order-header" onClick={() => toggleOrder(o.id!)}>
                  <div className="admin-order-header-info">
                    <strong>{o.customerName}</strong>
                    <span className="admin-muted">{o.productName}</span>
                  </div>
                  <div className="admin-order-header-right">
                    <span className={`admin-status-badge admin-status-${o.status}`}>{o.status}</span>
                    <span className="admin-order-date">{new Date((o.createdAt as any)?.toDate?.() ?? o.createdAt).toLocaleDateString()}</span>
                    <span className="admin-chevron">{expandedOrder === o.id ? '▲' : '▼'}</span>
                  </div>
                </button>
                {expandedOrder === o.id && (
                  <div className="admin-order-detail">
                    <div className="admin-order-detail-grid">
                      <div className="admin-field">
                        <label>Customer</label>
                        <p>{o.customerName}</p>
                      </div>
                      <div className="admin-field">
                        <label>Phone</label>
                        <p>{o.phone}</p>
                      </div>
                      <div className="admin-field">
                        <label>Email</label>
                        <p>{o.email}</p>
                      </div>
                      <div className="admin-field">
                        <label>Product</label>
                        <p>{o.productName}</p>
                      </div>
                      <div className="admin-field">
                        <label>Color</label>
                        <p>{o.customization.color}</p>
                      </div>
                      {o.customization.customImage && (
                        <div className="admin-field">
                          <label>Custom Image</label>
                          <a href={o.customization.customImage} target="_blank" rel="noopener noreferrer">View Image</a>
                        </div>
                      )}
                      {o.message && (
                        <div className="admin-field admin-field-full">
                          <label>Notes</label>
                          <p>{o.message}</p>
                        </div>
                      )}
                      <div className="admin-field">
                        <label>Status</label>
                        <select
                          value={o.status}
                          disabled={updatingStatus}
                          onChange={(e) => handleStatusChange(o.id!, e.target.value as OrderRequest['status'])}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ---- Contacts Tab ---- */}
        {tab === 'contacts' && (
          <div className="admin-list">
            <h2>Messages ({contacts.length})</h2>
            {contacts.length === 0 && <p className="admin-muted">No messages yet.</p>}
            {contacts.map((c) => (
              <div key={c.id} className="admin-contact-item">
                <button className="admin-contact-header" onClick={() => toggleContact(c.id!)}>
                  <div className="admin-contact-header-info">
                    <div className="admin-contact-name-row">
                      <span className={`admin-contact-dot ${c.status === 'new' ? 'admin-dot-new' : ''}`} />
                      <strong className={c.status === 'new' ? 'admin-contact-unread' : ''}>{c.name}</strong>
                    </div>
                    <span className="admin-muted">{c.email} {c.phone ? `— ${c.phone}` : ''}</span>
                  </div>
                  <div className="admin-contact-header-right">
                    <span className="admin-order-date">{new Date((c.createdAt as any)?.toDate?.() ?? c.createdAt).toLocaleDateString()}</span>
                    <span className="admin-chevron">{expandedContact === c.id ? '▲' : '▼'}</span>
                  </div>
                </button>
                {expandedContact === c.id && (
                  <div className="admin-contact-detail">
                    <div className="admin-field">
                      <label>Email</label>
                      <p>{c.email}</p>
                    </div>
                    {c.phone && (
                      <div className="admin-field">
                        <label>Phone</label>
                        <p>{c.phone}</p>
                      </div>
                    )}
                    <div className="admin-field">
                      <label>Message</label>
                      <p className="admin-contact-message-text">{c.message}</p>
                    </div>
                    {c.status === 'new' && (
                      <button className="admin-btn admin-btn-sm" onClick={() => handleMarkRead(c.id!)}>
                        Mark as read
                      </button>
                    )}
                    {c.status !== 'new' && (
                      <span className="admin-muted">✓ Read</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
