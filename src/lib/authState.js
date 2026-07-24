import { supabase } from './supabaseClient'

// 로그인 여부를 동기적으로 읽을 수 있게 캐싱한다.
// 컴포넌트 렌더 중간에 await 없이 "지금 로그인된 사용자인가?"를 바로 판단하기 위함.
let currentUser = null

export function isLoggedIn() {
  return !!currentUser
}

export function getCurrentUser() {
  return currentUser
}

if (supabase) {
  supabase.auth.getSession().then(({ data }) => {
    currentUser = data.session?.user || null
  })
  supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null
  })
}
