import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PartyPopper } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import AnswerCard from '../components/AnswerCard'
import { findCategory, findQuestion, getQuestionsByCategory } from '../lib/questions'
import { getAnswer } from '../lib/answersStore'

// 커플 연결 기능이 붙기 전까지 상대 답변은 예시 데이터로 보여준다.
const MOCK_PARTNER_ANSWER = '아침에 눈 떴을 때 네가 옆에 없을 때 가장 보고싶어!'

export default function AnswerResult() {
  const { categoryId, questionId } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('mine')
  const category = findCategory(categoryId)
  const question = findQuestion(questionId)
  const myAnswer = getAnswer(questionId)

  if (!category || !question || !myAnswer) return <div className="page-center"><p>아직 답변이 없어요.</p></div>

  const questions = getQuestionsByCategory(categoryId)
  const idx = questions.findIndex((q) => q.id === questionId)
  const next = questions[idx + 1]

  return (
    <div className="screen">
      <TopAppBar title="답변 결과" onBack={() => navigate(`/qna/${categoryId}/${questionId}`)} />

      <div className="result-banner">
        <PartyPopper size={22} color="var(--main)" />
        <div className="result-banner-title" style={{ marginTop: 6 }}>둘 다 답변을 완료했어요!</div>
        <div className="result-banner-sub">서로의 답변을 확인해보세요!</div>
      </div>

      <div className="result-tab-row">
        <button className={`result-tab ${tab === 'mine' ? 'result-tab-active' : ''}`} onClick={() => setTab('mine')}>내 답변</button>
        <button className={`result-tab ${tab === 'theirs' ? 'result-tab-active' : ''}`} onClick={() => setTab('theirs')}>상대 답변</button>
      </div>

      <AnswerCard name="내가 쓴 답변" time={new Date(myAnswer.createdAt).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })} body={myAnswer.body} />
      <AnswerCard name="상대가 쓴 답변" time="방금" body={MOCK_PARTNER_ANSWER} />

      <div style={{ padding: 20, marginTop: 'auto' }}>
        <PrimaryButton
          onClick={() => next ? navigate(`/qna/${categoryId}/${next.id}`) : navigate(`/qna/${categoryId}`)}
        >
          다음 질문 보기 →
        </PrimaryButton>
      </div>
    </div>
  )
}
