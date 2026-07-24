import { supabase } from './supabaseClient'

export function signInWithKakao() {
  if (!supabase) return Promise.reject(new Error('Supabase가 아직 설정되지 않았어요.'))
  return supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: window.location.origin + import.meta.env.BASE_URL,
      // account_email은 비즈 인증 없이는 카카오 앱에서 동의항목 자체가 열리지 않아
      // 기본 요청 스코프에 이메일이 섞여 있으면 카카오가 요청을 통째로 거부한다(KOE205).
      // 실제로 동의항목에 켜둔 스코프만 명시적으로 요청한다.
      scopes: 'profile_nickname profile_image',
    },
  })
}

export function signInWithGoogle() {
  if (!supabase) return Promise.reject(new Error('Supabase가 아직 설정되지 않았어요.'))
  return supabase.auth.signInWithOAuth({
    provider: 'google',
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
