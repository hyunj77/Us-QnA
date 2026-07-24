import { MOCK_PROFILE } from '../data/mock'
import { isLoggedIn } from './authState'
import { getMyProfile } from './coupleStore'
import { supabase } from './supabaseClient'

// 로그인 상태와 마찬가지로, 커플 정보(연결 여부/시작일)도 동기적으로 바로 읽을 수 있도록 캐싱한다.
let cachedProfile = null
let cachedCouple = null

export function getCachedProfile() {
  return cachedProfile
}

export function getCachedCouple() {
  return cachedCouple
}

// 로그인 직후, 그리고 커플 연결이 막 끝난 직후에 호출해서 캐시를 채운다.
export async function refreshCoupleState() {
  if (!supabase) return null
  cachedProfile = await getMyProfile()
  if (!cachedProfile?.couple_id) {
    cachedCouple = null
    return null
  }
  const { data } = await supabase.from('couples').select('*').eq('id', cachedProfile.couple_id).maybeSingle()
  cachedCouple = data
  return data
}

// couple_id가 있어도(=초대 코드를 만들기만 하고) 상대방이 아직 코드를 입력하지 않았으면
// "진짜 커플로 연결된" 상태가 아니다 — member_a/member_b가 둘 다 채워져 있어야 한다.
export function isCoupleConnected() {
  return !!(cachedCouple?.member_a && cachedCouple?.member_b)
}

// 로그인한 실사용자는 실제 커플 시작일을, 아직 둘러보는 중인 방문자는 데모용 시작일을 반환한다.
// 로그인은 했지만 아직 상대방과 완전히 연결되기 전이면 null(정보 없음)을 반환한다.
export function getEffectiveStartDate() {
  if (isLoggedIn()) {
    return isCoupleConnected() && cachedCouple?.start_date ? new Date(cachedCouple.start_date) : null
  }
  return new Date(MOCK_PROFILE.startDate.replace(/\./g, '-'))
}
