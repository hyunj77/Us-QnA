import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import PrimaryButton from '../components/PrimaryButton'
import AdBanner from '../components/AdBanner'

const COUNTDOWN_SEC = 3

export default function AdGatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const next = location.state?.next || '/qna'
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SEC)

  useEffect(() => {
    if (secondsLeft <= 0) return undefined
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  const handleContinue = () => {
    navigate(next, { replace: true })
  }

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="topbar" style={{ justifyContent: 'flex-end' }}>
        {secondsLeft <= 0 && (
          <button className="topbar-icon-btn" onClick={handleContinue}><X size={20} /></button>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 20px' }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>💌 잠시 광고를 보고 이동할게요</div>

        <AdBanner width={320} height={250} showPlaceholder />

        <PrimaryButton style={{ width: '100%', maxWidth: 320 }} onClick={handleContinue} disabled={secondsLeft > 0}>
          {secondsLeft > 0 ? `${secondsLeft}초 후 계속하기` : '계속하기'}
        </PrimaryButton>

        <button className="btn-text" onClick={() => navigate('/settings/remove-ads')} style={{ fontSize: 12 }}>
          광고 없이 보고 싶다면? →
        </button>
      </div>
    </div>
  )
}
