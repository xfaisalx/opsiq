import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import mockConversation from '../data/mockConversation'
import MessageBubble from './MessageBubble'

let nextId = 100

function TypingIndicator({ isRTL }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        marginBottom: 16,
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
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2.5C8 2.5 9.5 2 10.5 3C11.5 4 11.5 5.5 11 6.5C12 6.5 13 7.5 13 8.5C13 9.5 12 10.5 11 10.5C11.5 11.5 11 13 10 13.5C9 14 8 13.5 8 13.5" stroke="var(--amber-400)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 2.5C8 2.5 6.5 2 5.5 3C4.5 4 4.5 5.5 5 6.5C4 6.5 3 7.5 3 8.5C3 9.5 4 10.5 5 10.5C4.5 11.5 5 13 6 13.5C7 14 8 13.5 8 13.5" stroke="var(--amber-400)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="8" y1="2.5" x2="8" y2="13.5" stroke="var(--amber-400)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
      {/* Dots */}
      <div
        style={{
          backgroundColor: 'var(--surface-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: isRTL ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--text-tertiary)', display: 'inline-block' }} />
        <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--text-tertiary)', display: 'inline-block' }} />
        <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--text-tertiary)', display: 'inline-block' }} />
      </div>
    </div>
  )
}

export default function ChatArea({ pendingQuery, onQueryHandled, chatActive }) {
  const { lang, t, isRTL } = useLanguage()
  const [messages, setMessages] = useState(mockConversation[lang])
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const prevLang = useRef(lang)

  // Reset messages when language changes
  useEffect(() => {
    if (prevLang.current !== lang) {
      setMessages(mockConversation[lang])
      prevLang.current = lang
    }
  }, [lang])

  // Handle new query from hero search bar
  useEffect(() => {
    if (!pendingQuery) return

    const userMsg = { id: nextId++, role: 'user', text: pendingQuery }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)
    onQueryHandled()

    fetch('https://opsiq.azurewebsites.net/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: pendingQuery, language: lang }),
    })
      .then(res => res.json())
      .then(data => {
        setIsTyping(false)
        setMessages(prev => [...prev, { id: nextId++, role: 'assistant', text: data.answer }])
      })
      .catch(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, { id: nextId++, role: 'assistant', text: t.mockResponse }])
      })
  }, [pendingQuery])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function clearMessages() {
    setMessages([])
  }

  return (
    <section style={{
      backgroundColor: 'var(--surface-primary)',
      padding: chatActive ? 0 : '32px',
      flex: chatActive ? 1 : undefined,
      display: chatActive ? 'flex' : undefined,
      flexDirection: chatActive ? 'column' : undefined,
      overflow: chatActive ? 'hidden' : undefined,
    }}>
      <div style={{
        maxWidth: 820,
        margin: '0 auto',
        width: '100%',
        flex: chatActive ? 1 : undefined,
        display: chatActive ? 'flex' : undefined,
        flexDirection: chatActive ? 'column' : undefined,
        overflow: chatActive ? 'hidden' : undefined,
        padding: chatActive ? '24px 32px 0' : undefined,
      }}>
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 500,
            }}
          >
            {t.chatLabel}
          </span>
          <button
            onClick={clearMessages}
            aria-label={t.ariaClear}
            style={{
              fontSize: 11,
              color: 'var(--text-tertiary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              padding: '2px 4px',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy-900)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            {t.clearChat}
          </button>
        </div>

        {/* Scrollable message container */}
        <div
          style={{
            flex: chatActive ? 1 : undefined,
            maxHeight: chatActive ? undefined : 420,
            overflowY: 'auto',
            paddingRight: isRTL ? 0 : 4,
            paddingLeft: isRTL ? 4 : 0,
          }}
        >
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} isRTL={isRTL} />
          ))}
          {isTyping && <TypingIndicator isRTL={isRTL} />}
          <div ref={bottomRef} />
        </div>
      </div>
    </section>
  )
}
