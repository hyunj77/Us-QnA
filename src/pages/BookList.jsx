import { useNavigate } from 'react-router-dom'
import { ChevronRight, Lock } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import { findCategory } from '../lib/questions'
import { BOOK_ENTRIES, getBookProgress } from '../lib/bookUtils'
import { isAdultVerified } from '../lib/adultGate'

export default function BookList() {
  const navigate = useNavigate()

  return (
    <div className="screen">
      <TopAppBar title="우리의 책" onBack={() => navigate('/memories')} />

      <div style={{ padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {BOOK_ENTRIES.map((entry) => {
          const category = findCategory(entry.categoryId)
          if (!category) return null
          const { done, total } = getBookProgress(entry.categoryId, entry.who)
          const locked = category.isAdult && !isAdultVerified()
          return (
            <button
              key={entry.bookId}
              className="card book-select-card"
              onClick={() => navigate(`/book/${entry.bookId}`)}
            >
              <span className="icon-badge" style={{ background: `${category.color}22`, fontSize: 22 }}>{category.emoji}</span>
              <div className="book-select-body">
                <div className="book-select-title">{entry.label}</div>
                <div className="book-select-desc">{done}/{total}개 답변 완료</div>
              </div>
              {locked ? <Lock size={16} color="var(--text-secondary)" /> : <ChevronRight size={16} className="menu-row-chevron" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
