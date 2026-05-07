import { createContext, useContext, useState } from 'react'
import translations from '../data/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  const t = translations[lang]
  const isRTL = lang === 'ar'

  function toggleLang() {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'))
  }

  return (
    <LanguageContext.Provider value={{ lang, t, isRTL, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
