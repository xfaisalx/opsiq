import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

export default function QueryChip({ label, onClick }) {
  const { t } = useLanguage()

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
      onClick={() => onClick(label)}
      aria-label={`${t.ariaChip}: ${label}`}
      style={{
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 9999,
        padding: '6px 14px',
        fontSize: 12,
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'border-color 150ms ease, color 150ms ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--amber-500)'
        e.currentTarget.style.color = 'var(--amber-500)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
        e.currentTarget.style.color = 'var(--text-secondary)'
      }}
    >
      {label}
    </motion.button>
  )
}
