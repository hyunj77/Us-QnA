import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy } from 'lucide-react'
import PrimaryButton from '../components/PrimaryButton'
import { createInviteCode, joinByCode, getCoupleByCode } from '../lib/coupleStore'
import { signOut } from '../lib/auth'
import { refreshCoupleState } from '../lib/coupleState'
import { subscribePokes } from '../lib/pokeStore'

const POLL_INTERVAL_MS = 3000

export default function CoupleConnect() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('create')
  const [myCode, setMyCode] = useState('')
  const [inputCode, setInputCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    try {
      const couple = await createInviteCode()
      setMyCode(couple.invite_code)
      await refreshCoupleState()
      subscribePokes()
    } catch (err) {
      setError(err.message || '코드를 만들지 못했어요.')
    } finally {
      setLoading(false)
    }
  }

  // 코드를 만들고 대기하는 동안, 상대방이 그 사이에 입장했는지 주기적으로 확인해서
  // 연결되면 자동으로 홈으로 넘어간다.
  useEffect(() => {
    if (!myCode) return undefined
    const interval = setInterval(async () => {
      const couple = await getCoupleByCode(myCode)
      if (couple?.member_b) {
        clearInterval(interval)
        await refreshCoupleState()
        subscribePokes()
        navigate('/home', { replace: true })
      }
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [myCode, navigate])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(myCode)
      setToast('📋 코드가 복사되었어요')
      setTimeout(() => setToast(''), 1800)
    } catch {
      setToast('복사에 실패했어요')
      setTimeout(() => setToast(''), 1800)
    }
  }

  const handleJoin = async () => {
    if (inputCode.trim().length < 4) return
    setLoading(true)
    setError('')
    try {
      await joinByCode(inputCode)
      await refreshCoupleState()
      subscribePokes()
      navigate('/home', { replace: true })
    } catch (err) {
      setError(err.message || '연결하지 못했어요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center" style={{ position: 'relative' }}>
      <button
        type="button"
        className="topbar-icon-btn"
        style={{ position: 'absolute', top: 16, left: 16 }}
        onClick={() => navigate('/home')}
      >
        <ArrowLeft size={20} />
      </button>

      <div className="auth-page">
        <div className="auth-brand">
          <span className="auth-brand-logo">💌</span>
          <span className="auth-brand-name">커플 연결하기</span>
        </div>

        <div className="auth-card">
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 20 }}>
            상대방과 연결해야 서로의 답변을 주고받을 수 있어요
          </p>

          <div className="auth-tab-row">
            <button
              type="button"
              className={`auth-tab ${tab === 'create' ? 'auth-tab-active' : ''}`}
              onClick={() => setTab('create')}
            >코드 만들기</button>
            <button
              type="button"
              className={`auth-tab ${tab === 'join' ? 'auth-tab-active' : ''}`}
              onClick={() => setTab('join')}
            >코드 입력하기</button>
          </div>

          {tab === 'create' ? (
            <div className="auth-form">
              {myCode ? (
                <>
                  <div className="couple-code-display">{myCode}</div>
                  <button type="button" className="btn-secondary" onClick={handleCopy}>
                    <Copy size={15} style={{ marginRight: 6 }} /> 코드 복사하기
                  </button>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
                    이 코드를 상대방에게 보내주세요. 상대방이 코드를 입력하면 자동으로 연결돼요.
                  </p>
                  <PrimaryButton onClick={() => navigate('/home', { replace: true })}>나중에 연결하고 홈으로</PrimaryButton>
                </>
              ) : (
                <PrimaryButton onClick={handleCreate} disabled={loading}>
                  {loading ? '만드는 중...' : '초대 코드 만들기'}
                </PrimaryButton>
              )}
            </div>
          ) : (
            <div className="auth-form">
              <input
                className="field"
                placeholder="상대방 코드 입력 (예: AB29F3)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <PrimaryButton onClick={handleJoin} disabled={loading || inputCode.trim().length < 4}>
                {loading ? '연결하는 중...' : '연결하기'}
              </PrimaryButton>
            </div>
          )}

          {error && <p className="auth-notice" style={{ marginTop: 14 }}>{error}</p>}

          <button
            type="button"
            className="btn-text"
            style={{ display: 'block', margin: '20px auto 0' }}
            onClick={() => signOut().then(() => navigate('/signup', { replace: true }))}
          >
            다른 계정으로 로그인
          </button>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
