import { useNavigate } from 'react-router-dom'

export default function AIQuestionRecommendationCard({ lead, questions }) {
  const navigate = useNavigate()

  return (
    <div className="card report-card">
      <div className="report-card-head">
        <span className="report-card-emoji">💡</span>
        <span className="report-card-title">AI 추천 질문</span>
      </div>

      {lead && questions.length > 0 ? (
        <>
          <div className="report-reco-lead">💡 {lead}</div>
          <div>
            {questions.map((q) => (
              <button
                key={q.id}
                type="button"
                className="report-reco-question"
                onClick={() => navigate(`/qna/${q.categoryId}/${q.id}`)}
              >
                <span>{q.question}</span>
                <span style={{ color: 'var(--main)', flexShrink: 0 }}>›</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="report-empty-hint">답변을 더 남기면 다음에 답하면 좋을 질문을 추천해드려요.</p>
      )}
    </div>
  )
}
