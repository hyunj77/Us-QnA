import { useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import QuestionCard from '../components/QuestionCard'
import { findQuestion, findCategory } from '../lib/questions'
import { getAnsweredIds } from '../lib/answersStore'
import { getBookmarkedIds } from '../lib/bookmarkStore'

export default function BookmarksList() {
  const navigate = useNavigate()
  const answeredIds = getAnsweredIds()
  const questions = getBookmarkedIds()
    .map((id) => findQuestion(id))
    .filter(Boolean)

  return (
    <div className="screen">
      <TopAppBar title="즐겨찾기" onBack={() => navigate('/my')} />

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
                done={answeredIds.has(q.id)}
                onClick={() => navigate(`/qna/${q.categoryId}/${q.id}`)}
              />
            )
          })
        ) : (
          <div className="empty-state">
            <div className="empty-state-emoji">⭐</div>
            <div className="empty-state-title">즐겨찾기한 질문이 없어요.</div>
            <div className="empty-state-desc">질문 화면 오른쪽 위 북마크 버튼을 눌러 저장해보세요!</div>
          </div>
        )}
      </div>
    </div>
  )
}
