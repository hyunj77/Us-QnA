import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'
import CategoryChip from '../components/CategoryChip'
import QuestionCard from '../components/QuestionCard'
import { findCategory, getQuestionsByCategory, getSubGroups } from '../lib/questions'
import { getAnsweredIds } from '../lib/answersStore'

const ROW_ICONS = ['❤️', '💫', '🎬', '🍴', '⭐', '🎨', '🐰', '🎵', '💌', '🌙']
function pickIcon(id) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return ROW_ICONS[hash % ROW_ICONS.length]
}

export default function QnAQuestionList() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const category = findCategory(categoryId)
  const [activeSub, setActiveSub] = useState('전체')
  const answeredIds = getAnsweredIds()

  const subGroups = useMemo(() => getSubGroups(categoryId).filter(Boolean), [categoryId])
  const questions = getQuestionsByCategory(categoryId)
  const shown = activeSub === '전체' ? questions : questions.filter((q) => q.sub === activeSub)

  if (!category) return <div className="page-center"><p>존재하지 않는 카테고리예요.</p></div>

  return (
    <div className="screen">
      <TopAppBar
        title={category.label}
        onBack={() => navigate('/qna')}
        right={<button className="topbar-icon-btn" onClick={() => navigate('/qna/search')}><Search size={20} /></button>}
      />

      {subGroups.length > 0 && (
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 16px', overflowX: 'auto' }}>
          <CategoryChip label="전체" active={activeSub === '전체'} onClick={() => setActiveSub('전체')} />
          {subGroups.map((sub) => (
            <CategoryChip key={sub} label={sub} active={activeSub === sub} onClick={() => setActiveSub(sub)} />
          ))}
        </div>
      )}

      <div className="q-list-meta" style={{ padding: '0 20px 8px' }}>
        <span>{shown.length}개의 질문</span>
        <span>최신순</span>
      </div>

      <div style={{ padding: '0 20px' }}>
        {shown.map((q) => (
          <QuestionCard
            key={q.id}
            emoji={pickIcon(q.id)}
            title={q.title}
            desc={q.sub}
            done={answeredIds.has(q.id)}
            onClick={() => navigate(`/qna/${categoryId}/${q.id}`)}
          />
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
