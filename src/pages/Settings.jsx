import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Lock, Unlink, Download, MessageCircle, ChevronRight, User, X, LogOut } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import { isLoggedIn } from '../lib/authState'
import { getCachedProfile, refreshCoupleState } from '../lib/coupleState'
import { updateNickname } from '../lib/coupleStore'
import { signOut } from '../lib/auth'

const ROWS = [
  { Icon: Bell, label: '알림 설정' },
  { Icon: Lock, label: '비밀번호 변경' },
  { Icon: Unlink, label: '커플 연결 해제' },
  { Icon: Download, label: '데이터 백업' },
  { Icon: MessageCircle, label: '문의하기' },
]

export default function Settings() {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState(() => getCachedProfile()?.nickname || '')
  const [input, setInput] = useState(nickname)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const openEdit = () => {
    setInput(nickname)
    setError('')
    setEditing(true)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/signup', { replace: true })
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const saved = await updateNickname(input)
      await refreshCoupleState()
      setNickname(saved)
      setEditing(false)
      setToast('닉네임이 변경됐어요')
      setTimeout(() => setToast(''), 1800)
    } catch (err) {
      setError(err.message || '닉네임을 저장하지 못했어요.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="screen">
      <TopAppBar title="설정" onBack={() => navigate('/my')} />

      {isLoggedIn() && (
        <div className="card" style={{ margin: '4px 20px 16px', width: 'auto', padding: 0, overflow: 'hidden' }}>
          <button className="menu-row" style={{ width: '100%', background: 'none', textAlign: 'left' }} onClick={openEdit}>
            <User size={18} color="var(--main)" />
            <span className="menu-row-label">내 별명</span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{nickname || '설정 안 함'}</span>
            <ChevronRight size={16} className="menu-row-chevron" />
          </button>
        </div>
      )}

      <div className="card" style={{ margin: '4px 20px 16px', width: 'auto', padding: 0, overflow: 'hidden' }}>
        {ROWS.map(({ Icon, label }) => (
          <button key={label} className="menu-row" style={{ width: '100%', background: 'none', textAlign: 'left' }}>
            <Icon size={18} color="var(--main)" />
            <span className="menu-row-label">{label}</span>
            <ChevronRight size={16} className="menu-row-chevron" />
          </button>
        ))}
      </div>

      {isLoggedIn() && (
        <div className="card" style={{ margin: '4px 20px', width: 'auto', padding: 0, overflow: 'hidden' }}>
          <button className="menu-row" style={{ width: '100%', background: 'none', textAlign: 'left' }} onClick={handleLogout}>
            <LogOut size={18} color="var(--error)" />
            <span className="menu-row-label" style={{ color: 'var(--error)' }}>로그아웃</span>
          </button>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}

      {editing && (
        <div className="sheet-overlay" onClick={() => setEditing(false)}>
          <div className="sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <span className="sheet-title">내 별명 설정</span>
              <button className="topbar-icon-btn" onClick={() => setEditing(false)}><X size={18} /></button>
            </div>

            <label className="sheet-field-label">별명</label>
            <input
              className="field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예: 여자친구, 지현"
              maxLength={10}
              style={{ marginBottom: 16 }}
              autoFocus
            />
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
              "나의 소개서" 같은 화면 제목에 이 별명이 그대로 쓰여요.
            </p>

            {error && <p className="auth-notice" style={{ marginBottom: 12 }}>{error}</p>}

            <PrimaryButton onClick={handleSave} disabled={saving || !input.trim()}>
              {saving ? '저장 중...' : '저장'}
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  )
}
