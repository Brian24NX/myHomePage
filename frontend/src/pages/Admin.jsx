import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../api/client'

function Admin() {
  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [posts, setPosts] = useState([])
  const [messages, setMessages] = useState([])
  const [editingPost, setEditingPost] = useState(null)
  const [postForm, setPostForm] = useState({ title: '', slug: '', summary: '', content: '', tags: '', published: false })
  const [cvUploading, setCvUploading] = useState(false)
  const [cvDragOver, setCvDragOver] = useState(false)
  const [cvStatus, setCvStatus] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.verify().catch(() => navigate('/login'))
  }, [navigate])

  useEffect(() => {
    if (tab === 'dashboard') api.getStats().then(setStats).catch(console.error)
    if (tab === 'blog') api.getAllPosts().then(setPosts).catch(console.error)
    if (tab === 'messages') api.getMessages().then(setMessages).catch(console.error)
  }, [tab])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handlePostSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPost) {
        await api.updatePost(editingPost.id, postForm)
      } else {
        await api.createPost(postForm)
      }
      setPostForm({ title: '', slug: '', summary: '', content: '', tags: '', published: false })
      setEditingPost(null)
      api.getAllPosts().then(setPosts)
    } catch (err) {
      alert('Failed to save post')
    }
  }

  const handleEdit = (post) => {
    setEditingPost(post)
    setPostForm({
      title: post.title,
      slug: post.slug,
      summary: post.summary || '',
      content: post.content,
      tags: post.tags || '',
      published: post.published,
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    await api.deletePost(id)
    api.getAllPosts().then(setPosts)
  }

  const handleDeleteMessage = async (id) => {
    await api.deleteMessage(id)
    api.getMessages().then(setMessages)
  }

  const handleMarkRead = async (id) => {
    await api.markRead(id)
    api.getMessages().then(setMessages)
  }

  return (
    <div className="page admin-page">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <h2 className="gradient-text">Admin</h2>
          <nav className="admin-nav">
            <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}>Dashboard</button>
            <button className={tab === 'blog' ? 'active' : ''} onClick={() => setTab('blog')}>Blog Posts</button>
            <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>Messages</button>
            <button className={tab === 'resume' ? 'active' : ''} onClick={() => setTab('resume')}>Resume/CV</button>
          </nav>
          <button className="admin-logout" onClick={handleLogout}>Logout</button>
        </aside>

        <main className="admin-content">
          {tab === 'dashboard' && stats && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1>Dashboard</h1>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-number">{stats.publishedPosts}</span>
                  <span className="stat-label">Published Posts</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{stats.draftPosts}</span>
                  <span className="stat-label">Drafts</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{stats.totalMessages}</span>
                  <span className="stat-label">Messages</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{stats.unreadMessages}</span>
                  <span className="stat-label">Unread</span>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'blog' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1>{editingPost ? 'Edit Post' : 'New Post'}</h1>
              <form className="admin-form" onSubmit={handlePostSubmit}>
                <input
                  type="text"
                  placeholder="Post Title"
                  value={postForm.title}
                  onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Slug (auto-generated if empty)"
                  value={postForm.slug}
                  onChange={e => setPostForm({ ...postForm, slug: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Summary"
                  value={postForm.summary}
                  onChange={e => setPostForm({ ...postForm, summary: e.target.value })}
                />
                <textarea
                  placeholder="Content (Markdown supported)"
                  rows="12"
                  value={postForm.content}
                  onChange={e => setPostForm({ ...postForm, content: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  value={postForm.tags}
                  onChange={e => setPostForm({ ...postForm, tags: e.target.value })}
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={postForm.published}
                    onChange={e => setPostForm({ ...postForm, published: e.target.checked })}
                  />
                  Published
                </label>
                <div className="form-actions">
                  <button type="submit" className="hero-cta">
                    {editingPost ? 'Update' : 'Create'} Post
                  </button>
                  {editingPost && (
                    <button type="button" className="hero-cta hero-cta-outline" onClick={() => {
                      setEditingPost(null)
                      setPostForm({ title: '', slug: '', summary: '', content: '', tags: '', published: false })
                    }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <h2 style={{ marginTop: '3rem' }}>All Posts</h2>
              <div className="admin-list">
                {posts.map(post => (
                  <div key={post.id} className="admin-list-item">
                    <div>
                      <strong>{post.title}</strong>
                      <span className={`status-badge ${post.published ? 'published' : 'draft'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="admin-actions">
                      <button onClick={() => handleEdit(post)}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(post.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'messages' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1>Messages</h1>
              <div className="admin-list">
                {messages.length === 0 ? (
                  <p className="empty-state">No messages yet.</p>
                ) : messages.map(msg => (
                  <div key={msg.id} className={`admin-list-item message-item ${!msg.read ? 'unread' : ''}`}>
                    <div className="message-header">
                      <strong>{msg.name}</strong>
                      <span className="message-email">{msg.email}</span>
                      <span className="message-date">{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    {msg.subject && <div className="message-subject">{msg.subject}</div>}
                    <p className="message-body">{msg.message}</p>
                    <div className="admin-actions">
                      {!msg.read && <button onClick={() => handleMarkRead(msg.id)}>Mark Read</button>}
                      <button className="danger" onClick={() => handleDeleteMessage(msg.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'resume' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1>Resume / CV</h1>
              <div
                className={`cv-dropzone ${cvDragOver ? 'cv-dropzone-active' : ''} ${cvUploading ? 'cv-dropzone-uploading' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setCvDragOver(true) }}
                onDragLeave={() => setCvDragOver(false)}
                onDrop={async (e) => {
                  e.preventDefault()
                  setCvDragOver(false)
                  const file = e.dataTransfer.files[0]
                  if (!file) return
                  if (file.type !== 'application/pdf') {
                    setCvStatus({ type: 'error', msg: 'Only PDF files are allowed.' })
                    return
                  }
                  setCvUploading(true)
                  setCvStatus(null)
                  try {
                    const result = await api.uploadCv(file)
                    setCvStatus({ type: 'success', msg: `Uploaded: ${result.fileName}` })
                  } catch (err) {
                    setCvStatus({ type: 'error', msg: err.message })
                  } finally {
                    setCvUploading(false)
                  }
                }}
              >
                <div className="cv-dropzone-icon">
                  {cvUploading ? (
                    <div className="cv-spinner" />
                  ) : (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="12" y2="12" />
                      <line x1="15" y1="15" x2="12" y2="12" />
                    </svg>
                  )}
                </div>
                <p className="cv-dropzone-text">
                  {cvUploading ? 'Uploading...' : 'Drag & drop your CV here'}
                </p>
                <p className="cv-dropzone-hint">PDF format only</p>
                {!cvUploading && (
                  <label className="cv-browse-btn">
                    <input
                      type="file"
                      accept=".pdf"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0]
                        if (!file) return
                        setCvUploading(true)
                        setCvStatus(null)
                        try {
                          const result = await api.uploadCv(file)
                          setCvStatus({ type: 'success', msg: `Uploaded: ${result.fileName}` })
                        } catch (err) {
                          setCvStatus({ type: 'error', msg: err.message })
                        } finally {
                          setCvUploading(false)
                          e.target.value = ''
                        }
                      }}
                    />
                    Or browse files
                  </label>
                )}
              </div>
              {cvStatus && (
                <div className={`cv-status cv-status-${cvStatus.type}`}>
                  {cvStatus.msg}
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Admin
