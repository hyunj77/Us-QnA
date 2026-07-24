import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/onboarding'), 1600)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="splash-wrap" onClick={() => navigate('/onboarding')}>
      <div className="splash-logo">💌</div>
      <div className="splash-name">우리 사용 설명서</div>
      <div className="splash-slogan">서로를 더 알아가는 시간</div>
    </div>
  )
}
