import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Send, X } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import { getAllLetters, sendLetter, canWriteLetter } from '../lib/letterStore'

function formatDate(iso) {
  return new Date(iso).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function LetterBox() {
  const navigate = useNavigate()
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [composing, setComposing] = useState(false)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const load = () => {
    setLoading(true)
    getAllLetters().then((data) => {
      setLetters(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  const handleSend = async () => {
    if (!body.trim() || sending) return
    setSending(true)
    setError('')
    try {
      await sendLetter(body)
      setBody('')
      setComposing(false)
      setToast('💌 편지를 보냈어요')
      setTimeout(() => setToast(''), 1800)
      load()
    } catch (err) {
      setError(err.message || '편지를 보내지 못했어요.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="screen">
      <TopAppBar
        title="편지함"
        onBack={() => navigate('/memories')}
        right={
          canWriteLetter() && (
            <button className="topbar-icon-btn" onClick={() => setComposing(true)}>
              <Send size={19} />
            </button>
          )
        }
      />

      <div style={{ padding: '4px 20px 20px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 40 }}>불러오는 중...</p>
        ) : letters.length > 0 ? (
          letters.map((letter) => (
            <div key={letter.id} className="letter-card">
              <div className="letter-card-head">
                <span className="letter-card-tag" style={{ background: letter.direction === 'sent' ? 'var(--sub)' : '#E3F5E0', color: letter.direction === 'sent' ? 'var(--main)' : '#2F9E44' }}>
                  {letter.direction === 'sent' ? '보낸 편지' : '받은 편지'}
                </span>
                <span className="letter-card-time">{formatDate(letter.created_at)}</span>
              </div>
              <p className="letter-card-body">{letter.body}</p>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-emoji">💌</div>
            <div className="empty-state-title">아직 편지가 없어요.</div>
            <div className="empty-state-desc">
              {canWriteLetter() ? '상대방에게 첫 편지를 보내보세요!' : '커플 연결 후 편지를 주고받을 수 있어요.'}
            </div>
            {canWriteLetter() && (
              <PrimaryButton onClick={() => setComposing(true)} style={{ marginTop: 16 }}>편지 쓰기</PrimaryButton>
            )}
          </div>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}

      {composing && (
        <div className="sheet-overlay" onClick={() => setComposing(false)}>
          <div className="sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <span className="sheet-title"><Mail size={16} style={{ marginRight: 6, verticalAlign: -3 }} />편지 쓰기</span>
              <button className="topbar-icon-btn" onClick={() => setComposing(false)}><X size={18} /></button>
            </div>

            <textarea
              className="compose-textarea"
              style={{ minHeight: 140 }}
              placeholder="상대방에게 전하고 싶은 마음을 적어보세요."
              value={body}
              maxLength={1000}
              onChange={(e) => setBody(e.target.value)}
              autoFocus
            />

            {error && <p className="auth-notice" style={{ marginTop: 12 }}>{error}</p>}

            <PrimaryButton onClick={handleSend} disabled={!body.trim() || sending} style={{ marginTop: 16 }}>
              {sending ? '보내는 중...' : '편지 보내기'}
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  )
}
