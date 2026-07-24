import { useMemo, useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import MemoryCard from '../components/MemoryCard'
import { MOCK_MEMORIES } from '../data/mock'

export default function Memories() {
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
      </div>

      {tab === 'timeline' ? (
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
      ) : (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          캘린더 보기는 준비 중이에요.
        </div>
      )}

      <BottomNav />
    </div>
  )
}
