import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import TextField from '../components/TextField'
import { computeCompatibility } from '../data/compatibility'

export default function CompatibilityPage() {
  const navigate = useNavigate()
  const [nameA, setNameA] = useState('')
  const [birthA, setBirthA] = useState('')
  const [nameB, setNameB] = useState('')
  const [birthB, setBirthB] = useState('')
  const [result, setResult] = useState(null)

  const canSubmit = nameA.trim() && birthA && nameB.trim() && birthB

  const handleCompute = () => {
    if (!canSubmit) return
    setResult(computeCompatibility(nameA, birthA, nameB, birthB))
  }

  return (
    <div className="screen">
      <TopAppBar title="AI 궁합 보기" onBack={() => navigate('/community')} />

      <div style={{ padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!result ? (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              두 사람의 이름과 생년월일을 입력하면 궁합을 확인할 수 있어요.
            </p>

            <div>
              <div className="compose-field-label">나의 이름 / 생년월일</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <TextField placeholder="이름" value={nameA} onChange={(e) => setNameA(e.target.value)} style={{ flex: 1 }} />
                <TextField type="date" value={birthA} onChange={(e) => setBirthA(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>

            <div>
              <div className="compose-field-label">상대방 이름 / 생년월일</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <TextField placeholder="이름" value={nameB} onChange={(e) => setNameB(e.target.value)} style={{ flex: 1 }} />
                <TextField type="date" value={birthB} onChange={(e) => setBirthB(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>

            <PrimaryButton onClick={handleCompute} disabled={!canSubmit}>궁합 확인하기</PrimaryButton>
          </>
        ) : (
          <>
            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(160deg, var(--sub), #fff)' }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{nameA} ❤️ {nameB}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--main)', marginTop: 6 }}>{result.score}점</div>
              <p style={{ fontSize: 13, color: 'var(--text)', marginTop: 8, lineHeight: 1.6 }}>{result.message}</p>
            </div>

            {result.dimensions.map((d) => (
              <div key={d.key} className="card report-card">
                <div className="report-card-head">
                  <span className="report-card-emoji">{d.emoji}</span>
                  <span className="report-card-title">{d.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--main)' }}>{d.score}</span>
                </div>
                <div className="report-progress-track">
                  <div className="report-progress-fill" style={{ width: `${d.score}%` }} />
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{d.message}</p>
              </div>
            ))}

            <PrimaryButton onClick={() => setResult(null)}>다시 확인하기</PrimaryButton>
          </>
        )}
      </div>
    </div>
  )
}
