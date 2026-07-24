import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Lock } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import MemoryCard from '../components/MemoryCard'
import CalendarView from '../components/CalendarView'
import { MOCK_MEMORIES } from '../data/mock'
import { findCategory } from '../lib/questions'
import { BOOK_ENTRIES, getBookProgress } from '../lib/bookUtils'
import { getBookConfig } from '../lib/bookStore'
import { isAdultVerified } from '../lib/adultGate'

export default function Memories() {
  const navigate = useNavigate()

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

      {/* 캘린더 */}
      <div className="memory-section">
        <div className="section-head" style={{ padding: '0 20px' }}>
          <span className="section-title">캘린더</span>
        </div>
        <div style={{ padding: '0 20px' }}>
          <CalendarView memories={MOCK_MEMORIES} />
        </div>
      </div>

      {/* 타임라인 */}
      <div className="memory-section">
        <div className="section-head" style={{ padding: '0 20px' }}>
          <span className="section-title">타임라인</span>
        </div>
        {MOCK_MEMORIES.length > 0 ? (
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

      <BottomNav />
    </div>
  )
}
