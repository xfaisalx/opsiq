import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

function DocIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M6.5 1H2.5C2.22 1 2 1.22 2 1.5V9.5C2 9.78 2.22 10 2.5 10H8.5C8.78 10 9 9.78 9 9.5V3.5L6.5 1Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M6.5 1V3.5H9" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  )
}

function BrainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2.5C8 2.5 9.5 2 10.5 3C11.5 4 11.5 5.5 11 6.5C12 6.5 13 7.5 13 8.5C13 9.5 12 10.5 11 10.5C11.5 11.5 11 13 10 13.5C9 14 8 13.5 8 13.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 2.5C8 2.5 6.5 2 5.5 3C4.5 4 4.5 5.5 5 6.5C4 6.5 3 7.5 3 8.5C3 9.5 4 10.5 5 10.5C4.5 11.5 5 13 6 13.5C7 14 8 13.5 8 13.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="8" y1="2.5" x2="8" y2="13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export default function MessageBubble({ message, isRTL }) {
  const { t } = useLanguage()
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          display: 'flex',
          justifyContent: isRTL ? 'flex-start' : 'flex-end',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            maxWidth: '60%',
            backgroundColor: 'var(--navy-900)',
            borderRadius: isRTL ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
            padding: '12px 16px',
            fontSize: 13,
            color: '#fff',
            lineHeight: 1.6,
          }}
        >
          {message.text}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        display: 'flex',
        gap: 10,
        flexDirection: isRTL ? 'row-reverse' : 'row',
        marginBottom: 16,
        alignItems: 'flex-start',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: 'var(--navy-900)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--amber-400)',
          flexShrink: 0,
        }}
      >
        <BrainIcon />
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: '75%' }}>
        <div
          style={{
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: isRTL ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
            padding: '12px 16px',
            fontSize: 13,
            color: 'var(--text-primary)',
            lineHeight: 1.7,
          }}
        >
          {message.text}
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginTop: 8,
              justifyContent: isRTL ? 'flex-end' : 'flex-start',
            }}
          >
            {message.sources.map(src => (
              <span
                key={src}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  backgroundColor: '#e6f1fb',
                  border: '1px solid rgba(24,95,165,0.2)',
                  borderRadius: 6,
                  padding: '3px 10px',
                  fontSize: 11,
                  color: 'var(--blue-info)',
                  fontWeight: 500,
                }}
              >
                <DocIcon />
                {src}
              </span>
            ))}
          </div>
        )}

        {/* Confidence */}
        {message.confidence && (
          <div
            style={{
              marginTop: 6,
              fontSize: 11,
              color: 'var(--text-tertiary)',
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {t.confidenceLabel}: {message.confidence}
          </div>
        )}
      </div>
    </motion.div>
  )
}
