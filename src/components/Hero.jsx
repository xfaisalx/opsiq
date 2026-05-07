import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import QueryChip from './QueryChip'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut', delay },
})

export default function Hero({ onSubmit, inputValue, setInputValue }) {
  const { t, isRTL } = useLanguage()
  const inputRef = useRef(null)

  function handleSend() {
    const val = inputValue.trim()
    if (!val) return
    onSubmit(val)
    setInputValue('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSend()
  }

  function handleChipClick(text) {
    setInputValue(text)
    inputRef.current?.focus()
  }

  return (
    <section
      style={{ backgroundColor: 'var(--surface-primary)', paddingTop: 72, paddingBottom: 52 }}
    >
      <div className="flex flex-col items-center text-center px-4">
        {/* Badge */}
        <motion.div {...fadeUp(0.1)}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: '#e6f1fb',
              color: 'var(--blue-info)',
              border: '1px solid rgba(24,95,165,0.2)',
              borderRadius: 9999,
              padding: '4px 14px',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            {t.heroBadge}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...fadeUp(0.2)}
          style={{
            fontSize: 'clamp(26px, 5vw, 36px)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            maxWidth: 560,
            marginTop: 20,
            lineHeight: 1.25,
            letterSpacing: '-0.5px',
          }}
        >
          {t.heroHeading}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          {...fadeUp(0.3)}
          style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            maxWidth: 480,
            marginTop: 16,
            lineHeight: 1.7,
          }}
        >
          {t.heroSubheading}
        </motion.p>

        {/* Search bar */}
        <motion.div {...fadeUp(0.4)} style={{ width: '100%', maxWidth: 580, marginTop: 32 }}>
          <div
            id="search-bar"
            role="search"
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
            onFocusCapture={e => {
              const bar = document.getElementById('search-bar')
              if (bar) {
                bar.style.borderColor = 'var(--amber-500)'
                bar.style.boxShadow = '0 0 0 3px rgba(200,146,42,0.12)'
              }
            }}
            onBlurCapture={() => {
              const bar = document.getElementById('search-bar')
              if (bar) {
                bar.style.borderColor = 'var(--border-medium)'
                bar.style.boxShadow = 'none'
              }
            }}
          >
            {/* Search icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              style={{ flexShrink: 0, color: 'var(--text-tertiary)' }}
            >
              <circle cx="7.5" cy="7.5" r="5.25" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11.5 11.5L15.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            {/* Input */}
            <input
              ref={inputRef}
              dir="auto"
              type="text"
              aria-label={t.ariaSearch}
              placeholder={t.searchPlaceholder}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
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

            {/* Send button */}
            <button
              onClick={handleSend}
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
        </motion.div>

        {/* Query chips */}
        <motion.div
          {...fadeUp(0.5)}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 8,
            marginTop: 16,
            maxWidth: 580,
          }}
        >
          {t.chips.map(chip => (
            <QueryChip key={chip} label={chip} onClick={handleChipClick} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
