import { Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import About from './components/About'
import GitHubAnalytics from './components/GitHubAnalytics'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Resume from './components/Resume'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Login from './pages/Login'
import Admin from './pages/Admin'
import './App.css'

function Home() {
  return (
    <>
      <Hero />
      <About />
      <GitHubAnalytics />
      <Projects />
      <Resume />
      <Contact />
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Brian. All rights reserved.</p>
      </footer>
    </>
  )
}

function App() {
  return (
    <div className="app">
      <ScrollProgress />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  )
}

export default App
