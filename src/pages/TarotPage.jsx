import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import { drawTarotCards } from '../data/tarotDeck'

export default function TarotPage() {
  const navigate = useNavigate()
  const [card, setCard] = useState(null)
  const [drawing, setDrawing] = useState(false)

  const handleDraw = () => {
    setDrawing(true)
    setTimeout(() => {
      const [drawn] = drawTarotCards(1)
      setCard(drawn)
      setDrawing(false)
    }, 500)
  }

  return (
    <div className="screen">
      <TopAppBar title="AI 타로 보기" onBack={() => navigate('/community')} />

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
        {!card && (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            오늘 우리의 기운이 궁금하다면,<br />카드 한 장을 뽑아보세요.
          </p>
        )}

        <div
          style={{
            width: 140,
            height: 200,
            borderRadius: 16,
            background: card ? '#fff' : 'linear-gradient(160deg, var(--sub), var(--purple-light))',
            border: '1.5px solid var(--divider)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-card)',
            transform: card?.reversed ? 'rotate(180deg)' : 'none',
          }}
        >
          {card ? (
            <span style={{ fontSize: 52 }}>{card.emoji}</span>
          ) : (
            <span style={{ fontSize: 32, opacity: drawing ? 0.4 : 0.8 }}>🔮</span>
          )}
        </div>

        {card && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
              {card.name} {card.reversed ? '(역방향)' : '(정방향)'}
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 10 }}>
              {card.reversed ? card.reversed : card.upright}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, width: '100%', marginTop: 8 }}>
          {card && <SecondaryButton style={{ flex: 1 }} onClick={() => navigate('/community')}>커뮤니티로</SecondaryButton>}
          <PrimaryButton style={{ flex: 1 }} onClick={handleDraw} disabled={drawing}>
            {drawing ? '카드를 뽑는 중...' : card ? '다시 뽑기' : '카드 뽑기'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
