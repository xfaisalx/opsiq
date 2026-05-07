import { useLanguage } from '../context/LanguageContext'
import LanguageToggle from './LanguageToggle'

export default function Navbar() {
  const { t } = useLanguage()

  return (
    <nav
      style={{ backgroundColor: 'var(--navy-900)', height: 64 }}
      className="w-full flex items-center px-8 gap-4 relative z-50"
    >
      {/* Logo + system name */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div
          style={{
            backgroundColor: 'var(--navy-800)',
            borderRadius: 6,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Layered lines SVG logo */}
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <rect x="0" y="0" width="18" height="2.5" rx="1.25" fill="var(--amber-400)" />
            <rect x="2" y="5.75" width="14" height="2.5" rx="1.25" fill="var(--amber-400)" opacity="0.75" />
            <rect x="4" y="11.5" width="10" height="2.5" rx="1.25" fill="var(--amber-400)" opacity="0.5" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
            {t.systemName}
          </div>
          <div style={{ fontSize: 11, color: 'var(--amber-300)', lineHeight: 1.3 }}>
            {t.systemSubtitle}
          </div>
        </div>
      </div>

      {/* Center: KB status pill — hidden on mobile */}
      <div className="flex-1 hidden md:flex items-center justify-center">
        <div
          style={{
            backgroundColor: 'rgba(29,158,117,0.12)',
            border: '1px solid rgba(29,158,117,0.3)',
            borderRadius: 9999,
            padding: '5px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          <span
            className="pulse-dot"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'var(--green-active)',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 11, color: 'var(--green-active)', fontWeight: 500 }}>
            {t.kbStatus}
          </span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3 flex-shrink-0 ms-auto">
        <LanguageToggle />

        {/* User avatar */}
        <div
          aria-label="User profile"
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            backgroundColor: 'var(--amber-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
            flexShrink: 0,
            letterSpacing: 0.5,
          }}
        >
          {t.userInitials}
        </div>
      </div>
    </nav>
  )
}
