import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldOff, Check } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import { isAdsRemoved } from '../lib/premium'

const BENEFITS = [
  '홈, MY 탭 광고 배너 제거',
  '문답 시리즈 진입 시 뜨는 광고 게이트 제거',
  '평생 1회 결제, 추가 비용 없음',
]

export default function RemoveAdsPage() {
  const navigate = useNavigate()
  const [toast, setToast] = useState('')
  const alreadyRemoved = isAdsRemoved()

  const handlePurchase = () => {
    setToast('결제 기능은 아직 준비 중이에요.')
    setTimeout(() => setToast(''), 1800)
  }

  return (
    <div className="screen">
      <TopAppBar title="광고 제거" onBack={() => navigate('/my')} />

      <div style={{ padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(160deg, var(--sub), #fff)' }}>
          <ShieldOff size={32} color="var(--main)" />
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginTop: 10 }}>광고 없이 편하게</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--main)', marginTop: 8 }}>3,900원</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>평생 1회 결제</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {BENEFITS.map((b) => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Check size={16} color="var(--main)" />
              <span style={{ fontSize: 13, color: 'var(--text)' }}>{b}</span>
            </div>
          ))}
        </div>

        <PrimaryButton onClick={handlePurchase} disabled={alreadyRemoved}>
          {alreadyRemoved ? '이미 구매하셨어요' : '구매하기'}
        </PrimaryButton>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
