import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { api } from '../api/client'
import { BlogSkeleton } from '../components/Skeleton'

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <Helmet>
        <title>Blog | Brian Zhou</title>
        <meta name="description" content="Thoughts on code, tech, and everything in between by Brian Zhou." />
      </Helmet>
      <div className="section">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Blog
        </motion.h1>
        <p className="page-subtitle">Thoughts on code, tech, and everything in between.</p>

        {loading ? (
          <BlogSkeleton />
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts yet. Stay tuned!</p>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="blog-card">
                  {post.coverImage && (
                    <img src={post.coverImage} alt={post.title} className="blog-card-image" />
                  )}
                  <div className="blog-card-content">
                    <div className="blog-card-meta">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>{post.readTime} min read</span>
                    </div>
                    <h2>{post.title}</h2>
                    <p>{post.summary}</p>
                    {post.tags && (
                      <div className="blog-card-tags">
                        {post.tags.split(',').map(tag => (
                          <span key={tag} className="blog-tag">{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
