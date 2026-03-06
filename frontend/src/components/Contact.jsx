import { useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../api/client'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setStatus(null)
    try {
      const res = await api.submitContact(form)
      setStatus({ type: 'success', text: res.message })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to send. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <section id="contact" className="contact">
      <div className="section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          Get In Touch
        </motion.h2>
        <motion.div
          className="contact-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p>
            Have a project in mind or just want to say hello? Drop me a message
            and I'll get back to you as soon as possible.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="Subject (optional)"
                value={form.subject}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="hero-cta" disabled={sending}>
              {sending ? 'Sending...' : 'Send Message'}
            </button>
            {status && (
              <p className={`form-status ${status.type}`}>{status.text}</p>
            )}
          </form>

          <div className="contact-links" style={{ marginTop: '2rem' }}>
            <motion.a
              href="https://github.com/Brian24NX"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link github"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              GitHub
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/brian-zhou-b869251a8/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link linkedin"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              LinkedIn
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
