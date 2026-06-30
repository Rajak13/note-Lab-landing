import { Routes, Route } from 'react-router-dom'
import './styles/reset.css'
import './styles/tokens.css'
import './App.css'

/* Landing page sections */
import Hero     from './components/Hero/Hero'
import Features from './components/Features/Features'
import About    from './components/About/About'
import Contact  from './components/Contact/Contact'

/* Auth — single component handles both login + register */
import AuthPage          from './pages/AuthPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

function LandingPage() {
  return (
    <>
      {/* Fixed coral frame — sits above all content, never blocks interaction */}
      <div className="pageFrame" aria-hidden="true" />
      <main id="main-content">
        <Hero />
        <Features />
        <About />
        <Contact />
      </main>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"          element={<AuthPage initialMode="login" />} />
      <Route path="/register"       element={<AuthPage initialMode="register" />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  )
}
