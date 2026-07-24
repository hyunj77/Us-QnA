import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import QuestionCard from '../components/QuestionCard'
import { searchQuestions, findCategory } from '../lib/questions'
import { getAnsweredIds } from '../lib/answersStore'

export default function QnASearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const answeredIds = getAnsweredIds()
  const results = searchQuestions(query)

  return (
    <div className="screen">
      <TopAppBar title="질문 검색" onBack={() => navigate(-1)} />

      <div style={{ padding: '0 20px 16px', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 34, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          className="field"
          style={{ paddingLeft: 38 }}
          placeholder="질문 검색하기"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div style={{ padding: '0 20px' }}>
        {query.trim() && results.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: 40 }}>검색 결과가 없어요.</p>
        )}
        {results.map((q) => {
          const cat = findCategory(q.categoryId)
          return (
            <QuestionCard
              key={q.id}
              emoji={cat?.emoji}
              title={q.question}
              desc={cat?.label}
              done={answeredIds.has(q.id)}
              onClick={() => navigate(`/qna/${q.categoryId}/${q.id}`)}
            />
          )
        })}
      </div>
    </div>
  )
}
