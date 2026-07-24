import { hasAdsGateExemption } from './premium'

const COUNT_KEY = 'us-qna-ad-gate-count'
const SHOW_EVERY = 4

// 문답 카테고리 진입 등 특정 동작을 할 때마다 호출한다.
// 4번에 1번만 광고 게이트를 보여주고, 광고 제거 구매자/구독자는 항상 건너뛴다.
export function shouldShowAdGate() {
  if (hasAdsGateExemption()) return false
  const count = Number(localStorage.getItem(COUNT_KEY) || 0) + 1
  if (count >= SHOW_EVERY) {
    localStorage.setItem(COUNT_KEY, '0')
    return true
  }
  localStorage.setItem(COUNT_KEY, String(count))
  return false
}
