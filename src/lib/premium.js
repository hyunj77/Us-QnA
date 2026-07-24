// 프리미엄 구독/결제 시스템이 아직 없어서 항상 false를 반환하는 자리만 잡아둔 상태.
// 나중에 실제 결제를 붙이면 이 함수들만 진짜 구매/구독 상태 체크로 바꾸면
// 광고 배너·광고 게이트 등 이 함수를 쓰는 모든 곳에 자동으로 반영된다.
const ADS_REMOVED_KEY = 'us-qna-ads-removed'

export function isPremiumUser() {
  return false
}

// 광고 제거 단품 결제 여부. 결제 연동 전까지는 항상 false.
export function isAdsRemoved() {
  return localStorage.getItem(ADS_REMOVED_KEY) === 'true'
}

export function hasAdsGateExemption() {
  return isPremiumUser() || isAdsRemoved()
}
