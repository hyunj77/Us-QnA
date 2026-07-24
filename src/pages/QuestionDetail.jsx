import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Bookmark, Camera, Lock, Smile, X } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import AdultGate from '../components/AdultGate'
import { findCategory, findQuestion, getQuestionsByCategory, getCategoryDisplayLabel } from '../lib/questions'
import { getAnswer, saveAnswer } from '../lib/answersStore'
import { isAdultVerified } from '../lib/adultGate'
import { isBookmarked, toggleBookmark } from '../lib/bookmarkStore'
import { resizeImageFile } from '../lib/imageUtils'

const MAX_LEN = 500
const MAX_PHOTOS = 3
const EMOJI_PRESETS = ['❤️', '😍', '🥹', '😂', '😢', '👍', '🥰', '😳']

export default function QuestionDetail() {
  const { categoryId, questionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(questionId))
  const [toast, setToast] = useState(location.state?.justSaved ? '💗 답변이 저장되었습니다' : '')
  const [verified, setVerified] = useState(isAdultVerified())
  const category = findCategory(categoryId)
  const question = findQuestion(questionId)

  const existing = getAnswer(questionId)
  const [body, setBody] = useState(existing?.body || '')
  const [photos, setPhotos] = useState(existing?.photos || [])
  const [showEmoji, setShowEmoji] = useState(false)
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 1800)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    setBookmarked(isBookmarked(questionId))
    const current = getAnswer(questionId)
    setBody(current?.body || '')
    setPhotos(current?.photos || [])
  }, [questionId])

  if (!category || !question) return <div className="page-center"><p>존재하지 않는 질문이에요.</p></div>

  if (question.isAdult && !verified) {
    return (
      <div className="screen">
        <TopAppBar title={getCategoryDisplayLabel(category)} onBack={() => navigate(`/qna/${categoryId}`)} />
        <AdultGate onVerified={() => setVerified(true)} onBack={() => navigate(`/qna/${categoryId}`)} />
      </div>
    )
  }

  const questions = getQuestionsByCategory(categoryId)
  const index = questions.findIndex((q) => q.id === questionId) + 1
  const answered = !!getAnswer(questionId)
  const hint = question.type === 'balance' ? '둘 중 하나를 골라주세요!' : '솔직하게 답변해주세요!'

  const handleSave = () => {
    if (body.trim().length < 1 || saving) return
    setSaving(true)
    setTimeout(() => {
      saveAnswer(questionId, body.trim(), photos)
      setSaving(false)
      setToast('💗 답변이 저장되었습니다')
    }, 400)
  }

  const handlePhotoSelect = async (e) => {
    const allSelected = [...(e.target.files || [])]
    const files = allSelected.slice(0, MAX_PHOTOS - photos.length)
    e.target.value = ''
    if (files.length === 0) return
    setNotice(allSelected.length > files.length ? `사진은 최대 ${MAX_PHOTOS}장까지 첨부할 수 있어요.` : '')
    for (const file of files) {
      try {
        const dataUrl = await resizeImageFile(file)
        setPhotos((prev) => [...prev, dataUrl].slice(0, MAX_PHOTOS))
      } catch {
        setNotice('사진을 불러오지 못했어요.')
      }
    }
  }

  const removePhoto = (idx) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx))
  }

  const insertEmoji = (emoji) => {
    if (body.length >= MAX_LEN) return
    setBody((prev) => (prev + emoji).slice(0, MAX_LEN))
  }

  return (
    <div className="screen">
      <TopAppBar
        title={`${index}/${questions.length}`}
        onBack={() => navigate(`/qna/${categoryId}`)}
        right={
          <button
            className="topbar-icon-btn"
            onClick={() => {
              const next = toggleBookmark(questionId)
              setBookmarked(next)
              setToast(next ? '⭐ 즐겨찾기에 추가했어요' : '즐겨찾기를 해제했어요')
            }}
          >
            <Bookmark size={20} fill={bookmarked ? 'var(--main)' : 'none'} color={bookmarked ? 'var(--main)' : 'currentColor'} />
          </button>
        }
      />

      <div className="detail-breadcrumb" style={{ background: `${category.color}22`, color: category.color }}>
        {getCategoryDisplayLabel(category)}{question.subcategory ? ` · ${question.subcategory}` : ''}
      </div>
      <div className="detail-title">{question.question}</div>
      <div className="detail-desc">{hint}</div>

      <div className="detail-illustration">{category.emoji}</div>

      <div className="compose-wrap" style={{ padding: '4px 20px 20px' }}>
        <div className="compose-textarea-wrap">
          <textarea
            className="compose-textarea"
            placeholder="여기에 답변을 입력해주세요. 최소 10자 이상 입력해주세요."
            value={body}
            maxLength={MAX_LEN}
            onChange={(e) => setBody(e.target.value)}
          />
          <span className="compose-counter">{body.length}/{MAX_LEN}</span>
        </div>

        {photos.length > 0 && (
          <div className="compose-photo-row">
            {photos.map((src, idx) => (
              <div key={idx} className="compose-photo-thumb">
                <img src={src} alt="" />
                <button type="button" className="compose-photo-remove" onClick={() => removePhoto(idx)}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {showEmoji && (
          <div className="compose-emoji-row">
            {EMOJI_PRESETS.map((emoji) => (
              <button key={emoji} type="button" className="compose-emoji-btn" onClick={() => insertEmoji(emoji)}>
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="compose-tool-row">
          <label className="compose-tool-btn">
            <Camera size={16} /> 사진 추가{photos.length > 0 ? ` (${photos.length}/${MAX_PHOTOS})` : ''}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelect}
              disabled={photos.length >= MAX_PHOTOS}
              style={{ display: 'none' }}
            />
          </label>
          <button type="button" className="compose-tool-btn" onClick={() => setShowEmoji((v) => !v)}>
            <Smile size={16} /> 이모지
          </button>
        </div>

        {notice && <p className="auth-notice" style={{ margin: 0 }}>{notice}</p>}
      </div>

      <div className="fixed-bottom-spacer" />

      {toast && <div className="toast">{toast}</div>}

      <div className="fixed-bottom-bar">
        <div className="detail-actions">
          <PrimaryButton onClick={handleSave} disabled={body.trim().length < 1 || saving}>
            {saving ? '저장 중...' : answered ? '답변 수정 저장' : '답변 저장'}
          </PrimaryButton>
          <SecondaryButton
            disabled={!answered}
            onClick={() => answered && navigate(`/qna/${categoryId}/${questionId}/result`)}
          >
            <Lock size={14} style={{ marginRight: 4 }} /> 답변 결과 보기
          </SecondaryButton>
          <div className="detail-secondary-hint">둘 다 답변 완료 후 확인 가능해요</div>
        </div>
      </div>
    </div>
  )
}
