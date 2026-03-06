import { motion } from 'framer-motion'
import { FiBriefcase, FiBookOpen } from 'react-icons/fi'

const experiences = [
  {
    type: 'work',
    title: 'Software Engineer',
    org: 'Your Company',
    period: '2023 - Present',
    description: 'Building scalable full-stack applications with React, Spring Boot, and cloud technologies.',
    skills: ['React', 'Java', 'AWS', 'PostgreSQL'],
  },
  {
    type: 'work',
    title: 'Software Developer Intern',
    org: 'Previous Company',
    period: '2022 - 2023',
    description: 'Developed RESTful APIs and contributed to frontend features in an agile team environment.',
    skills: ['Python', 'Node.js', 'Docker'],
  },
  {
    type: 'education',
    title: 'Bachelor of Science in Computer Science',
    org: 'Your University',
    period: '2019 - 2023',
    description: 'Focused on software engineering, data structures, algorithms, and machine learning.',
    skills: ['Data Structures', 'Algorithms', 'ML'],
  },
]

function Experience() {
  return (
    <section id="experience" className="section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        Experience
      </motion.h2>

      <div className="timeline">
        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            className="timeline-item"
            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <div className="timeline-marker">
              <div className="timeline-icon">
                {exp.type === 'work' ? <FiBriefcase /> : <FiBookOpen />}
              </div>
            </div>
            <div className="timeline-content">
              <span className="timeline-period">{exp.period}</span>
              <h3 className="timeline-title">{exp.title}</h3>
              <span className="timeline-org">{exp.org}</span>
              <p className="timeline-desc">{exp.description}</p>
              <div className="timeline-skills">
                {exp.skills.map(skill => (
                  <span key={skill} className="skill-pill">{skill}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Experience
