import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts'
import { FiStar, FiGitBranch, FiUsers, FiCode, FiBox } from 'react-icons/fi'
import { api } from '../api/client'
import AnimatedCounter from './AnimatedCounter'
import { AnalyticsSkeleton } from './Skeleton'

const COLORS = ['#ff6b9d', '#c44dff', '#4d9fff', '#4dffb8', '#ffd84d', '#ff8c4d', '#61dafb', '#3178c6']

function GitHubAnalytics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.getGitHubStats((freshData) => setStats(freshData))
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <AnalyticsSkeleton />
  if (error || !stats) return null

  const statCards = [
    { icon: <FiBox />, label: 'Repositories', value: stats.totalRepos },
    { icon: <FiStar />, label: 'Total Stars', value: stats.totalStars },
    { icon: <FiGitBranch />, label: 'Total Forks', value: stats.totalForks },
    { icon: <FiUsers />, label: 'Followers', value: stats.followers },
  ]

  return (
    <section id="analytics" className="section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        GitHub Analytics
      </motion.h2>

      {/* Stat Cards */}
      <div className="analytics-stats">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="analytics-stat-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="analytics-stat-icon" style={{ color: COLORS[i] }}>
              {stat.icon}
            </div>
            <div className="analytics-stat-number">
              <AnimatedCounter end={stat.value} />
            </div>
            <div className="analytics-stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="analytics-charts">
        {/* Language Breakdown */}
        <motion.div
          className="analytics-chart-card"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h3><FiCode style={{ marginRight: 8 }} /> Language Breakdown</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.languages}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {stats.languages.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#fff',
                  }}
                  formatter={(value, name) => [`${value} repos`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="language-legend">
            {stats.languages.slice(0, 6).map((lang, i) => (
              <div key={lang.name} className="legend-item">
                <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="legend-name">{lang.name}</span>
                <span className="legend-pct">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          className="analytics-chart-card"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h3>Repository Activity</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.activity}>
                <defs>
                  <linearGradient id="colorRepos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c44dff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c44dff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#a0a0b8', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis
                  tick={{ fill: '#a0a0b8', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="repos"
                  stroke="#c44dff"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRepos)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default GitHubAnalytics
