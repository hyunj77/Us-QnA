import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Bot, Scale, X } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import LoveJudgmentCard from '../components/LoveJudgmentCard'
import { getPost, getComments, addComment, toggleReaction, hasReacted, canPost } from '../lib/communityStore'
import { getJudgment, requestJudgment } from '../lib/loveJudgeStore'
import { REACTIONS, JUDGE_STYLES } from '../data/communityCategories'
import { isLoggedIn } from '../lib/authState'

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diffMs / 60000)
  if (min < 1) return '방금'
  if (min < 60) return `${min}분 전`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}시간 전`
  return `${Math.floor(hr / 24)}일 전`
}

export default function CommunityPostDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentBody, setCommentBody] = useState('')
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState('')

  const [judgment, setJudgment] = useState(null)
  const [judging, setJudging] = useState(false)
  const [notReady, setNotReady] = useState(false)
  const [pickingStyle, setPickingStyle] = useState(false)

  const load = () => {
    Promise.all([getPost(postId), getComments(postId), getJudgment(postId)]).then(([p, c, j]) => {
      setPost(p)
      setComments(c)
      setJudgment(j)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  const flashToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }

  const handleReact = async (kind) => {
    if (!isLoggedIn()) {
      flashToast('로그인 후 반응할 수 있어요')
      return
    }
    const next = await toggleReaction(postId, kind, post.reactions)
    setPost((p) => ({ ...p, reactions: next }))
  }

  const handleAddComment = async () => {
    if (!commentBody.trim() || sending) return
    setSending(true)
    try {
      await addComment(postId, commentBody)
      setCommentBody('')
      load()
    } catch (err) {
      flashToast(err.message || '댓글을 등록하지 못했어요.')
    } finally {
      setSending(false)
    }
  }

  const handleRequestJudgment = async (judgeStyle) => {
    setPickingStyle(false)
    setJudging(true)
    setNotReady(false)
    try {
      const result = await requestJudgment(postId, judgeStyle)
      setJudgment(result)
    } catch (err) {
      if (err.notConfigured) setNotReady(true)
      else flashToast(err.message || 'AI 판결을 받지 못했어요.')
    } finally {
      setJudging(false)
    }
  }

  if (loading) return <div className="page-center"><p>불러오는 중...</p></div>
  if (!post) return <div className="page-center"><p>존재하지 않는 게시글이에요.</p></div>

  return (
    <div className="screen">
      <TopAppBar title={post.category} onBack={() => navigate('/community')} />

      <div style={{ padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{post.title}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
            {post.author_nickname} · {timeAgo(post.created_at)}
          </div>
        </div>

        {post.photo_url && (
          <img src={post.photo_url} alt="" style={{ width: '100%', borderRadius: 'var(--r-lg)', objectFit: 'cover' }} />
        )}

        <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{post.body}</p>

        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {post.tags.map((t) => (
              <span key={t} className="chip" style={{ minHeight: 'auto', padding: '5px 12px' }}>{t}</span>
            ))}
          </div>
        )}

        {post.opponent_view && (
          <div className="card" style={{ background: 'var(--bg)' }}>
            <div className="compose-field-label" style={{ marginBottom: 6 }}>상대방 입장</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{post.opponent_view}</p>
          </div>
        )}

        {post.question && (
          <div className="card" style={{ background: 'var(--bg)' }}>
            <div className="compose-field-label" style={{ marginBottom: 6 }}>궁금한 점</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{post.question}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {REACTIONS.map((r) => (
            <button
              key={r.kind}
              className={`reaction-btn ${hasReacted(postId, r.kind) ? 'reaction-btn-active' : ''}`}
              onClick={() => handleReact(r.kind)}
            >
              <span>{r.emoji}</span>
              <span>{post.reactions?.[r.kind] || 0}</span>
            </button>
          ))}
        </div>

        {judgment ? (
          <LoveJudgmentCard judgment={judgment} />
        ) : notReady ? (
          <div className="judge-not-ready">⚖️ AI 판결 기능은 아직 준비 중이에요.</div>
        ) : (
          <button className="poke-card" onClick={() => setPickingStyle(true)} disabled={judging}>
            <span className="icon-badge" style={{ background: '#0F1E3D', fontSize: 18 }}>⚖️</span>
            <div className="poke-card-body">
              <div className="poke-card-title" style={{ fontSize: 15 }}>{judging ? 'AI가 판결문을 작성하는 중...' : 'AI 판결 받기'}</div>
              <div className="poke-card-desc">AI 판사가 객관적으로 이 상황을 분석해드려요</div>
            </div>
          </button>
        )}

        <div>
          <div className="section-head">
            <span className="section-title">댓글 {comments.length}</span>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              className="field"
              style={{ flex: 1 }}
              placeholder={canPost() ? '댓글을 남겨보세요' : '로그인 후 댓글을 남길 수 있어요'}
              value={commentBody}
              disabled={!canPost()}
              maxLength={500}
              onChange={(e) => setCommentBody(e.target.value)}
            />
            <button className="btn-secondary" style={{ width: 72, height: 44, flexShrink: 0 }} disabled={!canPost() || !commentBody.trim() || sending} onClick={handleAddComment}>
              등록
            </button>
          </div>

          {comments.map((c) => (
            <div key={c.id} className="card" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
                  {c.is_ai && <Bot size={13} style={{ marginRight: 4, verticalAlign: -2 }} />}
                  {c.author_nickname}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{timeAgo(c.created_at)}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text)', marginTop: 6, lineHeight: 1.6 }}>{c.body}</p>
              <button
                className="btn-text"
                style={{ marginTop: 8, fontSize: 12 }}
                onClick={() => flashToast('AI 답변 기능은 아직 준비 중이에요.')}
              >
                <Bot size={12} style={{ marginRight: 3, verticalAlign: -2 }} />AI 답변
              </button>
            </div>
          ))}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}

      {pickingStyle && (
        <div className="sheet-overlay" onClick={() => setPickingStyle(false)}>
          <div className="sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <span className="sheet-title"><Scale size={16} style={{ marginRight: 6, verticalAlign: -3 }} />판사 스타일 선택</span>
              <button className="topbar-icon-btn" onClick={() => setPickingStyle(false)}><X size={18} /></button>
            </div>

            <div className="judge-style-row">
              {JUDGE_STYLES.map((s) => (
                <button key={s.id} type="button" className="judge-style-btn" onClick={() => handleRequestJudgment(s.id)}>
                  <span className="judge-style-label">{s.emoji} {s.label}</span>
                  <span className="judge-style-desc">{s.desc}</span>
                </button>
              ))}
            </div>

            <PrimaryButton style={{ marginTop: 16 }} onClick={() => handleRequestJudgment('warm')}>
              그냥 기본 판사로 받기
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  )
}
