import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import CategoryChip from '../components/CategoryChip'
import TextField from '../components/TextField'
import { createPost } from '../lib/communityStore'
import { COMMUNITY_CATEGORIES } from '../data/communityCategories'

export default function CommunityWrite() {
  const navigate = useNavigate()
  const [category, setCategory] = useState(COMMUNITY_CATEGORIES[1])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [opponentView, setOpponentView] = useState('')
  const [question, setQuestion] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = title.trim().length > 0 && body.trim().length > 0 && !saving

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSaving(true)
    setError('')
    try {
      const post = await createPost({ category, title, body, opponentView, question })
      navigate(`/community/board/${post.id}`, { replace: true })
    } catch (err) {
      setError(err.message || '글을 등록하지 못했어요.')
      setSaving(false)
    }
  }

  return (
    <div className="screen">
      <TopAppBar title="고민 글쓰기" onBack={() => navigate('/community/board')} />

      <div style={{ padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <div className="compose-field-label">카테고리</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {COMMUNITY_CATEGORIES.map((c) => (
              <CategoryChip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
            ))}
          </div>
        </div>

        <div>
          <div className="compose-field-label">제목</div>
          <TextField
            placeholder="고민을 한 줄로 요약해주세요"
            value={title}
            maxLength={60}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <div className="compose-field-label">상황 설명</div>
          <textarea
            className="compose-textarea"
            style={{ minHeight: 120 }}
            placeholder="어떤 상황인지 자세히 적어주세요."
            value={body}
            maxLength={2000}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div>
          <div className="compose-field-label">상대방 입장 <span className="compose-field-optional">(선택)</span></div>
          <textarea
            className="compose-textarea"
            style={{ minHeight: 80 }}
            placeholder="상대방은 어떻게 생각할 것 같은지 적어주세요."
            value={opponentView}
            maxLength={1000}
            onChange={(e) => setOpponentView(e.target.value)}
          />
        </div>

        <div>
          <div className="compose-field-label">내가 궁금한 점 <span className="compose-field-optional">(선택)</span></div>
          <textarea
            className="compose-textarea"
            style={{ minHeight: 80 }}
            placeholder="어떤 조언을 듣고 싶은지 적어주세요."
            value={question}
            maxLength={500}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        {error && <p className="auth-notice" style={{ margin: 0 }}>{error}</p>}

        <PrimaryButton onClick={handleSubmit} disabled={!canSubmit}>
          {saving ? '등록하는 중...' : '글 등록하기'}
        </PrimaryButton>
      </div>
    </div>
  )
}
