import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import UrlShortener from './components/UrlShortener'
import Features from './components/Features'
import Footer from './components/Footer'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Verificar preferência salva ou do sistema
    const isDark = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    setDarkMode(isDark)
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    
    if (!darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main>
        <Hero />
        <UrlShortener />
        <Features />
      </main>

      <Footer />
    </div>
  )
}

export default App
