import { Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { FolderProvider } from './context/FolderContext'
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
import DashboardPage from './pages/DashboardPage'
import NotebookPage  from './pages/NotebookPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'

function LandingPage() {
  return (
    <main id="main-content">
      <Hero />
      <Features />
      <About />
      <Contact />
    </main>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <FolderProvider>
        <Routes>
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"          element={<AuthPage initialMode="login" />} />
          <Route path="/register"       element={<AuthPage initialMode="register" />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard"        element={<DashboardPage />}/>
          <Route path="/notebook/:id"    element={<NotebookPage />}/>
          <Route path="/privacy"        element={<PrivacyPolicy />}/>
          <Route path="/terms"          element={<TermsOfService />}/>
        </Routes>
      </FolderProvider>
    </ToastProvider>
  )
}
