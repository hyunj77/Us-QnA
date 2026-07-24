import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, X } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import CategoryChip from '../components/CategoryChip'
import TextField from '../components/TextField'
import { createPost } from '../lib/communityStore'
import { COMMUNITY_CATEGORIES, TAG_GROUPS } from '../data/communityCategories'
import { resizeImageFile } from '../lib/imageUtils'

export default function CommunityWrite() {
  const navigate = useNavigate()
  const [category, setCategory] = useState(COMMUNITY_CATEGORIES[1].key)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [opponentView, setOpponentView] = useState('')
  const [question, setQuestion] = useState('')
  const [photo, setPhoto] = useState('')
  const [tags, setTags] = useState([])
  const [showTagPicker, setShowTagPicker] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = title.trim().length > 0 && body.trim().length > 0 && !saving

  const toggleTag = (tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const dataUrl = await resizeImageFile(file, { maxDim: 1000, quality: 0.75 })
      setPhoto(dataUrl)
    } catch {
      setError('사진을 불러오지 못했어요.')
    }
  }

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSaving(true)
    setError('')
    try {
      const post = await createPost({ category, title, body, opponentView, question, photoDataUrl: photo, tags })
      navigate(`/community/board/${post.id}`, { replace: true })
    } catch (err) {
      setError(err.message || '글을 등록하지 못했어요.')
      setSaving(false)
    }
  }

  return (
    <div className="screen">
      <TopAppBar title="고민 글쓰기 (익명)" onBack={() => navigate('/community')} />

      <div style={{ padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <div className="compose-field-label">카테고리</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {COMMUNITY_CATEGORIES.map((c) => (
              <CategoryChip key={c.key} label={`${c.emoji} ${c.key}`} active={category === c.key} onClick={() => setCategory(c.key)} />
            ))}
          </div>
        </div>

        <div>
          <div className="compose-field-label">태그 <span className="compose-field-optional">(선택, 여러 개 가능)</span></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {tags.map((t) => (
              <CategoryChip key={t} label={t} active onClick={() => toggleTag(t)} />
            ))}
            <button type="button" className="chip" onClick={() => setShowTagPicker(true)}>+ 태그 추가</button>
          </div>
        </div>

        <div>
          <div className="compose-field-label">사진 <span className="compose-field-optional">(선택)</span></div>
          {photo ? (
            <div className="compose-photo-thumb" style={{ width: 100, height: 100 }}>
              <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button type="button" className="compose-photo-remove" onClick={() => setPhoto('')}>
                <X size={12} />
              </button>
            </div>
          ) : (
            <label className="compose-tool-btn" style={{ width: 'fit-content' }}>
              <Camera size={16} /> 사진 추가
              <input type="file" accept="image/*" onChange={handlePhotoSelect} style={{ display: 'none' }} />
            </label>
          )}
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

      {showTagPicker && (
        <div className="sheet-overlay" onClick={() => setShowTagPicker(false)}>
          <div className="sheet-card" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            <div className="sheet-head">
              <span className="sheet-title">태그 고르기</span>
              <button className="topbar-icon-btn" onClick={() => setShowTagPicker(false)}><X size={18} /></button>
            </div>

            {TAG_GROUPS.map((g) => (
              <div key={g.group} style={{ marginBottom: 16 }}>
                <div className="compose-field-label">{g.group}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {g.tags.map((t) => (
                    <CategoryChip key={t} label={t} active={tags.includes(t)} onClick={() => toggleTag(t)} />
                  ))}
                </div>
              </div>
            ))}

            <PrimaryButton onClick={() => setShowTagPicker(false)}>선택 완료 ({tags.length}개)</PrimaryButton>
          </div>
        </div>
      )}
    </div>
  )
}
