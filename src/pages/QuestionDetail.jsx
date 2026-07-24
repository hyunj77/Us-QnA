import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Bookmark, Lock } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import AdultGate from '../components/AdultGate'
import { findCategory, findQuestion, getQuestionsByCategory } from '../lib/questions'
import { getAnswer } from '../lib/answersStore'
import { isAdultVerified } from '../lib/adultGate'
import { isBookmarked, toggleBookmark } from '../lib/bookmarkStore'

export default function QuestionDetail() {
  const { categoryId, questionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(questionId))
  const [toast, setToast] = useState(location.state?.justSaved ? '💗 답변이 저장되었습니다' : '')
  const [verified, setVerified] = useState(isAdultVerified())
  const category = findCategory(categoryId)
  const question = findQuestion(questionId)

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 1800)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    setBookmarked(isBookmarked(questionId))
  }, [questionId])

  if (!category || !question) return <div className="page-center"><p>존재하지 않는 질문이에요.</p></div>

  if (question.isAdult && !verified) {
    return (
      <div className="screen">
        <TopAppBar title={category.label} onBack={() => navigate(`/qna/${categoryId}`)} />
        <AdultGate onVerified={() => setVerified(true)} onBack={() => navigate(`/qna/${categoryId}`)} />
      </div>
    )
  }

  const questions = getQuestionsByCategory(categoryId)
  const index = questions.findIndex((q) => q.id === questionId) + 1
  const answered = !!getAnswer(questionId)
  const hint = question.type === 'balance' ? '둘 중 하나를 골라주세요!' : '솔직하게 답변해주세요!'

  return (
    <div className="screen">
      <TopAppBar
        title={`${index}/${questions.length}`}
        onBack={() => navigate(`/qna/${categoryId}`)}
        right={
          <button className="topbar-icon-btn" onClick={() => setBookmarked(toggleBookmark(questionId))}>
            <Bookmark size={20} fill={bookmarked ? 'var(--main)' : 'none'} color={bookmarked ? 'var(--main)' : 'currentColor'} />
          </button>
        }
      />

      <div className="detail-breadcrumb" style={{ background: `${category.color}22`, color: category.color }}>
        {category.label}{question.subcategory ? ` · ${question.subcategory}` : ''}
      </div>
      <div className="detail-title">{question.question}</div>
      <div className="detail-desc">{hint}</div>

      <div className="detail-illustration">{category.emoji}</div>

      <div className="fixed-bottom-spacer" />

      {toast && <div className="toast">{toast}</div>}

      <div className="fixed-bottom-bar">
        <div className="detail-actions">
          <PrimaryButton onClick={() => navigate(`/qna/${categoryId}/${questionId}/answer`)}>
            {answered ? '답변 수정하기' : '답변하기'}
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
