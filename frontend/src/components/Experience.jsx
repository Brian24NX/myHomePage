import { motion } from 'framer-motion'
import { FiBriefcase, FiBookOpen, FiSearch } from 'react-icons/fi'

const experiences = [
  {
    type: 'education',
    title: 'Master of Information Systems Management',
    org: 'Washington University in St. Louis',
    period: 'Jan 2026 - Present',
    description: 'Pursuing graduate studies in information systems management at WashU.',
    skills: ['Information Systems', 'Data Analytics', 'Software Engineering'],
  },
  {
    type: 'research',
    title: 'Research Intern — SIDEKIC: Computer Vision for Infrared Camera-Trap Video',
    org: 'Sanz Lab (PI: Prof. Crickette Sanz), Washington University in St. Louis',
    period: 'May 2026 - Present',
    description: 'Building an AI pipeline that turns infrared camera-trap video of Congo Basin wildlife into detections, individual counts, species, distance, and behavior. I rebuilt the detection front end around MegaDetector, trained a weakly supervised species classifier on the lab\'s own infrared footage, built per-camera distance calibration, and benchmarked behavior recognition under extreme class imbalance. Started as a Student Researcher in WashU\'s Digital Transformation Research Corps (Summer 2026); now an Animal Indicators Research Intern with the Living Earth Collaborative. Team paper in preparation for CV4Animals 2027.',
    skills: ['Computer Vision', 'PyTorch', 'MegaDetector', 'EfficientNetV2', 'YOLO', 'SLURM / H100'],
  },
  {
    type: 'research',
    title: 'Graduate Independent Study — Hiking Travel Speed from Remote Sensing',
    org: 'Multimodal Vision Research Laboratory (MVRL), Washington University in St. Louis',
    period: 'Aug 2026 - Present',
    description: 'Testing whether remote sensing can stand in for missing trail-map details when predicting hiking speed in regions a model has never seen. I built a 17-region dataset of on-trail walking speed from public OpenStreetMap GPS traces (stop detection, HMM map matching, travel-mode inference), joined it to USGS lidar terrain, land cover, and satellite embeddings, and benchmark probabilistic models with leave-one-region-out validation. Advised by Danni Beaulieu and Tianyi Gao; supervised by Prof. Nathan Jacobs. Paper in preparation for IGARSS 2027.',
    skills: ['Remote Sensing', 'Lidar', 'Geospatial ML', 'Probabilistic Models', 'scikit-learn'],
  },
  {
    type: 'research',
    title: 'Research Member — CT-WM: Continuous-Thought World Models',
    org: 'Collaborative project with Shuhuan Ye (Northeastern University)',
    period: 'Sep 2026 - Present',
    description: 'Model-based reinforcement learning for sparse-reward drone navigation, replacing DreamerV2\'s recurrent memory with a Continuous Thought Machine. I reproduced the training pipeline, wrote the team\'s onboarding handbook, and ran pre-registered ablations diagnosing why the agent\'s policy failed to learn, including a reward-model bias that drove an off-map exploit.',
    skills: ['Reinforcement Learning', 'World Models', 'TensorFlow'],
  },
  {
    type: 'research',
    title: 'Student Researcher — Time-Series Foundation Models for Glucose & Cognition',
    org: 'NIH K01-funded study (PI: Dr. Ray), Washington University in St. Louis',
    period: 'Jun 2026 - Sep 2026',
    description: 'Built the foundation-model arm of a study of glucose and cognition in youth with type 1 diabetes: applied frozen time-series foundation models (Amazon Chronos) to continuous glucose monitoring data, with a participant-grouped, nested cross-validation pipeline, permutation tests, and positive controls. Advised by Dr. Liuyi Jin; supervised by Prof. Chenyang Lu.',
    skills: ['Time-Series Foundation Models', 'PyTorch', 'scikit-learn', 'Digital Health'],
  },
  {
    type: 'research',
    title: 'Student Researcher — Graph Neural Networks for Gamma-Ray Burst Localization',
    org: 'APT/ADAPT Gamma-Ray Telescope Project, Washington University in St. Louis',
    period: 'Mar 2026 - Aug 2026',
    description: 'Developed a graph-attention network that flags background Compton rings before gamma-ray-burst localization, trained on Geant4 simulations on a SLURM GPU cluster, and integrated it into the team\'s C++ localization pipeline through TorchScript and libtorch. Advised by Ye Htet; supervised by Prof. Roger Chamberlain.',
    skills: ['Graph Neural Networks', 'PyTorch Geometric', 'TorchScript / libtorch', 'C++'],
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
            transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.15 }}
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
