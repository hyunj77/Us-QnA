import { useEffect, useRef } from 'react'
import { hasAdsGateExemption } from '../lib/premium'

// 카카오 애드핏 배너. VITE_ADFIT_UNIT_ID가 설정되기 전까지는 아무것도 렌더링하지 않는다.
// 광고 제거를 구매했거나 구독 중인 사용자에게는 항상 숨긴다.
// SPA에서는 화면을 옮길 때마다 새 <ins> 영역이 생기므로, 광고 스크립트를 매번 새로
// 붙여서 그때그때 스캔되도록 한다.
const AD_UNIT_ID = import.meta.env.VITE_ADFIT_UNIT_ID

export default function AdBanner({ width = 320, height = 100, showPlaceholder = false }) {
  const wrapRef = useRef(null)
  const exempt = hasAdsGateExemption()

  useEffect(() => {
    if (exempt || !AD_UNIT_ID || !wrapRef.current) return undefined
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js'
    script.async = true
    wrapRef.current.appendChild(script)
    return () => script.remove()
  }, [exempt])

  if (exempt) return null

  if (!AD_UNIT_ID) {
    if (!showPlaceholder) return null
    return (
      <div className="ad-banner-placeholder" style={{ width, height }}>
        광고 영역
      </div>
    )
  }

  return (
    <div className="ad-banner-wrap" ref={wrapRef}>
      <span className="ad-banner-label">광고</span>
      <ins
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit={AD_UNIT_ID}
        data-ad-width={String(width)}
        data-ad-height={String(height)}
      />
    </div>
  )
}
