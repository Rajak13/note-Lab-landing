import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { FolderProvider } from './context/FolderContext'
import './styles/reset.css'
import './styles/tokens.css'
import './App.css'

/* Landing page sections (Loaded for immediate LCP/FCP) */
import Hero     from './components/Hero/Hero'
import Features from './components/Features/Features'
import About    from './components/About/About'
import Contact  from './components/Contact/Contact'

/* Lazy-loaded routes for 95+ Lighthouse performance score */
const AuthPage          = lazy(() => import('./pages/AuthPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const DashboardPage     = lazy(() => import('./pages/DashboardPage'))
const NotebookPage      = lazy(() => import('./pages/NotebookPage'))
const PrivacyPolicy     = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService    = lazy(() => import('./pages/TermsOfService'))

function PageFallback() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F4F1EA',
      fontFamily: 'system-ui, sans-serif',
      color: '#67615A',
      fontSize: '14px'
    }}>
      <div style={{
        width: 24,
        height: 24,
        border: '2.5px solid rgba(228,103,87,0.2)',
        borderTopColor: '#E46757',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
    </div>
  )
}

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
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/"               element={<LandingPage />} />
            <Route path="/login"          element={<AuthPage initialMode="login" />} />
            <Route path="/register"       element={<AuthPage initialMode="register" />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard"      element={<DashboardPage />}/>
            <Route path="/notebook/:id"    element={<NotebookPage />}/>
            <Route path="/privacy"        element={<PrivacyPolicy />}/>
            <Route path="/terms"          element={<TermsOfService />}/>
          </Routes>
        </Suspense>
      </FolderProvider>
    </ToastProvider>
  )
}
