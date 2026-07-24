import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getAnniversaryLabel } from '../lib/anniversary'

const DOW = ['일', '월', '화', '수', '목', '금', '토']

export default function CalendarView({ memories = [] }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth()) // 0-indexed

  const memoryDaySet = useMemo(() => {
    const set = new Set()
    for (const m of memories) {
      const match = m.month?.match(/(\d+)년\s*(\d+)월/)
      const [dm, dd] = (m.date || '').split('.').map(Number)
      if (!match || !dd) continue
      const y = Number(match[1])
      const mo = Number(match[2])
      if (mo === dm) set.add(`${y}-${mo}-${dd}`)
    }
    return set
  }, [memories])

  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const goPrev = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1) } else setMonth((m) => m - 1)
  }
  const goNext = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1) } else setMonth((m) => m + 1)
  }

  return (
    <div className="card calendar-card">
      <div className="calendar-nav">
        <button type="button" className="topbar-icon-btn" onClick={goPrev}><ChevronLeft size={18} /></button>
        <span className="calendar-nav-label">{year}년 {month + 1}월</span>
        <button type="button" className="topbar-icon-btn" onClick={goNext}><ChevronRight size={18} /></button>
      </div>

      <div className="calendar-grid">
        {DOW.map((d) => (
          <div key={d} className="calendar-dow">{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`} className="calendar-cell calendar-cell-empty" />
          const dateObj = new Date(year, month, d)
          const anniv = getAnniversaryLabel(dateObj)
          const hasMemory = memoryDaySet.has(`${year}-${month + 1}-${d}`)
          const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate()
          return (
            <div key={d} className={`calendar-cell ${anniv ? 'calendar-cell-anniv' : ''} ${isToday ? 'calendar-cell-today' : ''}`}>
              <span className="calendar-date">{d}</span>
              {anniv && <span className="calendar-anniv-dot">🎉</span>}
              {hasMemory && !anniv && <span className="calendar-memory-dot" />}
            </div>
          )
        })}
      </div>

      <div className="calendar-legend">
        <span><span className="calendar-anniv-dot">🎉</span> 기념일</span>
        <span><span className="calendar-memory-dot" /> 추억이 있는 날</span>
      </div>
    </div>
  )
}
