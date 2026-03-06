import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function NotFound() {
  return (
    <div className="page">
      <div className="section not-found">
        <motion.div
          className="not-found-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="not-found-code">
            <span className="gradient-text">404</span>
          </h1>
          <h2 className="not-found-title">Page Not Found</h2>
          <p className="not-found-desc">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="hero-cta hero-cta-primary" style={{ display: 'inline-flex' }}>
            <span>Back to Home</span>
            <span className="cta-arrow">&rarr;</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound
