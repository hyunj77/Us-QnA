import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Bookmark, Lock } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import { findCategory, findQuestion, getQuestionsByCategory } from '../lib/questions'
import { getAnswer } from '../lib/answersStore'

export default function QuestionDetail() {
  const { categoryId, questionId } = useParams()
  const navigate = useNavigate()
  const [bookmarked, setBookmarked] = useState(false)
  const category = findCategory(categoryId)
  const question = findQuestion(questionId)

  if (!category || !question) return <div className="page-center"><p>존재하지 않는 질문이에요.</p></div>

  const questions = getQuestionsByCategory(categoryId)
  const index = questions.findIndex((q) => q.id === questionId) + 1
  const answered = !!getAnswer(questionId)
  const hint = question.type === 'choice' ? '둘 중 하나를 골라주세요!' : '솔직하게 답변해주세요!'

  return (
    <div className="screen">
      <TopAppBar
        title={`${index}/${questions.length}`}
        onBack={() => navigate(`/qna/${categoryId}`)}
        right={
          <button className="topbar-icon-btn" onClick={() => setBookmarked((v) => !v)}>
            <Bookmark size={20} fill={bookmarked ? 'var(--main)' : 'none'} color={bookmarked ? 'var(--main)' : 'currentColor'} />
          </button>
        }
      />

      <div className="detail-breadcrumb">{category.label}{question.sub ? ` · ${question.sub}` : ''}</div>
      <div className="detail-title">{question.title}</div>
      <div className="detail-desc">{hint}</div>

      <div className="detail-illustration">{category.emoji}</div>

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
  )
}
