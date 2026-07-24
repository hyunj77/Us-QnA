import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react'
import { getAnniversaryLabel } from '../lib/anniversary'
import { getCustomAnniversary, toggleCustomAnniversary } from '../lib/customAnniversaries'

const DOW = ['일', '월', '화', '수', '목', '금', '토']
const PRESETS = ['첫 만남', '첫 데이트', '첫 키스', '동거 시작', '약혼', '결혼', '프로포즈', '생일']

export default function CalendarView({ memories = [] }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth()) // 0-indexed
  const [picker, setPicker] = useState(null) // Date | null
  const [, forceRerender] = useState(0)

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

  const handleSelectPreset = (label) => {
    if (!picker) return
    toggleCustomAnniversary(picker, label)
    setPicker(null)
    forceRerender((n) => n + 1)
  }

  const handleRemove = () => {
    if (!picker) return
    const current = getCustomAnniversary(picker)
    if (current) toggleCustomAnniversary(picker, current.label)
    setPicker(null)
    forceRerender((n) => n + 1)
  }

  const pickerCustom = picker ? getCustomAnniversary(picker) : null

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
          const custom = getCustomAnniversary(dateObj)
          const hasMemory = memoryDaySet.has(`${year}-${month + 1}-${d}`)
          const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate()
          return (
            <button
              key={d}
              type="button"
              className={`calendar-cell ${anniv ? 'calendar-cell-anniv' : ''} ${custom ? 'calendar-cell-custom' : ''} ${isToday ? 'calendar-cell-today' : ''}`}
              onClick={() => setPicker(dateObj)}
            >
              <span className="calendar-date">{d}</span>
              {anniv && <span className="calendar-anniv-dot">🎉</span>}
              {!anniv && custom && <span className="calendar-anniv-dot">💗</span>}
              {hasMemory && !anniv && !custom && <span className="calendar-memory-dot" />}
            </button>
          )
        })}
      </div>

      <div className="calendar-legend">
        <span><span className="calendar-anniv-dot">🎉</span> 자동 기념일</span>
        <span><span className="calendar-anniv-dot">💗</span> 직접 추가</span>
        <span><span className="calendar-memory-dot" /> 추억이 있는 날</span>
      </div>

      {picker && (
        <div className="sheet-overlay" onClick={() => setPicker(null)}>
          <div className="sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <span className="sheet-title">
                {picker.getMonth() + 1}월 {picker.getDate()}일 기념일 {pickerCustom ? '수정' : '추가'}
              </span>
              <button className="topbar-icon-btn" onClick={() => setPicker(null)}><X size={18} /></button>
            </div>

            <div className="anniv-preset-grid">
              {PRESETS.map((label) => (
                <button
                  key={label}
                  className={`anniv-preset-btn ${pickerCustom?.label === label ? 'anniv-preset-btn-active' : ''}`}
                  onClick={() => handleSelectPreset(label)}
                >
                  {label}
                </button>
              ))}
            </div>

            {pickerCustom && (
              <button className="btn-secondary anniv-remove-btn" onClick={handleRemove}>
                <Trash2 size={16} /> 이 날짜의 기념일 삭제
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
