import './styles/reset.css'
import './styles/tokens.css'
import Hero from './components/Hero/Hero'
import Features from './components/Features/Features'
import About from './components/About/About'
import Contact from './components/Contact/Contact'

export default function App() {
  return (
    <main id="main-content">
      <Hero />
      <Features />
      <About />
      <Contact />
    </main>
  )
}
