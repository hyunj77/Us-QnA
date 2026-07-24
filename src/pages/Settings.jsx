import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Unlink, Download, MessageCircle, ChevronRight, User, X, LogOut } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import { isLoggedIn } from '../lib/authState'
import { getCachedProfile, isCoupleConnected, refreshCoupleState } from '../lib/coupleState'
import { updateNickname, unlinkCouple } from '../lib/coupleStore'
import { signOut } from '../lib/auth'

export default function Settings() {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState(() => getCachedProfile()?.nickname || '')
  const [input, setInput] = useState(nickname)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [connected, setConnected] = useState(() => isCoupleConnected())

  const flashToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }

  const openEdit = () => {
    setInput(nickname)
    setError('')
    setEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const saved = await updateNickname(input)
      await refreshCoupleState()
      setNickname(saved)
      setEditing(false)
      flashToast('닉네임이 변경됐어요')
    } catch (err) {
      setError(err.message || '닉네임을 저장하지 못했어요.')
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationSettings = async () => {
    if (!('Notification' in window)) {
      flashToast('이 브라우저는 알림을 지원하지 않아요.')
      return
    }
    if (Notification.permission === 'granted') {
      flashToast('휴대폰 알림이 이미 켜져 있어요 🔔')
      return
    }
    if (Notification.permission === 'denied') {
      flashToast('브라우저 설정에서 알림 권한을 직접 허용해주셔야 해요.')
      return
    }
    const result = await Notification.requestPermission()
    flashToast(result === 'granted' ? '알림이 켜졌어요 🔔' : '알림을 허용하지 않으셨어요.')
  }

  const handleUnlink = async () => {
    if (!window.confirm('정말 커플 연결을 해제할까요? 다시 연결하려면 새 코드가 필요해요.')) return
    try {
      await unlinkCouple()
      await refreshCoupleState()
      setConnected(false)
      flashToast('커플 연결을 해제했어요.')
    } catch (err) {
      flashToast(err.message || '연결 해제에 실패했어요.')
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/signup', { replace: true })
  }

  const handleStub = (label) => flashToast(`${label}은(는) 아직 준비 중이에요.`)

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
        <button className="menu-row" style={{ width: '100%', background: 'none', textAlign: 'left' }} onClick={handleNotificationSettings}>
          <Bell size={18} color="var(--main)" />
          <span className="menu-row-label">알림 설정</span>
          <ChevronRight size={16} className="menu-row-chevron" />
        </button>
        {isLoggedIn() && connected && (
          <button className="menu-row" style={{ width: '100%', background: 'none', textAlign: 'left' }} onClick={handleUnlink}>
            <Unlink size={18} color="var(--main)" />
            <span className="menu-row-label">커플 연결 해제</span>
            <ChevronRight size={16} className="menu-row-chevron" />
          </button>
        )}
        <button className="menu-row" style={{ width: '100%', background: 'none', textAlign: 'left' }} onClick={() => handleStub('데이터 백업')}>
          <Download size={18} color="var(--main)" />
          <span className="menu-row-label">데이터 백업</span>
          <ChevronRight size={16} className="menu-row-chevron" />
        </button>
        <button className="menu-row" style={{ width: '100%', background: 'none', textAlign: 'left' }} onClick={() => handleStub('문의하기')}>
          <MessageCircle size={18} color="var(--main)" />
          <span className="menu-row-label">문의하기</span>
          <ChevronRight size={16} className="menu-row-chevron" />
        </button>
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
