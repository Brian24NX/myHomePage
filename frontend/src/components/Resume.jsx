import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiDownload, FiFileText, FiCalendar, FiHardDrive, FiEye } from 'react-icons/fi'
import { api } from '../api/client'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

function Resume() {
  const [cvInfo, setCvInfo] = useState(null)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    api.getCvInfo().then(setCvInfo).catch(() => setCvInfo({ exists: false }))
  }, [])

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (ms) => {
    return new Date(ms).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <section id="resume" className="section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        Resume
      </motion.h2>

      <div className="resume-container">
        {/* Left: Document Card */}
        <motion.div
          className="resume-card-wrapper"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Glow effect behind card */}
          <div className={`resume-glow ${hovering ? 'resume-glow-active' : ''}`} />

          <div className="resume-document">
            {/* Animated border */}
            <div className="resume-border-anim" />

            {/* Document header */}
            <div className="resume-doc-header">
              <div className="resume-doc-dots">
                <span />
                <span />
                <span />
              </div>
              <span className="resume-doc-label">PDF Document</span>
            </div>

            {/* Document body - fake PDF preview */}
            <div className="resume-doc-body">
              <div className="resume-doc-icon">
                <FiFileText />
              </div>

              {/* Simulated document lines */}
              <div className="resume-doc-preview">
                <div className="doc-line doc-line-title" />
                <div className="doc-line doc-line-subtitle" />
                <div className="doc-line-gap" />
                <div className="doc-line doc-line-section" />
                <div className="doc-line doc-line-text" />
                <div className="doc-line doc-line-text doc-line-short" />
                <div className="doc-line doc-line-text" />
                <div className="doc-line-gap" />
                <div className="doc-line doc-line-section" />
                <div className="doc-line doc-line-text" />
                <div className="doc-line doc-line-text doc-line-medium" />
                <div className="doc-line-gap" />
                <div className="doc-line doc-line-section" />
                <div className="doc-line doc-line-text doc-line-medium" />
                <div className="doc-line doc-line-text" />
              </div>

              {/* Hover overlay */}
              <motion.div
                className="resume-doc-overlay"
                animate={{ opacity: hovering ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiEye size={28} />
                <span>Preview Resume</span>
              </motion.div>
            </div>

            {/* Floating particles around document */}
            <div className="resume-particles">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`resume-particle rp-${i + 1}`} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Info + Actions */}
        <motion.div
          className="resume-info"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h3 className="resume-info-title">
            Grab a copy of my <span className="gradient-text">Resume</span>
          </h3>
          <p className="resume-info-desc">
            Explore my professional experience, technical skills, education, and
            projects. Available as a downloadable PDF.
          </p>

          {/* File metadata */}
          {cvInfo?.exists && (
            <div className="resume-meta">
              <div className="resume-meta-item">
                <FiFileText className="resume-meta-icon" />
                <div>
                  <span className="resume-meta-label">Format</span>
                  <span className="resume-meta-value">PDF</span>
                </div>
              </div>
              <div className="resume-meta-item">
                <FiHardDrive className="resume-meta-icon" />
                <div>
                  <span className="resume-meta-label">Size</span>
                  <span className="resume-meta-value">{formatSize(cvInfo.size)}</span>
                </div>
              </div>
              <div className="resume-meta-item">
                <FiCalendar className="resume-meta-icon" />
                <div>
                  <span className="resume-meta-label">Updated</span>
                  <span className="resume-meta-value">{formatDate(cvInfo.lastModified)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="resume-actions">
            {cvInfo?.exists ? (
              <>
                <a
                  href={`${API_BASE}/cv/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-btn resume-btn-primary"
                >
                  <FiDownload />
                  <span>Download CV</span>
                </a>
                <a
                  href={`${API_BASE}/cv/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-btn resume-btn-outline"
                >
                  <FiEye />
                  <span>View Online</span>
                </a>
              </>
            ) : (
              <div className="resume-coming-soon">
                <span className="resume-soon-badge">Coming Soon</span>
                <p>Resume will be available for download shortly.</p>
              </div>
            )}
          </div>

          {/* Quick highlights */}
          <div className="resume-highlights">
            {['3+ Years Experience', 'Full-Stack Development', 'Cloud & DevOps'].map((item, i) => (
              <motion.span
                key={item}
                className="resume-highlight-tag"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Resume
