import { useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import { getTodayFortune } from '../data/dailyFortune'

function formatToday() {
  return new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })
}

export default function DailyFortunePage() {
  const navigate = useNavigate()
  const fortunes = getTodayFortune()

  return (
    <div className="screen">
      <TopAppBar title="오늘의 운세" onBack={() => navigate('/community')} />

      <div style={{ padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>{formatToday()}</p>

        {fortunes.map((f) => (
          <div key={f.key} className="card report-card">
            <div className="report-card-head">
              <span className="report-card-emoji">{f.emoji}</span>
              <span className="report-card-title">{f.label}</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--main)' }}>{f.score}점</span>
            </div>
            <div className="report-progress-track">
              <div className="report-progress-fill" style={{ width: `${f.score}%` }} />
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{f.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
