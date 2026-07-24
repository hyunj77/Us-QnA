import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar as CalendarIcon, ChevronRight, Lock } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import MemoryCard from '../components/MemoryCard'
import { MOCK_MEMORIES } from '../data/mock'
import { findCategory } from '../lib/questions'
import { BOOK_ENTRIES, getBookProgress } from '../lib/bookUtils'
import { isAdultVerified } from '../lib/adultGate'

export default function Memories() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('timeline')

  const grouped = useMemo(() => {
    const map = new Map()
    for (const m of MOCK_MEMORIES) {
      if (!map.has(m.month)) map.set(m.month, [])
      map.get(m.month).push(m)
    }
    return [...map.entries()]
  }, [])

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-title" style={{ fontSize: 20 }}>추억</div>
        <button className="topbar-icon-btn"><CalendarIcon size={20} /></button>
      </div>

      <div className="memory-toggle-row">
        <button className={`result-tab ${tab === 'timeline' ? 'result-tab-active' : ''}`} onClick={() => setTab('timeline')}>타임라인</button>
        <button className={`result-tab ${tab === 'calendar' ? 'result-tab-active' : ''}`} onClick={() => setTab('calendar')}>캘린더</button>
        <button className={`result-tab ${tab === 'book' ? 'result-tab-active' : ''}`} onClick={() => setTab('book')}>우리의 책</button>
      </div>

      {tab === 'timeline' && (
        MOCK_MEMORIES.length > 0 ? (
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
        )
      )}

      {tab === 'calendar' && (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          캘린더 보기는 준비 중이에요.
        </div>
      )}

      {tab === 'book' && (
        <div style={{ padding: '4px 20px 20px' }}>
          <p className="book-tab-desc">답변이 쌓이면 나만의 사용 설명서가 완성돼요</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {BOOK_ENTRIES.map((entry) => {
              const category = findCategory(entry.categoryId)
              if (!category) return null
              const { done, total } = getBookProgress(entry.categoryId, entry.who)
              const locked = category.isAdult && !isAdultVerified()
              return (
                <button
                  key={entry.bookId}
                  className="card book-select-card"
                  onClick={() => navigate(`/book/${entry.bookId}`)}
                >
                  <span className="icon-badge" style={{ background: `${category.color}22`, fontSize: 22 }}>{category.emoji}</span>
                  <div className="book-select-body">
                    <div className="book-select-title">{entry.label}</div>
                    <div className="book-select-desc">{done}/{total}개 답변 완료</div>
                  </div>
                  {locked ? <Lock size={16} color="var(--text-secondary)" /> : <ChevronRight size={16} className="menu-row-chevron" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
