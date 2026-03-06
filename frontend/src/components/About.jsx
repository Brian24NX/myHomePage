import { motion } from 'framer-motion'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer
} from 'recharts'
import { FiTerminal, FiLayers, FiDatabase, FiCloud, FiLayout, FiCpu } from 'react-icons/fi'

const skillCategories = [
  {
    icon: <FiLayout />,
    title: 'Frontend',
    skills: ['React', 'TypeScript', 'CSS/Sass', 'Vite'],
    color: '#61dafb',
  },
  {
    icon: <FiTerminal />,
    title: 'Backend',
    skills: ['Java', 'Spring Boot', 'Node.js', 'Python'],
    color: '#68a063',
  },
  {
    icon: <FiDatabase />,
    title: 'Database',
    skills: ['PostgreSQL', 'MySQL', 'Redis', 'MongoDB'],
    color: '#4d9fff',
  },
  {
    icon: <FiCloud />,
    title: 'DevOps',
    skills: ['AWS', 'Docker', 'Git', 'CI/CD'],
    color: '#ff9900',
  },
  {
    icon: <FiCpu />,
    title: 'AI / ML',
    skills: ['TensorFlow', 'CNN', 'Data Analysis', 'Jupyter'],
    color: '#c44dff',
  },
  {
    icon: <FiLayers />,
    title: 'Tools',
    skills: ['VS Code', 'Figma', 'Postman', 'Linux'],
    color: '#ff6b9d',
  },
]

const radarData = [
  { skill: 'Frontend', level: 90 },
  { skill: 'Backend', level: 85 },
  { skill: 'Database', level: 80 },
  { skill: 'DevOps', level: 70 },
  { skill: 'AI / ML', level: 75 },
  { skill: 'Tools', level: 85 },
]

function About() {
  return (
    <section id="about" className="about">
      <div className="section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          About Me
        </motion.h2>

        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <p>
              I'm a passionate Software Engineer with a love for crafting clean,
              efficient, and user-friendly applications. From full-stack web development
              to machine learning projects, I enjoy solving complex problems and
              turning ideas into reality through code.
            </p>
            <p>
              With experience across multiple domains including web applications,
              data analysis, and cloud infrastructure, I bring a versatile skill set
              to every project I work on.
            </p>
          </motion.div>

          {/* Radar Chart */}
          <motion.div
            className="about-radar"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: '#a0a0b8', fontSize: 13 }}
                />
                <Radar
                  dataKey="level"
                  stroke="#c44dff"
                  fill="#c44dff"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Skill Categories Grid */}
        <div className="skill-categories">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              className="skill-category-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ borderColor: cat.color, y: -4 }}
            >
              <div className="skill-category-icon" style={{ color: cat.color }}>
                {cat.icon}
              </div>
              <h3>{cat.title}</h3>
              <div className="skill-category-items">
                {cat.skills.map(skill => (
                  <span key={skill} className="skill-pill">{skill}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
