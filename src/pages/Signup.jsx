import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithKakao, signInWithGoogle } from '../lib/auth'
import { isSupabaseConfigured } from '../lib/supabaseClient'

const SOCIALS = [
  { id: 'kakao', label: '카카오', emoji: '💬', bg: '#FEE500', fg: '#3A2929', onSignIn: signInWithKakao },
  { id: 'google', label: '구글', emoji: 'G', bg: '#fff', fg: '#3A2B30', onSignIn: signInWithGoogle },
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
              style={{ background: s.bg, color: s.fg }}
              onClick={() => (isSupabaseConfigured ? s.onSignIn() : navigate('/home'))}
              title={isSupabaseConfigured ? `${s.label}로 시작하기` : `${s.label} (준비 중 - 화면 검토용으로 바로 진입)`}
            >
              {s.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
