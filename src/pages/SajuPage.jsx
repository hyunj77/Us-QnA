import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import TextField from '../components/TextField'
import { computeSaju } from '../data/sajuData'

export default function SajuPage() {
  const navigate = useNavigate()
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [result, setResult] = useState(null)

  const handleCompute = () => {
    if (!birthDate) return
    setResult(computeSaju(birthDate, birthTime))
  }

  return (
    <div className="screen">
      <TopAppBar title="AI 사주" onBack={() => navigate('/community')} />

      <div style={{ padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!result ? (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              생년월일을 입력하면 오행 분포와 올해의 운세를 확인할 수 있어요.
            </p>

            <div>
              <div className="compose-field-label">생년월일</div>
              <TextField type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>

            <div>
              <div className="compose-field-label">태어난 시간 <span className="compose-field-optional">(모르면 비워두세요)</span></div>
              <TextField type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
            </div>

            <PrimaryButton onClick={handleCompute} disabled={!birthDate}>사주 보기</PrimaryButton>
          </>
        ) : (
          <>
            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(160deg, var(--sub), #fff)' }}>
              <div style={{ fontSize: 32 }}>{result.dominant.emoji}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginTop: 4 }}>
                주된 기운: {result.dominant.label}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.6 }}>{result.dominant.trait}</p>
            </div>

            <div className="card report-card">
              <div className="report-card-head">
                <span className="report-card-emoji">☯️</span>
                <span className="report-card-title">오행 분포</span>
              </div>
              {result.distribution.map((o) => (
                <div key={o.key} className="report-progress-row">
                  <div className="report-progress-label">
                    <span>{o.emoji} {o.label}</span>
                    <span>{o.percent}%</span>
                  </div>
                  <div className="report-progress-track">
                    <div className="report-progress-fill" style={{ width: `${o.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="card report-card">
              <div className="report-card-head">
                <span className="report-card-emoji">📜</span>
                <span className="report-card-title">총평</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{result.summary}</p>
            </div>

            {result.lifeAreas.map((a) => (
              <div key={a.key} className="card report-card">
                <div className="report-card-head">
                  <span className="report-card-emoji">{a.emoji}</span>
                  <span className="report-card-title">{a.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--main)' }}>{a.score}</span>
                </div>
                <div className="report-progress-track">
                  <div className="report-progress-fill" style={{ width: `${a.score}%` }} />
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{a.message}</p>
              </div>
            ))}

            <div className="report-reco-lead">💡 {result.advice}</div>

            <PrimaryButton onClick={() => setResult(null)}>다시 보기</PrimaryButton>
          </>
        )}
      </div>
    </div>
  )
}
