import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturesStrip from './components/FeaturesStrip'
import ChatArea from './components/ChatArea'
import Footer from './components/Footer'

function AppContent() {
  const { lang, t, isRTL } = useLanguage()
  const [inputValue, setInputValue] = useState('')
  const [pendingQuery, setPendingQuery] = useState(null)
  const [chatActive, setChatActive] = useState(false)

  useEffect(() => {
    document.body.dir = isRTL ? 'rtl' : 'ltr'
  }, [isRTL])

  function handleSubmit(text) {
    const val = (text ?? inputValue).trim()
    if (!val) return
    setChatActive(true)
    setPendingQuery(val)
    setInputValue('')
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
        style={{
          height: chatActive ? '100vh' : undefined,
          minHeight: chatActive ? undefined : '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: chatActive ? 'hidden' : undefined,
        }}
      >
        <Navbar />

        <AnimatePresence>
          {!chatActive && (
            <motion.div
              key="landing"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
            >
              <Hero
                onSubmit={handleSubmit}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <FeaturesStrip />
            </motion.div>
          )}
        </AnimatePresence>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ChatArea
            chatActive={chatActive}
            pendingQuery={pendingQuery}
            onQueryHandled={handleQueryHandled}
          />
        </main>

        <AnimatePresence>
          {!chatActive && <Footer key="footer" />}
        </AnimatePresence>

        {/* Pinned input bar — only shown in chat mode */}
        <AnimatePresence>
          {chatActive && (
            <motion.div
              key="chat-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                borderTop: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--surface-primary)',
                padding: '16px 24px',
                flexShrink: 0,
              }}
            >
              <div style={{ maxWidth: 820, margin: '0 auto' }}>
                <div
                  id="chat-input-bar"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: 'var(--surface-secondary)',
                    border: '1.5px solid var(--border-medium)',
                    borderRadius: 14,
                    padding: '14px 16px',
                    transition: 'border-color 200ms ease, box-shadow 200ms ease',
                  }}
                  onFocusCapture={() => {
                    const bar = document.getElementById('chat-input-bar')
                    if (bar) {
                      bar.style.borderColor = 'var(--amber-500)'
                      bar.style.boxShadow = '0 0 0 3px rgba(200,146,42,0.12)'
                    }
                  }}
                  onBlurCapture={() => {
                    const bar = document.getElementById('chat-input-bar')
                    if (bar) {
                      bar.style.borderColor = 'var(--border-medium)'
                      bar.style.boxShadow = 'none'
                    }
                  }}
                >
                  <input
                    autoFocus
                    dir="auto"
                    type="text"
                    aria-label={t.ariaSearch}
                    placeholder={t.searchPlaceholder}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: 14,
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    onClick={() => handleSubmit()}
                    aria-label={t.ariaSend}
                    style={{
                      width: 36,
                      height: 36,
                      flexShrink: 0,
                      backgroundColor: 'var(--navy-900)',
                      border: 'none',
                      borderRadius: 10,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 150ms ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--navy-700)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--navy-900)')}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 11V3M7 3L3.5 6.5M7 3L10.5 6.5" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
