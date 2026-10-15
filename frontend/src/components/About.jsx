import { motion } from 'framer-motion'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer
} from 'recharts'
import { FiEye, FiCpu, FiGlobe, FiServer, FiCode, FiLayout } from 'react-icons/fi'

const skillCategories = [
  {
    icon: <FiEye />,
    title: 'Computer Vision',
    skills: ['PyTorch', 'OpenCV', 'MegaDetector / YOLO', 'FiftyOne'],
    color: '#c44dff',
  },
  {
    icon: <FiCpu />,
    title: 'Machine Learning',
    skills: ['PyTorch Geometric', 'scikit-learn', 'TensorFlow', 'Hugging Face'],
    color: '#ff6b9d',
  },
  {
    icon: <FiGlobe />,
    title: 'Geospatial',
    skills: ['rasterio', 'GeoPandas', 'pyproj', 'Lidar (USGS 3DEP)'],
    color: '#68a063',
  },
  {
    icon: <FiServer />,
    title: 'Research Computing',
    skills: ['SLURM / HPC', 'Weights & Biases', 'Docker', 'Linux'],
    color: '#ff9900',
  },
  {
    icon: <FiCode />,
    title: 'Systems',
    skills: ['Python', 'C++', 'TorchScript / libtorch', 'Java'],
    color: '#4d9fff',
  },
  {
    icon: <FiLayout />,
    title: 'Web',
    skills: ['React', 'TypeScript', 'Next.js', 'Spring Boot'],
    color: '#61dafb',
  },
]

const radarData = [
  { skill: 'Vision', level: 85 },
  { skill: 'ML', level: 85 },
  { skill: 'Geospatial', level: 70 },
  { skill: 'HPC', level: 80 },
  { skill: 'Systems', level: 75 },
  { skill: 'Web', level: 90 },
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
          {/* Profile Photo */}
          <motion.div
            className="about-photo-wrapper"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="about-photo-frame">
              <div className="about-photo-glow" />
              <img src="/profile.jpeg" alt="Brian Zhou" className="about-photo" />
            </div>
          </motion.div>

          <div className="about-right">
            <motion.div
              className="about-text"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <p>
                I'm a master's student at Washington University in St. Louis working on
                computer vision and machine learning for real-world imaging and sensing data.
                In 2026 I've worked with four WashU research groups: an AI pipeline for
                infrared camera-trap video of Congo Basin wildlife (Sanz Lab), predicting
                hiking speed in unseen regions from lidar and GPS traces (Multimodal Vision
                Research Laboratory), time-series foundation models in an NIH-funded study of
                glucose and cognition, and graph neural networks for a gamma-ray telescope.
              </p>
              <p>
                The thread through all of it is robustness: models built under one set of
                conditions (daylight images, familiar regions, one instrument) that have to
                work under another, judged by rigorous, leakage-free evaluation, including
                honest negative results. Next, I want to bring this to medical image analysis,
                especially MRI, as a PhD student. Before research, I spent nearly four years
                as a software engineer building production web applications.
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
