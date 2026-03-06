import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import { api } from '../api/client'

function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getPost(slug)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="page"><div className="section"><div className="loading">Loading...</div></div></div>
  if (!post) return <div className="page"><div className="section"><p>Post not found.</p></div></div>

  return (
    <div className="page">
      <Helmet>
        <title>{post.title} | Brian Zhou</title>
        <meta name="description" content={post.summary || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary || post.title} />
        <meta property="og:type" content="article" />
      </Helmet>
      <motion.article
        className="blog-post section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/blog" className="back-link">&larr; Back to Blog</Link>
        <header className="blog-post-header">
          <h1>{post.title}</h1>
          <div className="blog-post-meta">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>{post.readTime} min read</span>
          </div>
          {post.tags && (
            <div className="blog-card-tags">
              {post.tags.split(',').map(tag => (
                <span key={tag} className="blog-tag">{tag.trim()}</span>
              ))}
            </div>
          )}
        </header>
        <div className="blog-post-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </motion.article>
    </div>
  )
}

export default BlogPost
