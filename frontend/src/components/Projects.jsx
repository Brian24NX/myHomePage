import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiStar, FiGitBranch, FiExternalLink } from 'react-icons/fi'
import { api } from '../api/client'
import { ProjectsSkeleton } from './Skeleton'

const langColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'Jupyter Notebook': '#DA5B0B',
  Shell: '#89e051',
  Vue: '#41b883',
  SCSS: '#c6538c',
}

function Projects() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    api.getRepos()
      .then(setRepos)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const languages = useMemo(() => {
    const langs = new Set(repos.map(r => r.language).filter(Boolean))
    return ['All', ...langs]
  }, [repos])

  const filtered = useMemo(() => {
    if (filter === 'All') return repos
    return repos.filter(r => r.language === filter)
  }, [repos, filter])

  return (
    <section id="projects" className="section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        Projects
      </motion.h2>

      {/* Language Filter */}
      {!loading && (
        <motion.div
          className="project-filters"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {languages.map(lang => (
            <button
              key={lang}
              className={`filter-btn ${filter === lang ? 'active' : ''}`}
              onClick={() => setFilter(lang)}
              style={filter === lang && lang !== 'All' ? {
                borderColor: langColors[lang],
                background: `${langColors[lang]}15`,
              } : {}}
            >
              {lang !== 'All' && (
                <span className="lang-dot" style={{ background: langColors[lang] || '#999' }} />
              )}
              {lang}
            </button>
          ))}
        </motion.div>
      )}

      {loading ? (
        <ProjectsSkeleton />
      ) : (
        <div className="projects-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((repo, i) => (
              <motion.a
                key={repo.name}
                href={repo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -8 }}
              >
                <div
                  className="project-image"
                  style={{
                    background: `linear-gradient(135deg, ${langColors[repo.language] || '#4d9fff'}30, ${langColors[repo.language] || '#c44dff'}10)`,
                  }}
                >
                  <span className="project-lang-badge" style={{
                    background: langColors[repo.language] || '#999',
                  }}>
                    {repo.language || 'Code'}
                  </span>
                </div>
                <div className="project-info">
                  <h3>
                    {repo.name}
                    <FiExternalLink className="project-external-icon" />
                  </h3>
                  <p>{repo.description || 'No description provided.'}</p>
                  <div className="project-meta">
                    {repo.language && (
                      <span className="project-language">
                        <span className="lang-dot" style={{ background: langColors[repo.language] || '#999' }} />
                        {repo.language}
                      </span>
                    )}
                    {repo.stars > 0 && (
                      <span className="project-stars">
                        <FiStar size={14} /> {repo.stars}
                      </span>
                    )}
                    {repo.forks > 0 && (
                      <span className="project-forks">
                        <FiGitBranch size={14} /> {repo.forks}
                      </span>
                    )}
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}

export default Projects
