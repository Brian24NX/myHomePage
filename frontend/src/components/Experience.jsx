import { motion } from 'framer-motion'
import { FiBriefcase, FiBookOpen, FiSearch } from 'react-icons/fi'

const experiences = [
  {
    type: 'education',
    title: 'Master of Information Systems Management',
    org: 'Washington University in St. Louis',
    period: 'Sep 2025 - Present',
    description: 'Pursuing graduate studies in information systems management at WashU.',
    skills: ['Information Systems', 'Data Analytics', 'Software Engineering'],
  },
  {
    type: 'research',
    title: 'Research Member — Att-CapsViT for Chinese Character Recognition',
    org: 'Chinese Academy of Sciences',
    period: 'Mar 2024 - Jun 2024',
    description: 'Proposed the Att-CapsViT model integrating Capsule Networks, Vision Transformers, and attention mechanisms for handwritten Chinese character recognition. Published at IEEE AIPMV 2024.',
    skills: ['CapsNets', 'Vision Transformers', 'PyTorch', 'Deep Learning'],
  },
  {
    type: 'work',
    title: 'Software Developer Engineer',
    org: 'iSoftStone',
    period: 'Jan 2023 - Jun 2024',
    description: 'Built cross-platform front-end features using JavaScript/TypeScript and Vue.js. Developed data-driven dashboards with real-time monitoring and KPI visualization. Optimized performance via code splitting and lazy-loading.',
    skills: ['JavaScript', 'TypeScript', 'Vue.js', 'Vite', 'CI/CD'],
  },
  {
    type: 'research',
    title: 'Research Assistant — CNN vs VGG16 for Image Classification',
    org: 'Harvard University',
    period: 'Aug 2023 - Nov 2023',
    description: 'Conducted a comparative study of CNN and pre-trained VGG16 architectures under Dr. Pavlos Protopapas. VGG16 achieved 87% accuracy, exceeding CNN by 10%. Published at SPIE ICPPOE 2023.',
    skills: ['CNN', 'VGG16', 'Image Classification', 'Python'],
  },
  {
    type: 'work',
    title: 'Software Developer Engineer',
    org: 'Futu Network Technology Co., Ltd',
    period: 'Oct 2020 - Dec 2022',
    description: 'Built and maintained a Vue 2 web app for an AI customer-service bot platform. Integrated REST APIs for core workflows and automated data analysis using Python, SQL, and R, increasing resolution rate from 65% to 75%.',
    skills: ['Vue.js', 'Vuex', 'Ant Design', 'Python', 'SQL', 'R'],
  },
  {
    type: 'education',
    title: 'Bachelor of Science in Computer Science',
    org: 'Wuhan University of Technology',
    period: 'Sep 2016 - Jun 2020',
    description: 'Studied computer science fundamentals including data structures, algorithms, and software engineering.',
    skills: ['C++', 'Data Structures', 'Algorithms', 'Java'],
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
                {exp.type === 'work' ? <FiBriefcase /> : exp.type === 'research' ? <FiSearch /> : <FiBookOpen />}
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
