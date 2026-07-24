import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import { drawLoveFortune } from '../data/loveFortune'

export default function LoveFortunePage() {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [drawing, setDrawing] = useState(false)

  const handleDraw = () => {
    setDrawing(true)
    setTimeout(() => {
      setResult(drawLoveFortune())
      setDrawing(false)
    }, 450)
  }

  return (
    <div className="screen">
      <TopAppBar title="나의 연애운 보기" onBack={() => navigate('/community')} />

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
        {!result && (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            오늘 나의 연애운이 궁금하다면,<br />버튼을 눌러 확인해보세요.
          </p>
        )}

        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'linear-gradient(160deg, var(--sub), var(--main))',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-btn)',
          }}
        >
          {result ? (
            <>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{result.score}</div>
              <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.9 }}>연애운 점수</div>
            </>
          ) : (
            <Heart size={40} fill="#fff" />
          )}
        </div>

        {result && (
          <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, maxWidth: 280 }}>{result.message}</p>
        )}

        <PrimaryButton style={{ width: '100%' }} onClick={handleDraw} disabled={drawing}>
          {drawing ? '연애운을 확인하는 중...' : result ? '다시 확인하기' : '연애운 보기'}
        </PrimaryButton>
      </div>
    </div>
  )
}
