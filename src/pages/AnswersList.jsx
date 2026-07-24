import { useNavigate, useParams } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import QuestionCard from '../components/QuestionCard'
import { QUESTIONS, findCategory } from '../lib/questions'
import { getAnswer, getAnsweredIds } from '../lib/answersStore'
import { getMockPartnerAnswer } from '../data/mock'

const TITLE = { mine: '내 답변 모아보기', partner: '상대 답변 모아보기' }
const EMPTY = {
  mine: { emoji: '📝', title: '아직 작성한 답변이 없어요.', desc: '문답에 답변하면 이곳에 모여요!' },
  partner: { emoji: '💌', title: '상대방 답변이 아직 없어요.', desc: '상대방이 답변을 완료하면 이곳에 모여요!' },
}

export default function AnswersList() {
  const { who } = useParams()
  const navigate = useNavigate()
  const answeredIds = getAnsweredIds()

  const questions = QUESTIONS.filter((q) => (who === 'mine' ? getAnswer(q.id) : getMockPartnerAnswer(q)))
  const empty = EMPTY[who] || EMPTY.mine

  return (
    <div className="screen">
      <TopAppBar title={TITLE[who] || '답변 모아보기'} onBack={() => navigate('/my')} />

      <div style={{ padding: '4px 20px 20px' }}>
        {questions.length > 0 ? (
          questions.map((q) => {
            const cat = findCategory(q.categoryId)
            return (
              <QuestionCard
                key={q.id}
                emoji={cat?.emoji}
                iconBg={cat ? `${cat.color}22` : undefined}
                title={q.question}
                desc={cat?.label}
                done={who === 'mine' ? true : answeredIds.has(q.id)}
                onClick={() => navigate(`/qna/${q.categoryId}/${q.id}`)}
              />
            )
          })
        ) : (
          <div className="empty-state">
            <div className="empty-state-emoji">{empty.emoji}</div>
            <div className="empty-state-title">{empty.title}</div>
            <div className="empty-state-desc">{empty.desc}</div>
          </div>
        )}
      </div>
    </div>
  )
}
