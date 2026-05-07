import { useLanguage } from '../context/LanguageContext'

export default function LanguageToggle() {
  const { t, toggleLang } = useLanguage()

  return (
    <button
      onClick={toggleLang}
      aria-label={t.ariaLangToggle}
      style={{
        backgroundColor: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 9999,
        padding: '6px 16px',
        fontSize: 12,
        color: '#fff',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background-color 150ms ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
    >
      {t.langToggle}
    </button>
  )
}
