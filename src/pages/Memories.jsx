import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Lock, Mail, X } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import MemoryCard from '../components/MemoryCard'
import CalendarView from '../components/CalendarView'
import PrimaryButton from '../components/PrimaryButton'
import { MOCK_MEMORIES } from '../data/mock'
import { findCategory } from '../lib/questions'
import { BOOK_ENTRIES, getBookProgress } from '../lib/bookUtils'
import { getBookConfig } from '../lib/bookStore'
import { isAdultVerified } from '../lib/adultGate'
import { isLoggedIn } from '../lib/authState'
import { canWriteLetter, getAllLetters, sendLetter } from '../lib/letterStore'

function formatLetterDate(iso) {
  return new Date(iso).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function Memories() {
  const navigate = useNavigate()
  // 실제 로그인한 사용자는 진짜 답변이 쌓이기 전까지 데모용 추억을 보여주지 않는다.
  const memories = useMemo(() => (isLoggedIn() ? [] : MOCK_MEMORIES), [])

  const [letters, setLetters] = useState([])
  const [composing, setComposing] = useState(false)
  const [letterBody, setLetterBody] = useState('')
  const [sending, setSending] = useState(false)
  const [letterError, setLetterError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (isLoggedIn() && canWriteLetter()) {
      getAllLetters(3).then(setLetters)
    }
  }, [])

  const handleSendLetter = async () => {
    if (!letterBody.trim() || sending) return
    setSending(true)
    setLetterError('')
    try {
      await sendLetter(letterBody)
      setLetterBody('')
      setComposing(false)
      setToast('💌 편지를 보냈어요')
      setTimeout(() => setToast(''), 1800)
      getAllLetters(3).then(setLetters)
    } catch (err) {
      setLetterError(err.message || '편지를 보내지 못했어요.')
    } finally {
      setSending(false)
    }
  }

  const grouped = useMemo(() => {
    const map = new Map()
    for (const m of memories) {
      if (!map.has(m.month)) map.set(m.month, [])
      map.get(m.month).push(m)
    }
    return [...map.entries()]
  }, [memories])

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-title" style={{ fontSize: 20 }}>추억</div>
      </div>

      {/* 우리의 책 - 스와이프 카드 캐러셀 */}
      <div className="memory-section">
        <div className="section-head" style={{ padding: '0 20px' }}>
          <span className="section-title">우리의 책</span>
          <button className="btn-text" onClick={() => navigate('/books')}>더보기 <ChevronRight size={12} /></button>
        </div>
        <p className="book-tab-desc" style={{ padding: '0 20px' }}>답변이 쌓이면 나만의 사용 설명서가 완성돼요</p>
        <div className="book-carousel">
          {BOOK_ENTRIES.map((entry) => {
            const category = findCategory(entry.categoryId)
            if (!category) return null
            const config = getBookConfig(entry.bookId, entry.who)
            const { done, total } = getBookProgress(entry.categoryId, entry.who)
            const locked = category.isAdult && !isAdultVerified()
            const title = entry.who === 'shared' ? '우리 사용 설명서' : `${config.nickname} 사용 설명서`
            return (
              <button key={entry.bookId} className="book-carousel-card" onClick={() => navigate(`/book/${entry.bookId}`)}>
                <div className="book-carousel-cover">
                  {locked ? (
                    <Lock size={28} />
                  ) : config.coverType === 'photo' && config.coverImage ? (
                    <img src={config.coverImage} alt="" />
                  ) : (
                    <span>{config.coverImage}</span>
                  )}
                </div>
                <div className="book-carousel-title">{title}</div>
                <div className="book-carousel-desc">{entry.label} · {done}/{total}개 답변 완료</div>
              </button>
            )
          })}
        </div>
      </div>

      {isLoggedIn() && canWriteLetter() && (
        <div className="memory-section">
          <div className="section-head" style={{ padding: '0 20px' }}>
            <span className="section-title">편지</span>
          </div>
          <div style={{ padding: '0 20px' }}>
            <button className="poke-card" style={{ marginBottom: 14 }} onClick={() => setComposing(true)}>
              <span className="icon-badge" style={{ background: 'var(--sub)' }}><Mail size={18} color="var(--main)" /></span>
              <div className="poke-card-body">
                <div className="poke-card-title">편지 쓰기</div>
                <div className="poke-card-desc">상대방에게 마음을 담은 편지를 보내보세요</div>
              </div>
            </button>

            <div className="section-head" style={{ padding: 0, marginBottom: 10 }}>
              <span className="section-title" style={{ fontSize: 14 }}>편지 보관함</span>
              <button className="btn-text" onClick={() => navigate('/letters')}>더보기 <ChevronRight size={12} /></button>
            </div>

            {letters.length > 0 ? (
              letters.map((letter) => (
                <div key={letter.id} className="letter-card">
                  <div className="letter-card-head">
                    <span
                      className="letter-card-tag"
                      style={{
                        background: letter.direction === 'sent' ? 'var(--sub)' : '#E3F5E0',
                        color: letter.direction === 'sent' ? 'var(--main)' : '#2F9E44',
                      }}
                    >
                      {letter.direction === 'sent' ? '보낸 편지' : '받은 편지'}
                    </span>
                    <span className="letter-card-time">{formatLetterDate(letter.created_at)}</span>
                  </div>
                  <p className="letter-card-body">{letter.body}</p>
                </div>
              ))
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', padding: '16px 0' }}>
                아직 주고받은 편지가 없어요.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 캘린더 */}
      <div className="memory-section">
        <div className="section-head" style={{ padding: '0 20px' }}>
          <span className="section-title">캘린더</span>
        </div>
        <div style={{ padding: '0 20px' }}>
          <CalendarView memories={memories} />
        </div>
      </div>

      {/* 타임라인 */}
      <div className="memory-section">
        <div className="section-head" style={{ padding: '0 20px' }}>
          <span className="section-title">타임라인</span>
        </div>
        {memories.length > 0 ? (
          <div>
            {grouped.map(([month, items]) => (
              <div key={month}>
                <div className="memory-month">{month}</div>
                {items.map((m) => (
                  <MemoryCard key={m.id} date={m.date} title={m.title} preview={m.preview} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-emoji">📷</div>
            <div className="empty-state-title">아직 추억이 없어요.</div>
            <div className="empty-state-desc">문답에 답변하면 이곳에 추억으로 쌓여요!</div>
          </div>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}

      {composing && (
        <div className="sheet-overlay" onClick={() => setComposing(false)}>
          <div className="sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <span className="sheet-title"><Mail size={16} style={{ marginRight: 6, verticalAlign: -3 }} />편지 쓰기</span>
              <button className="topbar-icon-btn" onClick={() => setComposing(false)}><X size={18} /></button>
            </div>

            <textarea
              className="compose-textarea"
              style={{ minHeight: 140 }}
              placeholder="상대방에게 전하고 싶은 마음을 적어보세요."
              value={letterBody}
              maxLength={1000}
              onChange={(e) => setLetterBody(e.target.value)}
              autoFocus
            />

            {letterError && <p className="auth-notice" style={{ marginTop: 12 }}>{letterError}</p>}

            <PrimaryButton onClick={handleSendLetter} disabled={!letterBody.trim() || sending} style={{ marginTop: 16 }}>
              {sending ? '보내는 중...' : '편지 보내기'}
            </PrimaryButton>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
