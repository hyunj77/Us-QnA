import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithKakao, signInWithGoogle } from '../lib/auth'
import { isSupabaseConfigured } from '../lib/supabaseClient'

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <ellipse cx="9" cy="7.8" rx="8.5" ry="6.8" fill="#3A2929" />
      <path d="M5.3 12.8 L3.6 16.6 L7.7 13.7 Z" fill="#3A2929" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.348 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  )
}

const SOCIALS = [
  { id: 'kakao', label: '카카오', Icon: KakaoIcon, bg: '#FEE500', onSignIn: signInWithKakao },
  { id: 'google', label: '구글', Icon: GoogleIcon, bg: '#fff', border: true, onSignIn: signInWithGoogle },
]

export default function Signup() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Supabase 프로젝트 연동 후 실제 회원가입/로그인 요청으로 교체 (지금은 화면 검토용으로 바로 진입)
    navigate('/home')
  }

  return (
    <div className="page-center">
      <div className="auth-page">
        <div className="auth-brand">
          <span className="auth-brand-logo">💌</span>
          <span className="auth-brand-name">우리 사용 설명서</span>
        </div>

        <div className="auth-card">
          <div className="auth-tab-row">
            <button
              type="button"
              className={`auth-tab ${tab === 'signup' ? 'auth-tab-active' : ''}`}
              onClick={() => setTab('signup')}
            >회원가입</button>
            <button
              type="button"
              className={`auth-tab ${tab === 'login' ? 'auth-tab-active' : ''}`}
              onClick={() => setTab('login')}
            >로그인</button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              className="field"
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="field"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {tab === 'signup' && (
              <input
                className="field"
                type="password"
                placeholder="비밀번호 확인"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            )}
            <button className="btn-primary" type="submit">{tab === 'signup' ? '가입하기' : '로그인'}</button>
          </form>

          <div className="auth-social-caption">또는</div>
          <div className="auth-social-row">
            {SOCIALS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="auth-social-btn"
                style={{ background: s.bg, border: s.border ? '1px solid var(--divider)' : 'none' }}
                onClick={() => (isSupabaseConfigured ? s.onSignIn() : navigate('/home'))}
                title={isSupabaseConfigured ? `${s.label}로 시작하기` : `${s.label} (준비 중 - 화면 검토용으로 바로 진입)`}
              >
                <s.Icon />
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-text"
            style={{ display: 'block', margin: '20px auto 0' }}
            onClick={() => navigate('/home')}
          >
            비회원으로 둘러보기
          </button>
        </div>
      </div>
    </div>
  )
}
