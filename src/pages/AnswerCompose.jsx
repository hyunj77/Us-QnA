import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Camera, Smile } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import AdultGate from '../components/AdultGate'
import { findCategory, findQuestion, getQuestionsByCategory } from '../lib/questions'
import { getAnswer, saveAnswer } from '../lib/answersStore'
import { isAdultVerified } from '../lib/adultGate'

const MAX_LEN = 500

export default function AnswerCompose() {
  const { categoryId, questionId } = useParams()
  const navigate = useNavigate()
  const category = findCategory(categoryId)
  const question = findQuestion(questionId)
  const existing = getAnswer(questionId)
  const [body, setBody] = useState(existing?.body || '')
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
      saveAnswer(questionId, body.trim())
      navigate(`/qna/${categoryId}/${questionId}`, { state: { justSaved: true } })
    }, 400)
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

        <div className="compose-tool-row">
          <button type="button" className="compose-tool-btn" onClick={() => setNotice('사진 첨부는 준비 중이에요.')}>
            <Camera size={16} /> 사진 추가
          </button>
          <button type="button" className="compose-tool-btn" onClick={() => setNotice('이모지 선택은 준비 중이에요.')}>
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
