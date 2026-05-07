import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer
      style={{
        backgroundColor: 'var(--navy-950)',
        padding: '10px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 4,
      }}
    >
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{t.footerLeft}</span>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{t.footerRight}</span>
    </footer>
  )
}
