import { supabase } from './supabaseClient'

export function signInWithKakao() {
  if (!supabase) return Promise.reject(new Error('Supabase가 아직 설정되지 않았어요.'))
  return supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: { redirectTo: window.location.origin + import.meta.env.BASE_URL },
  })
}

export function signOut() {
  if (!supabase) return Promise.resolve()
  return supabase.auth.signOut()
}

export function getSession() {
  if (!supabase) return Promise.resolve(null)
  return supabase.auth.getSession().then(({ data }) => data.session)
}

// callback(session | null) 형태로 로그인/로그아웃 시점마다 호출된다.
export function onAuthStateChange(callback) {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session))
  return () => data.subscription.unsubscribe()
}
