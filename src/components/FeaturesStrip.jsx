import { useLanguage } from '../context/LanguageContext'

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 1.75C10 1.75 7 5.5 7 10C7 14.5 10 18.25 10 18.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 1.75C10 1.75 13 5.5 13 10C13 14.5 10 18.25 10 18.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M1.75 10H18.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2.5 6.5H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2.5 13.5H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function DocumentCheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M11.5 2H5C4.17 2 3.5 2.67 3.5 3.5V16.5C3.5 17.33 4.17 18 5 18H15C15.83 18 16.5 17.33 16.5 16.5V7L11.5 2Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
      />
      <path d="M11.5 2V7H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 12.5L9 14.5L13 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldLockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2L3.5 5V9.5C3.5 13.14 6.29 16.57 10 17.5C13.71 16.57 16.5 13.14 16.5 9.5V5L10 2Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
      />
      <rect x="7.5" y="9.5" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9.5V8C10 7.17 9.33 6.5 8.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 9.5V8C10 7.17 10.67 6.5 11.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const features = [
  {
    icon: <GlobeIcon />,
    iconColor: 'var(--blue-info)',
    iconBg: '#e6f1fb',
    titleKey: 'feature1Title',
    descKey: 'feature1Desc',
  },
  {
    icon: <DocumentCheckIcon />,
    iconColor: 'var(--green-active)',
    iconBg: '#e1f5ee',
    titleKey: 'feature2Title',
    descKey: 'feature2Desc',
  },
  {
    icon: <ShieldLockIcon />,
    iconColor: 'var(--amber-500)',
    iconBg: '#faeeda',
    titleKey: 'feature3Title',
    descKey: 'feature3Desc',
  },
]

export default function FeaturesStrip() {
  const { t } = useLanguage()

  return (
    <section
      style={{
        backgroundColor: 'var(--surface-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '24px 32px',
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0,
        }}
      >
        {features.map((f, i) => (
          <div
            key={f.titleKey}
            style={{
              flex: '1 1 220px',
              padding: '8px 28px',
              borderRight:
                i < features.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: f.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: f.iconColor,
                marginBottom: 12,
              }}
            >
              {f.icon}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 6,
              }}
            >
              {t[f.titleKey]}
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
              }}
            >
              {t[f.descKey]}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
