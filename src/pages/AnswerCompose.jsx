import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Camera, Smile, X } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import AdultGate from '../components/AdultGate'
import { findCategory, findQuestion, getQuestionsByCategory } from '../lib/questions'
import { getAnswer, saveAnswer } from '../lib/answersStore'
import { isAdultVerified } from '../lib/adultGate'
import { resizeImageFile } from '../lib/imageUtils'

const MAX_LEN = 500
const MAX_PHOTOS = 3
const EMOJI_PRESETS = ['❤️', '😍', '🥹', '😂', '😢', '👍', '🥰', '😳']

export default function AnswerCompose() {
  const { categoryId, questionId } = useParams()
  const navigate = useNavigate()
  const category = findCategory(categoryId)
  const question = findQuestion(questionId)
  const existing = getAnswer(questionId)
  const [body, setBody] = useState(existing?.body || '')
  const [photos, setPhotos] = useState(existing?.photos || [])
  const [showEmoji, setShowEmoji] = useState(false)
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [verified, setVerified] = useState(isAdultVerified())

  if (!category || !question) return <div className="page-center"><p>존재하지 않는 질문이에요.</p></div>

  if (question.isAdult && !verified) {
    return (
      <div className="screen">
        <TopAppBar title={category.label} onBack={() => navigate(`/qna/${categoryId}/${questionId}`)} />
        <AdultGate onVerified={() => setVerified(true)} onBack={() => navigate(`/qna/${categoryId}/${questionId}`)} />
      </div>
    )
  }

  const questions = getQuestionsByCategory(categoryId)
  const index = questions.findIndex((q) => q.id === questionId) + 1
  const hint = question.type === 'balance' ? '둘 중 하나를 골라주세요!' : '솔직하게 답변해주세요!'

  const handleSave = () => {
    if (body.trim().length < 1 || saving) return
    setSaving(true)
    setTimeout(() => {
      saveAnswer(questionId, body.trim(), photos)
      navigate(`/qna/${categoryId}/${questionId}`, { state: { justSaved: true } })
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
      <TopAppBar title={`${index}/${questions.length}`} onBack={() => navigate(`/qna/${categoryId}/${questionId}`)} />

      <div className="detail-breadcrumb" style={{ background: `${category.color}22`, color: category.color }}>
        {category.label}{question.subcategory ? ` · ${question.subcategory}` : ''}
      </div>
      <div className="detail-title" style={{ fontSize: 20 }}>{question.question}</div>
      <div className="detail-desc" style={{ marginBottom: 20 }}>{hint}</div>

      <div className="compose-wrap">
        <div className="compose-textarea-wrap">
          <textarea
            className="compose-textarea"
            placeholder="여기에 답변을 입력해주세요. 최소 10자 이상 입력해주세요."
            value={body}
            maxLength={MAX_LEN}
            onChange={(e) => setBody(e.target.value)}
            autoFocus
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

      <div className="fixed-bottom-bar">
        <PrimaryButton onClick={handleSave} disabled={body.trim().length < 1 || saving}>
          {saving ? '저장 중...' : '답변 저장'}
        </PrimaryButton>
      </div>
    </div>
  )
}
