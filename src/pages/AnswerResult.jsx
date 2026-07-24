import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Lock, PartyPopper } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import AnswerCard from '../components/AnswerCard'
import { findCategory, findQuestion, getQuestionsByCategory } from '../lib/questions'
import { getAnswer } from '../lib/answersStore'
import { getMockPartnerAnswer } from '../data/mock'
import { isLiked, toggleLike } from '../lib/reactionsStore'

export default function AnswerResult() {
  const { categoryId, questionId } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('mine')
  const [likeVersion, setLikeVersion] = useState(0)
  const category = findCategory(categoryId)
  const question = findQuestion(questionId)
  const myAnswer = getAnswer(questionId)

  if (!category || !question || !myAnswer) return <div className="page-center"><p>아직 답변이 없어요.</p></div>

  const partnerAnswer = getMockPartnerAnswer(question)
  const bothDone = !!partnerAnswer

  const questions = getQuestionsByCategory(categoryId)
  const idx = questions.findIndex((q) => q.id === questionId)
  const next = questions[idx + 1]

  const handleLike = (who) => {
    toggleLike(questionId, who)
    setLikeVersion((v) => v + 1)
  }

  return (
    <div className="screen">
      <TopAppBar title="답변 결과" onBack={() => navigate(`/qna/${categoryId}/${questionId}`)} />

      <div className="result-banner">
        <PartyPopper size={22} color="var(--main)" />
        <div className="result-banner-title" style={{ marginTop: 6 }}>
          {bothDone ? '둘 다 답변을 완료했어요!' : '내 답변을 저장했어요!'}
        </div>
        <div className="result-banner-sub">
          {bothDone ? '서로의 답변을 확인해보세요!' : '상대방이 답변하면 서로의 답변을 볼 수 있어요.'}
        </div>
      </div>

      <div className="result-tab-row">
        <button className={`result-tab ${tab === 'mine' ? 'result-tab-active' : ''}`} onClick={() => setTab('mine')}>내 답변</button>
        <button className={`result-tab ${tab === 'theirs' ? 'result-tab-active' : ''}`} onClick={() => setTab('theirs')}>상대 답변</button>
      </div>

      <AnswerCard
        key={`mine-${likeVersion}`}
        name="내가 쓴 답변"
        time={new Date(myAnswer.createdAt).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
        body={myAnswer.body}
        liked={isLiked(questionId, 'mine')}
        onToggleLike={() => handleLike('mine')}
      />

      {bothDone ? (
        <AnswerCard
          key={`theirs-${likeVersion}`}
          name="상대가 쓴 답변"
          time="방금"
          body={partnerAnswer}
          liked={isLiked(questionId, 'theirs')}
          onToggleLike={() => handleLike('theirs')}
        />
      ) : (
        <div className="card answer-card answer-card-locked">
          <Lock size={22} />
          <div className="answer-card-locked-title">상대방이 아직 답변하지 않았어요</div>
          <div className="answer-card-locked-desc">상대방이 답변을 완료하면 바로 확인할 수 있어요</div>
        </div>
      )}

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
