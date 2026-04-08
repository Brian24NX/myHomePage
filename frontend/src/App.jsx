import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import About from './components/About'
import GitHubAnalytics from './components/GitHubAnalytics'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Resume from './components/Resume'
import Experience from './components/Experience'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import ScrollToTop from './components/ScrollToTop'
import CyberCursor from './components/CyberCursor'
import './App.css'

const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Login = lazy(() => import('./pages/Login'))
const Admin = lazy(() => import('./pages/Admin'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
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
      <CyberCursor />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <ScrollToTop />
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
      <Suspense fallback={<div className="page"><div className="section"><div className="loading">Loading...</div></div></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </main>
    </div>
  )
}

export default App
