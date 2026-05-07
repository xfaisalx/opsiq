import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturesStrip from './components/FeaturesStrip'
import ChatArea from './components/ChatArea'
import Footer from './components/Footer'
function AppContent() {
  const { lang, isRTL } = useLanguage()
  const [inputValue, setInputValue] = useState('')
  const [pendingQuery, setPendingQuery] = useState(null)

  // Sync dir attribute on body for global RTL + font switching
  useEffect(() => {
    document.body.dir = isRTL ? 'rtl' : 'ltr'
  }, [isRTL])

  function handleSubmit(text) {
    setPendingQuery(text)
  }

  function handleQueryHandled() {
    setPendingQuery(null)
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={lang}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Navbar />
        <main style={{ flex: 1 }}>
          <Hero
            onSubmit={handleSubmit}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <FeaturesStrip />
          <ChatArea pendingQuery={pendingQuery} onQueryHandled={handleQueryHandled} />
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}
